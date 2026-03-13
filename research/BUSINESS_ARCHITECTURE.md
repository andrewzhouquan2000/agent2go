# Agent2Go 业务架构文档 (BUSINESS ARCHITECTURE)

**版本**: v1.0  
**创建日期**: 2026-03-13  
**状态**: 初稿

---

## 📖 概述

**Agent2Go** 是一个面向中小企业主的 AI 员工雇佣平台，用户可以一键组建 AI 专家团队完成复杂任务。

**核心价值**:
- 🎯 **降低门槛**: 无需技术背景，自然语言描述需求
- ⚡ **快速交付**: 分钟级组建团队，小时级完成任务
- 💰 **按结果付费**: 按任务/结果付费，而非按席位/执行次数
- 🔒 **安全可控**: 人工审核关键决策，随时接管

---

## 🎯 用户流程

### 完整用户旅程

```
┌─────────────────────────────────────────────────────────────┐
│                    用户旅程 (User Journey)                    │
└─────────────────────────────────────────────────────────────┘

1. 注册/登录 (2 分钟)
   ↓
2. 选择场景/描述需求 (3 分钟)
   ↓
3. 系统推荐 Agent 梦之队 (即时)
   ↓
4. 确认团队配置 (1 分钟)
   ↓
5. 任务执行与监控 (实时)
   ↓
6. 人工审核关键节点 (按需)
   ↓
7. 结果交付与反馈 (1 分钟)
   ↓
8. 支付与评价 (1 分钟)
```

### 详细流程说明

#### 1. 注册/登录
**目标**: 快速完成账户创建

**步骤**:
- 手机号/邮箱注册
- 选择行业标签 (电商/教育/科技/制造等)
- 填写公司规模 (10-50 人/50-100 人/100+ 人)
- 完成新手引导 (3 分钟视频)

**输出**: 用户画像 + 行业模板推荐

---

#### 2. 选择场景/描述需求
**目标**: 明确任务目标

**方式 A: 选择预定义场景**
```
热门场景:
├── 小红书营销
│   ├── 内容创作 + 发布
│   ├── 账号代运营
│   └── 爆款打造
├── 知乎知识营销
│   ├── 专业问答
│   ├── 专栏建设
│   └── 权威建立
├── 电商运营
│   ├── 店铺优化
│   ├── 活动策划
│   └── 数据分析
├── APP 开发
│   ├── 需求分析
│   ├── UI/UX 设计
│   └── 全栈开发
└── 游戏开发
    ├── 策划设计
    ├── Unity/Unreal 开发
    └── 美术音频
```

**方式 B: 自然语言描述**
```
用户输入: "我想在小红书上推广我的新品牌，预算 5000 元/月"
  ↓
系统解析:
- 平台：小红书
- 目标：品牌推广
- 预算：5000 元/月
- 阶段：新品牌冷启动
```

**输出**: 结构化任务需求

---

#### 3. 系统推荐 Agent 梦之队
**目标**: 智能匹配最佳专家团队

**推荐逻辑**:
```python
def recommend_agents(scenario, requirements):
    # 1. 场景匹配
    base_agents = SCENARIO_MAPPING[scenario]
    
    # 2. 需求补充
    if requirements.budget < 10000:
        base_agents.append("cost-optimizer")
    if requirements.urgency == "high":
        base_agents.append("rapid-prototyper")
    
    # 3. 行业适配
    industry_agents = INDUSTRY_MAPPING[requirements.industry]
    
    # 4. 返回推荐
    return {
        "core_team": base_agents,      # 核心专家 (必选)
        "optional_team": industry_agents,  # 可选专家
        "estimated_cost": calculate_cost(base_agents + industry_agents),
        "estimated_time": estimate_time(base_agents + industry_agents),
    }
```

