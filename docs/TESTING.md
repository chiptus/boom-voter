# Testing Setup for Boom Voter

This document outlines the complete testing infrastructure we've set up for the Boom Voter application.

## 🎯 What We've Added

### 1. **Playwright E2E Testing**
- **Framework**: Playwright for end-to-end testing
- **Browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Features**: Screenshots, videos, traces, parallel execution
- **Configuration**: `playwright.config.ts`

### 2. **Local Supabase Testing Environment**
- **Local Database**: Supabase running on Docker
- **Test Data**: Automated setup with sample artists, genres, groups
- **Isolation**: Separate from production environment
- **Scripts**: Easy setup and teardown

### 3. **Test Infrastructure**
- **Test Helpers**: Common utilities for authentication, navigation, etc.
- **Test Data**: Consistent test scenarios
- **Environment Config**: Flexible configuration for different environments
- **CI/CD Integration**: GitHub Actions workflow

## 📁 New Files Created

```
├── playwright.config.ts           # Playwright configuration
├── tests/
│   ├── e2e/                       # E2E test files
│   │   ├── auth.spec.ts           # Authentication tests
│   │   ├── navigation.spec.ts     # Navigation tests
│   │   └── artists.spec.ts        # Artist functionality tests
│   ├── config/
│   │   └── test-env.ts            # Test environment configuration
│   ├── utils/
│   │   └── test-helpers.ts        # Common test utilities
│   ├── screenshots/               # Test screenshots directory
│   └── README.md                  # Testing documentation
├── scripts/
│   ├── setup-test-env.sh          # Local Supabase setup script
│   └── setup-test-data.ts         # Test data population script
├── .github/workflows/
│   └── e2e-tests.yml              # CI/CD workflow
└── docs/
    └── TESTING.md                 # This file
```

## 🚀 Getting Started

### Prerequisites
1. **Node.js 18+**
2. **Docker** (for local Supabase)
3. **Supabase CLI**: `npm install -g supabase`

### Quick Setup
```bash
# Install dependencies
npm install

# Setup local Supabase
npm run test:setup

# Populate test data
npm run test:data

# Run tests
npm run test:e2e
```

## 🧪 Available Commands

| Command | Description |
|---------|-------------|
| `npm run test:e2e` | Run all tests (headless) |
| `npm run test:e2e:ui` | Run tests with Playwright UI |
| `npm run test:e2e:headed` | Run tests with visible browser |
| `npm run test:e2e:debug` | Run tests in debug mode |
| `npm run test:e2e:report` | Open test report |
| `npm run test:setup` | Setup local Supabase |
| `npm run test:data` | Setup test data |

## 🔧 Configuration

### Environment Variables
- `TEST_SUPABASE_URL`: Local Supabase URL
- `TEST_SUPABASE_ANON_KEY`: Local Supabase anon key
- `PLAYWRIGHT_BASE_URL`: App base URL
- `TEST_USER_EMAIL`: Test user email
- `TEST_USER_PASSWORD`: Test user password

### Test Data
The setup creates:
- **3 test artists** with different genres and schedules
- **5 test genres** (Rock, Pop, Jazz, Electronic, Hip Hop)
- **3 test groups**
- **2 test users** (regular + admin)

## 🎯 Test Coverage

### Current Tests
1. **Authentication**
   - Sign in dialog display
   - Page title verification

2. **Navigation**
   - Page routing
   - 404 handling

3. **Artists**
   - Artists list display
   - Filtering functionality
   - Artist detail navigation
   - Empty state handling

### Planned Tests
- User registration
- Voting functionality
- Group management
- Schedule viewing
- Admin features
- Mobile responsiveness
- Offline functionality

## 🔄 CI/CD Integration

### GitHub Actions Workflow
- **Triggers**: Push to main/develop, PRs
- **Parallel Execution**: 4 shards for faster runs
- **Artifacts**: Test reports, screenshots, videos
- **Environment**: Local Supabase in CI

### Workflow Steps
1. Setup Node.js and dependencies
2. Install Playwright browsers
3. Start local Supabase
4. Populate test data
5. Build application
6. Run tests in parallel
7. Generate and upload reports

## 🗄️ Local Supabase

### Access Points
- **API**: http://localhost:54321
- **Studio**: http://localhost:54323
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Management
```bash
# Start
supabase start

# Stop
supabase stop

# Status
supabase status

# Logs
supabase logs
```

## 📊 Test Reports

### HTML Report
After running tests, view the interactive report:
```bash
npm run test:e2e:report
```

### Report Features
- Test results and timing
- Screenshots and videos
- Traces for debugging
- Error details and stack traces
- Filtering and search

## 🐛 Debugging

### Debug Mode
```bash
npm run test:e2e:debug
```

### UI Mode
```bash
npm run test:e2e:ui
```

### Screenshots
Tests automatically capture screenshots on failure in `tests/screenshots/`

## 🔮 Next Steps

### Immediate
1. **Run initial tests** to verify setup
2. **Add more test scenarios** based on app features
3. **Configure test users** in local Supabase
4. **Add data-testid attributes** to components

### Future Enhancements
1. **Visual regression testing**
2. **Performance testing**
3. **Accessibility testing**
4. **API testing** with separate test suite
5. **Load testing** for critical user flows

## 🚨 Troubleshooting

### Common Issues
1. **Supabase not starting**: Check Docker is running
2. **Tests timing out**: Increase timeouts in config
3. **Element not found**: Update selectors to match UI
4. **Authentication failing**: Verify test user setup

### Getting Help
1. Check Playwright docs: https://playwright.dev/
2. Review test logs and screenshots
3. Use debug mode for step-by-step debugging
4. Check Supabase logs: `supabase logs`

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Supabase Local Development](https://supabase.com/docs/guides/cli/local-development)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Testing Best Practices](https://playwright.dev/docs/best-practices) 