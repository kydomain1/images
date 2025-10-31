const axios = require('axios');

// 辅助函数：延迟
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 辅助函数：轮询任务状态
async function pollTaskStatus(taskId, apiKey, maxAttempts = 30) {
  const taskUrl = `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`;
  
  for (let i = 0; i < maxAttempts; i++) {
    await sleep(2000); // 每2秒查询一次
    
    try {
      const response = await axios.get(taskUrl, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      
      const status = response.data.output.task_status;
      
      if (status === 'SUCCEEDED') {
        return response.data.output;
      } else if (status === 'FAILED') {
        throw new Error(response.data.output.message || '生成失败');
      }
      // 如果是PENDING或RUNNING，继续循环
    } catch (error) {
      console.error(`轮询第${i+1}次失败:`, error.message);
      if (i === maxAttempts - 1) throw error;
    }
  }
  
  throw new Error('生成超时，请稍后重试');
}

module.exports = async (req, res) => {
  // 启用 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, negativePrompt, size, count, seed, artStyle } = req.body;

    if (!prompt) {
      return res.status(400).json({ 
        success: false,
        error: 'Prompt is required' 
      });
    }

    const apiKey = process.env.TONGYI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ 
        success: false,
        error: 'API key not configured' 
      });
    }

    // 调用通义万相API（异步模式）
    const submitResponse = await axios.post(
      'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis',
      {
        model: 'wanx-v1',
        input: {
          prompt: `${artStyle || '<auto>'} ${prompt}`,
          negative_prompt: negativePrompt || ''
        },
        parameters: {
          size: size || '1024*1024',
          n: Math.min(count || 1, 4), // 通义万相最多4张
          seed: seed || Math.floor(Math.random() * 100000000)
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'X-DashScope-Async': 'enable'
        },
        timeout: 30000
      }
    );

    // 获取任务ID
    const taskId = submitResponse.data.output?.task_id;
    if (!taskId) {
      throw new Error('未能获取任务ID');
    }

    // 轮询获取结果
    const result = await pollTaskStatus(taskId, apiKey);

    // 处理结果
    if (result.results && Array.isArray(result.results)) {
      const images = result.results.map(item => ({
        url: item.url,
        prompt: prompt,
        timestamp: new Date().toISOString(),
        provider: 'tongyi-wanxiang'
      }));

      return res.status(200).json({
        success: true,
        images: images
      });
    }

    return res.status(500).json({ 
      success: false,
      error: 'Unexpected API response format' 
    });

  } catch (error) {
    console.error('Tongyi API Error:', error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to generate image'
    });
  }
};


