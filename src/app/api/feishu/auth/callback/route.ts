/**
 * Feishu OAuth Callback Handler
 * Handles the redirect after user authorizes the app
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAccessToken, getUserInfo } from '@/lib/feishu/auth';

const REDIRECT_URI = process.env.FEISHU_REDIRECT_URI || 'http://localhost:3000/api/feishu/auth/callback';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400 }
      );
    }

    // Exchange code for access token
    const tokenData = await getAccessToken(code);

    // Get user info
    const userInfo = await getUserInfo(tokenData.access_token);

    // TODO: Store token in database
    // For now, we'll redirect with user info
    // In production, save to database and create session

    // Redirect to feishu bind page with success
    const redirectUrl = new URL('/feishu-bind', request.url);
    redirectUrl.searchParams.set('success', 'true');
    redirectUrl.searchParams.set('user_id', userInfo.user_id);
    redirectUrl.searchParams.set('name', userInfo.name);

    return NextResponse.redirect(redirectUrl);
  } catch (error) {
    console.error('OAuth callback error:', error);

    const redirectUrl = new URL('/feishu-bind', request.url);
    redirectUrl.searchParams.set('success', 'false');
    redirectUrl.searchParams.set('error', error instanceof Error ? error.message : 'Unknown error');

    return NextResponse.redirect(redirectUrl);
  }
}
