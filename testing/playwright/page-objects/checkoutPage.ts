import type { Locator, Page } from '@playwright/test'
import { Base } from './base/base'

/**
 * Page Object Model for the Checkout Page.
 * Encapsulates locators for interacting with the checkout flow's
 * order overview, terms acceptance, and payment initiation steps.
 */
export class CheckoutPage extends Base {
  // --- Basket/Item Overview Locators ---
  readonly basketContainer: Locator
  readonly deliveryEstimate: Locator
  readonly itemQuantity: Locator
  readonly buttonItemRemove: Locator

  // --- Payment/Terms Locators ---
  readonly checkboxAcceptTerms: Locator
  readonly ctaPayButton: Locator

  /**
   * Initializes the CheckoutPage Page Object.
   * @param page - The Playwright Page object.
   */
  constructor(page: Page) {
    super(page)

    this.basketContainer = page.locator('[data-test-id="basket-container"]')
    this.deliveryEstimate = page.locator('[data-test-id="delivery-estimate"]')
    this.itemQuantity = page.locator('[data-test-id="item-quantity"]')
    this.buttonItemRemove = page.locator('[data-test-id="item-remove"]')
    this.checkboxAcceptTerms = page.locator(
      '[data-test-id="paymentBelowMobileBasket-termsAndPrivacy"]',
    )
    this.ctaPayButton = page.locator('[data-test-id="navigation-next-step"]')
  }
}
