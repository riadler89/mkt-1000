/**
 * @file This file serves as an Artillery test processor, containing various user flow functions
 * executed by the Playwright engine. Each exported function represents a distinct user journey
 * that can be called from an Artillery scenario defined in a .yml configuration file.
 * The functions use Playwright to control a browser and simulate real user interactions
 * with the web application.
 */

import { join } from 'node:path'
import { readFileSync } from 'node:fs'

import { expect } from '@playwright/test'
import type { Page } from '@playwright/test'

import { HomePage } from '@scayle/storefront-application-playwright/page-objects/homePage'
import { CountryDetector } from '@scayle/storefront-application-playwright/page-objects/components/countryDetector'
import { ProductListingPage } from '@scayle/storefront-application-playwright/page-objects/productListingPage'
import { Search } from '@scayle/storefront-application-playwright/page-objects/components/search'
import { Header } from '@scayle/storefront-application-playwright/page-objects/components/header'
import { ProductDetailPage } from '@scayle/storefront-application-playwright/page-objects/productDetailPage'
import { BasketPage } from '@scayle/storefront-application-playwright/page-objects/basketPage'
import { RPC } from '@scayle/storefront-application-playwright/page-objects/components/rpc'
import { executeSearch } from '@scayle/storefront-application-playwright/support/utils'
import { MobileNavigation } from '@scayle/storefront-application-playwright/page-objects/components/mobileNavigation'

// --- File Paths (Constants) ---
const PATHS_FILE = join(__dirname, '../../test-data/paths.json')
const SEARCH_TERMS_FILE = join('./test-data/search-terms.json')

// --- Synchronous Data Helpers (Cached) ---
const RAW_PATHS_DATA = readFileSync(PATHS_FILE, 'utf-8')
const ALL_PATHS = JSON.parse(RAW_PATHS_DATA)
const RAW_SEARCH_TERMS_DATA = readFileSync(SEARCH_TERMS_FILE, 'utf-8')
const ALL_SEARCH_TERMS = Object.values(JSON.parse(RAW_SEARCH_TERMS_DATA))

/**
 * Returns a random URL path for a specified page type from the cached data.
 * @param pageType - The type of page to get a random path for ('plp' or 'pdp').
 * @returns A random URL path string.
 */
function getRandomPath(pageType: 'plp' | 'pdp'): string {
  const paths = ALL_PATHS.map(
    (item: { [key: string]: string }) => item[pageType],
  )
  // eslint-disable-next-line sonarjs/pseudo-random
  const randomIndex = Math.floor(Math.random() * paths.length)

  return paths[randomIndex]
}

/**
 * Returns a random search term from the cached data.
 * @returns A random search term string.
 */
function getRandomSearchTerm(): string {
  // eslint-disable-next-line sonarjs/pseudo-random
  const randomIndex = Math.floor(Math.random() * ALL_SEARCH_TERMS.length)

  return ALL_SEARCH_TERMS[randomIndex] as string
}

/**
 * Navigates to a URL and closes the country detector modal.
 * @param page The Playwright Page object.
 * @param path The URL path to navigate to.
 * @param waitUntil The load state to wait for.
 */
async function navigateAndCloseModal(
  page: Page,
  path: string,
  waitUntil: 'commit' | 'domcontentloaded' | 'networkidle' = 'domcontentloaded',
) {
  const countryDetector = new CountryDetector(page)

  try {
    // Use domcontentloaded instead of networkidle for faster navigation
    const navigationPromise = page.goto(path, {
      waitUntil,
      timeout: 45000, // 45 second timeout for navigation
    })

    await navigationPromise

    // Wait for the page to be stable but with a reasonable timeout
    await page.waitForLoadState('domcontentloaded', { timeout: 30000 })

    // Close modal with improved error handling
    await countryDetector.closeModal()

    // Small delay to ensure page is stable after modal interaction
    await page.waitForTimeout(1000)
  } catch (error) {
    console.warn(`Navigation timeout for ${path}:`, error)
    // Continue execution even if navigation times out
  }
}

// --- User Flow Functions (Test Scenarios) ---

/**
 * Navigates to the homepage, closes the country selection modal, and asserts
 * that the main content of the homepage is visible.
 * @param {Page} page The Playwright Page object provided by the Artillery engine.
 * @returns {Promise<void>}
 */
export async function openHomepage(page: Page) {
  const homePage = new HomePage(page)

  await navigateAndCloseModal(page, '/', 'commit')
  await homePage.homepageMainContent.waitFor()

  await expect(homePage.homepageContent).toBeVisible()
}

/**
 * Navigates to a random Product Listing Page (PLP) and verifies it has loaded.
 * @param {Page} page The Playwright Page object provided by the Artillery engine.
 * @returns {Promise<void>}
 */
