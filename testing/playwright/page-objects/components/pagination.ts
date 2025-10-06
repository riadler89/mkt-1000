import type { Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { Base } from '../base/base'

/**
 * Page Object Model for the Pagination component.
 * Encapsulates locators and methods for interacting with and asserting states of
 * pagination controls (Previous/Next buttons, page number buttons).
 */
export class Pagination extends Base {
  // --- Pagination Button Locators ---
  readonly paginationButtonPrevPage: Locator
  readonly paginationButtonNextPage: Locator

  /**
   * Initializes the Pagination Page Object.
   * @param page - The Playwright Page object.
   */
  constructor(page: Page) {
    super(page)

    this.paginationButtonPrevPage = page.getByTestId(
      'paginationButton-previousPage',
    )
    this.paginationButtonNextPage = page.getByTestId(
      'paginationButton-nextPage',
    )
  }

  // --- Private Helper Locators ---

  /**
   * Returns a Locator for a specific page number button in the pagination.
   * @param pageNumber - The page number as a string (e.g., '1', '2', '3').
   * @returns A Playwright Locator for the specific page number button.
   */
  private paginationPageNumber(pageNumber: string): Locator {
    return this.page.getByTestId(`paginationButton-${pageNumber}`)
  }

  // --- Action Methods ---

  /**
   * Clicks the "Next Page" button.
   */
  async clickNextPage() {
    await this.paginationButtonNextPage.waitFor()
    await this.paginationButtonNextPage.click()
    await this.page.waitForTimeout(1000)
  }

  /**
   * Clicks the "Previous Page" button.
   */
  async clickPreviousPage() {
    await this.paginationButtonPrevPage.waitFor()
    await this.paginationButtonPrevPage.click()
    await this.page.waitForTimeout(1000)
  }

  /**
   * Clicks a specific page number button in the pagination.
   * @param pageNumber - The page number to click as a string (e.g., '3').
   */
  async clickExactPage(pageNumber: string) {
    await this.paginationPageNumber(pageNumber).click()
    await this.page.waitForTimeout(1000)
  }

  // --- Assertion Methods ---

  /**
   * Asserts the initial state of the pagination buttons.
   * Verifies that the "Previous Page" and "Next Page" buttons are visible.
   */
  async assertPaginationInitialState() {
    await this.paginationButtonPrevPage.waitFor()
    await this.paginationButtonPrevPage.scrollIntoViewIfNeeded()
    await expect(this.paginationButtonPrevPage).toBeVisible()
    await expect(this.paginationButtonNextPage).toBeVisible()
  }
}
