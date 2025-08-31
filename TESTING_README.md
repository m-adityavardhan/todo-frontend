# Frontend Testing Guide


## 🚀 Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode (development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode (no watch, with coverage)
npm run test:ci
```

### Test Scripts

- `test` - Run all tests once
- `test:watch` - Run tests in watch mode for development
- `test:coverage` - Generate coverage report
- `test:ci` - Run tests for continuous integration



## 📝 Writing Tests

### Component Testing

```typescript
import React from 'react'
import { render, screen } from '../utils/test-utils'
import userEvent from '@testing-library/user-event'
import MyComponent from '../../components/MyComponent'

describe('MyComponent', () => {
  const defaultProps = {
    // Define default props
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly', () => {
    render(<MyComponent {...defaultProps} />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })

  it('handles user interactions', async () => {
    const user = userEvent.setup()
    const mockHandler = jest.fn()
    
    render(<MyComponent {...defaultProps} onAction={mockHandler} />)
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(mockHandler).toHaveBeenCalled()
  })
})
```

### API Testing

```typescript
import { apiClient } from '../../lib/api'

// Mock external dependencies
jest.mock('axios')
const mockAxios = require('axios')

describe('ApiClient', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('makes successful API calls', async () => {
    const mockResponse = { status: 200, data: [] }
    mockAxios.mockResolvedValue(mockResponse)

    const result = await apiClient.getTasks()
    expect(result).toEqual([])
  })
})
```

### Mocking Guidelines

1. **Mock External Dependencies**: Always mock API calls, router functions, etc.
2. **Use Real Components**: Test actual component behavior, not implementation details
3. **Test User Behavior**: Focus on what users see and do, not internal state
4. **Clean Mocks**: Clear mocks between tests to avoid interference

## 🔧 Test Configuration

### Jest Configuration (`jest.config.js`)

- **Environment**: jsdom for DOM testing
- **Setup**: jest.setup.js for global test configuration
- **Coverage**: Configured for components, lib, and app directories
- **Next.js**: Integrated with Next.js for proper module resolution

### Test Setup (`jest.setup.js`)

- **jest-dom**: Custom matchers for DOM assertions
- **Router Mocking**: Next.js navigation mocks
- **Image Mocking**: Next.js Image component mocks
- **Console Mocking**: Optional console output suppression

### TypeScript Configuration (`tsconfig.test.json`)

- **Jest Types**: Includes Jest and Node.js type definitions
- **JSX Support**: React JSX transformation
- **Test Files**: Includes test directory in compilation

## 📊 Test Examples

### Component Rendering Test

```typescript
it('renders with correct styling classes', () => {
  const { container } = render(<MyComponent />)
  
  const wrapper = container.firstChild as HTMLElement
  expect(wrapper).toHaveClass('expected-class')
})
```

### User Interaction Test

```typescript
it('calls callback when button is clicked', async () => {
  const user = userEvent.setup()
  const mockCallback = jest.fn()
  
  render(<MyComponent onAction={mockCallback} />)
  
  const button = screen.getByRole('button')
  await user.click(button)
  
  expect(mockCallback).toHaveBeenCalledTimes(1)
})
```

### Async Operation Test

```typescript
it('loads data and displays it', async () => {
  const mockData = [{ id: 1, name: 'Test' }]
  mockApi.getData.mockResolvedValue(mockData)
  
  render(<MyComponent />)
  
  await waitFor(() => {
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
```

### Error Handling Test

```typescript
it('displays error message when API fails', async () => {
  mockApi.getData.mockRejectedValue(new Error('API Error'))
  
  render(<MyComponent />)
  
  await waitFor(() => {
    expect(screen.getByText('Error occurred')).toBeInTheDocument()
  })
})
```

## 🐛 Debugging Tests

### Common Issues

1. **Async Operations**: Use `waitFor` for asynchronous operations
2. **Mock Clearing**: Ensure mocks are cleared between tests
3. **Component Rendering**: Check if components are properly mocked
4. **Type Errors**: Verify TypeScript configuration for tests

### Debug Commands

```bash
# Run specific test file
npm test -- TaskCard.test.tsx

# Run tests with verbose output
npm test -- --verbose

# Run tests matching pattern
npm test -- --testNamePattern="renders correctly"
```

## 📈 Coverage Reports

After running `npm run test:coverage`, you'll get:

- **HTML Report**: Detailed coverage in `coverage/lcov-report/index.html`
- **Console Summary**: Coverage percentages in terminal output
- **LCOV File**: Coverage data for CI/CD integration

## 🚀 CI/CD Integration

The `test:ci` script is designed for continuous integration:

- **No Watch Mode**: Runs tests once and exits
- **Coverage Report**: Generates coverage data
- **Exit Codes**: Proper exit codes for CI pipeline success/failure

## 📚 Best Practices

1. **Test Behavior, Not Implementation**: Focus on what users experience
2. **Use Semantic Queries**: Prefer `getByRole`, `getByLabelText` over `getByTestId`
3. **Test Accessibility**: Ensure components are accessible
4. **Mock External Dependencies**: Don't test third-party libraries
5. **Clean Test Data**: Use fresh data for each test
6. **Descriptive Test Names**: Make test names clear and descriptive

## 🔍 Testing Utilities

### Custom Render Function

```typescript
// tests/utils/test-utils.tsx
const customRender = (ui: ReactElement, options?: RenderOptions) => 
  render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
```

### Mock Data

```typescript
// tests/mocks/mockData.ts
export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Test Task',
    color: 'blue',
    completed: false,
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  }
]
```

## 🎉 Conclusion

This testing setup provides:

- **Comprehensive Coverage**: Tests for all major components and functionality
- **Realistic Testing**: Tests that mirror real user interactions
- **Maintainable Tests**: Clean, readable test code
- **CI/CD Ready**: Proper configuration for continuous integration
- **Type Safety**: Full TypeScript support for tests


