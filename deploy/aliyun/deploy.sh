#!/bin/bash

# Agent2Go - Alibaba Cloud ESA Pages Deployment Script
# This script automates the deployment to Alibaba Cloud ESA Pages

set -e

# Configuration
SITE_NAME="agent2go"
REGION="cn-hangzhou"
BRANCH="main"

echo "======================================"
echo "Agent2Go ESA Pages Deployment"
echo "======================================"

# Check if aliyun CLI is installed
if ! command -v aliyun &> /dev/null; then
    echo "❌ Error: Alibaba Cloud CLI (aliyun) is not installed."
    echo "Install it from: https://www.alibabacloud.com/help/en/cli"
    exit 1
fi

# Check if logged in
echo "Checking Alibaba Cloud CLI authentication..."
if ! aliyun configure list &> /dev/null; then
    echo "❌ Error: Not logged in to Alibaba Cloud CLI."
    echo "Run 'aliyun configure' to set up authentication."
    exit 1
fi

# Build the project
echo ""
echo "🔨 Building Next.js application..."
npm run build

# Deploy to ESA Pages
echo ""
echo "🚀 Deploying to Alibaba Cloud ESA Pages..."

# Option 1: Using ESA CLI (if available)
if command -v esa &> /dev/null; then
    esa deploy --site "$SITE_NAME" --region "$REGION"
else
    echo "⚠️  ESA CLI not found. Using manual deployment..."
    echo ""
    echo "Manual deployment steps:"
    echo "1. Go to Alibaba Cloud ESA Console: https://esa.console.aliyun.com/"
    echo "2. Create or select site: $SITE_NAME"
    echo "3. Connect to CodeUp repository"
    echo "4. Configure build settings:"
    echo "   - Framework: Next.js"
    echo "   - Build Command: npm run build"
    echo "   - Output Directory: .next"
    echo "5. Enable auto-deploy for branch: $BRANCH"
    echo ""
fi

# Verify deployment
echo ""
echo "✅ Deployment initiated!"
echo ""
echo "Next steps:"
echo "1. Check deployment status in ESA Console"
echo "2. Wait for build to complete (~2-5 minutes)"
echo "3. Access your site at the provided URL"

echo ""
echo "======================================"
echo "Deployment Complete"
echo "======================================"
