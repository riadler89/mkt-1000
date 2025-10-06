import type { Page } from 'playwright-core'
import { expect } from '@playwright/test'
import { test } from '../../fixtures/fixtures'
import { navigateToPlp } from '../../support/utils'
import { ROUTES, TEST_USERS } from '../../support/constants'
import type { MobileNavigation } from '../../page-objects/components/mobileNavigation'
import type { MainNavigation } from '../../page-objects/components/mainNavigation'
import type { ProductListingPage } from '../../page-objects/productListingPage'
import type { ProductDetailPage } from '../../page-objects/productDetailPage'
import type { CountryDetector } from '../../page-objects/components/countryDetector'

interface NavigationFixtures {
  countryDetector: CountryDetector
  mobileNavigation: MobileNavigation
  mainNavigation: MainNavigation
  productListingPage: ProductListingPage
  productDetailPage: ProductDetailPage
}

const PAGE_TYPES = {
  homepage: {
    name: 'Homepage',
    navigate: async (page: Page, baseURL: string) => {
      await page.goto(`${baseURL}${ROUTES.homepageDefault}`, {
        waitUntil: 'domcontentloaded',
      })
    },
  },
  plp: {
    name: 'Product Listing Page (PLP)',
    navigate: async (
      page: Page,
      baseURL: string,
      fixtures: NavigationFixtures,
    ) => {
      await page.goto(`${baseURL}${ROUTES.homepageDefault}`, {
        waitUntil: 'domcontentloaded',
      })
      await page.waitForLoadState('networkidle')
      await fixtures.countryDetector.closeModal()
      await navigateToPlp(
        page,
        fixtures.mobileNavigation,
        fixtures.mainNavigation,
      )
    },
  },
  pdp: {
    name: 'Product Detail Page (PDP)',
    navigate: async (
      page: Page,
      baseURL: string,
      fixtures: NavigationFixtures,
    ) => {
      await page.goto(`${baseURL}${ROUTES.homepageDefault}`, {
        waitUntil: 'domcontentloaded',
      })
      await page.waitForLoadState('networkidle')
      await fixtures.countryDetector.closeModal()
      await navigateToPlp(
        page,
        fixtures.mobileNavigation,
        fixtures.mainNavigation,
      )

      await fixtures.productListingPage.productImage.first().click()
      await fixtures.productDetailPage.variantPicker.waitFor()
    },
  },
  wishlist: {
    name: 'Wishlist',
    navigate: async (page: Page, baseURL: string) => {
      await page.goto(`${baseURL}${ROUTES.wishlist}`, {
        waitUntil: 'domcontentloaded',
      })
    },
  },
  basket: {
    name: 'Basket',
    navigate: async (page: Page, baseURL: string) => {
      await page.goto(`${baseURL}${ROUTES.basket}`, {
        waitUntil: 'domcontentloaded',
      })
    },
  },
  account: {
    name: 'Account',
    navigate: async (page: Page, baseURL: string) => {
      await page.goto(`${baseURL}${ROUTES.account}`, {
        waitUntil: 'domcontentloaded',
      })
    },
  },
  signin: {
    name: 'Sign In',
    navigate: async (page: Page, baseURL: string) => {
      await page.goto(`${baseURL}${ROUTES.signin}`, {
        waitUntil: 'domcontentloaded',
      })
    },
  },
} as const

/**
 * Test suite for hydration testing with non-logged-in (guest) users.
 * Tests various page types to ensure proper hydration without authentication.
 */
test.describe('Hydration Tests (non-logged-in user)', () => {
  const pagesToTest = ['homepage', 'plp', 'pdp', 'wishlist', 'basket', 'signin']

  for (const pageType of pagesToTest) {
    const pageConfig = PAGE_TYPES[pageType as keyof typeof PAGE_TYPES]

    /**
     * Verifies that a specific page type loads without hydration errors for guest users.
     *
     * This test navigates to the specified page type, monitors for hydration-related
     * console errors, reloads the page to test hydration, and verifies the main content
     * is visible after reload.
     *
     * @param page - The Playwright page object
     * @param baseURL - The base URL for the application
     * @param countryDetector - Page object for country detection modal
     * @param mobileNavigation - Page object for mobile navigation
     * @param mainNavigation - Page object for main navigation
     * @param productListingPage - Page object for product listing page
     * @param productDetailPage - Page object for product detail page
     */
    test(`Verify hydration errors on ${pageConfig.name}`, async ({
      page,
      baseURL,
      countryDetector,
      mobileNavigation,
      mainNavigation,
      productListingPage,
      productDetailPage,
    }) => {
      page.on('console', (message) => {
        if (
          (message.type() === 'warning' || message.type() === 'error') &&
          /hydration/i.test(message.text())
        ) {
          const args = message.args()
          const formattedArgs = args.map((arg) => arg.toString()).join(' ')
          throw new Error(
            `Hydration problem detected: ${message.text()}\nArguments: ${formattedArgs}`,
          )
        }
      })

      await pageConfig.navigate(page, baseURL!, {
        countryDetector,
        mobileNavigation,
        mainNavigation,
        productListingPage,
        productDetailPage,
      })

      await page.waitForLoadState('networkidle', { timeout: 7000 })

      await page.reload()
      await page.waitForLoadState('networkidle')

      await expect(page.getByTestId('main-content')).toBeVisible()
    })
  }
})

// Logged-in user tests
/**
 * Test suite for hydration testing with logged-in (authenticated) users.
 * Tests various page types to ensure proper hydration with user authentication.
 * Prerequisite: test user used in this test should have items in Wishlist and Basket, so the non-empty state is tested properly.
 */
test.describe('Hydration Tests (logged-in user)', () => {
  const pagesToTest = [
    'homepage',
    'plp',
    'pdp',
    'wishlist',
    'basket',
    'account',
  ]

  for (const pageType of pagesToTest) {
    const pageConfig = PAGE_TYPES[pageType as keyof typeof PAGE_TYPES]

    test(`Verify hydration errors on ${pageConfig.name}`, async ({
      page,
      baseURL,
      accountPage,
      countryDetector,
      mobileNavigation,
      mainNavigation,
      productListingPage,
      productDetailPage,
    }) => {
      page.on('console', (message) => {
        if (
          (message.type() === 'warning' || message.type() === 'error') &&
          /hydration/i.test(message.text())
        ) {
          const args = message.args()
          const formattedArgs = args.map((arg) => arg.toString()).join(' ')
          throw new Error(
            `Hydration problem detected: ${message.text()}\nArguments: ${formattedArgs}`,
          )
        }
      })

      await pageConfig.navigate(page, baseURL!, {
        countryDetector,
        mobileNavigation,
        mainNavigation,
        productListingPage,
        productDetailPage,
      })

      await page.waitForLoadState('networkidle', { timeout: 7000 })

      await accountPage.userAuthentication(
        TEST_USERS.testUserEmail6,
        TEST_USERS.testUserPassword,
      )

      // Reload page to test hydration
      await page.reload()
      await page.waitForLoadState('networkidle')

      await expect(page.getByTestId('main-content')).toBeVisible()
    })
  }
})
