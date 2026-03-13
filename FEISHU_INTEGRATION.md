# Feishu Integration Guide (Phase 4)

## Overview

This guide covers the integration of Agent2Go with Feishu (Lark) Open Platform, enabling:
- OAuth authorization and user binding
- Bot creation and management
- Two-way message synchronization
- Webhook event handling

## Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   Feishu App    │ ◄─────► │   Agent2Go App   │ ◄─────► │   Webchat Sys   │
│  (Open Platform)│         │   (Next.js)      │         │                 │
└─────────────────┘         └──────────────────┘         └─────────────────┘
        │                           │                           │
        │  OAuth Flow               │  Database                 │
        │  Webhook Events           │  (Prisma)                 │
        │  Bot Messages             │                           │
        ▼                           ▼                           ▼
```

## Setup Steps

### 1. Feishu Open Platform Configuration

1. Visit [Feishu Open Platform](https://open.feishu.cn/)
2. Create a new enterprise application
3. Configure the following:

   **Basic Info:**
   - App Name: Agent2Go
   - App Icon: Upload Agent2Go logo
   - Description: AI Agent Collaboration Platform

   **Permissions:**
   - `im:message` - Send and receive messages
   - `im:chat` - Manage group chats
   - `contact:user` - Access user information
   - `authen:access_token` - OAuth authorization

   **Event Subscriptions:**
   - Enable event subscriptions
   - Subscribe to: `im.message.receive_v1`
   - Verification Token: Set `FEISHU_WEBHOOK_TOKEN`
   - Request URL: `https://your-domain.com/api/feishu/webhook`

   **OAuth Configuration:**
   - Redirect URI: `https://your-domain.com/api/feishu/auth/callback`
   - Enable OAuth 2.0

4. Create 4 bots (one for each role):
   - CEO Bot (XiaoZhou)
   - Researcher Bot
   - Coder Bot
   - Designer Bot

5. Save App ID and App Secret

### 2. Environment Configuration

Add to `.env.local`:

```bash
FEISHU_APP_ID="cli_xxxxxxxxxxxxx"
FEISHU_APP_SECRET="your-app-secret-here"
FEISHU_REDIRECT_URI="https://your-domain.com/api/feishu/auth/callback"
FEISHU_WEBHOOK_TOKEN="your-webhook-token"
FEISHU_RESPOND_ALL="false"

# Bot IDs (from Feishu Open Platform)
FEISHU_BOT_CEO_ID="cli_xxxxxxxxxxxxx"
FEISHU_BOT_RESEARCHER_ID="cli_xxxxxxxxxxxxx"
FEISHU_BOT_CODER_ID="cli_xxxxxxxxxxxxx"
FEISHU_BOT_DESIGNER_ID="cli_xxxxxxxxxxxxx"
```

### 3. User Binding Flow

1. User visits `/feishu-bind`
2. Clicks "绑定飞书" (Bind Feishu)
3. Redirected to Feishu authorization page
4. User scans QR code and confirms
5. Redirected back with authorization code
6. App exchanges code for access token
7. Token stored in database
8. User successfully bound

### 4. Bot Integration

**Adding Bots to Chat:**

```bash
POST /api/feishu/bot/create
{
  "chatId": "oc_chat_xxxxxxxxxxxxx"
}
```

This adds all 4 configured bots to the specified chat.

**Listing Bots:**

```bash
GET /api/feishu/bot/list
```

Returns status of all configured bots.

### 5. Webhook Configuration

**Local Development:**

Use ngrok or similar to expose local webhook:

```bash
ngrok http 3000
```

Update Feishu Open Platform with ngrok URL:
`https://xxxx.ngrok.io/api/feishu/webhook`

**Production:**

Use your production domain:
`https://your-domain.com/api/feishu/webhook`

## API Endpoints

### OAuth

- `GET /api/feishu/auth` - Initiate OAuth flow
- `GET /api/feishu/auth/callback` - OAuth callback handler

