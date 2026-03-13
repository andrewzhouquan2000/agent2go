#!/bin/bash
# ===========================================
# Agent2Go Vercel 部署脚本
# ===========================================
# 此脚本帮助完成 Vercel PostgreSQL 数据库配置和部署
# 使用方法：./deploy-vercel.sh

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}Agent2Go Vercel 部署脚本${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""

# Step 1: Check if Vercel CLI is installed
echo -e "${YELLOW}Step 1: 检查 Vercel CLI...${NC}"
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI 未安装${NC}"
    echo "请运行：npm install -g vercel"
    exit 1
fi
echo -e "${GREEN}✓ Vercel CLI 已安装${NC}"
echo ""

# Step 2: Login to Vercel
echo -e "${YELLOW}Step 2: 登录 Vercel...${NC}"
vercel whoami || {
    echo -e "${YELLOW}未登录，正在启动登录流程...${NC}"
    vercel login
}
echo -e "${GREEN}✓ 已登录 Vercel${NC}"
echo ""

# Step 3: Link project
echo -e "${YELLOW}Step 3: 链接 Vercel 项目...${NC}"
if [ ! -f ".vercel/project.json" ]; then
    echo -e "${YELLOW}项目未链接，正在链接...${NC}"
    vercel link
else
    echo -e "${GREEN}✓ 项目已链接${NC}"
fi
echo ""

# Step 4: Check DATABASE_URL
echo -e "${YELLOW}Step 4: 检查数据库配置...${NC}"
if [ -f ".env.local" ]; then
    if grep -q "DATABASE_URL=" .env.local; then
        echo -e "${GREEN}✓ DATABASE_URL 已配置${NC}"
    else
        echo -e "${RED}❌ DATABASE_URL 未配置${NC}"
        echo ""
        echo -e "${BLUE}请按照以下步骤获取 DATABASE_URL:${NC}"
        echo "1. 访问 https://vercel.com/dashboard"
        echo "2. 进入 agent2go 项目"
        echo "3. 点击 Storage → Create Database → PostgreSQL"
        echo "4. 复制 DATABASE_URL"
        echo ""
        read -p "粘贴 DATABASE_URL: " db_url
        if [ -f ".env.local" ]; then
            # Update existing DATABASE_URL
            sed -i.bak "s|DATABASE_URL=.*|DATABASE_URL=\"$db_url\"|" .env.local
        else
            echo "DATABASE_URL=\"$db_url\"" >> .env.local
        fi
        echo -e "${GREEN}✓ DATABASE_URL 已保存${NC}"
    fi
else
    echo -e "${YELLOW}创建 .env.local 文件...${NC}"
    read -p "粘贴 DATABASE_URL: " db_url
    cat > .env.local <<EOF
# Database - PostgreSQL (Vercel Storage)
DATABASE_URL="$db_url"

# NextAuth
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://localhost:3000"
EOF
    echo -e "${GREEN}✓ .env.local 已创建${NC}"
fi
echo ""

# Step 5: Generate NextAuth Secret
echo -e "${YELLOW}Step 5: 检查 NextAuth Secret...${NC}"
if ! grep -q "NEXTAUTH_SECRET=" .env.local 2>/dev/null || grep -q "NEXTAUTH_SECRET=\"your-secret-key-here\"" .env.local; then
    echo -e "${YELLOW}生成 NEXTAUTH_SECRET...${NC}"
    secret=$(openssl rand -base64 32)
    if grep -q "NEXTAUTH_SECRET=" .env.local 2>/dev/null; then
        sed -i.bak "s|NEXTAUTH_SECRET=.*|NEXTAUTH_SECRET=\"$secret\"|" .env.local
    else
        echo "NEXTAUTH_SECRET=\"$secret\"" >> .env.local
    fi
    echo -e "${GREEN}✓ NEXTAUTH_SECRET 已生成${NC}"
else
    echo -e "${GREEN}✓ NEXTAUTH_SECRET 已配置${NC}"
fi
echo ""

# Step 6: Install dependencies
echo -e "${YELLOW}Step 6: 安装依赖...${NC}"
npm install
echo -e "${GREEN}✓ 依赖安装完成${NC}"
echo ""

# Step 7: Generate Prisma Client
echo -e "${YELLOW}Step 7: 生成 Prisma Client...${NC}"
npx prisma generate
echo -e "${GREEN}✓ Prisma Client 已生成${NC}"
echo ""

# Step 8: Run database migration
echo -e "${YELLOW}Step 8: 运行数据库迁移...${NC}"
echo -e "${YELLOW}⚠️  这将在数据库中创建表结构${NC}"
read -p "确认继续？(y/n): " confirm
if [ "$confirm" = "y" ]; then
    npx prisma migrate deploy
    echo -e "${GREEN}✓ 数据库迁移完成${NC}"
else
    echo -e "${YELLOW}⚠️  跳过数据库迁移${NC}"
    echo "稍后可以手动运行：npx prisma migrate deploy"
fi
echo ""

# Step 9: Deploy to Vercel
echo -e "${YELLOW}Step 9: 部署到 Vercel...${NC}"
echo -e "${BLUE}提示：首次部署需要设置生产环境变量${NC}"
echo ""
vercel --prod
echo -e "${GREEN}✓ 部署完成${NC}"
echo ""

# Step 10: Setup production environment variables
echo -e "${YELLOW}Step 10: 配置生产环境变量...${NC}"
echo ""
echo -e "${BLUE}请在 Vercel 控制台添加以下环境变量:${NC}"
echo "1. 访问项目 Settings → Environment Variables"
echo "2. 添加 DATABASE_URL (与本地相同)"
echo "3. 添加 NEXTAUTH_SECRET (与本地相同)"
echo "4. 添加 NEXTAUTH_URL (你的生产域名)"
echo ""
read -p "已完成环境变量配置？(y/n): " env_confirm
if [ "$env_confirm" = "y" ]; then
    echo -e "${GREEN}✓ 环境变量已配置${NC}"
else
    echo -e "${YELLOW}⚠️  请记得在 Vercel 控制台配置环境变量${NC}"
fi
echo ""

# Summary
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}部署完成！${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo -e "${BLUE}下一步:${NC}"
echo "1. 访问你的 Vercel 部署 URL"
echo "2. 测试注册功能"
echo "3. 测试登录功能"
echo "4. 检查数据库记录"
echo ""
echo -e "${YELLOW}如有问题，请查看：${NC}"
echo "- Vercel 部署日志"
echo "- Prisma 迁移日志"
echo "- 应用错误日志"
echo ""
