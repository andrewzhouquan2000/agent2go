# Vercel PostgreSQL 数据库配置指南

## 📋 概述
本文档指导您如何在 Vercel 上创建 PostgreSQL 数据库并配置 Agent2Go 项目。

---

## 🚀 步骤 1：在 Vercel 创建 PostgreSQL 数据库

### 1.1 登录 Vercel 控制台
访问：https://vercel.com/dashboard

### 1.2 进入项目
1. 找到 `agent2go` 项目
2. 点击进入项目详情页

### 1.3 创建数据库
1. 点击左侧菜单 **Storage**
2. 点击 **Create Database**
3. 选择 **PostgreSQL**
4. 填写数据库信息：
   - **Name**: `agent2go-db`
   - **Region**: 选择离您最近的区域（推荐：`iad1` 美国东部 或 `hnd1` 东京）
5. 点击 **Create**

### 1.4 获取 DATABASE_URL
1. 数据库创建完成后，点击 **Connect**
2. 选择项目 `agent2go`
3. 点击 **Copy** 复制 `DATABASE_URL`
4. 格式类似：`postgres://default:xxxxx@xxxxx.xxxxx.us-east-1.aws.neon.tech/xxxxx?sslmode=require`

---

## 🔧 步骤 2：配置项目环境变量

### 2.1 本地开发环境
编辑 `.env.local` 文件：

```bash
# 替换为您的 Vercel PostgreSQL URL
DATABASE_URL="postgresql://user:password@host:port/database?schema=public"
```

### 2.2 Vercel 生产环境
1. 在 Vercel 项目页面，点击 **Settings**
2. 选择 **Environment Variables**
3. 点击 **Add Environment Variable**
4. 添加：
   - **Name**: `DATABASE_URL`
   - **Value**: 粘贴刚才复制的 DATABASE_URL
   - **Environment**: 勾选 `Production`, `Preview`, `Development`
5. 点击 **Save**

---

## 📦 步骤 3：运行数据库迁移

### 3.1 安装依赖（如未安装）
```bash
cd /Users/emma/projects/agent2go
npm install
```

### 3.2 生成 Prisma Client
```bash
npx prisma generate
```

### 3.3 创建初始迁移
```bash
# 创建迁移文件（不会立即执行）
npx prisma migrate dev --name init
```

### 3.4 部署迁移到生产环境
```bash
# 部署到 Vercel PostgreSQL
npx prisma migrate deploy
```

---

## ✅ 步骤 4：验证数据库连接

### 4.1 本地测试
```bash
# 启动开发服务器
npm run dev
```

访问 http://localhost:3000，尝试：
1. 注册新账户
2. 登录
3. 检查数据库是否有记录

### 4.2 查看数据库记录
```bash
# 使用 Prisma Studio 查看数据
npx prisma studio
```

---

## 🔐 步骤 5：配置 NextAuth Secret

### 5.1 生成 Secret
```bash
# 生成随机 secret
openssl rand -base64 32
```

### 5.2 添加到环境变量
**本地 (.env.local):**
```bash
NEXTAUTH_SECRET="生成的-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

**Vercel (Settings → Environment Variables):**
- `NEXTAUTH_SECRET`: 生成的 secret
- `NEXTAUTH_URL`: `https://your-project.vercel.app`

---

## 🚨 常见问题

### Q1: 迁移失败 "Table already exists"
**解决方案:**
```bash
# 重置数据库（仅开发环境）
npx prisma migrate reset

# 或者手动删除迁移记录
npx prisma db execute --stdin <<EOF
DROP TABLE IF EXISTS "_prisma_migrations";
EOF
```

### Q2: 连接超时
**检查:**
1. DATABASE_URL 是否正确
2. 网络连接是否正常
3. 防火墙设置

### Q3: SSL 连接错误
**解决方案:**
在 DATABASE_URL 末尾添加 `&sslmode=require`

---

## 📊 数据库模型

迁移后将创建以下表：
- `User` - 用户账户
- `Account` - OAuth 账户
- `Session` - 用户会话
- `VerificationToken` - 验证令牌
- `Agent` - AI 专家
- `Team` - 用户团队
- `TeamAgent` - 团队 - 专家关联
- `Scenario` - 业务场景
- `ScenarioAgent` - 场景 - 专家关联
- `Task` - 任务
- `TaskSession` - 任务会话
- `Message` - 群聊消息

---

## 🎯 下一步

完成数据库配置后：
1. ✅ 测试注册/登录功能
2. ✅ 部署到 Vercel
3. ✅ 验证生产环境功能

---

## 📞 需要帮助？

如有问题，请联系开发团队或查看：
- [Prisma 文档](https://www.prisma.io/docs)
- [Vercel Storage 文档](https://vercel.com/docs/storage)
- [NextAuth.js 文档](https://next-auth.js.org)
