import { expect } from '@playwright/test'
import type { Locator, Page } from '@playwright/test'
import { ROUTES, NON_NUMERIC_PRICE_CHARS_REGEX } from '../support/constants'
import type { RPC } from './components/rpc'
import { Base } from './base/base'

export class BasketPage extends Base {
  private readonly rpc: RPC

  // --- Core Basket UI Elements ---
  readonly basketProductCard: Locator
  readonly productImage: Locator
  readonly productBrand: Locator
  readonly productName: Locator
  readonly quantitySelector: Locator
  readonly quantityValueMobile: Locator
  readonly quantityValueDesktop: Locator
  readonly buttonQuantityDecreaseMobile: Locator
  readonly buttonQuantityDecreaseDesktop: Locator
  readonly buttonQuantityIncreaseMobile: Locator
  readonly buttonQuantityIncreaseDesktop: Locator
  readonly removeItemButton: Locator
  readonly confirmRemoveItemButton: Locator

  // --- Price Summary Elements ---
  readonly priceSubtotal: Locator
  readonly priceFinal: Locator
  readonly initialProductPriceMobile: Locator
  readonly initialProductPriceDesktop: Locator
  readonly productPrice: Locator
  readonly discountSale: Locator
  readonly discountPromotion: Locator
  readonly promotionSummaryToggleButton: Locator
  readonly totalPromotionDiscount: Locator

  // --- Basket State Elements ---
  readonly emptyState: Locator
  readonly basketEmptyStateTitle: Locator
  readonly basketEmptyStateSubTitle: Locator
  readonly loginButton: Locator
  readonly continueButton: Locator
  readonly headlineUnavailableProducts: Locator
  readonly soldOutTitle: Locator
  readonly unavailableProductList: Locator
  readonly soldOutQuantitySelector: Locator
  readonly soldOutDeleteButton: Locator

  // --- Page Navigation/Generic Elements ---
  readonly checkoutButton: Locator
  readonly h1: Locator
  readonly pageTitle: Locator

  /**
   * Initializes the BasketPage Page Object.
   * @param page - The Playwright Page object.
   * @param rpc - The RPC (Remote Procedure Call) Page Object for direct API interactions.
   */
  constructor(page: Page, rpc: RPC) {
    super(page)
    this.rpc = rpc
    this.checkoutButton = page.getByTestId('checkout-link')
    this.productImage = page
      .getByTestId('basket-card')
      .getByTestId('product-image')
    this.basketProductCard = page.getByTestId('basket-card')
    this.emptyState = page.getByTestId('empty-state')
    this.basketEmptyStateTitle = this.emptyState.getByTestId(
      'empty-state-headline',
    )
    this.basketEmptyStateSubTitle = this.emptyState.getByTestId(
      'empty-state-subheadline',
    )
    this.loginButton = page.getByTestId('button-signin')
    this.continueButton = page.getByTestId('button-continue-shopping')
    this.productBrand = page
      .getByTestId('basket-product-brand')
      .getByTestId('main-label')
    this.productName = page
      .getByTestId('basket-product-brand')
      .getByTestId('sub-label')
    this.removeItemButton = page.getByTestId('basket-remove-item-button')
    this.confirmRemoveItemButton = page.getByTestId(
      'basket-remove-item-confirm-button',
    )
    this.priceSubtotal = page.getByTestId('basket-price-subtotal')
    this.priceFinal = page.getByTestId('basket-final-price')
    this.discountSale = page.getByTestId('basket-discount-sale')
    this.discountPromotion = page.getByTestId('basket-discount-promotion')
    this.promotionSummaryToggleButton = page.getByTestId(
      'promotion-summary-toggle-button',
    )
    this.totalPromotionDiscount = page.getByTestId(
      'summary-total-promotion-reduction',
    )
    this.headlineUnavailableProducts = page.getByTestId(
      'headline-unavailable-products',
    )
    this.soldOutTitle = page.getByTestId('basket-card-sold-out-title')
    this.unavailableProductList = page.getByTestId('unavailable-product-list')
    this.quantitySelector = page.getByTestId('quantity-selector')
    this.soldOutQuantitySelector =
      this.unavailableProductList.getByTestId('quantity-selector')
    this.soldOutDeleteButton = this.unavailableProductList.getByTestId(
      'basket-remove-item-button',
    )
    this.quantityValueMobile = page.getByTestId('quantity-value').nth(0)
    this.quantityValueDesktop = page.getByTestId('quantity-value').nth(1)
    this.buttonQuantityDecreaseMobile = page
      .getByTestId('quantity-minus')
      .nth(1)
    this.buttonQuantityDecreaseDesktop = page
      .getByTestId('quantity-minus')
      .nth(0)
    this.buttonQuantityIncreaseMobile = page.getByTestId('quantity-plus').nth(1)
    this.buttonQuantityIncreaseDesktop = page
      .getByTestId('quantity-plus')
      .nth(0)
    this.initialProductPriceMobile = page
      .getByTestId('initialProductPrice')
      .nth(0)
    this.initialProductPriceDesktop = page
      .getByTestId('initialProductPrice')
      .nth(1)
    this.productPrice = page.getByTestId('price')
    this.h1 = page.locator('h1')
    this.pageTitle = page.getByTestId('headline')
  }

