# 🚀 生产环境优化指南

本文档提供将网站部署到生产环境时的代码压缩和性能优化建议。

---

## 📦 代码压缩

### 1. JavaScript 压缩

使用 **Terser** 压缩JavaScript文件：

```bash
# 安装 Terser
npm install -g terser

# 压缩单个文件
terser js/tool.js --compress --mangle -o js/tool.min.js

# 批量压缩所有JS文件
for file in js/*.js; do
  terser "$file" --compress --mangle -o "${file%.js}.min.js"
done
```

### 2. CSS 压缩

使用 **cssnano** 或 **clean-css** 压缩CSS：

```bash
# 安装 clean-css
npm install -g clean-css-cli

# 压缩CSS文件
cleancss -o css/style.min.css css/style.css
cleancss -o css/language-switcher.min.css css/language-switcher.css
cleancss -o css/prompt-optimizer.min.css css/prompt-optimizer.css
```

### 3. HTML 压缩

使用 **html-minifier**：

```bash
# 安装 html-minifier
npm install -g html-minifier

# 压缩HTML
html-minifier --collapse-whitespace --remove-comments \
  --minify-css true --minify-js true \
  index.html -o index.min.html
```

---

## 🖼️ 图片优化

### 1. 使用现代图片格式

- **WebP**: 体积比JPEG小25-35%
- **AVIF**: 体积比WebP更小

```bash
# 安装 imagemin
npm install -g imagemin-cli imagemin-webp

# 转换为WebP
imagemin assets/*.{jpg,png} --plugin=webp > assets/
```

### 2. 图片懒加载

已集成在 `js/lazy-load.js` 中，使用方法：

```html
<!-- 使用 data-src 替代 src -->
<img data-src="image.jpg" alt="描述" loading="lazy">
```

---

## ⚡ CDN 加速

### 推荐的免费CDN服务

1. **Cloudflare CDN**（推荐）
   - 免费
   - 全球节点
   - 自动压缩
   - HTTPS支持

2. **jsDelivr**（用于静态资源）
   ```html
   <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/your-css@1.0.0/style.css">
   ```

3. **UNPKG**
   ```html
   <script src="https://unpkg.com/your-package@1.0.0/script.js"></script>
   ```

### 使用Cloudflare R2 + CDN

你已经配置了R2存储，现在可以：

1. 在Cloudflare启用自定义域名
2. 设置CDN分发
3. 启用自动压缩

---

## 🔧 构建工具（可选）

### 使用 Webpack 或 Vite

**方案1: Vite (推荐，更快)**

```bash
# 安装 Vite
npm install -D vite

# 创建 vite.config.js
cat > vite.config.js << EOF
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['axios'],
          'ai': ['js/tongyi-api.js', 'js/api-config.js']
        }
      }
    }
  }
});
EOF

# 构建生产版本
npx vite build
```

**方案2: Webpack**

```bash
# 安装 Webpack
npm install -D webpack webpack-cli

# 构建
npx webpack --mode production
```

---

## 📊 性能监控

### 1. 使用 Lighthouse

```bash
# 安装 Lighthouse
npm install -g lighthouse

# 运行性能测试
lighthouse http://localhost:3000 --view
```

### 2. 监控Web Vitals

已集成在 `js/performance.js` 中，会自动监控：
- ✅ FCP (First Contentful Paint)
- ✅ 页面加载时间
- ✅ 服务器响应时间
- ✅ 渲染时间

打开浏览器控制台查看性能报告。

---

## 🌐 生产环境部署清单

- [ ] 压缩所有JS文件（`.min.js`）
- [ ] 压缩所有CSS文件（`.min.css`）
- [ ] 优化图片（WebP/AVIF格式）
- [ ] 启用Gzip/Brotli压缩
- [ ] 配置CDN加速
- [ ] 设置浏览器缓存（Cache-Control）
- [ ] 启用HTTPS
- [ ] 配置CSP安全策略
- [ ] 移除console.log（生产环境）
- [ ] 更新sitemap.xml中的域名
- [ ] 提交sitemap到搜索引擎

---

## 🔒 安全优化

### 1. Content Security Policy (CSP)

在HTML中添加：

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' https://cdnjs.cloudflare.com; 
               style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;
               img-src 'self' data: https://pub-cbddee5991484904ac9e5399ab06dcd7.r2.dev;">
```

### 2. 环境变量安全

- ❌ 不要将 `.env` 文件部署到生产环境
- ✅ 使用服务器环境变量
- ✅ 使用密钥管理服务（如AWS Secrets Manager）

---

## 📈 SEO 优化清单

已完成的优化：
- ✅ Meta标签（description, keywords）
- ✅ Open Graph标签
- ✅ Twitter Card标签
- ✅ Structured Data (JSON-LD)
- ✅ sitemap.xml
- ✅ robots.txt
- ✅ Canonical链接
- ✅ 多语言支持（hreflang）

待完成：
- [ ] Google Search Console验证
- [ ] 百度站长工具验证
- [ ] 创建Google Analytics账户
- [ ] 添加社交分享按钮

---

## 🎯 性能目标

| 指标 | 目标值 | 当前状态 |
|------|--------|----------|
| 页面加载时间 | < 2秒 | ✅ |
| 首次内容绘制 (FCP) | < 1.8秒 | ✅ |
| 最大内容绘制 (LCP) | < 2.5秒 | 待测试 |
| 首次输入延迟 (FID) | < 100ms | ✅ |
| 累积布局偏移 (CLS) | < 0.1 | ✅ |
| Lighthouse评分 | > 90 | 待测试 |

---

## 📞 需要帮助？

如有任何问题，请查阅：
- [Vite 文档](https://vitejs.dev/)
- [Webpack 文档](https://webpack.js.org/)
- [Web.dev 性能指南](https://web.dev/performance/)
- [Google Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

**最后更新**: 2025-10-21

