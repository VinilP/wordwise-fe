# WordWise Frontend

A modern, responsive React application for the WordWise book review platform built with TypeScript, Vite, and Tailwind CSS.

## 🚀 Features

- **Modern UI/UX**: Clean, responsive design with Tailwind CSS
- **Authentication**: Secure login and registration with JWT
- **Book Discovery**: Search, browse, and explore books
- **Review System**: Write, edit, and manage book reviews
- **Recommendations**: AI-powered personalized book recommendations
- **User Profiles**: Manage favorites and review history
- **Accessibility**: WCAG 2.1 AA compliant components
- **Performance**: Optimized with React Query and lazy loading
- **Testing**: Comprehensive unit, integration, and visual tests
- **PWA Ready**: Progressive Web App capabilities

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Backend API running (see backend README)

## 📚 Documentation Structure

This project uses a clear documentation structure:

- **[README.md](./README.md)** - Main documentation (this file)
- **[QUICKSTART.md](./QUICKSTART.md)** - Quick start guide for immediate setup
- **[SETUP.md](./SETUP.md)** - Detailed setup instructions and troubleshooting

## 🚀 Quick Start

For immediate setup, see the **[QUICKSTART.md](./QUICKSTART.md)** guide.

For comprehensive setup instructions, see the **[SETUP.md](./SETUP.md)** guide.

### Essential Commands

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev
```

**Access Points:**
- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:3001` (must be running)

## 🎨 Features Overview

### Authentication
- Secure user registration and login
- JWT token management with refresh
- Protected routes and role-based access
- Password strength validation

### Book Discovery
- Advanced search with filters
- Browse by genres and categories
- Book details with ratings and reviews
- Cover image optimization

### Review System
- Write and edit book reviews
- Star rating system (1-5 stars)
- Review history and management
- Review validation and moderation

### Recommendations
- AI-powered personalized recommendations
- Similar books suggestions
- Trending and popular books
- Genre-based recommendations

### User Experience
- Responsive design for all devices
- Dark/light theme support
- Keyboard navigation
- Screen reader compatibility
- Loading states and error handling

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── books/          # Book-related components
│   ├── layout/         # Layout components
│   ├── pages/          # Page components
│   ├── profile/        # User profile components
│   ├── recommendations/ # Recommendation components
│   ├── reviews/        # Review components
│   └── ui/             # Base UI components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API service layer
├── styles/             # Global styles
├── test/               # Test utilities and configs
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── App.tsx             # Main app component
└── main.tsx            # Application entry point
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build
npm run type-check      # Run TypeScript type checking

# Testing
npm run test            # Run all tests
npm run test:unit       # Run unit tests
npm run test:integration # Run integration tests
npm run test:accessibility # Run accessibility tests
npm run test:coverage   # Run tests with coverage
npm run test:watch      # Run tests in watch mode
npm run test:visual     # Run visual regression tests

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm run format          # Format code with Prettier
npm run format:check    # Check code formatting

# Storybook
npm run storybook       # Start Storybook
npm run build-storybook # Build Storybook
npm run test-storybook  # Test Storybook components

# Performance
npm run performance:lighthouse # Run Lighthouse audit
npm run performance:budget    # Check bundle size

# Security
npm run security:audit  # Run security audit
npm run security:fix    # Fix security vulnerabilities

# CI/CD
npm run ci:lint         # Lint check for CI
npm run ci:test         # Test suite for CI
npm run ci:build        # Build check for CI
npm run ci:deploy       # Full CI pipeline
```

### Component Architecture

The application follows a component-based architecture with:

- **Atomic Design**: Components organized by complexity
- **Composition**: Reusable components with clear interfaces
- **Props Interface**: Strongly typed component props
- **Error Boundaries**: Graceful error handling
- **Loading States**: Consistent loading patterns

### State Management

- **React Query**: Server state management and caching
- **React Context**: Global application state
- **Local State**: Component-level state with hooks
- **Form State**: React Hook Form for form management

## 🧪 Testing

### Test Types

1. **Unit Tests**: Test individual components and functions
2. **Integration Tests**: Test component interactions
3. **Accessibility Tests**: Test WCAG compliance
4. **Visual Tests**: Test UI consistency with Playwright
5. **E2E Tests**: Test complete user workflows

### Running Tests

```bash
# Run all tests
npm run test:all

# Run specific test types
npm run test:unit
npm run test:integration
npm run test:accessibility
npm run test:visual

