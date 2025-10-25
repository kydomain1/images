/**
 * 通义万相API集成
 * 阿里云DashScope - 文字生成图片
 */

class TongyiWanxiangAPI {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.endpoint = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis';
        this.taskEndpoint = 'https://dashscope.aliyuncs.com/api/v1/tasks';
    }
    
    /**
     * 生成图片（异步模式）
     * @param {Object} options 生成配置
     * @returns {Promise<Array>} 图片数组
     */
    async generate(options) {
        const {
            prompt,
            negativePrompt = '',
            size = '1024*1024',
            count = 1,
            seed = null,
            style = 'auto'
        } = options;
        
        // 转换尺寸格式（从1024x1024到1024*1024）
        const tongyiSize = size.replace('x', '*');
        
        // 映射前端风格到通义万相API风格
        const styleMap = {
            'auto': '<auto>',
            'photorealistic': '<photography>',
            'anime': '<anime>',
            'oil-painting': '<oil painting>',
            'watercolor': '<watercolor>',
            'cyberpunk': '<3d cartoon>',
            'fantasy': '<fantasy>',
            'minimalist': '<flat illustration>',
            '3d-render': '<3d cartoon>'
        };
        
        const artStyle = styleMap[style] || '<auto>';
        
        try {
            // 通过API服务器调用（自动检测开发/生产环境）
            const apiURL = typeof APP_CONFIG !== 'undefined' ? 
                APP_CONFIG.getApiURL('tongyi') : 
                '/api/tongyi/generate';
            
            const response = await fetch(apiURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: prompt,
                    negativePrompt: negativePrompt,
                    size: tongyiSize,
                    count: count,
                    seed: seed,
                    artStyle: artStyle
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP ${response.status}`);
            }
            
            const data = await response.json();
            
            if (!data.success) {
                throw new Error(data.error || '生成失败');
            }
            
            return data.images;
            
        } catch (error) {
            console.error('通义万相API调用失败:', error);
            
            // 提供友好的错误提示
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                const isLocal = typeof APP_CONFIG !== 'undefined' && APP_CONFIG.isDevelopment;
                if (isLocal) {
                    throw new Error('无法连接到本地服务器！\n\n请确保：\n1. 已启动后端服务器（双击"启动服务器.bat"）\n2. 服务器运行在 http://localhost:3000\n3. 通过 http://localhost:3000/tool.html 访问本页面');
                } else {
                    throw new Error('API请求失败，请检查网络连接或稍后重试。');
                }
            }
            
            throw new Error(`图片生成失败: ${error.message}`);
        }
    }
    
    /**
     * 提交生成任务
     */
    async submitTask(prompt, negativePrompt, size, count, seed) {
        const payload = {
            model: "wanx-v1",
            input: {
                prompt: prompt
            },
            parameters: {
                size: size,
                n: Math.min(count, 4), // 通义万相单次最多4张
                seed: seed
            }
        };
        
        // 如果有负面提示词，添加到prompt中
        if (negativePrompt) {
            payload.input.negative_prompt = negativePrompt;
        }
        
        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json',
                'X-DashScope-Async': 'enable' // 启用异步模式
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // 检查返回的任务ID
        if (!data.output || !data.output.task_id) {
            throw new Error('未能获取任务ID');
        }
        
        return data.output.task_id;
    }
    
    /**
     * 轮询任务结果
     */
    async pollTaskResult(taskId, maxAttempts = 60, interval = 2000) {
        for (let i = 0; i < maxAttempts; i++) {
            await this.sleep(interval);
            
            const response = await fetch(`${this.taskEndpoint}/${taskId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`获取任务状态失败: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // 任务状态: PENDING(排队中), RUNNING(生成中), SUCCEEDED(成功), FAILED(失败)
            if (data.output.task_status === 'SUCCEEDED') {
                return data.output;
            } else if (data.output.task_status === 'FAILED') {
                throw new Error(data.output.message || '图片生成失败');
            }
            
            // 继续等待
            console.log(`生成中... (${i + 1}/${maxAttempts})`);
        }
        
        throw new Error('生成超时，请稍后重试');
    }
    
    /**
     * 处理API返回结果
     */
    processResult(result, prompt, settings) {
        const images = [];
        
        if (result.results && Array.isArray(result.results)) {
            result.results.forEach(item => {
                if (item.url) {
                    images.push({
                        url: item.url,
                        prompt: prompt,
                        settings: settings,
                        timestamp: new Date().toISOString(),
                        provider: 'tongyi-wanxiang'
                    });
                }
            });
        }
        
        if (images.length === 0) {
            throw new Error('未能生成图片');
        }
        
        return images;
    }
    
    /**
     * 同步模式生成（不推荐，可能超时）
     */
    async generateSync(options) {
        const {
            prompt,
            negativePrompt = '',
            size = '1024*1024',
            count = 1
        } = options;
        
        const tongyiSize = size.replace('x', '*');
        
        const payload = {
            model: "wanx-v1",
            input: {
                prompt: prompt
            },
            parameters: {
                size: tongyiSize,
                n: Math.min(count, 4)
            }
        };
        
        if (negativePrompt) {
            payload.input.negative_prompt = negativePrompt;
        }
        
        const response = await fetch(this.endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
                // 不设置X-DashScope-Async，默认同步
            },
            body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || response.statusText);
        }
        
        const data = await response.json();
        return this.processResult(data.output, prompt, options);
    }
    
    /**
     * 工具函数：延迟
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * 获取账户余额和用量信息（需要额外配置）
     */
    async getUsageInfo() {
        // 需要使用阿里云OpenAPI
        console.log('查看用量请访问：https://dashscope.console.aliyun.com/billing');
    }
}

// 在api-config.js中集成
if (typeof API_CONFIG !== 'undefined' && API_CONFIG.tongyi && API_CONFIG.tongyi.apiKey) {
    // 扩展ImageGenerationAPI类
    if (typeof ImageGenerationAPI !== 'undefined') {
        ImageGenerationAPI.prototype.generateWithTongyi = async function(settings) {
            const tongyiAPI = new TongyiWanxiangAPI(this.config.tongyi.apiKey);
            
            const { prompt, count, size, negativePrompt } = settings;
            
            const options = {
                prompt: prompt,
                negativePrompt: negativePrompt || '',
                size: size,
                count: count
            };
            
            return await tongyiAPI.generate(options);
        };
    }
}

// 导出供测试使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TongyiWanxiangAPI;
}

