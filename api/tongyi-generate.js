const axios = require('axios');

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
    const { prompt, model = 'wanx-v1', parameters = {} } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const apiKey = process.env.TONGYI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // 调用通义万相API
    const response = await axios.post(
      'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis',
      {
        model: model,
        input: {
          prompt: prompt
        },
        parameters: {
          size: parameters.size || '1024*1024',
          n: parameters.n || 1,
          ...parameters
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

    // 返回任务ID
    if (response.data.output && response.data.output.task_id) {
      return res.status(200).json({
        task_id: response.data.output.task_id,
        task_status: response.data.output.task_status
      });
    }

    // 如果是同步返回结果
    if (response.data.output && response.data.output.results) {
      return res.status(200).json({
        images: response.data.output.results.map(r => ({ url: r.url }))
      });
    }

    return res.status(500).json({ error: 'Unexpected API response' });

  } catch (error) {
    console.error('Tongyi API Error:', error.response?.data || error.message);
    return res.status(500).json({
      error: error.response?.data?.message || error.message || 'Failed to generate image'
    });
  }
};


