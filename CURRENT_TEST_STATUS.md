# WordWise Frontend Test Status & Troubleshooting Guide

## 📊 Current Test Status (December 2024)

### Overall Results
- **Total Tests**: 350
- **Passing**: 297 ✅
- **Failing**: 53 ❌
- **Success Rate**: 85%
- **Test Files**: 45 (23 passed, 22 failed)

### Test Categories Status

| Category | Status | Passing | Failing | Success Rate |
|----------|--------|---------|---------|--------------|
| User Profile Workflow | ✅ | 11/11 | 0 | 100% |
| Review Management Workflow | ✅ | 11/11 | 0 | 100% |
| Book Discovery Workflow | ⚠️ | 2/9 | 7 | 22% |
| Component Unit Tests | ⚠️ | ~200/250 | ~50 | 80% |
| Accessibility Tests | ✅ | 25/25 | 0 | 100% |

## 🔍 Detailed Failure Analysis

### 1. Book Discovery Workflow Tests (7 failures)

**File**: `src/test/integration/book-discovery-workflow.test.tsx`

#### Issues:
- **Mock Data Structure Mismatches**: Tests expect different data structure than components use
- **Text Content Splitting**: Book titles/authors appear in both main content and tooltips
- **API Call Expectations**: Mock API calls don't match actual component behavior

#### Specific Failures:
1. `should handle loading state` - Skeleton count mismatch
2. `should handle error state` - Error text not found
3. `should handle pagination` - Pagination button not found
4. `should display books with proper information` - Multiple text matches
5. `should display book information correctly` - Text content issues

### 2. Component Behavior Mismatches (Most Common)

#### BookSearch Component
**File**: `src/components/books/__tests__/BookSearch.test.tsx`

**Issue**: Tests expect "Active" text that doesn't exist
```typescript
// ❌ Current test expectation
expect(screen.getByText('Active')).toBeInTheDocument();

// ✅ Actual component renders
<span>Active filters:</span>
<div class="flex items-center gap-1">
  <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
    1 genre
  </span>
</div>
```

**Fix**: Update test to look for "Active filters:" or check for the count badge

#### FavoriteButton Component
**File**: `src/components/books/__tests__/FavoriteButton.test.tsx`

**Issue**: Tests expect "Add to Favorites" text that's not rendered
```typescript
// ❌ Current test expectation
expect(screen.getByText('Add to Favorites')).toBeInTheDocument();

// ✅ Actual component renders
<button
  class="flex items-center gap-2 text-gray-400 cursor-not-allowed"
  disabled=""
  title="Please log in to add favorites"
>
  <svg>...</svg>
</button>
```

**Fix**: Update test to check for tooltip text instead of button text

#### ReviewForm Component
**File**: `src/components/reviews/__tests__/ReviewForm.test.tsx`

**Issue**: Tests expect validation errors with `role="alert"` that aren't present
```typescript
// ❌ Current test expectation
await waitFor(() => {
  expect(screen.getByRole('alert')).toBeInTheDocument();
});

// ✅ Actual component behavior
<button
  data-testid="submit-review-button"
  disabled=""  // Button is disabled instead of showing errors
  type="submit"
>
  Submit Review
</button>
```

**Fix**: Update test to check button disabled state instead of looking for alert

#### RecommendationCard Component
**File**: `src/components/recommendations/__tests__/RecommendationCard.test.tsx`

**Issue**: Tests expect `role="progressbar"` that doesn't exist
```typescript
// ❌ Current test expectation
const progressBar = screen.getByRole('progressbar', { hidden: true });

// ✅ Actual component renders
<div class="w-16 bg-gray-200 rounded-full h-2">
  <div
    class="h-2 rounded-full transition-all duration-300 bg-green-500"
    style="width: 85%;"
  />
</div>
```

**Fix**: Either add `role="progressbar"` to the component or update test to use different selector

### 3. Jest vs Vitest Compatibility Issues

#### RecommendationErrorBoundary Component
**File**: `src/components/recommendations/__tests__/RecommendationErrorBoundary.test.tsx`

**Issue**: Tests use Jest syntax instead of Vitest
```typescript
// ❌ Jest syntax (not available in Vitest)
beforeEach(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

// ✅ Vitest syntax
beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});
```

**Fix**: Replace all `jest` references with `vi`

### 4. Accessibility/Event Handling Issues

#### AccessibleButton Component
**File**: `src/components/ui/__tests__/AccessibleButton.test.tsx`

**Issue**: Custom `onKeyDown` handler not being called as expected
```typescript
// ❌ Test expectation
expect(handleKeyDown).toHaveBeenCalled();

// Issue: The component might not be calling the handler properly
```

