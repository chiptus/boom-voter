# Testing Setup for Boom Voter

> For step-by-step E2E test instructions, test data, commands, coverage, debugging, troubleshooting, and next steps, see [tests/README.md](../tests/README.md).

## 🎯 What We've Added

### 1. **Playwright E2E Testing**

- **Framework**: Playwright for end-to-end testing
- **Browsers**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari
- **Features**: Screenshots, videos, traces, parallel execution
- **Configuration**: `playwright.config.ts`
- **How to run E2E tests, setup test data, and available commands:** See [tests/README.md](../tests/README.md)

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

## 🚀 Getting Started

For E2E test setup, test data, and available commands, see [tests/README.md](../tests/README.md).

## 🧪 Available Commands

See [tests/README.md](../tests/README.md) for all E2E test commands and usage.

## 🔧 Configuration

For E2E environment variables and test data details, see [tests/README.md](../tests/README.md).

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

For local Supabase usage in E2E, see [tests/README.md](../tests/README.md).

## 📚 Resources

- [Supabase Local Development](https://supabase.com/docs/guides/cli/local-development)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
