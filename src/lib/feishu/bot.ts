/**
 * Feishu Bot Management
 * Handles bot creation and management
 */

import { feishuRequest } from './client';

export interface BotConfig {
  name: string;
  avatar?: string;
  description?: string;
}

export interface BotInfo {
  app_id: string;
  name: string;
  avatar?: string;
  status: number;
}

/**
 * Create a bot (app)
 * Note: Bot creation typically requires admin privileges in Feishu Open Platform
 * This function is for programmatic bot configuration
 */
export async function createBot(config: BotConfig): Promise<BotInfo> {
  // Note: Actual bot creation requires admin action in Feishu Open Platform
  // This endpoint is for reference - bots are typically pre-created
  const response = await feishuRequest('/open-apis/agent/v1/bot', {
    method: 'POST',
    body: JSON.stringify({
      name: config.name,
      avatar: config.avatar,
      description: config.description,
    }),
  });

  return response.data;
}

/**
 * Get bot info
 */
export async function getBotInfo(appId: string): Promise<BotInfo> {
  const response = await feishuRequest(`/open-apis/agent/v1/bot/${appId}`, {
    method: 'GET',
  });

  return response.data;
}

/**
 * Update bot configuration
 */
export async function updateBot(appId: string, config: BotConfig): Promise<void> {
  await feishuRequest(`/open-apis/agent/v1/bot/${appId}`, {
    method: 'PUT',
    body: JSON.stringify({
      name: config.name,
      avatar: config.avatar,
      description: config.description,
    }),
  });
}

/**
 * Add bot to a chat
 */
export async function addBotToChat(chatId: string, appId: string): Promise<void> {
  await feishuRequest('/open-apis/im/v1/chats/bots', {
    method: 'POST',
    body: JSON.stringify({
      chat_id: chatId,
      app_id: appId,
    }),
  });
}

/**
 * Get predefined agent bots for Agent2Go
 */
export function getAgentBots(): Array<{
  role: string;
  name: string;
  description: string;
}> {
  return [
    {
      role: 'CEO',
      name: 'XiaoZhou',
      description: 'CEO Agent - Strategic decision maker and project manager',
    },
    {
      role: 'Researcher',
      name: 'Researcher',
      description: 'Research Agent - Information gathering and analysis',
    },
    {
      role: 'Coder',
      name: 'Coder',
      description: 'Coder Agent - Software development and implementation',
    },
    {
      role: 'Designer',
      name: 'Designer',
      description: 'Designer Agent - UI/UX design and creative work',
    },
  ];
}
