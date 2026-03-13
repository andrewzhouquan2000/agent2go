/**
 * Feishu API Client
 * Handles authentication and API requests to Feishu Open Platform
 */

import nodeFetch from 'node-fetch';

const FEISHU_APP_ID = process.env.FEISHU_APP_ID;
const FEISHU_APP_SECRET = process.env.FEISHU_APP_SECRET;
const FEISHU_API_BASE = 'https://open.feishu.cn/open-apis';

export interface FeishuToken {
  tenant_access_token: string;
  expire: number;
}

export interface FeishuApiResponse {
  code: number;
  msg: string;
  data?: any;
  tenant_access_token?: string;
  expire?: number;
}

let cachedToken: FeishuToken | null = null;
let tokenExpiry: number = 0;

/**
 * Get tenant access token (app-level authentication)
 */
export async function getTenantAccessToken(): Promise<string> {
  // Return cached token if still valid
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken.tenant_access_token;
  }

  try {
    const response = await nodeFetch(`${FEISHU_API_BASE}/auth/v3/tenant_access_token/internal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        app_id: FEISHU_APP_ID,
        app_secret: FEISHU_APP_SECRET,
      }),
    });

    const data = (await response.json()) as FeishuApiResponse;

    if (data.code !== 0) {
      throw new Error(`Failed to get tenant access token: ${data.msg}`);
    }

    cachedToken = {
      tenant_access_token: data.tenant_access_token!,
      expire: data.expire!,
    };

    // Set expiry time (refresh 5 minutes before actual expiry)
    tokenExpiry = Date.now() + (data.expire! - 300) * 1000;

    return cachedToken.tenant_access_token;
  } catch (error) {
    console.error('Error getting tenant access token:', error);
    throw error;
  }
}

/**
 * Make authenticated request to Feishu API
 */
export async function feishuRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const token = await getTenantAccessToken();

  const response = await nodeFetch(`${FEISHU_API_BASE}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    body: options.body ? String(options.body) : undefined,
  });

  const data = (await response.json()) as FeishuApiResponse;

  if (data.code !== 0) {
    throw new Error(`Feishu API error: ${data.msg} (code: ${data.code})`);
  }

  return data;
}

export { nodeFetch };
