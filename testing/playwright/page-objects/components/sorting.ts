import type { Locator, Page } from '@playwright/test'
import { Base } from '../base/base'

/**
 * Page Object Model for the Sorting component on Product Listing Pages (PLP).
 * Encapsulates locators and methods for interacting with sorting controls
 * for both desktop (dropdown) and mobile (slider/chips) views.
 */
export class Sorting extends Base {
  // --- General Sorting Controls (e.g., Desktop Dropdown) ---
  readonly sortDropdown: Locator

  // --- Mobile-Specific Sorting Locators ---
  readonly mobileSortWrapper: Locator

  /**
   * Initializes the Sorting Page Object.
   * @param page - The Playwright Page object.
   */
  constructor(page: Page) {
    super(page)

    this.sortDropdown = page.getByTestId('sort-dropdown')
    this.mobileSortWrapper = page.getByTestId('mobile-sort-wrapper')
  }

  // --- Private Helper Locators ---

  /**
   * Returns a Locator for a specific sorting option item.
   * This is a helper method used internally.
   * @param sortingOption - The specific sorting parameter (e.g., 'price_desc', 'name_asc').
   * @returns A Playwright Locator for the specific sorting option item.
   */
  private sortOptionItem(sortingOption: string): Locator {
    return this.page.getByTestId(`sort-item-${sortingOption}`)
  }

  // --- Action Methods ---

  /**
   * Applies a sorting option on desktop by clicking the dropdown and then the specific option.
   * @param sortingOption - The sorting parameter (e.g., 'price_asc', 'price_desc').
   * @param index - The index of the sort dropdown if multiple exist (0 for desktop, 1 for mobile).
   */
  async applySortingDesktop(sortingOption: string, index: number) {
    await this.sortDropdown.nth(index).click()
    await this.sortOptionItem(sortingOption).nth(index).click()
    await this.page.waitForLoadState('domcontentloaded')
  }

  /**
   * Applies a sorting option on mobile devices by clicking the specific sorting chip/link within the slider.
   * @param sortingOption - The sorting parameter (e.g., 'price_desc', 'price_desc').
   */
  async applySortingMobile(sortingOption: string) {
    const specificSortingLinkLocator = this.mobileSortWrapper.locator(
      `a[href*="?sort=${sortingOption}"]`,
    )

    await specificSortingLinkLocator.waitFor({ state: 'visible' })
    await specificSortingLinkLocator.click()
    await this.page.waitForLoadState('domcontentloaded')
  }
}
