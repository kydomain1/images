# 🚀 Replicate API 快速配置指南

## 📋 前提条件

在开始之前，您需要：
- ✅ Node.js 环境
- ✅ 项目已有的R2配置
- ✅ Replicate账号（免费注册）

---

## 🎯 步骤1：注册Replicate账号

### 1.1 访问Replicate官网
```
https://replicate.com/
```

### 1.2 注册账号
- 点击 "Sign up"
- 可以使用GitHub账号快速登录
- 完全免费注册，无需信用卡

### 1.3 获取API Token
1. 登录后访问：https://replicate.com/account/api-tokens
2. 点击 "Create token"
3. 输入Token名称（如：`my-ai-image-generator`）
4. 复制生成的Token（格式：`r8_xxxxxxxxxxxxx`）

⚠️ **重要**：Token只显示一次，请立即保存！

---

## 🎯 步骤2：安装依赖

在项目目录中运行：

```bash
npm install replicate sharp
```

**依赖说明**：
- `replicate` - Replicate API客户端
- `sharp` - 图片处理库（用于获取尺寸信息）

---

## 🎯 步骤3：配置环境变量

编辑 `.env` 文件，添加Replicate API Token：

```env
# Replicate API配置
REPLICATE_API_TOKEN=r8_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# 其他现有配置保持不变
TONGYI_API_KEY=sk-xxxxx
R2_ACCOUNT_ID=xxxxx
R2_ACCESS_KEY_ID=xxxxx
R2_SECRET_ACCESS_KEY=xxxxx
R2_BUCKET_NAME=images
R2_ENDPOINT=https://xxxxx.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

---

## 🎯 步骤4：切换到Replicate服务器

### 方法1：重命名文件（推荐）
```bash
# 备份当前服务器
mv server-with-r2.js server-with-r2-backup.js

# 使用Replicate版本
mv server-replicate.js server-with-r2.js
```

### 方法2：直接运行
```bash
# 直接运行Replicate版本
node server-replicate.js
```

---

## 🎯 步骤5：启动服务器

```bash
node server-replicate.js
```

### 期望看到的输出：
```
============================================================
🎨 AI图片生成服务器已启动（Replicate + R2存储）
============================================================
📡 服务地址: http://localhost:3000
🔧 文字生成: http://localhost:3000/api/tongyi/generate
📸 图生图: http://localhost:3000/api/img2img/generate
🔍 高清放大: http://localhost:3000/api/upscale/process
📧 联系表单: http://localhost:3000/api/contact
💚 健康检查: http://localhost:3000/health
============================================================

☁️  Cloudflare R2 配置:
   存储桶: images
   端点: https://xxxxx.r2.cloudflarestorage.com
   公开URL: https://pub-xxxxx.r2.dev
🔍 测试R2连接...
✅ R2连接成功
🔍 测试Replicate连接...
✅ Replicate API Token 已配置
✅ 现在可以打开 http://localhost:3000/tool.html 使用了！
   图片将自动上传到R2存储桶并永久保存
