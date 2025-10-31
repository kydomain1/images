// Cloudflare Workers版本 - 背景移除API
// 兼容Cloudflare Pages Functions

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
    const formData = await request.formData();
    const imageFile = formData.get('image_file');

    if (!imageFile) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Image file is required' 
      }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // 从环境变量获取API密钥
    const apiKey = env.REMOVEBG_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'RemoveBG API key not configured' 
      }), {
        status: 500,
        headers: corsHeaders
      });
    }

    // 构建FormData发送给RemoveBG API
    const removeBgFormData = new FormData();
    removeBgFormData.append('image_file', imageFile);
    removeBgFormData.append('size', 'auto');

    // 调用RemoveBG API
    const response = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {
        'X-Api-Key': apiKey
      },
      body: removeBgFormData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors?.[0]?.title || 'RemoveBG API error');
    }

    // 获取处理后的图片（二进制数据）
    const imageBlob = await response.blob();
    
    // 转换为Base64
    const arrayBuffer = await imageBlob.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    return new Response(JSON.stringify({
      success: true,
      image: `data:image/png;base64,${base64}`
    }), {
      status: 200,
      headers: corsHeaders
    });

  } catch (error) {
    console.error('RemoveBG API Error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message || 'Failed to remove background'
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

