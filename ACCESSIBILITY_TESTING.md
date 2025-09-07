# Accessibility Testing Guide for WordWise

This document provides comprehensive guidelines for testing accessibility features in the WordWise application to ensure compliance with WCAG 2.1 AA standards.

## Table of Contents

1. [Automated Testing](#automated-testing)
2. [Manual Testing Procedures](#manual-testing-procedures)
3. [Screen Reader Testing](#screen-reader-testing)
4. [Keyboard Navigation Testing](#keyboard-navigation-testing)
5. [Color and Contrast Testing](#color-and-contrast-testing)
6. [Mobile Accessibility Testing](#mobile-accessibility-testing)
7. [Testing Checklist](#testing-checklist)

## Automated Testing

### Running Accessibility Tests

```bash
# Run all accessibility tests
npm test -- --testPathPattern=accessibility

# Run with coverage
npm test -- --coverage --testPathPattern=accessibility

# Run in watch mode
npm test -- --watch --testPathPattern=accessibility
```

### Test Coverage Areas

- **Navigation Components**: ARIA landmarks, mobile menu functionality
- **Form Components**: Label associations, error handling, validation
- **Interactive Elements**: Button states, focus management
- **Content Structure**: Semantic HTML, heading hierarchy
- **Loading States**: ARIA live regions, status announcements

## Manual Testing Procedures

### 1. Keyboard Navigation Testing

#### Test Steps:
1. **Tab Navigation**
   - Use only the Tab key to navigate through the application
   - Verify logical tab order (left to right, top to bottom)
   - Check that all interactive elements are reachable
   - Ensure focus indicators are clearly visible

2. **Arrow Key Navigation**
   - Test arrow keys in lists, grids, and menus
   - Verify proper navigation within grouped elements
   - Check that arrow keys don't interfere with page scrolling

3. **Enter and Space Key Activation**
   - Test that Enter and Space keys activate buttons and links
   - Verify consistent behavior across all interactive elements

4. **Escape Key Functionality**
   - Test that Escape closes modals, dropdowns, and mobile menus
   - Verify focus returns to triggering element

#### Expected Results:
- All interactive elements are accessible via keyboard
- Focus indicators are clearly visible (2px solid outline)
- Tab order follows logical reading flow
- No keyboard traps exist

### 2. Screen Reader Testing

#### Test with NVDA (Windows)
1. Download and install NVDA from https://www.nvaccess.org/
2. Navigate through the application using screen reader commands
3. Verify that all content is announced properly
4. Test form interactions and error messages

#### Test with JAWS (Windows)
1. Use JAWS to navigate the application
2. Test landmark navigation (D key for landmarks)
3. Verify heading navigation (H key for headings)
4. Test form field navigation (F key for forms)

#### Test with VoiceOver (macOS)
1. Enable VoiceOver (Cmd + F5)
2. Use VoiceOver navigation commands
3. Test rotor navigation for different element types
4. Verify gesture navigation on touch devices

#### Expected Results:
- All content is announced clearly
- Form labels are properly associated
- Error messages are announced immediately
- Navigation landmarks are identified
- Heading structure is logical

### 3. Color and Contrast Testing

#### Test Tools:
- **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Colour Contrast Analyser**: https://www.tpgi.com/color-contrast-checker/
- **axe DevTools**: Browser extension for automated testing

#### Test Steps:
1. Check all text against background colors
2. Verify minimum 4.5:1 contrast ratio for normal text
3. Verify minimum 3:1 contrast ratio for large text
4. Test with color blindness simulators
5. Ensure information isn't conveyed by color alone

#### Expected Results:
- All text meets WCAG AA contrast requirements
- Information is accessible without color
- Interactive states are distinguishable

### 4. Mobile Accessibility Testing

#### Test Devices:
- iOS devices with VoiceOver
- Android devices with TalkBack
- Various screen sizes (320px to 1920px)

#### Test Steps:
1. **Touch Target Size**
   - Verify minimum 44x44px touch targets
   - Test with different finger sizes
   - Ensure adequate spacing between targets

2. **Gesture Navigation**
   - Test swipe gestures for navigation
   - Verify pinch-to-zoom functionality
   - Test double-tap to activate

3. **Orientation Changes**
   - Test landscape and portrait orientations
   - Verify content remains accessible
   - Check that focus is maintained

#### Expected Results:
- All touch targets meet minimum size requirements
- Gestures work consistently
- Content adapts to orientation changes
- Screen reader navigation works on mobile

## Screen Reader Testing

### Common Screen Reader Commands

#### NVDA Commands:
- **Tab**: Navigate to next element
- **Shift + Tab**: Navigate to previous element
- **Enter/Space**: Activate element
- **D**: Navigate to next landmark
- **H**: Navigate to next heading
- **F**: Navigate to next form field
- **Ctrl + Home**: Go to top of page

#### VoiceOver Commands:
- **Ctrl + Option + Right Arrow**: Next element
- **Ctrl + Option + Left Arrow**: Previous element
- **Ctrl + Option + Space**: Activate element
- **Ctrl + Option + U**: Open rotor
- **Ctrl + Option + H**: Navigate headings
- **Ctrl + Option + L**: Navigate landmarks

### Testing Scenarios

#### 1. Page Load
- Verify page title is announced
- Check that main content is identified
- Ensure navigation landmarks are present

#### 2. Form Interaction
- Test label announcements
- Verify error message announcements
- Check required field indicators
- Test form submission feedback

#### 3. Dynamic Content
- Test loading state announcements
- Verify error state announcements
- Check success message announcements
- Test content updates

## Keyboard Navigation Testing

### Navigation Patterns

#### 1. Linear Navigation
- Tab through all interactive elements
- Verify logical order
- Check focus indicators

#### 2. Composite Widgets
- Test arrow key navigation in menus
- Verify Home/End key functionality
- Check Escape key behavior

#### 3. Modal Dialogs
- Test focus trapping
- Verify Escape key closes modal
- Check focus return to trigger

### Common Issues to Check

1. **Focus Traps**: Ensure no keyboard traps exist
2. **Skip Links**: Verify skip links work properly
3. **Focus Indicators**: Check visibility of focus states
4. **Tab Order**: Verify logical navigation order

## Testing Checklist

### Pre-Release Accessibility Checklist

#### ✅ Navigation
- [ ] Main navigation has proper landmarks
- [ ] Mobile menu is keyboard accessible
- [ ] Skip links are present and functional
- [ ] Breadcrumbs are properly structured

#### ✅ Forms
- [ ] All form fields have associated labels
- [ ] Error messages are properly announced
- [ ] Required fields are clearly indicated
- [ ] Form validation provides clear feedback

#### ✅ Content
- [ ] Heading hierarchy is logical (h1 → h2 → h3)
- [ ] Images have appropriate alt text
- [ ] Links have descriptive text
- [ ] Tables have proper headers

#### ✅ Interactive Elements
- [ ] Buttons have descriptive labels
- [ ] Focus indicators are visible
- [ ] Loading states are announced
- [ ] Error states are properly handled

#### ✅ Color and Contrast
- [ ] Text meets contrast requirements
- [ ] Information isn't color-dependent
- [ ] Interactive states are distinguishable
- [ ] Color blindness considerations

#### ✅ Mobile
- [ ] Touch targets meet size requirements
- [ ] Gestures work consistently
- [ ] Orientation changes work properly
- [ ] Screen reader navigation works

### Testing Tools

#### Browser Extensions:
- **axe DevTools**: Automated accessibility testing
- **WAVE**: Web accessibility evaluation
- **Lighthouse**: Performance and accessibility audit
- **ColorZilla**: Color contrast checking

#### Desktop Applications:
- **Colour Contrast Analyser**: Detailed contrast analysis
- **NVDA**: Free screen reader for Windows
- **JAWS**: Professional screen reader
- **VoiceOver**: Built-in macOS screen reader

#### Online Tools:
- **WebAIM Contrast Checker**: Color contrast validation
- **WAVE Web Accessibility Evaluator**: Online accessibility testing
- **axe-core**: Open source accessibility testing engine

## Reporting Issues

### Issue Template

```
**Accessibility Issue Report**

**Component**: [Component name]
**Page**: [URL or page name]
**Issue Type**: [WCAG Guideline violation]
**Severity**: [Critical/High/Medium/Low]
**User Impact**: [Description of impact on users]

**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Behavior**: [What should happen]
**Actual Behavior**: [What actually happens]
**Screenshots**: [If applicable]

**Testing Environment**:
- Browser: [Browser and version]
- Screen Reader: [Screen reader and version]
- OS: [Operating system]
- Device: [Desktop/Mobile/Tablet]
```

### Priority Levels

- **Critical**: Blocks core functionality for users with disabilities
- **High**: Significantly impacts user experience
- **Medium**: Minor impact but should be addressed
- **Low**: Enhancement or optimization opportunity

## Continuous Integration

### Automated Testing in CI/CD

```yaml
# Example GitHub Actions workflow
name: Accessibility Tests
on: [push, pull_request]

jobs:
  accessibility:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm ci
      - name: Run accessibility tests
        run: npm test -- --testPathPattern=accessibility
      - name: Run Lighthouse CI
        run: npm run lighthouse:ci
```

### Monitoring

- Set up automated accessibility monitoring
- Include accessibility metrics in performance dashboards
- Regular accessibility audits (monthly/quarterly)
- User feedback collection from accessibility community

## Resources

### Documentation
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Resources](https://webaim.org/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

### Tools
- [axe-core](https://github.com/dequelabs/axe-core)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WAVE](https://wave.webaim.org/)

### Community
- [WebAIM Mailing List](https://webaim.org/discussion/)
- [A11y Slack Community](https://web-a11y.slack.com/)
- [Accessibility Twitter](https://twitter.com/hashtag/a11y)

---

*This guide should be updated regularly as new accessibility standards and tools become available.*

