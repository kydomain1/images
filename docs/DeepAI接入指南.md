# DeepAI API接入完整指南

## 📋 DeepAI简介

DeepAI是一个简单易用的AI图片生成平台，提供基于Stable Diffusion的文字转图片服务。

### 优势
- ✅ **注册简单** - 仅需邮箱，无需实名认证
- ✅ **免费额度** - 每月有免费调用次数
- ✅ **响应快速** - API调用速度快
- ✅ **简单易用** - API接口设计简洁
- ✅ **多种模型** - 支持多种AI模型

### 限制
- ⚠️ 免费版有每月调用次数限制
- ⚠️ 免费版图片会有水印
- ⚠️ 需要稳定的国际网络连接

---

## 🚀 快速开始

### 第一步：注册DeepAI账号

1. **访问官网**
   - 网址：https://deepai.org/

2. **注册账号**
   - 点击右上角 "Sign Up"
   - 使用邮箱注册（支持Gmail、QQ邮箱等）
   - 验证邮箱

3. **完成注册**
   - 无需信用卡
   - 无需实名认证
   - 立即获得免费额度

### 第二步：获取API Key

1. **登录账号**
   - 访问：https://deepai.org/
   - 点击 "Login" 登录

2. **进入控制台**
   - 登录后点击右上角头像
   - 选择 "Dashboard" 或 "Profile"
   - 或直接访问：https://deepai.org/dashboard/profile

3. **复制API Key**
   - 在页面中找到 "API Key" 部分
   - 点击 "Copy" 复制API Key
   - 格式：一串随机字符（约32-64位）

### 第三步：配置API

**打开文件：`js/api-config.js`**

找到并修改以下两处：

```javascript
const API_CONFIG = {
    // 1️⃣ 修改第2行
    provider: 'deepai',  // 改为 deepai
    
    // 2️⃣ 修改第22-25行
    deepai: {
        apiKey: '你的DeepAI-API-KEY',  // ← 粘贴你的API Key
        endpoint: 'https://api.deepai.org/api/text2img'
    }
};
```

**保存文件！**

### 第四步：测试

**方法1：使用测试工具**
1. 双击打开：`test-deepai.html`
2. 输入API Key
3. 输入提示词：`"a cute cat sitting on a windowsill"`
4. 点击"开始生成"

**方法2：使用主工具**
1. 打开：`tool.html`
2. 输入提示词（支持中英文）
3. 点击"生成图片"

---

## 💰 费用说明

### 免费计划 (Free Tier)
- **每月额度**：约100-500次调用（根据API变化）
- **速率限制**：每分钟约5-10次
- **图片质量**：标准质量
- **水印**：包含DeepAI水印

### 专业计划 (Pro Plan)
- **价格**：$4.99/月 起
- **额度**：500-5000次/月
- **无水印**
- **更高优先级**
- **更快响应速度**

### 查看用量
- 访问：https://deepai.org/dashboard
- 查看 "API Usage" 部分

---

## 🎨 支持的模型

DeepAI支持多种图片生成模型：

### 1. Text2img（默认）
```javascript
endpoint: 'https://api.deepai.org/api/text2img'
```
- 基于Stable Diffusion
- 适合一般图片生成

### 2. Stable Diffusion
```javascript
endpoint: 'https://api.deepai.org/api/stable-diffusion'
```
- Stable Diffusion 2.1
- 更高质量

### 3. Cute Creature Generator
```javascript
endpoint: 'https://api.deepai.org/api/cute-creature-generator'
```
- 专门生成可爱生物

### 4. Fantasy World Generator
```javascript
endpoint: 'https://api.deepai.org/api/fantasy-world-generator'
```
- 生成奇幻世界场景

### 5. Cyberpunk Generator
```javascript
endpoint: 'https://api.deepai.org/api/cyberpunk-generator'
```
- 赛博朋克风格

---

## 📝 API使用说明

### 基础调用示例

