# Frontend CI/CD Pipeline Documentation

This document provides comprehensive information about the frontend CI/CD pipeline implementation for the WordWise application.

## 🚀 Overview

The frontend CI/CD pipeline provides automated testing, building, and deployment capabilities with the following key features:

- **Automated Testing**: Unit, integration, accessibility, and visual regression tests
- **Code Quality**: ESLint, Prettier, TypeScript type checking
- **Security Scanning**: Vulnerability scanning, dependency auditing, license checking
- **Performance Monitoring**: Bundle size analysis, Lighthouse audits
- **Automated Deployment**: Staging and production deployments with rollback capabilities
- **Monitoring & Alerting**: Uptime monitoring, performance tracking, failure notifications

## 📁 File Structure

```
.github/
├── workflows/
│   ├── frontend-ci-cd.yml              # Main deployment pipeline
│   ├── frontend-pr-validation.yml      # PR validation
│   ├── frontend-performance.yml        # Performance monitoring
│   ├── frontend-security.yml          # Security scanning
│   ├── frontend-dependency-update.yml # Dependency updates
│   ├── frontend-environment-setup.yml # Environment setup
│   ├── frontend-rollback.yml          # Rollback capabilities
│   └── frontend-monitoring.yml        # Uptime monitoring
└── README.md                          # Workflow documentation

frontend/
├── scripts/
│   └── deploy.sh                      # Deployment script
├── .audit-ci.json                     # Security audit configuration
├── .lighthouserc.json                 # Lighthouse configuration
├── vite.config.ts                     # Production-optimized Vite config
└── package.json                       # Enhanced with CI/CD scripts
```

## 🔧 Workflow Details

### 1. Main CI/CD Pipeline (`frontend-ci-cd.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Manual workflow dispatch
- Changes to frontend files or workflow files

**Stages:**
1. **Lint & Format Check** - ESLint, Prettier, TypeScript
2. **Test Suite** - Unit, integration, accessibility tests with coverage
3. **Visual Regression Tests** - Playwright visual testing
4. **Build Validation** - Production build with optimization
5. **Security Audit** - npm audit and dependency checks
6. **Deploy to Staging** - Automatic staging deployment
7. **Deploy to Production** - Automatic production deployment
8. **Health Check** - Post-deployment verification

### 2. PR Validation (`frontend-pr-validation.yml`)

**Triggers:**
- Pull requests to `main` or `develop` branches

**Features:**
- Quick validation pipeline
- Build size reporting
- Automatic PR comments with status

### 3. Performance Monitoring (`frontend-performance.yml`)

**Triggers:**
- Code changes to frontend
- Manual dispatch

**Features:**
- Bundle size analysis
- Lighthouse CI performance testing
- Accessibility auditing
- Performance budget enforcement

### 4. Security Scanning (`frontend-security.yml`)

**Triggers:**
- Code changes to frontend
- Daily schedule (2 AM UTC)
- Manual dispatch

**Features:**
- npm audit vulnerability scanning
- Snyk security analysis
- CodeQL static analysis
- Secret detection
- License compliance checking

### 5. Dependency Updates (`frontend-dependency-update.yml`)

**Triggers:**
- Weekly schedule (Monday 9 AM UTC)
- Manual dispatch

**Features:**
- Automatic npm dependency updates
- Security fix application
- Automated PR creation

### 6. Environment Setup (`frontend-environment-setup.yml`)

**Triggers:**
- Manual dispatch only

**Features:**
- Environment validation
- AWS connectivity testing
- S3 bucket setup
- Configuration verification

### 7. Rollback (`frontend-rollback.yml`)

**Triggers:**
- Manual dispatch only

**Features:**
- Rollback to previous deployment
- Rollback to specific commit
- Health check after rollback

### 8. Monitoring (`frontend-monitoring.yml`)

**Triggers:**
- Every 5 minutes
- Manual dispatch

**Features:**
- Uptime monitoring
- Response time checking
- Performance monitoring
- Security monitoring
- Alert notifications

## 🛠️ Configuration

### Environment Variables

The following secrets must be configured in your GitHub repository:

#### Required Secrets
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `STAGING_S3_BUCKET` - S3 bucket for staging
- `PRODUCTION_S3_BUCKET` - S3 bucket for production
- `STAGING_CLOUDFRONT_DISTRIBUTION_ID` - CloudFront distribution for staging
- `PRODUCTION_CLOUDFRONT_DISTRIBUTION_ID` - CloudFront distribution for production
- `STAGING_DOMAIN` - Staging domain name
- `PRODUCTION_DOMAIN` - Production domain name

