import type { Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { Base } from '../base/base'

/**
 * Page Object Model for the Search functionality.
 * Encapsulates locators and methods for interacting with search inputs,
 * managing search results, and verifying search suggestions and pages.
 */
export class Search extends Base {
  // --- Search Input & Form Locators ---
  /**
   * Locator for the main search input field (e.g., in the header or a flyout).
   * @note This locator often targets a specific search input instance (e.g., desktop header search, commonly `nth(1)` if there are multiple).
   */
  readonly searchInputMobile: Locator
  readonly searchInputDesktop: Locator
  readonly searchForm: Locator
  readonly searchResetButton: Locator

  // --- Search Results & Flyout Locators ---
  readonly searchResultsFlyout: Locator
  readonly searchResultsProductImage: Locator
  readonly searchResultsHeadline: Locator
  readonly searchDisplayAllResults: Locator
  readonly h1: Locator

  // --- Search Suggestions Locators ---
  readonly searchSuggestionsTagGroup: Locator
  readonly searchSuggestionsItem: Locator

  /**
   * Initializes the Search Page Object.
   * @param page - The Playwright Page object.
   */
  constructor(page: Page) {
    super(page)

    this.searchInputMobile = page.getByTestId('header-search-input').nth(0)
    this.searchInputDesktop = page.getByTestId('header-search-input').nth(1)
    this.searchResultsFlyout = page.getByTestId('search-results-flyout')
    this.searchResultsProductImage = page.getByTestId('product-image')
    this.searchResultsHeadline = page.getByTestId('headline')
    this.searchDisplayAllResults = page.getByTestId('display-all-results')
    this.searchSuggestionsTagGroup = page.getByTestId(
      'search-suggestion-tag-group',
    )
    this.searchSuggestionsItem = page.getByTestId('search-suggestions-item')
    this.searchForm = page.getByTestId('search-form')
    this.searchResetButton = page.getByTestId('search-reset-button')
    this.h1 = page.locator('h1')
  }

  // --- Getter functions ---

  /**
   * Getter for the "search" input, handles mobile and desktop viewports.
   */
  public get searchInput(): Locator {
    return this.isMobileViewport
      ? this.searchInputMobile
      : this.searchInputDesktop
  }

  // --- Action Methods ---

  /**
   * Executes a search by filling the input field and pressing Enter.
   * @param searchTerm - The term to search for.
   * @note This method hardcodes interaction with the second search input (`.nth(1)`), likely the desktop header search.
   */
  async executeSearchDesktop(
    searchTerm: string,
    action: 'enter' | 'clickSuggestion' | 'typeOnly' | 'clickMoreResults',
  ) {
    await this.searchInput.click({ force: true })
    await this.searchInput.fill(searchTerm)

    switch (action) {
      case 'enter':
        await this.searchInput.press('Enter')
        break
      case 'clickSuggestion':
        await this.searchSuggestionsItem.first().waitFor()
        await this.searchSuggestionsItem.first().click()
        break
      case 'clickMoreResults':
        await this.searchDisplayAllResults.waitFor()
        await this.searchDisplayAllResults.click()
        break
      case 'typeOnly':
        break
      default:
        throw new Error(`Unsupported desktop search action: ${action}`)
    }
  }

  /**
   * Starts typing a search term into the input field, but does not submit the search.
   * This is typically used to trigger search suggestions or a search flyout.
   * @param searchTerm - The term to type into the search input.
   */
  async startTypingSearchDesktop(searchTerm: string) {
    await this.searchInput.click({ force: true })
    await this.searchInput.fill(searchTerm)
  }

  async fillSearchTermDesktop(searchTerm: string) {
    await this.searchInput.click({ force: true })
    await this.searchInput.fill(searchTerm)
  }

  /**
   * Clicks the "Display All Results" button in the search suggestions/flyout.
   */
  async clickSearchMoreButton() {
    await this.searchDisplayAllResults.waitFor()
    await this.searchDisplayAllResults.click()
  }

  /**
   * Clicks on the first exact product match suggestion item from the search suggestions.
   */
  async clickExactProductItem() {
    await this.searchSuggestionsItem.click()
  }

  // --- Assertion Methods ---

  /**
   * Asserts that the search results headline contains the specified search term.
   * @param searchTerm - The term expected to be present in the headline.
   */
  async assertHeadlineSearchResults(searchTerm: string) {
    await expect(this.searchResultsHeadline.first()).toContainText(searchTerm)
  }

  /**
   * Asserts that the current page URL contains a specific path segment.
   * Useful for verifying navigation after a search or suggestion click.
   * @param path - The path segment expected to be in the URL (e.g., 'search?filters', '/p/product-id').
   */
  async assertUrlIsLoaded(path: string) {
    const pageUrl = this.page.url()

    expect(pageUrl).toContain(path)
  }
}
