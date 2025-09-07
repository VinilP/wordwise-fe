# Frontend Testing Suite

This directory contains comprehensive tests for the WordWise frontend application.

## Test Structure

```
src/test/
├── config/                 # Test configuration
├── integration/            # Integration tests
├── mocks/                  # Mock data and handlers
├── utils/                  # Test utilities and helpers
├── visual/                 # Visual regression tests
├── accessibility.test.ts   # Accessibility tests
└── setup.ts               # Test setup and configuration
```

## Test Types

### 1. Unit Tests
- **Location**: `src/components/**/__tests__/`
- **Purpose**: Test individual components in isolation
- **Tools**: Vitest, React Testing Library
- **Coverage**: All React components with user interaction testing

### 2. Integration Tests
- **Location**: `src/test/integration/`
- **Purpose**: Test complete user workflows
- **Examples**: Login flow, book review creation, search functionality
- **Tools**: Vitest, React Testing Library, MSW

### 3. Visual Regression Tests
- **Location**: `src/test/visual/`
- **Purpose**: Ensure UI consistency across changes
- **Tools**: Playwright
- **Coverage**: Component screenshots, responsive layouts, user flows

### 4. Accessibility Tests
- **Location**: `src/test/accessibility.test.ts`
- **Purpose**: Ensure WCAG 2.1 AA compliance
- **Tools**: React Testing Library, custom accessibility helpers

## Running Tests

### All Tests
```bash
npm run test:all
```

### Unit Tests Only
```bash
npm run test:unit
```

### Integration Tests Only
```bash
npm run test:integration
```

### Visual Tests Only
```bash
npm run test:visual
```

### Accessibility Tests Only
```bash
npm run test:accessibility
```

### Coverage Report
```bash
npm run test:coverage
npm run test:coverage:open  # Opens coverage report in browser
```

### Watch Mode
```bash
npm run test:watch
```

### UI Mode
```bash
npm run test:ui
```

## Test Configuration

### Coverage Thresholds
- **Global**: 80% for branches, functions, lines, statements
- **Components**: 85% for all metrics
- **Utils**: 90% for all metrics

### Test Timeouts
- **Default**: 10 seconds
- **Long**: 30 seconds
- **Short**: 5 seconds

## Mock Service Workers (MSW)

MSW is used to mock API calls during testing, allowing tests to run without backend dependencies.

### Handlers
- **Location**: `src/test/mocks/handlers.ts`
- **Purpose**: Define mock API responses
- **Coverage**: All API endpoints

### Usage
```typescript
import { server } from '@/test/mocks/server';

// Enable MSW
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

## Test Utilities

### Custom Render
```typescript
import { render } from '@/test/utils/test-utils';

// Renders component with all necessary providers
render(<Component />, {
  initialAuthState: { user: mockUser, isAuthenticated: true },
  queryClient: customQueryClient,
});
```

### Mock Data Factories
```typescript
import { createMockUser, createMockBook } from '@/test/utils/test-utils';

const user = createMockUser({ name: 'Custom User' });
const book = createMockBook({ title: 'Custom Book' });
```

### Mock Functions
```typescript
import { mockNavigate, mockAuthService } from '@/test/utils/mock-functions';

// Use in tests
expect(mockNavigate).toHaveBeenCalledWith('/');
expect(mockAuthService.login).toHaveBeenCalledWith(loginData);
```

## Visual Testing

### Storybook
- **Command**: `npm run storybook`
- **Purpose**: Component documentation and visual testing
- **Location**: `.storybook/`

### Playwright
- **Command**: `npm run test:visual`
- **Purpose**: Visual regression testing
- **Coverage**: UI components, responsive layouts, user flows

## Best Practices

### 1. Test Structure
- Use descriptive test names
- Group related tests with `describe`
- Use `beforeEach` for setup
- Clean up after tests

### 2. User-Centric Testing
- Test from user perspective
- Use accessible queries (getByRole, getByLabelText)
- Test keyboard navigation
- Test screen reader compatibility

### 3. Mocking
- Mock external dependencies
- Use MSW for API mocking
- Mock router functions
- Mock localStorage and window methods

### 4. Assertions
- Use specific assertions
- Test both positive and negative cases
- Test error states
- Test loading states

### 5. Coverage
- Aim for high coverage
- Focus on critical paths
- Test edge cases
- Test error handling

## Debugging Tests

### Vitest UI
```bash
npm run test:ui
```

### Playwright UI
```bash
npm run test:visual:ui
```

### Debug Mode
```bash
npm run test -- --reporter=verbose
```

## CI/CD Integration

### GitHub Actions
```yaml
- name: Run Tests
  run: npm run test:ci
```

### Coverage Reporting
- HTML reports generated in `coverage/`
- LCOV reports for CI integration
- JUnit reports for test results

## Troubleshooting

### Common Issues

1. **Tests timing out**
   - Increase timeout in test config
   - Check for infinite loops
   - Ensure proper cleanup

2. **MSW not working**
   - Check handler registration
   - Verify request matching
   - Check console for errors

3. **Visual tests failing**
   - Update screenshots if UI changed intentionally
   - Check viewport settings
   - Verify test environment

4. **Coverage below threshold**
   - Add missing test cases
   - Check coverage exclusions
   - Review untested code paths

### Getting Help
- Check test documentation
- Review existing test examples
- Use debug mode for detailed output
- Check CI logs for errors

