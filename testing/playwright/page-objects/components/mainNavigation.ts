import type { Locator, Page } from '@playwright/test'
import { Base } from '../base/base'

/**
 * Page Object Model for the Main Navigation component for desktop browsers.
 * Encapsulates locators and methods for interacting with the main navigation links,
 * opening the desktop flyout, and navigating to Product Listing Pages (PLPs).
 */
export class MainNavigation extends Base {
  // --- Main Navigation Locators ---
  readonly desktopNavigationFlyout: Locator
  readonly navigationItem: Locator
  readonly navigationLinkMain: Locator

  /**
   * Initializes the MainNavigation Page Object.
   * @param page - The Playwright Page object.
   */
  constructor(page: Page) {
    super(page)

    this.desktopNavigationFlyout = page.getByTestId('desktop-navigation-flyout')
    this.navigationItem = page.getByTestId('navigation-item')
    this.navigationLinkMain = page.getByTestId('nav-link-main')
  }

  // --- Private Helper Locators & Methods ---

  /**
   * Returns a Locator for a specific main category link based on its data-testid suffix.
   * This is a helper method used internally.
   * @param categoryTestId - The specific part of the data-testid (e.g., 'women', 'men').
   * @returns Playwright locator for the specific main category link.
   */
  private getMainCategory(categoryTestId: string): Locator {
    return this.page.getByTestId(`nav-link-${categoryTestId}`)
  }

  /**
   * Returns a Locator for a specific sub-category link based on its visible text.
   * This is a helper method used internally.
   * @param value - The exact text of the sub-category link (e.g., 'Dresses', 'Hoodies').
   * @returns A Playwright Locator for the specific sub-category link.
   */
  private getSubCategory(value: string): Locator {
    return this.page.getByTestId('navigation-item').getByText(value)
  }

  // --- Action Methods ---

  /**
   * Opens the main desktop navigation overlay/flyout.
   * This typically involves hovering over a main navigation link.
   * @note This method hardcodes interaction with the second main navigation link (`.nth(1)`) to bypass "Home" navigation element.
   */
  async openMainNavigationOverlay() {
    await this.navigationLinkMain.nth(1).waitFor()
    await this.navigationLinkMain.nth(1).hover()
    await this.desktopNavigationFlyout.waitFor()
  }

  /**
   * Navigates to a main category Product Listing Page (PLP) directly from the main navigation.
   * @note This method hardcodes clicking the second main navigation link (`.nth(1)`).
   */
  async navigateToPlpMainCategory() {
    await this.navigationLinkMain.nth(1).click()
    await this.page.mouse.move(0, 0)
    await this.page.waitForLoadState('domcontentloaded')
  }

  /**
   * Navigates to a sub-category Product Listing Page (PLP) from the main navigation flyout.
   * This involves hovering over a main category and then clicking a sub-category link.
   * @note This method hardcodes hovering over the second main navigation link (`.nth(1)`)
   * and clicking the first sub-category item (`.nth(0)`).
   */
  async navigateToPlpSubCategory() {
    await this.navigationLinkMain.nth(1).waitFor()
    await this.navigationLinkMain.nth(1).hover()
    await this.desktopNavigationFlyout.waitFor()
    await this.navigationItem.nth(0).click()
    await this.page.waitForLoadState('domcontentloaded')
  }
}
