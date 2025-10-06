import type { Locator, Page } from '@playwright/test'
import { Base } from '../base/base'

/**
 * Page Object Model for the Free Product List component.
 * Encapsulates locators for a list of free products that can be added (e.g., during a promotion).
 */
export class FreeProductList extends Base {
  readonly addFreeProductButton: Locator

  /**
   * Initializes the FreeProductList Page Object.
   * @param page - The Playwright Page object.
   */
  constructor(page: Page) {
    super(page)

    this.addFreeProductButton = page.locator(
      'button[data-testid="add-free-product-button"]:not([disabled])',
    )
  }
}
