# 🧪 Testing Infrastructure - BlendTools

## 🎯 **Overview**

BlendTools has a comprehensive testing infrastructure with multiple layers of testing to ensure code quality, functionality, and user experience.

## 🏗️ **Testing Stack**

### **Core Testing Framework**
- **Vitest** - Fast unit test runner with TypeScript support
- **React Testing Library** - Component testing utilities
- **jsdom** - DOM environment for testing
- **Playwright** - End-to-end testing framework

### **Testing Types**
1. **Unit Tests** - Individual functions and components
2. **Integration Tests** - Feature workflows and user interactions
3. **Component Tests** - React component behavior and rendering
4. **End-to-End Tests** - Full application workflows

---

## 🚀 **Getting Started**

### **Installation**
All testing dependencies are already installed. Run tests with:

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

### **Test Structure**
```
src/
├── __tests__/              # Integration tests
│   └── integration/
├── components/
│   └── __tests__/          # Component tests
├── stores/
│   └── __tests__/          # Store tests
├── test/                   # Test utilities
│   ├── setup.ts           # Test environment setup
│   ├── utils.tsx          # Testing utilities
│   └── types.ts           # Test-specific types
└── ...

e2e/                        # End-to-end tests
├── app.spec.ts
└── render-queue.spec.ts
```

---

## 🧩 **Test Categories**

### **1. Unit Tests**

#### **Store Tests**
- **Location**: `src/stores/__tests__/`
- **Coverage**: Zustand store logic, state management, API interactions
- **Examples**:
  - `authStore.test.ts` - Authentication state management
  - `renderJobsStore.test.ts` - Render queue operations
  - `scriptsStore.test.ts` - Script management and filtering

```typescript
// Example store test
describe('AuthStore', () => {
  it('should handle successful sign in', async () => {
    const { signIn } = useAuthStore.getState()
    const result = await signIn('test@example.com', 'password123')
    
    expect(result.success).toBe(true)
    expect(useAuthStore.getState().user).toEqual(mockUser)
  })
})
```

#### **Component Tests**
- **Location**: `src/components/*/__tests__/`
- **Coverage**: Component rendering, user interactions, prop handling
- **Examples**:
  - `button.test.tsx` - Button component variants and behavior
  - `badge.test.tsx` - Badge component styling and content
  - `RenderQueueWidget.test.tsx` - Widget functionality and data display

```typescript
// Example component test
describe('Button', () => {
  it('should handle click events', async () => {
    const handleClick = vi.fn()
    const user = userEvent.setup()
    
    render(<Button onClick={handleClick}>Click me</Button>)
    
    await user.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### **2. Integration Tests**

#### **Authentication Flow**
- **Location**: `src/__tests__/integration/auth.test.tsx`
- **Coverage**: Complete authentication workflows
- **Scenarios**:
  - Sign up flow with validation
  - Sign in with credentials
  - OAuth authentication
  - Error handling and loading states

```typescript
// Example integration test
describe('Authentication Integration', () => {
  it('should handle complete sign up flow', async () => {
    const user = userEvent.setup()
    render(<AuthComponent />)
    
    // Navigate to sign up
    await user.click(screen.getByRole('tab', { name: /sign up/i }))
    
    // Fill form and submit
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /sign up/i }))
    
    expect(mockAuthStore.signUp).toHaveBeenCalled()
  })
})
```

### **3. End-to-End Tests**

#### **Application Flow**
- **Location**: `e2e/app.spec.ts`
- **Coverage**: Basic application functionality and navigation

#### **Render Queue E2E**
- **Location**: `e2e/render-queue.spec.ts`
- **Coverage**: Complete render queue workflows

```typescript
// Example E2E test
test('should navigate to render queue from dashboard widget', async ({ page }) => {
  await page.goto('/')
  
  const renderQueueWidget = page.locator('text=Render Queue').first()
  await expect(renderQueueWidget).toBeVisible()
  
  await page.getByRole('button', { name: /view all/i }).click()
  await expect(page.url()).toContain('/render-queue')
})
```

---

## 🛠️ **Testing Utilities**

### **Custom Render Function**
- **Location**: `src/test/utils.tsx`
- **Purpose**: Wraps components with necessary providers

```typescript
import { render } from '../test/utils'