# Run with coverage
npm run test:coverage
```

### Test Coverage Requirements

- Minimum 80% code coverage
- All components must have unit tests
- Critical user flows must have integration tests
- Accessibility tests for all interactive components

### Testing Tools

- **Vitest**: Fast unit testing framework
- **Testing Library**: Component testing utilities
- **Playwright**: End-to-end and visual testing
- **MSW**: API mocking for tests
- **Storybook**: Component development and testing

## 🎨 Styling & Design

### Design System

- **Tailwind CSS**: Utility-first CSS framework
- **Custom Components**: Reusable UI components
- **Design Tokens**: Consistent spacing, colors, and typography
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG 2.1 AA compliance

### Theme Support

- Light and dark theme support
- System preference detection
- Theme persistence
- Smooth theme transitions

### Component Library

The application includes a comprehensive component library:

- **Buttons**: Various button styles and states
- **Forms**: Input fields, validation, and error states
- **Navigation**: Header, footer, and navigation components
- **Cards**: Book cards, review cards, and content cards
- **Modals**: Dialog and modal components
- **Loading**: Spinners, skeletons, and loading states

## 🚀 Deployment

### Build Process

```bash
# Production build
npm run build

# Analyze bundle size
npm run build:analyze
```

### Environment Configuration

Configure environment variables for different environments:

```env
# Development
VITE_API_BASE_URL=http://localhost:3001/api/v1

# Staging
VITE_API_BASE_URL=https://api-staging.wordwise.com/api/v1

# Production
VITE_API_BASE_URL=https://api.wordwise.com/api/v1
```

### Deployment Scripts

```bash
# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production

# Dry run deployment
npm run deploy:dry-run
```

### Performance Optimization

- **Code Splitting**: Lazy loading of routes and components
- **Bundle Analysis**: Regular bundle size monitoring
- **Image Optimization**: Optimized images and lazy loading
- **Caching**: Aggressive caching strategies
- **CDN**: Content delivery network integration

## ♿ Accessibility

### WCAG 2.1 AA Compliance

- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: ARIA labels and descriptions
- **Color Contrast**: Sufficient color contrast ratios
- **Focus Management**: Clear focus indicators
- **Semantic HTML**: Proper HTML semantics

### Accessibility Testing

```bash
# Run accessibility tests
npm run test:accessibility

# Test with screen readers
npm run test:visual
```

### Accessibility Features

- Skip navigation links
- ARIA landmarks and regions
- Alt text for images
- Form labels and error messages
- High contrast mode support

## 📱 Progressive Web App

### PWA Features

- **Service Worker**: Offline functionality
- **App Manifest**: Installable web app
- **Push Notifications**: User engagement
- **Background Sync**: Data synchronization
- **Caching**: Offline content access

### PWA Configuration

The app includes PWA configuration in `vite.config.ts`:

- Service worker registration
- App manifest generation
- Offline page handling
- Cache strategies

## 🔒 Security

### Security Measures

- **Content Security Policy**: XSS protection
- **HTTPS Only**: Secure connections
- **Input Sanitization**: XSS prevention
- **Token Security**: Secure JWT handling
- **Dependency Audits**: Regular security scans

### Security Scripts

```bash
# Security audit
npm run security:audit

# Fix vulnerabilities
npm run security:fix

# Security check
npm run security:check
```

## 📊 Performance

### Performance Monitoring

- **Lighthouse Audits**: Regular performance checks
- **Bundle Analysis**: Bundle size monitoring
- **Core Web Vitals**: Performance metrics
- **Real User Monitoring**: User experience tracking

### Performance Scripts

```bash
# Lighthouse audit
npm run performance:lighthouse

# Bundle size check
npm run performance:budget
```

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests for new features
5. Run the test suite
6. Submit a pull request

### Code Standards

- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write tests for new components
- Document public APIs
- Follow accessibility guidelines

### Pull Request Process

1. Ensure all tests pass
2. Update documentation if needed
3. Add tests for new features
4. Follow the commit message convention
5. Request review from maintainers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

- Create an issue in the repository
- Check the [FAQ](docs/FAQ.md)
- Review the [component documentation](docs/COMPONENTS.md)
- Contact the development team

## 🔄 Changelog

### v1.0.0
- Initial release
- Authentication system
- Book discovery and search
- Review and rating system
- AI-powered recommendations
- User profiles and favorites
- Responsive design
- Accessibility compliance
- Comprehensive testing suite