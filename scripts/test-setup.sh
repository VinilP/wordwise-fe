#!/bin/bash

# Frontend Testing Setup Script
# This script sets up the complete testing environment for the WordWise frontend

set -e

echo "🚀 Setting up WordWise Frontend Testing Suite..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Install Playwright browsers
echo "🎭 Installing Playwright browsers..."
npx playwright install --with-deps

# Create necessary directories
echo "📁 Creating test directories..."
mkdir -p src/test/visual/screenshots
mkdir -p coverage
mkdir -p test-results

# Set up MSW
echo "🔧 Setting up Mock Service Workers..."
npx msw init public/ --save

# Run initial tests to verify setup
echo "🧪 Running initial tests to verify setup..."

# Unit tests
echo "  - Running unit tests..."
npm run test:unit

# Integration tests
echo "  - Running integration tests..."
npm run test:integration

# Accessibility tests
echo "  - Running accessibility tests..."
npm run test:accessibility


# Run visual tests (if application is running)
echo "🎨 Testing visual regression setup..."
if curl -s http://localhost:3000 > /dev/null; then
    echo "  - Application is running, running visual tests..."
    npm run test:visual
else
    echo "  - Application not running, skipping visual tests"
    echo "  - To run visual tests: npm run dev (in another terminal) then npm run test:visual"
fi

# Generate coverage report
echo "📊 Generating coverage report..."
npm run test:coverage

echo ""
echo "🎉 Testing setup complete!"
echo ""
echo "Available commands:"
echo "  npm run test              - Run all tests in watch mode"
echo "  npm run test:unit         - Run unit tests only"
echo "  npm run test:integration  - Run integration tests only"
echo "  npm run test:visual       - Run visual regression tests"
echo "  npm run test:accessibility - Run accessibility tests"
echo "  npm run test:coverage     - Run tests with coverage report"
echo "  npm run test:coverage:open - Open coverage report in browser"
echo "  npm run test:ui           - Run tests with UI"
echo ""
echo "Coverage thresholds:"
echo "  - Global: 80% (branches, functions, lines, statements)"
echo "  - Components: 85%"
echo "  - Utils: 90%"
echo ""
echo "Test files location:"
echo "  - Unit tests: src/components/**/__tests__/"
echo "  - Integration tests: src/test/integration/"
echo "  - Visual tests: src/test/visual/"
echo "  - Accessibility tests: src/test/accessibility.test.ts"
echo ""
echo "Happy testing! 🧪"

