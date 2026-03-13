/**
 * Feishu OAuth Authorization
 * Handles user authorization flow
 */

const FEISHU_APP_ID = process.env.FEISHU_APP_ID;
const FEISHU_OAUTH_BASE = 'https://open.feishu.cn/open-apis/authen/v1';

export interface OAuthConfig {
  appId: string;
  redirectUri: string;
  state?: string;
}

/**
 * Generate OAuth authorization URL
 */
export function getOAuthUrl(config: OAuthConfig): string {
  const params = new URLSearchParams({
    app_id: config.appId,
    redirect_uri: config.redirectUri,
    state: config.state || '',
  });

  return `${FEISHU_OAUTH_BASE}/authorize?${params.toString()}`;
}

/**
 * Exchange authorization code for access token
 */
export async function getAccessToken(code: string): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
  user_id: string;
}> {
  const response = await fetch(`${FEISHU_OAUTH_BASE}/access_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code,
    }),
  });

  const data = await response.json();

  if (data.code !== 0) {
    throw new Error(`Failed to get access token: ${data.msg}`);
  }

  return {
    access_token: data.data.access_token,
    refresh_token: data.data.refresh_token,
    expires_in: data.data.expires_in,
    user_id: data.data.user_id,
  };
}

/**
 * Refresh access token
 */
export async function refreshAccessToken(refreshToken: string): Promise<{
  access_token: string;
  refresh_token: string;
  expires_in: number;
}> {
  const response = await fetch(`${FEISHU_OAUTH_BASE}/refresh_access_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  const data = await response.json();

  if (data.code !== 0) {
    throw new Error(`Failed to refresh access token: ${data.msg}`);
  }

  return {
    access_token: data.data.access_token,
    refresh_token: data.data.refresh_token,
    expires_in: data.data.expires_in,
  };
}

/**
 * Get user info with access token
 */
export async function getUserInfo(accessToken: string): Promise<{
  user_id: string;
  union_id: string;
  open_id: string;
  name: string;
  avatar: string;
}> {
  const response = await fetch(`${FEISHU_OAUTH_BASE}/userinfo`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data = await response.json();

  if (data.code !== 0) {
    throw new Error(`Failed to get user info: ${data.msg}`);
  }

  return {
    user_id: data.data.user_id,
    union_id: data.data.union_id,
    open_id: data.data.open_id,
    name: data.data.name,
    avatar: data.data.avatar,
  };
}
