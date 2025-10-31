# 🚀 快速部署指南

## 📦 您的项目现在支持双平台部署！

### 🟢 Vercel (已配置)
- **API格式：** Node.js Functions
- **目录：** `api/`
- **配置：** `vercel.json`
- **环境变量：** 已在Vercel Dashboard配置

### 🟠 Cloudflare (新增支持)
- **API格式：** Cloudflare Workers
- **目录：** `functions/`
- **配置：** `wrangler.toml`, `_redirects`, `_headers`
- **环境变量：** 需要在Cloudflare Dashboard配置

---

## ⚡ 快速开始

### 方法1：自动部署（推荐）

**双击运行：**
```
scripts\deploy-both-platforms.bat
```

这会自动：
1. ✅ 提交所有更改
2. ✅ 推送到GitHub
3. ✅ 触发Vercel自动部署
4. ✅ 触发Cloudflare自动部署

---

### 方法2：手动部署

#### **步骤1：推送代码**
```bash
git add .
git commit -m "双平台部署配置"
git push origin main
```

#### **步骤2：配置Cloudflare**

1. 访问：https://dash.cloudflare.com/
2. 进入 **Workers & Pages**
3. 点击 **创建应用程序** → **Pages**
4. 连接GitHub仓库
5. 添加环境变量（见下方）

---

## 🔑 Cloudflare环境变量配置

在Cloudflare Pages设置中添加：

| 变量名称 | 说明 | 必需 |
|---------|------|------|
| `TONGYI_API_KEY` | 通义万相API密钥 | ✅ 是 |
| `REMOVEBG_API_KEY` | RemoveBG API密钥 | ⚠️ 可选 |
| `R2_ACCOUNT_ID` | R2存储账户ID | ⚠️ 可选 |
| `R2_ACCESS_KEY_ID` | R2访问密钥ID | ⚠️ 可选 |
| `R2_SECRET_ACCESS_KEY` | R2密钥 | ⚠️ 可选 |
| `R2_BUCKET_NAME` | R2存储桶名称 | ⚠️ 可选 |

**⚠️ 重要：**
- 变量名称必须**完全一致**（区分大小写）
- 选择**"加密"**类型保护敏感信息
- 应用到**"生产"**和**"预览"**环境

---

## 🌐 部署后的访问地址

### Vercel
```
https://your-project.vercel.app/
```

### Cloudflare  
```
https://ai-image-tools.pages.dev/
```

---

## ✅ 验证部署

### 测试清单（两个平台都要测试）

- [ ] 访问首页正常
- [ ] 访问工具页正常
- [ ] 图片生成功能正常（通义万相）
- [ ] 背景移除功能正常（如已配置）
- [ ] CSS样式加载正常
- [ ] JavaScript功能正常

---

## 🔧 故障排查

### Vercel问题
1. 检查 [Vercel Dashboard](https://vercel.com/dashboard)
2. 查看 Deployments → Build Logs
3. 查看 Runtime Logs

### Cloudflare问题
1. 检查 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 查看 Pages → Deployments
3. 查看 Functions → Logs

---

## 📚 详细文档

完整的部署指南：`docs/双平台部署指南.md`

---

## 💡 提示

- **首次部署：** 需要手动配置Cloudflare环境变量
- **后续更新：** 只需推送代码，两个平台自动部署
- **部署时间：** 约2-3分钟

---

## 🎉 开始部署吧！

1. **确认Cloudflare环境变量已添加**
2. **运行部署脚本或手动推送**
3. **等待2-3分钟**
4. **访问两个平台验证**

**祝部署顺利！** 🚀

