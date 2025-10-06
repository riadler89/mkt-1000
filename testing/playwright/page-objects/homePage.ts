import type { Locator, Page } from '@playwright/test'
import { Base } from './base/base'

/**
 * Page Object Model for Homepage.
 * Encapsulates locators and methods for interacting with elements on Homepage.
 */
export class HomePage extends Base {
  readonly homepageContent: Locator
  readonly homepageMainContent: Locator

  /**
   * Initializes the HomePage Page Object.
   * @param page - The Playwright Page object.
   */
  constructor(page: Page) {
    super(page)

    this.homepageContent = page.getByTestId('home-page-content')
    this.homepageMainContent = page.getByTestId('main-content')
  }
}
