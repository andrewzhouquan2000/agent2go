'use client';

import { useParams } from 'next/navigation';
import { ChatRoom } from '@/components/webchat/ChatRoom';

export default function WebchatRoomPage() {
  const params = useParams();
  const roomId = params.roomId as string;

  // In a real app, this would come from authentication
  const currentUserId = 'user-' + Math.random().toString(36).substr(2, 9);

  return (
    <div className="h-screen w-full">
      <ChatRoom roomId={roomId} currentUserId={currentUserId} />
    </div>
  );
}