============================================================
```

---

## 🎯 步骤6：测试功能

### 测试图生图
1. 访问 http://localhost:3000/tool.html
2. 点击 **[图生图]** 标签
3. 上传一张图片
4. 输入提示词（可选）：`转换为油画风格`
5. 调整变化程度滑块
6. 点击 **"开始重绘"**
7. 等待约10-20秒
8. 查看生成的真实AI图片！

### 测试高清放大
1. 点击 **[高清放大]** 标签
2. 上传一张图片
3. 选择放大倍数（2x 或 4x）
4. 勾选增强选项
5. 点击 **"开始放大"**
6. 等待约30-60秒
7. 查看放大结果对比！

---

## 💰 费用说明

### 图生图（Stable Diffusion XL）
- **价格**：约 $0.003-0.005/张
- **计费方式**：按秒计费
- **预估**：生成一张图约需要5-10秒

### 高清放大（Real-ESRGAN）
- **价格**：约 $0.005/张
- **计费方式**：按处理时间计费
- **预估**：放大一张图约需要10-30秒

### 免费额度
- Replicate提供一定的免费测试额度
- 新用户通常有$5-10免费额度
- 足够测试几百次

### 费用控制
1. 在Replicate后台设置预算限制
2. 访问：https://replicate.com/account/billing
3. 设置每月最高消费限额

---

## 🔍 故障排除

### 问题1：Token无效
```
错误信息：Authentication failed
解决方案：
1. 检查.env文件中的REPLICATE_API_TOKEN是否正确
2. 确保Token没有空格或换行
3. 重新生成Token并替换
```

### 问题2：依赖安装失败
```bash
# 清理并重新安装
rm -rf node_modules package-lock.json
npm install
```

### 问题3：生成时间过长
```
原因：Replicate的cold start可能需要等待
解决：首次使用某个模型需要30-60秒初始化，之后会快很多
```

### 问题4：R2上传失败
```
检查R2配置是否正确
确保R2_BUCKET_NAME、R2_ENDPOINT等都已配置
```

---

## 📊 性能对比

### 模拟版 vs Replicate版

| 功能 | 模拟版 | Replicate版 |
|------|--------|-------------|
| 图生图 | ❌ SVG占位图 | ✅ 真实AI图片 |
| 高清放大 | ❌ SVG占位图 | ✅ 真实放大 |
| 处理时间 | 2-3秒 | 10-60秒 |
| 费用 | 免费 | 约$0.005/张 |
| 质量 | 无 | ⭐⭐⭐⭐⭐ |

---

## 🎨 高级配置

### 自定义模型参数

编辑 `server-replicate.js`，找到对应的API调用：

#### 图生图参数调整
```javascript
const output = await replicate.run(
    "stability-ai/sdxl:...",
    {
        input: {
            image: imageBase64,
            prompt: fullPrompt,
            strength: 0.5,              // 0-1，变化程度
            num_outputs: 1,             // 生成数量
            num_inference_steps: 25,    // 步数（越多越精细）
            guidance_scale: 7.5,        // 提示词强度
            scheduler: "K_EULER",       // 采样器
        }
    }
);
```

#### 高清放大参数调整
```javascript
const output = await replicate.run(
    "nightmareai/real-esrgan:...",
    {
        input: {
            image: imageBase64,
            scale: 2,                   // 2或4
            face_enhance: true,         // 面部增强
        }
    }
);
```

---

## 🌟 其他可用模型

### 图生图替代模型

1. **Stable Diffusion v1.5**（更快，质量稍低）
```javascript
"stability-ai/stable-diffusion:..."
```

2. **Kandinsky 2.2**（独特风格）
```javascript
"ai-forever/kandinsky-2-2:..."
```

### 高清放大替代模型

1. **GFPGAN**（更好的面部修复）
```javascript
"tencentarc/gfpgan:..."
```

2. **CodeFormer**（专业面部修复）
```javascript
"sczhou/codeformer:..."
```

---

## ✅ 完成清单

- [ ] Replicate账号已注册
- [ ] API Token已获取并配置
- [ ] 依赖包已安装（replicate, sharp）
- [ ] .env文件已配置
- [ ] 服务器已切换到server-replicate.js
- [ ] 服务器成功启动
- [ ] 图生图功能测试通过
- [ ] 高清放大功能测试通过
- [ ] 生成的图片已保存到R2

---

## 🎉 恭喜！

您已成功集成真实的AI服务！

现在您的网站拥有：
- ✅ 文字生成图片（通义万相）
- ✅ 图生图（Replicate SDXL）
- ✅ 高清放大（Replicate Real-ESRGAN）
- ✅ 所有图片永久存储在R2

---

## 📞 需要帮助？

- Replicate文档：https://replicate.com/docs
- Replicate社区：https://replicate.com/explore
- API参考：https://replicate.com/docs/reference/http

如有问题，请查看 `docs/外部AI服务集成指南.md` 获取更多信息！

