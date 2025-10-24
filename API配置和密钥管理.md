# 🔑 API配置和密钥管理

## 📋 当前配置的API密钥

---

## ✅ 已配置的API

### **1. 通义万相 API**
- **状态**: ✅ 已配置
- **用途**: 文字生成图片
- **文件位置**: `.env` 文件中的 `TONGYI_API_KEY`
- **获取地址**: https://dashscope.console.aliyun.com/

### **2. Remove.bg API**
- **状态**: ✅ 已配置
- **用途**: AI背景移除
- **文件位置**: `.env` 文件中的 `REMOVEBG_API_KEY`
- **获取地址**: https://www.remove.bg/api

### **3. Cloudflare R2**
- **状态**: ✅ 已配置
- **用途**: 图片永久存储
- **配置项**: 
  - `R2_ACCESS_KEY_ID`
  - `R2_SECRET_ACCESS_KEY`
  - `R2_BUCKET_NAME`
  - `R2_ENDPOINT`
  - `R2_PUBLIC_URL`
- **管理地址**: https://dash.cloudflare.com/

---

## 🔧 配置文件位置

### **本地开发**
```
.env                    # 本地环境变量（不提交到Git）
env.template            # 环境变量模板
```

### **Vercel部署**
```
Vercel Dashboard → 项目设置 → Environment Variables
```

---

## 📝 完整的环境变量清单

```bash
# ==========================================
# 通义万相 API（阿里云）
# ==========================================
TONGYI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx

# 获取方式：
# 1. 访问 https://dashscope.console.aliyun.com/
# 2. 登录后进入"API-KEY管理"
# 3. 创建新的API Key
# 4. 复制密钥到这里

# ==========================================
# Remove.bg API
# ==========================================
REMOVEBG_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxx

# 获取方式：
# 1. 访问 https://www.remove.bg/users/sign_up
# 2. 注册并登录
# 3. 进入 https://www.remove.bg/api
# 4. 复制API Key到这里

# ==========================================
# Cloudflare R2 存储
# ==========================================
R2_ACCESS_KEY_ID=b815b9e739d5faf7af43b921ecc45e96
R2_SECRET_ACCESS_KEY=7e53018b389db72b8bfe58190b0aa72974c2df199b7146cf75b4a45a922efe97
R2_BUCKET_NAME=images
R2_ENDPOINT=https://a86b7f2b20d627f1735a95fb923660d2.r2.cloudflarestorage.com
R2_PUBLIC_URL=https://pub-cbddee5991484904ac9e5399ab06dcd7.r2.dev

# 获取方式：
# 1. 访问 https://dash.cloudflare.com/
# 2. 进入 R2 服务
# 3. 创建或选择存储桶
# 4. 生成 API 令牌
# 5. 复制所有配置项

# ==========================================
# 其他配置
# ==========================================
NODE_ENV=production
PORT=3000
```

---

## 🚀 API获取详细步骤

### **1. 获取通义万相 API Key**

#### **步骤：**
1. 访问阿里云控制台：https://dashscope.console.aliyun.com/
2. 如果没有账号，先注册阿里云账号
3. 登录后，在左侧菜单找到"API-KEY管理"
4. 点击"创建新的API-KEY"
5. 复制生成的密钥（格式：`sk-xxxxxxxxxx`）
6. 粘贴到 `.env` 文件的 `TONGYI_API_KEY=` 后面

#### **免费额度：**
- 每月500次调用
- 超出后按次计费：约¥0.06/张

---

### **2. 获取 Remove.bg API Key**

#### **步骤：**
1. 访问 Remove.bg：https://www.remove.bg/users/sign_up
2. 注册账号（支持Google、Facebook登录）
3. 登录后访问：https://www.remove.bg/api
4. 在"API Key"部分找到您的密钥
5. 点击"Show"显示完整密钥
6. 复制并粘贴到 `.env` 文件的 `REMOVEBG_API_KEY=` 后面

#### **免费额度：**
- 每月50次调用
- 超出后按次计费：$0.20-$2.00/张

---

### **3. 配置 Cloudflare R2**

#### **步骤：**
1. 访问 Cloudflare：https://dash.cloudflare.com/
2. 注册/登录账号
3. 在左侧菜单选择"R2"
4. 创建新的存储桶（Bucket），名称：`images`
5. 进入"设置" → "R2 API 令牌"
6. 点击"创建 API 令牌"
7. 权限选择："对象读写"
8. 复制生成的：
   - Access Key ID
   - Secret Access Key
   - 存储桶端点 URL
