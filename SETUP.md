# Frontend Setup Guide

This guide provides detailed setup instructions for the WordWise frontend application.

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download here](https://git-scm.com/)

### Required Services
- **Backend API** running on `http://localhost:3001` (see backend setup guide)

### Optional but Recommended
- **VS Code** with React/TypeScript extensions
- **Postman** or **Insomnia** - For API testing
- **Chrome DevTools** - For debugging

## 🚀 Detailed Setup Instructions

### 1. Clone and Navigate to Frontend

```bash
# Clone the repository (if not already done)
git clone <repository-url>
cd wordwise-fe
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Or using yarn
yarn install
```

### 3. Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3001/api
VITE_APP_NAME=WordWise
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG=true

# Development Configuration
VITE_NODE_ENV=development
```

### 4. Verify Backend Connection

Before starting the frontend, ensure the backend is running:

```bash
# Test backend health
curl http://localhost:3001/health

# Expected response:
# {"success":true,"data":{"message":"Book Review Platform API is running",...}}
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🔧 Development Commands

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run TypeScript type checking
npm run type-check

# Run all tests
npm run test

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run accessibility tests
npm run test:accessibility

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run visual regression tests
npm run test:visual

# Code quality
npm run lint
npm run lint:fix
npm run format
npm run format:check

# Storybook
npm run storybook
npm run build-storybook
npm run test-storybook

# Performance
npm run performance:lighthouse
npm run performance:budget

# Security
npm run security:audit
npm run security:fix
```

## 🧪 Testing the Setup

### 1. Verify Frontend is Running

1. **Open Browser**: Navigate to `http://localhost:5173`
2. **Check Console**: Open DevTools and verify no errors
3. **Test Navigation**: Click through the application

### 2. Test API Integration

1. **Open DevTools**: Press F12 or right-click → Inspect
2. **Go to Network Tab**: Monitor API calls
3. **Try Features**: Register, login, browse books
4. **Verify Requests**: Check that API calls go to `http://localhost:3001/api`

### 3. Run Test Suite

```bash
# Run all tests
npm run test

# Run specific test types
npm run test:unit
npm run test:integration
npm run test:accessibility
```

## 🎨 Development Features

### Hot Module Replacement (HMR)
- Changes to components automatically reload in the browser
- State is preserved during development
- Fast refresh for React components

### TypeScript Support
- Full TypeScript integration
- Type checking in development
- IntelliSense and autocomplete

### Tailwind CSS
- Utility-first CSS framework
- Responsive design utilities
- Dark/light theme support

### React Query
- Server state management
- Automatic caching and synchronization
- Background updates

## 🔍 Troubleshooting

### Common Issues and Solutions

#### 1. Backend Connection Issues

**Error**: `Failed to fetch` or CORS errors

**Solutions**:
- Verify backend is running on `http://localhost:3001`
- Check `VITE_API_BASE_URL` in `.env` file
- Ensure backend CORS is configured for `http://localhost:5173`

#### 2. Port Already in Use

**Error**: `Port 5173 is already in use`

**Solutions**:
```bash
# Find process using port 5173
lsof -i :5173

# Kill the process
kill -9 <PID>

# Or use different port
npm run dev -- --port 3000
```

#### 3. Environment Variables Not Loading

**Error**: Environment variables showing as undefined

**Solutions**:
- Ensure all environment variables start with `VITE_`
- Restart the development server after changing `.env`
- Check `.env` file is in the project root

#### 4. Build Issues

**Error**: Build fails with TypeScript errors

**Solutions**:
```bash
# Run type checking
npm run type-check

# Fix linting issues
npm run lint:fix

# Clear cache and rebuild
rm -rf node_modules/.vite
npm run build
```

#### 5. Test Failures

**Error**: Tests failing with import or module errors

**Solutions**:
```bash
# Clear test cache
npm run test -- --clearCache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Running Full Development Environment

To run both frontend and backend together:

### Terminal 1 - Backend
```bash
cd wordwise-be
npm run dev
# Backend will run on http://localhost:3001
```

### Terminal 2 - Frontend
```bash
cd wordwise-fe
npm run dev
# Frontend will run on http://localhost:5173
```

### Quick Verification
1. **Backend Health Check**: Visit `http://localhost:3001/health`
2. **Frontend Application**: Visit `http://localhost:5173`
3. **API Integration**: The frontend should connect to the backend automatically

## 🎯 Next Steps

After successful setup:

1. **Explore the Application**: Navigate through all features
2. **Test User Flows**: Register, login, browse books, write reviews
3. **Review the Code**: Understand the component structure
4. **Run Tests**: Ensure everything works correctly
5. **Customize**: Modify components and styles as needed

---

**Congratulations!** 🎉 Your WordWise frontend is now set up and ready for development.