  // --- Getter functions ---

  /**
   * Getter for the "increase quantity" button, handles mobile and desktop viewports.
   */
  public get buttonQuantityIncrease(): Locator {
    return this.isMobileViewport
      ? this.buttonQuantityIncreaseMobile
      : this.buttonQuantityIncreaseDesktop
  }

  /**
   * Getter for the "decrease quantity" button, handles mobile and desktop viewports.
   */
  public get buttonQuantityDecrease(): Locator {
    return this.isMobileViewport
      ? this.buttonQuantityDecreaseMobile
      : this.buttonQuantityDecreaseDesktop
  }

  /**
   * Getter for the "quantity value", handles mobile and desktop viewports.
   */
  public get quantityValue(): Locator {
    return this.isMobileViewport
      ? this.quantityValueMobile
      : this.quantityValueDesktop
  }

  /**
   * Getter for the "initial product price", handles mobile and desktop viewports.
   */
  public get initialProductPrice(): Locator {
    return this.isMobileViewport
      ? this.initialProductPriceMobile
      : this.initialProductPriceDesktop
  }

  // --- Action Methods ---

  /**
   * Adds a product to the basket using an RPC (Remote Procedure Call) to the backend.
   * This bypasses UI interaction for faster test setup.
   * It can be also used to add product to basket in case this is not possible via UI, e.g. to test sold-out product.
   * @param variantId - The ID of the product variant to add.
   * @param quantity - The quantity of the product to add.
   */
  async addProductToBasket(variantId: number, quantity: number) {
    try {
      await this.rpc.call('addItemToBasket', {
        variantId,
        quantity,
      })
    } catch (error) {
      console.error('Error adding item to basket:', error)
      throw error
    }
  }

  /**
   * Empties the basket for a specific item using an RPC (Remote Procedure Call) to the backend.
   * This bypasses UI interaction for faster test cleanup.
   * @param itemKey - The unique key of the item to remove from the basket.
   */
  async emptyBasket(itemKey: string) {
    try {
      await this.rpc.call('removeItemFromBasket', {
        itemKey,
      })
    } catch (error) {
      console.error('Error removing item from basket:', error)
      throw error
    }
  }

  /**
   * Removes the first visible item from the basket via UI interaction.
   * Clicks the remove button and confirms the action.
   */
  async removeItemFromBasket() {
    await this.removeItemButton.first().scrollIntoViewIfNeeded()
    await this.removeItemButton.first().click()
    await this.confirmRemoveItemButton.click()
  }

  /**
   * Updates the quantity of a product in the basket via UI interaction.
   * @param action - The action to perform: 'plus' to increase, 'minus' to decrease.
   * @throws {Error} If an invalid action is provided.
   */
  async updateProductQuantity(action: string) {
    let targetButtonLocator

    switch (action) {
      case 'plus':
        targetButtonLocator = this.buttonQuantityIncrease
        break
      case 'minus':
        targetButtonLocator = this.buttonQuantityDecrease
        break
      default:
        throw new Error(
          `Invalid quantity update action: '${action}'. Expected 'plus' or 'minus'.`,
        )
    }

    await targetButtonLocator.click()
    await this.page.waitForLoadState('networkidle')
  }

