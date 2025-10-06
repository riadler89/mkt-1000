import type { Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { Base } from '../base/base'

/**
 * Page Object Model for the Store Locator functionality.
 * Encapsulates locators and methods for navigating to the store locator page,
 * searching for locations, and interacting with the list of stores.
 */
export class StoreLocator extends Base {
  // --- Store Locator Navigation Links ---
  readonly storeLocatorLink: Locator
  readonly storeLocatorLinkMobile: Locator

  // --- Location Search Controls ---
  readonly locationTextInput: Locator
  readonly locationSearchButton: Locator

  // --- Store List Results ---
  readonly locationStoreList: Locator
  readonly locationStoreListItem: Locator

  /**
   * Initializes the StoreLocator Page Object.
   * @param page - The Playwright Page object.
   */
  constructor(page: Page) {
    super(page)

    this.storeLocatorLink = page.getByTestId('store-location-link')
    this.storeLocatorLinkMobile = page.getByTestId('store-location-link-mobile')
    this.locationTextInput = page.getByTestId('location-text-input')
    this.locationSearchButton = page.getByTestId('location-search-button')
    this.locationStoreList = page.getByTestId('location-store-list')
    this.locationStoreListItem = page.getByTestId('location-store-list-item')
  }

  // --- Action Methods ---

  /**
   * Opens the main location page by clicking the appropriate store locator link.
   * Chooses between mobile and desktop links based on the current device.
   */
  async openLocationPage() {
    if (this.isMobileViewport) {
      await this.storeLocatorLinkMobile.waitFor()
      await this.storeLocatorLinkMobile.scrollIntoViewIfNeeded()
      await this.storeLocatorLinkMobile.click()
    } else {
      await this.storeLocatorLink.click()
    }

    await this.page.waitForLoadState('networkidle')
  }

  /**
   * Types a search term into the location search input field.
   * @param searchTerm - The location (e.g., city, postcode) to search for.
   */
  async typeLocationSearch(searchTerm: string) {
    await this.locationTextInput.clear()
    await this.locationTextInput.fill(searchTerm)
  }

  /**
   * Triggers the location search by clicking the search button.
   */
  async triggerSearch() {
    await expect(async () => {
      await this.locationSearchButton.waitFor()
      await this.locationSearchButton.click()
    }).toPass()
  }

  /**
   * Performs a complete navigation to the location page,
   * fills the search input, but does NOT trigger the search.
   * @param searchTerm - The location search term to fill.
   */
  async navigateToLocationPage(searchTerm: string) {
    await expect(async () => {
      await this.openLocationPage()
      await this.locationTextInput.waitFor()

      const pageUrl = this.page.url()

      expect(pageUrl).toContain('/location')
      await this.typeLocationSearch(searchTerm)
    }).toPass()
  }

  // --- Assertion Methods ---

  /**
   * Asserts that the list of stores is loaded and visible, and at least one store item is present.
   */
  async assertStoreListIsLoaded() {
    await this.page.waitForLoadState('networkidle')
    await expect(this.locationStoreList).toBeVisible()
    await expect(this.locationStoreListItem.first()).toBeVisible()
  }
}
