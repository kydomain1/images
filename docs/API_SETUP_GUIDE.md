# AI图片生成API接入指南

本项目已集成多个免费AI图片生成API，您可以根据需求选择使用。

## 🚀 快速开始（无需配置）

项目默认使用 **Pollinations.ai**，这是一个完全免费且无需API Key的服务！

**直接打开 `tool.html` 即可使用真实的AI图片生成功能！** ✅

---

## 📋 支持的API服务对比

| API服务 | 免费额度 | 需要API Key | 图片质量 | 速度 | 中文支持 | 推荐指数 |
|---------|---------|------------|---------|------|---------|---------|
| **Pollinations** | 无限制 | ❌ 不需要 | ⭐⭐⭐⭐ | 快 | ✅ | ⭐⭐⭐⭐⭐ |
| **Hugging Face** | 有限制 | ✅ 需要 | ⭐⭐⭐⭐⭐ | 中等 | ✅ | ⭐⭐⭐⭐ |
| **Craiyon** | 无限制 | ❌ 不需要 | ⭐⭐⭐ | 慢 | ✅ | ⭐⭐⭐ |
| **DeepAI** | 有限制 | ✅ 需要 | ⭐⭐⭐⭐ | 快 | ✅ | ⭐⭐⭐⭐ |
| **Stability AI** | 有限额度 | ✅ 需要 | ⭐⭐⭐⭐⭐ | 快 | ✅ | ⭐⭐⭐⭐⭐ |

---

## 🎯 切换到其他API服务

### 方法1: 使用Pollinations（默认，无需配置）

已经默认启用，无需任何操作！

### 方法2: 使用Hugging Face（免费，需注册）

1. **注册并获取API Key**
   - 访问：https://huggingface.co/join
   - 注册账号（免费）
   - 前往：https://huggingface.co/settings/tokens
   - 创建新的Access Token

2. **配置API Key**
   ```javascript
   // 编辑 js/api-config.js
   const API_CONFIG = {
       provider: 'huggingface', // 改为huggingface
       huggingface: {
           apiKey: '你的API_KEY', // 填入你的API Key
           model: 'stabilityai/stable-diffusion-2-1',
           endpoint: 'https://api-inference.huggingface.co/models/'
       }
   };
   ```

3. **刷新页面即可使用**

### 方法3: 使用DeepAI（有免费额度）

1. **获取API Key**
   - 访问：https://deepai.org/
   - 注册账号
   - 前往：https://deepai.org/dashboard/profile
   - 复制API Key

2. **配置**
   ```javascript
   // 编辑 js/api-config.js
   const API_CONFIG = {
       provider: 'deepai',
       deepai: {
           apiKey: '你的API_KEY'
       }
   };
   ```

### 方法4: 使用Stability AI（高质量，有免费额度）

1. **获取API Key**
   - 访问：https://platform.stability.ai/
   - 注册账号（新用户有免费额度）
   - 前往：https://platform.stability.ai/account/keys
   - 创建API Key

2. **配置**
   ```javascript
   // 编辑 js/api-config.js
   const API_CONFIG = {
       provider: 'stability',
       stability: {
           apiKey: '你的API_KEY'
       }
   };
   ```

### 方法5: 使用通义万相（阿里云，适合国内）

1. **开通服务**
   - 访问：https://dashscope.aliyun.com/
   - 登录阿里云账号
   - 开通通义万相服务（新用户免费1000次）
   - 获取API Key

2. **配置**
   ```javascript
   // 编辑 js/api-config.js
   const API_CONFIG = {
       provider: 'tongyi',
       tongyi: {
           apiKey: '你的API_KEY',
           endpoint: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis'
       }
   };
   ```

---

## 🔧 API配置文件说明

配置文件：`js/api-config.js`

```javascript
const API_CONFIG = {
    // 选择使用的API（重要！）
    provider: 'pollinations', // 可选: huggingface, craiyon, deepai, stability, pollinations
    
    // 各个API的配置
    huggingface: {
        apiKey: '', // 填入你的API Key
        model: 'stabilityai/stable-diffusion-2-1'
    },
    // ... 其他配置
};
```

---

## 💡 使用建议

### 个人项目/学习
- **推荐**：Pollinations（默认）
- **理由**：免费无限、无需注册、速度快

### 商业项目/高质量需求
- **推荐**：Stability AI 或 Hugging Face
- **理由**：图片质量高、稳定性好

### 国内用户
- **推荐**：通义万相
- **理由**：访问速度快、中文支持好

---

## 🐛 常见问题

### Q1: 图片生成失败怎么办？
**A**: 
1. 检查网络连接
2. 确认API Key配置正确
3. 查看浏览器控制台错误信息
4. 检查是否超出免费额度

### Q2: 生成速度慢怎么办？
**A**:
- Pollinations和DeepAI速度较快
- Craiyon速度较慢（但免费无限）
- 可以减少单次生成数量

### Q3: 如何获得更高质量的图片？
**A**:
1. 使用Stability AI或Hugging Face
2. 提供更详细的提示词
3. 使用负面提示词排除不想要的元素
4. 调整创意程度参数

### Q4: API Key安全吗？
**A**:
- 当前配置在前端，仅适合个人开发/测试
- **生产环境建议**：将API调用放在后端服务器
- 使用环境变量存储API Key
- 添加速率限制和用户认证

---

## 🔐 安全建议（生产环境）

如果要部署到生产环境，建议：

1. **创建后端服务**
   ```javascript
   // 后端示例 (Node.js + Express)
   app.post('/api/generate', async (req, res) => {
       const { prompt, settings } = req.body;
       
       // API Key存储在服务器环境变量中
       const apiKey = process.env.HUGGINGFACE_API_KEY;
       
       // 调用API
       const result = await fetch(endpoint, {
           headers: { 'Authorization': `Bearer ${apiKey}` },
           // ...
       });
       
       res.json(result);
   });
   ```

2. **添加速率限制**
3. **用户认证**
4. **成本控制**

---

## 📚 参考链接

- [Pollinations.ai 文档](https://pollinations.ai/)
- [Hugging Face API 文档](https://huggingface.co/docs/api-inference/)
- [DeepAI 文档](https://deepai.org/docs)
- [Stability AI 文档](https://platform.stability.ai/docs)
- [通义万相 文档](https://help.aliyun.com/zh/dashscope/)

---

## 🎉 开始使用

1. **快速体验**：直接打开 `tool.html`（使用Pollinations）
2. **升级体验**：选择一个API服务并配置
3. **生产部署**：创建后端服务保护API Key

祝您使用愉快！🚀


