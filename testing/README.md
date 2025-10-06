# @scayle/storefront-application-testing

A comprehensive testing suite for the SCAYLE Storefront Application. This package provides end-to-end testing capabilities using Playwright and load testing with Artillery.

## Overview

This testing suite is designed to ensure the reliability, performance, and user experience of SCAYLE-powered ecommerce storefronts. It includes both functional testing and performance testing tools.

## Testing Components

### 🎭 Playwright E2E Testing (`/playwright/`)

End-to-end testing framework for browser automation and user journey validation.

**Features:**

- Cross-browser testing (Chromium, Firefox, WebKit)
- Mobile web emulation
- Page Object Model implementation
- Comprehensive test coverage for all storefront features

**Test Categories:**

- **E2E Tests**: Complete user journeys (account, basket, checkout, product pages)
- **Happy Path Tests**: Critical user flows validation

**Key Test Areas:**

- User authentication and account management
- Product browsing and search functionality
- Shopping basket and checkout process
- Order management and success flows
- Navigation and UI components
- Country detection and shop selection
- Promotions and wishlist features

### ⚡ Artillery Load Testing (`/artillery/`)

Performance and load testing framework for stress testing storefront applications.

**Features:**

- HTTP and Playwright-based load testing
- Configurable test scenarios and phases
- Realistic user behavior simulation
- Performance metrics and reporting

**Test Types:**

- **Load Tests**: Normal expected traffic patterns
- **Stress Tests**: High-volume traffic scenarios

## Quick Start

### Prerequisites

- Node.js >= 22.15.0
- pnpm >= 10.11.0

### Installation

```bash
# Install dependencies
pnpm install

# Install Playwright browsers
cd playwright && pnpm exec playwright install
```

### Running Tests

#### E2E Tests (Playwright)

```bash
# Run all E2E tests
cd playwright
pnpm test:e2e

# Run specific test categories
pnpm test:e2e:happy-path

# Run tests with UI
pnpm test:e2e:ui
```

#### Load Tests (Artillery)

```bash
# Run load tests
cd artillery
pnpm artillery:load-test

# Run stress tests
pnpm artillery:stress-test
```

## Configuration

### Environment Variables

Take the `.env.example` file in the Storefront Application root as basis and populate your own local `.env` file:

