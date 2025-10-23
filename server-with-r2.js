/**
 * 通义万相API代理服务器 + Cloudflare R2存储
 * 将生成的图片上传到R2并返回永久链接
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3000;

// 通义万相API配置
const TONGYI_API_KEY = process.env.TONGYI_API_KEY;
const TONGYI_ENDPOINT = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis';
const TASK_ENDPOINT = 'https://dashscope.aliyuncs.com/api/v1/tasks';

// R2存储配置
const R2_CONFIG = {
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
    }
};

const s3Client = new S3Client(R2_CONFIG);
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || process.env.R2_ENDPOINT;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// 健康检查
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: '通义万相代理服务器运行中（已启用R2存储）',
        r2: {
            bucket: R2_BUCKET_NAME,
            endpoint: process.env.R2_ENDPOINT
        }
    });
});

// 提交图片生成任务并上传到R2
app.post('/api/tongyi/generate', async (req, res) => {
    const { prompt, negativePrompt, size = '1024*1024', count = 1, seed } = req.body;
    
    console.log('📝 收到生成请求:', { prompt, size, count });
    
    try {
        // 构建请求数据
        const payload = {
            model: "wanx-v1",
            input: {
                prompt: prompt
            },
            parameters: {
                size: size.replace('x', '*'),
                n: Math.min(count, 4)
            }
        };
        
        if (negativePrompt) {
            payload.input.negative_prompt = negativePrompt;
        }
        
        if (seed) {
            payload.parameters.seed = seed;
        }
        
        console.log('🚀 提交任务到通义万相...');
        
        // 提交任务（异步模式）
        const response = await axios.post(TONGYI_ENDPOINT, payload, {
            headers: {
                'Authorization': `Bearer ${TONGYI_API_KEY}`,
                'Content-Type': 'application/json',
                'X-DashScope-Async': 'enable'
            }
        });
        
        const taskId = response.data.output.task_id;
        console.log('✅ 任务已提交，Task ID:', taskId);
        
        // 轮询获取结果
        const result = await pollTaskResult(taskId);
        
        console.log('🎨 图片生成成功');
        
        // 检查R2是否正确配置了公开访问
        const useR2 = R2_PUBLIC_URL && R2_PUBLIC_URL.includes('r2.dev');
        
        if (!useR2) {
            console.log('ℹ️  R2未配置公开域名，使用通义万相临时URL');
            
            // 直接使用通义万相的URL（24小时有效）
            const images = result.results.map((item, index) => ({
                url: item.url,
                originalUrl: item.url,
                prompt: prompt,
                timestamp: new Date().toISOString(),
                storage: 'tongyi-temp',
                note: '临时链接，24小时有效'
            }));
            
            res.json({
                success: true,
                images: images,
                taskId: taskId,
                note: '使用临时链接，如需永久保存请配置R2公开域名'
            });
            return;
        }
        
        console.log('🎨 开始上传到R2...');
        
        // 上传所有图片到R2
        const uploadedImages = await Promise.all(
            result.results.map(async (item, index) => {
                try {
                    const r2Url = await uploadImageToR2(item.url, prompt, index);
                    console.log(`✅ 图片 ${index + 1} 已上传到R2:`, r2Url);
                    return {
                        url: r2Url,
                        originalUrl: item.url,
                        prompt: prompt,
                        timestamp: new Date().toISOString(),
                        storage: 'r2'
                    };
                } catch (error) {
                    console.error(`❌ 图片 ${index + 1} 上传失败:`, error.message);
                    // 如果R2上传失败，返回原始URL
                    return {
                        url: item.url,
                        originalUrl: item.url,
                        prompt: prompt,
                        timestamp: new Date().toISOString(),
                        storage: 'tongyi-temp',
                        uploadError: error.message
                    };
                }
            })
        );
        
        console.log('🎉 所有图片处理完成');
        
        res.json({
            success: true,
            images: uploadedImages,
            taskId: taskId
        });
        
    } catch (error) {
        console.error('❌ 生成失败:', error.response?.data || error.message);
        res.status(500).json({
            success: false,
            error: error.response?.data?.message || error.message,
            details: error.response?.data
        });
    }
});

// 上传图片到R2
async function uploadImageToR2(imageUrl, prompt, index) {
    try {
        // 1. 下载图片
        console.log(`📥 下载图片 ${index + 1}...`);
        const response = await axios.get(imageUrl, {
            responseType: 'arraybuffer',
            timeout: 30000
        });
        
        const imageBuffer = Buffer.from(response.data);
        const contentType = response.headers['content-type'] || 'image/jpeg';
        
        // 2. 生成唯一文件名
        const timestamp = Date.now();
        const uuid = uuidv4();
        const extension = contentType.includes('png') ? 'png' : 'jpg';
        const fileName = `ai-generated/${timestamp}-${uuid}.${extension}`;
        
        // 3. 上传到R2
        console.log(`☁️ 上传到R2: ${fileName}`);
        
        // 将中文提示词转为Base64避免header错误
        const promptBase64 = Buffer.from(prompt.substring(0, 200)).toString('base64');
        
        const command = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: fileName,
            Body: imageBuffer,
            ContentType: contentType,
            Metadata: {
                'prompt-base64': promptBase64,
                'generated-at': new Date().toISOString(),
                'index': String(index)
            }
        });
        
        await s3Client.send(command);
        
        // 4. 返回公开URL
        // 注意：需要配置R2的公开访问或自定义域名
        const publicUrl = `${R2_PUBLIC_URL}/${fileName}`;
        
        return publicUrl;
        
    } catch (error) {
        console.error('R2上传错误:', error);
        throw error;
    }
}

// 轮询任务结果
async function pollTaskResult(taskId, maxAttempts = 60, interval = 2000) {
    for (let i = 0; i < maxAttempts; i++) {
        await sleep(interval);
        
        try {
            const response = await axios.get(`${TASK_ENDPOINT}/${taskId}`, {
                headers: {
                    'Authorization': `Bearer ${TONGYI_API_KEY}`
                }
            });
            
            const status = response.data.output.task_status;
            console.log(`⏳ 轮询中 (${i + 1}/${maxAttempts}): ${status}`);
            
            if (status === 'SUCCEEDED') {
                return response.data.output;
            } else if (status === 'FAILED') {
                throw new Error(response.data.output.message || '生成失败');
            }
            
        } catch (error) {
            if (error.response?.status === 404) {
                throw new Error('任务不存在');
            }
            throw error;
        }
    }
    
    throw new Error('生成超时，请稍后重试');
}

// 工具函数：延迟
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 测试R2连接
async function testR2Connection() {
    try {
        console.log('🔍 测试R2连接...');
        const { ListBucketsCommand } = require('@aws-sdk/client-s3');
        const command = new ListBucketsCommand({});
        await s3Client.send(command);
        console.log('✅ R2连接成功');
        return true;
    } catch (error) {
        console.error('❌ R2连接失败:', error.message);
        console.error('请检查.env文件中的R2配置');
        return false;
    }
}

// 联系表单提交API
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        // 基本验证
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ 
                success: false, 
                error: '所有字段都是必填的' 
            });
        }
        
        // 邮箱格式验证
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                success: false, 
                error: '邮箱格式无效' 
            });
        }
        
        // 记录表单提交（实际应用中应该发送邮件或存储到数据库）
        console.log('='.repeat(60));
        console.log('📧 收到联系表单提交:');
        console.log(`   姓名: ${name}`);
        console.log(`   邮箱: ${email}`);
        console.log(`   主题: ${subject}`);
        console.log(`   消息: ${message}`);
        console.log(`   时间: ${new Date().toLocaleString('zh-CN')}`);
        console.log('='.repeat(60));
        
        // 模拟处理时间
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // 返回成功响应
        res.json({ 
            success: true, 
            message: '感谢您的留言！我们会尽快回复您。' 
        });
        
    } catch (error) {
        console.error('处理联系表单时出错:', error);
        res.status(500).json({ 
            success: false, 
            error: '服务器错误，请稍后再试' 
        });
    }
});

// ==================== 文件上传配置 ====================
const multer = require('multer');
const fs = require('fs');
const FormData = require('form-data');
const upload = multer({ dest: 'uploads/', limits: { fileSize: 10 * 1024 * 1024 } });

// ==================== 背景移除 API ====================
const REMOVEBG_API_KEY = process.env.REMOVEBG_API_KEY;

app.post('/api/remove-background', upload.single('image'), async (req, res) => {
    try {
        console.log('🎨 收到背景移除请求');
        
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                error: '未上传图片' 
            });
        }
        
        if (!REMOVEBG_API_KEY) {
            console.warn('⚠️  未配置 REMOVEBG_API_KEY');
            return res.json({
                success: false,
                error: '未配置 Remove.bg API',
                fallback: true
            });
        }
        
        try {
            console.log('🚀 调用 Remove.bg API...');
            console.log('   API Key:', REMOVEBG_API_KEY.substring(0, 8) + '...');
            
            // 读取图片文件
            const imageBuffer = fs.readFileSync(req.file.path);
            
            // 创建 FormData
            const formData = new FormData();
            formData.append('image_file', imageBuffer, {
                filename: 'image.png',
                contentType: req.file.mimetype
            });
            formData.append('size', 'auto');
            
            // 调用 Remove.bg API
            const response = await axios.post(
                'https://api.remove.bg/v1.0/removebg',
                formData,
                {
                    headers: {
                        'X-Api-Key': REMOVEBG_API_KEY,
                        ...formData.getHeaders()
                    },
                    responseType: 'arraybuffer',
                    timeout: 30000
                }
            );
            
            // 转换为 base64
            const imageBase64 = Buffer.from(response.data).toString('base64');
            const imageUrl = `data:image/png;base64,${imageBase64}`;
            
            // 清理临时文件
            try {
                fs.unlinkSync(req.file.path);
            } catch (e) {
                console.warn('清理临时文件失败:', e.message);
            }
            
            // 检查剩余额度
            const creditsCharged = response.headers['x-credits-charged'];
            const creditsRemaining = response.headers['x-ratelimit-remaining'];
            
            console.log('✅ 背景移除成功（Remove.bg API）');
            if (creditsRemaining) {
                console.log(`💳 剩余额度: ${creditsRemaining} 次`);
            }
            
            res.json({ 
                success: true, 
                result: imageUrl,
                service: 'Remove.bg',
                creditsRemaining: creditsRemaining,
                creditsCharged: creditsCharged
            });
            
        } catch (apiError) {
            // 清理临时文件
            if (req.file && req.file.path) {
                try {
                    fs.unlinkSync(req.file.path);
                } catch (e) {}
            }
            
            console.error('❌ Remove.bg API 错误:', apiError.message);
            
            // 处理特定错误
            if (apiError.response) {
                const status = apiError.response.status;
                console.error('   状态码:', status);
                
                // 尝试解析错误信息
                let errorMsg = 'API 调用失败';
                try {
                    const errorData = JSON.parse(apiError.response.data.toString());
                    errorMsg = errorData.errors?.[0]?.title || errorMsg;
                    console.error('   错误详情:', errorData);
                } catch (e) {
                    console.error('   响应:', apiError.response.data?.toString() || '无');
                }
                
                if (status === 403) {
                    return res.json({
                        success: false,
                        error: 'API Key 无效或额度已用完',
                        fallback: true
                    });
                } else if (status === 400) {
                    return res.json({
                        success: false,
                        error: '图片格式不支持或文件损坏',
                        fallback: true
                    });
                } else if (status === 402) {
                    return res.json({
                        success: false,
                        error: 'API 额度不足，请充值',
                        fallback: true
                    });
                }
            }
            
            // 返回降级标志
            return res.json({
                success: false,
                error: apiError.message,
                fallback: true
            });
        }
        
    } catch (error) {
        console.error('❌ 背景移除错误:', error);
        res.status(500).json({ 
            success: false, 
            error: '服务器错误：' + error.message,
            fallback: true
        });
    }
});

// ==================== 图生图API ====================

// Hugging Face API 配置
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;
const HUGGINGFACE_MODEL = process.env.HUGGINGFACE_MODEL || 'runwayml/stable-diffusion-v1-5';

app.post('/api/img2img/generate', upload.single('image'), async (req, res) => {
    try {
        console.log('📸 收到图生图请求');
        
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                error: '未上传图片' 
            });
        }
        
        const { prompt, strength, style, count } = req.body;
        
        console.log(`   提示词: ${prompt || '(无)'}`);
        console.log(`   变化程度: ${strength || 0.5}`);
        console.log(`   风格: ${style || 'auto'}`);
        console.log(`   数量: ${count || 1}`);
        
        // 检查是否配置了 Hugging Face API
        if (!HUGGINGFACE_API_KEY) {
            console.warn('⚠️  未配置 HUGGINGFACE_API_KEY，返回提示信息');
            return res.json({
                success: false,
                error: '未配置 Hugging Face API',
                message: '请在 .env 文件中配置 HUGGINGFACE_API_KEY',
                hint: '查看 docs/HuggingFace配置指南.md 了解如何配置'
            });
        }
        
        try {
            // 读取上传的图片
            const imageBuffer = fs.readFileSync(req.file.path);
            const imageBase64 = imageBuffer.toString('base64');
            
            console.log('🚀 调用 Hugging Face API...');
            
            // 调用 Hugging Face API
            const response = await axios.post(
                `https://api-inference.huggingface.co/models/${HUGGINGFACE_MODEL}`,
                {
                    inputs: prompt || '保持原图风格',
                    parameters: {
                        image: imageBase64,
                        strength: parseFloat(strength) || 0.5,
                        num_inference_steps: 50,
                        guidance_scale: 7.5
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    responseType: 'arraybuffer',
                    timeout: 60000 // 60秒超时
                }
            );
            
            // 将生成的图片转换为 base64
            const generatedImageBase64 = Buffer.from(response.data).toString('base64');
            const imageUrl = `data:image/jpeg;base64,${generatedImageBase64}`;
            
            // 清理临时文件
            fs.unlinkSync(req.file.path);
            
            console.log('✅ 图片生成成功');
            
            res.json({ 
                success: true, 
                images: [imageUrl],
                message: '图片生成成功'
            });
            
        } catch (apiError) {
            // 清理临时文件
            if (req.file && req.file.path) {
                try {
                    fs.unlinkSync(req.file.path);
                } catch (e) {}
            }
            
            console.error('❌ Hugging Face API 错误:', apiError.message);
            
            // 处理特定错误
            if (apiError.response) {
                const status = apiError.response.status;
                if (status === 401) {
                    return res.status(401).json({
                        success: false,
                        error: 'API Token 无效',
                        message: '请检查 HUGGINGFACE_API_KEY 是否正确'
                    });
                } else if (status === 503) {
                    return res.status(503).json({
                        success: false,
                        error: '模型正在加载',
                        message: '首次使用需要 20-30 秒加载模型，请稍后重试'
                    });
                }
            }
            
            throw apiError;
        }
        
    } catch (error) {
        console.error('❌ 图生图错误:', error);
        res.status(500).json({ 
            success: false, 
            error: '服务器错误：' + error.message 
        });
    }
});

// ==================== 高清放大API ====================
// 使用 ClipDrop AI Upscaler（免费2倍放大）
const CLIPDROP_API_KEY = process.env.CLIPDROP_API_KEY || process.env.REMOVEBG_API_KEY;

app.post('/api/upscale', upload.single('image'), async (req, res) => {
    try {
        console.log('🔍 收到高清放大请求');
        
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                error: '未上传图片' 
            });
        }
        
        const { scale = 2 } = req.body;
        
        console.log(`   放大倍数: ${scale}x`);
        
        // 如果没有配置API Key，返回错误
        if (!CLIPDROP_API_KEY) {
            console.warn('⚠️  未配置 ClipDrop API Key');
            return res.json({
                success: false,
                error: '未配置 ClipDrop API',
                fallback: true
            });
        }
        
        try {
            console.log('🚀 调用 ClipDrop AI Upscaler...');
            console.log('   API Key:', CLIPDROP_API_KEY.substring(0, 8) + '...');
            
            // 读取图片文件
            const imageBuffer = fs.readFileSync(req.file.path);
            
            // 创建 FormData
            const formData = new FormData();
            formData.append('image_file', imageBuffer, {
                filename: 'image.png',
                contentType: req.file.mimetype
            });
            
            // ClipDrop只支持2倍放大
            if (scale != 2) {
                console.warn(`⚠️  ClipDrop只支持2倍放大，当前请求${scale}倍`);
            }
            
            // 调用 ClipDrop API
            const response = await axios.post(
                'https://clipdrop-api.co/image-upscaling/v1/upscale',
                formData,
                {
                    headers: {
                        'x-api-key': CLIPDROP_API_KEY,
                        ...formData.getHeaders()
                    },
                    responseType: 'arraybuffer',
                    timeout: 60000
                }
            );
            
            // 转换为 base64
            const imageBase64 = Buffer.from(response.data).toString('base64');
            const imageUrl = `data:image/png;base64,${imageBase64}`;
            
            // 清理临时文件
            try {
                fs.unlinkSync(req.file.path);
            } catch (e) {
                console.warn('清理临时文件失败:', e.message);
            }
            
            console.log('✅ AI放大成功（ClipDrop API）');
            
            res.json({ 
                success: true, 
                result: imageUrl,
                service: 'ClipDrop AI',
                scale: 2,
                note: 'ClipDrop免费版仅支持2倍放大'
            });
            
        } catch (apiError) {
            // 清理临时文件
            if (req.file && req.file.path) {
                try {
                    fs.unlinkSync(req.file.path);
                } catch (e) {}
            }
            
            console.error('❌ ClipDrop API 错误:', apiError.message);
            
            if (apiError.response) {
                const status = apiError.response.status;
                console.error('   状态码:', status);
                
                if (status === 403 || status === 401) {
                    return res.json({
                        success: false,
                        error: 'API Key 无效',
                        fallback: true
                    });
                }
            }
            
            // 返回降级标志
            return res.json({
                success: false,
                error: apiError.message,
                fallback: true
            });
        }
        
        
        const scaleValue = parseInt(scale) || 2;
        const originalSize = 512;
        const upscaledSize = originalSize * scaleValue;
        
        // 生成原图SVG
        const originalSvg = `<svg width="${originalSize}" height="${originalSize}" xmlns="http://www.w3.org/2000/svg">
            <rect width="${originalSize}" height="${originalSize}" fill="#7F9DAC"/>
            <text x="50%" y="45%" text-anchor="middle" dy=".3em" fill="white" font-size="32" font-family="Arial">
                原图
            </text>
            <text x="50%" y="55%" text-anchor="middle" dy=".3em" fill="#E8E4E1" font-size="20" font-family="Arial">
                ${originalSize} × ${originalSize}
            </text>
        </svg>`;
        
        // 生成放大后SVG
        const upscaledSvg = `<svg width="${upscaledSize}" height="${upscaledSize}" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#7F9DAC;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#6B8694;stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="${upscaledSize}" height="${upscaledSize}" fill="url(#grad)"/>
            <text x="50%" y="40%" text-anchor="middle" dy=".3em" fill="white" font-size="64" font-family="Arial" font-weight="bold">
                放大 ${scaleValue}x
            </text>
            <text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#E8E4E1" font-size="36" font-family="Arial">
                ${upscaledSize} × ${upscaledSize}
            </text>
            <text x="50%" y="60%" text-anchor="middle" dy=".3em" fill="white" font-size="28" font-family="Arial">
                (模拟数据)
            </text>
        </svg>`;
        
        const originalBase64 = Buffer.from(originalSvg).toString('base64');
        const upscaledBase64 = Buffer.from(upscaledSvg).toString('base64');
        
        // 返回模拟结果
        res.json({ 
            success: true, 
            originalUrl: `data:image/svg+xml;base64,${originalBase64}`,
            upscaledUrl: `data:image/svg+xml;base64,${upscaledBase64}`,
            info: {
                originalSize: `${originalSize} × ${originalSize}`,
                upscaledSize: `${upscaledSize} × ${upscaledSize}`
            },
            message: '图片放大成功（模拟数据）'
        });
        
    } catch (error) {
        console.error('高清放大错误:', error);
        res.status(500).json({ 
            success: false, 
            error: '服务器错误：' + error.message 
        });
    }
});

// 启动服务器
app.listen(PORT, async () => {
    console.log('='.repeat(60));
    console.log('🎨 通义万相API代理服务器已启动（R2存储版）');
    console.log('='.repeat(60));
    console.log(`📡 服务地址: http://localhost:${PORT}`);
    console.log(`🔧 API端点: http://localhost:${PORT}/api/tongyi/generate`);
    console.log(`📸 图生图API: http://localhost:${PORT}/api/img2img/generate`);
    console.log(`🔍 高清放大API: http://localhost:${PORT}/api/upscale/process`);
    console.log(`📧 联系表单: http://localhost:${PORT}/api/contact`);
    console.log(`💚 健康检查: http://localhost:${PORT}/health`);
    console.log('='.repeat(60));
    console.log('');
    console.log('☁️  Cloudflare R2 配置:');
    console.log(`   存储桶: ${R2_BUCKET_NAME}`);
    console.log(`   端点: ${process.env.R2_ENDPOINT}`);
    console.log(`   公开URL: ${R2_PUBLIC_URL}`);
    console.log('');
    
    // 测试R2连接
    await testR2Connection();
    
    console.log('');
    console.log('✅ 现在可以打开 http://localhost:3000/tool.html 使用了！');
    console.log('   图片将自动上传到R2存储桶并永久保存');
    console.log('');
});

