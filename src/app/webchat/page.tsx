'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, MessageSquare } from 'lucide-react';

export default function WebchatPage() {
  const router = useRouter();
  const [roomId, setRoomId] = useState('');

  const handleCreateRoom = () => {
    const newRoomId = roomId.trim() || `room-${Date.now()}`;
    router.push(`/webchat/${newRoomId}`);
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    handleCreateRoom();
  };

  // Demo rooms
  const demoRooms = [
    { id: 'demo-1', name: '产品讨论组', participants: 5 },
    { id: 'demo-2', name: '技术方案评审', participants: 3 },
    { id: 'demo-3', name: '设计反馈', participants: 4 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">群聊</h1>
          <p className="text-sm text-gray-500 mt-1">创建或加入群聊房间</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Create/Join Room */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">创建或加入房间</h2>
          <form onSubmit={handleJoinRoom} className="flex gap-3">
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="输入房间 ID（可选）"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              创建/加入
            </button>
          </form>
        </div>

        {/* Demo Rooms */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">示例房间</h2>
          <div className="space-y-3">
            {demoRooms.map((room) => (
              <button
                key={room.id}
                onClick={() => router.push(`/webchat/${room.id}`)}
                className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{room.name}</p>
                    <p className="text-sm text-gray-500">{room.participants} 人在线</p>
                  </div>
                </div>
                <span className="text-sm text-blue-500">进入</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