**示例：小红书营销场景**
```
推荐梦之队:
├── 核心专家 (必选)
│   ├── xiaohongshu-specialist (小红书专家)
│   ├── content-creator (内容创作)
│   ├── image-prompt-engineer (配图专家)
│   └── analytics-reporter (数据分析)
├── 可选专家
│   ├── growth-hacker (增长黑客)
│   └── seo-specialist (SEO 专家)
└── 团队配置
    ├── 预计成本：3000 元/月
    ├── 预计时间：3-5 天
    └── 预期效果：1000+ 粉丝，5% 互动率
```

**输出**: Agent 团队配置方案

---

#### 4. 确认团队配置
**目标**: 用户确认并调整团队

**界面元素**:
- 专家列表 (头像 + 简介 + 能力标签)
- 成本明细 (按专家/按任务)
- 时间预估 (关键节点)
- 预期效果 (KPI 指标)
- 调整选项 (增删专家)

**用户操作**:
- ✅ 确认配置 → 进入任务执行
- ✏️ 调整配置 → 重新计算成本/时间
- ❌ 取消 → 返回场景选择

**输出**: 确认的团队配置 + 服务协议

---

#### 5. 任务执行与监控
**目标**: 实时追踪任务进度

**监控面板**:
```
┌─────────────────────────────────────────────────┐
│  任务进度                                        │
│  ████████████░░░░░░░░ 60%                       │
│                                                 │
│  当前阶段：内容创作                              │
│  负责专家：content-creator                      │
│  预计完成：2 小时后                              │
│                                                 │
│  已完成:                                         │
│  ✅ 趋势分析 (xiaohongshu-specialist)           │
│  ✅ 选题确定 (xiaohongshu-specialist)           │
│                                                 │
│  进行中:                                         │
│  🔄 文案撰写 (content-creator)                  │
│                                                 │
│  待执行:                                         │
│  ⏳ 配图生成 (image-prompt-engineer)            │
│  ⏳ 内容发布 (xiaohongshu-specialist)           │
│  ⏳ 数据监控 (analytics-reporter)               │
└─────────────────────────────────────────────────┘
```

**实时通知**:
- 阶段完成通知
- 人工审核请求
- 异常情况告警
- 成果交付提醒

**输出**: 任务执行日志 + 中间成果

---

#### 6. 人工审核关键节点
**目标**: 确保质量和合规

**审核点设计**:
| 场景 | 审核点 | 审核内容 |
|------|--------|---------|
| 小红书营销 | 发布前 | 文案内容、图片质量、合规检查 |
| 知乎营销 | 发布前 | 专业准确性、引用来源、语气审核 |
| APP 开发 | 里程碑 | UI 设计稿、核心功能、安全测试 |
| 游戏开发 | 里程碑 | 玩法设计、美术风格、性能测试 |

**审核流程**:
```
系统提交审核请求
    ↓
飞书/短信/邮件通知用户
    ↓
用户查看成果 (Web/移动端)
    ↓
用户决策:
├── ✅ 通过 → 继续执行
├── ✏️ 修改 → 填写反馈 → Agent 修改
└── ❌ 拒绝 → 说明原因 → 重新执行/终止
```

**输出**: 审核结果 + 反馈意见

---

#### 7. 结果交付与反馈
**目标**: 完整交付成果 + 收集反馈

**交付内容**:
- 最终成果 (文档/代码/设计稿等)
- 执行报告 (过程日志、关键决策)
- 效果数据 (KPI 达成情况)
- 后续建议 (优化方向)

**反馈收集**:
```
请评价本次服务:
├── 整体满意度 ⭐⭐⭐⭐⭐
├── 专家专业度 ⭐⭐⭐⭐⭐
├── 沟通顺畅度 ⭐⭐⭐⭐⭐
├── 交付及时性 ⭐⭐⭐⭐⭐
└── 性价比 ⭐⭐⭐⭐⭐

文字反馈:
[_______________________________]

是否愿意推荐给朋友？
○ 非常愿意 ○ 愿意 ○ 一般 ○ 不愿意
```

**输出**: 用户反馈 + 服务评价

---

#### 8. 支付与评价
**目标**: 完成交易闭环

**支付方式**:
- 按任务付费 (一次性)
- 按月订阅 (持续服务)
- 按效果付费 (对赌协议)

