import { NextResponse } from 'next/server';

// Note: WebSocket in Next.js App Router requires a custom server setup.
// This endpoint is a placeholder that returns connection info.
// For production, use a separate WebSocket server or Pages Router.

export async function GET() {
  return NextResponse.json({
    message: 'WebSocket endpoint',
    info: 'For WebSocket connections, use a custom server or Pages Router API',
    wsUrl: `ws://${typeof window !== 'undefined' ? window.location.host : 'localhost:3000'}/api/websocket`,
  });
}
