import type { Locator, Page } from 'playwright-core'
import { expect } from '@playwright/test'
import { BREAKPOINTS } from '../../../config/ui'
import type { MobileNavigation } from '../page-objects/components/mobileNavigation'
import type { MainNavigation } from '../page-objects/components/mainNavigation'
import type { Filters } from '../page-objects/components/filters'
import type { Sorting } from '../page-objects/components/sorting'
import type { ProductListingPage } from '../page-objects/productListingPage'
import type { Search } from '../page-objects/components/search'
import { TEST_USERS } from './constants'

// --- Interfaces ---
/**
 * Defines the structure for SEO options that can be verified.
 */
interface SeoOptions {
  title?: string
  description?: string
  robots?: string
  canonical?: string
}

// --- Environment & Core Helpers ---

/**
 * Retrieves a required environment variable, throwing an error if it is not set.
 * @param key The name of the environment variable.
 * @returns The value of the environment variable (guaranteed string).
 * @throws {Error} If the environment variable is not set.
 */
export function getRequiredEnv(key: string): string {
  const value = process.env[key]

  if (value === undefined) {
    throw new Error(
      `Environment variable '${key}' is required but not set. Please check your .env file or CI/CD configuration.`,
    )
  }
  return value
}

/**
 * Determines if the current page is using a mobile viewport based on the configured breakpoint.
 * Returns true if the viewport width is less than BREAKPOINTS.md, false otherwise.
 *
 * @param page - The Playwright Page object
 * @returns boolean indicating if the viewport is mobile
 */
export const isMobile = (page: Page): boolean => {
  const viewportSize = page.viewportSize()

  return !!viewportSize && viewportSize.width < BREAKPOINTS.md
}

/**
 * Returns test user e-mail address and password.
 * To avoid conflicts in parallel test execution, each browser has dedicated test user.
 * Test user email and password keys are stored in constant object `USER_ACCOUNT` within `/playwright/support/constants.ts`.
 * Their values should be defined via environment variables.
 */
export const getUserForBrowser = (
  browserName: string,
): { email: string; password: string } => {
  const browserUserMap: Record<string, string> = {
    /** Should be defined via environment variable `TEST_USER_EMAIL1` */
    chromium: 'testUserEmail1',
    /** Should be defined via environment variable `TEST_USER_EMAIL2` */
    firefox: 'testUserEmail2',
    /** Should be defined via environment variable `TEST_USER_EMAIL3` */
    webkit: 'testUserEmail3',
    /** Should be defined via environment variable `TEST_USER_EMAIL4` */
    'mobile-chrome': 'testUserEmail4',
    /** Should be defined via environment variable `TEST_USER_EMAIL5` */
    'mobile-safari': 'testUserEmail5',
    /** Default fallback is testUserEmail1, but it is strongly recommended to define dedicated test user for every browser. */
    default: 'testUserEmail1',
  }

  const userEmailKey = browserUserMap[browserName] || browserUserMap.default

  return {
    email: TEST_USERS[userEmailKey as keyof typeof TEST_USERS],
    /** Password should be defined via environment variable TEST_USER_PASSWORD */
    password: TEST_USERS.testUserPassword,
  }
}

// --- String Manipulation & Formatting Helpers ---

/**
 * Cleans a navigation item label by removing all digits and trimming whitespace.
 * This is typically used to extract the pure category name from a label that
 * might include a product counter (e.g., "Dresses 123" becomes "Dresses").
 *
 * @param stringValue - The raw string value of the navigation item label.
 * @returns The cleaned string value without digits and leading/trailing whitespace.
 */
export const navigationItemLabel = (stringValue: string) =>
  stringValue.replace(/\d/g, '').trim()

/**
 * Formats an active category breadcrumb label into a URL-friendly segment.
 * It converts the string to lowercase and replaces a trailing product counter
 * (e.g., " 123") with a hyphen "-".
 * Example: "Bekleidung 123" becomes "bekleidung-"
 *
 * @param activeCategoryText - The text content of the active category breadcrumb.
 * @returns The URL-formatted string.
 */
export const formatCategoryUrlSegment = (activeCategoryText: string | null) => {
  const lowercasedText = activeCategoryText?.toLowerCase() ?? ''
  return lowercasedText.replace(/ \d+$/, '-')
}

/**
 * Asynchronously extracts and parses an integer from a locator's text content
 * directly in the browser context.
 *
 * @param locator - The Playwright Locator to evaluate.
 * @returns A Promise that resolves to the parsed integer, or `null` if the
 * text is missing, empty, or not a valid integer.
 */
export const parseLocatorTextToNumber = (
  locator: Locator,
): Promise<number | null> => {
  return locator.evaluate((element) => {
    // This function runs in the browser
    const text = element.textContent?.trim()

    if (!text) {
      return null
    }

    const parsedNumber = Number(text)

    // Ensure the parsed value is a finite integer, not a float or NaN
    return Number.isInteger(parsedNumber) ? parsedNumber : null
  })
}

// --- Test-Specific Helpers (Actions) ---

/**
 * Extracts all unique, absolute, non-mailto, non-hash links from the page.
 * Uses a single browser context operation for performance, leveraging Playwright's `locator.evaluateAll` for robustness.
 *
 * @param page - The Playwright Page object
 * @returns A Set of absolute URLs as strings
 */