**定价策略**:
| 服务类型 | 价格区间 | 说明 |
|---------|---------|------|
| 基础单 Agent | 200-500 元/任务 | 简单任务，单一专家 |
| 多 Agent 团队 | 1000-3000 元/任务 | 复杂任务，多专家协作 |
| 月度订阅 | 3000-10000 元/月 | 持续服务，专属团队 |
| 企业定制 | 面议 | 定制化需求 |

**输出**: 支付凭证 + 服务完成

---

## 🤝 Agent 群组协作流程

### 协作架构

```
┌─────────────────────────────────────────────────────────┐
│                    Flow 编排层                            │
│         (任务分解、状态管理、条件分支)                      │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    Crew 协调层                            │
│         (多 Crew 协作、任务分配、结果整合)                  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    Agent 执行层                           │
│    ┌─────────┐  ┌─────────┐  ┌─────────┐               │
│    │ Agent 1 │  │ Agent 2 │  │ Agent 3 │               │
│    │ 选题专家 │  │ 文案专家 │  │ 配图专家 │               │
│    └─────────┘  └─────────┘  └─────────┘               │
│         ↓              ↓              ↓                  │
│    ┌─────────┐  ┌─────────┐  ┌─────────┐               │
│    │  Task 1 │  │  Task 2 │  │  Task 3 │               │
│    └─────────┘  └─────────┘  └─────────┘               │
└─────────────────────────────────────────────────────────┘
```

### 协作模式

#### 1. 顺序协作 (Sequential)
**适用**: 线性工作流，任务有明确依赖

```python
class ContentFlow(Flow):
    @start()
    def trend_analysis(self):
        # 1. 选题专家分析趋势
        result = TrendAnalysisCrew().crew().kickoff()
        self.state.trends = result.raw

    @listen(trend_analysis)
    def content_creation(self):
        # 2. 文案专家写文案 (依赖趋势分析)
        result = ContentCreationCrew().crew().kickoff(
            inputs={"trends": self.state.trends}
        )
        self.state.content = result.raw

    @listen(content_creation)
    def image_generation(self):
        # 3. 配图专家生成图片 (依赖文案)
        result = ImageGenerationCrew().crew().kickoff(
            inputs={"content": self.state.content}
        )
        self.state.images = result.raw

    @listen(image_generation)
    def publish(self):
        # 4. 发布专家组织内容
        return PublishCrew().crew().kickoff(
            inputs={"content": self.state.content, "images": self.state.images}
        )
```

**流程**:
```
选题专家 → 趋势报告 → 文案专家 → 文案 → 配图专家 → 图片 → 发布专家 → 完成
```

---

#### 2. 并行协作 (Parallel)
**适用**: 独立任务，可同时执行

```python
class ParallelFlow(Flow):
    @start()
    def research(self):
        return ResearchCrew().crew().kickoff()

    @start()
    def design(self):
        return DesignCrew().crew().kickoff()

    @listen(and_(research, design))  # 等待两个都完成
    def integrate(self):
        # 整合研究和设计结果
        return IntegrationCrew().crew().kickoff(
            inputs={
                "research": self.state.research,
                "design": self.state.design
            }
        )
```

**流程**:
```
         ┌→ 研究专家 → 研究报告 ─┐
开始 ────┤                       ├→ 整合专家 → 完成
         └→ 设计专家 → 设计稿 ───┘
```

---

#### 3. 条件协作 (Conditional)
**适用**: 根据质量/结果决定后续流程

```python
class ReviewFlow(Flow):
    @start()
    def generate(self):
        return ContentCreationCrew().crew().kickoff()

    @router(generate)
    def quality_check(self):
        # 质量评分
        score = calculate_quality(self.state.content)
        if score > 0.8:
            return "high_quality"
        elif score > 0.6:
            return "needs_revision"
        else:
            return "reject"

    @listen("high_quality")
    def publish(self):
        return PublishCrew().crew().kickoff()

    @listen("needs_revision")
    def revise(self):
        result = RevisionCrew().crew().kickoff(
            inputs={"content": self.state.content}
        )
        self.state.content = result.raw
        # 重新进入质量检查
        return self.quality_check()

    @listen("reject")
    def restart(self):
        # 重新开始
        return self.generate()
```

