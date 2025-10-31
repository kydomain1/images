// Cloudflare Workers版本 - 通义万相API
// 兼容Cloudflare Pages Functions

// 辅助函数：延迟
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 辅助函数：轮询任务状态
async function pollTaskStatus(taskId, apiKey, maxAttempts = 30) {
  const taskUrl = `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`;
  
  for (let i = 0; i < maxAttempts; i++) {
    await sleep(2000); // 每2秒查询一次
    
    try {
      const response = await fetch(taskUrl, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
      
      const data = await response.json();
      const status = data.output.task_status;
      
      if (status === 'SUCCEEDED') {
        return data.output;
      } else if (status === 'FAILED') {
        throw new Error(data.output.message || '生成失败');
      }
      // 如果是PENDING或RUNNING，继续循环
    } catch (error) {
      console.error(`轮询第${i+1}次失败:`, error.message);
      if (i === maxAttempts - 1) throw error;
    }
  }
  
  throw new Error('生成超时，请稍后重试');
}

// Cloudflare Workers/Pages 函数入口
export async function onRequestPost(context) {
  const { request, env } = context;
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    // 解析请求体
    const body = await request.json();
    const { prompt, negativePrompt, size, count, seed, artStyle } = body;

    if (!prompt) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Prompt is required' 
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // 从环境变量获取API密钥
    const apiKey = env.TONGYI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'API key not configured' 
      }), {
        status: 500,
        headers: corsHeaders
      });
    }

    // 调用通义万相API（异步模式）
    const submitResponse = await fetch(
      'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'X-DashScope-Async': 'enable'
        },
        body: JSON.stringify({
          model: 'wanx-v1',
          input: {
            prompt: `${artStyle || '<auto>'} ${prompt}`,
            negative_prompt: negativePrompt || ''
          },
          parameters: {
            size: size || '1024*1024',
            n: Math.min(count || 1, 4),
            seed: seed || Math.floor(Math.random() * 100000000)
          }
        })
      }
    );

    const submitData = await submitResponse.json();

    // 获取任务ID
    const taskId = submitData.output?.task_id;
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

      return new Response(JSON.stringify({
        success: true,
        images: images
      }), {
        status: 200,
        headers: corsHeaders
      });
    }

    return new Response(JSON.stringify({ 
      success: false,
      error: 'Unexpected API response format' 
    }), {
      status: 500,
      headers: corsHeaders
    });

  } catch (error) {
    console.error('Tongyi API Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to generate image'
    }), {
      status: 500,
      headers: corsHeaders
    });
  }
}

// OPTIONS请求处理（CORS预检）
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

