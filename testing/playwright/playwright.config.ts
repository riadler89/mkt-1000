import type { PlaywrightTestConfig } from '@playwright/test'
import { defineConfig, devices } from '@playwright/test'

// Read environment variables from file if not running in CI.
// E.g. used for `BASE_URL` environment variable.
if (!process.env.CI) {
  try {
    // https://nodejs.org/docs/latest-v20.x/api/process.html#processloadenvfilepath
    process.loadEnvFile('../../.env') // Should be located in the root of the SCAYLE Storefront Application project
    // eslint-disable-next-line sonarjs/no-ignored-exceptions, @typescript-eslint/no-unused-vars
  } catch (error) {
    console.warn(
      'Warning: .env file for shared test suite not found at ../../.env. Using default configuration.',
    )
  }
}

/**
 * Define the base URL to use in actions like `await page.goto('/')`.
 * It tries to use the BASE_URL environment variable or fallback to 'https://localhost:3000/de/'.
 * If a local .env file is present, it will use the BASE_URL from the file.
 */
const BASE_URL = process.env.BASE_URL ?? 'https://localhost:3000/de/'

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export const playwrightConfig: PlaywrightTestConfig = {
  testDir: './tests',
  // Run tests in files in parallel
  fullyParallel: true,
  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!process.env.CI,
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  // Opt out of parallel tests on CI.
  workers: process.env.CI ? 1 : undefined,
  // Reporter to use. See https://playwright.dev/docs/test-reporters
  reporter: [
    ['junit', { outputFile: 'test-results/results.xml' }],
    ['list', { printSteps: true }],
  ],
  // Shared settings for all the projects below.
  // See https://playwright.dev/docs/api/class-testoptions
  use: {
    // Base URL to use in actions like `await page.goto('/')`.
    baseURL: BASE_URL,
    // Collect trace when retrying the failed test.
    // See https://playwright.dev/docs/trace-viewer
    trace: 'on-first-retry',
    // Ignore HTTPS errors
    ignoreHTTPSErrors: true,
  },
  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Galaxy S9+'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 15'] },
    },
  ],
}

export default defineConfig(playwrightConfig)