**流程**:
```
内容创作 → 质量检查
              ↓
       ┌──────┼──────┐
       ↓      ↓      ↓
    高质量  需修改   拒绝
       ↓      ↓      ↓
    发布   修改    重新开始
```

---

#### 4. 人工介入协作 (Human-in-the-Loop)
**适用**: 关键决策需要人工审核

```python
from crewai.flow.human_feedback import human_feedback

class HumanReviewFlow(Flow):
    @start()
    def draft(self):
        return DraftingCrew().crew().kickoff()

    @listen(draft)
    @human_feedback(
        message="请审核此草稿内容",
        emit=["approved", "needs_changes", "rejected"],
        llm="gpt-4o-mini",
    )
    def review(self):
        return self.state.draft

    @listen("approved")
    def finalize(self):
        return FinalizeCrew().crew().kickoff()

    @listen("needs_changes")
    def revise(self):
        feedback = self.last_human_feedback.feedback
        return RevisionCrew().crew().kickoff(
            inputs={"feedback": feedback}
        )

    @listen("rejected")
    def restart(self):
        return self.draft()
```

**流程**:
```
草稿创作 → 人工审核
              ↓
       ┌──────┼──────┐
       ↓      ↓      ↓
    通过   需修改   拒绝
       ↓      ↓      ↓
    定稿   修改    重新开始
```

---

### 通信机制

#### 1. 任务输出传递
```yaml
# tasks.yaml
research_task:
  agent: researcher
  expected_output: "研究报告"
  output_file: output/research.md

writing_task:
  agent: writer
  context: [research_task]  # 获取 research_task 输出
  description: "基于研究报告写文章"
```

#### 2. 共享状态管理
```python
class SharedState(BaseModel):
    topic: str = ""
    trends: str = ""
    content: str = ""
    images: list[str] = []
    published: bool = False

class MarketingFlow(Flow[SharedState]):
    @start()
    def analyze(self):
        self.state.topic = "新品牌营销"
        # ...
```

#### 3. Agent 间委托
```python
# Agent 配置
manager = Agent(
    role="项目经理",
    allow_delegation=True,  # 可委托
)

specialist = Agent(
    role="技术专家",
    allow_delegation=False,  # 不可委托
)

# 执行时
# Manager 可以委托 Specialist: "请分析这个技术问题"
# Specialist 直接执行，不继续委托
```

---

## ⚙️ 任务分解和执行机制

### 任务分解流程

```
用户任务描述
    ↓
自然语言理解 (NLU)
    ↓
任务结构化解析
    ↓
子任务分解
    ↓
Agent 匹配
    ↓
执行计划生成
```

### 示例：小红书营销任务

#### 用户输入
```
"我想在小红书上推广我的新品牌，主要卖手工饰品，
预算 5000 元/月，希望能快速积累粉丝"
```

#### 任务分解
```yaml
主任务：小红书品牌推广
├── 子任务 1: 市场与竞品分析
│   ├── 负责 Agent: xiaohongshu-specialist
│   ├── 工具：搜索工具、数据分析工具
│   └── 输出：竞品分析报告
│
├── 子任务 2: 品牌定位与人设打造
│   ├── 负责 Agent: xiaohongshu-specialist + content-creator
│   ├── 工具：创意工具
│   └── 输出：品牌人设文档
│
├── 子任务 3: 内容策略与日历
│   ├── 负责 Agent: content-creator
│   ├── 工具：内容规划工具
│   └── 输出：30 天内容日历
│
├── 子任务 4: 视觉内容创作
│   ├── 负责 Agent: image-prompt-engineer
│   ├── 工具：AI 绘画工具
│   └── 输出：15 张配图
│
├── 子任务 5: 文案创作
│   ├── 负责 Agent: content-creator
│   ├── 工具：文案工具
│   └── 输出：15 篇文案
│
├── 子任务 6: 内容发布与运营
│   ├── 负责 Agent: xiaohongshu-specialist
│   ├── 工具：发布工具 (需人工确认)
│   └── 输出：已发布内容
│
└── 子任务 7: 数据监控与优化
    ├── 负责 Agent: analytics-reporter
    ├── 工具：数据分析工具
    └── 输出：周报 + 优化建议
```