```javascript
const formData = new FormData();
formData.append('text', 'a beautiful sunset over mountains');

const response = await fetch('https://api.deepai.org/api/text2img', {
    method: 'POST',
    headers: {
        'api-key': '你的API-KEY'
    },
    body: formData
});

const result = await response.json();
console.log(result.output_url); // 图片URL
```

### 高级参数

```javascript
formData.append('text', '提示词');
formData.append('grid_size', '1'); // 生成数量：1-4
formData.append('width', '512');   // 宽度
formData.append('height', '512');  // 高度
formData.append('image_generator_version', '2'); // 版本
```

### 响应格式

```json
{
    "id": "生成ID",
    "output_url": "https://api.deepai.org/job-view-file/xxx.jpg",
    "status": "success"
}
```

---

## 💡 提示词技巧

### 英文提示词（推荐）
DeepAI对英文提示词支持最好：

✅ **好的提示词**：
```
a cute orange cat sitting on a windowsill, 
sunlight shining on it, oil painting style, 
highly detailed, warm colors, soft lighting
```

✅ **风格关键词**：
- `oil painting` - 油画风格
- `digital art` - 数字艺术
- `photorealistic` - 逼真照片
- `anime style` - 动漫风格
- `watercolor` - 水彩画
- `3D render` - 3D渲染
- `cyberpunk` - 赛博朋克
- `fantasy art` - 奇幻艺术

✅ **质量关键词**：
- `highly detailed` - 高细节
- `4k resolution` - 4K分辨率
- `masterpiece` - 杰作
- `best quality` - 最佳质量
- `professional` - 专业级

### 中文提示词
虽然支持中文，但效果可能不如英文：

```
一只可爱的橘猫坐在窗台上，阳光照在它身上，油画风格
```

### 负面提示词
DeepAI默认API不支持负面提示词，但可以在正面提示词中说明：

```
a beautiful landscape, NOT blurry, NOT low quality
```

---

## 🔧 代码实现

我已经在 `js/api-config.js` 中实现了DeepAI的集成：

```javascript
// DeepAI API实现
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
                throw new Error(`HTTP ${response.status}`);
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
```

---

## 🐛 常见问题

### Q1: "Invalid API Key" 错误

**原因**：
- API Key错误或已过期
- API Key前后有多余空格

**解决方案**：
1. 重新复制API Key
2. 检查是否有空格或特殊字符
3. 尝试重新生成API Key

### Q2: "Rate Limit Exceeded" 错误

**原因**：超过速率限制（免费版约5-10次/分钟）

**解决方案**：
1. 等待1分钟后重试
2. 减少生成频率
3. 升级到付费计划

### Q3: "Insufficient Credits" 错误

**原因**：免费额度用完

**解决方案**：
1. 等待下月额度重置
2. 升级到付费计划
3. 切换到其他免费API（如Pollinations）

### Q4: 跨域(CORS)错误

**原因**：浏览器安全限制

**解决方案**：
DeepAI支持浏览器直连，但某些情况下可能需要后端代理。

**临时解决**（开发环境）：
- 使用浏览器扩展禁用CORS（仅开发用）
- 使用测试工具 `test-deepai.html`

**生产解决**：创建后端代理（见下文）

### Q5: 图片有水印

**原因**：免费版会添加DeepAI水印

**解决方案**：
1. 升级到付费计划去除水印
2. 使用其他无水印的API
3. 后期处理裁剪水印（不推荐）

### Q6: 提示词识别不准确

**解决方案**：
1. 使用英文提示词（效果更好）
2. 描述要详细具体
3. 添加风格和质量关键词
4. 参考官方示例提示词

---

## 🔒 生产环境部署

### Node.js 后端代理

创建 `server-deepai.js`：

