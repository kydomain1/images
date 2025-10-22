/**
 * 通义万相API + Replicate AI服务 + Cloudflare R2存储
 * 集成真实的图生图和高清放大功�? */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const multer = require('multer');
const Replicate = require('replicate');
const sharp = require('sharp');
const fs = require('fs').promises;

const app = express();
const PORT = process.env.PORT || 3000;

// 通义万相API配置
const TONGYI_API_KEY = process.env.TONGYI_API_KEY;
const TONGYI_ENDPOINT = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis';
const TASK_ENDPOINT = 'https://dashscope.aliyuncs.com/api/v1/tasks';

// Replicate API配置
const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

// R2存储配置（可选）
const R2_ENABLED = !!(process.env.R2_BUCKET_NAME && process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY);
let s3Client = null;
let R2_BUCKET_NAME = null;
let R2_PUBLIC_URL = null;

if (R2_ENABLED) {
    const R2_CONFIG = {
        region: 'auto',
        endpoint: process.env.R2_ENDPOINT,
        credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID,
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY
        }
    };
    s3Client = new S3Client(R2_CONFIG);
    R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
    R2_PUBLIC_URL = process.env.R2_PUBLIC_URL || process.env.R2_ENDPOINT;
}

// Multer配置
const upload = multer({ 
    dest: 'uploads/',
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB限制
});

// 中间�?app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// 健康检�?app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: '服务器运行中（Replicate AI + R2存储�?,
        services: {
            textToImage: 'Tongyi Wanxiang',
            imageToImage: 'Replicate (SDXL)',
            upscale: 'Replicate (Real-ESRGAN)',
            storage: 'Cloudflare R2'
        }
    });
});

