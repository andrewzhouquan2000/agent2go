# Phase 1: 数据库 + 认证 - 快速开始指南

## ✅ 已完成的工作

以下工作已由 Coder 自动完成：

1. ✅ **Prisma Schema 更新** - 从 SQLite 迁移到 PostgreSQL
2. ✅ **数据库模型** - 包含 User, Account, Session, Agent, Team, Task, Message 等
3. ✅ **NextAuth 配置** - 登录/注册功能已就绪
4. ✅ **迁移文件** - PostgreSQL 迁移脚本已创建
5. ✅ **部署脚本** - `deploy-vercel.sh` 已准备

---

## 🚀 需要您手动完成的步骤

### 步骤 1: 在 Vercel 创建 PostgreSQL 数据库（5 分钟）

1. 访问：https://vercel.com/dashboard
2. 点击进入 `agent2go` 项目
3. 点击左侧 **Storage** → **Create Database**
4. 选择 **PostgreSQL**
5. 填写：
   - Name: `agent2go-db`
   - Region: 选择最近的（推荐 `iad1` 或 `hnd1`）
6. 点击 **Create**
7. 点击 **Connect** → 选择 `agent2go` 项目
8. **复制 DATABASE_URL**（重要！）

---

### 步骤 2: 配置本地环境变量（2 分钟）

编辑 `/Users/emma/projects/agent2go/.env.local`：

```bash
# 替换为刚才复制的 Vercel DATABASE_URL
DATABASE_URL="postgresql://xxxxx"

# 生成随机 secret（运行命令生成）
# openssl rand -base64 32
NEXTAUTH_SECRET="生成的-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

---

### 步骤 3: 运行迁移（3 分钟）

```bash
cd /Users/emma/projects/agent2go

# 安装依赖
npm install

# 生成 Prisma Client
npx prisma generate

# 运行迁移（创建数据库表）
npx prisma migrate deploy
```

---

### 步骤 4: 测试本地功能（5 分钟）

```bash
# 启动开发服务器
npm run dev
```

访问 http://localhost:3000：
1. 点击右上角 **登录**
2. 点击 **免费注册**
3. 填写邮箱和密码
4. 注册成功后自动登录
5. 应该跳转到 Dashboard

---

### 步骤 5: 配置 Vercel 生产环境（3 分钟）

1. 在 Vercel 项目页面 → **Settings** → **Environment Variables**
2. 添加以下变量：

| Name | Value | Environments |
|------|-------|--------------|
| `DATABASE_URL` | 步骤 1 复制的 URL | ✅ Production ✅ Preview ✅ Development |
| `NEXTAUTH_SECRET` | 步骤 2 生成的 secret | ✅ Production ✅ Preview ✅ Development |
| `NEXTAUTH_URL` | `https://your-project.vercel.app` | ✅ Production |

3. 点击 **Save**

---

### 步骤 6: 部署到 Vercel（5 分钟）

**方法 A: 使用部署脚本（推荐）**
```bash
cd /Users/emma/projects/agent2go
./deploy-vercel.sh
```

**方法 B: 手动部署**
```bash
# 提交代码
git add .
git commit -m "feat: 迁移到 PostgreSQL + 认证系统"
git push github main

# Vercel 会自动部署
# 访问 https://vercel.com/dashboard 查看部署进度
```

---

## ✅ 验收标准

完成上述步骤后，验证以下功能：

- [ ] **Vercel PostgreSQL 创建完成**
  - 在 Vercel Storage 页面可以看到数据库
  
- [ ] **用户可以注册新账号**
  - 访问生产 URL → 登录 → 免费注册
  - 填写邮箱密码 → 注册成功
  
- [ ] **用户可以登录**
  - 使用注册的邮箱密码登录
  - 成功跳转到 Dashboard
  
- [ ] **会话正常（数据库存储）**
  - 刷新页面保持登录状态
  - 使用 Prisma Studio 查看 Session 表：`npx prisma studio`
  
- [ ] **Vercel 部署成功**
  - 访问生产 URL 正常加载
  - 无错误日志

---

## 🔍 故障排查

### 问题 1: 迁移失败 "Table already exists"
```bash
# 如果是新数据库，忽略此错误
# 如果表已存在，跳过迁移
npx prisma db pull  # 从现有数据库同步 schema
npx prisma generate
```

### 问题 2: 连接超时
- 检查 DATABASE_URL 是否正确
- 确认网络连接
- 在 Vercel 重新复制 DATABASE_URL

### 问题 3: 登录失败 "Invalid credentials"
- 检查 NEXTAUTH_SECRET 是否一致
- 清除浏览器缓存
- 查看 Vercel 函数日志

### 问题 4: 部署失败
```bash
# 查看本地构建日志
npm run build

# 查看 Vercel 部署日志
vercel logs --prod
```

---

## 📊 数据库表结构

迁移后将创建以下表：

| 表名 | 说明 |
|------|------|
| `User` | 用户账户 |
| `Account` | OAuth 账户（微信/Google 等） |
| `Session` | 用户会话 |
| `VerificationToken` | 邮箱验证令牌 |
| `Agent` | AI 专家 |
| `Team` | 用户团队 |
| `TeamAgent` | 团队 - 专家关联 |
| `Scenario` | 业务场景 |
| `ScenarioAgent` | 场景 - 专家关联 |
| `Task` | 任务 |
| `TaskSession` | 任务会话 |
| `Message` | 群聊消息 |

---

## 📞 需要帮助？

- **详细文档**: `VERCEL_POSTGRES_SETUP.md`
- **部署脚本**: `./deploy-vercel.sh`
- **Prisma 文档**: https://www.prisma.io/docs
- **NextAuth 文档**: https://next-auth.js.org

---

## ⏭️ 下一步

Phase 1 完成后，继续：
- Phase 2: AI 专家系统集成
- Phase 3: 任务执行引擎
- Phase 4: 飞书集成

**预计总时间**: 2 小时  
**当前进度**: 代码准备完成，等待 Vercel 配置