```env
#############################
# TESTING: Playwright (E2E) #
#############################

### PLAYWRIGHT E2E TEST USERS ###
# As a prerequisite to successfully run the any end-to-end test that requires user authentication, the following environment variables should be set:
# Dedicated test user for Chromium in tests that are prone to conflicts (e.g. adding product to Basket in parallel for all browsers).
# This user is also used as a default test user across the Storefront Boilerplate end-to-end tests suite.
TEST_USER_EMAIL1=
# Dedicated test user for desktop Firefox.
TEST_USER_EMAIL2=
# Dedicated test user for desktop Webkit (Safari).
TEST_USER_EMAIL3=
# Dedicated test user for mobile Chrome.
TEST_USER_EMAIL4=
# Dedicated test user for mobile Webkit (Safari).
TEST_USER_EMAIL5=
# Test user with no orders placed. Used to verify Orders page empty state.
TEST_USER_NO_ORDERS=
# Password (the same for all test users listed above).
TEST_USER_PASSWORD=
# Password used for test that verifies user authentication with wrong credentials.
TEST_USER_WRONG_PASSWORD=

### PLAYWRIGHT E2E SEARCH TERMS ###
# As a prerequisite to successfully run the Search end-to-end tests, the following environment variables should be set.
# Search term that doesn't match any category name, so the search suggestions are not shown, e.g. some product brand.
E2E_SEARCH_TERM_PRODUCT=
# Search term that fully or partially matches category name, e.g. "shirt" or "shirts".
E2E_SEARCH_TERM_CATEGORY_SUGGESTION=
# Search term that matches exact product ID, e.g. 123456.
E2E_SEARCH_EXACT_PRODUCT_ID=
# Descriptive search term that returns search suggestion tags in search suggestions list, e.g. "Black shoes size 44".
E2E_SEARCH_TAGS=
# Search term that fully or partially matches a (content) page, e.g. "faq" or "support".
E2E_SEARCH_PAGE=
# Search term that matches the exact product reference key, e.g. "123-ref-key".
E2E_SEARCH_REFERENCE_KEY=

#####################################
# TESTING: Artillery (Load Testing) #
#####################################

# NOTE: All default values are intended for short local testing
# and need to be adjusted for meaningful test runs.

# Phases durations for Load Test (3 phases)
# Sample values:
# 60 - 60 seconds
# 30m - 30 minutes
# 1h - 1 hour
ARTILLERY_LOAD_DURATION_P1=1
ARTILLERY_LOAD_DURATION_P2=2
ARTILLERY_LOAD_DURATION_P3=3

# Arrival rates for Load Test (3 phases)
# The arrival rate is the number of new virtual users that Artillery will create per second.
# For example, value 5 means Artillery will inject exactly 5 new users every second for the entire duration of the phase.
ARTILLERY_LOAD_ARRIVAL_RATE_P1=5
ARTILLERY_LOAD_ARRIVAL_RATE_P2=6
ARTILLERY_LOAD_ARRIVAL_RATE_P3=7

# The rampTo parameter is used in combination with arrivalRate to create a gradually increasing load.
# It defines the target number of new virtual users per second that the test will reach by the end of the phase.
# For example, if duration is 10, arrival rate is 2, and ramp to is 10, Artillery will start by injecting 2 users per second
# and will gradually increase that rate until it's injecting 10 users per second by the 10th second.
ARTILLERY_LOAD_RAMP_TO_P1=5
ARTILLERY_LOAD_RAMP_TO_P2=10

# Scenario weights (percentage of distribution) for Load Test.
# 7 scenarios in total.
# Weight is a crucial parameter in an Artillery scenario.
# It defines the probability or percentage of virtual users that will run a particular scenario.
# For example, value 2 will take 20% of overall execution (2/10), value 5 will take 50%, etc.
ARTILLERY_LOAD_WEIGHT_S1=2
ARTILLERY_LOAD_WEIGHT_S2=1
ARTILLERY_LOAD_WEIGHT_S3=1
ARTILLERY_LOAD_WEIGHT_S4=2
ARTILLERY_LOAD_WEIGHT_S5=2
ARTILLERY_LOAD_WEIGHT_S6=1
ARTILLERY_LOAD_WEIGHT_S7=1

# Phases durations for Stress Test (3 phases).
# example values:
# 60 - 60 seconds
# 30m - 30 minutes
# 1h - 1 hour
ARTILLERY_STRESS_DURATION_P1=1
ARTILLERY_STRESS_DURATION_P2=2
ARTILLERY_STRESS_DURATION_P3=3

# Arrival rates for Stress Test (3 phases).
# The arrival rate is the number of new virtual users that Artillery will create per second.
# For example, value 5 means Artillery will inject exactly 5 new users every second for the entire duration of the phase.
ARTILLERY_STRESS_ARRIVAL_RATE_P1=5
ARTILLERY_STRESS_ARRIVAL_RATE_P2=6
ARTILLERY_STRESS_ARRIVAL_RATE_P3=7

# Ramp To for Stress Test for the first and third phase. The 2nd phase uses only constant arrival rate.
# The rampTo parameter is used in combination with arrivalRate to create a gradually increasing load.
# It defines the target number of new virtual users per second that the test will reach by the end of the phase.
# For example, if duration is 10, arrival rate is 2, and ramp to is 10, Artillery will start by injecting 2 users per second
# and will gradually increase that rate until it's injecting 10 users per second by the 10th second.
ARTILLERY_STRESS_RAMP_TO_P1=10
ARTILLERY_STRESS_RAMP_TO_P3=0 # Ramp down to 0 users

# Scenario weights (percentage of distribution) for Stress Test.
# 3 scenarios in total.
# Weight is a crucial parameter in an Artillery scenario.
# It defines the probability or percentage of virtual users that will run a particular scenario.
# For example, value 2 will take 20% of overall execution (2/10), value 5 will take 50%, etc.
ARTILLERY_STRESS_WEIGHT_S1=4
ARTILLERY_STRESS_WEIGHT_S2=3
ARTILLERY_STRESS_WEIGHT_S3=3
```

### Test Data

- **Playwright**: Test data is managed through page objects and fixtures
- **Artillery**: Test data files are located in `/artillery/test-data/`

## Architecture

The testing suite follows a modular architecture:

- **Page Objects**: Reusable components for UI interactions
- **Fixtures**: Shared test data and utilities
- **Test Scenarios**: Organized by feature and user journey
- **Configuration**: Environment-specific test settings

## Support

For questions about the testing suite, refer to:

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Artillery Documentation](https://www.artillery.io/docs)
- [Playwright Testing Guide](./playwright/README.md)
- [Artillery Load Testing Guide](./artillery/README.md)
- [SCAYLE Storefront Testing Documentation](https://scayle.dev/en/storefront-guide/storefront-application/testing/end-to-end-testing)
- [SCAYLE Developer Documentation](https://scayle.dev)
