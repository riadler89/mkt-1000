import type { Locator, Page } from '@playwright/test'
import { Base } from '../base/base'

/**
 * Page Object Model for the Mobile Navigation (Sidebar/Drawer).
 * Encapsulates locators and methods for interacting with mobile-specific navigation elements,
 * including opening the side navigation, performing searches, and navigating through categories.
 */
export class MobileNavigation extends Base {
  // --- General Mobile Navigation Elements ---
  readonly sideNavigationButton: Locator
  readonly mobileSidebar: Locator
  readonly logoutButton: Locator

  // --- Mobile Search Locators ---
  readonly searchInputField: Locator
  readonly searchSuggestionsItem: Locator
  readonly searchDisplayAllResults: Locator
  readonly searchForm: Locator

  // --- Mobile Category Navigation Locators ---
  readonly mobileNavLinkMain: Locator
  readonly mobileNavAccordion: Locator
  readonly mobileNavigationItem: Locator

  /**
   * Initializes the MobileNavigation Page Object.
   * @param page - The Playwright Page object.
   */
  constructor(page: Page) {
    super(page)

    this.sideNavigationButton = page.getByTestId('side-navigation-button')
    this.searchInputField = page.getByTestId('header-search-input')
    this.searchSuggestionsItem = page.getByTestId('search-suggestions-item')
    this.searchDisplayAllResults = page.getByTestId('display-all-results')
    this.searchForm = page.getByTestId('search-form')
    this.mobileSidebar = page.getByTestId('mobile-sidebar')
    this.logoutButton = page.getByTestId('logout-button')
    this.mobileNavLinkMain = page.getByTestId('mobile-nav-link-main')
    this.mobileNavAccordion = page.getByTestId('mobile-nav-accordion')
    this.mobileNavigationItem = page.getByTestId('navigation-item')
  }

  // --- Private Helper Locators & Methods ---

  /**
   * Returns a Locator for a specific mobile main category link based on its data-testid suffix.
   * This is a helper method used internally.
   * @param categoryTestId - The specific part of the data-testid (e.g., 'women', 'men').
   * @returns A Playwright Locator for the specific mobile main category link.
   */
  private getMobileMainCategory(categoryTestId: string): Locator {
    return this.page.getByTestId(`mobile-nav-link-${categoryTestId}`)
  }

  /**
   * Returns a Locator for a specific mobile sub-category link based on its visible text.
   * This is a helper method used internally.
   * @param value - The exact text of the sub-category link (e.g., 'Dresses', 'Hoodies').
   * @returns A Playwright Locator for the specific mobile sub-category link.
   */
  private getMobileSubCategory(value: string): Locator {
    return this.page.getByTestId('mobile-navigation-item').getByText(value)
  }

  /**
   * Returns a Locator for a specific mobile navigation accordion item based on its visible text.
   * This is a helper method used internally.
   * @param value - The exact text of the accordion item (e.g., 'Clothing', 'Shoes').
   * @returns A Playwright Locator for the specific mobile navigation accordion.
   */
  private getMobileNavAccordion(value: string): Locator {
    return this.page.getByTestId('mobile-nav-accordion').getByText(value)
  }

  // --- Action Methods ---

  /**
   * Performs a mobile search by opening the side navigation, filling the search input, and pressing Enter.
   * @param searchTerm - The term to search for.
   */
  async executeSearchMobile(
    searchTerm: string,
    action: 'enter' | 'clickSuggestion' | 'typeOnly' | 'clickMoreResults',
  ) {
    await this.sideNavigationButton.click()
    await this.searchInputField.first().fill(searchTerm)

    switch (action) {
      case 'enter':
        await this.searchInputField.first().press('Enter')
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
        throw new Error(`Unsupported mobile search action: ${action}`)
    }
  }

  /**
   * Initiates a mobile search by opening the side navigation and typing a search term.
   * Does NOT press Enter, allowing for search suggestions to appear.
   * @param searchTerm - The term to type into the search input.
   */
  async startTypingSearchMobile(searchTerm: string) {
    await this.sideNavigationButton.click()
    await this.searchInputField.first().fill(searchTerm)
  }

  async fillSearchTermMobile(searchTerm: string) {
    await this.sideNavigationButton.click()
    await this.searchInputField.first().fill(searchTerm)
  }

  /**
   * Clicks the "Display All Results" or "See all results" button in the mobile search suggestions.
   */
  async clickSearchMoreButtonMobile() {
    await this.searchDisplayAllResults.waitFor()
    await this.searchDisplayAllResults.click()
  }

  /**
   * Navigates to a specific Product Listing Page (PLP) within the mobile navigation hierarchy.
   * This involves opening the side navigation and traversing through category levels.
   * @param mainCategory - The data-testid suffix of the main category.
   * @param categoryLevel2 - The text of the second-level category.
   * @param categoryLevel3 - The text of the third-level category.
   */
  async navigateToPlpMobile(
    mainCategory: string,
    categoryLevel2: string,
    categoryLevel3: string,
  ) {
    await this.sideNavigationButton.click()
    await this.page.waitForLoadState('domcontentloaded')
    await this.getMobileMainCategory(mainCategory).waitFor()
    await this.getMobileMainCategory(mainCategory).click()
    await this.getMobileNavAccordion(categoryLevel2).click()
    await this.getMobileSubCategory(categoryLevel3).click()
    await this.page.waitForLoadState('domcontentloaded')
  }

  /**
   * Navigates to a Product Listing Page (PLP) via a hardcoded path in the mobile navigation.
   * @note This method hardcodes clicking the second main navigation link (`.nth(1)`),
   * the first accordion (`.nth(0)`), and the first navigation item (`.nth(0)`).
   */
  async openPlpMobile() {
    await this.sideNavigationButton.click()
    await this.mobileNavLinkMain.nth(1).click()
    await this.mobileNavAccordion.nth(0).click()
    await this.mobileNavigationItem.nth(0).click()
    await this.page.waitForLoadState('domcontentloaded')
  }
}
