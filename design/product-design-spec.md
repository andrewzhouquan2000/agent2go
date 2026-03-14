# Agent2Go 移动端产品设计说明（完整版）

**来源**: 董事长提供  
**时间**: 2026-03-14 14:39  
**版本**: v1.0

---

## 📱 20 页面详细拆解

### 第 1 页 Dashboard（移动端首页）

**功能**: 系统总览页面，用户打开 App 后默认进入

**主要作用**:
- 查看 AI Agent 工作情况
- 查看任务运行状态
- 查看业务趋势

**页面结构**:

| 区域 | 元素 | 说明 |
|------|------|------|
| 顶部 | Agent2Go Logo + 用户头像 | 品牌 + 个人中心入口 |
| 数据卡片 | Active Agents | 活跃 Agent 数量 |
| 数据卡片 | Running Workflows | 运行中工作流 |
| 数据卡片 | Tasks Today | 今日任务数 |
| 数据卡片 | Success Rate | 成功率 |
| 图表 | Task Performance Chart | 任务性能趋势图 |
| 最近活动 | Recent Tasks | 最近任务列表 |
| 最近活动 | Agent Activities | Agent 活动记录 |
| 底部导航 | Dashboard/Agents/Tasks/Workflows/Settings | 5 Tab 固定导航 |

**数据来源**: `/api/dashboard/summary`

**页面关系**:
```
Dashboard
├── Agents
├── Tasks
└── Workflows
```

---

### 第 2 页 Create Agent

**功能**: 创建新的 AI Agent

**模板列表**:
| 模板名称 | 描述 |
|----------|------|
| Content Creator | Generate social content automatically |
| Amazon Operator | Amazon 运营自动化 |
| Xiaohongshu Marketing | 小红书营销专家 |
| Data Analyst | 数据分析专家 |
| Customer Support | 客服机器人 |

**页面结构**:
- 标题：Create Agent
- 模板列表（卡片式，可点击）
- 按钮：Create Agent（点击模板后进入 Agent Config）

**页面关系**: `Create Agent → Agent Config`

---

### 第 3 页 Agent Config

**功能**: 配置 Agent

**字段**:
| 字段 | 类型 | 示例 |
|------|------|------|
| Agent Name | 文本输入 | Amazon Listing Generator |
| Model | 下拉选择 | GPT-4o |
| Tools | 多选 | Search, Browser, Shopify API |
| Memory | 开关 | 启用/禁用 |

**按钮**: Confirm

**提交 API**: `POST /api/agents/create`

**页面关系**: `Create Agent → Agent Config → Agent Detail`

---

### 第 4 页 Agent Detail

**功能**: 查看 Agent 状态

**页面内容**:
- Agent Status（状态指示器）
- Tasks（任务列表）
- Memory（记忆管理）
- Prompt（提示词预览）

**信息**:
- Agent Name
- Status（Running/Idle/Error）
- Last Run（最后运行时间）

**操作**:
- Run Agent
- Edit Prompt
- View Logs

**API**: `/api/agents/{id}`

**页面关系**: `Agents List → Agent Detail`

---

### 第 5 页 Workflow Builder（核心页面）

**功能**: 构建 Multi-Agent Workflow

**节点示例**:
```
Data Source
    ↓
Content Agent
    ↓
Review Agent
    ↓
Publish
```

**UI 结构**:
- 顶部：Workflow Builder 标题
- 中间：Workflow Graph（可视化流程图）
- 节点：Data Source / Content Creator / Publisher（可拖拽）

**页面关系**: `Workflow Builder → Workflow Run`

---

### 第 6 页 Workflow List

**功能**: 查看所有 Workflow

**字段**:
| 字段 | 示例 |
|------|------|
| Workflow Name | Daily Content Pipeline |
| Status | Running |
| Last Run | 2 小时前 |

**操作**: Run / Edit / View

**API**: `/api/workflows`

**页面关系**: 
```
Workflow List
├── Workflow Builder
└── Workflow Run
```

---

### 第 7 页 Task List

**功能**: 查看任务

**分类**:
- Completed（已完成）
- Running（运行中）
- Failed（失败）

**示例**:
| 任务名称 | 状态 |
|----------|------|
| Generate Amazon Listing | Completed |

**API**: `/api/tasks`

**页面关系**: `Task List → Task Detail`

---

### 第 8 页 Task Detail

**功能**: 查看任务执行过程

**内容**:
- Task Status（状态）
- Logs（执行日志）
- Results（结果展示）

**日志示例**:
```
Agent started
Generating content
Publishing result
```

**API**: `/api/tasks/{id}`