  // --- Assertion Methods ---

  /**
   * Asserts that a specific product is visible within the basket.
   * Checks for the presence of the product card, image, brand, and name.
   * @param productBrand - The expected brand name of the product.
   * @param productName - The expected name of the product.
   */
  async assertProductIsInBasket(productBrand: string, productName: string) {
    await expect(this.basketProductCard).toBeVisible()
    await expect(this.productImage).toBeVisible()
    await expect(this.productBrand).toHaveText(productBrand)
    await expect(this.productName).toHaveText(productName)
  }

  /**
   * Asserts that the "Continue Shopping" button is visible and functional.
   * Clicks the button and verifies navigation to the homepage.
   */
  async assertContinueButton() {
    await expect(this.continueButton).toBeVisible()
    await this.continueButton.click()
    await this.page.waitForTimeout(500)
    await this.page.waitForURL(ROUTES.homepageDefault)

    const pageUrl = this.page.url()

    expect(pageUrl).toContain(ROUTES.homepageDefault)
  }

  /**
   * Asserts that the "Login" button is visible within the basket context and clicks it.
   * Verifies that the login process is initiated.
   */
  async assertLoginButton() {
    await expect(this.loginButton).toBeVisible()
    await this.loginButton.waitFor()
    await this.loginButton.click()
    await this.page.waitForLoadState('networkidle')
  }

  /**
   * Asserts that the basket is empty (no product cards or images visible).
   * Also asserts that the Login and Continue Shopping buttons are visible, as expected in an empty state.
   */
  async assertProductNotInBasket() {
    await expect(this.basketProductCard).toBeHidden()
    await expect(this.productImage).toBeHidden()
    await expect(this.loginButton).toBeVisible()
    await expect(this.continueButton).toBeVisible()
  }

  /**
   * Asserts the correctness of the basket's price summary.
   * Compares the final price against the subtotal and an optional discount.
   * @param discountType - Optional: 'sale' or 'promotion' if a discount is expected.
   * @throws {Error} If an invalid discountType is provided.
   */
  async assertBasketPriceSummary(discountType?: 'sale' | 'promotion') {
    const extractPrice = async (locator: Locator): Promise<number> => {
      const text = await locator.textContent()
      return parseFloat(text?.replace(NON_NUMERIC_PRICE_CHARS_REGEX, '') ?? '0')
    }

    const priceSubtotalValue = await extractPrice(this.priceSubtotal)
    const priceFinalValue = await extractPrice(this.priceFinal.first())

    let discountValue = 0

    if (discountType === 'sale') {
      discountValue = await extractPrice(this.discountSale.first())
    } else if (discountType === 'promotion') {
      discountValue = await extractPrice(this.discountPromotion.first())
    } else if (discountType !== undefined) {
      throw new Error(
        `Invalid discountType: '${discountType}'. Expected 'sale', 'promotion', or undefined.`,
      )
    }

    expect(priceFinalValue).toEqual(
      priceSubtotalValue - Math.abs(discountValue),
    )
    expect(priceSubtotalValue).toEqual(
      priceFinalValue + Math.abs(discountValue),
    )
  }

  /**
   * Asserts the opacity of the product image for sold-out items in the basket.
   * Used to verify visual state of unavailable products.
   * @param opacity - The expected opacity value as a string (e.g., '0.5').
   */
  async assertSoldOutImageOpacity(opacity: string) {
    const productImage =
      this.unavailableProductList.getByTestId('product-image')
    const productImageOpacity = await productImage.evaluate((el) =>
      String(window.getComputedStyle(el).opacity).trim(),
    )

    expect(productImageOpacity).toBe(opacity)
  }

  /**
   * Asserts the final product price displayed in the basket.
   * @param priceValue - The expected price value (as a string, e.g., "49.99 €").
   * @param containsValue - True if the element's text is expected to contain `priceValue`, false if not.
   */
  async assertFinalProductPrice(priceValue: string, containsValue: boolean) {
    if (!containsValue) {
      await expect(this.initialProductPrice).not.toHaveText(priceValue)
      return
    }

    await expect(this.initialProductPrice).toContainText(priceValue)
  }
}
