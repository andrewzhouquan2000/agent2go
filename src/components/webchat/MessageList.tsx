'use client';

import { useEffect, useRef } from 'react';
import { RobotAvatar } from './RobotAvatar';

interface Message {
  id: string;
  roomId: string;
  userId: string;
  content: string;
  role: 'user' | 'robot' | 'system';
  createdAt: string;
  senderName?: string;
}

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  const getSenderRole = (message: Message): 'CEO' | 'Researcher' | 'Coder' | 'Designer' | 'user' | 'system' => {
    if (message.role === 'system') return 'system';
    if (message.role === 'robot') {
      // Extract role from senderName or default to Coder
      const name = message.senderName || 'Coder';
      if (name.includes('CEO')) return 'CEO';
      if (name.includes('Researcher')) return 'Researcher';
      if (name.includes('Designer')) return 'Designer';
      return 'Coder';
    }
    return 'user';
  };

  const isOwnMessage = (message: Message) => message.userId === currentUserId;

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          <p>暂无消息</p>
          <p className="text-sm mt-2">发送第一条消息开始群聊</p>
        </div>
      ) : (
        messages.map((message) => {
          const isOwn = isOwnMessage(message);
          const role = getSenderRole(message);

          return (
            <div
              key={message.id}
              className={`flex items-end gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <RobotAvatar role={role} size="sm" />
              <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[70%]`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {message.senderName || (isOwn ? '我' : role)}
                  </span>
                  <span className="text-xs text-gray-400">{formatTime(message.createdAt)}</span>
                </div>
                <div
                  className={`px-4 py-2 rounded-2xl ${
                    isOwn
                      ? 'bg-blue-500 text-white rounded-br-md'
                      : 'bg-gray-100 text-gray-900 rounded-bl-md'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                </div>
              </div>
            </div>
          );
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
