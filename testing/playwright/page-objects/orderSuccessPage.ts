import type { Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { NON_NUMERIC_PRICE_CHARS_REGEX } from '../support/constants'
import { Base } from './base/base'

/**
 * Page Object Model for the Order Success Page (OSP).
 * Encapsulates locators and methods for verifying the successful order confirmation,
 * displaying order details, and handling OSP error states.
 */
export class OrderSuccessPage extends Base {
  // --- Order Summary & User Greeting Locators ---
  readonly ospGreetingBox: Locator
  readonly ospGreetingBoxHeadline: Locator
  readonly ospOrderData: Locator
  readonly ospPaymentData: Locator
  readonly ospDeliveryAddress: Locator
  readonly ospDeliveryDate: Locator
  readonly ospCarrier: Locator

  // --- Ordered Product Details Locators ---
  readonly ospProductCard: Locator
  readonly ospProductImage: Locator
  readonly ospProductBrand: Locator
  readonly ospProductName: Locator
  readonly ospProductColor: Locator
  readonly ospProductSize: Locator
  readonly ospProductQuantity: Locator
  readonly ospProductPrice: Locator

  // --- Price Summary Locators ---
  readonly ospSubtotal: Locator
  readonly ospShippingCost: Locator
  readonly ospTotal: Locator

  // --- Call-to-Action (CTA) Buttons ---
  readonly ospContinueShoppingButtonMobile: Locator
  readonly ospContinueShoppingButtonDesktop: Locator
  readonly ospOrderDetailsButtonMobile: Locator
  readonly ospOrderDetailsButtonDesktop: Locator

  // --- Error/Empty State Locators (for failed order/invalid token) ---
  readonly ospEmptyStateContainer: Locator
  readonly ospEmptyStateIcon: Locator
  readonly ospEmptyStateHeadline: Locator
  readonly ospEmptyStateSubheadline: Locator
  readonly ospEmptyStateContinueShoppingButton: Locator

  /**
   * Initializes the OrderSuccessPage Page Object.
   * @param page - The Playwright Page object.
   */
  constructor(page: Page) {
    super(page)

    // Order Summary & User Greeting
    this.ospGreetingBox = page.getByTestId('osp-greeting-box')
    this.ospGreetingBoxHeadline = page.getByTestId('osp-greeting-box-headline')
    this.ospOrderData = page.getByTestId('osp-order-data')
    this.ospPaymentData = page.getByTestId('osp-payment-data')
    this.ospDeliveryAddress = page.getByTestId('osp-delivery-address')
    this.ospDeliveryDate = page.getByTestId('osp-delivery-date')
    this.ospCarrier = page.getByTestId('osp-carrier')

    // Ordered Product Details
    this.ospProductCard = page.getByTestId('order-detail-product-card')
    this.ospProductImage = page.getByTestId('order-detail-product-image')
    this.ospProductBrand = page.getByTestId('order-detail-product-brand')
    this.ospProductName = page.getByTestId('order-detail-product-name')
    this.ospProductColor = page.getByTestId('order-detail-product-color')
    this.ospProductSize = page.getByTestId('order-detail-product-size')
    this.ospProductQuantity = page.getByTestId('order-detail-product-quantity')
    this.ospProductPrice = page.getByTestId('price')

    // Price Summary
    this.ospSubtotal = page.getByTestId('order-detail-subtotal')
    this.ospShippingCost = page.getByTestId('order-detail-shipping-cost')
    this.ospTotal = page.getByTestId('order-detail-total')

    // Call-to-Action (CTA) Buttons
    this.ospContinueShoppingButtonMobile = page
      .getByTestId('osp-continue-shopping-button')
      .nth(0)
    this.ospContinueShoppingButtonDesktop = page
      .getByTestId('osp-continue-shopping-button')
      .nth(1)
    this.ospOrderDetailsButtonMobile = page
      .getByTestId('osp-order-details-button')
      .nth(0)
    this.ospOrderDetailsButtonDesktop = page
      .getByTestId('osp-order-details-button')
      .nth(1)

    // Error/Empty State
    this.ospEmptyStateContainer = page.getByTestId('empty-state')
    this.ospEmptyStateIcon = page.getByTestId('empty-state-icon')
    this.ospEmptyStateHeadline = page.getByTestId('empty-state-headline')
    this.ospEmptyStateSubheadline = page.getByTestId('empty-state-subheadline')
    this.ospEmptyStateContinueShoppingButton = page.locator(
      '[data-testid="empty-state"] >> a',
    )
  }

  // --- Getter functions ---

  /**
   * Getter for the "continue shopping" button, handles mobile and desktop viewports.
   */
  public get ospButtonContinueShopping(): Locator {
    return this.isMobileViewport
      ? this.ospContinueShoppingButtonMobile
      : this.ospContinueShoppingButtonDesktop
  }

  /**
   * Getter for the "order details" button, handles mobile and desktop viewports.
   */
  public get ospButtonOrderDetails(): Locator {
    return this.isMobileViewport
      ? this.ospOrderDetailsButtonMobile
      : this.ospOrderDetailsButtonDesktop
  }

  // --- Private Helper Methods ---

  /**
   * Extracts a numeric price value from a locator's text content.
   * Removes non-numeric characters (except period and hyphen) and parses to float.
   * @param locator - The Playwright Locator whose text content to parse.
   * @returns The extracted price as a number.
   */
  private async extractPrice(locator: Locator): Promise<number> {
    const text = await locator.textContent()

    return parseFloat(text?.replace(NON_NUMERIC_PRICE_CHARS_REGEX, '') ?? '0')
  }

  // --- Assertion Methods ---

  /**
   * Asserts the correctness of the price summary on the Order Success Page.
   * Verifies that the total price equals the subtotal plus shipping cost.
   * Uses the page object's internal locators for consistency.
   */
  async assertOspPriceSummary() {
    const subtotalPriceValue = await this.extractPrice(this.ospSubtotal)
    const shippingCostValue = await this.extractPrice(this.ospShippingCost)
    const totalPriceValue = await this.extractPrice(this.ospTotal)

    expect(totalPriceValue).toBeCloseTo(
      subtotalPriceValue + shippingCostValue,
      2,
    )
  }
}
