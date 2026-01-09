import { WebSocketServer } from 'ws';
import { initializeWebSocketServer } from '@/utils/websocket';

// This will store our WebSocket server instance
let wss;

export default function handler(req, res) {
  // Return 404 for non-WebSocket requests
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  // Initialize WebSocket server on first request
  if (!wss) {
    // Get the HTTP server instance from the request
    const server = req.socket?.server;
    
    if (!server) {
      return res.status(500).json({ error: 'Failed to initialize WebSocket server' });
    }

    // Initialize WebSocket server
    const { wss: wsServer } = initializeWebSocketServer(server);
    wss = wsServer;
  }

  // Set up upgrade listener if not already set
  if (!req.socket.server.upgradeListenerSet) {
    req.socket.server.upgradeListenerSet = true;
    
    // Handle upgrade from HTTP to WebSocket
    req.socket.server.on('upgrade', (request, socket, head) => {
      const pathname = new URL(request.url, `http://${request.headers.host}`).pathname;
      
      // Only handle WebSocket connections to /api/ws/notifications
      if (pathname === '/api/ws/notifications') {
        wss.handleUpgrade(request, socket, head, (ws) => {
          wss.emit('connection', ws, request);
        });
      } else {
        socket.destroy();
      }
    });
  }

  // Send a 200 response for the initial HTTP request
  res.status(200).json({ status: 'WebSocket connection will be upgraded' });
}

// Route segment config for App Router
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
