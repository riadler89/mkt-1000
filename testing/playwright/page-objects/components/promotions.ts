import type { Locator, Page } from '@playwright/test'
import { Base } from '../base/base'

/**
 * Page Object Model for various Promotion components (e.g., ribbon, flyout).
 * Encapsulates locators for elements related to displaying and interacting with promotions.
 */
export class Promotions extends Base {
  // --- Promotion Ribbon Locators ---
  readonly promotionRibbon: Locator
  readonly promotionRibbonTimer: Locator
  readonly promotionRibbonHeadline: Locator
  readonly promotionRibbonSubheadline: Locator

  // --- Promotion Flyout Locators ---
  readonly closeFlyoutButton: Locator
  readonly promotionsCounter: Locator
  readonly promotionCard: Locator

  /**
   * Initializes the Promotions Page Object.
   * @param page - The Playwright Page object.
   */
  constructor(page: Page) {
    super(page)

    // Promotion Ribbon Locators
    this.promotionRibbon = page.getByTestId('promotion-ribbon')
    this.promotionRibbonTimer = page.getByTestId('promotion-ribbon-timer')
    this.promotionRibbonHeadline = page.getByTestId('promotion-ribbon-headline')
    this.promotionRibbonSubheadline = page.getByTestId(
      'promotion-ribbon-subheadline',
    )
    // Promotion Flyout Locators
    this.closeFlyoutButton = page.getByTestId('close-promotions')
    this.promotionsCounter = page.getByTestId('promotion-counter')
    this.promotionCard = page.getByTestId('promotion-card')
  }
}
