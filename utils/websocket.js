import { WebSocketServer } from 'ws';

const clients = new Map(); // Store connected clients by userId
const notificationCounts = new Map(); // Store notification counts by userId

// Function to get notification count for a user
const getNotificationCount = (userId) => {
  return notificationCounts.get(userId) || 0;
};

// Function to increment notification count
const incrementNotificationCount = (userId) => {
  const count = getNotificationCount(userId) + 1;
  notificationCounts.set(userId, count);
  return count;
};

// Function to reset notification count
const resetNotificationCount = (userId) => {
  notificationCounts.set(userId, 0);
  return 0;
};

// Function to send notification to a specific user
const sendNotification = (userId, data) => {
  const userClients = clients.get(userId);
  if (userClients) {
    const message = JSON.stringify(data);
    userClients.forEach(client => {
      if (client.readyState === 1) { // 1 = OPEN
        client.send(message);
      }
    });
  }
};

const initializeWebSocketServer = (server) => {
  const wss = new WebSocketServer({ noServer: true });

  // Handle upgrade from HTTP to WebSocket
  server.on('upgrade', (request, socket, head) => {
    const pathname = new URL(request.url, `http://${request.headers.host}`).pathname;
    
    // Only handle WebSocket connections to /ws/notifications
    if (pathname === '/ws/notifications') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    } else {
      socket.destroy();
    }
  });

  wss.on('connection', (ws, request) => {
    const userId = new URL(request.url, `http://${request.headers.host}`).searchParams.get('userId');
    
    if (!userId) {
      ws.close(1008, 'User ID is required');
      return;
    }

    // Initialize notification count if not exists
    if (!notificationCounts.has(userId)) {
      notificationCounts.set(userId, 0);
    }

    // Store the WebSocket connection
    if (!clients.has(userId)) {
      clients.set(userId, new Set());
    }
    clients.get(userId).add(ws);

    // Send current notification count on connection
    ws.send(JSON.stringify({
      type: 'connection',
      message: 'Connected to notification service',
      count: getNotificationCount(userId),
      timestamp: new Date().toISOString()
    }));

    // Handle incoming messages
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        if (data.type === 'markAsRead') {
          const count = resetNotificationCount(userId);
          // Notify all user's clients about the reset
          sendNotification(userId, {
            type: 'notificationCount',
            count,
            timestamp: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    });

    // Handle client disconnection
    ws.on('close', () => {
      if (clients.has(userId)) {
        clients.get(userId).delete(ws);
        if (clients.get(userId).size === 0) {
          clients.delete(userId);
        }
      }
    });
  });

  return wss;
};

export { 
  initializeWebSocketServer, 
  sendNotification,
  getNotificationCount,
  incrementNotificationCount,
  resetNotificationCount
};
