import { getRequiredEnv } from './utils'

/**
 * Predefined filter parameters for testing PLP deep links.
 * Currently configured with "sale": true and "maxPrice": 4000 for testing purposes.
 * This object is used in tests like "C2139744: Verify PLP Filters deep link"
 * within `/playwright/tests/e2e-Plp.spec.ts`. Extend this object to include
 * other filter keys (e.g., color, size) to broaden deep link filter testing.
 *
 * NOTE: If this object is extended with additional filters, the test
 * "C2139744: Verify PLP Filters deep link" should be adjusted accordingly.
 */
export const PLP_FILTER_DEEP_LINK = {
  sale: true,
  maxPrice: 4000,
}

/**
 * SEARCH constant object defines various search-related constants used in end-to-end tests.
 * This object centralizes search terms and URL parameters to ensure consistency
 * and easier configuration across different test scenarios. Using environment
 * variables allows for flexible test data management across various environments.
 */
export const SEARCH = {
  /** Product search term, e.g. product brand or name that doesn't match a category or page name, so the search suggestions are not displayed */
  searchTermProduct: getRequiredEnv('E2E_SEARCH_TERM_PRODUCT'),
  /** Category suggestion search term that partially or fully matches category name, e.g. "shirt" or "shirts". */
  searchTermCategorySuggestion: getRequiredEnv(
    'E2E_SEARCH_TERM_CATEGORY_SUGGESTION',
  ),
  /** Product ID search term that matches exact product ID in stock, e.g. 123456. */
  searchExactProductID: getRequiredEnv('E2E_SEARCH_EXACT_PRODUCT_ID'),
  /** Suggestion tags search term that describes the product and returns its descriptive tags, e.g. "Black shoes size 44". */
  searchTermTags: getRequiredEnv('E2E_SEARCH_TAGS'),
  /** Page name search term that fully or partially matches a content page, e.g. "faq" or "support". */
  searchTermPage: getRequiredEnv('E2E_SEARCH_PAGE'),
  /** Reference Key search term that matches exact product Reference Key in stock, e.g. "123-ref-key". */
  searchReferenceKey: getRequiredEnv('E2E_SEARCH_REFERENCE_KEY'),
  /** The base URL parameter used for search queries. It doesn't require any setup via environment variable. */
  searchParamUrl: 'search?filters[term]=',
}

export const BASKET_TEST_DATA = {
  seoRobots: 'noindex,follow',
}

export const SIGNIN_URL = '/signin'

/**
 * `USER_ACCOUNT` constant object contains keys needed to verify user data update, password update with non-matching password,
 * and birth date update with correct and incorrect dates.
 * In order to successfully use this constant object in end-to-end tests, test users should be defined via environment variables,
 * as explained in `TEST_USERS` object.
 */
export const USER_ACCOUNT = {
  userFirstName: 'Aqa',
  userLastName: 'Test',
  userBirthDateCorrect: '01-01-1981',
  userBirthDateIncorrect: '32-13-9999',
  // eslint-disable-next-line sonarjs/no-hardcoded-passwords
  nonMatchingPassword: 'N0nMatch1ngPa55w0rd!',
  routeOrders: '/account/orders',
  routeSubscriptions: '/account/subscription',
  routeProfile: '/account/profile',
}

export const PDP_E2E = {
  seoRobots: 'index, follow',
}

/**
 * A constant object defining various test users needed for different browsers and scenarios in end-to-end tests.
 */
export const TEST_USERS = {
  /**
   * Dedicated test user for Chromium in tests that are prone to conflicts (e.g. adding product to Basket in parallel for all browsers).
   * This user is also used as a default test user across the Storefront Boilerplate end-to-end tests suite.
   */
  testUserEmail1: process.env.TEST_USER_EMAIL1 as string,
  /** Dedicated test user for desktop Firefox. */
  testUserEmail2: process.env.TEST_USER_EMAIL2 as string,
  /** Dedicated test user for desktop Webkit (Safari) */
  testUserEmail3: process.env.TEST_USER_EMAIL3 as string,
  /** Dedicated test user for mobile Chrome */
  testUserEmail4: process.env.TEST_USER_EMAIL4 as string,
  /** Dedicated test user for mobile Webkit (Safari) */
  testUserEmail5: process.env.TEST_USER_EMAIL5 as string,
  /** Test user with no orders placed. Used to verify Orders page empty state. */
  testUserNoOrders: process.env.TEST_USER_NO_ORDERS as string,
  /** Test user used to verify hydration errors for logged-in users on pages with items (Wishlist and Basket).
   * This test user should have items in Wishlist and Basket, so the non-empty state is tested properly.
   */
  testUserEmail6: process.env.TEST_USER_EMAIL6 as string,
  /** Password (the same for all test users listed above). */
  testUserPassword: process.env.TEST_USER_PASSWORD as string,
  /** Password used for test that verifies user authentication with wrong credentials. */
  wrongPassword: process.env.TEST_USER_WRONG_PASSWORD as string,
  /** Test user first and last name, used in registration form tests. */
  firstNameRegUser: 'Registered',
  lastNameRegUser: 'User',
  /** Non registered e-mail address. Used in non-happy paths for some tests, e.g. password reset for non-registered user. */
  nonExistingEmail: 'Aqa.testxx@test.com',
  /** Wrong formatted e-mail address. Used in non-happy paths for some tests, e.g. password reset for invalid e-mail format. */
  emailInvalidFormat: 'test@test',
}

/**
 * Supported sorting options for product listings, mapped to their backend identifiers.
 */
export const SORTING = {
  topSeller: 'top_seller',
  dateNewest: 'date_newest',
  priceDesc: 'price_desc',
  priceAsc: 'price_asc',
  reductionDesc: 'reduction_desc',
}

/**
 * Commonly used application routes for navigation and testing.
 */
export const ROUTES = {
  wishlist: '/wishlist',
  basket: '/basket',
  orders: '/orders',
  homepageDefault: '/de',
  homepage1: '/en',
  checkout: '/checkout',
  signin: '/signin',
  account: '/account',
}

/**
 * Test data for OSP (Order Success Page) scenarios, including SEO and URL parameters.
 */
export const OSP_TEST_DATA = {
  incorrectCbdUrl:
    '/success?cbd=eyJzdGF0dXNTg1NTI3Y2I3NjY0NWQ3NA==&login=1&pmm=b2b',
  seoRobots: 'noindex,nofollow',
}

/**
 * Test data for login and registration flows, including SEO and URL parameters.
 */
export const LOGIN_REGISTRATION = {
  seoRobots: 'noindex,follow',
  regUrlParam: 'register=true',
}

/**
 * Product Listing Page (PLP) test data for SEO robots meta tag scenarios.
 */
export const PLP_TEST_DATA = {
  seoRobotsDefault: 'index,follow',
  seoRobotsFiltersSorting: 'noindex,follow',
}

/**
 * Wishlist page test data for SEO and title validation.
 */
export const WISHLIST_TEST_DATA = {
  seoTitle: 'Deine Wunschliste | SCAYLE',
  seoRobots: 'noindex, nofollow',
}

/**
 * Regular expression to match and remove any characters that are not
 * digits (0-9), periods (.), or hyphens (-). Useful for parsing numeric values like prices.
 */
export const NON_NUMERIC_PRICE_CHARS_REGEX = /[^0-9.-]+/g

// eslint-disable-next-line sonarjs/no-hardcoded-passwords
export const TEST_PASSWORD_RESET_HASH = '?hash=testhash'
