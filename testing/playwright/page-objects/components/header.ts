import type { Locator, Page } from '@playwright/test'
import { Base } from '../base/base'

/**
 * Page Object Model for the website Header component.
 * Encapsulates locators and methods for interacting with and asserting states of
 * common header elements like navigation buttons, user login, basket, and wishlist counters.
 */
export class Header extends Base {
  // --- Main Header Elements ---
  /** Locator for the main header container. */
  readonly mainHeader: Locator

  // --- Navigation Buttons ---
  readonly headerBasketButton: Locator
  readonly headerLoginButton: Locator
  readonly wishlistLink: Locator
  readonly promotionsButton: Locator
  readonly backToShopButton: Locator

  // --- Counter Badges ---
  readonly wishlistNumItems: Locator
  readonly basketNumItems: Locator

  /**
   * Initializes the Header Page Object.
   * @param page - The Playwright Page object.
   */
  constructor(page: Page) {
    super(page)

    this.wishlistNumItems = page.getByTestId('header-wishlist-count')
    this.headerBasketButton = page.getByTestId('basket-link')
    this.headerLoginButton = page.getByTestId('header-user-button')
    this.basketNumItems = page.getByTestId('header-basket-count')
    this.wishlistLink = page.getByTestId('wishlist-link')
    this.mainHeader = page.getByTestId('header')
    this.promotionsButton = page.getByTestId('promotion-header-button')
    this.backToShopButton = page.getByTestId('back-to-shop-button')
  }

  // --- Action Methods ---

  /**
   * Clicks the basket button in the header to navigate to the Basket page.
   * Waits for the page to load content.
   */
  async visitBasketPage() {
    await this.headerBasketButton.click()
    await this.page.waitForLoadState('domcontentloaded')
  }
}
