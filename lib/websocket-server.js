import { WebSocketServer } from 'ws';

// Store connected clients
const clients = new Map();

// Initialize WebSocket server
export function initializeWebSocketServer(server) {
  const wss = new WebSocketServer({ noServer: true });

  // Handle WebSocket connections
  wss.on('connection', (ws, request) => {
    const url = new URL(request.url, `http://${request.headers.host}`);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      console.error('No userId provided in WebSocket connection');
      ws.close(1008, 'User ID is required');
      return;
    }

    console.log(`WebSocket client connected: ${userId}`);
    
    // Add client to the map
    if (!clients.has(userId)) {
      clients.set(userId, new Set());
    }
    clients.get(userId).add(ws);

    // Handle client disconnection
    ws.on('close', () => {
      console.log(`WebSocket client disconnected: ${userId}`);
      if (clients.has(userId)) {
        clients.get(userId).delete(ws);
        if (clients.get(userId).size === 0) {
          clients.delete(userId);
        }
      }
    });
  });

  // Function to send a notification to a specific user
  function sendNotification(userId, notification) {
    if (clients.has(userId)) {
      const userClients = clients.get(userId);
      userClients.forEach(client => {
        if (client.readyState === 1) { // 1 = OPEN
          client.send(JSON.stringify(notification));
        }
      });
    }
  }

  return { wss, sendNotification };
}

// Export the sendNotification function to be used in API routes
export function sendNotification(userId, notification) {
  if (clients.has(userId)) {
    const userClients = clients.get(userId);
    userClients.forEach(client => {
      if (client.readyState === 1) { // 1 = OPEN
        client.send(JSON.stringify(notification));
      }
    });
  } else {
    console.log(`No active WebSocket connections for user ${userId}`);
  }
}
