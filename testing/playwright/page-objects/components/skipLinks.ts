import type { Locator, Page } from '@playwright/test'
import { Base } from '../base/base'

/**
 * Page Object Model for Accessibility Skip Links.
 * Encapsulates locators for "skip to content" or "skip to search" links,
 * which aid keyboard navigation and accessibility.
 */
export class SkipLinks extends Base {
  // --- Skip Link Buttons ---
  readonly buttonSkipToMain: Locator
  readonly buttonSkipToSearch: Locator

  /**
   * Initializes the SkipLinks Page Object.
   * @param page - The Playwright Page object.
   */
  constructor(page: Page) {
    super(page)

    this.buttonSkipToMain = page.getByTestId('button-skip-to-main')
    this.buttonSkipToSearch = page.getByTestId('button-skip-to-search')
  }
}
