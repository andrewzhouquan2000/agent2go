/**
 * Feishu Message Sending
 * Handles sending messages to users and chats
 */

import { feishuRequest } from './client';

export interface MessageContent {
  msg_type: 'text' | 'post' | 'image' | 'file' | 'audio' | 'media' | 'sticker' | 'interactive';
  content: string | object;
}

export interface SendMessageParams {
  receiveId: string;
  msgType: 'text' | 'post' | 'image' | 'file' | 'audio' | 'media' | 'sticker' | 'interactive';
  content: string | object;
  receiveIdType?: 'open_id' | 'user_id' | 'union_id' | 'chat_id' | 'email';
}

/**
 * Send a message to a user or chat
 */
export async function sendMessage(params: SendMessageParams): Promise<{
  message_id: string;
}> {
  const response = await feishuRequest('/open-apis/im/v1/messages', {
    method: 'POST',
    body: JSON.stringify({
      receive_id: params.receiveId,
      msg_type: params.msgType,
      content: typeof params.content === 'string' ? params.content : JSON.stringify(params.content),
      receive_id_type: params.receiveIdType || 'open_id',
    }),
  });

  return {
    message_id: response.data.message_id,
  };
}

/**
 * Send a text message
 */
export async function sendTextMessage(
  receiveId: string,
  text: string,
  receiveIdType: SendMessageParams['receiveIdType'] = 'open_id'
): Promise<{ message_id: string }> {
  return sendMessage({
    receiveId,
    msgType: 'text',
    content: JSON.stringify({ text }),
    receiveIdType,
  });
}

/**
 * Send a rich post message (formatted text)
 */
export async function sendPostMessage(
  receiveId: string,
  content: {
    zh_cn?: {
      title: string;
      content: Array<Array<{
        tag: 'text' | 'at' | 'a' | 'img';
        text?: string;
        href?: string;
        user_id?: string;
        image_key?: string;
      }>>;
    };
  },
  receiveIdType: SendMessageParams['receiveIdType'] = 'open_id'
): Promise<{ message_id: string }> {
  return sendMessage({
    receiveId,
    msgType: 'post',
    content,
    receiveIdType,
  });
}

/**
 * Reply to a message
 */
export async function replyMessage(
  messageId: string,
  text: string
): Promise<{ message_id: string }> {
  const response = await feishuRequest('/open-apis/im/v1/messages', {
    method: 'POST',
    body: JSON.stringify({
      msg_type: 'text',
      content: JSON.stringify({ text }),
      reply_id: messageId,
    }),
  });

  return {
    message_id: response.data.message_id,
  };
}

/**
 * Update a message
 */
export async function updateMessage(
  messageId: string,
  content: MessageContent
): Promise<void> {
  await feishuRequest(`/open-apis/im/v1/messages/${messageId}`, {
    method: 'PUT',
    body: JSON.stringify(content),
  });
}

/**
 * Delete a message
 */
export async function deleteMessage(messageId: string): Promise<void> {
  await feishuRequest(`/open-apis/im/v1/messages/${messageId}`, {
    method: 'DELETE',
  });
}

/**
 * Send message to webchat room via Feishu
 */
export async function sendWebchatMessage(
  chatId: string,
  agentName: string,
  message: string
): Promise<{ message_id: string }> {
  const formattedText = `**${agentName}**: ${message}`;
  return sendTextMessage(chatId, formattedText, 'chat_id');
}
