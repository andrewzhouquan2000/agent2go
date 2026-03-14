# Agent2Go 项目凭证索引

**安全级别**：P0 机密 - 禁止外泄

---

## 凭证存储位置

所有敏感凭证统一存储在：
```
~/.openclaw/agents/xiaozhou/.credentials/
```

**特点**：
- ✅ 隐藏目录（`.` 开头）
- ✅ 不参与 Git 版本控制
- ✅ 会话重启后依然保留
- ✅ 仅本 Agent 可访问

---

## 凭证清单

| 凭证文件 | 用途 | 过期时间 | 最后更新 |
|----------|------|----------|----------|
| `.vercel-token.md` | Vercel API 部署 | 90 天 | 2026-03-14 |
| `.aliyun-fc-credentials.md` | 阿里云函数计算 | 长期 | 待创建 |
| `.neon-db-credentials.md` | Neon PostgreSQL | 长期 | 待创建 |

---

## 使用方法

### 读取凭证
```bash
cat ~/.openclaw/agents/xiaozhou/.credentials/.vercel-token.md
```

### 更新凭证
```bash
cat > ~/.openclaw/agents/xiaozhou/.credentials/.vercel-token.md << 'EOF'
Vercel Token
vcp_xxx...
过期时间：2026-06-13
EOF
```

---

## 安全规则

1. **禁止行为**：
   - ❌ 将凭证内容写入 TOOLS.md
   - ❌ 将凭证内容写入会话消息
   - ❌ 将凭证传递给其他 Agent
   - ❌ 将凭证上传到外部 API

2. **允许行为**：
   - ✅ 在 TOOLS.md 中记录凭证文件路径
   - ✅ 使用凭证进行 API 调用
   - ✅ 定期轮换更新凭证

---

## 凭证轮换计划

| 凭证 | 下次轮换日期 | 提醒设置 |
|------|--------------|----------|
| Vercel Token | 2026-06-01 | 提前 7 天提醒 |
| 阿里云 AK | 2026-04-13 | 提前 7 天提醒 |

---

## 紧急处理

如发现凭证泄露：
1. 立即在 Vercel 控制台撤销 Token
2. 立即在阿里云控制台禁用 AccessKey
3. 更新 `.credentials` 目录下的凭证文件
4. 在 MEMORY.md 中记录泄露事件
