import type { Page } from '@playwright/test'
import { isMobile } from '../../support/utils'

/**
 * Abstract base class for all Page Objects.
 * Provides common properties and helper methods accessible by all derived page objects.
 */
export abstract class Base {
  protected readonly page: Page
  readonly isMobileViewport: boolean

  /**
   * Initializes the Base.
   * @param page - The Playwright Page object.
   */
  constructor(page: Page) {
    this.page = page
    this.isMobileViewport = isMobile(page)
  }

  /**
   * Navigates the Playwright page to a specified path.
   * This is a simple wrapper around `page.goto()` that allows for a custom `waitUntil` option.
   *
   * @param page - The Playwright Page object to navigate.
   * @param path - The URL path to navigate to, relative to the configured `baseURL` (e.g., '/', '/products', '/login').
   * @param waitUntil - Optional. An event to wait for before navigation is considered finished.
   * - `'load'`: Waits for the 'load' event to fire (all static resources downloaded).
   * - `'commit'`: Waits for the navigation to successfully start (first byte of response received).
   * - `'domcontentloaded'`: Waits for the 'DOMContentLoaded' event to fire (DOM tree built).
   * - `'networkidle'`: Waits for network activity to cease for a period (common for SPAs).
   * Defaults to Playwright's default for `page.goto()` if not specified.
   */
  async navigate(
    page: Page,
    path: string,
    waitUntil?: 'load' | 'commit' | 'domcontentloaded' | 'networkidle',
  ) {
    await page.goto(path, { waitUntil })
  }
}
