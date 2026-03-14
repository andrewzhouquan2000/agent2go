# Agent2Go 产品需求文档（PRD）

**文档版本**: v1.0  
**创建时间**: 2026-03-14  
**创建人**: XiaoZhou (AI CEO)  
**状态**: 待审核  
**保密级别**: 内部机密

---

## 📋 文档修订记录

| 版本 | 日期 | 修改人 | 修改内容 |
|------|------|--------|----------|
| v1.0 | 2026-03-14 | XiaoZhou | 初始版本 |

---

## 📑 目录

1. [产品概述](#1-产品概述)
2. [用户画像](#2-用户画像)
3. [功能需求](#3-功能需求)
4. [非功能需求](#4-非功能需求)
5. [系统架构](#5-系统架构)
6. [界面设计](#6-界面设计)
7. [数据设计](#7-数据设计)
8. [API 设计](#8-api 设计)
9. [技术方案](#9-技术方案)
10. [开发计划](#10-开发计划)
11. [风险与应对](#11-风险与应对)
12. [附录](#12-附录)

---

## 1. 产品概述

### 1.1 产品定位

**Agent2Go** = AI Agent 工作流编排平台

让每个企业都能轻松创建、编排和运行 AI Agent，实现业务流程自动化。

### 1.2 产品愿景

成为企业 AI 自动化的首选平台，让 AI Agent 像手机 App 一样普及。

### 1.3 核心价值主张

| 价值维度 | 描述 |
|----------|------|
|  **低门槛** | 无需编程，可视化创建 AI Agent |
| 🔗 **强编排** | 多 Agent 协作，复杂工作流一键编排 |
| ⚡ **快执行** | 云端运行，任务秒级响应 |
| 🔌 **易集成** | 预置主流平台集成（Amazon/Shopify/小红书） |
| 👥 **能协作** | 团队管理，权限控制，多人协作 |

### 1.4 产品目标

#### 短期目标（3 个月）
- ✅ 完成 MVP 开发，支持单 Agent 创建和运行
- ✅ 实现基础 Workflow 编排功能
- ✅ 完成 5 个核心界面开发
- ✅ 获取 100 个种子用户

#### 中期目标（6 个月）
- ✅ 完整 20 界面全部上线
- ✅ 支持 Multi-Agent Workflow
- ✅ 集成 10+ 第三方平台
- ✅ 付费用户突破 1000 人

#### 长期目标（12 个月）
- ✅ 成为 AI Agent 编排领域 Top 3 产品
- ✅ 支持企业私有化部署
- ✅ 建立 Agent 模板市场
- ✅ 年收入突破 1000 万

### 1.5 核心功能模块

```
Agent2Go
├── Agent 管理（创建/配置/运行）
├── Workflow 编排（可视化流程图）
├── Task 执行（任务队列/日志/结果）
├── Integration 集成（Amazon/Shopify/小红书）
├── Team 协作（成员/权限）
└── Analytics 分析（数据看板）
```

### 1.6 使用场景

#### 场景 1：电商运营自动化
```
用户：电商运营专员
需求：每天需要为 100+ 商品生成 Amazon listing
解决方案：
1. 创建 "Amazon Listing Agent"
2. 配置商品数据源（CSV/Excel）
3. 设置输出格式（标题/描述/关键词）
4. 一键运行，自动生成 100+ listing
5. 人工审核后批量上传
价值：节省 90% 时间，从 8 小时→30 分钟
```

#### 场景 2：社交媒体内容批量创作
```
用户：内容营销团队
需求：每周需要发布 20+ 篇小红书笔记
解决方案：
1. 创建 "Xiaohongshu Content Agent"
2. 配置品牌调性和风格要求
3. 输入产品卖点关键词
4. Agent 自动生成文案 + 配图建议
5. 团队协作审核 → 发布
价值：内容产出提升 5 倍，质量稳定
```

#### 场景 3：客户支持自动化
```
用户：客服团队负责人
需求：7x24 小时响应客户咨询
解决方案：
1. 创建 "Customer Support Agent"
2. 导入产品知识库
3. 配置常见问题回答模板
4. 集成客服系统 API
5. Agent 自动响应 80% 常见问题
价值：客服成本降低 60%，响应速度提升 10 倍
```

---

## 2. 用户画像

### 2.1 主要用户群体

| 用户类型 | 占比 | 核心需求 | 付费意愿 |
|----------|------|----------|----------|
| 电商运营 | 40% | 商品 listing 生成、营销内容创作 | 高 |
| 内容创作者 | 25% | 批量创作社交媒体内容 | 中 |
| 中小企业主 | 20% | 业务流程自动化、降本增效 | 高 |
| 开发者 | 10% | API 集成、自定义扩展 | 中 |
| 其他 | 5% | 个人效率工具 | 低 |

### 2.2 典型用户画像

#### 画像 1：电商运营小王
```
姓名：王小明
年龄：28 岁
职业：Amazon 运营专员
公司：深圳某跨境电商公司（50 人）

痛点：
• 每天需要为 50+ 新品写 listing，耗时 6-8 小时
• 文案质量不稳定，依赖个人状态
• 关键词优化靠经验，缺乏数据支持

使用 Agent2Go 后：
• 创建 "Amazon Listing Agent"，10 分钟生成 50 篇 listing
• 文案质量稳定，符合 SEO 要求
• 关键词自动优化，转化率提升 20%

付费意愿：强烈（公司报销）
```

#### 画像 2：内容创作者小李
```
姓名：李美丽
年龄：25 岁
职业：小红书博主（10 万粉丝）
工作室：个人工作室

痛点：
• 每周需要更新 5 篇笔记，创作压力大
• 选题枯竭，经常不知道写什么
• 文案需要反复修改，效率低

使用 Agent2Go 后：
• 创建 "Xiaohongshu Content Agent"，输入主题自动生成文案
• Agent 根据热点推荐选题
• 文案质量稳定，只需微调

付费意愿：中等（个人付费，关注性价比）
```

#### 画像 3：中小企业主老张
```
姓名：张总
年龄：45 岁
职业：某贸易公司老板
公司：30 人规模

痛点：
• 客服成本高，需要 24 小时响应
• 销售线索跟进不及时，流失率高
• 数据分析靠人工，决策滞后

使用 Agent2Go 后：
• 客服 Agent 处理 80% 常见问题
• 销售线索自动跟进，转化率提升 30%
• 每日自动生成经营分析报告

付费意愿：强烈（关注 ROI）
```

---

## 3. 功能需求

### 3.1 功能优先级定义

| 优先级 | 定义 | 占比 |
|--------|------|------|
| P0 | 核心功能，MVP 必须包含 | 35% |
| P1 | 重要功能，首版必须包含 | 40% |
| P2 | 增强功能，后续迭代 | 25% |

### 3.2 功能清单（20 界面）

#### P0 核心功能（7 个界面）

| 编号 | 界面名称 | 功能描述 | 用户故事 | 验收标准 |
|------|----------|----------|----------|----------|
| F001 | Dashboard | 数据仪表盘 | 作为用户，我想一眼看到所有 Agent 的运行状态 | 显示 4 个核心指标 + 趋势图 + 最近活动 |
| F002 | Create Agent | 创建 Agent | 作为用户，我想通过模板快速创建 Agent | 5 个预设模板，点击即可创建 |
| F003 | Agent Config | Agent 配置 | 作为用户，我想自定义 Agent 的名称、模型、工具 | 支持名称/模型/工具/记忆配置 |
| F004 | Agent Detail | Agent 详情 | 作为用户，我想查看 Agent 的详细状态 | 显示状态/任务/记忆/操作按钮 |
| F005 | Workflow Builder | 工作流构建器 | 作为用户，我想可视化编排多 Agent 工作流 | 拖拽节点，连线，保存工作流 |
| F006 | Task List | 任务列表 | 作为用户，我想查看所有任务的执行状态 | 按状态筛选，显示任务卡片 |
| F007 | Prompt Editor | 提示词编辑器 | 作为用户，我想编辑 Agent 的 System Prompt | 代码编辑器，语法高亮，测试功能 |

#### P1 重要功能（8 个界面）

| 编号 | 界面名称 | 功能描述 | 用户故事 | 验收标准 |
|------|----------|----------|----------|----------|
| F008 | Workflow List | 工作流列表 | 作为用户，我想管理所有工作流 | 列表展示，支持搜索/筛选 |
| F009 | Task Detail | 任务详情 | 作为用户，我想查看任务的执行日志 | 显示输入/输出/日志/重试按钮 |
| F010 | Integration List | 集成列表 | 作为用户，我想管理第三方平台连接 | 显示已集成平台，支持开关 |
| F011 | Add Integration | 添加集成 | 作为用户，我想连接 Amazon/Shopify 等平台 | 输入 API Key，测试连接 |
| F012 | Team Management | 团队管理 | 作为用户，我想邀请成员并分配权限 | 邀请/移除成员，设置角色 |
| F013 | Agent Memory | Agent 记忆 | 作为用户，我想管理 Agent 的长期记忆 | 查看/清除/导出记忆 |
| F014 | Settings | 设置 | 作为用户，我想管理个人资料和 API Keys | 个人信息/API 密钥/通知设置 |
| F015 | Task Error | 任务错误 | 作为用户，我想处理失败的任务 | 显示错误信息，一键重试 |

#### P2 增强功能（5 个界面）

| 编号 | 界面名称 | 功能描述 | 用户故事 | 验收标准 |
|------|----------|----------|----------|----------|
| F016 | Templates | 模板市场 | 作为用户，我想使用预设模板快速开始 | 模板分类，一键应用 |
| F017 | Analytics | 数据分析 | 作为用户，我想查看业务数据趋势 | 销售/任务/工作流图表 |
| F018 | Help & Support | 帮助中心 | 作为用户，我想获取帮助和反馈问题 | 用户指南/FAQ/联系客服 |
| F019 | Mobile Dashboard | 移动端仪表盘 | 作为用户，我想在手机上查看核心数据 | 简化版 Dashboard，响应式 |
| F020 | Workflow Mobile | 移动端工作流 | 作为用户，我想在手机上运行工作流 | 简化版 Workflow，触摸友好 |

### 3.3 功能详细说明

#### F001: Dashboard（数据仪表盘）

**功能描述**:
系统首页，展示所有核心数据和最近活动。

**页面元素**:
| 元素 | 类型 | 说明 |
|------|------|------|
| 导航栏 | Header | Logo + 用户头像 |
| 数据卡片 | Card ×4 | Active Agents / Running Workflows / Tasks Today / Success Rate |
| 趋势图表 | Chart | Task Performance（7 天趋势） |
| 最近活动 | List | Recent Tasks / Agent Activities |
| 底部导航 | TabBar | 5 Tab 固定导航 |

**数据来源**:
- `/api/dashboard/summary`

**交互逻辑**:
- 下拉刷新数据
- 点击卡片进入详情页
- 点击任务进入 Task Detail

**验收标准**:
- [ ] 4 个数据卡片显示正确
- [ ] 图表数据准确，支持 7 天切换
- [ ] 最近活动列表显示最新 10 条
- [ ] 底部导航可正常切换

---

#### F002: Create Agent（创建 Agent）

**功能描述**:
通过预设模板快速创建 AI Agent。

**页面元素**:
| 元素 | 类型 | 说明 |
|------|------|------|
| 返回按钮 | Button | 返回上一页 |
| 标题 | Text | "Create Agent" |
| 模板列表 | Card List | 5 个预设模板卡片 |
| 创建按钮 | Button | 固定底部，点击后进入配置页 |

**模板列表**:
| 模板名称 | 描述 | 适用场景 |
|----------|------|----------|
| Content Creator | Generate social content automatically | 社交媒体内容创作 |
| Amazon Operator | Automate Amazon operations | Amazon 运营自动化 |
| Xiaohongshu Marketing | 小红书营销专家 | 小红书内容创作 |
| Data Analyst | Data analysis expert | 数据分析 |
| Customer Support | Customer service bot | 客户支持 |

**交互逻辑**:
- 点击模板卡片 → 进入 Agent Config
- 卡片选中状态：蓝色边框高亮

**验收标准**:
- [ ] 5 个模板卡片显示完整
- [ ] 点击卡片可进入配置页
- [ ] 卡片支持滚动浏览

---

#### F003: Agent Config（Agent 配置）

**功能描述**:
配置 Agent 的各项参数。

**表单字段**:
| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| Agent Name | Text Input | ✅ | Agent 名称 |
| Model | Dropdown | ✅ | 选择 AI 模型（GPT-4o/Claude 等） |
| Tools | Multi-Select | ❌ | 选择可用工具（Search/Browser/API 等） |
| Memory | Toggle | ❌ | 是否启用长期记忆 |

**交互逻辑**:
- 表单验证（必填项不能为空）
- Tools 支持多选（点击切换）
- Memory 开关（Toggle 组件）
- Confirm 按钮提交表单

**API**:
- `POST /api/agents/create`

**验收标准**:
- [ ] 表单验证正确
- [ ] 模型下拉列表显示所有可用模型
- [ ] Tools 多选功能正常
- [ ] 提交后返回 Agent Detail 页

---

#### F004: Agent Detail（Agent 详情）

**功能描述**:
查看 Agent 的详细状态和信息。

**页面元素**:
| 元素 | 类型 | 说明 |
|------|------|------|
| Agent 头像 | Avatar | 大尺寸，渐变背景 |
| Agent 名称 | Text | 显示名称 |
| 状态指示器 | Badge | 🟢 Running / 🟡 Idle / 🔴 Error |
| 最后运行时间 | Text | "Last Run: 5 minutes ago" |
| 操作按钮组 | Button Group | Run Agent / Edit Prompt / View Logs |
| 任务列表 | List | 最近执行的任务 |
| 记忆统计 | Text | 短期记忆/长期记忆数量 |

**API**:
- `GET /api/agents/{id}`

**交互逻辑**:
- 点击 "Run Agent" → 启动 Agent 执行任务
- 点击 "Edit Prompt" → 进入 Prompt Editor
- 点击 "View Logs" → 查看执行日志
- 点击任务 → 进入 Task Detail

**验收标准**:
- [ ] Agent 信息展示完整
- [ ] 状态指示器颜色正确
- [ ] 操作按钮功能正常
- [ ] 任务列表显示最近 10 条

---

#### F005: Workflow Builder（工作流构建器）⭐核心

**功能描述**:
可视化编排多 Agent 工作流。

**页面元素**:
| 元素 | 类型 | 说明 |
|------|------|------|
| 返回按钮 | Button | 返回上一页 |
| 保存按钮 | Button | 保存工作流 |
| 添加节点按钮 | Button | "+ Add Node" |
| 流程图区域 | Canvas | 可视化流程图（可拖拽） |
| 节点卡片 | Card | Data Source / Content Agent / Publisher 等 |
| 连接线 | Line | 节点之间的连接关系 |
| 底部操作栏 | Button Group | Run / Edit / Delete |

**节点类型**:
| 节点类型 | 说明 | 配置项 |
|----------|------|--------|
| Data Source | 数据源（触发器） | 数据源类型/输入格式 |
| Agent Node | Agent 执行节点 | 选择 Agent/参数配置 |
| Condition | 条件判断 | 判断条件/分支 |
| Action | 动作节点 | API 调用/文件操作 |
| End | 结束节点 | 输出格式 |

**交互逻辑**:
- 拖拽节点（移动端：长按拖拽）
- 点击节点 → 编辑节点配置
- 点击连线 → 删除连接
- 双击空白 → 添加节点
- 拖拽连线 → 连接两个节点

**数据结构**:
```json
{
  "workflow": {
    "name": "Daily Content Pipeline",
    "nodes": [
      { "id": "n1", "type": "Data Source", "config": {...} },
      { "id": "n2", "type": "Agent", "config": {...} },
      { "id": "n3", "type": "Publisher", "config": {...} }
    ],
    "edges": [
      { "from": "n1", "to": "n2" },
      { "from": "n2", "to": "n3" }
    ]
  }
}
```

**验收标准**:
- [ ] 可添加/删除节点
- [ ] 可拖拽节点调整位置
- [ ] 可连接节点
- [ ] 可保存工作流
- [ ] 可运行工作流

---

#### F006: Task List（任务列表）

**功能描述**:
查看所有任务的执行状态。

**页面元素**:
| 元素 | 类型 | 说明 |
|------|------|------|
| 返回按钮 | Button | 返回上一页 |
| 新建按钮 | Button | "+ New Task" |
| Tab 筛选 | Tab Bar | All / Running / Completed / Failed |
| 任务卡片 | Card List | 任务信息卡片 |

**任务卡片内容**:
| 字段 | 说明 |
|------|------|
| 任务名称 | 如 "Generate Amazon Listing" |
| 状态标识 | ✓ Completed / ⟳ Running /  Failed |
| Agent 名称 | 执行任务的 Agent |
| 时间 | 创建时间或完成时间 |

**API**:
- `GET /api/tasks?status=all|running|completed|failed`

**交互逻辑**:
- Tab 切换筛选不同状态的任务
- 点击任务卡片 → 进入 Task Detail
- 左滑卡片 → 显示操作（重试/删除）

**验收标准**:
- [ ] Tab 筛选功能正常
- [ ] 任务卡片显示完整信息
- [ ] 点击卡片可进入详情页
- [ ] 左滑操作功能正常

---

#### F007: Prompt Editor（提示词编辑器）

**功能描述**:
编辑 Agent 的 System Prompt。

**页面元素**:
| 元素 | 类型 | 说明 |
|------|------|------|
| 返回按钮 | Button | 返回上一页 |
| 保存按钮 | Button | 保存修改 |
| System Prompt | Textarea | 代码编辑器风格 |
| Instructions | Textarea | 指令说明 |
| Examples | Textarea | 示例 |
| 测试按钮 | Button | "Test Prompt" |

**编辑器功能**:
- 语法高亮（Markdown/代码块）
- 自动补全
- 字数统计
- 自动保存草稿

**API**:
- `GET /api/agents/{id}/prompt`
- `PUT /api/agents/{id}/prompt`
- `POST /api/agents/{id}/prompt/test`

**交互逻辑**:
- 输入内容实时保存草稿
- 点击 "Test Prompt" → 预览效果
- 点击 "Save" → 正式保存

**验收标准**:
- [ ] 编辑器支持语法高亮
- [ ] 自动保存草稿功能正常
- [ ] 测试功能可预览效果
- [ ] 保存功能正常

---

## 4. 非功能需求

### 4.1 性能要求

| 指标 | 要求 | 说明 |
|------|------|------|
| 页面加载时间 | < 2 秒 | 首屏加载 |
| API 响应时间 | < 500ms | 95% 请求 |
| 任务执行延迟 | < 1 秒 | 从点击到开始执行 |
| 并发用户数 | 1000+ | 同时在线用户 |

### 4.2 可用性要求

| 指标 | 要求 | 说明 |
|------|------|------|
| 系统可用性 | 99.9% | 年度 SLA |
| 数据持久化 | 100% | 不丢失用户数据 |
| 错误恢复 | < 5 分钟 | 故障恢复时间 |

### 4.3 安全要求

| 要求 | 说明 |
|------|------|
| 数据传输加密 | HTTPS/TLS 1.3 |
| 敏感数据加密 | API Key/Password 加密存储 |
| 访问控制 | JWT Token 认证 |
| 权限管理 | RBAC 角色权限控制 |
| 审计日志 | 记录所有敏感操作 |

### 4.4 兼容性要求

| 平台 | 要求 |
|------|------|
| iOS Safari | iOS 14+ |
| Android Chrome | Android 10+ |
| Desktop Chrome | 最新版本 |
| Desktop Safari | 最新版本 |
| Desktop Edge | 最新版本 |

### 4.5 可扩展性要求

| 要求 | 说明 |
|------|------|
| 水平扩展 | 支持自动扩容 |
| 模块化 | 功能模块可独立部署 |
| API 优先 | 所有功能提供 API |
| 插件化 | 支持第三方插件扩展 |

---

## 5. 系统架构

### 5.1 整体架构图

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
         │   (Upstash)         │
         └─────────────────────┘
```

### 5.2 技术栈选型

| 层级 | 技术 | 选型理由 |
|------|------|----------|
| 前端 | Next.js 16 + TailwindCSS | PWA 支持，响应式，开发效率高 |
| 部署 | Vercel | Serverless，自动扩容，全球 CDN |
| 数据库 | PostgreSQL (Neon) | Serverless DB，按需付费，兼容性 good |
| 缓存 | Redis (Upstash) | Serverless Redis，Task Queue |
| AI | OpenAI API | GPT-4o/Claude，质量稳定 |
| 认证 | NextAuth.js | 支持多 provider，易集成 |
| 状态管理 | Zustand | 轻量级，易用 |
| 图表 | Recharts | 响应式，美观 |

### 5.3 项目结构

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

---

## 6. 界面设计

### 6.1 设计系统

#### 颜色规范

| 用途 | 颜色值 | 预览 | 说明 |
|------|--------|------|------|
| 主色 | `#2563EB` | 🔵 | 蓝色（品牌色） |
| 主色渐变 | `#2563EB → #3B82F6` | 🎨 | 导航栏背景 |
| 背景 | `#F3F4F6` | ⚪ | 页面背景 |
| 卡片 | `#FFFFFF` | ⬜ | 卡片背景 |
| 文字主色 | `#1F2937` | ⚫ | 主要文字 |
| 文字次要 | `#6B7280` | 🔘 | 辅助文字 |
| 成功 | `#10B981` | 🟢 | 绿色 |
| 警告 | `#F59E0B` | 🟠 | 橙色 |
| 错误 | `#EF4444` | 🔴 | 红色 |

#### 字体规范

| 层级 | 大小 | 字重 | 行高 | 使用场景 |
|------|------|------|------|----------|
| 大标题 | 24px | Bold | 32px | 页面标题 |
| 标题 | 18px | SemiBold | 24px | 卡片标题 |
| 正文 | 16px | Regular | 24px | 主要内容 |
| 辅助文字 | 14px | Regular | 20px | 说明文字 |
| 小字 | 12px | Regular | 16px | 标签/提示 |

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

### 6.2 核心界面原型

#### Dashboard（首页）

```
┌─────────────────────────────────────┐
│ Agent2Go              [👤]          │ ← 导航栏（蓝色渐变）
├─────────────────────────────────────┤
│ ─────────────┐ ─────────────┐    │
│ │ Active      │ │ Running     │    │ ← 数据卡片
│ │ Agents      │ │ Workflows   │    │
│ │    12       │ │     5       │    │
│ └─────────────┘ └─────────────┘    │
│ ┌─────────────┐ ┌─────────────┐    │
│ │ Tasks       │ │ Success     │    │
│ │ Today       │ │  Rate       │    │
│ │    48       │ │   98.5%     │    │
│ └─────────────┘ └─────────────┘    │
├─────────────────────────────────────┤
│ Task Performance (7 Days)           │ ← 趋势图表
│ ███████▓▓▓▓▓▓▓                    │
│ Mon Tue Wed Thu Fri Sat Sun         │
├─────────────────────────────────────┤
│ Recent Tasks                        │
│ • Generate Amazon Listing ✓         │
│ • Create Social Content ✓           │
│ • Analyze Sales Data ⟳              │
├─────────────────────────────────────┤
│ [🏠] [🤖] [📋] [🔗] [️]           │ ← 底部导航
│Dashboard Agents Tasks Workflows Set │
└─────────────────────────────────────┘
```

#### Create Agent

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

#### Workflow Builder

```
┌─────────────────────────────────────┐
│ ← Workflow Builder        [💾]      │
├─────────────────────────────────────┤
│ [+ Add Node]                        │
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
│    └────────────┘                  │
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

---

## 7. 数据设计

### 7.1 ER 图

```
┌──────────────┐       ┌──────────────┐
│    users     │       │    team      │
├──────────────┤       ├──────────────┤
│ id (PK)      │◄──────│ user_id (FK) │
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
│ id (PK)      │   │ id (PK)      │
│ user_id (FK) │   │ user_id (FK) │
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
│ id (PK)      │   │ id (PK)      │
│ agent_id(FK) │   │ user_id (FK) │
│ workflow_id  │   │ platform     │
│ status       │   │ api_key      │
│ input(JSON)  │   │ status       │
│ output(JSON) │   └──────────────┘
│ logs (TEXT)  │
└──────────────┘
```

### 7.2 表结构

#### users（用户表）
| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 主键 |
| email | VARCHAR(255) | UNIQUE, NOT NULL | 邮箱 |
| name | VARCHAR(100) | NOT NULL | 昵称 |
| avatar | VARCHAR(500) | - | 头像 URL |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |

#### agents（Agent 表）
| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 主键 |
| user_id | UUID | FK → users.id | 所属用户 |
| name | VARCHAR(100) | NOT NULL | Agent 名称 |
| model | VARCHAR(50) | NOT NULL | AI 模型 |
| config | JSONB | - | 配置（Tools/Memory） |
| prompt | TEXT | - | System Prompt |
| status | VARCHAR(20) | DEFAULT 'idle' | 状态 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |

#### workflows（工作流表）
| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 主键 |
| user_id | UUID | FK → users.id | 所属用户 |
| name | VARCHAR(100) | NOT NULL | 工作流名称 |
| nodes | JSONB | NOT NULL | 节点定义 |
| edges | JSONB | NOT NULL | 连接关系 |
| status | VARCHAR(20) | DEFAULT 'draft' | 状态 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |

#### tasks（任务表）
| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 主键 |
| agent_id | UUID | FK → agents.id | 执行 Agent |
| workflow_id | UUID | FK → workflows.id | 所属工作流 |
| status | VARCHAR(20) | NOT NULL | 任务状态 |
| input | JSONB | - | 输入数据 |
| output | JSONB | - | 输出数据 |
| logs | TEXT | - | 执行日志 |
| error | TEXT | - | 错误信息 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |

#### integrations（集成表）
| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 主键 |
| user_id | UUID | FK → users.id | 所属用户 |
| platform | VARCHAR(50) | NOT NULL | 平台名称 |
| api_key | VARCHAR(500) | NOT NULL | API Key（加密） |
| api_secret | VARCHAR(500) | - | API Secret（加密） |
| status | VARCHAR(20) | DEFAULT 'disconnected' | 状态 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |

#### team（团队表）
| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | UUID | PK | 主键 |
| user_id | UUID | FK → users.id | 所属用户 |
| member_id | UUID | FK → users.id | 成员 ID |
| role | VARCHAR(20) | NOT NULL | 角色 |
| status | VARCHAR(20) | DEFAULT 'active' | 状态 |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |

---

## 8. API 设计

### 8.1 RESTful API 规范

**基础 URL**: `https://agent2go.vercel.app/api`

**认证方式**: JWT Token（Header: `Authorization: Bearer <token>`）

**响应格式**:
```json
{
  "success": true,
  "data": { ... },
  "message": "操作成功"
}
```

**错误格式**:
```json
{
  "success": false,
  "error": {
    "code": "AGENT_NOT_FOUND",
    "message": "Agent 不存在"
  }
}
```

### 8.2 API 清单

#### Dashboard
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/dashboard/summary` | 获取仪表盘数据 |

#### Agents
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/agents` | 获取 Agent 列表 |
| POST | `/agents` | 创建 Agent |
| GET | `/agents/:id` | 获取 Agent 详情 |
| PUT | `/agents/:id` | 更新 Agent |
| DELETE | `/agents/:id` | 删除 Agent |
| POST | `/agents/:id/run` | 运行 Agent |
| GET | `/agents/:id/prompt` | 获取 Prompt |
| PUT | `/agents/:id/prompt` | 更新 Prompt |
| GET | `/agents/:id/memory` | 获取记忆 |

#### Workflows
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/workflows` | 获取工作流列表 |
| POST | `/workflows` | 创建工作流 |
| GET | `/workflows/:id` | 获取工作流详情 |
| PUT | `/workflows/:id` | 更新工作流 |
| DELETE | `/workflows/:id` | 删除工作流 |
| POST | `/workflows/:id/run` | 运行工作流 |

#### Tasks
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/tasks` | 获取任务列表 |
| GET | `/tasks/:id` | 获取任务详情 |
| POST | `/tasks/:id/retry` | 重试任务 |
| DELETE | `/tasks/:id` | 删除任务 |

#### Integrations
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/integrations` | 获取集成列表 |
| POST | `/integrations` | 添加集成 |
| PUT | `/integrations/:id` | 更新集成 |
| DELETE | `/integrations/:id` | 删除集成 |
| POST | `/integrations/:id/test` | 测试连接 |

#### Team
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/team` | 获取成员列表 |
| POST | `/team` | 邀请成员 |
| PUT | `/team/:id/role` | 修改角色 |
| DELETE | `/team/:id` | 移除成员 |

#### Analytics
| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/analytics/sales` | 销售数据 |
| GET | `/analytics/tasks` | 任务统计 |
| GET | `/analytics/workflows` | 工作流成功率 |

---

## 9. 技术方案

### 9.1 关键实现

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

### 9.2 第三方服务

| 服务 | 用途 | 供应商 | 成本 |
|------|------|--------|------|
| AI 模型 | GPT-4o/Claude | OpenAI/Anthropic | $0.01/1K tokens |
| 数据库 | PostgreSQL | Neon | 免费 tier + 按需 |
| 缓存 | Redis | Upstash | 免费 tier + 按需 |
| 部署 | Serverless | Vercel | 免费 tier + 按需 |
| 认证 | OAuth | NextAuth | 免费 |

---

## 10. 开发计划

### 10.1 阶段划分

#### Phase 1: MVP（2 周）
**目标**: 完成核心功能，可创建和运行 Agent

| 周次 | 任务 | 交付物 |
|------|------|--------|
| Week 1 | 项目初始化 + 用户认证 + Agent CRUD | 可登录，可创建 Agent |
| Week 2 | Task 执行 + Dashboard | 可运行 Agent，可查看数据 |

**验收标准**:
- [ ] 用户可注册/登录
- [ ] 可创建 Agent（选择模板 + 配置）
- [ ] 可运行 Agent（单 Agent）
- [ ] Dashboard 显示核心数据

#### Phase 2: Workflow（2 周）
**目标**: 实现工作流编排功能

| 周次 | 任务 | 交付物 |
|------|------|--------|
| Week 3 | Workflow Builder（可视化编辑器） | 可拖拽编排工作流 |
| Week 4 | Multi-Agent 执行 + Integration | 可运行多 Agent 工作流 |

**验收标准**:
- [ ] 可创建/编辑/保存工作流
- [ ] 可运行多 Agent 工作流
- [ ] 可集成 Amazon/Shopify

#### Phase 3: 增强（2 周）
**目标**: 完善功能，提升用户体验

| 周次 | 任务 | 交付物 |
|------|------|--------|
| Week 5 | Team Management + Analytics | 团队协作 + 数据分析 |
| Week 6 | Prompt Editor + Agent Memory | 高级功能 |

**验收标准**:
- [ ] 可邀请团队成员
- [ ] 可查看数据分析图表
- [ ] 可编辑 Prompt
- [ ] 可管理 Agent 记忆

#### Phase 4: 优化 + 上线（1 周）
**目标**: 性能优化，生产部署

| 周次 | 任务 | 交付物 |
|------|------|--------|
| Week 7 | 性能优化 + 测试 + 部署 | 生产环境上线 |

**验收标准**:
- [ ] 页面加载 < 2 秒
- [ ] 所有功能测试通过
- [ ] 生产环境部署完成
- [ ] 用户文档完成

### 10.2 里程碑

| 时间 | 里程碑 | 交付物 |
|------|--------|--------|
| Week 2 | MVP 完成 | 可创建/运行 Agent |
| Week 4 | Workflow 完成 | 可编排多 Agent 工作流 |
| Week 6 | 完整功能 | 所有 20 界面可用 |
| Week 7 | 上线 | 生产环境部署 |

### 10.3 团队配置

| 角色 | 人数 | 职责 |
|------|------|------|
| 产品经理 | 1 | 需求管理，进度跟踪 |
| 前端开发 | 2 | 界面开发，交互实现 |
| 后端开发 | 2 | API 开发，数据库设计 |
| UI 设计 | 1 | 界面设计，视觉规范 |
| 测试 | 1 | 功能测试，性能测试 |

---

## 11. 风险与应对

### 11.1 技术风险

| 风险 | 影响 | 概率 | 应对措施 |
|------|------|------|----------|
| Vercel 构建失败 | 高 | 中 | 本地充分测试，分阶段部署 |
| AI API 成本高 | 中 | 高 | 缓存 + 限流 + 本地模型备选 |
| 数据库性能瓶颈 | 中 | 低 | 索引优化 + 读写分离 |
| 移动端体验差 | 中 | 中 | 优先 PWA，后续 React Native |

### 11.2 产品风险

| 风险 | 影响 | 概率 | 应对措施 |
|------|------|------|----------|
| 用户需求变化 | 高 | 高 | 敏捷开发，快速迭代 |
| 竞品抢先发布 | 高 | 中 | 加快开发进度，差异化竞争 |
| 获客成本高 | 中 | 中 | 内容营销，口碑传播 |

### 11.3 运营风险

| 风险 | 影响 | 概率 | 应对措施 |
|------|------|------|----------|
| 用户增长缓慢 | 高 | 中 | 多渠道推广，优化转化 |
| 付费转化率低 | 高 | 中 | 优化定价策略，提升价值 |
| 用户流失率高 | 高 | 中 | 提升产品体验，增加粘性 |

---

## 12. 附录

### 12.1 术语表

| 术语 | 定义 |
|------|------|
| Agent | AI Agent，可自主执行任务的智能体 |
| Workflow | 工作流，多个 Agent 的编排序列 |
| Task | 任务，Agent 执行的具体工作 |
| Integration | 集成，与第三方平台的连接 |
| Prompt | 提示词，指导 AI 生成内容的指令 |

### 12.2 参考文档

- [Next.js 文档](https://nextjs.org/docs)
- [Vercel 文档](https://vercel.com/docs)
- [Prisma 文档](https://prisma.io/docs)
- [OpenAI API 文档](https://platform.openai.com/docs)

### 12.3 相关文档

- [20 界面分析](./20-screens-analysis.md)
- [产品设计说明](./product-design-spec.md)
- [完整设计规格](./complete-design-spec.md)

---

**文档状态**: 待审核  
**最后更新**: 2026-03-14 14:50  
**版本**: v1.0  
**保密级别**: 内部机密
