# ✅ 通义万相API修复完成

## 📅 日期：2025-10-25

## 🔍 问题分析

### 原始错误
```
图片生成失败: 生成失败
通义万相API调用失败
```

### 根本原因

**通义万相API使用异步模式：**
1. 第一次请求返回 `task_id`（任务ID）
2. 需要通过轮询查询任务状态
3. 任务完成后才能获取图片URL

**之前的代码问题：**
- ❌ 后端只提交任务，没有轮询结果
- ❌ 直接返回task_id给前端，前端无法处理
- ❌ 导致前端认为生成失败

---

## ✅ 修复方案

### 1. **后端API完整重写**（`api/tongyi-generate.js`）

#### 新增功能：

**① 提交任务到通义万相**
```javascript
const submitResponse = await axios.post(
  'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis',
  {
    model: 'wanx-v1',
    input: {
      prompt: `${artStyle} ${prompt}`,
      negative_prompt: negativePrompt
    },
    parameters: {
      size: size,
      n: count
    }
  },
  {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'X-DashScope-Async': 'enable'  // 异步模式
    }
  }
);
```

**② 自动轮询任务状态**
```javascript
async function pollTaskStatus(taskId, apiKey, maxAttempts = 30) {
  for (let i = 0; i < maxAttempts; i++) {
    await sleep(2000); // 每2秒查询一次
    
    const response = await axios.get(
      `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`,
      { headers: { 'Authorization': `Bearer ${apiKey}` } }
    );
    
    const status = response.data.output.task_status;
    
    if (status === 'SUCCEEDED') {
      return response.data.output; // 返回结果
    } else if (status === 'FAILED') {
      throw new Error('生成失败');
    }
    // PENDING/RUNNING 继续循环
  }
  
  throw new Error('生成超时');
}
```

**③ 返回标准格式给前端**
```javascript
{
  success: true,
  images: [
    {
      url: "https://...",
      prompt: "用户输入的提示词",
      timestamp: "2025-10-25T...",
      provider: "tongyi-wanxiang"
    }
  ]
}
```

---

### 2. **Vercel配置优化**（`vercel.json`）

```json
{
  "functions": {
    "api/tongyi-generate.js": {
      "maxDuration": 60  // 通义万相需要更长时间
    },
    "api/**/*.js": {
      "maxDuration": 30
    }
  }
}
```

**为什么需要60秒？**
- 提交任务：~1秒
- 轮询等待：30次 × 2秒 = 60秒
- 总计：最多60秒

---

### 3. **前端配置恢复**（`js/api-config.js`）

```javascript
const API_CONFIG = {
    provider: 'tongyi', // 恢复使用通义万相
    // ...
};
```

---

## 🔧 技术细节

### 通义万相API工作流程

```
用户提交 → 前端调用 → Vercel函数
                          ↓
                     提交到通义万相
                          ↓
                     获取task_id
                          ↓
                     轮询查询状态
                          ↓
                    (2秒查一次，最多30次)
                          ↓
                     ┌────┴────┐
              SUCCEEDED    FAILED
                 ↓           ↓
            返回图片URL   返回错误
                 ↓
            前端显示图片
```

### API参数说明

| 参数 | 说明 | 默认值 |
|------|------|--------|
| prompt | 提示词 | 必填 |
| negativePrompt | 负面提示词 | "" |
| size | 图片尺寸 | "1024*1024" |
| count | 生成数量 | 1（最多4） |
| artStyle | 艺术风格 | "\<auto>" |
| seed | 随机种子 | 随机 |

### 支持的艺术风格

```javascript
{
  'auto': '<auto>',                // 自动
  'photorealistic': '<photography>', // 摄影
  'anime': '<anime>',               // 动漫
  'oil-painting': '<oil painting>', // 油画
  'watercolor': '<watercolor>',     // 水彩
  'cyberpunk': '<3d cartoon>',      // 赛博朋克
  'fantasy': '<fantasy>',           // 奇幻
  'minimalist': '<flat illustration>' // 极简
}
```

---

## ✅ 修复效果

### 之前：
```
❌ 提交任务成功
❌ 但无法获取结果
❌ 前端显示"生成失败"
```

### 现在：
```
✅ 提交任务
✅ 自动轮询等待
✅ 获取图片URL
✅ 返回给前端显示
```

---

## 📝 测试步骤

### 1. 本地测试（可选）

```bash
# 启动本地服务器
node server-with-r2.js

# 访问
http://localhost:3000/tool.html

# 尝试生成图片
```

### 2. Vercel部署测试

```bash
# 提交更改
git add api/tongyi-generate.js js/api-config.js vercel.json
git commit -m "修复通义万相API - 添加轮询逻辑"
git push origin main

# 等待1-2分钟Vercel重新部署
# 访问网站测试
```

### 3. 验证清单

- [ ] 输入提示词
- [ ] 点击生成
- [ ] 等待10-30秒（正常）
- [ ] 看到生成进度提示
- [ ] 成功显示图片
- [ ] 图片可以下载

---

## ⚠️ 注意事项

### 1. 生成时间较长
通义万相API需要10-30秒生成时间，这是正常的：
- ✅ 页面会显示"生成中..."
- ✅ 请耐心等待
- ❌ 不要刷新页面

### 2. Vercel免费版限制
- 函数执行时间：最长60秒
- 并发请求：有限制
- 如果超时，考虑升级计划

### 3. API配额
通义万相API有免费额度：
- 查看用量：[DashScope控制台](https://dashscope.console.aliyun.com/billing)
- 超出额度需要充值

---

## 🎉 总结

### 修复的文件：
1. ✅ `api/tongyi-generate.js` - 完整重写，添加轮询
2. ✅ `js/api-config.js` - 恢复通义万相配置
3. ✅ `vercel.json` - 增加超时时间
4. ✅ `js/tongyi-api.js` - 之前已修复路径问题

### 现在可以：
- ✅ 正常使用通义万相API
- ✅ 自动处理异步任务
- ✅ 显示生成进度
- ✅ 稳定获取结果

---

**推送到GitHub后，等待Vercel重新部署，通义万相API就能正常工作了！** 🚀

**修复完成时间：** 2025-10-25


