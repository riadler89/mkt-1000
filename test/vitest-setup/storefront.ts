import { vi } from 'vitest'

/*
 * Global Mock for `extendPromise` in `@scayle/storefront-nuxt`
 *
 * The original `extendPromise` function provided by '@scayle/storefront-nuxt'
 * might perform complex operations, introduce side effects, or have
 * dependencies that are undesirable or difficult to manage during isolated
 * unit/component testing. Running the original implementation could slow
 * down tests, make them flaky, or introduce unwanted behavior irrelevant
 * to the component under test.
 *
 * Solution:
 * Partially mock the '@scayle/storefront-nuxt' module. We use `vi.importActual`
 * to retain all original exports from the module, ensuring that other
 * functionalities relying on it remain unaffected. We then specifically
 * override only the `extendPromise` function with a simplified mock
 * (`vi.fn((_, values) => values)`). This mock immediately returns the provided
 * `values`, bypassing the original logic and potential side effects, while
 * maintaining the expected return signature for test purposes. This provides
 * isolation and predictability for tests interacting with `extendPromise`.
 * =============================================================================
 */
vi.mock('@scayle/storefront-nuxt', async () => {
  // Using 'importActual' to get the real module exports first.
  const actual = await vi.importActual('@scayle/storefront-nuxt')
  // Return all actual exports, but specifically override 'extendPromise'.
  return {
    ...actual,
    extendPromise: vi.fn((_, values) => values),
  }
})

/*
 * Global Mock for routeChangeTrackingObserver Middleware
 *
 * The actual '~/middleware/routeChangeTrackingObserver.global.ts' middleware
 * uses a `setTimeout` to delay tracking execution. In resource-constrained
 * environments (like GitLab CI), this timeout callback sometimes executes
 * after vitest has finished the test and has torn down the `happy-dom`
 * environment. This leads to a "ReferenceError: document is not defined"
 * when the callback tries to access `document.title`.
 *
 * Globally mock the middleware for all Vitest tests. This replaces the
 * original middleware logic (including the problematic setTimeout) with an
 * empty mock function (`vi.fn()`), preventing the error during test runs.
 * This ensures test stability, especially in CI.
 */
vi.mock('~/middleware/routeChangeTrackingObserver.global.ts', () => {
  // Return the mock implementation: an object with a `default` property
  // holding an empty mock function.
  return {
    default: vi.fn(),
  }
})
