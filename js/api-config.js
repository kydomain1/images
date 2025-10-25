// API配置文件
// 请根据您选择的API服务，配置相应的参数

const API_CONFIG = {
    // 选择使用的API服务
    // 可选值: 'huggingface', 'craiyon', 'deepai', 'stability', 'pollinations', 'tongyi'
    provider: 'pollinations', // 使用Pollinations.ai（完全免费，无需API Key）
    
    // Hugging Face配置
    huggingface: {
        apiKey: '', // 在 https://huggingface.co/settings/tokens 获取
        model: 'stabilityai/stable-diffusion-2-1',
        endpoint: 'https://api-inference.huggingface.co/models/'
    },
    
    // Craiyon配置（无需API Key）
    craiyon: {
        endpoint: 'https://api.craiyon.com/v3',
        version: 'v3'
    },
    
    // DeepAI配置
    deepai: {
        apiKey: '40e63125-a31c-4bef-bdc2-c2a0537e59cf', // DeepAI API Key
        endpoint: 'https://api.deepai.org/api/text2img'
    },
    
    // Stability AI配置
    stability: {
        apiKey: '', // 在 https://platform.stability.ai/account/keys 获取
        endpoint: 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image'
    },
    
    // Pollinations.ai（完全免费，无需API Key）
    pollinations: {
        endpoint: 'https://image.pollinations.ai/prompt/',
        // 支持参数：width, height, seed, nologo
    },
    
    // 通义万相（阿里云）配置
    tongyi: {
        apiKey: '', // API Key 由服务器端配置（见 .env 文件）
        endpoint: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis'
    }
};

// API调用函数
class ImageGenerationAPI {
    constructor(config = API_CONFIG) {
        this.config = config;
        this.provider = config.provider;
    }
    
    // 主生成函数
    async generate(settings) {
        const { prompt, count, size, negativePrompt, quality } = settings;
        
        switch (this.provider) {
            case 'pollinations':
                return await this.generateWithPollinations(settings);
            case 'huggingface':
                return await this.generateWithHuggingFace(settings);
            case 'craiyon':
                return await this.generateWithCraiyon(settings);
            case 'deepai':
                return await this.generateWithDeepAI(settings);
            case 'stability':
                return await this.generateWithStability(settings);
            case 'tongyi':
                return await this.generateWithTongyi(settings);
            default:
                throw new Error('不支持的API提供商');
        }
    }
    
    // Pollinations.ai API（完全免费，推荐）
    async generateWithPollinations(settings) {
        const { prompt, count, size } = settings;
        const [width, height] = size.split('x');
        const images = [];
        
        // 优化提示词：如果是中文，保持原样；如果是英文，也保持原样
        const optimizedPrompt = prompt.trim();
        
        for (let i = 0; i < count; i++) {
            // 添加随机种子以生成不同图片
            const seed = Math.floor(Math.random() * 1000000);
            
            // 正确编码URL，使用encodeURIComponent确保中文正确传输
            const encodedPrompt = encodeURIComponent(optimizedPrompt);
            
            // 构建URL - 使用更稳定的参数
            const url = `${this.config.pollinations.endpoint}${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true&enhance=true`;
            
            images.push({
                url: url,
                prompt: optimizedPrompt,
                settings: settings,
                timestamp: new Date().toISOString(),
                seed: seed
            });
        }
        
        return images;
    }
    
