import type { Locator, Page } from '@playwright/test'
import { Base } from './base/base'

/**
 * Page Object Model for generic Error Pages (e.g., 404 Not Found, general error screens).
 * Encapsulates locators for interacting with elements on error pages.
 */
export class ErrorPage extends Base {
  readonly errorPageLogo: Locator
  readonly errorPageCode: Locator
  readonly errorPageButtonContinue: Locator

  /**
   * Initializes the ErrorPage Page Object.
   * @param page - The Playwright Page object.
   */
  constructor(page: Page) {
    super(page)

    this.errorPageLogo = page.getByTestId('error-page-logo')
    this.errorPageCode = page.getByTestId('error-page-code')
    this.errorPageButtonContinue = page.getByTestId(
      'error-page-button-continue',
    )
  }
}
