# Agent2Go Monitoring Dashboard Setup Guide

**版本**: v1.0  
**创建日期**: 2026-03-13  
**状态**: 🟡 搭建中

---

## 📋 目录

1. [概述](#1-概述)
2. [CEO 看板（核心业务指标）](#2-ceo 看板核心业务指标)
3. [技术看板（性能/错误率）](#3-技术看板性能错误率)
4. [告警规则配置](#4-告警规则配置)
5. [仪表板访问](#5-仪表板访问)
6. [维护指南](#6-维护指南)

---

## 1. 概述

### 1.1 监控目标

- **实时可见性**: 实时了解系统运行状态
- **快速响应**: 及时发现和处理问题
- **数据驱动**: 基于数据做决策
- **持续优化**: 识别优化机会

### 1.2 监控层次

```
┌─────────────────────────────────────────┐
│          业务层监控（CEO 看板）           │
│  - DAU/MAU                               │
│  - 用户增长                              │
│  - 核心业务指标                          │
└─────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│          应用层监控（技术看板）           │
│  - 性能指标（Web Vitals）                │
│  - 错误率（Sentry）                      │
│  - API 响应时间                          │
└─────────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────┐
│          基础设施监控                     │
│  - 数据库性能                            │
│  - 服务器资源                            │
│  - 第三方服务状态                        │
└─────────────────────────────────────────┘
```

### 1.3 监控工具栈

| 工具 | 用途 | 配置状态 |
|------|------|----------|
| Vercel Analytics | 流量和 Web Vitals | ✅ 已配置 |
| Sentry | 错误追踪和性能监控 | ✅ 已配置 |
| Supabase Dashboard | 数据库监控 | ✅ 可用 |
| 自定义仪表板 | 业务指标 | 🟡 待搭建 |

---

## 2. CEO 看板（核心业务指标）

### 2.1 核心指标定义

#### 用户指标

| 指标 | 定义 | 计算公式 | 目标值 |
|------|------|----------|--------|
| DAU (日活跃用户) | 每日活跃用户数 | 当日登录用户数 | - |
| MAU (月活跃用户) | 每月活跃用户数 | 当月登录用户数 | - |
| 新增用户数 | 每日新增注册用户 | 当日注册用户数 | - |
| 用户留存率 | 用户留存比例 | (DAU / MAU) × 100% | > 60% |
| 付费转化率 | 免费转付费比例 | (付费用户 / 总用户) × 100% | > 5% |

#### 业务指标

| 指标 | 定义 | 计算公式 | 目标值 |
|------|------|----------|--------|
| Agent 创建数 | 每日创建的 Agent 数量 | 当日创建的 Agent 总数 | - |
| 任务执行数 | 每日执行的任务数量 | 当日执行的任务总数 | - |
| 任务成功率 | 任务执行成功比例 | (成功任务 / 总任务) × 100% | > 95% |
| 平均会话时长 | 用户平均使用时长 | 总会话时长 / 总会话数 | > 10 分钟 |

#### 收入指标（如适用）

| 指标 | 定义 | 计算公式 | 目标值 |
|------|------|----------|--------|
| MRR (月经常性收入) | 每月订阅收入 | 当月订阅收入总额 | - |
| ARPU (每用户平均收入) | 每用户贡献收入 | 总收入 / 总用户数 | - |
| LTV (用户生命周期价值) | 用户总贡献价值 | ARPU × 平均生命周期 | - |

---

### 2.2 CEO 看板搭建

#### 方案 A: Vercel Analytics + 自定义查询

**优点**:
- 集成简单
- 实时数据
- 无需额外成本

**缺点**:
- 仅限流量数据
- 业务指标需自定义

**搭建步骤**:

1. **访问 Vercel Analytics**
   ```
   https://vercel.com/agent2go/analytics
   ```

2. **配置关键指标**
   - Page Views（页面浏览量）
   - Unique Visitors（独立访客）
   - Bounce Rate（跳出率）
   - Web Vitals（性能指标）

3. **设置自动报告**
   - 每日邮件报告
   - 每周汇总报告

---

#### 方案 B: 自定义仪表板（推荐）

**技术栈**:
- 前端：Next.js + Recharts
- 数据源：数据库 + Vercel Analytics API
- 部署：Vercel

**搭建步骤**:

1. **创建仪表板页面**
   ```bash
   # 创建新页面
   mkdir -p src/app/dashboard
   touch src/app/dashboard/page.tsx
   ```

2. **实现数据获取**
   ```typescript
   // src/app/dashboard/api/metrics/route.ts
   import { NextResponse } from 'next/server';
   import { PrismaClient } from '@prisma/client';

   const prisma = new PrismaClient();

   export async function GET() {
     // 获取 DAU
     const dau = await prisma.user.count({
       where: {
         lastLoginAt: {
           gte: new Date(new Date().setHours(0, 0, 0, 0)),
         },
       },
     });

     // 获取新增用户
     const newUsers = await prisma.user.count({
       where: {
         createdAt: {
           gte: new Date(new Date().setHours(0, 0, 0, 0)),
         },
       },
     });

     // 获取 Agent 创建数
     const agentsCreated = await prisma.agent.count({
       where: {
         createdAt: {
           gte: new Date(new Date().setHours(0, 0, 0, 0)),
         },
       },
     });

     // 获取任务执行数
     const tasksExecuted = await prisma.task.count({
       where: {
         createdAt: {
           gte: new Date(new Date().setHours(0, 0, 0, 0)),
         },
       },
     });

     return NextResponse.json({
       dau,
       newUsers,
       agentsCreated,
       tasksExecuted,
       timestamp: new Date().toISOString(),
     });
   }
   ```

3. **实现仪表板 UI**
   ```typescript
   // src/app/dashboard/page.tsx
   'use client';

   import { useEffect, useState } from 'react';

   export default function Dashboard() {
     const [metrics, setMetrics] = useState(null);

     useEffect(() => {
       fetch('/dashboard/api/metrics')
         .then((res) => res.json())
         .then((data) => setMetrics(data));
     }, []);

     if (!metrics) return <div>加载中...</div>;

     return (
       <div className="p-8">
         <h1 className="text-3xl font-bold mb-8">CEO 看板</h1>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {/* DAU 卡片 */}
           <div className="bg-white p-6 rounded-lg shadow">
             <h3 className="text-gray-500 text-sm">日活跃用户</h3>
             <p className="text-3xl font-bold">{metrics.dau}</p>
           </div>

           {/* 新增用户卡片 */}
           <div className="bg-white p-6 rounded-lg shadow">
             <h3 className="text-gray-500 text-sm">新增用户</h3>
             <p className="text-3xl font-bold">{metrics.newUsers}</p>
           </div>

           {/* Agent 创建数卡片 */}
           <div className="bg-white p-6 rounded-lg shadow">
             <h3 className="text-gray-500 text-sm">Agent 创建数</h3>
             <p className="text-3xl font-bold">{metrics.agentsCreated}</p>
           </div>

           {/* 任务执行数卡片 */}
           <div className="bg-white p-6 rounded-lg shadow">
             <h3 className="text-gray-500 text-sm">任务执行数</h3>
             <p className="text-3xl font-bold">{metrics.tasksExecuted}</p>
           </div>
         </div>
       </div>
     );
   }
   ```

4. **配置访问权限**
   ```typescript
   // src/middleware.ts
   import { NextResponse } from 'next/server';
   import type { NextRequest } from 'next/server';

   export function middleware(request: NextRequest) {
     const isAdmin = request.cookies.get('admin')?.value === 'true';
     
     if (request.nextUrl.pathname.startsWith('/dashboard') && !isAdmin) {
       return NextResponse.redirect(new URL('/', request.url));
     }
     
     return NextResponse.next();
   }
   ```

---

#### 方案 C: 第三方 BI 工具

**推荐工具**:
- **Metabase**: 开源，易于使用
- **Google Data Studio**: 免费，集成 Google 生态
- **Tableau**: 功能强大，企业级

**Metabase 搭建步骤**:

1. **部署 Metabase**
   ```bash
   # Docker 部署
   docker run -d -p 3000:3000 \
     -e "MB_DB_TYPE=postgres" \
     -e "MB_DB_DBNAME=metabase" \
     -e "MB_DB_PORT=5432" \
     -e "MB_DB_USER=metabase" \
     -e "MB_DB_PASS=secret" \
     --name metabase metabase/metabase
   ```

2. **连接数据源**
   - 添加 Supabase PostgreSQL 数据库
   - 配置 Vercel Analytics API
   - 配置 Stripe（如使用）

3. **创建仪表板**
   - 创建用户增长图表
   - 创建业务指标卡片
   - 创建收入趋势图

4. **设置自动刷新**
   - 配置每 5 分钟自动刷新
   - 设置邮件报告

---

### 2.3 CEO 看板访问

**访问地址**: 
- Vercel Analytics: https://vercel.com/agent2go/analytics
- 自定义仪表板: https://agent2go.com/dashboard（待部署）
- Metabase: https://metrics.agent2go.com（待部署）

**访问权限**:
- CEO: 完全访问
- 管理层: 只读访问
- 团队负责人: 只读访问

---

## 3. 技术看板（性能/错误率）

### 3.1 性能指标

#### Web Vitals

| 指标 | 描述 | 优秀 | 需改进 | 差 |
|------|------|------|--------|-----|
| LCP (最大内容绘制) | 加载性能 | < 2.5s | 2.5-4.0s | > 4.0s |
| FID (首次输入延迟) | 交互性 | < 100ms | 100-300ms | > 300ms |
| CLS (累积布局偏移) | 视觉稳定性 | < 0.1 | 0.1-0.25 | > 0.25 |
| TTFB (首字节时间) | 服务器响应 | < 800ms | 800-1800ms | > 1800ms |

#### API 性能

| 指标 | 目标值 | 告警阈值 |
|------|--------|----------|
| P50 响应时间 | < 200ms | > 500ms |
| P95 响应时间 | < 1000ms | > 2000ms |
| P99 响应时间 | < 2000ms | > 5000ms |
| 错误率 | < 1% | > 5% |

#### 数据库性能

| 指标 | 目标值 | 告警阈值 |
|------|--------|----------|
| 平均查询时间 | < 50ms | > 200ms |
| 慢查询比例 | < 1% | > 5% |
| 连接池使用率 | < 80% | > 90% |

---

### 3.2 技术看板搭建

#### Vercel Analytics 配置

1. **访问 Vercel Dashboard**
   ```
   https://vercel.com/agent2go/analytics
   ```

2. **查看 Web Vitals**
   - 点击 "Web Vitals" 标签
   - 查看 LCP、FID、CLs 趋势
   - 按页面筛选

3. **配置性能告警**
   - Settings → Analytics → Alerts
   - 配置 LCP > 4s 告警
   - 配置 FID > 300ms 告警

---

#### Sentry Dashboard 配置

1. **访问 Sentry Dashboard**
   ```
   https://sentry.io/organizations/agent2go/
   ```

2. **创建 Performance 仪表板**
   - 点击 "Performance" → "Dashboards"
   - 创建新仪表板 "Agent2Go Performance"
   - 添加以下 widgets：
     - Transaction Duration (P50, P95, P99)
     - Error Rate
     - Throughput
     - Apdex Score

3. **创建 Issues 仪表板**
   - 点击 "Issues" → "Dashboards"
   - 创建新仪表板 "Agent2Go Issues"
   - 添加以下 widgets：
     - New Issues Trend
     - Top Issues by Impact
     - Errors by Type
     - Errors by Browser

4. **配置性能监控**
   ```javascript
   // sentry.client.config.js
   Sentry.init({
     dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
     tracesSampleRate: 0.1, // 10% 采样率
     profilesSampleRate: 0.1, // 10% 性能分析采样
     integrations: [
       new Sentry.BrowserTracing({
         tracePropagationTargets: ['agent2go.com'],
       }),
       new Sentry.Replay(),
     ],
     tracesSampler: (context) => {
       // 对关键事务使用更高采样率
       if (context.transactionContext.name === 'POST /api/agents') {
         return 0.5; // 50% 采样
       }
       return 0.1; // 默认 10% 采样
     },
   });
   ```

---

#### Supabase Dashboard 配置

1. **访问 Supabase Dashboard**
   ```
   https://supabase.com/dashboard/project/xxx
   ```

2. **查看数据库性能**
   - Database → Stats
   - 查看查询统计
   - 查看连接数

3. **配置慢查询日志**
   - Database → Settings → Query Performance
   - 启用慢查询日志
   - 设置阈值：100ms

---

### 3.3 技术看板访问

**访问地址**:
- Vercel Analytics: https://vercel.com/agent2go/analytics
- Sentry Dashboard: https://sentry.io/organizations/agent2go/
- Supabase Dashboard: https://supabase.com/dashboard/project/xxx

**访问权限**:
- 技术团队：完全访问
- 产品经理：只读访问
- CEO: 只读访问（可选）

---

## 4. 告警规则配置

### 4.1 Sentry 告警规则

#### 规则 1: 高错误率告警

**配置**:
- **名称**: High Error Rate
- **条件**: `error_rate > 1%`
- **时间窗口**: 5 分钟
- **过滤器**: `environment:production`
- **通知渠道**: Slack + 飞书
- **优先级**: P0

**配置步骤**:
1. Sentry Dashboard → Alerts → Create Alert
2. 选择 "Create from scratch"
3. 配置条件：
   ```
   When: error_rate
   Is: greater than
   Value: 1
   For: 5m
   ```
4. 配置通知：
   - Add Action → Send a notification via Slack
   - Add Action → Send a notification via Webhook (飞书)
5. 保存规则

---

#### 规则 2: 性能退化告警

**配置**:
- **名称**: Performance Degradation
- **条件**: `p95_latency > 2000ms`
- **时间窗口**: 10 分钟
- **过滤器**: `environment:production`
- **通知渠道**: Slack
- **优先级**: P1

**配置步骤**:
1. Sentry Dashboard → Alerts → Create Alert
2. 选择 "Create from scratch"
3. 配置条件：
   ```
   When: p95(transaction.duration)
   Is: greater than
   Value: 2000
   For: 10m
   ```
4. 配置通知
5. 保存规则

---

#### 规则 3: 关键错误告警

**配置**:
- **名称**: Critical Errors
- **条件**: `error_count > 10`
- **时间窗口**: 1 分钟
- **过滤器**: `environment:production AND level:error`
- **通知渠道**: Slack + 飞书 + 短信
- **优先级**: P0

**配置步骤**:
1. Sentry Dashboard → Alerts → Create Alert
2. 选择 "Create from scratch"
3. 配置条件：
   ```
   When: count()
   Is: greater than
   Value: 10
   For: 1m
   ```
4. 配置通知（添加短信通知）
5. 保存规则

---

#### 规则 4: 健康检查失败告警

**配置**:
- **名称**: Health Check Failed
- **条件**: 连续 3 次健康检查失败
- **时间窗口**: 15 分钟
- **通知渠道**: Slack + 飞书
- **优先级**: P0

**实现方式**: 使用 Vercel Uptime Monitoring 或自定义脚本

```bash
# 健康检查脚本（每 5 分钟执行一次）
#!/bin/bash

RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://agent2go.com/api/health)

if [ "$RESPONSE" != "200" ]; then
  # 发送告警
  curl -X POST "https://api.sentry.io/hooks/xxx" \
    -H "Content-Type: application/json" \
    -d "{\"text\": \"Health check failed: HTTP $RESPONSE\"}"
fi
```

---

### 4.2 飞书通知集成

#### 配置 Webhook

1. **创建飞书机器人**
   - 打开飞书群 → 设置 → 群机器人
   - 添加机器人 → 自定义机器人
   - 获取 Webhook URL

2. **配置 Sentry Webhook**
   ```json
   {
     "msg_type": "interactive",
     "card": {
       "header": {
         "title": {
           "tag": "plain_text",
           "content": "🚨 Sentry 告警"
         },
         "template": "red"
       },
       "elements": [
         {
           "tag": "markdown",
           "content": "**告警名称**: {{alert_name}}\n**项目**: {{project_name}}\n**环境**: {{environment}}\n**时间**: {{timestamp}}"
         },
         {
           "tag": "action",
           "actions": [
             {
               "tag": "button",
               "text": {
                 "tag": "plain_text",
                 "content": "查看详情"
               },
               "url": "{{issue_url}}",
               "type": "primary"
             }
           ]
         }
       ]
     }
   }
   ```

3. **测试通知**
   - 触发测试告警
   - 验证飞书消息格式
   - 确认链接可用

---

### 4.3 告警升级流程

```
告警触发
    ↓
值班人员响应（15 分钟内）
    ↓
未响应 → 升级技术负责人
    ↓
未响应（30 分钟）→ 升级董事长
    ↓
事件解决
    ↓
事后复盘（24 小时内）
```

---

## 5. 仪表板访问

### 5.1 访问地址汇总

| 仪表板 | URL | 访问权限 |
|--------|-----|----------|
| Vercel Analytics | https://vercel.com/agent2go/analytics | 团队成员 |
| Sentry Dashboard | https://sentry.io/organizations/agent2go/ | 技术团队 |
| Supabase Dashboard | https://supabase.com/dashboard/project/xxx | 技术团队 |
| CEO 看板（自定义） | https://agent2go.com/dashboard | CEO + 管理层 |
| Metabase（如部署） | https://metrics.agent2go.com | 授权用户 |

---

### 5.2 访问权限管理

#### Vercel

1. **添加团队成员**
   - Vercel Dashboard → Settings → Members
   - 邀请成员 → 分配角色（Admin/Developer/Viewer）

2. **配置项目权限**
   - Project → Settings → Access
   - 配置访问级别

#### Sentry

1. **添加组织成员**
   - Settings → Members
   - 邀请成员 → 分配角色（Owner/Admin/Member/Viewer）

2. **配置项目权限**
   - Project → Settings → Teams
   - 配置团队访问级别

---

## 6. 维护指南

### 6.1 日常检查

**每日检查清单**:
- [ ] 查看 Sentry 错误报告
- [ ] 检查 Vercel Analytics 流量
- [ ] 验证健康检查端点
- [ ] 查看数据库连接数
- [ ] 检查备份状态

**每周检查清单**:
- [ ] 输出周度性能报告
- [ ] 分析错误趋势
- [ ] 优化慢查询
- [ ] 更新仪表板指标
- [ ] 审查告警规则

---

### 6.2 仪表板维护

**月度任务**:
- 审查指标定义
- 优化查询性能
- 清理无用图表
- 更新文档

**季度任务**:
- 评估新监控工具
- 优化告警规则
- 性能基准对比
- 监控成本审查

---

### 6.3 故障排查

#### 问题 1: 数据不更新

**排查步骤**:
1. 检查数据源连接
2. 验证 API 权限
3. 查看日志错误
4. 手动刷新数据

#### 问题 2: 告警未触发

**排查步骤**:
1. 检查告警规则配置
2. 验证通知渠道
3. 测试 Webhook
4. 查看 Sentry 日志

#### 问题 3: 仪表板加载慢

**排查步骤**:
1. 优化数据库查询
2. 添加缓存层
3. 减少图表数量
4. 使用数据聚合

---

## 附录

### A. 有用的查询

#### DAU 查询（PostgreSQL）
```sql
SELECT COUNT(DISTINCT user_id) as dau
FROM user_sessions
WHERE session_date >= CURRENT_DATE;
```

#### 新增用户查询
```sql
SELECT COUNT(*) as new_users
FROM users
WHERE created_at >= CURRENT_DATE;
```

#### 任务成功率查询
```sql
SELECT 
  COUNT(*) as total_tasks,
  SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as successful_tasks,
  (SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)) as success_rate
FROM tasks
WHERE created_at >= CURRENT_DATE;
```

---

### B. 参考文档

- [Vercel Analytics 文档](https://vercel.com/docs/analytics)
- [Sentry 文档](https://docs.sentry.io)
- [Supabase 文档](https://supabase.com/docs)
- [Metabase 文档](https://www.metabase.com/docs)

---

**文档维护**: Coder Agent  
**创建日期**: 2026-03-13  
**最后更新**: 2026-03-13  
**状态**: 🟡 搭建中