// ==================== 文字生成图片（通义万相�?===================
// （保持原有的通义万相代码不变�?app.post('/api/tongyi/generate', async (req, res) => {
    try {
        const { 
            prompt, 
            negativePrompt = '', 
            count = 4,
            size = '1024*1024',
            artStyle = '<auto>',
            creativity = 0.7
        } = req.body;
        
        // 保持向后兼容
        const imageCount = count;
        const imageSize = size;

        if (!prompt) {
            return res.status(400).json({ 
                success: false, 
                error: '请提供图片描述（prompt�? 
            });
        }

        console.log('\n' + '='.repeat(60));
        console.log('🎨 收到生成请求:');
        console.log(`   提示�? ${prompt}`);
        console.log(`   数量: ${imageCount}`);
        console.log(`   尺寸: ${imageSize}`);
        console.log(`   风格: ${artStyle}`);
        console.log(`   API密钥: ${TONGYI_API_KEY ? TONGYI_API_KEY.substring(0, 10) + '...' + TONGYI_API_KEY.substring(TONGYI_API_KEY.length - 4) : '未配�?}`);

        // 调用通义万相API
        const response = await axios.post(
            TONGYI_ENDPOINT,
            {
                model: 'wanx-v1',
                input: {
                    prompt: prompt,
                    negative_prompt: negativePrompt
                },
                parameters: {
                    style: artStyle,
                    size: imageSize,
                    n: parseInt(imageCount),
                    seed: Math.floor(Math.random() * 1000000)
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${TONGYI_API_KEY}`,
                    'Content-Type': 'application/json',
                    'X-DashScope-Async': 'enable'
                }
            }
        );

        const taskId = response.data.output.task_id;
        console.log(`   任务ID: ${taskId}`);
        console.log('   �?等待生成...');

        // 轮询任务状�?        let taskResult;
        let attempts = 0;
        const maxAttempts = 60;

        while (attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const statusResponse = await axios.get(
                `${TASK_ENDPOINT}/${taskId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${TONGYI_API_KEY}`
                    }
                }
            );

            taskResult = statusResponse.data;
            
            if (taskResult.output.task_status === 'SUCCEEDED') {
                console.log('   �?生成成功�?);
                break;
            } else if (taskResult.output.task_status === 'FAILED') {
                throw new Error('生成失败: ' + (taskResult.output.message || '未知错误'));
            }
            
            attempts++;
        }

        if (attempts >= maxAttempts) {
            throw new Error('生成超时');
        }

        // 处理生成的图�?        const uploadedUrls = [];
        const results = taskResult.output.results;
        
        if (R2_ENABLED) {
            // 上传到R2永久存储
            console.log(`   📤 上传${results.length}张图片到R2...`);
            
            for (let i = 0; i < results.length; i++) {
                try {
                    const imageUrl = results[i].url;
                    
                    // 重试机制：下载图�?                    let imageBuffer;
                    let downloadRetries = 3;
                    while (downloadRetries > 0) {
                        try {
                            const imageResponse = await axios.get(imageUrl, {
                                responseType: 'arraybuffer',
                                timeout: 30000 // 30秒超�?                            });
                            imageBuffer = Buffer.from(imageResponse.data);
                            break;
                        } catch (downloadError) {
                            downloadRetries--;
                            if (downloadRetries === 0) throw downloadError;
                            console.log(`   ⚠️  图片 ${i + 1} 下载失败，重试中... (剩余${downloadRetries}�?`);
                            await new Promise(resolve => setTimeout(resolve, 2000));
                        }
                    }
                    
                    const fileName = `${uuidv4()}.png`;
                    const promptBase64 = Buffer.from(prompt.substring(0, 200)).toString('base64');
                    
                    const command = new PutObjectCommand({
                        Bucket: R2_BUCKET_NAME,
                        Key: fileName,
                        Body: imageBuffer,
                        ContentType: 'image/png',
                        Metadata: {
                            'prompt-base64': promptBase64,
                            'generated-at': new Date().toISOString(),
                            'index': String(i)
                        }
                    });
                    
                    // 重试机制：上传到R2
                    let uploadRetries = 3;
                    while (uploadRetries > 0) {
                        try {
                            await s3Client.send(command);
                            break;
                        } catch (uploadError) {
                            uploadRetries--;
                            if (uploadRetries === 0) throw uploadError;
                            console.log(`   ⚠️  图片 ${i + 1} 上传失败，重试中... (剩余${uploadRetries}�?`);
                            await new Promise(resolve => setTimeout(resolve, 2000));
                        }
                    }
                    
                    const r2Url = `${R2_PUBLIC_URL}/${fileName}`;
                    uploadedUrls.push(r2Url);
                    
                    console.log(`   �?图片 ${i + 1} 已上传`);
                } catch (error) {
                    console.error(`   �?图片 ${i + 1} 处理失败:`, error.message);
                    // 如果某张图片失败，使用原始临时URL作为备份
                    uploadedUrls.push(results[i].url);
                    console.log(`   💡 图片 ${i + 1} 改用临时URL`);
                }
            }
        } else {
            // 降级：使用通义万相临时URL
            console.log(`   📝 使用通义万相临时URL�?4小时有效期）...`);
            for (let i = 0; i < results.length; i++) {
                uploadedUrls.push(results[i].url);
                console.log(`   �?图片 ${i + 1} URL已添加`);
            }
        }

        console.log('   🎉 全部完成�?);
        console.log('='.repeat(60) + '\n');

        res.json({
            success: true,
            images: uploadedUrls,
            taskId: taskId
        });

    } catch (error) {
        console.error('�?错误:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ==================== 联系表单 ====================
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
        
        // 记录表单提交（实际应用中应该发送邮件或存储到数据库�?        console.log('='.repeat(60));
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
            message: '感谢您的留言！我们会尽快回复您�? 
        });
        
    } catch (error) {
        console.error('联系表单错误:', error);
        res.status(500).json({ 
            success: false, 
            error: '提交失败，请稍后再试' 
        });
    }
});

// ==================== 健康检�?====================
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        message: 'AI图片生成服务器运行中（通义万相 + R2存储�?
    });
});

// ==================== 静态文件服�?====================
app.use(express.static('.'));

// ==================== 启动服务�?====================
        if (style && style !== 'auto') {
            const styleMap = {
                'realistic': 'photorealistic, professional photography, sharp details',
                'anime': 'anime style, manga art, vibrant colors',
                'oil': 'oil painting, classical art, visible brushstrokes',
                'watercolor': 'watercolor painting, soft colors, artistic',
                'sketch': 'pencil sketch, line art, black and white'
            };
            fullPrompt += ', ' + (styleMap[style] || '');
