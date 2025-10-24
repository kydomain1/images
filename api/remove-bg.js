const axios = require('axios');
const FormData = require('form-data');

module.exports = async (req, res) => {
  // 启用 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image_url, image_base64 } = req.body;

    if (!image_url && !image_base64) {
      return res.status(400).json({ error: 'Image URL or base64 required' });
    }

    const apiKey = process.env.REMOVEBG_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Remove.bg API key not configured' });
    }

    const formData = new FormData();
    if (image_url) {
      formData.append('image_url', image_url);
    } else {
      formData.append('image_file_b64', image_base64);
    }
    formData.append('size', 'auto');

    const response = await axios.post(
      'https://api.remove.bg/v1.0/removebg',
      formData,
      {
        headers: {
          'X-Api-Key': apiKey,
          ...formData.getHeaders()
        },
        responseType: 'arraybuffer',
        timeout: 30000
      }
    );

    // 返回处理后的图片
    const base64Image = Buffer.from(response.data, 'binary').toString('base64');
    return res.status(200).json({
      image: `data:image/png;base64,${base64Image}`
    });

  } catch (error) {
    console.error('Remove.bg API Error:', error.response?.data || error.message);
    return res.status(500).json({
      error: error.response?.data?.errors?.[0]?.title || error.message || 'Failed to remove background'
    });
  }
};


