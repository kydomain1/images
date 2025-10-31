# ✅ Cloudflare 405错误修复

## 📅 日期：2025-10-25

## ❌ 错误信息

```
POST https://seedream-4.info/api/tongyi-generate 405 (Method Not Allowed)
```

---

## 🔍 问题原因

### **Cloudflare Pages Functions的路由机制**

Cloudflare Pages Functions根据**文件路径**自动生成URL路由：

**错误的目录结构：**
```
functions/
├── tongyi-generate.js  → 映射为 /tongyi-generate ❌
└── remove-bg.js        → 映射为 /remove-bg ❌
```

**前端调用：**
```javascript
/api/tongyi-generate  // 找不到，返回405
```

---

## ✅ 解决方案

### **正确的目录结构**

```
functions/
└── api/
    ├── tongyi-generate.js  → 映射为 /api/tongyi-generate ✅
    └── remove-bg.js        → 映射为 /api/remove-bg ✅
```

### **关键点：**
1. ✅ 文件路径 = URL路径
2. ✅ `functions/api/xxx.js` → `/api/xxx`
3. ✅ Cloudflare自动处理，无需手动配置重定向

---

## 🔧 已执行的修复

### **1. 调整目录结构**

```bash
# 创建api子目录
mkdir functions\api

# 移动文件
move functions\tongyi-generate.js functions\api\
move functions\remove-bg.js functions\api\
```

### **2. 更新 _redirects 文件**

删除了不必要的API重定向规则，因为Cloudflare会自动处理。

### **3. 保持其他文件不变**

- ✅ `functions/api/tongyi-generate.js` - Workers代码无需修改
- ✅ `functions/api/remove-bg.js` - Workers代码无需修改

---

## 📝 推送更新

### **提交更改：**

```bash
git add functions/ _redirects docs/
git commit -m "fix: 修复Cloudflare Functions路由 - 调整目录结构"
git push origin main
```

### **Cloudflare自动重新部署：**
- ⏱️ 约1-2分钟完成
- 🔄 自动检测 `functions/api/` 目录
- ✅ API路由自动生效

---

## ✅ 验证修复

### **部署完成后测试：**

1. **访问网站：**
   ```
   https://seedream-4.info/
   ```

2. **测试图片生成：**
   - 输入提示词
   - 点击生成
   - 应该能正常工作

3. **检查开发者工具：**
   ```
   POST /api/tongyi-generate  → 200 OK ✅
   ```

---

## 📚 Cloudflare Pages Functions 路由规则

### **自动路由映射：**

| 文件路径 | URL路径 |
|---------|---------|
| `functions/hello.js` | `/hello` |
| `functions/api/test.js` | `/api/test` |
| `functions/api/v1/user.js` | `/api/v1/user` |
| `functions/[id].js` | `/:id` (动态路由) |

### **注意事项：**

1. ✅ 文件名决定路由
2. ✅ 支持子目录
3. ✅ 支持动态路由 `[参数].js`
4. ❌ 不需要在 `_redirects` 中配置
5. ❌ 不需要在 `wrangler.toml` 中配置

---

## 🎯 总结

### **错误原因：**
- ❌ 文件在 `functions/` 根目录
- ❌ 路由不匹配前端调用路径

### **修复方法：**
- ✅ 移动到 `functions/api/` 子目录
- ✅ 路由自动匹配

### **推送后：**
- ✅ Cloudflare自动识别新结构
- ✅ API正常工作
- ✅ 405错误消失

---

## 🔗 相关文档

- [Cloudflare Pages Functions 文档](https://developers.cloudflare.com/pages/functions/)
- [路由规则说明](https://developers.cloudflare.com/pages/functions/routing/)

---

**修复完成！推送代码后1-2分钟即可生效。** 🚀

**修复时间：** 2025-10-25

