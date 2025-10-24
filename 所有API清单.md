# 📋 项目所有API清单

## 🎯 当前使用的API

---

## 1️⃣ 通义万相 API（阿里云）

### **功能**
文字生成图片（AI图片生成）

### **官网**
https://help.aliyun.com/zh/dashscope/developer-reference/tongyi-wanxiang

### **API端点**
```
https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis
```

### **需要的密钥**
```
TONGYI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
```

### **获取方式**
1. 访问：https://dashscope.console.aliyun.com/
2. 登录/注册阿里云账号
3. 进入"API-KEY管理"
4. 创建新的API Key
5. 复制密钥

### **使用限制**
- **免费额度**：每月500次调用
- **付费价格**：约0.06元/张
- **图片尺寸**：512x512, 1024x1024, 720x1280等
- **调用超时**：30秒

### **项目中的使用**
- **文件**：`server-with-r2.js`，`api/tongyi-generate.js`
- **前端**：`js/tongyi-api.js`
- **功能**：文字生成图片功能

---

## 2️⃣ Remove.bg API

### **功能**
AI背景移除（抠图）

### **官网**
https://www.remove.bg/api

### **API端点**
```
https://api.remove.bg/v1.0/removebg
```

### **需要的密钥**
```
REMOVEBG_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxx
```

### **获取方式**
1. 访问：https://www.remove.bg/users/sign_up
2. 注册账号
3. 进入 API 页面：https://www.remove.bg/api
4. 获取 API Key

### **使用限制**
- **免费额度**：每月50次
- **付费价格**：
  - Preview: $0.20/张（预览质量）
  - Full: $2.00/张（完整质量）
- **图片大小**：最大25MB
- **格式支持**：JPG, PNG, WebP

### **项目中的使用**
- **文件**：`server-with-r2.js`，`api/remove-bg.js`
- **前端**：`js/bg-remover-ai.js`
- **功能**：背景移除功能

---

## 3️⃣ Cloudflare R2（图片存储）

### **功能**
云存储服务（永久保存生成的图片）

### **官网**
https://www.cloudflare.com/products/r2/

### **API端点**
```
https://a86b7f2b20d627f1735a95fb923660d2.r2.cloudflarestorage.com
```

### **公共访问URL**
```
https://pub-cbddee5991484904ac9e5399ab06dcd7.r2.dev
```

### **需要的配置**
```
R2_ACCESS_KEY_ID=b815b9e739d5faf7af43b921ecc45e96
R2_SECRET_ACCESS_KEY=7e53018b389db72b8bfe58190b0aa72974c2df199b7146cf75b4a45a922efe97
R2_BUCKET_NAME=images
R2_ENDPOINT=https://a86b7f2b20d627f1735a95fb923660d2.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://pub-cbddee5991484904ac9e5399ab06dcd7.r2.dev
```

### **获取方式**
1. 访问：https://dash.cloudflare.com/
2. 登录 Cloudflare 账号
3. 进入 R2 服务
4. 创建存储桶（Bucket）
5. 生成 API 令牌

### **使用限制**
- **免费额度**：
  - 10GB 存储空间
  - 每月100万次读取
  - 每月100万次写入
- **付费价格**：
  - 存储：$0.015/GB/月
  - 读取：免费（无出口费用）
  - 写入：$4.50/百万次

### **项目中的使用**
- **文件**：`server-with-r2.js`
- **功能**：保存通义万相生成的图片

---

## 4️⃣ Pollinations.ai API（备用）

### **功能**
免费的AI图片生成（备用方案）

### **官网**
https://pollinations.ai/

### **API端点**
```
https://image.pollinations.ai/prompt/{prompt}
```

### **需要的密钥**
❌ 无需密钥（完全免费）

### **使用限制**
- **免费额度**：无限制
- **图片质量**：中等
- **响应速度**：较慢
- **稳定性**：一般

### **项目中的使用**
- **文件**：`js/api-config.js`（备用配置）
- **状态**：当前未启用（可切换）

---

## 📊 API使用对比

| API | 功能 | 免费额度 | 质量 | 速度 | 稳定性 |
|-----|------|----------|------|------|--------|
| **通义万相** | 图片生成 | 500次/月 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Remove.bg** | 背景移除 | 50次/月 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Cloudflare R2** | 图片存储 | 10GB | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Pollinations** | 图片生成 | 无限 | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ |

---

## 🔑 环境变量配置

### **完整的 .env 文件**

