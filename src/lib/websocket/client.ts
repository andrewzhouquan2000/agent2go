export interface WSMessage {
  type: 'message' | 'system';
  message: {
    id: string;
    roomId: string;
    userId: string;
    content: string;
    role: 'user' | 'robot' | 'system';
    createdAt: string;
    senderName?: string;
  };
}

export type WSMessageHandler = (message: WSMessage) => void;

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private roomId: string | null = null;
  private messageHandlers: Set<WSMessageHandler> = new Set();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;

  constructor(
    private url: string,
    private userId: string
  ) {}

  connect(roomId: string) {
    this.roomId = roomId;
    this.connectWebSocket();
  }

  private connectWebSocket() {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/websocket`;
    
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      
      // Join room
      if (this.roomId && this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'join', roomId: this.roomId }));
      }
    };

    this.ws.onmessage = (event) => {
      try {
        const data: WSMessage = JSON.parse(event.data);
        this.messageHandlers.forEach((handler) => handler(data));
      } catch (error) {
        console.error('Failed to parse WebSocket message:', error);
      }
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.attemptReconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts && this.roomId) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
      
      setTimeout(() => {
        this.connectWebSocket();
      }, delay);
    }
  }

  send(message: {
    id: string;
    roomId: string;
    userId: string;
    content: string;
    role: 'user' | 'robot' | 'system';
    createdAt: string;
    senderName?: string;
  }) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'message', message }));
    } else {
      console.warn('WebSocket not connected, message not sent');
    }
  }

  onMessage(handler: WSMessageHandler) {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  disconnect() {
    if (this.roomId && this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'leave', roomId: this.roomId }));
    }
    this.ws?.close();
    this.ws = null;
    this.roomId = null;
  }
}