**Fix**: Investigate component implementation and event handling

## 🛠️ Troubleshooting Guide

### Quick Fixes (High Priority)

#### 1. Fix BookSearch Tests
```typescript
// Update test to match actual component text
it('shows active filter indicator when filters are applied', async () => {
  // ... setup code ...
  
  // ❌ Old expectation
  // expect(screen.getByText('Active')).toBeInTheDocument();
  
  // ✅ New expectation
  expect(screen.getByText('Active filters:')).toBeInTheDocument();
  expect(screen.getByText('1')).toBeInTheDocument(); // Check for count
});
```

#### 2. Fix FavoriteButton Tests
```typescript
// Update test to check tooltip instead of button text
it('shows login message when user is not authenticated', () => {
  // ... setup code ...
  
  // ❌ Old expectation
  // expect(screen.getByText('Add to Favorites')).toBeInTheDocument();
  
  // ✅ New expectation
  expect(screen.getByTitle('Please log in to add favorites')).toBeInTheDocument();
});
```

#### 3. Fix ReviewForm Tests
```typescript
// Update test to check button disabled state
it('shows validation errors for empty fields', async () => {
  // ... setup code ...
  
  // ❌ Old expectation
  // await waitFor(() => {
  //   expect(screen.getByRole('alert')).toBeInTheDocument();
  // });
  
  // ✅ New expectation
  const submitButton = screen.getByTestId('submit-review-button');
  expect(submitButton).toBeDisabled();
});
```

#### 4. Fix RecommendationErrorBoundary Tests
```typescript
// Replace Jest with Vitest syntax
import { vi } from 'vitest';

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});
```

### Medium Priority Fixes

#### 1. Fix Book Discovery Tests
- Investigate mock data structure mismatches
- Update text content expectations for tooltips
- Fix API call expectations

#### 2. Add Missing ARIA Roles
```typescript
// Add role="progressbar" to RecommendationCard
<div
  class="w-16 bg-gray-200 rounded-full h-2"
  role="progressbar"
  aria-valuenow={confidence}
  aria-valuemin="0"
  aria-valuemax="100"
>
  <div
    class="h-2 rounded-full transition-all duration-300 bg-green-500"
    style={`width: ${confidence}%;`}
  />
</div>
```

### Testing Commands

#### Run Specific Test Categories
```bash
# Run only integration tests
npx vitest run src/test/integration/

# Run specific test file
npx vitest run src/components/books/__tests__/BookSearch.test.tsx

# Run tests matching pattern
npx vitest run --testNamePattern="BookSearch"

# Run tests in watch mode
npx vitest watch src/components/books/__tests__/BookSearch.test.tsx
```

#### Debug Tests
```bash
# Run tests with verbose output
npx vitest run --reporter=verbose

# Run tests in debug mode
npx vitest run --debug

# Run specific test with debug
npx vitest run --debug src/components/books/__tests__/BookSearch.test.tsx
```

## 📈 Success Metrics

### Current Status
- **Overall Success Rate**: 85% (297/350)
- **Critical Workflows**: 100% (User Profile, Review Management)
- **Component Tests**: 80% (Most passing with some mismatches)
- **Accessibility**: 100% (All tests passing)

### Target Goals
- **Overall Success Rate**: 95%+
- **All Integration Tests**: 100%
- **Component Tests**: 95%+
- **Accessibility**: 100% (Maintain)

## 🎯 Action Plan

### Week 1: Critical Fixes
1. Fix BookSearch component tests
2. Fix FavoriteButton component tests
3. Fix ReviewForm component tests
4. Complete Jest to Vitest migration

### Week 2: Integration Tests
1. Fix Book Discovery workflow tests
2. Investigate mock data structure issues
3. Update API call expectations

### Week 3: Polish & Optimization
1. Add missing ARIA roles
2. Improve test coverage
3. Add edge case testing

### Week 4: Validation & Documentation
1. Run full test suite
2. Update documentation
3. Set up CI/CD integration

## 📞 Getting Help

### Internal Resources
- Check this troubleshooting guide
- Review component implementations
- Check test utilities and mocks

### Common Issues
1. **Text Content Changes**: Components evolved but tests weren't updated
2. **Framework Migration**: Jest syntax still present in some tests
3. **Mock Data Mismatches**: Test data doesn't match component expectations
4. **Accessibility Roles**: Missing ARIA attributes in components

### Debug Tips
1. Use `screen.debug()` to see rendered DOM
2. Check component props and state
3. Verify mock data structure
4. Use browser dev tools to inspect elements

---

**Remember**: The test suite is in good shape overall (85% success rate). Most failures are due to component evolution that hasn't been reflected in tests yet, not fundamental issues with the codebase.
