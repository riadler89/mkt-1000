import type { Locator, Page } from '@playwright/test'
import { Base } from '../base/base'

/**
 * Page Object Model for the website Footer component.
 * Encapsulates locators and methods for interacting with and asserting states of
 * the global footer, including its logo, copyright, and various links.
 */
export class Footer extends Base {
  readonly footerWrapper: Locator
  readonly footerLogo: Locator
  readonly footerCopyright: Locator
  readonly simpleFooterLink: Locator

  /**
   * Initializes the Footer Page Object.
   * @param page - The Playwright Page object.
   */
  constructor(page: Page) {
    super(page)

    this.footerWrapper = page.getByTestId('footer')
    this.footerLogo = page.getByTestId('footer-logo')
    this.footerCopyright = page.getByTestId('footer-copyright')
    this.simpleFooterLink = page.getByTestId('simple-footer-link')
  }
}
