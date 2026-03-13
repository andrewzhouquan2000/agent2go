'use client';

import { useState, useEffect, useCallback } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

interface Message {
  id: string;
  roomId: string;
  userId: string;
  content: string;
  role: 'user' | 'robot' | 'system';
  createdAt: string;
  senderName?: string;
}

interface ChatRoomProps {
  roomId: string;
  currentUserId: string;
}

// Simulated bot responses
const botResponses: Record<string, string[]> = {
  CEO: [
    '这个想法很有潜力，我们来深入探讨一下。',
    '从战略角度来看，我们需要考虑以下几点...',
    '我建议大家先明确目标，再制定执行计划。',
  ],
  Researcher: [
    '根据我的调研，这个方向是可行的。',
    '我找到了一些相关的数据支持这个观点。',
    '让我们先分析一下市场需求和竞争情况。',
  ],
  Coder: [
    '从技术实现角度，这个功能可以在 2 天内完成。',
    '我建议使用现有的技术栈，不需要引入新的依赖。',
    '代码架构需要考虑可扩展性和维护性。',
  ],
  Designer: [
    '从用户体验角度，这个交互流程需要优化。',
    '我建议采用更简洁的视觉设计方案。',
    '色彩搭配和排版需要符合品牌调性。',
  ],
};

const bots = [
  { id: 'bot-ceo', name: 'CEO Bot', role: 'CEO' as const },
  { id: 'bot-researcher', name: 'Researcher Bot', role: 'Researcher' as const },
  { id: 'bot-coder', name: 'Coder Bot', role: 'Coder' as const },
  { id: 'bot-designer', name: 'Designer Bot', role: 'Designer' as const },
];

export function ChatRoom({ roomId, currentUserId }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);

  // Load initial messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const res = await fetch(`/api/webchat/rooms/${roomId}/messages`);
        if (res.ok) {
          const data = await res.json();
          setMessages(data.messages || []);
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    };
    loadMessages();
  }, [roomId]);

  // WebSocket connection
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/websocket`;
    
    const websocket = new WebSocket(wsUrl);

    websocket.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      // Join room
      websocket.send(JSON.stringify({ type: 'join', roomId }));
    };

    websocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'message') {
          setMessages((prev) => [...prev, data.message]);
          
          // Trigger bot responses if message is from user
          if (data.message.role === 'user' && data.message.userId !== currentUserId) {
            simulateBotResponse(data.message.content);
          }
        }
      } catch (error) {
        console.error('Failed to parse message:', error);
      }
    };

    websocket.onclose = () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    };

    websocket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    setWs(websocket);

    return () => {
      websocket.close();
    };
  }, [roomId, currentUserId]);

  const simulateBotResponse = useCallback((userMessage: string) => {
    // Simple bot response simulation
    setTimeout(() => {
      const randomBot = bots[Math.floor(Math.random() * bots.length)];
      const responses = botResponses[randomBot.role];
      const response = responses[Math.floor(Math.random() * responses.length)];

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        roomId,
        userId: randomBot.id,
        content: response,
        role: 'robot',
        createdAt: new Date().toISOString(),
        senderName: randomBot.name,
      };

      setMessages((prev) => [...prev, botMessage]);

      // Save to database
      fetch(`/api/webchat/rooms/${roomId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(botMessage),
      }).catch(console.error);
    }, 1000 + Math.random() * 2000);
  }, [roomId]);

  const handleSend = useCallback((content: string) => {
    const message: Message = {
      id: `msg-${Date.now()}`,
      roomId,
      userId: currentUserId,
      content,
      role: 'user',
      createdAt: new Date().toISOString(),
      senderName: '我',
    };

    // Optimistic update
    setMessages((prev) => [...prev, message]);

    // Send via WebSocket
    if (ws?.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'message', message }));
    }

    // Save to database
    fetch(`/api/webchat/rooms/${roomId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    }).catch(console.error);
  }, [roomId, currentUserId, ws]);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">群聊房间</h1>
          <p className="text-sm text-gray-500">房间 ID: {roomId}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-600">{isConnected ? '已连接' : '未连接'}</span>
        </div>
      </div>

      {/* Messages */}
      <MessageList messages={messages} currentUserId={currentUserId} />

      {/* Input */}
      <MessageInput onSend={handleSend} disabled={!isConnected} />
    </div>
  );
}
