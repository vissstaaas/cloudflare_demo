// 1. GET 请求：获取所有留言列表
export async function onRequestGet(context) {
  const { env } = context;
  let list = [];
  
  if (env.LOVE_KV) {
    const raw = await env.LOVE_KV.get('guestbook_list');
    if (raw) {
      try { list = JSON.parse(raw); } catch (e) {}
    }
  }

  return new Response(JSON.stringify({ success: true, list }), {
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

// 2. POST 请求：提交新留言
export async function onRequestPost(context) {
  const { env, request } = context;
  
  try {
    const data = await request.json();
    const nickname = (data.nickname || '匿名访客').trim().slice(0, 20);
    const message = (data.message || '').trim().slice(0, 100);

    if (!message) {
      return new Response(JSON.stringify({ success: false, error: '留言内容不能为空' }), { status: 400 });
    }

    let list = [];
    if (env.LOVE_KV) {
      const raw = await env.LOVE_KV.get('guestbook_list');
      if (raw) {
        try { list = JSON.parse(raw); } catch (e) {}
      }
    }

    const newItem = {
      id: Date.now().toString(36),
      nickname,
      message,
      time: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
    };

    // 最多保留最新的 20 条留言
    list.unshift(newItem);
    if (list.length > 20) list = list.slice(0, 20);

    if (env.LOVE_KV) {
      await env.LOVE_KV.put('guestbook_list', JSON.stringify(list));
    }

    return new Response(JSON.stringify({ success: true, list }), {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: e.message }), { status: 500 });
  }
}
