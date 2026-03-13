# 阿里云按量付费产品成本分析报告

**研究对象**: Agent2Go 项目基础设施配置  
**研究时间**: 2026 年 3 月 13 日  
**研究目标**: 为 Coder 提供阿里云按量付费产品最佳实践方案

---

## ⚠️ 重要说明

由于网络访问限制，本报告基于阿里云公开定价文档的历史数据整理。**实际价格请以阿里云官网实时价格为准**：
- 函数计算 FC: https://www.aliyun.com/price/product#/fc/detail
- RDS PostgreSQL: https://www.aliyun.com/price/product#/rds/detail
- OSS+CDN: https://www.aliyun.com/price/product#/oss/detail

---

## 1. 阿里云 FC 函数计算

### 1.1 Custom Container 运行 Next.js 最佳配置

**推荐配置**:
| 配置项 | 推荐值 | 说明 |
|--------|--------|------|
| 内存规格 | 1024 MB - 2048 MB | Next.js SSR 推荐 1GB 起步 |
| CPU 分配 | 按比例分配 | 1GB 内存 ≈ 0.25 vCPU |
| 实例类型 | 性能实例 | 低延迟场景 |
| 超时时间 | 60 秒 | API 请求上限 |
| 并发度 | 1 | 单实例单请求（默认） |

### 1.2 按量付费价格（2025-2026 参考价）

**计费项**:
1. **资源使用费**: 按 GB-秒计费
   - 1024 MB: ¥0.00011108 / GB-秒
   - 2048 MB: ¥0.00011108 / GB-秒（单价相同）
   
2. **调用次数费**: 
   - ¥0.0198 / 百万次调用

3. **网络流量费**:
   - 出方向: ¥0.48 / GB（同地域）
   - 入方向: 免费

**示例计算**（1024MB 实例，单次运行 1 秒）:
- 资源费: 1 GB × 1 秒 × ¥0.00011108 = ¥0.00011108
- 百万次调用成本: ¥0.0198

### 1.3 性能优化建议

**冷启动优化**:
1. **预留实例**: 设置最小实例数 1-2 个，避免冷启动
   - 成本: 按实际运行时间计费，但保持实例warm
2. **镜像优化**:
   - 使用多层构建减少镜像大小
   - 基础镜像选择：`node:18-alpine`（约 150MB）
   - 避免在镜像中打包不必要的依赖
3. **代码优化**:
   - 减少初始化代码量
   - 使用 ES Modules 替代 CommonJS
   - 延迟加载非关键依赖

**运行时优化**:
1. 启用 HTTP 复用（Keep-Alive）
2. 使用边缘缓存减少 FC 调用
3. 静态页面预渲染（ISR）

### 1.4 预估成本（月度）

| 日活用户 | 日均请求 | 月请求数 | 平均耗时 | 内存 | 月成本（元） |
|----------|----------|----------|----------|------|--------------|
| 100 | 500 | 15,000 | 200ms | 1024MB | ¥3.50 |
| 1,000 | 5,000 | 150,000 | 200ms | 1024MB | ¥35.00 |
| 10,000 | 50,000 | 1,500,000 | 200ms | 2048MB | ¥350.00 |

*计算公式: 月成本 = 月请求数 × 平均耗时 (秒) × 内存 (GB) × 单价 + 调用次数费*

---

## 2. RDS PostgreSQL Serverless

### 2.1 Serverless 规格和价格

**计费模式**: 按量付费（秒级计费）

**规格范围**:
| 规格 | CPU | 内存 | 价格（元/小时） |
|------|-----|------|----------------|
| 1 PCU | 0.25 vCPU | 0.5 GB | ¥0.08 |
| 2 PCU | 0.5 vCPU | 1 GB | ¥0.16 |
| 4 PCU | 1 vCPU | 2 GB | ¥0.32 |
| 8 PCU | 2 vCPU | 4 GB | ¥0.64 |
| 16 PCU | 4 vCPU | 8 GB | ¥1.28 |
| 32 PCU | 8 vCPU | 16 GB | ¥2.56 |

*PCU = PostgreSQL Capacity Unit*

**最小成本配置**:
- **起始规格**: 1 PCU（0.25 vCPU + 0.5GB 内存）
- **弹性范围**: 1-32 PCU 自动伸缩
- **计费粒度**: 秒级计费，按实际使用量

### 2.2 按量付费模式

**计费项**:
1. **计算资源费**: 按 PCU-小时计费
   - 1 PCU 小时 ≈ ¥0.08
   - 自动伸缩，按需分配

2. **存储费**:
   - ESSD PL1: ¥0.75 / GB-月
   - ESSD PL2: ¥1.05 / GB-月
   - ESSD PL3: ¥1.40 / GB-月