**页面关系**: `Task List → Task Detail`

---

### 第 9 页 Integration List

**功能**: 管理外部平台集成

**支持平台**:
- Amazon
- Shopify
- Xiaohongshu
- YouTube

**状态**: Connected / Disconnected

**操作**: Connect / Disconnect

**API**: `/api/integrations`

**页面关系**: `Integration List → Add Integration`

---

### 第 10 页 Add Integration

**功能**: 连接平台

**字段**:
| 字段 | 类型 |
|------|------|
| Platform | 下拉选择 |
| API Key | 密码输入 |
| Secret | 密码输入 |

**按钮**: Connect

**API**: `POST /api/integrations/connect`

---

### 第 11 页 Templates

**功能**: 模板市场

**内容**:
| 模板 | 描述 |
|------|------|
| Amazon Listing Bot | Amazon 商品 listing 生成 |
| Xiaohongshu Content Maker | 小红书内容创作 |
| Customer Support Bot | 客服机器人 |

**按钮**: Use Template

**页面关系**: `Templates → Create Agent`

---

### 第 12 页 Team Management

**功能**: 团队管理

**字段**:
| 字段 | 示例 |
|------|------|
| Name | 张三 |
| Role | Owner/Admin/Member |
| Status | Active/Inactive |

**角色**:
- Owner（所有者）
- Admin（管理员）
- Member（成员）

**API**: `/api/team`

---

### 第 13 页 Prompt Editor

**功能**: 编辑 AI Prompt

**字段**:
| 字段 | 说明 |
|------|------|
| System Prompt | 系统提示词 |
| Instructions | 指令说明 |
| Examples | 示例 |

**示例**:
```
You are an Amazon listing expert.
Generate product descriptions optimized for SEO.
```

**API**: `/api/agents/prompt`

---

### 第 14 页 Agent Memory

**功能**: 管理 Agent 记忆

**类型**:
- Short-term Memory（短期记忆）
- Vector Memory（向量记忆）
- Context History（上下文历史）

**API**: `/api/agents/memory`

---

### 第 15 页 Settings

**功能**: 系统设置

**内容**:
- Profile（个人资料）
- API Keys（密钥管理）
- Notifications（通知设置）
- Security（安全设置）

**API**: `/api/settings`

---

### 第 16 页 Analytics

**功能**: 数据分析

**图表**:
- Sales（销售数据）
- Tasks（任务统计）
- Workflow Success（工作流成功率）

**API**: `/api/analytics`

---

### 第 17 页 Task Error

**功能**: 任务失败处理

**内容**:
- API Error（错误信息）
- Error Logs（错误日志）
- Retry Task（重试按钮）

**按钮**: Retry Task（红色醒目）

**API**: `POST /api/tasks/retry`

---

### 第 18 页 Help & Support

**功能**: 帮助中心

**内容**:
- User Guide（用户指南）
- FAQ（常见问题）
- Contact Support（联系客服）

---

### 第 19 页 Mobile Dashboard

**功能**: 移动简版仪表盘

**卡片**:
- Agents（Agent 数量）
- Tasks（任务数量）
- Workflows（工作流数量）

---

### 第 20 页 Workflow Mobile

**功能**: 移动端 Workflow 运行页面

**流程**:
```
Data Node
    ↓
Content Agent
    ↓
Publish
```

**状态**: Running / Success

---

## 🏗️ 系统架构

### 整体架构

```
Mobile App
    ↓
API Gateway
    ↓
Agent Runtime
    ↓
Task Queue
    ↓
Database
```

---

### Agent Runtime

**执行流程**:
```
Input
    ↓
Prompt
    ↓
Model
    ↓
Tools
    ↓
Output
```

---

### Multi-Agent Workflow

**执行流程**:
```
Node1
    ↓
Node2
    ↓
Node3
```

**数据流**:
```
Task Input → Agent Output → Next Agent
```

---

## 🗄️ 数据库核心表

### 表结构

| 表名 | 说明 |
|------|------|
| users | 用户表 |
| agents | Agent 表 |
| workflows | 工作流表 |
| tasks | 任务表 |
| integrations | 集成表 |
| team | 团队表 |
| logs | 日志表 |

### 关系图

```
User
├── Agents
├── Workflows
├── Tasks
└── Integrations
```

---

## 🛠️ 推荐技术栈

### 前端
- React Native 或 Next.js + PWA

### 后端
- Vercel Serverless

### 数据库
- PostgreSQL

### 队列
- Redis

### AI
- OpenAI
- Anthropic
- Local LLM

---

**文档版本**: v1.0  
**最后更新**: 2026-03-14 14:39
