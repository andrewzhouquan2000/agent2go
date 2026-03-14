# Agent2Go 完整设计方案

**版本**: v1.0  
**创建时间**: 2026-03-14  
**状态**: 待审核  

---

## 📋 目录

1. [产品概述](#1-产品概述)
2. [系统架构](#2-系统架构)
3. [界面设计](#3-界面设计)
4. [数据库设计](#4-数据库设计)
5. [API 设计](#5-api 设计)
6. [技术方案](#6-技术方案)
7. [开发计划](#7-开发计划)

---

## 1. 产品概述

### 1.1 产品定位

**Agent2Go** = AI Agent 工作流编排平台

**核心价值**:
- 🤖 创建自定义 AI Agent
- 🔗 编排多 Agent 工作流
- ⚡ 自动化执行任务
- 🔌 集成第三方平台
- 👥 团队协作管理

### 1.2 目标用户

| 用户类型 | 使用场景 |
|----------|----------|
| 电商运营 | 自动生成商品 listing、营销内容 |
| 内容创作者 | 批量创作社交媒体内容 |
| 客服团队 | 自动化客户支持 |
| 数据分析师 | 自动化数据收集与分析 |

### 1.3 核心功能模块

```
Agent2Go
├── Agent 管理（创建/配置/运行）
├── Workflow 编排（可视化流程图）
├── Task 执行（任务队列/日志/结果）
├── Integration 集成（Amazon/Shopify/小红书）
├── Team 协作（成员/权限）
└── Analytics 分析（数据看板）
```

---

## 2. 系统架构

### 2.1 整体架构图

```
┌─────────────────────────────────────────────────────────┐
│                    Mobile App (PWA)                      │
│  React Native / Next.js + TailwindCSS                    │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS
                     ↓
┌─────────────────────────────────────────────────────────┐
│                   API Gateway                            │
│              Vercel Serverless Functions                 │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────┼───────────┐
         ↓           ↓           ↓
    ┌────────┐  ┌────────┐  ┌────────┐
    │ Agent  │  │  Task  │  │Integration│
    │Runtime │  │ Queue  │  │ Service │
    └────┬───┘  └────┬───  └───────┘
         │           │           │
         └───────────┼───────────┘
                     ↓
         ┌─────────────────────┐
         │   PostgreSQL DB     │
         │   (Neon Serverless) │
         └─────────────────────┘
                     ↓
         ┌─────────────────────┐
         │   Redis Cache       │
         │   (Task Queue)      │
         └─────────────────────┘
```

### 2.2 Agent 执行流程

```
┌─────────┐     ┌─────────┐     ┌─────────     ┌─────────┐     ┌─────────┐
│  Input  │ ──→ │ Prompt  │ ──→ │  Model  │ ──→ │  Tools  │ ──→ │ Output  │
│  (JSON) │     │ Engine  │     │ (LLM)   │     │ (API)   │     │ (JSON)  │
└─────────┘     └─────────┘     └─────────┘     └─────────     └─────────┘
```

### 2.3 Multi-Agent Workflow 执行

```
┌──────────────┐
│  Data Source │
│  (Trigger)   │
└──────┬───────┘
       │
       ↓
┌──────────────┐
│ Content Agent│
│ (GPT-4o)     │
└──────┬───────┘
       │
       ↓
┌──────────────┐
│ Review Agent │
│ (Moderation) │
└──────┬───────┘
       │
       ↓
┌──────────────┐
│ Publish Agent│
│ (API Call)   │
└──────────────┘
```

---

## 3. 界面设计

### 3.1 设计系统

#### 颜色规范

| 用途 | 颜色值 | 说明 |
|------|--------|------|
| 主色 | `#2563EB` | 蓝色（品牌色） |
| 主色渐变 | `#2563EB → #3B82F6` | 导航栏背景 |
| 背景 | `#F3F4F6` | 页面背景 |
| 卡片 | `#FFFFFF` | 卡片背景 |
| 文字主色 | `#1F2937` | 主要文字 |
| 文字次要 | `#6B7280` | 辅助文字 |
| 成功 | `#10B981` | 绿色 |
| 警告 | `#F59E0B` | 橙色 |
| 错误 | `#EF4444` | 红色 |

#### 字体规范

| 层级 | 大小 | 字重 | 行高 |
|------|------|------|------|
| 大标题 | 24px | Bold | 32px |
| 标题 | 18px | SemiBold | 24px |
| 正文 | 16px | Regular | 24px |
| 辅助文字 | 14px | Regular | 20px |
| 小字 | 12px | Regular | 16px |

#### 间距规范

| 类型 | 数值 | 使用场景 |
|------|------|----------|
| 页面边距 | 16px | 页面左右边距 |
| 卡片内边距 | 16px | 卡片内容边距 |
| 卡片间距 | 12px | 卡片之间间距 |
| 元素间距 | 8px | 元素之间间距 |

#### 组件规范

| 组件 | 圆角 | 阴影 |
|------|------|------|
| 卡片 | 12px | `0 1px 3px rgba(0,0,0,0.1)` |
| 按钮 | 8px | `0 1px 2px rgba(0,0,0,0.05)` |
| 输入框 | 8px | `0 1px 2px rgba(0,0,0,0.05)` |
| 头像 | 50% | - |

---

### 3.2 20 界面详细设计

#### P0 核心界面（7 个）

##### 1️⃣ Dashboard（首页）

**布局**:
```
┌─────────────────────────────────────┐
│ Agent2Go              [头像]        │ ← 导航栏（蓝色渐变）
├─────────────────────────────────────┤
│ ┌─────────┐ ┌─────────            │
│ │ Active  │ │ Running │            │ ← 数据卡片（2 列）
│ │ Agents  │ │ Workflows│           │
│ │   12    │ │    5     │           │
│ └───────── └─────────┘            │
│ ┌─────────┐ ┌─────────┐            │
│ │ Tasks   │ │ Success │            │
│ │ Today   │ │  Rate   │            │
│ │   48    │ │  98.5%  │            │
│ └─────────┘ └─────────            │
├─────────────────────────────────────┤
│ Task Performance Chart              │ ← 折线图/柱状图
│ ███████▓▓▓▓▓▓▓▓▓                  │
├─────────────────────────────────────┤
│ Recent Tasks                        │
│ • Generate Amazon Listing ✓         │
│ • Create Social Content ✓           │
│ • Analyze Sales Data ⟳              │
├─────────────────────────────────────┤
│ [🏠] [🤖] [📋] [🔗] [️]            │ ← 底部导航（5 Tab）
│Dashboard Agents Tasks Workflows Set │
└─────────────────────────────────────┘
```

**交互**:
- 下拉刷新数据
- 点击卡片进入详情页
- 点击任务进入 Task Detail

---

##### 2️⃣ Create Agent

**布局**:
```
┌─────────────────────────────────────┐
│ ← Create Agent                      │
├─────────────────────────────────────┤
│ Select Template                     │
├─────────────────────────────────────┤
│ ─────────────────────────────────┐ │
│ │ 📝 Content Creator              │ │
│ │ Generate social content         │ │
│ │ automatically                   │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 🛒 Amazon Operator              │ │
│ │ Automate Amazon operations      │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 📕 Xiaohongshu Marketing        │ │
│ │ 小红书营销专家                   │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 📊 Data Analyst                 │ │
│ │ Data analysis expert            │ │
│ └─────────────────────────────────┘ │
─────────────────────────────────────
│           [Create Agent]            │ ← 固定底部按钮
└─────────────────────────────────────┘
```

**交互**:
- 点击模板卡片 → 进入 Agent Config
- 卡片选中状态：蓝色边框

---

##### 3️⃣ Agent Config

**布局**:
```
┌─────────────────────────────────────┐
│ ← Agent Config                      │
├─────────────────────────────────────┤
│ Agent Name *                        │
│ ┌─────────────────────────────────┐ │
│ │ Amazon Listing Generator        │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Model *                             │
│ ┌─────────────────────────────────┐ │
│ │ GPT-4o                    ▼     │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Tools                               │
│ ┌─────────┐ ┌───────── ┌─────────┐│
│ │✓ Search │ │✓ Browser│ │ Shopify ││
│ └───────── └─────────┘ ─────────┘│
│                                     │
│ Memory                              │
│ ┌─────────────────────────────────┐ │
│ │ Enable Long-term Memory   [●]  │ │
│ └─────────────────────────────────┘ │
├─────────────────────────────────────┤
│           [Confirm]                 │
└─────────────────────────────────────┘
```

**交互**:
- 表单验证（必填项）
- Tools 多选（点击切换）
- Memory 开关（Toggle）

---

##### 4️⃣ Agent Detail

**布局**:
```
┌─────────────────────────────────────┐
│ ← Agent Detail                      │
├─────────────────────────────────────┤
│         ┌───────────┐               │
│         │     A     │               │ ← 大头像（渐变背景）
│         └───────────┘               │
│      Amazon Listing Generator       │
│      Status: 🟢 Running             │
│      Last Run: 5 minutes ago        │
├─────────────────────────────────────┤
│ [Run Agent] [Edit Prompt] [Logs]    │ ← 操作按钮组
├─────────────────────────────────────┤
│ Tasks                               │
│ • Generate 10 listings ✓            │
│ • Update prices ⟳                   │
├─────────────────────────────────────┤
│ Memory                              │
│ • 128 items in short-term           │
│ • 1,024 items in vector             │
└─────────────────────────────────────┘
```

---

##### 5️⃣ Workflow Builder（核心）

**布局**:
```
┌─────────────────────────────────────┐
│ ← Workflow Builder        [Save]    │
├─────────────────────────────────────┤
│ + Add Node                          │
├─────────────────────────────────────┤
│                                     │
│    ┌─────────────┐                  │
│    │ Data Source │                  │
│    │   (Trigger) │                  │
│    └──────┬──────┘                  │
│           │                         │
│           ↓                         │
│    ┌─────────────┐                  │
│    │Content Agent│                  │
│    │  (GPT-4o)   │                  │
│    └──────┬──────┘                  │
│           │                         │
│           ↓                         │
│    ┌─────────────┐                  │
│    │Publish Agent│                  │
│    │  (API Call) │                  │
│    └─────────────┘                  │
│                                     │
├─────────────────────────────────────┤
│ [▶ Run] [✏️ Edit] [🗑️ Delete]       │
└─────────────────────────────────────┘
```

**交互**:
- 拖拽节点（移动端：长按拖拽）
- 点击节点 → 编辑节点配置
- 点击连线 → 删除连接
- 双击空白 → 添加节点

---

##### 6️⃣ Task List

**布局**:
```
┌─────────────────────────────────────┐
│ ← Tasks           [+ New]           │
├─────────────────────────────────────┤
│ [All] [Running] [Completed] [Failed]│ ← Tab 筛选
├─────────────────────────────────────┤
│ ─────────────────────────────────┐ │
│ │ Generate Amazon Listing         │ │
│ │ Status: ✓ Completed             │ │
│ │ Agent: Amazon Operator          │ │
│ │ 2 minutes ago                   │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Create Social Content           │ │
│ │ Status: ⟳ Running               │ │
│ │ Agent: Content Creator          │ │
│ │ Just now                        │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Analyze Sales Data              │ │
│ │ Status: ✗ Failed                │ │
│ │ Agent: Data Analyst             │ │
│ │ 1 hour ago                      │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**交互**:
- Tab 切换筛选
- 点击任务 → Task Detail
- 左滑操作（重试/删除）

---

##### 7️⃣ Prompt Editor

**布局**:
```
┌─────────────────────────────────────┐
│ ← Prompt Editor           [Save]    │
├─────────────────────────────────────┤
│ System Prompt *                     │
│ ┌─────────────────────────────────┐ │
│ │ You are an Amazon listing       │ │
│ │ expert. Generate product        │ │
│ │ descriptions optimized for      │ │
│ │ SEO and conversion.             │ │
│ │                                 │ │
│ │ ```                             │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Instructions                        │
│ ┌─────────────────────────────────┐ │
│ │ - Focus on benefits             │ │
│ │ - Use bullet points             │ │
│ │ - Include keywords              │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Examples                            │
│ ┌─────────────────────────────────┐ │
│ │ Input: Wireless Earbuds         │ │
│ │ Output: Premium sound...        │ │
│ └─────────────────────────────────┘ │
─────────────────────────────────────
│ [Test Prompt]           [Save]      │
└─────────────────────────────────────┘
```

**交互**:
- 代码编辑器（语法高亮）
- Test Prompt → 预览效果
- 自动保存草稿

---

### 3.3 信息架构

```
Agent2Go
├── Dashboard（首页）
│   ├── 数据概览
│   ├── 趋势图表
│   └── 最近活动
├── Agents（Agent 管理）
│   ├── Agent List
│   ├── Create Agent
│   │   └── Agent Config
│   └── Agent Detail
│       ├── Run Agent
│       ├── Edit Prompt
│       └── View Logs
├── Tasks（任务管理）
│   ├── Task List
│   └── Task Detail
│       ├── Logs
│       ├── Results
│       └── Retry
├── Workflows（工作流）
│   ├── Workflow List
│   ├── Workflow Builder
│   └── Workflow Run
└── Settings（设置）
    ├── Profile
    ├── API Keys
    ├── Integrations
    │   ├── Integration List
    │   └── Add Integration
    ├── Team
    │   └── Team Management
    └── Help & Support
```

---

## 4. 数据库设计

### 4.1 ER 图

```
┌──────────────┐       ┌──────────────┐
│    users     │       │    team      │
├──────────────┤       ├──────────────┤
│ id           │◄──────│ user_id      │
│ email        │       │ role         │
│ name         │       │ status       │
│ avatar       │       └──────────────┘
│ created_at   │
└──────┬───────┘
       │
       ├──────────────────┐
       │                  │
       ↓                  ↓
┌──────────────┐   ┌──────────────┐
│   agents     │   │  workflows   │
├──────────────┤   ├──────────────┤
│ id           │   │ id           │
│ user_id      │   │ user_id      │
│ name         │   │ name         │
│ model        │   │ nodes (JSON) │
│ config(JSON) │   │ edges (JSON) │
│ status       │   │ status       │
└──────┬───────┘   └──────┬───────┘
       │                  │
       ↓                  ↓
┌──────────────┐   ┌──────────────┐
│    tasks     │   │ integrations │
├──────────────┤   ├──────────────┤
│ id           │   │ id           │
│ agent_id     │   │ user_id      │
│ workflow_id  │   │ platform     │
│ status       │   │ api_key      │
│ input(JSON)  │   │ status       │
│ output(JSON) │   └──────────────┘
│ logs (TEXT)  │
└──────────────┘
```

### 4.2 表结构

#### users
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| email | VARCHAR | 邮箱（唯一） |
| name | VARCHAR | 昵称 |
| avatar | VARCHAR | 头像 URL |
| created_at | TIMESTAMP | 创建时间 |

#### agents
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| user_id | UUID | 外键 |
| name | VARCHAR | Agent 名称 |
| model | VARCHAR | 模型（GPT-4o 等） |
| config | JSONB | 配置（Tools/Memory） |
| prompt | TEXT | System Prompt |
| status | VARCHAR | Running/Idle/Error |
| created_at | TIMESTAMP | 创建时间 |

#### workflows
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| user_id | UUID | 外键 |
| name | VARCHAR | 工作流名称 |
| nodes | JSONB | 节点定义 |
| edges | JSONB | 连接关系 |
| status | VARCHAR | Active/Draft |
| created_at | TIMESTAMP | 创建时间 |

#### tasks
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| agent_id | UUID | 外键（可选） |
| workflow_id | UUID | 外键（可选） |
| status | VARCHAR | Pending/Running/Completed/Failed |
| input | JSONB | 输入数据 |
| output | JSONB | 输出数据 |
| logs | TEXT | 执行日志 |
| error | TEXT | 错误信息 |
| created_at | TIMESTAMP | 创建时间 |

#### integrations
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| user_id | UUID | 外键 |
| platform | VARCHAR | 平台（Amazon/Shopify 等） |
| api_key | VARCHAR | API Key（加密） |
| api_secret | VARCHAR | API Secret（加密） |
| status | VARCHAR | Connected/Disconnected |
| created_at | TIMESTAMP | 创建时间 |

#### team
| 字段 | 类型 | 说明 |
|------|------|------|
| id | UUID | 主键 |
| user_id | UUID | 外键 |
| member_id | UUID | 成员 ID |
| role | VARCHAR | Owner/Admin/Member |
| status | VARCHAR | Active/Inactive |
| created_at | TIMESTAMP | 创建时间 |

---

## 5. API 设计

### 5.1 RESTful API

#### Dashboard
```
GET /api/dashboard/summary
Response: {
  activeAgents: number,
  runningWorkflows: number,
  tasksToday: number,
  successRate: number,
  recentTasks: Task[],
  agentActivities: Activity[]
}
```

#### Agents
```
GET  /api/agents              # 列表
POST /api/agents              # 创建
GET  /api/agents/:id          # 详情
PUT  /api/agents/:id          # 更新
DELETE /api/agents/:id        # 删除
POST /api/agents/:id/run      # 运行
GET  /api/agents/:id/prompt   # 获取 Prompt
PUT  /api/agents/:id/prompt   # 更新 Prompt
GET  /api/agents/:id/memory   # 获取记忆
```

#### Workflows
```
GET  /api/workflows           # 列表
POST /api/workflows           # 创建
GET  /api/workflows/:id       # 详情
PUT  /api/workflows/:id       # 更新
DELETE /api/workflows/:id     # 删除
POST /api/workflows/:id/run   # 运行
```

#### Tasks
```
GET  /api/tasks               # 列表（支持筛选）
GET  /api/tasks/:id           # 详情
POST /api/tasks/:id/retry     # 重试
DELETE /api/tasks/:id         # 删除
```

#### Integrations
```
GET    /api/integrations      # 列表
POST   /api/integrations      # 添加
PUT    /api/integrations/:id  # 更新
DELETE /api/integrations/:id  # 删除
POST   /api/integrations/:id/test  # 测试连接
```

#### Team
```
GET    /api/team              # 成员列表
POST   /api/team              # 邀请成员
PUT    /api/team/:id/role     # 修改角色
DELETE /api/team/:id          # 移除成员
```

#### Analytics
```
GET /api/analytics/sales      # 销售数据
GET /api/analytics/tasks      # 任务统计
GET /api/analytics/workflows  # 工作流成功率
```

---

## 6. 技术方案

### 6.1 技术栈选型

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端 | Next.js 16 + TailwindCSS | PWA 支持，响应式 |
| 部署 | Vercel | Serverless Functions |
| 数据库 | PostgreSQL (Neon) | Serverless DB |
| 缓存 | Redis (Upstash) | Task Queue |
| AI | OpenAI API | GPT-4o/Claude |
| 认证 | NextAuth.js | 支持多 provider |
| 状态管理 | Zustand | 轻量级 |
| 图表 | Recharts | 响应式图表 |

### 6.2 项目结构

```
agent2go/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # 认证页面
│   │   ├── (dashboard)/        # 主应用页面
│   │   │   ├── dashboard/
│   │   │   ├── agents/
│   │   │   ├── tasks/
│   │   │   ├── workflows/
│   │   │   └── settings/
│   │   └── api/                # API Routes
│   │       ├── agents/
│   │       ├── workflows/
│   │       ├── tasks/
│   │       └── integrations/
│   ├── components/             # React 组件
│   │   ├── ui/                 # 基础 UI 组件
│   │   ├── agents/             # Agent 相关组件
│   │   ├── workflows/          # Workflow 组件
│   │   └── tasks/              # Task 组件
│   ├── lib/                    # 工具库
│   │   ├── prisma.ts           # 数据库客户端
│   │   ├── ai/                 # AI 封装
│   │   └── utils.ts            # 工具函数
│   └── types/                  # TypeScript 类型
├── prisma/
│   └── schema.prisma           # 数据库模型
├── public/                     # 静态资源
└── tests/                      # 测试文件
```

### 6.3 关键实现

#### Agent Runtime
```typescript
// src/lib/agent/runtime.ts
class AgentRuntime {
  async execute(agent: Agent, input: any): Promise<TaskResult> {
    // 1. 加载 Prompt
    const prompt = await this.loadPrompt(agent);
    
    // 2. 调用 LLM
    const response = await this.callLLM(agent.model, prompt, input);
    
    // 3. 执行 Tools
    if (agent.tools) {
      for (const tool of agent.tools) {
        response = await this.executeTool(tool, response);
      }
    }
    
    // 4. 保存结果
    return this.saveResult(agent, response);
  }
}
```

#### Workflow Engine
```typescript
// src/lib/workflow/engine.ts
class WorkflowEngine {
  async execute(workflow: Workflow, input: any): Promise<any> {
    let data = input;
    
    // 按顺序执行节点
    for (const node of workflow.nodes) {
      const agent = await this.getAgent(node.agentId);
      data = await this.runtime.execute(agent, data);
      
      // 检查条件分支
      if (node.condition) {
        const nextNode = this.evaluateCondition(node.condition, data);
        if (!nextNode) break;
      }
    }
    
    return data;
  }
}
```

#### Task Queue
```typescript
// src/lib/queue/task-queue.ts
class TaskQueue {
  async enqueue(task: Task): Promise<void> {
    await redis.lpush('task:queue', JSON.stringify(task));
  }
  
  async process(): Promise<void> {
    while (true) {
      const task = await redis.brpop('task:queue', 0);
      await this.executeTask(task);
    }
  }
}
```

---

## 7. 开发计划

### 7.1 阶段划分

#### Phase 1: MVP（2 周）
- [ ] 项目初始化 + 基础架构
- [ ] 用户认证（登录/注册）
- [ ] Agent 管理（CRUD）
- [ ] Task 执行（单 Agent）
- [ ] Dashboard（基础数据）

#### Phase 2: Workflow（2 周）
- [ ] Workflow Builder（可视化编辑器）
- [ ] Multi-Agent 执行
- [ ] Task 队列 + 重试机制
- [ ] Integration（Amazon/Shopify）

#### Phase 3: 增强（2 周）
- [ ] Team Management
- [ ] Analytics（数据看板）
- [ ] Prompt Editor（高级功能）
- [ ] Agent Memory（向量存储）

#### Phase 4: 优化（1 周）
- [ ] 性能优化
- [ ] 移动端适配
- [ ] 错误处理 + 日志
- [ ] 文档 + 测试

### 7.2 里程碑

| 时间 | 里程碑 | 交付物 |
|------|--------|--------|
| Week 2 | MVP 完成 | 可创建/运行 Agent |
| Week 4 | Workflow 完成 | 可编排多 Agent 工作流 |
| Week 6 | 完整功能 | 所有 20 界面可用 |
| Week 7 | 上线 | 生产环境部署 |

### 7.3 风险与应对

| 风险 | 影响 | 应对措施 |
|------|------|----------|
| Vercel 构建失败 | 高 | 本地充分测试，分阶段部署 |
| AI API 成本高 | 中 | 缓存 + 限流 + 本地模型备选 |
| 移动端体验差 | 中 | 优先 PWA，后续 React Native |
| 数据库性能 | 中 | 索引优化 + 读写分离 |

---

## 📎 附录

### A. 设计资源
- Figma 设计稿：[待创建]
- 原型演示：[待创建]

### B. 相关文档
- [产品需求文档](./product-design-spec.md)
- [20 界面分析](./20-screens-analysis.md)

### C. 联系方式
- 项目负责人：董事长
- 技术负责人：待分配
- 设计负责人：待分配

---

**文档状态**: 待审核  
**最后更新**: 2026-03-14 14:45  
**版本**: v1.0
