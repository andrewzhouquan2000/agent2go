/**
 * Feishu Bot Creation API
 * Creates and configures Agent2Go role bots
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAgentBots, addBotToChat } from '@/lib/feishu/bot';
import { feishuRequest } from '@/lib/feishu/client';

/**
 * POST /api/feishu/bot/create
 * Creates/configures the 4 Agent2Go role bots
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { chatId } = body;

    if (!chatId) {
      return NextResponse.json(
        { error: 'Chat ID is required' },
        { status: 400 }
      );
    }

    // Get predefined bot configurations
    const botConfigs = getAgentBots();

    // Note: In Feishu, bots are typically created in the Open Platform console
    // This endpoint simulates bot setup by adding pre-created bots to a chat
    // For production, you would:
    // 1. Create 4 apps in Feishu Open Platform (one per role)
    // 2. Get their app_ids
    // 3. Add them to the user's chat

    const results = [];

    for (const botConfig of botConfigs) {
      try {
        // In production, use actual bot app_ids from environment or database
        const botAppId = process.env[`FEISHU_BOT_${botConfig.role.toUpperCase()}_ID`];

        if (!botAppId) {
          // Skip if bot not configured (in development mode)
          results.push({
            role: botConfig.role,
            name: botConfig.name,
            status: 'skipped',
            message: 'Bot app_id not configured',
          });
          continue;
        }

        // Add bot to chat
        await addBotToChat(chatId, botAppId);

        results.push({
          role: botConfig.role,
          name: botConfig.name,
          status: 'success',
          app_id: botAppId,
        });
      } catch (error) {
        results.push({
          role: botConfig.role,
          name: botConfig.name,
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return NextResponse.json({
      success: true,
      bots: results,
      message: `${results.filter(r => r.status === 'success').length} bots added to chat`,
    });
  } catch (error) {
    console.error('Bot creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create bots', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/feishu/bot/create
 * Returns information about available Agent2Go bots
 */
export async function GET() {
  try {
    const bots = getAgentBots();

    // Check which bots are configured
    const botStatus = bots.map(bot => ({
      ...bot,
      configured: !!process.env[`FEISHU_BOT_${bot.role.toUpperCase()}_ID`],
      app_id: process.env[`FEISHU_BOT_${bot.role.toUpperCase()}_ID`] || null,
    }));

    return NextResponse.json({
      bots: botStatus,
      total: bots.length,
      configured: botStatus.filter(b => b.configured).length,
    });
  } catch (error) {
    console.error('Bot list error:', error);
    return NextResponse.json(
      { error: 'Failed to get bot list' },
      { status: 500 }
    );
  }
}
