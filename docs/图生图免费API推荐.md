# 免费图生图API推荐方案

## 📋 概述

图生图（Image-to-Image）功能可以基于参考图片生成新图片，适用于风格转换、图片编辑、高清放大等场景。

---

## 🆓 推荐的免费API方案

### 1. **Replicate** ⭐⭐⭐⭐⭐ (最推荐)
**优点：**
- ✅ 完全免费（前100次/月）
- ✅ 支持多种模型（Stable Diffusion、SDXL等）
- ✅ 高质量输出
- ✅ 支持图生图、高清放大、风格迁移
- ✅ API简单易用

**限制：**
- 免费额度：100次/月
- 需要注册账号

**获取方式：**
1. 访问：https://replicate.com/
2. 注册账号
3. 获取API Token：https://replicate.com/account/api-tokens

**适用场景：**
- 图片风格转换
- AI绘画优化
- 图片高清放大
- 人物肖像美化

---

### 2. **Stability AI (Stable Diffusion)** ⭐⭐⭐⭐
**优点：**
- ✅ 官方API，质量高
- ✅ 支持img2img
- ✅ 25积分免费额度

**限制：**
- 免费积分有限（25 credits）
- 需要信用卡验证

**获取方式：**
1. 访问：https://platform.stability.ai/
2. 注册并获取API Key

**支持的功能：**
- Image-to-Image
- Inpainting（修复）
- Outpainting（扩展）

---

### 3. **Hugging Face Spaces** ⭐⭐⭐⭐
**优点：**
- ✅ 完全免费
- ✅ 多个开源模型可选
- ✅ 不需要API Key
- ✅ 社区活跃

**限制：**
- 速度较慢（共享资源）
- 可能排队等待

**推荐模型：**
- stabilityai/stable-diffusion-2-1
- runwayml/stable-diffusion-v1-5
- CompVis/stable-diffusion-v1-4

**访问方式：**
- 直接访问：https://huggingface.co/spaces
- 搜索"image to image"模型

---

### 4. **DeepAI** ⭐⭐⭐
**优点：**
- ✅ 注册即送500次免费调用
- ✅ 多种图像处理API
- ✅ 简单易用

**限制：**
- 免费后需付费
- 图片质量一般

**支持功能：**
- Style Transfer（风格迁移）
- Super Resolution（超分辨率）
- Colorization（上色）

**获取方式：**
1. 访问：https://deepai.org/
2. 注册账号获取API Key

---

### 5. **ClipDrop** ⭐⭐⭐⭐
**优点：**
- ✅ 免费版可用
- ✅ 背景移除、图片清理等功能
- ✅ 质量高

**限制：**
- 每月有限次数
- 部分功能需要付费

**网址：**
https://clipdrop.co/apis

---

### 6. **RunwayML** ⭐⭐⭐
**优点：**
- ✅ 多种AI视频和图片工具
- ✅ 免费试用额度

**限制：**
- 免费额度较少
- 需要注册

**网址：**
https://runwayml.com/

---

### 7. **本地部署方案** ⭐⭐⭐⭐⭐
**推荐工具：**

#### Stable Diffusion WebUI
- 完全免费
- 功能最强大
- 需要较好的显卡（建议GTX 1060 6GB以上）

**安装方式：**
```bash
git clone https://github.com/AUTOMATIC1111/stable-diffusion-webui.git
cd stable-diffusion-webui
./webui.sh  # Linux/Mac
webui-user.bat  # Windows
```

#### ComfyUI
- 节点式操作
- 更灵活的工作流
- 适合高级用户

---

## 💰 费用对比

| API服务 | 免费额度 | 付费价格 | 推荐度 |
|---------|---------|---------|--------|
| Replicate | 100次/月 | $0.006/次起 | ⭐⭐⭐⭐⭐ |
| Stability AI | 25积分 | $10/1000积分 | ⭐⭐⭐⭐ |
| Hugging Face | 无限制 | 免费 | ⭐⭐⭐⭐ |
| DeepAI | 500次 | $5/月起 | ⭐⭐⭐ |
| ClipDrop | 有限次数 | $9/月 | ⭐⭐⭐⭐ |

---

## 🎯 使用建议

### 个人学习/测试
推荐：**Hugging Face** 或 **Replicate**
- 无需信用卡
- 免费额度充足
- 易于上手

### 小规模项目
推荐：**Replicate** 或 **Stability AI**
- 质量稳定
- 价格合理
- API可靠

### 大规模应用
推荐：**自建服务器** + **Stable Diffusion**
- 长期成本最低
- 完全可控
- 无API限制

---

## 🔧 快速集成示例

### Replicate API 示例

```javascript
async function img2img(imageFile, prompt) {
    const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
            'Authorization': `Token ${REPLICATE_API_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            version: "stability-ai/sdxl:image-to-image",
            input: {
                image: imageFile,  // base64 or URL
                prompt: prompt,
                num_outputs: 1
            }
        })
    });
    
    return await response.json();
}
```

### Stability AI 示例

```javascript
async function img2img(imageFile, prompt) {
    const formData = new FormData();
    formData.append('init_image', imageFile);
    formData.append('text_prompts[0][text]', prompt);
    formData.append('image_strength', 0.35);
    
    const response = await fetch(
        'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/image-to-image',
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${STABILITY_API_KEY}`
            },
            body: formData
        }
    );
    
    return await response.json();
}
```

---

## 📚 相关资源

- **Replicate 文档**: https://replicate.com/docs
- **Stability AI 文档**: https://platform.stability.ai/docs
- **Hugging Face 文档**: https://huggingface.co/docs
- **Stable Diffusion GitHub**: https://github.com/Stability-AI/stablediffusion

---

## ⚠️ 注意事项

1. **API密钥安全**：不要将API密钥硬编码在前端代码中
2. **速率限制**：遵守各API的速率限制
3. **版权问题**：生成的图片版权归属需要确认
4. **内容审核**：某些API有内容审核机制

---

## 🆕 最新推荐（2025年）

目前最推荐的组合方案：
1. **Replicate** - 用于高质量图生图
2. **Hugging Face** - 用于测试和实验
3. **本地 Stable Diffusion** - 用于大批量处理

这样既保证了质量，又控制了成本！