#### Optional Secrets
- `SNYK_TOKEN` - Snyk API token for security scanning
- `SLACK_WEBHOOK_URL` - Slack webhook for notifications
- `EMAIL_NOTIFICATION` - Email notification configuration

### Vite Configuration

The `vite.config.ts` has been optimized for production with:

- **Code Splitting**: Manual chunks for vendor libraries
- **Minification**: Terser with console removal
- **Asset Optimization**: Cache-friendly file naming
- **Bundle Analysis**: Size warnings and optimization

### Security Configuration

The `.audit-ci.json` file configures security auditing with:

- Vulnerability severity thresholds
- Allowlist for false positives
- JSON output format for CI integration

### Lighthouse Configuration

The `.lighthouserc.json` file sets performance budgets:

- Performance score thresholds
- Accessibility requirements
- SEO standards
- Core Web Vitals limits

## 🚀 Deployment Process

### Staging Deployment

1. **Trigger**: Push to `develop` branch
2. **Process**:
   - Run all tests and checks
   - Build production bundle
   - Deploy to S3 staging bucket
   - Invalidate CloudFront cache
   - Perform health check

### Production Deployment

1. **Trigger**: Push to `main` branch
2. **Process**:
   - Run all tests and checks
   - Build production bundle
   - Deploy to S3 production bucket
   - Invalidate CloudFront cache
   - Perform health check

### Manual Deployment

Use the deployment script directly:

```bash
# Deploy to staging
npm run deploy:staging

# Deploy to production
npm run deploy:production

# Dry run (build only)
npm run deploy:dry-run
```

## 📊 Monitoring and Alerts

### Uptime Monitoring

- **Frequency**: Every 5 minutes
- **Checks**: HTTP status and response time
- **Alerts**: Slack notifications on failures

### Performance Monitoring

- **Bundle Size**: Tracked and reported
- **Lighthouse Scores**: Performance, accessibility, SEO
- **Response Times**: Monitored for both environments

### Security Monitoring

- **Vulnerability Scanning**: Daily npm audit
- **Dependency Updates**: Weekly automated updates
- **License Compliance**: Regular license checking

## 🔍 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Check locally
   npm run ci:lint
   npm run ci:test
   npm run ci:build
   ```

2. **Deployment Failures**
   - Verify AWS credentials and permissions
   - Check S3 bucket configuration
   - Ensure CloudFront distribution is active

3. **Performance Issues**
   - Review bundle size analysis
   - Check Lighthouse reports
   - Optimize large assets

### Debug Mode

Enable debug logging by setting `ACTIONS_STEP_DEBUG=true` in repository secrets.

### Rollback Process

1. Go to Actions tab in GitHub
2. Select "Frontend Rollback" workflow
3. Click "Run workflow"
4. Choose environment and rollback target
5. Monitor the rollback process

## 📈 Metrics and Reporting

### Coverage Reports

- **Unit Test Coverage**: Uploaded to Codecov
- **Coverage Thresholds**: 80% minimum enforced
- **Coverage Reports**: Available in workflow artifacts

### Performance Reports

- **Lighthouse CI**: Reports in workflow artifacts
- **Bundle Analysis**: Size reports in build logs
- **Performance Budgets**: Enforced in CI pipeline

### Security Reports

- **Vulnerability Reports**: In workflow artifacts
- **License Reports**: Available for download
- **Audit Results**: JSON format for integration

## 🔄 Maintenance

### Weekly Tasks

- Review dependency update PRs
- Check security scan results
- Monitor performance metrics

### Monthly Tasks

- Review and update performance budgets
- Audit security configurations
- Update workflow dependencies

### Quarterly Tasks

- Review and update CI/CD pipeline
- Evaluate new security tools
- Update deployment strategies

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vite Configuration Guide](https://vitejs.dev/config/)
- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [Playwright Testing](https://playwright.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)

## 🆘 Support

For issues with the CI/CD pipeline:

1. Check the GitHub Actions logs
2. Review this documentation
3. Check the troubleshooting section
4. Create an issue in the repository

## 📝 Changelog

### Version 1.0.0
- Initial CI/CD pipeline implementation
- Automated testing and deployment
- Security scanning and monitoring
- Performance monitoring and optimization
- Rollback capabilities
- Comprehensive documentation
