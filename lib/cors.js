const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.NEXTAUTH_URL,
  process.env.NEXT_PUBLIC_APP_URL,
].filter(Boolean);

export function corsMiddleware(handler) {
  return async (req, res) => {
    // Set CORS headers
    const origin = req.headers.get('origin');
    if (origin && allowedOrigins.includes(origin)) {
      res.headers.set('Access-Control-Allow-Origin', origin);
      res.headers.set('Access-Control-Allow-Credentials', 'true');
    }
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.headers.set('Access-Control-Max-Age', '86400'); // 24 hours
      return new Response(null, { status: 204, headers: Object.fromEntries(res.headers) });
    }

    // Handle the actual request
    try {
      return await handler(req, res);
    } catch (error) {
      console.error('API Error:', error);
      return new Response(
        JSON.stringify({ success: false, message: error.message || 'Internal Server Error' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  };
}
