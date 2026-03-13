/**
 * Feishu Webhook Handler
 * Processes incoming messages and events from Feishu
 */

import { createHash } from 'crypto';

export interface FeishuWebhookEvent {
  schema: string;
  header: {
    event_type: string;
    event_id: string;
    create_time: string;
    token: string;
    app_id: string;
    tenant_key: string;
    resource_id?: string;
  };
  event: {
    message?: {
      message_id: string;
      message_type: string;
      content: string;
      chat_id: string;
      sender?: {
        sender_id: {
          open_id?: string;
          user_id?: string;
          union_id?: string;
        };
        tenant_key: string;
        sender_type: number;
      };
      create_time: string;
    };
    [key: string]: any;
  };
}

export interface WebhookResponse {
  challenge?: string;
  status?: 'success' | 'error';
  message?: string;
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  body: string,
  signature: string,
  timestamp: string,
  token: string
): boolean {
  const signingKey = timestamp + token;
  const hmac = createHash('sha256');
  hmac.update(signingKey + body);
  const computedSignature = hmac.digest('base64');

  return computedSignature === signature;
}

/**
 * Handle URL verification challenge
 */
export function handleChallenge(token: string): WebhookResponse {
  return {
    challenge: token,
  };
}

/**
 * Parse message content based on message type
 */
export function parseMessageContent(
  messageType: string,
  content: string
): any {
  try {
    const parsed = JSON.parse(content);

    switch (messageType) {
      case 'text':
        return { text: parsed.text };
      case 'post':
        return { post: parsed };
      case 'image':
        return { image_key: parsed.image_key };
      default:
        return parsed;
    }
  } catch (error) {
    console.error('Failed to parse message content:', error);
    return { raw: content };
  }
}

/**
 * Extract @mentions from message
 */
export function extractMentions(content: string): string[] {
  const mentionRegex = /@_user_\d+/g;
  const matches = content.match(mentionRegex);
  return matches || [];
}

/**
 * Check if message mentions bot
 */
export function isBotMentioned(content: string, botId: string): boolean {
  // Check for direct @mention
  if (content.includes(`@_user_${botId}`)) {
    return true;
  }

  // Check for bot name mention
  // This would require knowing the bot's display name
  return false;
}

/**
 * Process incoming message event
 */
export async function processMessageEvent(event: FeishuWebhookEvent): Promise<{
  messageId: string;
  chatId: string;
  content: any;
  senderId: string;
  shouldRespond: boolean;
}> {
  const message = event.event.message;

  if (!message) {
    throw new Error('No message in event');
  }

  const content = parseMessageContent(message.message_type, message.content);
  const senderId =
    message.sender?.sender_id.open_id ||
    message.sender?.sender_id.user_id ||
    'unknown';

  // Determine if bot should respond
  const shouldRespond =
    isBotMentioned(message.content, process.env.FEISHU_BOT_ID || '') ||
    // Respond to all messages in group chat (configurable)
    process.env.FEISHU_RESPOND_ALL === 'true';

  return {
    messageId: message.message_id,
    chatId: message.chat_id,
    content,
    senderId,
    shouldRespond,
  };
}

/**
 * Forward message to webchat system
 */
export async function forwardToWebchat(
  chatId: string,
  content: any,
  senderId: string
): Promise<void> {
  // This would integrate with your existing webchat system
  // For now, log the message
  console.log('Forwarding to webchat:', {
    chatId,
    content,
    senderId,
  });

  // TODO: Implement actual webchat integration
  // Example: Call your webchat API to create/update message
}

/**
 * Send response back to Feishu
 */
export async function sendFeishuResponse(
  chatId: string,
  message: string,
  replyToMessageId?: string
): Promise<void> {
  // This would call the message sending API
  // Implemented in the API route
  console.log('Sending Feishu response:', {
    chatId,
    message,
    replyToMessageId,
  });
}
