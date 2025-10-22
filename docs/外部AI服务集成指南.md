# 🔌 外部AI服务集成指南

## 📋 目录
1. [图生图服务](#图生图服务)
2. [高清放大服务](#高清放大服务)
3. [快速集成示例](#快速集成示例)
4. [推荐服务对比](#推荐服务对比)

---

## 🎨 图生图服务

### 方案1：Replicate API（推荐⭐⭐⭐⭐⭐）

#### 优点
- ✅ 无需自建服务器
- ✅ 多种模型可选
- ✅ 按使用量付费
- ✅ API简单易用
- ✅ 稳定可靠

#### 价格
- Stable Diffusion XL: ~$0.003/次
- 按秒计费，经济实惠

#### 注册
1. 访问：https://replicate.com/
2. 注册账号
3. 获取API Token：https://replicate.com/account/api-tokens

#### 安装依赖
```bash
npm install replicate
```

#### 集成代码
```javascript
// 在 server-with-r2.js 顶部添加
const Replicate = require('replicate');
const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

// 替换图生图API中的模拟代码
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
        
        // 读取上传的图片
        const fs = require('fs');
        const imageBuffer = fs.readFileSync(req.file.path);
        const imageBase64 = `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`;
        
        // 构建完整提示词
        let fullPrompt = prompt || "high quality, detailed";
        if (style && style !== 'auto') {
            const styleMap = {
                'realistic': 'photorealistic, professional photography',
                'anime': 'anime style, manga art',
                'oil': 'oil painting, classical art',
                'watercolor': 'watercolor painting, soft colors',
                'sketch': 'pencil sketch, line art'
            };
            fullPrompt += ', ' + (styleMap[style] || '');
        }
        
        // 调用Replicate API
        const output = await replicate.run(
            "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
            {
                input: {
                    image: imageBase64,
                    prompt: fullPrompt,
                    strength: parseFloat(strength) || 0.5,
                    num_outputs: parseInt(count) || 1,
                }
            }
        );
        
        // 上传结果到R2
        const uploadedImages = [];
        for (let i = 0; i < output.length; i++) {
            const imageUrl = output[i];
            // 下载生成的图片
            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const buffer = Buffer.from(response.data);
            
            // 上传到R2
            const fileName = `img2img-${Date.now()}-${i}.png`;
            const command = new PutObjectCommand({
                Bucket: R2_BUCKET_NAME,
                Key: fileName,
                Body: buffer,
                ContentType: 'image/png',
            });
            
            await s3Client.send(command);
            const r2Url = `${R2_PUBLIC_URL}/${fileName}`;
            uploadedImages.push(r2Url);
        }
        
        // 删除临时文件
        fs.unlinkSync(req.file.path);
        
        res.json({ 
            success: true, 
            images: uploadedImages,
            message: '图片生成成功'
        });
        
    } catch (error) {
        console.error('图生图错误:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});
```

#### 环境变量配置
在 `.env` 文件中添加：
```env
REPLICATE_API_TOKEN=r8_your_token_here
```

---

### 方案2：Stability AI API

#### 优点
- ✅ 官方Stable Diffusion服务
- ✅ 质量最高
- ✅ 多种模型可选

#### 价格
- SDXL 1.0: $0.04/张
- 需要充值积分

#### 注册
1. 访问：https://platform.stability.ai/
2. 注册并充值
3. 获取API Key

#### 安装依赖
```bash
npm install form-data
```

#### 集成代码
```javascript
const FormData = require('form-data');
const STABILITY_API_KEY = process.env.STABILITY_API_KEY;

app.post('/api/img2img/generate', upload.single('image'), async (req, res) => {
    try {
        const { prompt, strength } = req.body;
        const fs = require('fs');
        
        // 准备表单数据
        const formData = new FormData();
        formData.append('image', fs.createReadStream(req.file.path));
        formData.append('prompt', prompt || 'high quality, detailed');
        formData.append('strength', parseFloat(strength) || 0.5);
        
        // 调用Stability AI API
        const response = await axios.post(
            'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/image-to-image',
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    'Authorization': `Bearer ${STABILITY_API_KEY}`,
                    'Accept': 'application/json'
                }
            }
        );
        
        // 处理返回的图片（base64格式）
        const uploadedImages = [];
        for (const artifact of response.data.artifacts) {
            const buffer = Buffer.from(artifact.base64, 'base64');
            
            // 上传到R2
            const fileName = `img2img-${Date.now()}.png`;
            const command = new PutObjectCommand({
                Bucket: R2_BUCKET_NAME,
                Key: fileName,
                Body: buffer,
                ContentType: 'image/png',
            });
            
            await s3Client.send(command);
            uploadedImages.push(`${R2_PUBLIC_URL}/${fileName}`);
        }
        
        fs.unlinkSync(req.file.path);
        
        res.json({ 
            success: true, 
            images: uploadedImages
        });
        
    } catch (error) {
        console.error('错误:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});
```

---

## 🔍 高清放大服务

### 方案1：Replicate - Real-ESRGAN（推荐⭐⭐⭐⭐⭐）

#### 优点
- ✅ 开源模型
- ✅ 效果优秀
- ✅ 价格便宜
- ✅ 支持4x放大

#### 价格
- ~$0.005/张

#### 集成代码
```javascript
app.post('/api/upscale/process', upload.single('image'), async (req, res) => {
    try {
        console.log('🔍 收到高清放大请求');
        
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                error: '未上传图片' 
            });
        }
        
        const { scale } = req.body;
        const fs = require('fs');
        
        // 读取上传的图片
        const imageBuffer = fs.readFileSync(req.file.path);
        const imageBase64 = `data:${req.file.mimetype};base64,${imageBuffer.toString('base64')}`;
        
        // 上传原图到R2
        const originalFileName = `original-${Date.now()}.png`;
        const originalCommand = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: originalFileName,
            Body: imageBuffer,
            ContentType: req.file.mimetype,
        });
        await s3Client.send(originalCommand);
        const originalUrl = `${R2_PUBLIC_URL}/${originalFileName}`;
        
        // 调用Real-ESRGAN
        const output = await replicate.run(
            "nightmareai/real-esrgan:42fed1c4974146d4d2414e2be2c5277c7fcf05fcc3a73abf41610695738c1d7b",
            {
                input: {
                    image: imageBase64,
                    scale: parseInt(scale) || 2,
                    face_enhance: req.body.face === 'true'
                }
            }
        );
        
        // 下载放大后的图片
        const upscaledResponse = await axios.get(output, { responseType: 'arraybuffer' });
        const upscaledBuffer = Buffer.from(upscaledResponse.data);
        
        // 上传到R2
        const upscaledFileName = `upscaled-${Date.now()}.png`;
        const upscaledCommand = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: upscaledFileName,
            Body: upscaledBuffer,
            ContentType: 'image/png',
        });
        await s3Client.send(upscaledCommand);
        const upscaledUrl = `${R2_PUBLIC_URL}/${upscaledFileName}`;
        
        // 获取图片尺寸信息
        const sharp = require('sharp');
        const originalMeta = await sharp(imageBuffer).metadata();
        const upscaledMeta = await sharp(upscaledBuffer).metadata();
        
        fs.unlinkSync(req.file.path);
        
        res.json({ 
            success: true, 
            originalUrl,
            upscaledUrl,
            info: {
                originalSize: `${originalMeta.width} × ${originalMeta.height}`,
                upscaledSize: `${upscaledMeta.width} × ${upscaledMeta.height}`
            }
        });
        
    } catch (error) {
        console.error('高清放大错误:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});
```

#### 需要安装
```bash
npm install sharp
```

---

### 方案2：自建Real-ESRGAN服务

#### 优点
- ✅ 完全免费
- ✅ 数据隐私
- ✅ 无限使用

#### 缺点
- ❌ 需要GPU服务器
- ❌ 维护成本

#### 部署步骤
```bash
# 1. 克隆仓库
git clone https://github.com/xinntao/Real-ESRGAN.git
cd Real-ESRGAN

# 2. 安装依赖
pip install -r requirements.txt

# 3. 下载模型
wget https://github.com/xinntao/Real-ESRGAN/releases/download/v0.1.0/RealESRGAN_x4plus.pth -P weights

# 4. 创建API服务
# 使用Flask或FastAPI创建HTTP接口
```

#### Flask API示例
```python
from flask import Flask, request, send_file
from realesrgan import RealESRGAN
import cv2
import numpy as np

app = Flask(__name__)
model = RealESRGAN('weights/RealESRGAN_x4plus.pth')

@app.route('/upscale', methods=['POST'])
def upscale():
    file = request.files['image']
    scale = int(request.form.get('scale', 4))
    
    # 读取图片
    img = cv2.imdecode(np.frombuffer(file.read(), np.uint8), cv2.IMREAD_COLOR)
    
    # 放大
    output = model.predict(img, scale)
    
    # 保存并返回
    output_path = 'output.png'
    cv2.imwrite(output_path, output)
    
    return send_file(output_path, mimetype='image/png')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

#### Node.js调用
```javascript
const formData = new FormData();
formData.append('image', fs.createReadStream(req.file.path));
formData.append('scale', scale);

const response = await axios.post('http://your-server:5000/upscale', formData, {
    headers: formData.getHeaders(),
    responseType: 'arraybuffer'
});

const upscaledBuffer = Buffer.from(response.data);
```

---

## 📊 服务对比表

### 图生图服务对比

| 服务 | 价格 | 质量 | 速度 | 易用性 | 推荐度 |
|------|------|------|------|--------|--------|
| **Replicate** | 💰 低 | ⭐⭐⭐⭐⭐ | ⚡⚡⚡⚡ | 😊😊😊😊😊 | ⭐⭐⭐⭐⭐ |
| **Stability AI** | 💰💰 中 | ⭐⭐⭐⭐⭐ | ⚡⚡⚡⚡⚡ | 😊😊😊😊 | ⭐⭐⭐⭐ |
| **自建SD** | 💰💰💰 高 | ⭐⭐⭐⭐⭐ | ⚡⚡⚡ | 😊😊 | ⭐⭐⭐ |

### 高清放大服务对比

| 服务 | 价格 | 质量 | 速度 | 易用性 | 推荐度 |
|------|------|------|------|--------|--------|
| **Replicate** | 💰 低 | ⭐⭐⭐⭐⭐ | ⚡⚡⚡⚡ | 😊😊😊😊😊 | ⭐⭐⭐⭐⭐ |
| **自建Real-ESRGAN** | 💰💰 中 | ⭐⭐⭐⭐⭐ | ⚡⚡⚡⚡⚡ | 😊😊 | ⭐⭐⭐⭐ |
| **Waifu2x** | 💰 免费 | ⭐⭐⭐⭐ | ⚡⚡⚡ | 😊😊😊😊 | ⭐⭐⭐ |

---

## 🚀 快速开始（Replicate推荐方案）

### 步骤1：安装依赖
```bash
npm install replicate sharp
```

### 步骤2：配置环境变量
在 `.env` 文件中添加：
```env
REPLICATE_API_TOKEN=r8_your_token_here_xxxxxxxxxxxxx
```

### 步骤3：获取API Token
1. 访问 https://replicate.com/
2. 注册账号（可用GitHub登录）
3. 访问 https://replicate.com/account/api-tokens
4. 创建新Token并复制

### 步骤4：替换代码
我已经为您准备好了完整的集成代码文件。

---

## 💡 推荐方案

### 对于个人/小型项目
**使用 Replicate**
- ✅ 无需服务器
- ✅ 按使用付费
- ✅ 5分钟集成完成

### 对于企业/大量使用
**自建服务**
- ✅ 长期成本低
- ✅ 数据安全
- ✅ 完全可控

---

## 📝 完整集成文件

我可以为您生成：
1. `server-replicate.js` - 完整的Replicate集成版本
2. `server-stability.js` - Stability AI集成版本
3. 包含完整错误处理和R2上传

请告诉我您想使用哪个方案，我会立即为您创建完整的集成代码！

---

## 🔐 安全提醒

- ⚠️ **API Key保密** - 永远不要将API Key提交到Git
- ⚠️ **使用.env文件** - 所有敏感信息放在`.env`
- ⚠️ **添加到.gitignore** - 确保`.env`在`.gitignore`中
- ⚠️ **限制使用量** - 设置API调用限制防止滥用
- ⚠️ **监控费用** - 定期检查API使用费用

---

## 📞 需要帮助？

如果在集成过程中遇到问题，请提供：
1. 选择的服务商
2. 错误信息
3. 相关代码片段

我会立即协助您解决！

