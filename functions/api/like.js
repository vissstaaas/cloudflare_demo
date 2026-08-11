export async function onRequestPost(context) {
  const { env } = context;
  
  let likes = 0;
  if (env.LOVE_KV) {
    likes = parseInt(await env.LOVE_KV.get('likes') || '0', 10);
  }
  likes += 1;

  if (env.LOVE_KV) {
    await env.LOVE_KV.put('likes', likes.toString());
  }

  return new Response(JSON.stringify({ success: true, likes }), {
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

export async function onRequestGet(context) {
  const { env } = context;
  
  let likes = 0;
  if (env.LOVE_KV) {
    likes = parseInt(await env.LOVE_KV.get('likes') || '0', 10);
  }

  return new Response(JSON.stringify({ likes }), {
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
