# Agent2Go Vercel 部署配置指南

## ⚠️ 必须配置的环境变量

登录 Vercel Dashboard → agent2go 项目 → Settings → Environment Variables

添加以下变量：

### 生产环境 (Production)

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `DATABASE_URL` | `postgresql://...` | PostgreSQL 连接字符串 |
| `NEXTAUTH_SECRET` | `xiaozhou-agent2go-secret-key-2026-03-13` | NextAuth 密钥 |
| `NEXTAUTH_URL` | `https://agent2go.vercel.app` | 生产环境 URL |

### 预览环境 (Preview)

| 变量名 | 值 |
|--------|-----|
| `DATABASE_URL` | `postgresql://...` |
| `NEXTAUTH_SECRET` | `xiaozhou-agent2go-secret-key-2026-03-13` |
| `NEXTAUTH_URL` | `[自动生成的预览 URL]` |

### 开发环境 (Development)

| 变量名 | 值 |
|--------|-----|
| `DATABASE_URL` | `file:./prisma/dev.db` |
| `NEXTAUTH_SECRET` | `xiaozhou-agent2go-secret-key-2026-03-13` |
| `NEXTAUTH_URL` | `http://localhost:3000` |

---

## 📋 数据库迁移

配置完成后，在 Vercel 中执行：

```bash
# 本地执行迁移（如果有数据库）
npx prisma migrate deploy

# 或手动在 Vercel Postgres 控制台执行 SQL
```

---

## ✅ 验收清单

- [ ] 环境变量已配置
- [ ] 数据库连接成功
- [ ] 用户注册/登录可用
- [ ] Agents 列表显示数据
- [ ] 无控制台错误

---

## 🔗 相关资源

- Vercel Dashboard: https://vercel.com/dashboard
- 项目：agent2go
- Git 仓库：https://codeup.aliyun.com/69b3838aba2d7df023da87e9/agent2go.git