### Bots

- `GET /api/feishu/bot/list` - List all bots
- `POST /api/feishu/bot/create` - Add bots to chat

### Webhook

- `POST /api/feishu/webhook` - Receive Feishu events
- `GET /api/feishu/webhook` - Health check

### User Interface

- `/feishu-bind` - Feishu binding page

## File Structure

```
src/
├── lib/
│   └── feishu/
│       ├── client.ts      # API client & auth
│       ├── auth.ts        # OAuth utilities
│       ├── bot.ts         # Bot management
│       ├── message.ts     # Message sending
│       └── webhook.ts     # Webhook processing
├── app/
│   ├── api/
│   │   └── feishu/
│   │       ├── auth/
│   │       │   └── callback/
│   │       │       └── route.ts
│   │       ├── bot/
│   │       │   ├── create/
│   │       │   │   └── route.ts
│   │       │   └── list/
│   │       │       └── route.ts
│   │       └── webhook/
│   │           └── route.ts
│   └── feishu-bind/
│       └── page.tsx
```

## Testing

### Test OAuth Flow

1. Start development server: `npm run dev`
2. Visit: `http://localhost:3000/feishu-bind`
3. Click "绑定飞书"
4. Complete authorization
5. Verify redirect with user info

### Test Webhook

Use Feishu Open Platform's "Event Subscription Test" feature or send test event:

```bash
curl -X POST http://localhost:3000/api/feishu/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "schema": "2.0",
    "header": {
      "event_type": "im.message.receive_v1",
      "event_id": "test-event-id",
      "create_time": "1234567890"
    },
    "event": {
      "message": {
        "message_id": "test-message-id",
        "message_type": "text",
        "content": "{\"text\":\"Hello\"}",
        "chat_id": "test-chat-id"
      }
    }
  }'
```

### Test Bot Creation

```bash
curl -X POST http://localhost:3000/api/feishu/bot/create \
  -H "Content-Type: application/json" \
  -d '{"chatId":"test-chat-id"}'
```

## Security Considerations

1. **Credential Management:**
   - Never commit `.env.local` to git
   - Rotate App Secret regularly
   - Use environment variables in production

2. **Webhook Verification:**
   - Always verify webhook signatures
   - Validate event types
   - Rate limit incoming requests

3. **Token Storage:**
   - Encrypt access tokens in database
   - Implement token refresh logic
   - Handle token expiration gracefully

4. **User Privacy:**
   - Only request necessary permissions
   - Allow users to unbind Feishu account
   - Comply with data protection regulations

## Troubleshooting

### Common Issues

**OAuth Error: "Invalid app_id"**
- Verify App ID in Feishu Open Platform
- Check environment variable is set correctly

**Webhook Not Receiving Events**
- Verify request URL is publicly accessible
- Check event subscription is enabled
- Verify verification token matches

**Bot Cannot Send Messages**
- Check bot has necessary permissions
- Verify bot is added to the chat
- Check tenant access token is valid

**Token Expiration**
- Implement automatic token refresh
- Monitor token expiry time
- Handle refresh failures gracefully

## Next Steps

After completing Phase 4:

1. ✅ Test OAuth flow end-to-end
2. ✅ Configure all 4 bots in Feishu Open Platform
3. ✅ Set up production webhook URL
4. ✅ Implement message routing to Agent2Go system
5. ✅ Add message persistence in database
6. ✅ Implement rate limiting
7. ✅ Add monitoring and logging

## Support

For issues with Feishu Open Platform:
- [Feishu Open Platform Docs](https://open.feishu.cn/document/)
- [API Reference](https://open.feishu.cn/document/ukTMzNjL4YjMxMjNzYjM1YjNz)

For Agent2Go integration issues:
- Check `KNOWN_ISSUES.md`
- Review `DEV_LOG.md` for development history
