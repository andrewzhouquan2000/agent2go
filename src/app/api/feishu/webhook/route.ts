/**
 * Feishu Webhook Receiver
 * Handles incoming messages and events from Feishu
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  verifyWebhookSignature,
  handleChallenge,
  processMessageEvent,
  forwardToWebchat,
} from '@/lib/feishu/webhook';
import { sendTextMessage } from '@/lib/feishu/message';

const WEBHOOK_TOKEN = process.env.FEISHU_WEBHOOK_TOKEN;

/**
 * POST /api/feishu/webhook
 * Receives events from Feishu
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('X-Lark-Signature') || '';
    const timestamp = request.headers.get('X-Lark-Timestamp') || '';
    const token = request.headers.get('X-Lark-Token') || '';

    // Verify signature (in production, enable this)
    // if (WEBHOOK_TOKEN && !verifyWebhookSignature(body, signature, timestamp, WEBHOOK_TOKEN)) {
    //   return NextResponse.json(
    //     { error: 'Invalid signature' },
    //     { status: 401 }
    //   );
    // }

    const event = JSON.parse(body);

    // Handle URL verification challenge
    if (event.type === 'url_verification') {
      return NextResponse.json({
        challenge: event.challenge,
      });
    }

    // Handle different event types
    switch (event.header?.event_type) {
      case 'im.message.receive_v1':
        return await handleMessageReceive(event);

      case 'im.message.read_v1':
        return NextResponse.json({ status: 'success' });

      default:
        console.log('Unhandled event type:', event.header?.event_type);
        return NextResponse.json({ status: 'success' });
    }
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/**
 * Handle incoming message event
 */
async function handleMessageReceive(event: any): Promise<NextResponse> {
  try {
    // Process the message
    const processed = await processMessageEvent(event);

    if (!processed.shouldRespond) {
      return NextResponse.json({ status: 'success' });
    }

    // Forward to webchat system
    await forwardToWebchat(processed.chatId, processed.content, processed.senderId);

    // TODO: Process message through Agent2Go system
    // For now, send a simple acknowledgment
    // In production, this would:
    // 1. Parse the message
    // 2. Route to appropriate agent (CEO/Researcher/Coder/Designer)
    // 3. Generate response
    // 4. Send back to Feishu

    // Example response (replace with actual agent logic)
    const response = await sendTextMessage(
      processed.chatId,
      `收到消息！这是自动回复。您的消息是：${JSON.stringify(processed.content)}`,
      'chat_id'
    );

    return NextResponse.json({
      status: 'success',
      message_id: processed.messageId,
      response_id: response.message_id,
    });
  } catch (error) {
    console.error('Message handling error:', error);
    return NextResponse.json(
      { error: 'Message processing failed' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/feishu/webhook
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'feishu-webhook',
    timestamp: new Date().toISOString(),
  });
}
