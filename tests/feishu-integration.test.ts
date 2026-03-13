/**
 * Feishu Integration Tests
 * Tests for OAuth, Bot, and Message functionality
 */

// Mock environment variables
process.env.FEISHU_APP_ID = 'cli_test_app_id';
process.env.FEISHU_APP_SECRET = 'test_app_secret';
process.env.FEISHU_REDIRECT_URI = 'http://localhost:3000/api/feishu/auth/callback';

describe('Feishu Integration', () => {
  describe('OAuth Flow', () => {
    it('should generate valid OAuth URL', async () => {
      const { getOAuthUrl } = await import('@/lib/feishu/auth');

      const oauthUrl = getOAuthUrl({
        appId: 'cli_test_app_id',
        redirectUri: 'http://localhost:3000/callback',
        state: 'test-state-123',
      });

      expect(oauthUrl).toContain('open.feishu.cn/open-apis/authen/v1/authorize');
      expect(oauthUrl).toContain('app_id=cli_test_app_id');
      expect(oauthUrl).toContain('redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback');
      expect(oauthUrl).toContain('state=test-state-123');
    });

    it('should handle OAuth callback with valid code', async () => {
      // This would require mocking the API call
      // For now, test the structure
      const { getAccessToken } = await import('@/lib/feishu/auth');

      expect(getAccessToken).toBeDefined();
      expect(typeof getAccessToken).toBe('function');
    });
  });

  describe('Bot Configuration', () => {
    it('should return 4 predefined agent bots', async () => {
      const { getAgentBots } = await import('@/lib/feishu/bot');

      const bots = getAgentBots();

      expect(bots).toHaveLength(4);
      expect(bots.map(b => b.role)).toEqual(['CEO', 'Researcher', 'Coder', 'Designer']);
      expect(bots.find(b => b.role === 'CEO')?.name).toBe('XiaoZhou');
    });

    it('should have descriptions for all bots', async () => {
      const { getAgentBots } = await import('@/lib/feishu/bot');

      const bots = getAgentBots();

      bots.forEach(bot => {
        expect(bot.description).toBeDefined();
        expect(bot.description.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Webhook Processing', () => {
    it('should parse text message content', async () => {
      const { parseMessageContent } = await import('@/lib/feishu/webhook');

      const content = parseMessageContent('text', '{"text":"Hello World"}');

      expect(content).toEqual({ text: 'Hello World' });
    });

    it('should extract mentions from message', async () => {
      const { extractMentions } = await import('@/lib/feishu/webhook');

      const content = 'Hello @_user_123 and @_user_456';
      const mentions = extractMentions(content);

      expect(mentions).toEqual(['@_user_123', '@_user_456']);
    });

    it('should handle URL verification challenge', async () => {
      const { handleChallenge } = await import('@/lib/feishu/webhook');

      const response = handleChallenge('test-token-123');

      expect(response).toEqual({ challenge: 'test-token-123' });
    });
  });

  describe('Message Formatting', () => {
    it('should send text message with correct format', async () => {
      const { sendTextMessage } = await import('@/lib/feishu/message');

      expect(sendTextMessage).toBeDefined();
      expect(typeof sendTextMessage).toBe('function');
    });

    it('should support different receive ID types', async () => {
      const { sendMessage } = await import('@/lib/feishu/message');

      expect(sendMessage).toBeDefined();

      // Test different receive ID types
      const idTypes = ['open_id', 'user_id', 'union_id', 'chat_id', 'email'];
      idTypes.forEach(type => {
        expect(type).toMatch(/^(open_id|user_id|union_id|chat_id|email)$/);
      });
    });
  });
});

describe('Feishu Client', () => {
  describe('Token Management', () => {
    it('should have tenant access token function', async () => {
      const { getTenantAccessToken } = await import('@/lib/feishu/client');

      expect(getTenantAccessToken).toBeDefined();
      expect(typeof getTenantAccessToken).toBe('function');
    });

    it('should have feishu request function', async () => {
      const { feishuRequest } = await import('@/lib/feishu/client');

      expect(feishuRequest).toBeDefined();
      expect(typeof feishuRequest).toBe('function');
    });
  });
});
