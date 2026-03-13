'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';

interface Message {
  id: string;
  sessionId: string;
  senderType: 'agent' | 'user';
  senderName: string;
  senderRole?: string | null;
  content: string;
  createdAt: string;
}

interface ExecutionResult {
  result: string;
  logs: Array<{
    task_description: string;
    output: string;
    agent: string;
  }>;
}

export default function ChatPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;
  const [messages, setMessages] = useState<Message[]>([]);
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Poll for messages every 3 seconds
  useEffect(() => {
    if (!sessionId || !polling) return;

    const pollMessages = async () => {
      try {
        const response = await fetch(`/api/messages/${sessionId}`);
        const data = await response.json();
        
        if (data.messages) {
          setMessages(data.messages);
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    };

    // Initial fetch
    pollMessages();

    // Poll every 3 seconds
    const interval = setInterval(pollMessages, 3000);

    return () => {
      clearInterval(interval);
      setPolling(false);
    };
  }, [sessionId, polling]);

  useEffect(() => {
    setLoading(false);
  }, []);

  // Simulate messages from CrewAI execution (for MVP demo)
  useEffect(() => {
    if (!sessionId) return;

    const simulateMessages = async () => {
      // Simulate agent messages based on CrewAI logs
      const simulatedMessages: Message[] = [
        {
          id: 'msg_1',
          sessionId,
          senderType: 'agent',
          senderName: '小红书选题专家',
          senderRole: 'xiaohongshu-specialist',
          content: '你好！我是小红书选题专家。收到你的需求后，我会先分析当前平台上的热门话题和趋势，为你找到最佳的选题方向。让我开始工作吧！🔍',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'msg_2',
          sessionId,
          senderType: 'agent',
          senderName: '文案专家',
          senderRole: 'content-creator',
          content: '收到选题建议！我会基于最佳选题方向创作一篇完整的小红书文案，确保内容生活化、有共鸣、易传播。✍️',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'msg_3',
          sessionId,
          senderType: 'agent',
          senderName: '配图专家',
          senderRole: 'image-prompt-engineer',
          content: '文案很棒！现在我来为内容设计配图方案，包括主图和内页图，确保视觉风格统一且吸引人。🎨',
          createdAt: new Date().toISOString(),
        },
        {
          id: 'msg_4',
          sessionId,
          senderType: 'agent',
          senderName: '运营策略专家',
          senderRole: 'social-media-strategist',
          content: '最后，我会制定完整的发布和运营策略，包括最佳发布时间、互动技巧和推广建议。📊',
          createdAt: new Date().toISOString(),
        },
      ];

      // Add messages with delays to simulate real-time execution
      for (let i = 0; i < simulatedMessages.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setMessages((prev) => [...prev, simulatedMessages[i]]);
      }

      // Add final result message
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setMessages((prev) => [
        ...prev,
        {
          id: 'msg_final',
          sessionId,
          senderType: 'agent',
          senderName: '系统',
          senderRole: null,
          content: '✅ 任务完成！所有专家已完成工作，你可以在下方查看最终交付结果。',
          createdAt: new Date().toISOString(),
        },
      ]);
    };

    simulateMessages();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">加载群聊中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">
            💬 AI 梦之队协作
          </h1>
          <p className="text-sm text-gray-500">
            实时查看专家团队的协作过程
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderType === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.senderType === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-white shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-sm">
                      {message.senderName}
                    </span>
                    {message.senderRole && (
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-600">
                        {message.senderRole.replace(/-/g, ' ')}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      {new Date(message.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-t">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">任务进度:</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(messages.length * 25, 100)}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-gray-900">
              {Math.min(messages.length * 25, 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* Result Section (placeholder for MVP) */}
      {messages.length > 4 && (
        <div className="bg-white border-t">
          <div className="max-w-5xl mx-auto px-4 py-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              📦 交付结果
            </h2>
            <div className="bg-gray-50 rounded-xl p-6">
              <p className="text-gray-700">
                完整的交付结果将在这里展示，包括：
              </p>
              <ul className="mt-2 space-y-1 text-gray-600">
                <li>• 3 个选题方向建议</li>
                <li>• 完整的小红书文案</li>
                <li>• 配图提示词方案</li>
                <li>• 发布运营策略</li>
              </ul>
              <button className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                下载完整报告
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
