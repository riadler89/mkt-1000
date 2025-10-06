import type { Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { Base } from '../base/base'

/**
 * Page Object Model for the Shop Selector component.
 * Encapsulates locators and methods for interacting with the shop/country switcher,
 * verifying its states, and asserting shop changes.
 */
export class ShopSelector extends Base {
  // --- Core Shop Selector Elements ---
  readonly shopSelectorListbox: Locator
  readonly globeIcon: Locator
  readonly shopSelectorList: Locator
  readonly shopLanguageItem: Locator
  readonly shopLanguageItemCurrent: Locator
  readonly shopSelectorFlyout: Locator

  // --- Current Shop/Country Display Locators ---
  readonly currentShop: Locator
  readonly currentShopMobile: Locator
  readonly currentCountry: Locator

  // --- Country/Region Selection Locators ---
  readonly country: Locator

  /**
   * Initializes the ShopSelector Page Object.
   * @param page - The Playwright Page object.
   */
  constructor(page: Page) {
    super(page)

    this.shopSelectorListbox = page.getByTestId('language-listbox')
    this.globeIcon = page.getByTestId('shop-switcher-globe-icon')
    this.currentShop = page.getByTestId('shop-switcher-current-shop')
    this.shopLanguageItem = page.getByTestId('shop-language-item')
    this.shopLanguageItemCurrent = page.getByTestId(
      'shop-language-item-current',
    )
    this.shopSelectorList = page.getByTestId('shop-selector-list')
    this.currentShopMobile = page.getByTestId(
      'shop-switcher-current-shop-mobile',
    )
    this.currentCountry = page.getByTestId('shop-selector-current-country')
    this.country = page.getByTestId('shop-selector-country')
    this.shopSelectorFlyout = page.getByTestId('slide-in-overflow')
  }

  // --- Action Methods ---

  /**
   * Opens the shop selector dropdown/listbox.
   * @param index - The index of the shop selector button to click (0 for desktop, 1 for mobile).
   */
  async openShopSelector(index: number) {
    await this.shopSelectorListbox.nth(index).click({ force: true })
    await this.page.waitForTimeout(1000)
    await this.shopSelectorFlyout.nth(1).waitFor()
    await this.currentCountry.waitFor()
    await this.country.first().waitFor()
  }

  /**
   * Clicks on the first available country in the shop selector list to switch shops.
   * Assumes the shop selector is already open.
   */
  async clickSwitchShop() {
    await this.country.first().click({ force: true })
  }

  /**
   * Clicks on the currently selected country in the shop selector list.
   * This action should typically result in no shop change.
   */
  async clickSwitchShopToCurrent() {
    await this.currentCountry.first().click({ force: true })
  }

  // --- Assertion Methods ---

  /**
   * Asserts the visibility and initial state of the shop selector component.
   * Verifies the listbox and globe icon are visible and that the listbox is in a closed state.
   * @param index - The index of the shop selector component to assert (0 for desktop, 1 for mobile).
   */
  async assertShopSelectorIsVisible(index: number) {
    await this.shopSelectorListbox.nth(index).waitFor()
    await expect(this.globeIcon.nth(index)).toBeVisible()
    await expect(this.shopSelectorListbox.nth(index)).toBeVisible()
    await expect(this.shopSelectorListbox.nth(index)).toHaveAttribute(
      'aria-expanded',
      'false',
    )
  }

  /**
   * Asserts that the current page URL has changed, indicating a successful shop switch.
   * @param initialUrl - The URL of the page before attempting the shop switch.
   */
  async assertUrlHasChanged(initialUrl: string) {
    await this.page.waitForLoadState('domcontentloaded')

    const newUrl = this.page.url()

    expect(newUrl).not.toEqual(initialUrl)
  }

  /**
   * Asserts that the current page URL has not changed, indicating that no shop switch occurred.
   * @param initialUrl - The URL of the page before attempting the shop switch.
   */
  async assertUrlHasNotChanged(initialUrl: string) {
    await this.page.waitForLoadState('domcontentloaded')

    const newUrl = this.page.url()

    expect(newUrl).toEqual(initialUrl)
  }
}
