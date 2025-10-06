import type { Locator, Page } from '@playwright/test'
import type { RPC } from './components/rpc'
import { Base } from './base/base'

/**
 * Page Object Model for the User's Wishlist Page.
 * Encapsulates locators and methods for interacting with and asserting states on
 * the wishlist page, including empty/non-empty states and managing wishlist items.
 */
export class WishlistPage extends Base {
  private readonly rpc: RPC

  // --- Empty State Locators ---
  readonly emptyState: Locator
  readonly buttonContinueShopping: Locator
  readonly buttonSignIn: Locator
  readonly emptyStateIcon: Locator
  readonly emptyStateHeadline: Locator
  readonly emptyStateSubheadline: Locator

  // --- Wishlist Item Locators (Non-Empty State) ---
  readonly wishlistItemsWrapper: Locator
  readonly wishlistCard: Locator
  readonly productBrand: Locator
  readonly productImage: Locator
  readonly productUrl: Locator
  readonly buttonSize: Locator
  readonly buttonRemoveFromWishlist: Locator

  // --- Page Navigation/Generic Elements ---
  readonly h1: Locator
  readonly pageTitle: Locator

  /**
   * Initializes the WishlistPage Page Object.
   * @param page - The Playwright Page object.
   * @param rpc - The RPC (Remote Procedure Call) Page Object for direct API interactions.
   */
  constructor(page: Page, rpc: RPC) {
    super(page)
    this.rpc = rpc

    // Empty State Locators
    this.emptyState = page.getByTestId('empty-state')
    this.buttonContinueShopping = page.getByTestId('button-continue-shopping')
    this.buttonSignIn = page.getByTestId('button-signin')
    this.emptyStateIcon = this.emptyState.getByTestId('empty-state-icon')
    this.emptyStateHeadline = this.emptyState.getByTestId(
      'empty-state-headline',
    )
    this.emptyStateSubheadline = this.emptyState.getByTestId(
      'empty-state-subheadline',
    )

    // Wishlist Item Locators (Non-Empty State)
    this.wishlistItemsWrapper = page.getByTestId('wishlist-items-wrapper')
    this.wishlistCard = this.wishlistItemsWrapper.getByTestId('wishlist-card')
    this.productBrand = page.getByTestId('product-card-product-brand')
    this.buttonSize = this.wishlistCard.getByTestId(
      'wishlist-card-product-size',
    )
    this.buttonRemoveFromWishlist = page.getByTestId(
      'remove-item-from-wishlist-button',
    )
    this.productImage = page.getByTestId('product-image')
    this.productUrl = page.locator('[data-testid="wishlist-card"] >> a')

    // Page Navigation/Generic Elements
    this.h1 = page.locator('h1')
    this.pageTitle = page.getByTestId('headline')
  }

  // --- Private Helper Locators & Methods ---

  /**
   * Returns a Locator for a specific size radio button.
   * This is a helper method used internally for selecting product sizes.
   * @param size - The size value (e.g., 'S', 'M', 'L').
   * @returns A Playwright Locator for the specific size radio button.
   */
  private radioButtonSize(size: string): Locator {
    return this.page.getByTestId(`radio-button-${size}`)
  }

  // --- Action Methods ---

  /**
   * Adds a product to the wishlist using an RPC (Remote Procedure Call) to the backend.
   * This bypasses UI interaction for faster test setup.
   * @param productId - The ID of the product to add to the wishlist.
   */
  async addProductToWishlist(productId: number) {
    try {
      await this.rpc.call('addItemToWishlist', {
        productId,
      })
    } catch (error) {
      console.error('Error adding item to wishlist via RPC:', error)
      throw error
    }
  }

  /**
   * Removes the first visible item from the wishlist via UI interaction.
   * Assumes there is at least one item in the wishlist.
   */
  async removeItemFromWishlist() {
    await this.wishlistCard.hover()
    await this.buttonRemoveFromWishlist.waitFor()
    await this.buttonRemoveFromWishlist.click()
    await this.page.waitForLoadState('domcontentloaded')
  }
}
