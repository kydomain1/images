# 📁 项目文件结构说明

**最后更新**: 2025-10-21  
**版本**: 1.0.0

---

## 📂 整体目录结构

```
D:\images\
├── 📄 核心文件
│   ├── index.html              # 首页
│   ├── tool.html               # 图片生成工具页
│   ├── server-with-r2.js       # ⭐ 生产服务器（通义万相 + R2）
│   ├── package.json            # Node.js 项目配置
│   ├── .env                    # 环境变量（不纳入版本控制）
│   ├── .gitignore              # Git 忽略配置
│   ├── sitemap.xml             # 站点地图（SEO）
│   └── robots.txt              # 爬虫规则（SEO）
│
├── 📁 css/                     # 样式文件
│   ├── style.css               # 主样式
│   ├── language-switcher.css  # 语言切换器样式
│   ├── policy-pages.css       # 政策页面样式
│   └── prompt-optimizer.css   # 提示词优化器样式
│
├── 📁 js/                      # JavaScript文件
│   ├── config.js               # ⭐ 全局配置管理
│   ├── i18n.js                 # 多语言翻译
│   ├── main.js                 # 首页逻辑
│   ├── tool.js                 # 工具页逻辑
│   ├── api-config.js           # API配置中心
│   ├── tongyi-api.js           # 通义万相API客户端
│   ├── prompt-optimizer.js     # 提示词优化逻辑
│   ├── lazy-load.js            # 图片懒加载
│   ├── performance.js          # 性能优化和监控
│   ├── contact.js              # 联系表单逻辑
│   └── policy.js               # 政策页面逻辑
│
├── 📁 pages/                   # 其他页面
│   ├── privacy.html            # 隐私政策
│   ├── terms.html              # 服务条款
│   ├── about.html              # 关于我们
│   ├── contact.html            # 联系我们
│   └── index-multilang.html    # 多语言首页（备用）
│
├── 📁 docs/                    # 文档目录
│   ├── 🌟 主要文档
│   │   ├── README.md           # 项目说明（docs版本）
│   │   ├── 网站检查总结.txt    # 网站检查总结
│   │   ├── 当前配置状态.md     # 配置状态
│   │   ├── 翻译完成情况.md     # 翻译状态
│   │   └── 配置完成.txt         # 配置记录
│   │
│   ├── 📚 功能说明
│   │   ├── AI提示词优化助手使用说明.md
│   │   ├── 历史记录功能说明.md
│   │   ├── 多语言使用指南.md
│   │   ├── 功能扩展建议.md
│   │   └── 文件夹结构说明.md
│   │
│   ├── 🔧 配置指南
│   │   ├── API_SETUP_GUIDE.md
│   │   ├── 通义万相接入指南.md
│   │   ├── 快速配置-通义万相.txt
│   │   ├── R2配置说明.md
│   │   ├── R2快速启动指南.txt
│   │   ├── 启动服务器说明.txt
│   │   ├── 外部AI服务集成指南.md
│   │   └── 切换到稳定API方案.md
│   │
│   ├── 🗃️ 已弃用的指南
│   │   ├── DeepAI接入指南.md
│   │   ├── 快速配置-DeepAI.txt
│   │   └── 图生图和高清放大功能说明.md
│   │
│   └── 📦 archive/             # 归档文件
│       ├── Replicate快速配置指南.md
│       ├── server.js           # 早期服务器版本
│       ├── server-clean.js     # 旧版服务器
│       └── server-replicate.js # Replicate服务器（已停用）
│
├── 📁 scripts/                 # 启动脚本
│   ├── 启动服务器.bat
│   └── 启动R2服务器.bat
│
├── 📁 test/                    # 测试文件
│   ├── test-tongyi.html        # 通义万相测试
│   ├── test-deepai.html        # DeepAI测试
│   └── test-pollinations.html  # Pollinations测试
│
├── 📁 components/              # 组件（备用）
│   └── language-switcher.html  # 语言切换器组件
│
├── 📁 uploads/                 # 上传文件目录
│   └── .gitkeep                # 保持目录存在
│
└── 📄 项目文档（根目录）
    ├── README.md               # ⭐ 项目主文档
    ├── PROJECT_STRUCTURE.md    # 本文件
    ├── WEBSITE_AUDIT_REPORT.md # 网站审查报告
    ├── FIXES_APPLIED.md        # 已应用的修复
    ├── SEO_CHECKLIST.md        # SEO优化清单
    └── PRODUCTION_OPTIMIZATION.md  # 生产环境优化指南
```

---

## 🗂️ 文件用途说明

### 核心HTML文件

| 文件 | 用途 | 状态 |
|------|------|------|
| `index.html` | 网站首页，展示功能介绍 | ✅ 生产环境 |
| `tool.html` | 图片生成工具主页面 | ✅ 生产环境 |

### 服务器文件

| 文件 | 用途 | 状态 |
|------|------|------|
| `server-with-r2.js` | 主服务器（通义万相 + R2存储） | ✅ 当前使用 |
| `server.js` | 早期版本 | 📦 已归档 |
| `server-clean.js` | 旧版本 | 📦 已归档 |
| `server-replicate.js` | Replicate版本（已停用） | 📦 已归档 |

### CSS样式文件

| 文件 | 用途 |
|------|------|
| `style.css` | 全局样式，Morandi配色 |
| `language-switcher.css` | 语言切换器样式 |
| `policy-pages.css` | 政策页面专用样式 |
| `prompt-optimizer.css` | 提示词优化器样式 |