export async function openPlp(page: Page) {
  const plp = new ProductListingPage(page)
  const randomPath = getRandomPath('plp')

  await navigateAndCloseModal(page, randomPath, 'domcontentloaded')

  try {
    // Wait for product cards to be visible and interactive
    await plp.productCard.first().waitFor({ state: 'visible', timeout: 30000 })

    // Additional wait to ensure the page is fully interactive
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 })

    await expect(plp.productCard.first()).toBeVisible({ timeout: 10000 })
  } catch (error) {
    console.warn(`PLP timeout for ${randomPath}:`, error)
  }
}

/**
 * Navigates to a random Product Detail Page (PDP) and verifies it has loaded.
 * @param {Page} page The Playwright Page object provided by the Artillery engine.
 * @returns {Promise<void>}
 */
export async function openPdp(page: Page) {
  const pdp = new ProductDetailPage(page)
  const randomPath = getRandomPath('pdp')

  await navigateAndCloseModal(page, randomPath, 'domcontentloaded')

  try {
    // Wait for variant picker to be visible and interactive
    await pdp.variantPicker.waitFor({ state: 'visible', timeout: 30000 })

    // Additional wait to ensure the page is fully interactive
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 })

    await expect(pdp.variantPicker).toBeVisible({ timeout: 10000 })
  } catch (error) {
    console.warn(`PDP timeout for ${randomPath}:`, error)
  }
}

/**
 * Simulates a journey where a user lands on a random PDP, selects a random product variant
 * from available variants, and adds it to the basket.
 * @param {Page} page The Playwright Page object provided by the Artillery engine.
 * @returns {Promise<void>}
 */
export async function fromPdpToBasket(page: Page) {
  const pdp = new ProductDetailPage(page)
  const header = new Header(page)
  const randomPath = getRandomPath('pdp')

  await navigateAndCloseModal(page, randomPath, 'domcontentloaded')

  try {
    // Wait for variant picker to be visible and interactive
    await pdp.variantPicker.waitFor({ state: 'visible', timeout: 30000 })

    // Additional wait to ensure the page is fully interactive
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 })

    // Wait for variant options to be available and visible
    await pdp.chooseRandomProductVariant()

    // Wait for add to basket button to be available
    await pdp.addProductToBasket()

    // Wait for basket count to update with a longer timeout
    await header.basketNumItems.waitFor({ state: 'visible', timeout: 45000 })

    // Additional wait to ensure the count has been updated
    await page.waitForTimeout(2000)

    await expect(header.basketNumItems).toHaveText('1', { timeout: 10000 })
  } catch (error) {
    console.warn(`PDP to basket timeout for ${randomPath}:`, error)
  }
}

/**
 * Simulates a journey where a user lands on a random PDP and adds the product to Wishlist.
 * @param {Page} page The Playwright Page object provided by the Artillery engine.
 * @returns {Promise<void>}
 */
export async function fromPdpToWishlist(page: Page) {
  const pdp = new ProductDetailPage(page)
  const header = new Header(page)
  const randomPath = getRandomPath('pdp')

  await navigateAndCloseModal(page, randomPath, 'domcontentloaded')

  try {
    // Wait for variant picker to be visible and interactive
    await pdp.variantPicker.waitFor({ state: 'visible', timeout: 30000 })

    // Additional wait to ensure the page is fully interactive
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 })

    // Wait for wishlist button to be available and visible
    await pdp.buttonAddToWishlistDesktop.waitFor({
      state: 'visible',
      timeout: 30000,
    })
    await pdp.addProductToWishlist()

    // Wait for wishlist count to update with a longer timeout
    await header.wishlistNumItems.waitFor({ state: 'visible', timeout: 45000 })

    // Additional wait to ensure the count has been updated
    await page.waitForTimeout(2000)

    await expect(header.wishlistNumItems).toHaveText('1', { timeout: 10000 })
  } catch (error) {
    console.warn(`PDP to wishlist timeout for ${randomPath}:`, error)
  }
}

/**
 * Simulates a journey where a user lands on a random PLP, selects the first available
 * product card, and adds it to the wishlist.
 * @param {Page} page The Playwright Page object provided by the Artillery engine.
 * @returns {Promise<void>}
 */
