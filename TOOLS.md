# TOOLS.md - Agent2Go 项目工具与资源索引

## 📁 项目路径

- **本地开发**：`/Users/emma/projects/agent2go/`
- **代码仓库**：https://github.com/andrewzhouquan2000/agent2go
- **生产环境**：https://agent2go.vercel.app

---

## 🔐 敏感凭证管理

**所有敏感凭证统一存储在**：
```
~/.openclaw/agents/xiaozhou/.credentials/
```

**凭证清单**：
| 文件 | 用途 | 说明 |
|------|------|------|
| `.vercel-token.md` | Vercel API 部署 | 90 天过期 |
| `.aliyun-fc-credentials.md` | 阿里云 FC | 长期有效 |
| `.neon-db-credentials.md` | Neon PostgreSQL | 长期有效 |

**安全规则**：
- ✅ 凭证仅存储在隐藏目录，不参与版本控制
- ✅ TOOLS.md 仅记录路径，不存储实际凭证内容
- ✅ 会话重启后凭证依然保留

---

## 🛠️ 开发工具

### Node.js & npm
- Node.js 20.x
- npm 10.x
- Next.js 16.1.6
- Turbopack（构建工具）

### 数据库
- **本地开发**：SQLite (`prisma/dev.db`)
- **生产环境**：PostgreSQL (Neon)
- **ORM**：Prisma 7.x

### 部署工具
- **Vercel CLI**：`npx vercel`
- **项目 ID**：`prj_McO4m3vycyxF4fSk158P4sMH3C8o`
- **Org ID**：`team_Bu9ro7DUmWkIDY7CtsynFfDa`

---

## 📋 常用命令

### 本地开发
```bash
cd ~/projects/agent2go
npm run dev          # 启动开发服务器
npm run build        # 生产构建
npm run lint         # 代码检查
```

### 数据库操作
```bash
npx prisma generate      # 生成 Prisma 客户端
npx prisma migrate dev   # 本地迁移
npx prisma studio        # 数据浏览器
```

### Vercel 部署
```bash
export VERCEL_TOKEN="vcp_xxx..."  # 从 .credentials 读取
npx vercel --prod                 # 生产部署
```

---

## 🔗 相关文档

- **部署指南**：`VERCEL_SETUP.md`
- **凭证索引**：`CREDENTIALS_INDEX.md`
- **项目记忆**：`memory/2026-03-14.md`

---

## 📞 支持资源

- Vercel 文档：https://vercel.com/docs
- Prisma 文档：https://prisma.io/docs
- Next.js 文档：https://nextjs.org/docs
