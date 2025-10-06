import type { Locator, Page } from '@playwright/test'
import { Base } from './base/base'

/**
 * Page Object Model for the Product Listing Page (PLP).
 * Encapsulates locators and methods for interacting with and asserting states on
 * product listing pages, including product cards, wishlist actions, filters, and sorting.
 */
export class ProductListingPage extends Base {
  // --- Product Card & Item Locators ---
  readonly productCard: Locator
  readonly productItem: Locator
  readonly productImage: Locator
  readonly productTile: Locator
  readonly productSibling: Locator

  // --- Wishlist Action Locators ---
  readonly wishlistButton: Locator
  readonly removeFromWishlistButton: Locator

  // --- Navigation & Page Structure Locators ---
  readonly menuRootCategory: Locator
  readonly menuSubCategory: Locator
  readonly h1: Locator
  readonly pageTitle: Locator
  readonly sideNavigation: Locator

  /**
   * Initializes the ProductListingPage Page Object.
   * @param page - The Playwright Page object.
   */
  constructor(page: Page) {
    super(page)

    this.wishlistButton = page.locator(
      '[data-testid="add-item-to-wishlist-button"]',
    )
    this.productTile = page.locator('[id^="product-"]')
    this.menuRootCategory = page.getByTestId('root-category-0')
    this.menuSubCategory = page.getByTestId('sub-category-0')
    this.productItem = page.getByTestId('product-item')
    this.removeFromWishlistButton = page.getByTestId(
      'remove-item-from-wishlist-button',
    )
    this.productSibling = page.getByTestId('product-sibling')
    this.productImage = page.getByTestId('product-image')
    this.productCard = page.locator('article[id^="product-"]')
    this.h1 = page.locator('h1')
    this.pageTitle = page.getByTestId('active-category-breadcrumb')
    this.sideNavigation = page.getByTestId('side-navigation')
  }

  // --- Action Methods ---

  /**
   * Adds the first product on the PLP to the wishlist.
   * Assumes the wishlist button for the first product is present and clickable.
   */
  async addProductToWishlist() {
    await this.wishlistButton.first().click()
  }

  /**
   * Removes the first product from the wishlist from the PLP (if already added).
   * Assumes the remove button for the first product is present and clickable.
   */
  async removeProductFromWishlist() {
    await this.removeFromWishlistButton.first().click()
  }

  /**
   * Navigates to the current PLP URL with additional filter parameters applied as a deeplink.
   * @param filters - An object where keys are filter names and values are filter values (e.g., `{ sale: true, maxPrice: 4000 }`).
   */
  async addFiltersToPLP(
    filters: Record<string, string | boolean | number> = {},
  ) {
    const pageUrl = this.page.url()
    const formattedFilters = Object.entries(filters).map(
      ([key, value]) => `filters[${key}]=${encodeURIComponent(String(value))}`,
    )
    const url =
      pageUrl +
      (formattedFilters.length ? `?${formattedFilters.join('&')}` : '')

    await this.navigate(this.page, url, 'networkidle')
  }
}
