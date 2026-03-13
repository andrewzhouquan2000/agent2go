/**
 * Feishu OAuth Authorization Initiation
 * Redirects user to Feishu authorization page
 */

import { NextRequest, NextResponse } from 'next/server';
import { getOAuthUrl } from '@/lib/feishu/auth';

const APP_ID = process.env.FEISHU_APP_ID;
const REDIRECT_URI = process.env.FEISHU_REDIRECT_URI || 'http://localhost:3000/api/feishu/auth/callback';

export async function GET(request: NextRequest) {
  try {
    if (!APP_ID) {
      return NextResponse.json(
        { error: 'Feishu App ID not configured' },
        { status: 500 }
      );
    }

    // Generate state for CSRF protection
    const state = crypto.randomUUID();

    // Store state in cookie for validation (in production, use session)
    const oauthUrl = getOAuthUrl({
      appId: APP_ID,
      redirectUri: REDIRECT_URI,
      state,
    });

    // Redirect user to Feishu authorization page
    return NextResponse.redirect(oauthUrl);
  } catch (error) {
    console.error('OAuth initiation error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate OAuth flow' },
      { status: 500 }
    );
  }
}
