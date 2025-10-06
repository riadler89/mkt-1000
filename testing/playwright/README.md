# @scayle/storefront-application-playwright

A comprehensive end-to-end testing suite for the SCAYLE Storefront Application using Playwright. This package provides browser automation and user journey validation capabilities to ensure the Storefront delivers an excellent user experience across all devices and browsers.

## Overview

The Playwright E2E testing suite provides comprehensive browser automation and user journey validation for SCAYLE Storefront Applications, including:

- **Cross-browser Testing**: Full compatibility testing across Chromium, Firefox, and WebKit
- **Mobile Web Testing**: Native mobile emulation for Android Chrome and iOS Safari
- **Page Object Model**: Maintainable and reusable test components
- **Comprehensive Coverage**: Complete user journey testing from homepage to checkout

## Key Features

- **Cross-browser Support**: Test on all modern rendering engines with a single API
- **Cross-platform Testing**: Run tests on Windows, Linux, or macOS, locally or on CI
- **Mobile Web Emulation**: Native mobile device testing capabilities
- **Page Object Model**: Reusable components for maintainable test code
- **CI/CD Integration**: Designed for seamless integration with continuous integration pipelines

## Test Categories

### E2E Tests

Complete user journeys covering all critical storefront functionality:

- **Account Management**: User registration, login, profile management
- **Product Browsing**: Category navigation, product listing, search functionality
- **Shopping Experience**: Product details, add to cart, wishlist operations
- **Checkout Process**: Complete order flow from cart to confirmation
- **Order Management**: Order history, order details, returns
- **Navigation**: Header, footer, breadcrumbs, mobile navigation
- **Promotions**: Banner displays, promotional content, special offers

### Happy Path Tests

Critical user flows validation:

- **Complete Purchase Journey**: From product discovery to order confirmation
- **User Registration and Login**: Account creation and authentication flows
- **Search and Discovery**: Product search and category navigation

## Test Scenarios

The Playwright suite includes comprehensive test scenarios covering:

- **User Authentication**: Login, registration, password reset, account management
- **Product Discovery**: Search, filtering, category browsing, product recommendations
- **Shopping Cart**: Add/remove items, quantity updates, cart persistence
- **Checkout Process**: Address management, payment processing, order confirmation
- **Order Management**: Order history, order details, tracking information
- **Navigation**: Main navigation, mobile menu, breadcrumbs, footer links
- **Country Detection**: Automatic country selection and shop switching
- **Promotions**: Banner displays, promotional offers, special pricing
- **Wishlist**: Add/remove items, wishlist management, sharing functionality

## Installation

The Playwright testing suite requires manual installation to avoid polluting the root dependencies and lock file.

```bash
# Install dependencies
pnpm install

# Install Playwright browsers
pnpm exec playwright install
```

## Test Structure

The Playwright E2E testing suite follows a modular architecture:

**Page Objects:**

- `page-objects/` - Reusable UI components following the Page Object Model pattern
- `page-objects/base/` - Base page classes and common functionality
- `page-objects/components/` - Individual UI component page objects

**Test Files:**

- `tests/e2e/` - End-to-end test specifications
- `tests/happy-path.e2e.spec.ts` - Critical user flow validation

**Support Files:**

- `fixtures/` - Test data and shared utilities
- `support/` - Helper functions, constants, and utilities

**Configuration:**

- `playwright.config.ts` - Playwright configuration and test settings
- `tsconfig.json` - TypeScript configuration for tests

## Running Tests

### Prerequisites

Before running Playwright tests, ensure you have:

1. **Environment Configuration**: Set up your `.env` file with the required variables (see main testing README for details)
2. **Test Environment**: Ensure your storefront application is running and accessible
3. **Dependencies**: Install all required dependencies and Playwright browsers

### Test Execution

```bash
# Navigate to playwright directory
cd playwright

# Run all E2E tests
pnpm test:e2e

# Run specific test categories
pnpm test:e2e:happy-path

# Run tests with UI mode
pnpm test:e2e:ui
```

### Test Categories

**E2E Tests:**

- Complete user journey validation
- Cross-browser compatibility testing
- Mobile web testing
- Component interaction testing

**Happy Path Tests:**

- Critical user flow validation
- End-to-end purchase journey testing
- Authentication flow testing

### Debug and Development

```bash
# Run tests in headed mode (visible browser)
pnpm test:e2e --headed

# Run specific test file
pnpm test:e2e tests/e2e/account.e2e.spec.ts

# Run tests in debug mode
pnpm test:e2e --debug

# Generate test report
pnpm test:e2e --reporter=html
```

## Page Object Model

The Playwright suite uses the Page Object Model pattern for maintainable and reusable test code:

**Base Classes:**

- `BasePage` - Common functionality and utilities
- `BaseComponent` - Reusable component interactions

**Page Objects:**

- `HomePage` - Homepage interactions and elements
- `ProductDetailPage` - Product page functionality
- `BasketPage` - Shopping cart operations
- `CheckoutPage` - Checkout process management
- `AccountPage` - User account functionality

**Component Objects:**

- `Header` - Navigation and header elements
- `Search` - Search functionality and suggestions
- `Filters` - Product filtering and sorting
- `Pagination` - Page navigation controls

## Important Notes

⚠️ **Test Environment**: Always ensure you're running tests against appropriate environments:

- Use dedicated test environments (not production)
- Ensure test data is properly configured
- Verify all required services are running
- Monitor test execution for any failures

**Best Practices:**

- Use descriptive test names and organize by feature
- Follow the Page Object Model pattern for maintainable code
- Include both positive and negative test cases
- Keep tests independent and avoid dependencies between tests
- Use appropriate wait strategies and assertions
- Clean up test data after test execution

**Browser Support:**

- Chromium: Full feature support
- Firefox: Complete compatibility testing
- WebKit: Safari compatibility validation
- Mobile: Android Chrome and iOS Safari emulation

## Documentation

- [Official Playwright Documentation](https://playwright.dev/docs/intro)
- [SCAYLE Storefront Application end-to-end testing documentation](https://scayle.dev/en/storefront-guide/storefront-application/testing/end-to-end-testing)
- [Testing Suite README.md](../README.md) for technical details