### 执行计划

```python
execution_plan = {
    "phase1": {
        "name": "准备阶段",
        "duration": "1-2 天",
        "tasks": ["市场分析", "品牌定位"],
        "agents": ["xiaohongshu-specialist", "content-creator"],
    },
    "phase2": {
        "name": "内容创作",
        "duration": "2-3 天",
        "tasks": ["内容策略", "视觉创作", "文案创作"],
        "agents": ["content-creator", "image-prompt-engineer"],
    },
    "phase3": {
        "name": "发布运营",
        "duration": "持续",
        "tasks": ["内容发布", "数据监控"],
        "agents": ["xiaohongshu-specialist", "analytics-reporter"],
        "human_review": True,
    },
}
```

---

## 🖥️ 技术架构建议

### 整体架构

```
┌─────────────────────────────────────────────────────────┐
│                      用户界面层                            │
│  Web 应用 / 移动端 / 飞书机器人 / API                     │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                      API 网关层                            │
│  认证 / 限流 / 路由 / 日志                               │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                      业务逻辑层                            │
│  ├── 场景推荐引擎                                         │
│  ├── Agent 匹配引擎                                       │
│  ├── 任务分解引擎                                         │
│  ├── 流程编排引擎 (Flow)                                  │
│  └── 人工审核引擎                                         │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                      Agent 执行层                          │
│  ├── CrewAI 框架                                         │
│  ├── Agent 池 (120+ 专家)                                │
│  ├── 工具库 (搜索/创作/分析/发布)                         │
│  └── 记忆系统 (短期/长期/实体)                            │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                      基础设施层                            │
│  ├── LLM 提供商 (OpenAI/Anthropic/Google)                │
│  ├── 向量数据库 (Chroma/Pinecone)                        │
│  ├── 关系数据库 (PostgreSQL)                             │
│  ├── 对象存储 (OSS/S3)                                   │
│  └── 消息队列 (Redis/RabbitMQ)                           │
└─────────────────────────────────────────────────────────┘
```

### 核心模块

#### 1. 场景推荐引擎
```python
class ScenarioRecommendationEngine:
    def recommend(self, user_input: str) -> Scenario:
        # 1. 意图识别
        intent = self.nlu_classifier.predict(user_input)
        
        # 2. 场景匹配
        scenarios = self.scenario_db.search(intent)
        
        # 3. 排序 (基于热度、成功率、用户画像)
        ranked = self.ranker.score(scenarios)
        
        return ranked[0]
```

#### 2. Agent 匹配引擎
```python
class AgentMatchingEngine:
    def match(self, scenario: Scenario, requirements: Requirements) -> list[Agent]:
        # 1. 基础匹配 (场景 → 专家)
        base_agents = SCENARIO_AGENT_MAP[scenario.id]
        
        # 2. 需求补充
        if requirements.budget < 5000:
            base_agents.append("cost-optimizer")
        
        # 3. 行业适配
        industry_agents = INDUSTRY_AGENT_MAP[requirements.industry]
        
        # 4. 返回推荐
        return {
            "core": base_agents,
            "optional": industry_agents,
            "estimated_cost": self.calculate_cost(base_agents + industry_agents),
            "estimated_time": self.estimate_time(base_agents + industry_agents),
        }
```

#### 3. 流程编排引擎
```python
class FlowOrchestrationEngine:
    def execute(self, flow_class: type[Flow], inputs: dict) -> FlowResult:
        # 1. 初始化 Flow
        flow = flow_class()
        
        # 2. 执行 Flow
        result = flow.kickoff(inputs=inputs)
        
        # 3. 记录日志
        self.log_execution(flow.state)
        
        # 4. 返回结果
        return result
```

