# Phase 5 部署文档 - Agent2Go

**版本**: v1.0  
**创建日期**: 2026-03-13  
**状态**: ✅ 已完成

---

## 📋 目录

1. [概述](#1-概述)
2. [Vercel 部署配置](#2-vercel-部署配置)
3. [环境变量设置](#3-环境变量设置)
4. [自定义域名配置](#4-自定义域名配置)
5. [CI/CD 流水线](#5-cicd-流水线)
6. [数据库迁移](#6-数据库迁移)
7. [监控集成](#7-监控集成)
8. [安全加固](#8-安全加固)
9. [部署检查清单](#9-部署检查清单)
10. [故障排查](#10-故障排查)

---

## 1. 概述

### 1.1 部署目标

- ✅ 高可用性（99.9% SLA）
- ✅ 自动化部署流程
- ✅ 安全的环境变量管理
- ✅ 零停机发布
- ✅ 完整的监控和告警

### 1.2 技术架构

```
┌─────────────────────────────────────────────────┐
│                   Cloudflare CDN                 │
│                  (DNS + SSL)                     │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│                  Vercel Platform                 │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────┐ │
│  │ Edge Cache  │  │ API Routes  │  │  Static  │ │
│  └─────────────┘  └─────────────┘  └──────────┘ │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│              Supabase PostgreSQL                 │
│         (Primary + Replica + Backup)             │
└─────────────────────────────────────────────────┘
```

### 1.3 部署环境

| 环境 | 用途 | 分支 | 域名 |
|------|------|------|------|
| Preview | PR 预览 | 所有 PR | *.vercel.app |
| Staging | 预发布测试 | staging | staging.agent2go.com |
| Production | 生产环境 | main | agent2go.com |

---

## 2. Vercel 部署配置

### 2.1 项目初始化

```bash
# 1. 安装 Vercel CLI
npm install -g vercel

# 2. 登录 Vercel
vercel login

# 3. 进入项目目录
cd ~/projects/agent2go

# 4. 初始化 Vercel 项目
vercel --prod
```

### 2.2 vercel.json 配置说明

项目已包含 `vercel.json` 配置文件，主要配置项：

```json
{
  "version": 2,
  "name": "agent2go-production",
  "builds": [{ "src": "package.json", "use": "@vercel/next" }],
  "headers": [
    // 安全头配置
  ],
  "github": {
    "silent": false,
    "autoJobCancelation": true
  }
}
```

### 2.3 部署命令

```bash
# 开发环境预览
vercel

# 生产环境部署
vercel --prod

# 查看部署历史
vercel ls

# 回滚到指定部署
vercel rollback <DEPLOYMENT_URL>

# 查看日志
vercel logs --follow
```

### 2.4 部署流程

1. **代码推送** → 触发 GitHub Action
2. **CI/CD 检查** → Lint + Test + Build
3. **Vercel 部署** → 自动构建和部署
4. **健康检查** → 验证 `/api/health` 端点
5. **通知** → 飞书群消息

---

## 3. 环境变量设置

### 3.1 配置环境变量

```bash
# 通过 Vercel CLI 配置生产环境变量
vercel env add DATABASE_URL production
vercel env add SUPABASE_URL production
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add NEXTAUTH_SECRET production
vercel env add NEXT_PUBLIC_SENTRY_DSN production

# 拉取环境变量到本地（用于测试）
vercel env pull .env.production.local
```

### 3.2 环境变量模板

项目包含 `.env.production` 模板文件，包含所有必需的环境变量说明。

**关键环境变量：**

| 变量名 | 用途 | 必填 |
|--------|------|------|
| `DATABASE_URL` | PostgreSQL 连接字符串 | ✅ |
| `SUPABASE_URL` | Supabase 项目 URL | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase 服务密钥 | ✅ |
| `NEXTAUTH_SECRET` | NextAuth 加密密钥 | ✅ |
| `NEXTAUTH_URL` | NextAuth 回调 URL | ✅ |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry 错误追踪 | ✅ |

### 3.3 生成 NEXTAUTH_SECRET

```bash
# 使用 OpenSSL 生成安全随机密钥
openssl rand -base64 32

# 或使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 4. 自定义域名配置

### 4.1 DNS 配置

在域名注册商处配置以下 DNS 记录：

#### 根域名
```
类型：A
名称：@
值：76.76.21.21
TTL: 自动
```

#### WWW 子域名
```
类型：CNAME
名称：www
值：cname.vercel-dns.com
TTL: 自动
```

#### API 子域名（可选）
```
类型：CNAME
名称：api
值：cname.vercel-dns.com
TTL: 自动
```

### 4.2 Vercel 域名绑定

1. 进入 Vercel Dashboard → Project → Settings → Domains
2. 添加域名：`agent2go.com`
3. 添加域名：`www.agent2go.com`
4. 等待 DNS 验证（通常 < 5 分钟）
5. SSL 证书自动签发（Let's Encrypt）

### 4.3 验证配置

```bash
# 验证 DNS 解析
dig agent2go.com
dig www.agent2go.com

# 验证 SSL 证书
curl -vI https://agent2go.com

# 验证 HTTPS 重定向
curl -I http://agent2go.com  # 应返回 301 到 HTTPS
```

---

## 5. CI/CD 流水线

### 5.1 GitHub Actions 配置

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          
      - name: Notify Feishu
        if: always()
        run: |
          curl -X POST ${{ secrets.FEISHU_WEBHOOK_URL }} \
            -H 'Content-Type: application/json' \
            -d '{
              "msg_type": "text",
              "content": {
                "text": "🚀 Agent2Go 部署 ${{ job.status }}: ${{ github.sha }}"
              }
            }'
```

### 5.2 配置 GitHub Secrets

在 GitHub 仓库 Settings → Secrets and variables → Actions 中添加：

```
VERCEL_TOKEN=xxx
VERCEL_ORG_ID=xxx
VERCEL_PROJECT_ID=xxx
FEISHU_WEBHOOK_URL=https://open.feishu.cn/open-apis/bot/v2/hook/xxx
```

### 5.3 部署通知

部署完成后，自动发送飞书通知到团队群：

```json
{
  "msg_type": "interactive",
  "card": {
    "header": {
      "title": { "tag": "plain_text", "content": "🚀 部署完成" },
      "template": "green"
    },
    "elements": [
      {
        "tag": "markdown",
        "content": "**提交**: abc123\n**环境**: Production\n**状态**: ✅ 成功"
      }
    ]
  }
}
```

---

## 6. 数据库迁移

### 6.1 Supabase PostgreSQL 配置

#### 6.1.1 创建 Supabase 项目

1. 访问 https://supabase.com
2. 创建新项目 `agent2go-production`
3. 选择区域（推荐：AWS Asia Pacific）
4. 设置数据库密码

#### 6.1.2 获取连接信息

在 Supabase Dashboard → Settings → Database 获取：

```
Host: db.xxx.supabase.co
Port: 5432
Database: postgres
User: postgres
Password: [你的密码]
```

#### 6.1.3 配置 Prisma

更新 `prisma/schema.prisma`：

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 6.2 数据库迁移步骤

```bash
# 1. 安装 Supabase CLI
npm install -g supabase

# 2. 登录 Supabase
supabase login

# 3. 链接项目
supabase link --project-ref xxx

# 4. 生成迁移
npx prisma migrate dev --name init

# 5. 部署迁移到生产环境
npx prisma migrate deploy

# 6. 生成 Prisma Client
npx prisma generate
```

### 6.3 数据备份方案

#### 自动备份配置

在 Supabase Dashboard → Settings → Database → Backups：

- 启用自动备份
- 备份频率：每日
- 保留周期：30 天
- 异地备份：启用

#### 手动备份

```bash
# 导出数据库备份
pg_dump "postgresql://user:pass@host:5432/dbname" > backup_$(date +%Y%m%d).sql

# 上传到 S3
aws s3 cp backup_$(date +%Y%m%d).sql s3://agent2go-backups/
```

### 6.4 连接池优化

在 Supabase Dashboard → Settings → Database → Connection Pooling：

- 启用 PgBouncer
- 事务模式：Transaction
- 池大小：25 连接

更新 `DATABASE_URL` 使用连接池端口（6432）：

```
DATABASE_URL="postgresql://postgres:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6432/postgres?schema=public&pgbouncer=true"
```

---

## 7. 监控集成

### 7.1 Vercel Analytics

#### 安装

```bash
npm install @vercel/analytics
```

#### 配置

在 `app/layout.tsx` 或 `pages/_app.tsx` 中：

```typescript
import { Analytics } from "@vercel/analytics/react";

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

#### 自定义事件追踪

```typescript
import { track } from "@vercel/analytics";

trackEvent('agent_created', {
  agent_type: 'research',
  user_id: user.id,
});
```

### 7.2 Sentry 错误追踪

#### 安装

```bash
npm install @sentry/nextjs
```

#### 配置

项目已包含 Sentry 配置文件：

- `sentry.client.config.js` - 客户端配置
- `sentry.server.config.js` - 服务端配置
- `sentry.edge.config.js` - Edge Runtime 配置

#### 验证配置

```bash
# 运行 Sentry 向导
npx @sentry/wizard -i nextjs
```

### 7.3 性能监控仪表板

#### Vercel Dashboard

访问 Vercel Dashboard → Project → Analytics 查看：

- Page Views
- Unique Visitors
- Bounce Rate
- Web Vitals (LCP, FID, CLS)

#### Sentry Performance

访问 Sentry Dashboard → Performance 查看：

- 事务响应时间
- 慢查询分析
- 错误率趋势

### 7.4 告警配置

#### Sentry 告警规则

在 Sentry Dashboard → Alerts → Create Alert：

1. **高错误率告警**
   - 条件：`error_rate > 1%`
   - 时间窗口：5 分钟
   - 通知渠道：Slack + 飞书

2. **性能退化告警**
   - 条件：`p95_latency > 2000ms`
   - 时间窗口：10 分钟
   - 通知渠道：Slack

3. **关键错误告警**
   - 条件：`error_count > 10`
   - 时间窗口：1 分钟
   - 通知渠道：Slack + 飞书 + 短信

---

## 8. 安全加固

### 8.1 HTTPS 强制

Vercel 自动提供 HTTPS，无需额外配置。验证：

```bash
curl -I http://agent2go.com  # 应返回 301 到 HTTPS
```

### 8.2 CORS 配置

在 API 路由中配置 CORS：

```typescript
// middleware.ts
import { NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const response = NextResponse.next();
  
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
  const origin = req.headers.get('origin') || '';
  
  if (allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin);
  }
  
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return response;
}
```

### 8.3 速率限制

使用 Upstash Redis 实现速率限制：

```typescript
// middleware.ts
import { Ratelimit } from "@upstash/ratelimit";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, "1 m"), // 100 请求/分钟
  analytics: true,
});

export async function middleware(req: NextRequest) {
  const ip = req.ip ?? "127.0.0.1";
  const { success } = await ratelimit.limit(ip);
  
  return success 
    ? NextResponse.next() 
    : new NextResponse("Too Many Requests", { status: 429 });
}
```

### 8.4 安全 Headers

已在 `vercel.json` 中配置：

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    }
  ]
}
```

---

## 9. 部署检查清单

### 9.1 部署前检查

- [ ] 代码通过 CI/CD 流水线（lint、test、build）
- [ ] 所有环境变量已配置
- [ ] 数据库连接已验证
- [ ] 健康检查端点正常（`/api/health`）
- [ ] 自定义域名 SSL 证书已生效
- [ ] 部署通知已配置（飞书）

### 9.2 部署后验证

- [ ] 网站可正常访问（HTTPS）
- [ ] 所有 API 端点正常
- [ ] 数据库读写正常
- [ ] 错误追踪正常（Sentry）
- [ ] 分析数据采集正常（Vercel Analytics）
- [ ] 性能指标达标（P95 < 1s）

### 9.3 灰度发布计划

```
阶段 1: 内部测试（5% 流量）
  - 时间：Day 1
  - 验证核心功能
  - 监控错误率

阶段 2: 小范围用户（20% 流量）
  - 时间：Day 2-3
  - 邀请用户访问
  - 收集反馈

阶段 3: 扩大范围（50% 流量）
  - 时间：Day 4-5
  - 持续监控
  - 准备全量

阶段 4: 全量发布（100% 流量）
  - 时间：Day 6-7
  - 持续监控 24 小时
```

---

## 10. 故障排查

### 10.1 常见问题

#### 问题 1: 部署失败

**症状**: Vercel 构建失败

**排查步骤**:
```bash
# 查看构建日志
vercel logs --debug

# 本地测试构建
npm run build

# 检查 Node.js 版本
node -v  # 应为 20.x
```

#### 问题 2: 数据库连接失败

**症状**: API 返回 500 错误

**排查步骤**:
```bash
# 验证 DATABASE_URL 格式
echo $DATABASE_URL

# 测试数据库连接
psql "postgresql://user:pass@host:5432/dbname"

# 检查 Supabase 状态
# https://status.supabase.com
```

#### 问题 3: 域名验证失败

**症状**: Vercel 显示域名未验证

**排查步骤**:
```bash
# 检查 DNS 配置
dig agent2go.com
dig www.agent2go.com

# 等待 DNS 传播（最多 48 小时）
# 清除本地 DNS 缓存
sudo dscacheutil -flushcache  # macOS
```

### 10.2 紧急回滚

```bash
# 回滚到上一个部署
vercel rollback

# 回滚到指定部署
vercel rollback <DEPLOYMENT_URL>

# 验证回滚
curl -I https://agent2go.com
```

### 10.3 联系支持

- Vercel 支持：https://vercel.com/support
- Supabase 支持：https://supabase.com/dashboard/support
- Sentry 支持：https://sentry.io/support

---

## 附录

### A. 有用的命令

```bash
# Vercel
vercel --prod              # 生产部署
vercel ls                  # 列出部署
vercel logs --follow       # 实时日志
vercel env pull            # 拉取环境变量

# 数据库
npx prisma migrate deploy  # 部署迁移
npx prisma studio          # 数据库 GUI
npx prisma generate        # 生成 Client

# 监控
vercel analytics           # 查看分析数据
```

### B. 参考文档

- [Vercel 文档](https://vercel.com/docs)
- [Next.js 文档](https://nextjs.org/docs)
- [Supabase 文档](https://supabase.com/docs)
- [Sentry 文档](https://docs.sentry.io)
- [Prisma 文档](https://www.prisma.io/docs)

---

**文档维护**: Coder Agent  
**最后更新**: 2026-03-13