    // Hugging Face API
    async generateWithHuggingFace(settings) {
        const { prompt, count } = settings;
        const apiKey = this.config.huggingface.apiKey;
        
        if (!apiKey) {
            throw new Error('请配置Hugging Face API Key');
        }
        
        const endpoint = this.config.huggingface.endpoint + this.config.huggingface.model;
        const images = [];
        
        for (let i = 0; i < count; i++) {
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        inputs: prompt,
                        options: {
                            wait_for_model: true
                        }
                    })
                });
                
                if (!response.ok) {
                    throw new Error(`API请求失败: ${response.status}`);
                }
                
                const blob = await response.blob();
                const imageUrl = URL.createObjectURL(blob);
                
                images.push({
                    url: imageUrl,
                    prompt: prompt,
                    settings: settings,
                    timestamp: new Date().toISOString()
                });
            } catch (error) {
                console.error('Hugging Face API调用失败:', error);
                throw error;
            }
        }
        
        return images;
    }
    
    // Craiyon API
    async generateWithCraiyon(settings) {
        const { prompt } = settings;
        
        try {
            const response = await fetch(this.config.craiyon.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: prompt,
                    version: 'v3',
                    token: null
                })
            });
            
            if (!response.ok) {
                throw new Error(`API请求失败: ${response.status}`);
            }
            
            const data = await response.json();
            const images = [];
            
            // Craiyon通常返回9张图片
            data.images.forEach((imageData, index) => {
                if (index < settings.count) {
                    images.push({
                        url: `data:image/jpeg;base64,${imageData}`,
                        prompt: prompt,
                        settings: settings,
                        timestamp: new Date().toISOString()
                    });
                }
            });
            
            return images;
        } catch (error) {
            console.error('Craiyon API调用失败:', error);
            throw error;
        }
    }
    
    // DeepAI API
    async generateWithDeepAI(settings) {
        const { prompt, count } = settings;
        const apiKey = this.config.deepai.apiKey;
        
        if (!apiKey) {
            throw new Error('请配置DeepAI API Key');
        }
        
        const images = [];
        
        for (let i = 0; i < count; i++) {
            try {
                const formData = new FormData();
                formData.append('text', prompt);
                
                const response = await fetch(this.config.deepai.endpoint, {
                    method: 'POST',
                    headers: {
                        'api-key': apiKey
                    },
                    body: formData
                });
                
                if (!response.ok) {
                    throw new Error(`API请求失败: ${response.status}`);
                }
                
                const data = await response.json();
                
                images.push({
                    url: data.output_url,
                    prompt: prompt,
                    settings: settings,
                    timestamp: new Date().toISOString()
                });
            } catch (error) {
                console.error('DeepAI API调用失败:', error);
                throw error;
            }
        }
        
        return images;
    }
    
    // Stability AI API
    async generateWithStability(settings) {
        const { prompt, count, size, negativePrompt } = settings;
        const apiKey = this.config.stability.apiKey;
        
        if (!apiKey) {
            throw new Error('请配置Stability AI API Key');
        }
        
        const [width, height] = size.split('x').map(Number);
        const images = [];
        
        try {
            const response = await fetch(this.config.stability.endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    text_prompts: [
                        {
                            text: prompt,
                            weight: 1
                        },
                        ...(negativePrompt ? [{
                            text: negativePrompt,
                            weight: -1
                        }] : [])
                    ],
                    cfg_scale: 7,
                    height: height,
                    width: width,
                    samples: count,
                    steps: 30
                })
            });
            
            if (!response.ok) {
                throw new Error(`API请求失败: ${response.status}`);
            }
            
            const data = await response.json();
            
            data.artifacts.forEach(artifact => {
                images.push({
                    url: `data:image/png;base64,${artifact.base64}`,
                    prompt: prompt,
                    settings: settings,
                    timestamp: new Date().toISOString()
                });
            });
            
            return images;
        } catch (error) {
            console.error('Stability AI API调用失败:', error);
            throw error;
        }
    }
    
    // 通义万相API
    async generateWithTongyi(settings) {
        const { prompt, count, size, negativePrompt } = settings;
        
        // 创建通义万相API实例
        const tongyiAPI = new TongyiWanxiangAPI(this.config.tongyi.apiKey);
        
        // 调用通义万相API（返回对象数组，每个对象已包含url、prompt等）
        const imageObjects = await tongyiAPI.generate({
            prompt: prompt,
            negativePrompt: negativePrompt || '',
            size: size,
            count: count
        });
        
        // 服务器已经返回了完整的对象数组，直接返回
        return imageObjects.map((img, index) => ({
            ...img,
            settings: settings,
            index: index
        }));
    }
    
    // ==================== 图生图功能 ====================
    
    // 图生图 - Replicate API (推荐)
    async generateImg2ImgWithReplicate(settings) {
        const { prompt, referenceImage, strength, negativePrompt, size } = settings;
        
        try {
            // 这里需要调用服务器端API（因为API Key不能暴露在前端）
            const response = await fetch('http://localhost:3000/api/img2img', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: prompt,
                    image: referenceImage,
                    strength: strength,
                    negative_prompt: negativePrompt || '',
                    size: size
                })
            });
            
            if (!response.ok) {
                throw new Error(`API请求失败: ${response.status}`);
            }
            
            const data = await response.json();
            
            return [{
                url: data.output,
                prompt: prompt,
                settings: settings,
                timestamp: new Date().toISOString()
            }];
        } catch (error) {
            console.error('Replicate图生图API调用失败:', error);
            throw error;
        }
    }
    
    // 图生图 - Pollinations.ai (完全免费)
    async generateImg2ImgWithPollinations(settings) {
        const { prompt, referenceImage, strength } = settings;
        
        // Pollinations.ai 支持图生图
        // 注意：需要先将参考图片上传或使用URL
        const seed = Math.floor(Math.random() * 1000000);
        const enhanceParam = strength > 0.5 ? 'true' : 'false';
        
        try {
            // 构建URL
            const encodedPrompt = encodeURIComponent(prompt);
            const url = `${this.config.pollinations.endpoint}${encodedPrompt}?seed=${seed}&enhance=${enhanceParam}`;
            
            return [{
                url: url,
                prompt: prompt,
                settings: settings,
                timestamp: new Date().toISOString(),
                seed: seed
            }];
        } catch (error) {
            console.error('Pollinations图生图失败:', error);
            throw error;
        }
    }
    
    // 主图生图函数
    async generateImg2Img(settings) {
        // 根据配置的provider选择API
        switch (this.provider) {
            case 'pollinations':
                return await this.generateImg2ImgWithPollinations(settings);
            case 'tongyi':
                // 通义万相也支持图生图
                return await this.generateImg2ImgWithTongyi(settings);
            default:
                // 默认使用Replicate
                return await this.generateImg2ImgWithReplicate(settings);
        }
    }
    
    // 通义万相图生图
    async generateImg2ImgWithTongyi(settings) {
        const { prompt, referenceImage, strength, negativePrompt } = settings;
        
        try {
            const response = await fetch('http://localhost:3000/api/tongyi-img2img', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: prompt,
                    reference_image: referenceImage,
                    strength: strength,
                    negative_prompt: negativePrompt || ''
                })
            });
            
            if (!response.ok) {
                throw new Error(`API请求失败: ${response.status}`);
            }
            
            const data = await response.json();
            
            return data.images || [];
        } catch (error) {
            console.error('通义万相图生图失败:', error);
            throw error;
        }
    }
}

// 导出API实例
const imageAPI = new ImageGenerationAPI(API_CONFIG);

