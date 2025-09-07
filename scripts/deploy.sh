#!/bin/bash

# Frontend Deployment Script
# Usage: ./scripts/deploy.sh [staging|production]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-staging}
FRONTEND_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD_DIR="$FRONTEND_DIR/dist"

# Environment-specific configuration
if [ "$ENVIRONMENT" = "production" ]; then
    S3_BUCKET="${PRODUCTION_S3_BUCKET}"
    CLOUDFRONT_DISTRIBUTION_ID="${PRODUCTION_CLOUDFRONT_DISTRIBUTION_ID}"
    DOMAIN="${PRODUCTION_DOMAIN}"
    echo -e "${BLUE}🚀 Deploying to PRODUCTION${NC}"
elif [ "$ENVIRONMENT" = "staging" ]; then
    S3_BUCKET="${STAGING_S3_BUCKET}"
    CLOUDFRONT_DISTRIBUTION_ID="${STAGING_CLOUDFRONT_DISTRIBUTION_ID}"
    DOMAIN="${STAGING_DOMAIN}"
    echo -e "${YELLOW}🚀 Deploying to STAGING${NC}"
else
    echo -e "${RED}❌ Invalid environment. Use 'staging' or 'production'${NC}"
    exit 1
fi

# Validate required environment variables
if [ -z "$S3_BUCKET" ] || [ -z "$CLOUDFRONT_DISTRIBUTION_ID" ] || [ -z "$DOMAIN" ]; then
    echo -e "${RED}❌ Missing required environment variables:${NC}"
    echo "  - S3_BUCKET: $S3_BUCKET"
    echo "  - CLOUDFRONT_DISTRIBUTION_ID: $CLOUDFRONT_DISTRIBUTION_ID"
    echo "  - DOMAIN: $DOMAIN"
    exit 1
fi

echo -e "${BLUE}📁 Frontend directory: $FRONTEND_DIR${NC}"
echo -e "${BLUE}🏗️  Build directory: $BUILD_DIR${NC}"
echo -e "${BLUE}🪣 S3 Bucket: $S3_BUCKET${NC}"
echo -e "${BLUE}🌐 Domain: $DOMAIN${NC}"

# Check if build directory exists
if [ ! -d "$BUILD_DIR" ]; then
    echo -e "${YELLOW}⚠️  Build directory not found. Building application...${NC}"
    cd "$FRONTEND_DIR"
    npm run build
fi

# Verify build directory has content
if [ ! -f "$BUILD_DIR/index.html" ]; then
    echo -e "${RED}❌ Build directory is empty or missing index.html${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Build directory verified${NC}"

# Get build size
BUILD_SIZE=$(du -sh "$BUILD_DIR" | cut -f1)
echo -e "${BLUE}📦 Build size: $BUILD_SIZE${NC}"

# List largest files
echo -e "${BLUE}📊 Largest files in build:${NC}"
find "$BUILD_DIR" -type f -exec du -h {} + | sort -rh | head -5

# Deploy to S3
echo -e "${YELLOW}🔄 Syncing files to S3...${NC}"
aws s3 sync "$BUILD_DIR" "s3://$S3_BUCKET" --delete

# Set cache headers for different file types
echo -e "${YELLOW}🔄 Setting cache headers...${NC}"

# HTML files - no cache
aws s3 cp "s3://$S3_BUCKET/index.html" "s3://$S3_BUCKET/index.html" \
    --metadata-directive REPLACE \
    --cache-control "no-cache, no-store, must-revalidate" \
    --content-type "text/html"

# CSS and JS files - long cache
aws s3 cp "s3://$S3_BUCKET/assets/" "s3://$S3_BUCKET/assets/" \
    --recursive \
    --metadata-directive REPLACE \
    --cache-control "public, max-age=31536000, immutable" \
    --exclude "*" \
    --include "*.css" \
    --include "*.js"

# Images - medium cache
aws s3 cp "s3://$S3_BUCKET/" "s3://$S3_BUCKET/" \
    --recursive \
    --metadata-directive REPLACE \
    --cache-control "public, max-age=86400" \
    --exclude "*" \
    --include "*.png" \
    --include "*.jpg" \
    --include "*.jpeg" \
    --include "*.gif" \
    --include "*.svg" \
    --include "*.webp"

# Other assets - short cache
aws s3 cp "s3://$S3_BUCKET/" "s3://$S3_BUCKET/" \
    --recursive \
    --metadata-directive REPLACE \
    --cache-control "public, max-age=3600" \
    --exclude "assets/*" \
    --exclude "*.html" \
    --exclude "*.png" \
    --exclude "*.jpg" \
    --exclude "*.jpeg" \
    --exclude "*.gif" \
    --exclude "*.svg" \
    --exclude "*.webp"

echo -e "${GREEN}✅ Files uploaded to S3 with appropriate cache headers${NC}"

# Invalidate CloudFront
echo -e "${YELLOW}🔄 Invalidating CloudFront cache...${NC}"
INVALIDATION_ID=$(aws cloudfront create-invalidation \
    --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
    --paths "/*" \
    --query 'Invalidation.Id' \
    --output text)

echo -e "${BLUE}📋 Invalidation ID: $INVALIDATION_ID${NC}"

# Wait for invalidation to complete (optional)
echo -e "${YELLOW}⏳ Waiting for CloudFront invalidation to complete...${NC}"
aws cloudfront wait invalidation-completed \
    --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
    --id "$INVALIDATION_ID"

echo -e "${GREEN}✅ CloudFront invalidation completed${NC}"

# Health check
echo -e "${YELLOW}🔍 Performing health check...${NC}"
MAX_RETRIES=10
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
    if curl -f -s "https://$DOMAIN" > /dev/null; then
        echo -e "${GREEN}✅ Health check passed!${NC}"
        break
    else
        RETRY_COUNT=$((RETRY_COUNT + 1))
        echo -e "${YELLOW}⏳ Health check failed, retrying... ($RETRY_COUNT/$MAX_RETRIES)${NC}"
        sleep 10
    fi
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo -e "${RED}❌ Health check failed after $MAX_RETRIES attempts${NC}"
    exit 1
fi

# Success message
echo -e "${GREEN}🎉 Frontend deployed successfully to $ENVIRONMENT!${NC}"
echo -e "${GREEN}🌐 URL: https://$DOMAIN${NC}"
echo -e "${GREEN}📦 Build size: $BUILD_SIZE${NC}"
echo -e "${GREEN}🆔 Invalidation ID: $INVALIDATION_ID${NC}"

# Optional: Send notification
if [ -n "$SLACK_WEBHOOK_URL" ]; then
    echo -e "${YELLOW}📢 Sending notification...${NC}"
    curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"🚀 Frontend deployed to $ENVIRONMENT\\n🌐 URL: https://$DOMAIN\\n📦 Build size: $BUILD_SIZE\"}" \
        "$SLACK_WEBHOOK_URL"
fi

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