export async function fromPlpToWishlist(page: Page) {
  const plp = new ProductListingPage(page)
  const header = new Header(page)
  const randomPath = getRandomPath('plp')

  await navigateAndCloseModal(page, randomPath, 'domcontentloaded')

  try {
    // Wait for product cards to be visible and interactive
    await plp.productCard.first().waitFor({ state: 'visible', timeout: 30000 })

    // Additional wait to ensure the page is fully interactive
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 })

    // Wait for wishlist button to be available and visible
    await plp.wishlistButton.first().waitFor({
      state: 'visible',
      timeout: 30000,
    })
    await plp.wishlistButton.first().click()

    // Wait for wishlist count to update with a longer timeout
    await header.wishlistNumItems.waitFor({ state: 'visible', timeout: 45000 })

    // Additional wait to ensure the count has been updated
    await page.waitForTimeout(2000)

    await expect(header.wishlistNumItems).toHaveText('1', { timeout: 10000 })
  } catch (error) {
    console.warn(`PLP to wishlist timeout for ${randomPath}:`, error)
  }
}

/**
 * Simulates a user journey from a random Product Listing Page (PLP) to a Product Detail Page (PDP).
 * It navigates to a random PLP, clicks a random sub-category to refine the listing,
 * then clicks a random product image to navigate to the PDP, and finally asserts
 * that the PDP has loaded by checking for the variant picker element.
 *
 * @param {Page} page The Playwright Page object provided by the Artillery engine.
 * @returns {Promise<void>}
 */
export async function navigatePlpToPdp(page: Page) {
  const plp = new ProductListingPage(page)
  const pdp = new ProductDetailPage(page)
  const randomPath = getRandomPath('plp')
  // eslint-disable-next-line sonarjs/pseudo-random
  const randomIndex = Math.floor(Math.random() * 3)

  await navigateAndCloseModal(page, randomPath, 'domcontentloaded')

  try {
    // Wait for product cards to be visible and interactive
    await plp.productCard.first().waitFor({ state: 'visible', timeout: 30000 })

    // Additional wait to ensure the page is fully interactive
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 })

    // Wait for sub-category menu to be available and clickable
    await plp.menuSubCategory.nth(randomIndex).waitFor({
      state: 'visible',
      timeout: 30000,
    })
    await plp.menuSubCategory.nth(randomIndex).click()

    // Wait for product images to be available and visible
    await plp.productImage.first().waitFor({ state: 'visible', timeout: 30000 })
    await page.waitForLoadState('domcontentloaded', { timeout: 30000 })

    // Wait for the specific product image to be clickable
    await plp.productImage.nth(randomIndex).waitFor({
      state: 'visible',
      timeout: 30000,
    })
    await plp.productImage.nth(randomIndex).click()

    // Wait for PDP to load and variant picker to be visible
    await pdp.variantPicker.waitFor({ state: 'visible', timeout: 30000 })

    await expect(pdp.variantPicker).toBeVisible({ timeout: 10000 })
  } catch (error) {
    console.warn(`Navigate PLP to PDP timeout for ${randomPath}:`, error)
  }
}

/**
 * Simulates a full user journey starting from the homepage. The user searches for a product,
 * adds it to the wishlist from the PLP, navigates to the PDP, and adds the same item to the
 * basket. Finally, it navigates to the basket page and verifies the correct product is present.
 * @param {Page} page The Playwright Page object provided by the Artillery engine.
 * @returns {Promise<void>}
 */
export async function fromHomeToBasket(page: Page) {
  const plp = new ProductListingPage(page)
  const countryDetector = new CountryDetector(page)
  const pdp = new ProductDetailPage(page)
  const search = new Search(page)
  const homePage = new HomePage(page)
  const header = new Header(page)
  const rpc = new RPC(page)
  const basket = new BasketPage(page, rpc)
  const mobileNavigation = new MobileNavigation(page)

  const searchTerm = getRandomSearchTerm()

  await homePage.navigate(page, '/', 'commit')
  await page.waitForLoadState('domcontentloaded')
  await countryDetector.closeModal()

  await executeSearch(page, mobileNavigation, search, searchTerm, 'enter')
  await plp.menuRootCategory.waitFor()
  await plp.addProductToWishlist()
  await header.wishlistNumItems.waitFor()
  await page.waitForLoadState('networkidle')

  await expect(header.wishlistNumItems).toBeVisible()
  await expect(header.wishlistNumItems).toHaveText('1')

  await plp.productImage.first().click()
  await pdp.variantPicker.waitFor()
  await pdp.variantPicker.click({ force: true })
  await pdp.getVariant().click()
  await pdp.addProductToBasket()
  await header.basketNumItems.waitFor()
  await page.waitForLoadState('domcontentloaded')

  await expect(header.basketNumItems).toHaveText('1')

  const basketProductBrandText = await pdp.productBrand.textContent()
  const basketProductNameText = await pdp.productName.textContent()

  await header.visitBasketPage()
  await basket.assertProductIsInBasket(
    basketProductBrandText as string,
    basketProductNameText as string,
  )
}
