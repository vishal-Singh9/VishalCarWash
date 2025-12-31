// Allow all origins in development, specific origins in production
const allowedOrigins = process.env.NODE_ENV === 'development'
  ? ['*']
  : [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://vishal-car-wash.vercel.app',
      'https://www.vishal-car-wash.vercel.app',
      process.env.NEXTAUTH_URL,
      process.env.NEXT_PUBLIC_APP_URL,
    ].filter(Boolean);

import { NextResponse } from 'next/server';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

export function withCors(handler) {
  return async function (request) {
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    try {
      // Call the handler
      const response = await handler(request);
      
      // Add CORS headers to the response
      for (const [key, value] of Object.entries(corsHeaders)) {
        response.headers.set(key, value);
      }
      
      return response;
    } catch (error) {
      console.error('API Error:', error);
      const response = NextResponse.json(
        { 
          message: error.message || 'Internal Server Error',
          ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
        },
        { status: error.status || 500 }
      );
      
      // Add CORS headers to error response
      for (const [key, value] of Object.entries(corsHeaders)) {
        response.headers.set(key, value);
      }
      
      return response;
    }
  };
}

export function corsMiddleware(handler) {
  return async (req, res) => {
    // Get the origin from the request
    const origin = req.headers.get('origin') || req.headers.get('Origin') || '';
    
    // Set CORS headers
    if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      res.headers.set('Access-Control-Allow-Origin', origin || '*');
      res.headers.set('Access-Control-Allow-Credentials', 'true');
      res.headers.set('Vary', 'Origin');
    }
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      res.headers.set('Access-Control-Max-Age', '86400'); // 24 hours
      res.headers.set('Access-Control-Expose-Headers', 'X-Total-Count');
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
