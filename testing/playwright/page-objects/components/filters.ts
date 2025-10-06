import type { Locator, Page } from '@playwright/test'
import { Base } from '../base/base'

/**
 * Page Object Model for the Filters component on Product Listing Pages (PLP).
 * Encapsulates locators and methods for interacting with various filter options
 * like price, color, size, and applying/resetting filters.
 */
export class Filters extends Base {
  // --- Filter Control & State Locators ---
  readonly filterButtonMobile: Locator
  readonly filterButtonDesktop: Locator
  readonly filterToggleCounterMobile: Locator
  readonly filterToggleCounterDesktop: Locator
  readonly closeFiltersButton: Locator
  readonly filterSectionHeadline: Locator
  readonly filterApplyButton: Locator
  readonly filterResetButton: Locator

  // --- Specific Filter Type Locators ---
  readonly filterColorChip: Locator
  readonly filterPriceInput: Locator
  readonly filterSizeCheckbox: Locator
  readonly filterSaleSwitch: Locator

  /**
   * Initializes the Filters Page Object.
   * @param page - The Playwright Page object.
   */
  constructor(page: Page) {
    super(page)

    // Filter Controls
    this.closeFiltersButton = page.getByTestId('close-filters')
    this.filterApplyButton = page.getByTestId('apply-filter-button')
    this.filterResetButton = page.getByTestId('reset-filter-button')
    this.filterButtonMobile = page.getByTestId('filter-toggle-button').nth(1)
    this.filterButtonDesktop = page.getByTestId('filter-toggle-button').nth(0)
    this.filterToggleCounterMobile = page
      .getByTestId('filter-toggle-counter')
      .nth(1)
    this.filterToggleCounterDesktop = page
      .getByTestId('filter-toggle-counter')
      .nth(0)

    // Specific Filters
    this.filterColorChip = page.getByTestId('filter-color-chip')
    this.filterSectionHeadline = page.getByTestId('headline')
    this.filterPriceInput = page.getByTestId('price-input')
    this.filterSizeCheckbox = page.getByTestId('checkbox-chip')
    this.filterSaleSwitch = page.getByRole('switch')
  }

  // --- Getter functions ---

  /**
   * Getter for the "filter button" button, handles mobile and desktop viewports.
   */
  public get buttonOpenFilters(): Locator {
    return this.isMobileViewport
      ? this.filterButtonMobile
      : this.filterButtonDesktop
  }

  /**
   * Getter for the "filter counter" button, handles mobile and desktop viewports.
   */
  public get filterCounter(): Locator {
    return this.isMobileViewport
      ? this.filterToggleCounterMobile
      : this.filterToggleCounterDesktop
  }

  // --- Private Helper Locators ---

  /**
   * Returns a locator for a specific size checkbox filter based on its value.
   * This is a helper method used internally for selecting specific size options.
   * @param value - The value of the size filter (e.g., 40, S, M).
   * @returns A Playwright Locator for the specific size checkbox.
   */
  private filterSizeCheckboxValue(value: number): Locator {
    return this.page.locator(
      `input[data-testid='checkbox-chip'][value="${value}"]`,
    )
  }

  // --- Action Methods ---

  /**
   * Opens the filters flyout by clicking the filter toggle button.
   * Handles selection of the correct button for mobile or desktop.
   */
  //async openFilters() {
  //  await targetFilterButton.waitFor({ timeout: 2000 })
  //  await targetFilterButton.click()
  //  await this.page.waitForLoadState('domcontentloaded')
  // }
}