// Automatically includes Router, Theme Provider, etc.
render(<MyComponent />)
```

### **Mock Factories**
- `createMockUser()` - Generate test user data
- `createMockScript()` - Generate test script data
- `createMockProject()` - Generate test project data
- `createMockRenderJob()` - Generate test render job data

### **Supabase Mocking**
- **Location**: `src/test/utils.tsx`
- **Purpose**: Mock Supabase client for testing

```typescript
// Automatic Supabase mocking
const mockSupabaseClient = {
  auth: {
    signIn: vi.fn().mockResolvedValue({ data: { user: mockUser } })
  }
}
```

---

## 📊 **Coverage and Reporting**

### **Coverage Reports**
```bash
# Generate coverage report
npm run test:coverage

# Coverage files generated:
coverage/
├── index.html          # HTML report
├── lcov.info          # LCOV format
└── coverage-final.json # JSON format
```

### **Coverage Targets**
- **Overall**: 80%+ line coverage
- **Critical paths**: 90%+ coverage
- **UI Components**: 85%+ coverage
- **Store logic**: 95%+ coverage

### **Playwright Reports**
```bash
# Generate E2E test report
npm run test:e2e

# Report generated at:
playwright-report/index.html
```

---

## 🔧 **Configuration**

### **Vitest Configuration**
- **File**: `vite.config.ts`
- **Environment**: jsdom
- **Setup**: `src/test/setup.ts`
- **Coverage**: Istanbul

### **Playwright Configuration**
- **File**: `playwright.config.ts`
- **Browsers**: Chromium, Firefox, WebKit
- **Base URL**: `http://localhost:5175`
- **Parallel execution**: Enabled

### **Test Environment Variables**
```typescript
// Automatically mocked in tests
process.env.VITE_SUPABASE_URL = 'https://test.supabase.co'
process.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key'
```

---

## 🏃‍♂️ **Running Tests**

### **Development Workflow**
```bash
# Watch mode for active development
npm run test:watch

# UI mode for interactive testing
npm run test:ui

# Run specific test file
npx vitest run src/stores/__tests__/authStore.test.ts

# Run tests matching pattern
npx vitest run --grep "authentication"
```

### **Pre-commit Testing**
```bash
# Runs automatically before commits
npm run test:run

# Manual pre-push check
npm run test:coverage && npm run test:e2e
```

### **CI/CD Pipeline**
- **Trigger**: Push to main/develop branches
- **Steps**: 
  1. Lint code
  2. Type checking
  3. Unit tests with coverage
  4. Build application
  5. E2E tests
  6. Upload reports

---

## 🎯 **Best Practices**

### **Writing Tests**
1. **Arrange-Act-Assert** pattern
2. **Descriptive test names**
3. **Test behavior, not implementation**
4. **Mock external dependencies**
5. **Clean up after tests**

### **Test Organization**
1. **Group related tests** with `describe`
2. **Use beforeEach** for setup
3. **Keep tests isolated**
4. **Test edge cases**
5. **Document complex scenarios**

### **Performance**
1. **Use vi.mock()** for expensive operations
2. **Limit DOM queries**
3. **Clean up timers and subscriptions**
4. **Parallel test execution**

---

## 🐛 **Debugging Tests**

### **Vitest Debugging**
```bash
# Debug specific test
npx vitest run --no-coverage src/stores/__tests__/authStore.test.ts

# Debug with browser tools
npm run test:ui
```

### **Playwright Debugging**
```bash
# Debug E2E tests
npm run test:e2e:debug

# Run with headed browser
npm run test:e2e:headed

# Use Playwright Inspector
npx playwright test --debug
```

### **Common Issues**
1. **Mock not working**: Check mock placement and imports
2. **Async test failures**: Use proper `await` statements
3. **DOM not updating**: Use `waitFor` for async operations
4. **Test isolation**: Reset mocks in `beforeEach`

---

## 📈 **Continuous Improvement**

### **Monitoring**
- **Coverage trends** via CI reports
- **Test execution time** monitoring
- **Flaky test** identification
- **Performance bottlenecks**

### **Adding New Tests**
1. **Identify untested code** from coverage reports
2. **Add tests for new features**
3. **Update tests when refactoring**
4. **Remove obsolete tests**

---

## ✅ **Test Checklist**

### **Before Committing**
- [ ] All tests pass locally
- [ ] Coverage meets minimum thresholds
- [ ] No console errors in tests
- [ ] New features have tests
- [ ] Existing tests updated if needed

### **Before Deploying**
- [ ] CI pipeline passes
- [ ] E2E tests pass in all browsers
- [ ] No critical test failures
- [ ] Coverage reports reviewed
- [ ] Performance regression checked

---

The testing infrastructure is designed to catch issues early, ensure code quality, and provide confidence in deployments. All tests are automated and integrated into the development workflow for maximum effectiveness! 🚀