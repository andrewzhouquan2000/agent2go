# Agent2Go - 阿里云 ESA Pages 部署指南

## 概述

本文档介绍如何将 Agent2Go 应用部署到阿里云 ESA (Edge Serverless Application) Pages 服务。

## 前置要求

1. **阿里云账号**: 已注册并开通 ESA Pages 服务
2. **阿里云 CLI**: 安装并配置 `aliyun` 命令行工具
3. **CodeUp 仓库**: 代码已托管到阿里云 CodeUp
4. **Node.js**: 版本 20+

## 快速部署

### 方式一：自动部署脚本

```bash
cd ~/projects/agent2go
./deploy/aliyun/deploy.sh
```

### 方式二：手动部署

#### 1. 登录阿里云控制台

访问：https://esa.console.aliyun.com/

#### 2. 创建站点

1. 点击"创建站点"
2. 站点名称：`agent2go`
3. 选择区域：`华东 1（杭州）`
4. 点击"创建"

#### 3. 绑定 CodeUp 仓库

1. 在站点详情页，点击"绑定仓库"
2. 选择 CodeUp 仓库
3. 选择分支：`main`
4. 启用"自动部署"

#### 4. 配置构建设置

```yaml
框架：Next.js
构建命令：npm run build
输出目录：.next
Node 版本：20
安装命令：npm install
```

#### 5. 配置环境变量

在 ESA 控制台添加以下环境变量：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `DATABASE_URL` | `file:./dev.db` | SQLite 数据库路径 |
| `NEXTAUTH_SECRET` | `your-secret-key` | NextAuth 密钥 |
| `NEXTAUTH_URL` | `https://your-site.esa.aliyuncs.com` | 应用 URL |

**生成 NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

## 自动部署流程

配置完成后，每次推送到 `main` 分支都会触发自动部署：

```bash
# 提交代码
git add .
git commit -m "feat: add new feature"
git push origin main

# ESA Pages 会自动：
# 1. 检测到代码推送
# 2. 拉取最新代码
# 3. 执行构建
# 4. 部署到生产环境
```

## 访问地址

部署成功后，访问地址格式：
```
https://agent2go.esa.aliyuncs.com
```

如需绑定自定义域名：
1. 在 ESA 控制台点击"域名管理"
2. 添加自定义域名
3. 配置 DNS 解析
4. SSL 证书自动签发

## WebSocket 注意事项

由于 ESA Pages 是静态托管服务，WebSocket 功能需要：

1. **方案 A**: 使用独立的 WebSocket 服务器（如阿里云函数计算 FC）
2. **方案 B**: 使用阿里云 API 网关的 WebSocket API
3. **方案 C**: 使用第三方服务（如 Pusher、Socket.io 云服务）

推荐配置：
- 前端：使用 `src/lib/websocket/client.ts`
- 后端：部署到阿里云函数计算或 ECS
- 连接地址：`wss://your-api-domain.com/ws`

## 监控与日志

### 查看部署日志

1. ESA 控制台 → 站点 → 部署记录
2. 点击最近一次部署查看构建日志

### 应用监控

- **访问日志**: ESA 控制台 → 监控 → 访问日志
- **性能监控**: ESA 控制台 → 监控 → 性能指标
- **错误追踪**: 已集成 Sentry，查看 Sentry 控制台

## 故障排查

### 构建失败

检查 `build` 命令输出：
```bash
npm run build
```

常见问题：
- TypeScript 错误：运行 `npx tsc --noEmit` 检查
- 依赖缺失：运行 `npm install` 重新安装
- 环境变量缺失：检查 ESA 控制台配置

### 页面无法访问

1. 检查部署状态是否为"成功"
2. 检查自定义域名 DNS 解析
3. 清除浏览器缓存

### WebSocket 连接失败

1. 检查 WebSocket 服务器是否运行
2. 检查防火墙规则（端口 443）
3. 检查浏览器控制台错误

## 成本估算

ESA Pages 免费额度：
- 构建分钟数：500 分钟/月
- 流量：50GB/月
- 存储：5GB

超出部分按量计费，详情查看阿里云官网。

## 相关文档

- [ESA Pages 官方文档](https://help.aliyun.com/product/esa.html)
- [Next.js 部署指南](https://nextjs.org/docs/deployment)
- [阿里云 CodeUp 文档](https://help.aliyun.com/product/codeup.html)

## 技术支持

如有问题，请联系：
- 阿里云工单：https://workorder.console.aliyun.com/
- 项目 Issues: [GitHub Issues](https://github.com/your-org/agent2go/issues)
