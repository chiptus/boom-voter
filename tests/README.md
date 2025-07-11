# E2E Testing with Playwright

This directory contains end-to-end tests for the Boom Voter application using Playwright.

## 🚀 Quick Start

### Prerequisites

1. **Node.js 18+** installed
2. **Supabase CLI** installed globally:
   ```bash
   npm install -g supabase
   ```

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Setup local Supabase test environment:**
   ```bash
   npm run test:setup
   ```

3. **Setup test data:**
   ```bash
   npm run test:data
   ```

4. **Run tests:**
   ```bash
   npm run test:e2e
   ```

## 📁 Directory Structure

```
tests/
├── e2e/                    # E2E test files
│   ├── auth.spec.ts       # Authentication tests
│   ├── navigation.spec.ts # Navigation tests
│   └── artists.spec.ts    # Artist functionality tests
├── config/
│   └── test-env.ts        # Test environment configuration
├── utils/
│   └── test-helpers.ts    # Common test utilities
└── README.md              # This file
```

## 🧪 Available Test Commands

| Command | Description |
|---------|-------------|
| `npm run test:e2e` | Run all tests in headless mode |
| `npm run test:e2e:ui` | Run tests with Playwright UI |
| `npm run test:e2e:headed` | Run tests in headed mode (visible browser) |
| `npm run test:e2e:debug` | Run tests in debug mode |
| `npm run test:e2e:report` | Open test report |
| `npm run test:setup` | Setup local Supabase environment |
| `npm run test:data` | Setup test data in local Supabase |

## 🔧 Configuration

### Environment Variables

The tests use the following environment variables:

- `TEST_SUPABASE_URL`: Local Supabase URL (default: `http://localhost:54321`)
- `TEST_SUPABASE_ANON_KEY`: Local Supabase anon key
- `PLAYWRIGHT_BASE_URL`: App base URL (default: `http://localhost:5173`)
- `TEST_USER_EMAIL`: Test user email (default: `test@example.com`)
- `TEST_USER_PASSWORD`: Test user password (default: `testpassword123`)

### Test Data

The test data setup script creates:

- **Artists**: 3 test artists with different genres and schedules
- **Genres**: 5 test genres (Rock, Pop, Jazz, Electronic, Hip Hop)
- **Groups**: 3 test groups
- **Users**: 2 test users (regular user and admin)

## 🎯 Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';
import { TestHelpers } from '../utils/test-helpers';

test.describe('Feature Name', () => {
  let testHelpers: TestHelpers;

  test.beforeEach(async ({ page }) => {
    testHelpers = new TestHelpers(page);
  });

  test('should do something', async ({ page }) => {
    await testHelpers.navigateTo('/');
    // Your test logic here
  });
});
```

### Using Test Helpers

The `TestHelpers` class provides common utilities:

```typescript
// Sign in
await testHelpers.signIn('user@example.com', 'password');

// Navigate to page
await testHelpers.navigateTo('/artists');

// Wait for page load
await testHelpers.waitForPageLoad();

// Check authentication status
const isAuth = await testHelpers.isAuthenticated();

// Take screenshot
await testHelpers.takeScreenshot('test-name');
```

### Best Practices

1. **Use semantic selectors**: Prefer `getByRole`, `getByLabel`, `getByText` over CSS selectors
2. **Handle async operations**: Always wait for network requests and UI updates
3. **Test user flows**: Focus on complete user journeys rather than isolated components
4. **Use test data**: Leverage the test data setup for consistent scenarios
5. **Handle conditional elements**: Use `.isVisible()` checks for optional UI elements

## 🐛 Debugging

### Debug Mode

Run tests in debug mode to step through them:

```bash
npm run test:e2e:debug
```

### UI Mode

Use Playwright's UI for interactive debugging:

```bash
npm run test:e2e:ui
```

### Screenshots and Videos

Tests automatically capture:
- Screenshots on failure
- Videos on failure
- Traces on retry

View them in the `playwright-report/` directory after running tests.

## 🔄 CI/CD Integration

The tests are configured to run in GitHub Actions on:
- Push to `main` and `develop` branches
- Pull requests to `main` and `develop` branches

The CI pipeline:
1. Sets up local Supabase
2. Populates test data
3. Runs tests in parallel (sharded)
4. Generates and uploads test reports

## 🗄️ Local Supabase

### Starting Local Supabase

```bash
supabase start
```

### Stopping Local Supabase

```bash
supabase stop
```

### Accessing Local Supabase

- **API URL**: http://localhost:54321
- **Studio URL**: http://localhost:54323
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0`

### Database Schema

The local Supabase instance uses the same schema as your production database, defined in `supabase/migrations/`.

## 📊 Test Reports

After running tests, view the HTML report:

```bash
npm run test:e2e:report
```

The report includes:
- Test results and timing
- Screenshots and videos
- Traces for debugging
- Error details and stack traces

## 🚨 Troubleshooting

### Common Issues

1. **Supabase not starting**: Ensure Docker is running
2. **Tests timing out**: Increase timeouts in `playwright.config.ts`
3. **Element not found**: Check if selectors match the current UI
4. **Authentication failing**: Verify test user credentials in Supabase

### Getting Help

1. Check the Playwright documentation: https://playwright.dev/
2. Review test logs and screenshots
3. Use debug mode to step through failing tests
4. Check Supabase logs: `supabase logs` 