#### 4. 人工审核引擎
```python
class HumanReviewEngine:
    def request_review(self, task_id: str, content: str, reviewer_id: str):
        # 1. 创建审核任务
        review_task = ReviewTask(
            task_id=task_id,
            content=content,
            reviewer_id=reviewer_id,
            status="pending",
        )
        
        # 2. 发送通知 (飞书/短信/邮件)
        self.notify(reviewer_id, review_task)
        
        # 3. 等待审核结果
        return review_task.id
    
    def submit_decision(self, review_task_id: str, decision: str, feedback: str):
        # 1. 更新审核状态
        review_task = self.get(review_task_id)
        review_task.status = decision
        review_task.feedback = feedback
        
        # 2. 触发后续流程
        if decision == "approved":
            self.continue_execution(review_task.task_id)
        elif decision == "needs_changes":
            self.trigger_revision(review_task.task_id, feedback)
```

### 数据模型

#### 用户模型
```python
class User(BaseModel):
    id: str
    phone: str
    email: str
    industry: str
    company_size: str
    created_at: datetime
```

#### 任务模型
```python
class Task(BaseModel):
    id: str
    user_id: str
    scenario_id: str
    description: str
    requirements: Requirements
    agent_team: list[str]
    status: TaskStatus  # pending/running/review/completed/failed
    created_at: datetime
    completed_at: datetime | None
```

#### 执行日志模型
```python
class ExecutionLog(BaseModel):
    id: str
    task_id: str
    agent_id: str
    action: str
    input: dict
    output: dict
    timestamp: datetime
    duration_ms: int
```

---

## 📊 关键指标 (KPIs)

### 业务指标
| 指标 | 目标值 | 说明 |
|------|--------|------|
| 用户注册转化率 | > 30% | 访问→注册 |
| 任务创建转化率 | > 50% | 注册→创建任务 |
| 任务完成率 | > 90% | 创建→完成 |
| 用户满意度 | > 4.5/5 | 平均评分 |
| 复购率 | > 40% | 月复购 |
| NPS | > 50 | 净推荐值 |

### 技术指标
| 指标 | 目标值 | 说明 |
|------|--------|------|
| API 响应时间 (P95) | < 500ms | 接口性能 |
| 任务执行成功率 | > 95% | 执行可靠性 |
| 人工审核响应时间 | < 2 小时 | 审核效率 |
| 系统可用性 | > 99.9% | SLA |
| 错误率 | < 1% | 质量控制 |

---

## 🔒 安全与合规

### 数据安全
- 用户数据加密存储
- API 密钥安全管理
- Cookie/Session 加密
- 敏感操作二次验证

### 内容合规
- AI 生成内容审核
- 平台规则遵守 (小红书/知乎等)
- 版权保护
- 隐私保护

### 风险控制
- 频率限制 (防滥用)
- 异常检测 (防欺诈)
- 人工审核 (关键决策)
- 应急回滚 (故障恢复)

---

## 🚀 实施路线图

### Phase 1: MVP (2 周)
- [ ] 基础用户系统 (注册/登录)
- [ ] 场景选择界面
- [ ] Agent 推荐逻辑
- [ ] 基础 Flow 编排
- [ ] 3 个核心场景 (小红书/知乎/电商)

### Phase 2: 核心功能 (4 周)
- [ ] 任务执行监控面板
- [ ] 人工审核流程
- [ ] 支付集成
- [ ] 飞书机器人集成
- [ ] 10 个场景覆盖

### Phase 3: 优化迭代 (4 周)
- [ ] Agent 性能优化
- [ ] 用户反馈系统
- [ ] 数据分析看板
- [ ] A/B 测试框架
- [ ] 20+ 场景覆盖

### Phase 4: 规模化 (持续)
- [ ] 企业版功能
- [ ] API 开放平台
- [ ] Agent 市场 (第三方专家)
- [ ] 国际化支持

---

**文档维护**: Researcher Agent  
**最后更新**: 2026-03-13  
**状态**: 初稿待评审
