# 🚀 GitHub 推送指南

**目标仓库**: https://github.com/kydomain1/images.git

---

## 📋 方法一：使用自动脚本（推荐）

### 步骤

1. **双击运行脚本**
   ```
   push-to-github.bat
   ```

2. **等待完成**
   - 脚本会自动完成所有步骤
   - 如果提示输入 GitHub 凭据，请输入您的用户名和密码/Token

3. **验证**
   - 访问: https://github.com/kydomain1/images
   - 确认文件已上传

---

## 📋 方法二：手动执行命令

### 在 PowerShell 或 CMD 中依次执行：

```bash
# 1. 初始化 Git 仓库
git init

# 2. 添加所有文件
git add .

# 3. 提交
git commit -m "Initial commit: AI图片生成器完整项目"

# 4. 设置主分支
git branch -M main

# 5. 添加远程仓库
git remote add origin https://github.com/kydomain1/images.git

# 6. 推送到 GitHub
git push -u origin main
```

---

## ⚠️ 常见问题

### 1. 远程仓库已存在内容

如果提示 `rejected` 或 `non-fast-forward`：

```bash
# 强制推送（会覆盖远程内容，请谨慎）
git push -u origin main --force
```

### 2. 需要输入凭据

**选项 A - 使用 Personal Access Token（推荐）**：
1. 访问 GitHub Settings → Developer settings → Personal access tokens
2. 生成新的 Token（勾选 `repo` 权限）
3. 用 Token 作为密码

**选项 B - 配置 Git 凭据**：
```bash
git config --global user.name "您的GitHub用户名"
git config --global user.email "您的GitHub邮箱"
```

### 3. 已经添加过远程仓库

如果提示 `remote origin already exists`：

```bash
# 删除旧的远程仓库
git remote remove origin

# 重新添加
git remote add origin https://github.com/kydomain1/images.git
```

---

## 📦 推送内容清单

### 包含的文件和目录：

✅ **核心文件**:
- `index.html` - 主页
- `tool.html` - 图片生成工具页
- `server-with-r2.js` - Node.js 服务器

✅ **样式和脚本**:
- `css/` - 所有样式文件
- `js/` - 所有 JavaScript 文件

✅ **多语言支持**:
- `js/i18n.js` - 17种语言翻译

✅ **政策页面**:
- `pages/privacy.html` - 隐私政策
- `pages/terms.html` - 服务条款
- `pages/about.html` - 关于我们
- `pages/contact.html` - 联系我们

✅ **文档**:
- `docs/` - 所有说明文档
- `README.md` - 项目说明

✅ **配置文件**:
- `package.json` - Node.js 依赖
- `sitemap.xml` - SEO 站点地图
- `robots.txt` - 搜索引擎爬虫规则
- `.gitignore` - Git 忽略规则

❌ **排除的内容**（见 `.gitignore`）:
- `node_modules/` - npm 包
- `.env` - 环境变量（包含 API 密钥）
- `uploads/` - 上传的文件

---

## 🔒 安全提醒

### ⚠️ 重要：检查敏感信息

推送前请确认：

1. **`.env` 文件已在 `.gitignore` 中**
   - ✅ 已自动添加
   - 包含的敏感信息：API 密钥、R2 凭据

2. **没有硬编码的密钥**
   - 检查所有 `.js` 文件
   - 确保使用环境变量

3. **上传文件夹为空**
   - `uploads/` 目录已排除
   - 只保留 `.gitkeep` 文件

---

## 📊 项目统计

```
总文件数: 约 50+ 个
代码行数: 约 10,000+ 行
支持语言: 17 种
页面数量: 6 个主要页面
功能特性: 
  ✅ 多语言国际化
  ✅ 通义万相 API 集成
  ✅ 图片生成和历史记录
  ✅ SEO 优化
  ✅ 响应式设计
  ✅ 性能监控
```

---

## ✅ 推送后的步骤

### 1. 在 GitHub 上配置

**Settings → Secrets and variables → Actions**:
- 添加 `TONGYI_API_KEY`
- 添加 `R2_ACCESS_KEY_ID`
- 添加 `R2_SECRET_ACCESS_KEY`
- 添加其他环境变量

### 2. 部署到 Vercel/Netlify（可选）

如果需要在线部署：

**Vercel**:
```bash
npm install -g vercel
vercel
```

**Netlify**:
```bash
npm install -g netlify-cli
netlify deploy
```

### 3. 更新 README

编辑 `README.md`，添加：
- 在线演示链接
- 部署说明
- 使用指南

---

## 🎯 后续更新

推送后，每次修改代码都可以使用：

```bash
# 添加修改的文件
git add .

# 提交
git commit -m "描述你的修改"

# 推送
git push
```

或者再次运行 `push-to-github.bat`

---

## 📞 需要帮助？

如果遇到问题：

1. **查看 Git 状态**:
   ```bash
   git status
   ```

2. **查看提交历史**:
   ```bash
   git log --oneline
   ```

3. **查看远程仓库**:
   ```bash
   git remote -v
   ```

---

**🎉 准备就绪！双击 `push-to-github.bat` 开始推送！**

---

**创建时间**: 2025-10-21  
**项目名称**: AI图片生成器  
**GitHub 仓库**: https://github.com/kydomain1/images