### JavaScript核心文件

| 文件 | 用途 | 优先级 |
|------|------|--------|
| `config.js` | 全局配置、环境检测、日志系统 | ⭐⭐⭐ |
| `i18n.js` | 18种语言翻译数据和逻辑 | ⭐⭐⭐ |
| `tool.js` | 图片生成工具主逻辑 | ⭐⭐⭐ |
| `api-config.js` | API配置和管理 | ⭐⭐⭐ |
| `tongyi-api.js` | 通义万相API客户端 | ⭐⭐⭐ |
| `prompt-optimizer.js` | AI提示词优化逻辑 | ⭐⭐ |
| `lazy-load.js` | 图片懒加载实现 | ⭐⭐ |
| `performance.js` | 性能监控和优化 | ⭐⭐ |
| `main.js` | 首页交互逻辑 | ⭐ |
| `contact.js` | 联系表单逻辑 | ⭐ |
| `policy.js` | 政策页面逻辑 | ⭐ |

---

## 📝 文档分类

### 主要文档（根目录）

1. **README.md** - 项目主文档
   - 功能介绍
   - 快速开始
   - 使用说明
   - 技术栈

2. **PROJECT_STRUCTURE.md** - 本文件
   - 文件结构说明
   - 文件用途
   - 维护指南

3. **WEBSITE_AUDIT_REPORT.md**
   - 完整网站审查
   - 问题列表
   - 优化建议

4. **FIXES_APPLIED.md**
   - 已修复的问题
   - 新增功能
   - 使用指南

5. **SEO_CHECKLIST.md**
   - SEO优化清单
   - 待完成任务
   - 提交指南

6. **PRODUCTION_OPTIMIZATION.md**
   - 生产环境部署
   - 代码压缩
   - CDN配置

### 功能文档（docs/）

- 各功能模块的详细说明
- 配置指南和快速开始
- 历史开发记录

### 归档文档（docs/archive/）

- 已弃用功能的文档
- 旧版本服务器文件
- 历史配置文件

---

## 🔧 重要配置文件

### .env（环境变量）

```env
# 通义万相API
TONGYI_API_KEY=your_api_key

# Cloudflare R2
R2_BUCKET_NAME=images
R2_ENDPOINT=https://xxx.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://pub-xxx.r2.dev
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
```

### package.json（依赖）

主要依赖：
- `express` - Web服务器
- `axios` - HTTP客户端
- `@aws-sdk/client-s3` - R2存储客户端
- `cors` - CORS中间件
- `dotenv` - 环境变量管理

---

## 📊 文件统计

| 类型 | 数量 | 备注 |
|------|------|------|
| HTML文件 | 7个 | 2个主页面 + 5个页面 |
| CSS文件 | 4个 | 模块化样式 |
| JavaScript文件 | 11个 | 功能模块化 |
| 服务器文件 | 1个 | server-with-r2.js |
| 文档文件 | 20+个 | 完整文档体系 |
| 配置文件 | 5个 | package.json, .env, sitemap, robots, .gitignore |

---

## 🎯 维护建议

### 日常开发

1. **主要工作文件**：
   - 前端：`tool.html`, `js/tool.js`, `js/api-config.js`
   - 后端：`server-with-r2.js`
   - 样式：`css/style.css`

2. **配置修改**：
   - 全局配置：`js/config.js`
   - API配置：`.env`

3. **文档更新**：
   - 功能变更：更新 `README.md`
   - 新增功能：在 `docs/` 中创建说明文档

### 代码规范

- **命名规范**：驼峰命名法（camelCase）
- **注释规范**：文件头部必须有功能说明
- **日志规范**：使用 `Logger` 代替 `console.log`

### 版本控制

- ✅ **需要提交**：所有代码、配置、文档
- ❌ **不要提交**：`.env`, `node_modules/`, `uploads/*`, `*.log`

---

## 🚀 部署流程

### 1. 开发环境
```bash
npm install
node server-with-r2.js
# 访问 http://localhost:3000
```

### 2. 生产环境
```bash
# 1. 配置环境变量
# 2. 压缩代码（见PRODUCTION_OPTIMIZATION.md）
# 3. 配置HTTPS
# 4. 启动服务器
node server-with-r2.js
```

---

## 📞 快速查找

### 我想修改...

| 需求 | 文件位置 |
|------|----------|
| 首页内容 | `index.html` |
| 工具页面 | `tool.html` |
| 全局样式 | `css/style.css` |
| 添加翻译 | `js/i18n.js` |
| 修改API | `server-with-r2.js` |
| 配置域名 | `js/config.js` |
| SEO标签 | `index.html`, `tool.html` |
| 添加页面 | `pages/` |

---

## ⚠️ 注意事项

1. **不要直接修改归档文件**（`docs/archive/`）
2. **修改.env后需要重启服务器**
3. **生产环境部署前检查所有localhost引用**
4. **定期备份.env文件**（但不要提交到git）
5. **上传文件会被自动忽略**（uploads/）

---

## 🔄 更新日志

### v1.0.0 (2025-10-21)
- ✅ 整理根目录文档到 docs/
- ✅ 创建 archive/ 归档目录
- ✅ 移动旧版服务器文件到归档
- ✅ 清理 uploads/ 测试文件
- ✅ 创建 .gitignore 文件
- ✅ 生成本文件结构说明

---

**维护者**: AI Assistant  
**创建日期**: 2025-10-21  
**最后更新**: 2025-10-21

如有疑问，请参考 `README.md` 或查看各模块的详细文档。