```bash
# 通义万相 API
TONGYI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx

# Remove.bg API
REMOVEBG_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxx

# Cloudflare R2 存储
R2_ACCESS_KEY_ID=b815b9e739d5faf7af43b921ecc45e96
R2_SECRET_ACCESS_KEY=7e53018b389db72b8bfe58190b0aa72974c2df199b7146cf75b4a45a922efe97
R2_BUCKET_NAME=images
R2_ENDPOINT=https://a86b7f2b20d627f1735a95fb923660d2.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://pub-cbddee5991484904ac9e5399ab06dcd7.r2.dev

# 其他配置
NODE_ENV=production
PORT=3000
```

---

## 📁 API文件位置

### **后端API文件**
```
server-with-r2.js           # 主服务器（包含所有API代理）
api/tongyi-generate.js      # Vercel通义万相函数
api/remove-bg.js            # Vercel背景移除函数
```

### **前端API调用文件**
```
js/api-config.js            # API配置
js/tongyi-api.js            # 通义万相前端调用
js/bg-remover-ai.js         # 背景移除前端调用
js/background-remover.js    # 背景移除主逻辑
```

---

## 🚀 API调用示例

### **1. 通义万相（文字生成图片）**

```javascript
// 前端调用
const response = await fetch('/api/tongyi/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: '一只可爱的猫咪',
    model: 'wanx-v1',
    parameters: {
      size: '1024*1024',
      n: 1
    }
  })
});

const data = await response.json();
console.log(data.images); // 生成的图片URL数组
```

### **2. Remove.bg（背景移除）**

```javascript
// 前端调用
const formData = new FormData();
formData.append('image', file); // 上传的图片文件

const response = await fetch('/api/remove-bg', {
  method: 'POST',
  body: formData
});

const data = await response.json();
console.log(data.image); // 处理后的图片base64
```

### **3. Cloudflare R2（图片上传）**

```javascript
// 服务器端（自动处理）
// 通义万相生成的图片会自动上传到R2
// 返回公共访问URL
```

---

## 💰 成本估算

### **每月使用1000张图片**

| 服务 | 免费额度 | 超出费用 | 月成本 |
|------|----------|----------|--------|
| 通义万相 | 500张 | 500张 × ¥0.06 | ¥30 |
| Remove.bg | 50张 | 950张 × $0.20 | $190 |
| R2存储 | 10GB | 约1GB × $0.015 | $0.015 |
| **总计** | - | - | **¥30 + $190** |

### **优化建议**
- 通义万相：成本较低，可正常使用
- Remove.bg：成本较高，建议用户付费或限制使用
- R2：成本极低，可忽略不计

---

## 🔄 切换API配置

### **切换到Pollinations（免费）**

编辑 `js/api-config.js`：

```javascript
const API_CONFIG = {
  provider: 'pollinations',  // 改为 'pollinations'
  // ... 其他配置
};
```

### **切换回通义万相**

```javascript
const API_CONFIG = {
  provider: 'tongyi',  // 改为 'tongyi'
  // ... 其他配置
};
```

---

## 📞 API支持

### **通义万相**
- 文档：https://help.aliyun.com/zh/dashscope/
- 控制台：https://dashscope.console.aliyun.com/

### **Remove.bg**
- 文档：https://www.remove.bg/api/documentation
- 控制台：https://www.remove.bg/dashboard

### **Cloudflare R2**
- 文档：https://developers.cloudflare.com/r2/
- 控制台：https://dash.cloudflare.com/

---

## ⚠️ 安全提示

1. ❌ **不要**在前端代码中直接暴露API密钥
2. ✅ **使用**服务器端代理（已实现）
3. ✅ **保护** `.env` 文件（不提交到Git）
4. ✅ **限制**API调用频率（防止滥用）
5. ✅ **监控**API使用量（避免超额费用）

---

## 🎯 总结

**当前使用的API：**
- ✅ 通义万相 API（文字生成图片）
- ✅ Remove.bg API（背景移除）
- ✅ Cloudflare R2（图片存储）
- ⏸️ Pollinations AI（备用，未启用）

**本地功能（无需API）：**
- ✅ AI高清放大（浏览器算法）
- ✅ 滤镜效果（Canvas处理）
- ✅ 图片裁剪（Canvas处理）
- ✅ 格式转换（Canvas处理）

**总计：3个主要API + 1个备用API**

---

**所有API密钥请保管好，不要泄露！** 🔒

