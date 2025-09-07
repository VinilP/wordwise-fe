# WordWise Frontend Project

A modern React-based web application for the WordWise book review platform with TypeScript, Tailwind CSS, and comprehensive accessibility features.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
frontend-project/
├── src/                    # Source code
│   ├── components/         # React components
│   │   ├── ui/            # Reusable UI components
│   │   ├── forms/         # Form components
│   │   └── layout/        # Layout components
│   ├── pages/             # Page components
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API services
│   ├── utils/             # Utility functions
│   ├── types/             # TypeScript types
│   └── styles/            # Global styles
├── public/                # Static assets
├── tests/                 # Test files
│   ├── unit/             # Unit tests
│   ├── integration/      # Integration tests
│   └── e2e/              # End-to-end tests
├── infrastructure/       # Terraform infrastructure code
├── .kiro/               # Kiro specs and documentation
│   └── specs/           # Requirements, design, tasks
├── chats/               # Development chat history
├── scripts/             # Utility scripts
└── .storybook/          # Storybook configuration
```

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build

# Testing
npm run test            # Run unit tests
npm run test:e2e        # Run end-to-end tests
npm run test:coverage   # Run with coverage
npm run test:accessibility # Run accessibility tests

# Code Quality
npm run lint            # Run ESLint
npm run format          # Format with Prettier
npm run type-check      # TypeScript type checking

# Storybook
npm run storybook       # Start Storybook
npm run build-storybook # Build Storybook
```

## 🏗️ Infrastructure

The `infrastructure/` directory contains Terraform configurations for AWS deployment:

- **S3 Static Hosting**: Static website hosting
- **CloudFront CDN**: Global content delivery network
- **Route 53**: DNS management
- **Certificate Manager**: SSL/TLS certificates

## 🎨 Design System

Built with a comprehensive design system:

- **Tailwind CSS**: Utility-first CSS framework
- **Component Library**: Reusable UI components
- **Storybook**: Component documentation and testing
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG 2.1 AA compliance

## 🧪 Testing

Comprehensive testing suite including:

- **Unit Tests**: Component and hook testing with Vitest
- **Integration Tests**: User workflow testing
- **E2E Tests**: Full application testing with Playwright
- **Accessibility Tests**: Automated accessibility testing
- **Visual Regression**: Screenshot comparison testing

## 📱 Features

### Core Features
- **User Authentication**: Login, registration, and profile management
- **Book Catalog**: Browse, search, and filter books
- **Review System**: Create, edit, and manage book reviews
- **Recommendations**: AI-powered book recommendations
- **Favorites**: Save and manage favorite books

### Technical Features
- **Responsive Design**: Works on all device sizes
- **Progressive Web App**: Offline capabilities and app-like experience
- **Performance Optimized**: Code splitting and lazy loading
- **Accessibility**: Full keyboard navigation and screen reader support
- **Internationalization**: Multi-language support ready

## 📋 Requirements & Design

See `.kiro/specs/` for detailed:

- **Requirements**: User interface and experience requirements
- **Design**: Component architecture and design system
- **Tasks**: Implementation tasks and progress

## 🔄 CI/CD

GitHub Actions workflows in `.github/workflows/`:

- **CI/CD Pipeline**: Automated testing and deployment
- **Performance Monitoring**: Lighthouse CI integration
- **Security Scanning**: Dependency vulnerability checks
- **Accessibility Testing**: Automated accessibility validation

## 📊 Performance

Performance optimization features:

- **Code Splitting**: Route-based and component-based splitting
- **Lazy Loading**: Images and components loaded on demand
- **Bundle Analysis**: Webpack bundle analyzer integration
- **Core Web Vitals**: Performance metrics monitoring

## 🌐 Accessibility

Comprehensive accessibility features:

- **Semantic HTML**: Proper HTML structure and landmarks
- **ARIA Labels**: Screen reader support
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG AA compliant color schemes
- **Focus Management**: Proper focus handling

## 🤝 Contributing

1. Review the requirements in `.kiro/specs/`
2. Follow the development workflow in `DEVELOPER_ONBOARDING.md`
3. Run tests and accessibility checks before submitting PRs
4. Update Storybook documentation for new components

## 📚 Documentation

- **[Frontend README](README.md)** - Application-specific documentation
- **[Testing Guide](TESTING_GUIDE.md)** - Testing procedures
- **[Deployment Guide](DEPLOYMENT.md)** - Deployment instructions
- **[Developer Guide](DEVELOPER_ONBOARDING.md)** - Development workflow
- **[Accessibility Guide](ACCESSIBILITY_TESTING.md)** - Accessibility testing

## 🆘 Support

- Check the chat history in `chats/` for implementation details
- Review Storybook for component documentation
- Use browser dev tools for debugging
- Check accessibility reports for compliance issues

---

**Tech Stack**: React, TypeScript, Vite, Tailwind CSS, Vitest, Playwright, Storybook, AWS, Terraform