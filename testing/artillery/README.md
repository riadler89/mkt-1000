# @scayle/storefront-application-artillery

A comprehensive load testing suite for the SCAYLE Storefront Application using Artillery. This package provides performance validation capabilities to ensure the storefront can handle expected traffic loads and maintain performance under stress conditions.

## Overview

The Artillery load testing suite introduces comprehensive performance validation for SCAYLE Storefront Applications, including:

- **Load Testing**: Multi-phase load tests that simulate realistic user behavior with configurable arrival rates and scenario weights
- **Stress Testing**: High-intensity tests to identify performance bottlenecks and breaking points
- **Playwright Integration**: Browser-based testing scenarios that interact with the storefront like real users
- **HTTP Testing**: Direct API endpoint testing for backend performance validation
- **Configurable Scenarios**: Environment-based configuration for different testing phases and user behavior patterns

## Key Features

- **Multi-phase Testing**: Configurable test phases with different arrival rates and durations
- **Realistic User Simulation**: Weighted scenario distribution based on actual user journey analytics
- **Dual Testing Modes**: HTTP-based API testing and Playwright-based browser testing
- **Environment-driven Configuration**: Flexible configuration through environment variables
- **CI/CD Integration**: Designed for seamless integration with continuous integration pipelines

## Test Scenarios

The Artillery suite supports testing of key user journeys including:

- Homepage visits and navigation
- Product listing page browsing
- Product detail page interactions
- Shopping basket operations
- Wishlist functionality
- Search and filtering operations

## Documentation

- [Artillery Documentation](https://www.artillery.io/docs)
- [Using Artillery with Playwright](https://www.artillery.io/docs/playwright)
- [Testing Suite README.md](../README.md) for technical details

## Installation

The Artillery project of Storefront Core needs to be installed manually to avoid polluting the
root dependencies and lock file. This will else result in significant memory consumption on CI.

```bash
# Install dependencies
pnpm install
```

## Test Structure

The Artillery load testing suite follows a modular architecture:

**Configuration Files:**

- `config/load-test.yml` - Multi-phase load test configuration
- `config/stress-test.yml` - High-intensity stress test configuration

**Test Scripts:**

- `tests/test-flows-http.ts` - HTTP-based test scenarios
- `tests/test-flows-playwright.ts` - Browser-based test scenarios

**Test Data:**

- `test-data/paths.json` - URL paths and endpoints for testing
- `test-data/search-terms.json` - Search terms for product search scenarios

## Configuration

All Artillery tests are configured through environment variables that control:

- Test duration and phases
- Arrival rates and ramp-up patterns
- Scenario distribution weights
- Test data and endpoints

The default values are intended for short local testing and should be adjusted for meaningful production-like test runs. See the main testing README for detailed environment variable configuration.

## Running Tests

### Prerequisites

Before running Artillery tests, ensure you have:

1. **Environment Configuration**: Set up your `.env` file with the required variables (see main testing README for details)
2. **Test Environment**: Ensure your storefront application is running and accessible
3. **Dependencies**: Install all required dependencies with `pnpm install`

### Load Tests

Load tests simulate realistic user behavior with gradually increasing traffic patterns.

```bash
# Navigate to artillery directory
cd artillery

# Run load tests (multi-phase with configurable scenarios)
pnpm artillery:load-test

# Direct artillery execution (for CI)
artillery run ./config/load-test.yml
```

**Load Test Configuration:**

- Multi-phase testing with configurable arrival rates
- Realistic user behavior simulation
- Weighted scenario distribution
- Configurable test duration and ramp-up patterns

### Stress Tests

Stress tests identify performance bottlenecks and system breaking points under high load.

```bash
# Run stress tests (high-intensity performance testing)
pnpm artillery:stress-test

# Direct artillery execution (for CI)
artillery run ./config/stress-test.yml
```

**Stress Test Configuration:**

- High-intensity testing scenarios
- System limit identification
- Performance bottleneck detection
- Configurable stress patterns

### Debug and Logging

To save verbose debug logs for analysis:

```bash
# Load tests with debug logging
DEBUG=* pnpm artillery:load-test debug_log.txt 2>&1

# Stress tests with debug logging
DEBUG=* pnpm artillery:stress-test debug_log.txt 2>&1
```

### Test Scenarios

The Artillery suite includes comprehensive test scenarios covering:

- **Homepage Visits**: Landing page performance and navigation
- **Product Browsing**: Category and product listing page interactions
- **Product Details**: Individual product page performance
- **Shopping Cart**: Add to cart and basket management operations
- **Search Functionality**: Product search and filtering performance
- **User Authentication**: Login and account management flows
- **Wishlist Operations**: Add/remove items from wishlist

## Important Notes

⚠️ **CAUTION**: Load and stress tests can generate significant traffic. Always ensure you have:

- Proper environment configuration
- Appropriate test environment setup
- Monitoring in place for system resources
- Clear understanding of test impact on your infrastructure

**Best Practices:**

- Start with low arrival rates for initial testing
- Monitor system resources during test execution
- Use appropriate test environments (not production)
- Review test results and adjust configuration as needed