export async function getAllLinksFromPage(page: Page): Promise<Set<string>> {
  const links = new Set<string>()
  const pageUrl = page.url()
  // Extract all hrefs from anchor tags using locator.evaluateAll for robustness
  const hrefs = await page
    .locator('a')
    .evaluateAll((anchors) => anchors.map((a) => a.getAttribute('href')))

  for (const link of hrefs) {
    // Warn if href is missing
    expect.soft(link, 'link is missing href attribute').not.toBeFalsy()

    // Filter out mailto and hash links, and ensure link is not null/empty
    if (
      link &&
      !link.startsWith('mailto:') &&
      !link.startsWith('#') &&
      link.trim() !== ''
    ) {
      // Convert to absolute URL
      links.add(new URL(link, pageUrl).href)
    }
  }
  return links
}

/**
 * Navigates to a Product Listing Page (PLP) based on the current device (mobile or desktop).
 * This function encapsulates the device-specific navigation flow.
 *
 * @param page - The Playwright Page object.
 * @param mobileNavigation - The MobileNavigation Page Object.
 * @param mainNavigation - The MainNavigation Page Object.
 */
export async function navigateToPlp(
  page: Page,
  mobileNavigation: MobileNavigation,
  mainNavigation: MainNavigation,
) {
  if (isMobile(page)) {
    await mobileNavigation.openPlpMobile()
  } else {
    await mainNavigation.navigateToPlpMainCategory()
  }
}

/**
 * Applies a sorting option on a Product Listing Page (PLP), adapting the interaction
 * based on whether the current context is mobile or desktop.
 * This function encapsulates the device-specific sorting flow.
 *
 * @param page - The Playwright Page object.
 * @param filters - The Filters Page Object (must extend Base to have responsiveIndex).
 * @param sorting - The Sorting Page Object (must extend Base).
 * @param plp - The ProductListingPage Page Object (must extend Base, used for responsiveIndex).
 * @param sortingOption - The specific sorting parameter to apply (e.g., 'price_desc', 'price_asc').
 */
export async function applySorting(
  page: Page,
  filters: Filters,
  sorting: Sorting,
  plp: ProductListingPage,
  sortingOption: string,
) {
  if (isMobile(page)) {
    await filters.buttonOpenFilters.click()
    await sorting.applySortingMobile(sortingOption)
    await filters.closeFiltersButton.first().click()
  } else {
    await sorting.applySortingDesktop(sortingOption, 0)
  }
}

/**
 * Executes a search operation based on the current device (mobile or desktop).
 * This function encapsulates the device-specific search execution flow and handles
 * different post-typing actions (e.g., pressing Enter, clicking a suggestion).
 *
 * @param page - The Playwright Page object.
 * @param mobileNavigation - The MobileNavigation Page Object.
 * @param search - The Search Page Object.
 * @param searchTerm - The term to search for.
 * @param action - Optional. Defines how the search is completed.
 * 'enter': (Default) Submits by pressing Enter.
 * 'clickSuggestion': Clicks the first search suggestion.
 * 'typeOnly': Only types the search term, no submission.
 * 'clickMoreResults': Clicks "See all results" button.
 */
export async function executeSearch(
  page: Page,
  mobileNavigation: MobileNavigation,
  search: Search,
  searchTerm: string,
  action:
    | 'enter'
    | 'clickSuggestion'
    | 'typeOnly'
    | 'clickMoreResults' = 'enter',
) {
  if (isMobile(page)) {
    await mobileNavigation.executeSearchMobile(searchTerm, action)
  } else {
    await search.executeSearchDesktop(searchTerm, action)
  }
}

/**
 * Clears, focuses, and fills a given input field.
 * @param locator The Playwright locator for the input element.
 * @param value The text value to fill the input with.
 */
export async function fillInput(
  locator: Locator,
  value: string,
): Promise<void> {
  await locator.clear()
  await locator.focus()
  await locator.fill(value)
}

// --- Test-Specific Helpers (Assertions) ---

/**
 * Verifies various SEO (Search Engine Optimization) meta tags and attributes on a given page.
 * This function checks for the presence and correctness of the page title, meta description,
 * robots tag, and canonical link based on the provided options.
 *
 * @param page - The Playwright Page object representing the current web page.
 * @param options - An object containing the SEO properties to verify.
 * Only properties explicitly defined in this object will be checked.
 */
export async function verifySeoMetaTags(page: Page, options: SeoOptions) {
  if (options.title) {
    await expect(page).toHaveTitle(options.title)
  }

  if (options.description) {
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      options.description,
    )
  }

  if (options.robots) {
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      options.robots,
    )
  }

  if (options.canonical) {
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      options.canonical,
    )
  }
}

/**
 * Asserts the visibility of filter and sort buttons on a Product Listing Page (PLP),
 * adapting assertions based on whether the device is mobile or desktop.
 *
 * @param page - The Playwright Page object.
 * @param filters - The Filters Page Object.
 * @param sorting - The Sorting Page Object.
 */
export async function assertFilterAndSortButtons(
  page: Page,
  filters: Filters,
  sorting: Sorting,
) {
  if (isMobile(page)) {
    await expect(filters.buttonOpenFilters).toBeVisible()
  } else {
    await expect(sorting.sortDropdown).toBeVisible()
    await expect(filters.buttonOpenFilters).toBeVisible()
  }
}
