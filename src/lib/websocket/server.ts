import { WebSocketServer, WebSocket } from 'ws';
import { IncomingMessage } from 'http';

interface Client extends WebSocket {
  roomId?: string;
  userId?: string;
}

interface Message {
  id: string;
  roomId: string;
  userId: string;
  content: string;
  role: 'user' | 'robot' | 'system';
  createdAt: string;
  senderName?: string;
}

interface WSMessage {
  type: 'join' | 'message' | 'leave' | 'system';
  roomId?: string;
  message?: Message;
}

const clients = new Map<string, Set<Client>>(); // roomId -> Set of clients

export function setupWebSocket(server: any) {
  const wss = new WebSocketServer({ 
    server,
    path: '/api/websocket',
  });

  wss.on('connection', (ws: Client, request: IncomingMessage) => {
    console.log('New WebSocket connection');

    ws.on('message', (data: Buffer) => {
      try {
        const message: WSMessage = JSON.parse(data.toString());

        if (message.type === 'join' && message.roomId) {
          // Join room
          ws.roomId = message.roomId;
          
          if (!clients.has(message.roomId)) {
            clients.set(message.roomId, new Set());
          }
          clients.get(message.roomId)!.add(ws);

          console.log(`Client joined room ${message.roomId}`);

          // Broadcast join notification
          broadcastToRoom(message.roomId, {
            type: 'system',
            message: {
              id: `sys-${Date.now()}`,
              roomId: message.roomId,
              userId: 'system',
              content: '用户已加入群聊',
              role: 'system',
              createdAt: new Date().toISOString(),
            },
          }, ws);

        } else if (message.type === 'message' && message.message) {
          // Broadcast message to room
          if (ws.roomId) {
            broadcastToRoom(ws.roomId, {
              type: 'message',
              message: message.message,
            });
          }
        } else if (message.type === 'leave' && ws.roomId) {
          // Leave room
          leaveRoom(ws);
        }
      } catch (error) {
        console.error('Failed to process WebSocket message:', error);
      }
    });

    ws.on('close', () => {
      console.log('WebSocket connection closed');
      if (ws.roomId) {
        leaveRoom(ws);
      }
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  return wss;
}

function broadcastToRoom(roomId: string, message: WSMessage, exclude?: Client) {
  const roomClients = clients.get(roomId);
  if (!roomClients) return;

  const data = JSON.stringify(message);
  
  roomClients.forEach((client) => {
    if (client !== exclude && client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

function leaveRoom(ws: Client) {
  if (ws.roomId) {
    const roomClients = clients.get(ws.roomId);
    if (roomClients) {
      roomClients.delete(ws);
      if (roomClients.size === 0) {
        clients.delete(ws.roomId);
      }
    }
    console.log(`Client left room ${ws.roomId}`);
    ws.roomId = undefined;
  }
}