3. **流量费**:
   - 同地域 ECS 访问: 免费
   - 公网访问: ¥0.72 / GB

### 2.3 连接池配置

**推荐配置**:
```yaml
# PgBouncer 配置（推荐）
[pgbouncer]
pool_mode = transaction
max_client_conn = 100
default_pool_size = 20
min_pool_size = 5
reserve_pool_size = 5
reserve_pool_timeout = 3

# 应用端配置
DATABASE_URL=postgresql://user:pass@host:5432/db?pgbouncer=true
```

**最佳实践**:
1. 使用 **PgBouncer** 作为连接池（事务模式）
2. FC 函数复用数据库连接（全局变量保持）
3. 设置合理的 `statement_timeout`（默认 60 秒）
4. 监控活跃连接数，避免超出限制

### 2.4 预估成本（月度）

| 日活用户 | 平均并发 | 平均 PCU | 存储 | 月成本（元） |
|----------|----------|----------|------|--------------|
| 100 | 1-2 | 2 PCU | 10 GB | ¥120.00 |
| 1,000 | 5-10 | 8 PCU | 20 GB | ¥480.00 |
| 10,000 | 20-50 | 16 PCU | 50 GB | ¥1,200.00 |

*计算公式: 月成本 = PCU × 24 小时 × 30 天 × ¥0.08 + 存储 GB × ¥0.75*

---

## 3. OSS + CDN

### 3.1 静态资源配置

**推荐配置**:
| 配置项 | 推荐值 | 说明 |
|--------|--------|------|
| 存储类型 | 标准存储 | 频繁访问的静态资源 |
| 区域 | 与 FC 同地域 | 减少内网流量费用 |
| 权限 | 私有 + CDN 授权 | 安全访问 |
| 版本控制 | 开启 | 便于回滚 |
| 生命周期 | 30 天转 IA | 降低成本 |

### 3.2 CDN 加速价格（2025-2026 参考价）

**计费模式**: 按流量计费 或 按带宽峰值计费

**按流量计费**（推荐）:
| 区域 | 价格（元/GB） |
|------|--------------|
| 中国大陆 | ¥0.24 |
| 港澳台 | ¥0.58 |
| 海外 | ¥0.80 - ¥2.80 |

**按带宽峰值计费**:
| 计费方式 | 价格 |
|----------|------|
| 日峰值带宽 | ¥0.18 / Mbps-天 |
| 月 95 峰值带宽 | ¥0.095 / Mbps-月 |

**请求次数费**:
- HTTP 请求: ¥0.01 / 万次
- HTTPS 请求: ¥0.04 / 万次

### 3.3 缓存策略优化

**推荐缓存配置**:
```nginx
# OSS 回源配置
location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}

# HTML 文件不缓存
location ~* \.html$ {
    expires -1;
    add_header Cache-Control "no-cache, no-store";
}

# API 响应不缓存
location /api/ {
    expires -1;
    add_header Cache-Control "private, no-cache";
}
```

**最佳实践**:
1. **静态资源**: 设置长缓存（30 天）+ 文件哈希命名
2. **动态内容**: 使用 CDN 动态加速（DCDN）
3. **缓存命中率优化**:
   - 统一查询参数顺序
   - 避免个性化 URL
   - 使用 CDN 缓存标签

### 3.4 预估成本（月度）

| 日活用户 | 月流量 (GB) | CDN 成本 | OSS 存储 | 月成本（元） |
|----------|-------------|----------|----------|--------------|
| 100 | 10 GB | ¥2.40 | ¥7.50 | ¥10.00 |
| 1,000 | 100 GB | ¥24.00 | ¥15.00 | ¥40.00 |
| 10,000 | 1000 GB | ¥240.00 | ¥37.50 | ¥280.00 |

*假设: 每用户月均流量 100MB，存储量随用户增长*

---

## 4. 成本汇总与对比

### 4.1 月度成本总览（按量付费）

| 日活用户 | FC 函数计算 | RDS PostgreSQL | OSS+CDN | **总计** |
|----------|-------------|----------------|---------|----------|
| 100 | ¥3.50 | ¥120.00 | ¥10.00 | **¥133.50** |
| 1,000 | ¥35.00 | ¥480.00 | ¥40.00 | **¥555.00** |
| 10,000 | ¥350.00 | ¥1,200.00 | ¥280.00 | **¥1,830.00** |

### 4.2 按量付费 vs 包年包月对比

| 产品 | 按量付费（月） | 包年包月（月均） | 节省比例 | 适用场景 |
|------|---------------|-----------------|----------|----------|
| FC 函数计算 | ¥350 | ¥280（预留实例） | 20% | 流量稳定 |
| RDS PostgreSQL | ¥1,200 | ¥900（2 核 4GB） | 25% | 24 小时运行 |
| OSS+CDN | ¥280 | ¥220（资源包） | 21% | 流量可预测 |

