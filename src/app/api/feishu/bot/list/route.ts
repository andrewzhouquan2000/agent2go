/**
 * Feishu Bot List API
 * Lists all configured Agent2Go bots
 */

import { NextResponse } from 'next/server';
import { getAgentBots } from '@/lib/feishu/bot';

/**
 * GET /api/feishu/bot/list
 * Returns list of all Agent2Go bots with their status
 */
export async function GET() {
  try {
    const bots = getAgentBots();

    // Get configuration status for each bot
    const botDetails = bots.map(bot => {
      const appId = process.env[`FEISHU_BOT_${bot.role.toUpperCase()}_ID`];
      const appSecret = process.env[`FEISHU_BOT_${bot.role.toUpperCase()}_SECRET`];

      return {
        role: bot.role,
        name: bot.name,
        description: bot.description,
        configured: !!appId,
        app_id: appId || null,
        has_secret: !!appSecret,
      };
    });

    return NextResponse.json({
      bots: botDetails,
      summary: {
        total: botDetails.length,
        configured: botDetails.filter(b => b.configured).length,
        not_configured: botDetails.filter(b => !b.configured).length,
      },
    });
  } catch (error) {
    console.error('Bot list error:', error);
    return NextResponse.json(
      { error: 'Failed to get bot list' },
      { status: 500 }
    );
  }
}
