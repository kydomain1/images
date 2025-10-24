# 🚀 Vercel 部署完整指南

## ✅ 已完成配置

已为您创建以下文件：
- ✅ `vercel.json` - Vercel配置文件
- ✅ `.vercelignore` - 部署忽略文件
- ✅ `api/tongyi-generate.js` - 通义万相API端点
- ✅ `api/remove-bg.js` - Remove.bg API端点

---

## 📋 部署步骤

### **1. 安装 Vercel CLI**

```bash
npm i -g vercel
```

### **2. 登录 Vercel**

```bash
vercel login
```

### **3. 配置环境变量**

在部署前，需要在Vercel中设置以下环境变量：

#### **必需的环境变量：**

```bash
TONGYI_API_KEY=你的通义万相API密钥
REMOVEBG_API_KEY=你的RemoveBG API密钥
R2_ACCESS_KEY_ID=b815b9e739d5faf7af43b921ecc45e96
R2_SECRET_ACCESS_KEY=7e53018b389db72b8bfe58190b0aa72974c2df199b7146cf75b4a45a922efe97
R2_BUCKET_NAME=images
R2_ENDPOINT=https://a86b7f2b20d627f1735a95fb923660d2.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://pub-cbddee5991484904ac9e5399ab06dcd7.r2.dev
NODE_ENV=production
```

#### **在Vercel Dashboard中设置：**

1. 访问 https://vercel.com/dashboard
2. 选择您的项目
3. 进入 **Settings** → **Environment Variables**
4. 添加上述所有环境变量

### **4. 部署到 Vercel**

#### **方式一：使用 Vercel CLI（推荐）**

```bash
# 首次部署（会引导您配置项目）
vercel

# 生产部署
vercel --prod
```

#### **方式二：通过 Git 自动部署**

1. 确保代码已推送到GitHub
2. 访问 https://vercel.com/new
3. 导入您的GitHub仓库
4. 配置环境变量
5. 点击 **Deploy**

---

## ⚙️ Vercel 项目设置

在Vercel Dashboard中配置：

### **General Settings**
- **Framework Preset**: Other
- **Root Directory**: `./`
- **Node.js Version**: 18.x

### **Build & Development Settings**
- **Build Command**: `npm install`
- **Output Directory**: `.`
- **Install Command**: `npm install`
- **Development Command**: `node server-with-r2.js`

### **Functions**
- **Function Region**: Hong Kong (hkg1) 或 Singapore (sin1)
- **Max Duration**: 60 seconds

---

## 🔧 部署后配置

### **1. 检查部署状态**

```bash
vercel ls
```

### **2. 查看部署日志**

```bash
vercel logs [deployment-url]
```

### **3. 测试API端点**

部署成功后，测试以下端点：

```bash
# 测试通义万相
curl -X POST https://你的域名.vercel.app/api/tongyi-generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "一只可爱的猫"}'

# 测试Remove.bg
curl -X POST https://你的域名.vercel.app/api/remove-bg \
  -H "Content-Type: application/json" \
  -d '{"image_url": "https://example.com/image.jpg"}'
```

---

## ⚠️ 常见问题解决

### **1. "缺少公共目录" 错误**
- ✅ 已解决：在 `vercel.json` 中设置 `"outputDirectory": "."`

### **2. "环境变量未定义" 错误**
- 在Vercel Dashboard中添加所有环境变量
- 重新部署项目

### **3. "函数超时" 错误**
- 在 `vercel.json` 中已设置 `maxDuration: 60`
- 如需更长时间，需升级到Pro计划

### **4. "CORS错误"**
- ✅ 已解决：在API函数中添加了CORS头

### **5. API密钥安全**
- ❌ 不要在前端代码中暴露API密钥
- ✅ 所有API调用都通过后端代理
- ✅ 环境变量在Vercel中安全存储

---

## 📊 部署限制

### **免费计划 (Hobby)**
- ✅ 100GB 带宽/月
- ✅ 无限部署
- ✅ 函数执行：10秒（可配置到60秒）
- ⚠️ 仅一个团队成员

### **Pro计划 ($20/月)**
- ✅ 1TB 带宽/月
- ✅ 函数执行：60秒
- ✅ 优先支持
- ✅ 高级分析

---

## 🎯 优化建议

### **1. 静态资源优化**
```json
// 在 vercel.json 中添加缓存头
{
  "headers": [
    {
      "source": "/css/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### **2. 图片优化**
- 使用Vercel Image Optimization
- 启用WebP格式
- 配置适当的缓存策略

### **3. 函数优化**
- 减少冷启动时间
- 使用Edge Functions（更快）
- 启用函数缓存

---

## 🚀 立即部署

### **快速命令：**

```bash
# 1. 确保所有更改已提交
git add .
git commit -m "准备部署到Vercel"
git push

# 2. 部署到Vercel
vercel --prod
```

---

## 📞 获取帮助

- **Vercel文档**: https://vercel.com/docs
- **Vercel支持**: https://vercel.com/support
- **社区论坛**: https://github.com/vercel/vercel/discussions

---

**配置完成！现在可以部署了！** 🎉

使用命令 `vercel --prod` 立即部署到生产环境！