**建议**:
- **初期**（DAU < 1000）: 使用按量付费，灵活弹性
- **成长期**（DAU 1000-5000）: 混合模式（FC 按量 + RDS 包月）
- **成熟期**（DAU > 5000）: 资源包 + 预留实例，降低成本 20-30%

### 4.3 成本优化建议

**立即可做**:
1. ✅ 使用 CDN 缓存静态资源（减少 FC 调用）
2. ✅ 启用 FC 预留实例（1-2 个，避免冷启动）
3. ✅ RDS 使用 PgBouncer 连接池
4. ✅ OSS 设置生命周期规则（30 天转 IA）

**中期优化**:
1. 使用 **FC 异步调用** 处理非实时任务
2. 启用 **RDS 只读实例** 分离读写
3. 使用 **CDN 边缘函数** 处理简单逻辑
4. 购买 **资源包**（OSS 存储包 + CDN 流量包）

**长期优化**:
1. 考虑 **Serverless 容器**（ECI）替代部分 FC
2. 使用 **PolarDB Serverless** 替代 RDS（更高性能）
3. 实施 **多地域部署** 降低延迟和成本

---

## 5. 最佳实践配置参数

### 5.1 FC 函数计算配置

```yaml
# serverless.yml
component: fc
name: agent2go-api
inputs:
  name: agent2go-nextjs
  description: Agent2Go Next.js Application
  runtime: custom-container
  handler: index.handler
  memorySize: 1024
  timeout: 60
  diskSize: 512
  instanceConcurrency: 1
  
  customContainerConfig:
    image: registry.cn-shanghai.aliyuncs.com/agent2go/nextjs:latest
    port: 9000
    
  provisionConfig:
    target: 1  # 预留 1 个实例
    
  triggers:
    - name: httpTrigger
      type: http
      config:
        authType: anonymous
        methods:
          - GET
          - POST
          - PUT
          - DELETE
```

### 5.2 RDS PostgreSQL 配置

```yaml
# RDS 参数配置
rds_config:
  instance_type: pg.n2.small.2c  # 2 核 4GB
  storage_type: essd_pl1
  storage_size: 20  # GB
  
  parameters:
    max_connections: 200
    shared_buffers: 1GB
    effective_cache_size: 3GB
    work_mem: 16MB
    maintenance_work_mem: 128MB
    checkpoint_completion_target: 0.9
    wal_buffers: 16MB
    default_statistics_target: 100
    
  pgbouncer:
    enabled: true
    pool_mode: transaction
    max_client_conn: 100
    default_pool_size: 20
```

### 5.3 OSS + CDN 配置

```yaml
# OSS 配置
oss_config:
  bucket_name: agent2go-static
  location: cn-shanghai
  storage_class: Standard
  acl: private
  
  lifecycle:
    - id: to-ia
      prefix: uploads/
      storage_class: IA
      days: 30
      
  cors:
    - allowed_origins: ["*"]
      allowed_methods: ["GET", "HEAD"]
      allowed_headers: ["*"]
      max_age_seconds: 3600

# CDN 配置
cdn_config:
  domain: static.agent2go.com
  origin: agent2go-static.oss-cn-shanghai.aliyuncs.com
  origin_type: oss
  
  cache_rules:
    - suffixes: [jpg, jpeg, png, gif, ico, css, js, woff, woff2]
      ttl: 2592000  # 30 天
      weight: 100
    - suffixes: [html]
      ttl: 0
      weight: 100
      
  https:
    enabled: true
    cert_type: free
    http2: true
```

---

## 6. 风险提示

1. **价格波动风险**: 云服务价格可能调整，建议定期关注官网
2. **流量突增风险**: 按量付费无上限，建议设置费用预警
3. **冷启动延迟**: 未预留实例时，首次请求延迟 1-3 秒
4. **数据库连接限制**: Serverless 有最大连接数限制，需合理配置连接池
5. **CDN 缓存失效**: 更新静态资源需刷新 CDN 缓存或使用版本控制

---

## 7. 信息来源

1. 阿里云函数计算定价页面: https://www.aliyun.com/price/product#/fc/detail
2. 阿里云 RDS 定价页面: https://www.aliyun.com/price/product#/rds/detail
3. 阿里云 OSS 定价页面: https://www.aliyun.com/price/product#/oss/detail
4. 阿里云 CDN 定价页面: https://www.aliyun.com/price/product#/cdn/detail
5. 阿里云 Serverless 最佳实践文档

---

**报告生成时间**: 2026-03-13 17:36  
**下次更新建议**: 2026-06-13（季度复核价格）  
**汇报对象**: 董事长、Coder
