import type { Locator, Page } from '@playwright/test'
import { Base } from '../base/base'

/**
 * Page Object Model for the Breadcrumb component.
 * Encapsulates locators for the hierarchical navigation path on pages like PLPs.
 */
export class Breadcrumb extends Base {
  // --- Breadcrumb Elements ---
  readonly breadcrumbCategoryLvl0: Locator
  readonly breadcrumbCategoryActive: Locator
  readonly productCounter: Locator

  /**
   * Initializes the Breadcrumb Page Object.
   * @param page - The Playwright Page object.
   */
  constructor(page: Page) {
    super(page)

    this.breadcrumbCategoryLvl0 = page.getByTestId('category-breadcrumb-0')
    this.breadcrumbCategoryActive = page.getByTestId(
      'active-category-breadcrumb',
    )
    this.productCounter = page.getByTestId('breadcrumb-product-counter')
  }
}