```javascript
const express = require('express');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

const app = express();
app.use(express.json());

// CORS设置
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// DeepAI代理接口
app.post('/api/deepai/generate', async (req, res) => {
    const { prompt } = req.body;
    
    try {
        const formData = new FormData();
        formData.append('text', prompt);
        
        const response = await axios.post(
            'https://api.deepai.org/api/text2img',
            formData,
            {
                headers: {
                    'api-key': process.env.DEEPAI_API_KEY,
                    ...formData.getHeaders()
                }
            }
        );
        
        res.json(response.data);
    } catch (error) {
        console.error('DeepAI API错误:', error.message);
        res.status(500).json({ 
            error: error.message,
            details: error.response?.data 
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`DeepAI代理服务器运行在 http://localhost:${PORT}`);
});
```

**安装依赖**：
```bash
npm install express axios form-data dotenv
```

**配置环境变量**（`.env`文件）：
```
DEEPAI_API_KEY=你的API-KEY
PORT=3000
```

**启动服务器**：
```bash
node server-deepai.js
```

### Python Flask 后端代理

创建 `app-deepai.py`：

```python
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

@app.route('/api/deepai/generate', methods=['POST'])
def generate_image():
    data = request.json
    prompt = data.get('prompt')
    
    try:
        response = requests.post(
            'https://api.deepai.org/api/text2img',
            data={'text': prompt},
            headers={'api-key': os.getenv('DEEPAI_API_KEY')}
        )
        
        response.raise_for_status()
        return jsonify(response.json())
        
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=3000, debug=True)
```

**安装依赖**：
```bash
pip install flask flask-cors requests python-dotenv
```

**运行**：
```bash
python app-deepai.py
```

---

## 🎯 切换不同模型

在 `js/api-config.js` 中修改endpoint即可切换模型：

```javascript
deepai: {
    apiKey: '你的API-KEY',
    
    // 选择一个endpoint：
    
    // 标准文字转图片（推荐）
    endpoint: 'https://api.deepai.org/api/text2img'
    
    // 或 Stable Diffusion（更高质量）
    // endpoint: 'https://api.deepai.org/api/stable-diffusion'
    
    // 或 可爱生物生成器
    // endpoint: 'https://api.deepai.org/api/cute-creature-generator'
    
    // 或 奇幻世界生成器
    // endpoint: 'https://api.deepai.org/api/fantasy-world-generator'
    
    // 或 赛博朋克生成器
    // endpoint: 'https://api.deepai.org/api/cyberpunk-generator'
}
```

---

## 📊 性能优化建议

### 1. 批量生成优化
```javascript
// 不推荐：顺序生成
for (let i = 0; i < 4; i++) {
    await generateImage();
}

// 推荐：并行生成
await Promise.all([
    generateImage(),
    generateImage(),
    generateImage(),
    generateImage()
]);
```

### 2. 错误重试
```javascript
async function generateWithRetry(maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await generateImage();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await sleep(1000 * (i + 1)); // 指数退避
        }
    }
}
```

### 3. 缓存结果
```javascript
const cache = new Map();

async function generateWithCache(prompt) {
    if (cache.has(prompt)) {
        return cache.get(prompt);
    }
    
    const result = await generateImage(prompt);
    cache.set(prompt, result);
    return result;
}
```

---

## 📚 官方资源

- **官网**：https://deepai.org/
- **API文档**：https://deepai.org/docs
- **控制台**：https://deepai.org/dashboard
- **定价**：https://deepai.org/pricing
- **示例**：https://deepai.org/machine-learning-model/text2img

---

## ✅ 完成检查清单

- [ ] 已注册DeepAI账号
- [ ] 已获取API Key
- [ ] 已修改 `js/api-config.js` 配置
- [ ] 已测试图片生成功能
- [ ] 已了解免费额度限制
- [ ] 已查看API用量

---

## 💡 最佳实践

1. **提示词使用英文**效果更好
2. **添加风格和质量关键词**提升效果
3. **监控API用量**避免超出限制
4. **生产环境使用后端代理**保护API Key
5. **实现错误重试机制**提高稳定性
6. **缓存相同提示词的结果**节省额度

---

祝您使用愉快！🚀


