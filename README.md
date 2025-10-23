# 🎨 AI图片生成器

一个功能强大的AI图片处理工具，支持文字生成图片、背景移除、图片放大、滤镜效果、裁剪和格式转换等多种功能。

## ✨ 主要功能

### **6大核心功能**

1. **文字生成图片** - 使用通义万相API，图片永久保存到R2
2. **背景移除** - Remove.bg AI专业级背景移除
3. **AI高清放大** - 6大增强技术，2x/3x/4x放大
4. **滤镜效果** - 12种预设滤镜 + 4种调节
5. **图片裁剪** - 7种预设比例，智能居中裁剪
6. **格式转换** - 支持批量转换PNG/JPEG/WebP

### **特色功能**
- 🌍 支持16种语言
- ☁️ R2永久存储
- 📦 批量处理
- 🖼️ 全屏图片查看
- 📜 历史记录

---

## 🚀 快速开始

### **1. 安装依赖**
```bash
npm install
```

### **2. 配置API**

复制 `.env.template` 为 `.env`，填入以下配置：

```env
# 通义万相API（文字生成图片）
TONGYI_API_KEY=your_tongyi_key_here

# Remove.bg API（背景移除）
REMOVEBG_API_KEY=your_removebg_key_here

# Cloudflare R2存储（可选）
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_URL=https://pub-xxxxx.r2.dev
```

### **3. 启动服务器**
```bash
node server-with-r2.js
```

或直接双击运行：
```
启动服务器-最终版.bat
```

### **4. 访问网站**
```
http://localhost:3000/tool.html
```

---

## 📖 功能使用

### **文字生成图片**
1. 输入中文提示词
2. 选择尺寸和风格
3. 点击"生成图片"
4. 图片自动保存到R2存储

### **背景移除**
1. 上传图片
2. 选择图片类型预设
3. 点击"移除背景"
4. 下载透明PNG

### **AI高清放大**
1. 上传图片
2. 选择2x放大 + 超分辨率算法
3. 勾选锐化和降噪
4. 下载高清图片

### **滤镜效果**
1. 上传图片
2. 点击预设滤镜或拖动滑块
3. 实时查看效果
4. 下载处理后图片

### **图片裁剪**
1. 上传图片
2. 选择裁剪比例（如1:1）
3. 执行裁剪
4. 下载裁剪后图片

### **格式转换**
1. 批量上传图片
2. 选择目标格式（PNG/JPEG/WebP）
3. 批量转换
4. 批量下载

---

## 🌍 多语言支持

支持16种语言，包括：
- 中文、English、日本語、한국어
- Español、Français、Deutsch、Português
- Русский、العربية、हिन्दी、ไทย
- Tiếng Việt、Bahasa Indonesia、Italiano、Türkçe

点击右上角语言切换器即可切换。

---

## 💰 API成本

### **免费额度：**
- Remove.bg: 50次/月免费
- R2存储: 10GB免费

### **付费部分：**
- 通义万相: 按量计费（约¥0.2-0.5/张）

---

## 📝 技术说明

### **前端技术：**
- Canvas API（图像处理）
- Fetch API（网络请求）
- LocalStorage（历史记录）
- 响应式设计

### **后端技术：**
- Node.js + Express
- 通义万相API集成
- Remove.bg API集成
- Cloudflare R2 SDK

### **核心算法：**
- USM超级锐化
- CLAHE对比度增强
- 边缘检测和重建
- 双边滤波降噪
- 多步骤渐进放大

---

## 📄 文档

详细文档位于 `docs/` 目录：
- API配置指南
- 功能使用说明
- 多语言指南
- 性能优化指南

---

## 🤝 贡献

欢迎提交Issue和Pull Request！

---

## 📜 许可

© 2025 AI图片生成器. 保留所有权利.

---

**享受创作吧！** 🎨✨