9. 配置公共域名（可选）

#### **免费额度：**
- 10GB 存储空间
- 每月100万次读取
- 每月100万次写入

---

## 🔒 密钥安全管理

### **✅ 正确做法**

1. **使用 .env 文件**
   ```bash
   # 在 .env 文件中存储密钥
   TONGYI_API_KEY=sk-xxxxxxxxxx
   ```

2. **添加到 .gitignore**
   ```
   .env
   .env.local
   .env.production
   ```

3. **使用环境变量**
   ```javascript
   // Node.js 中读取
   const apiKey = process.env.TONGYI_API_KEY;
   ```

4. **服务器端代理**
   ```javascript
   // 不在前端直接调用API
   // 通过后端代理
   fetch('/api/tongyi/generate', { ... });
   ```

### **❌ 错误做法**

1. **不要在前端代码中硬编码**
   ```javascript
   // ❌ 错误！
   const apiKey = 'sk-xxxxxxxxxx';
   ```

2. **不要提交到Git**
   ```bash
   # ❌ 不要这样做
   git add .env
   git commit -m "add api keys"
   ```

3. **不要在URL中暴露**
   ```javascript
   // ❌ 错误！
   fetch(`https://api.example.com?key=sk-xxx`);
   ```

---

## 🔄 API密钥轮换

### **定期更换密钥（推荐）**

1. **通义万相**
   - 在控制台禁用旧密钥
   - 创建新密钥
   - 更新 `.env` 文件
   - 重启服务器

2. **Remove.bg**
   - 在Dashboard重新生成密钥
   - 更新配置
   - 重启服务器

3. **Cloudflare R2**
   - 创建新的API令牌
   - 更新所有R2配置
   - 删除旧令牌

---

## 📊 API使用监控

### **检查API用量**

#### **通义万相**
```
访问：https://dashscope.console.aliyun.com/
查看：用量统计 → API调用次数
```

#### **Remove.bg**
```
访问：https://www.remove.bg/dashboard
查看：Current usage（当前用量）
```

#### **Cloudflare R2**
```
访问：https://dash.cloudflare.com/
查看：R2 → 存储桶 → 分析
```

---

## 🚨 API问题排查

### **1. API调用失败**

**检查清单：**
- [ ] 密钥是否正确配置在 `.env` 文件中
- [ ] `.env` 文件是否在项目根目录
- [ ] 服务器是否重启（修改`.env`后需要重启）
- [ ] API密钥是否有效（未过期或被禁用）
- [ ] 是否超出免费额度
- [ ] 网络连接是否正常

### **2. 环境变量读取失败**

**解决方法：**
```javascript
// 检查环境变量是否加载
console.log('TONGYI_API_KEY:', process.env.TONGYI_API_KEY ? '已配置' : '未配置');
console.log('REMOVEBG_API_KEY:', process.env.REMOVEBG_API_KEY ? '已配置' : '未配置');

// 确保在服务器启动时加载
require('dotenv').config();
```

### **3. Vercel部署后API不工作**

**原因：**Vercel不会读取本地的 `.env` 文件

**解决方法：**
1. 在Vercel Dashboard中手动添加环境变量
2. 项目设置 → Environment Variables
3. 添加所有必需的变量
4. 重新部署

---

## 📦 导出/备份配置

### **导出当前配置**

```bash
# 复制 .env 到安全位置
cp .env .env.backup

# 或创建加密备份
# (请使用密码管理器或加密工具)
```

### **恢复配置**

```bash
# 从备份恢复
cp .env.backup .env

# 重启服务器
npm run start
```

---

## 🎯 配置检查清单

### **本地开发环境**
- [ ] `.env` 文件已创建
- [ ] `TONGYI_API_KEY` 已配置
- [ ] `REMOVEBG_API_KEY` 已配置
- [ ] R2相关配置已完成
- [ ] `.env` 已添加到 `.gitignore`
- [ ] 服务器可以正常启动
- [ ] API功能测试通过

### **Vercel部署环境**
- [ ] 所有环境变量已在Vercel中配置
- [ ] 变量名称与本地一致
- [ ] 变量值正确无误
- [ ] 已重新部署项目
- [ ] 线上API功能测试通过

---

## 📞 获取帮助

### **API相关问题**
- **通义万相**：https://help.aliyun.com/zh/dashscope/
- **Remove.bg**：support@remove.bg
- **Cloudflare R2**：https://community.cloudflare.com/

---

**请妥善保管所有API密钥，不要泄露！** 🔐


