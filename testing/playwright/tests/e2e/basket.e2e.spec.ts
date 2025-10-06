import { expect } from '@playwright/test'
import { test } from '../../fixtures/fixtures'
import {
  getUserForBrowser,
  verifySeoMetaTags,
  navigateToPlp,
} from '../../support/utils'
import { BASKET_TEST_DATA, ROUTES } from '../../support/constants'

/**
 * @file Contains end-to-end tests for the shopping basket page functionality.
 * This suite covers empty states, adding/removing products, and SEO verification.
 */

/**
 * Verifies that when a guest user navigates to the basket page,
 * the empty basket state with appropriate title and subtitle is displayed.
 * Verifies that when a logged-in user with an empty basket navigates
 * to the basket page, the empty basket state is displayed, and the user has
 * the option to continue shopping.
 *
 * Prerequisite for this test:
 * To avoid conflicts between browsers in empty and non-empty states, every browser should use its own dedicated test user.
 * Five test users should be registered in the system and their e-mail addresses and password should match the values of
 * environment variables, as follows:
 * - `TEST_USER_EMAIL1` - test user for desktop Chromium.
 * - `TEST_USER_EMAIL2` - test user for desktop Firefox.
 * - `TEST_USER_EMAIL3` - test user for desktop Webkit (Safari).
 * - `TEST_USER_EMAIL4` - test user for mobile Chrome.
 * - `TEST_USER_EMAIL5` - test user for mobile Webkit (Safari).
 * - The password for all test users is the same, and must be defined via `TEST_USER_PASSWORD` environment variable.
 */
test('C2132186 C2132187 Verify Basket empty state as a guest and logged in user', async ({
  header,
  basketPage,
  signinPage,
  page,
  countryDetector,
}, testInfo) => {
  await test.step('Verify guest user', async () => {
    await basketPage.navigate(page, '/', 'networkidle')
    await countryDetector.closeModal()
    await header.headerBasketButton.click()
    await page.waitForLoadState('domcontentloaded')
    await expect(async () => {
      expect(page.url()).toContain(ROUTES.basket)
      await expect(basketPage.basketEmptyStateTitle).toBeVisible()
      await expect(basketPage.basketEmptyStateSubTitle).toBeVisible()
    }).toPass()
  })
  await test.step('Verify logged-in user', async () => {
    await basketPage.assertContinueButton()
    await header.headerBasketButton.waitFor()
    await header.headerBasketButton.click()
    await page.waitForTimeout(1000)
    await basketPage.assertLoginButton()

    const projectName = testInfo.project.name
    const { email, password } = getUserForBrowser(projectName)

    await signinPage.fillLoginData(email, password)
    await signinPage.clickLoginButton()
    expect(page.url()).toContain(ROUTES.basket)
    await basketPage.h1.waitFor()
    await page.waitForLoadState('domcontentloaded')
    try {
      await basketPage.removeItemButton
        .first()
        .waitFor({ state: 'visible', timeout: 5000 })
      await basketPage.removeItemFromBasket()
    } catch (error) {
      console.error(
        `Basket is already empty. Continuing test execution. ${error}`,
      )
    }
    await expect(basketPage.loginButton).not.toBeVisible()
    await expect(basketPage.continueButton).toBeVisible()
    await header.headerBasketButton.click()
    await basketPage.assertContinueButton()
  })
})

/**
 * Verifies that a guest user can add a product to the basket,
 * then logs in, and the added product persists in their basket after login, and the ability
 * to remove a product from the basket.
 *
 * Prerequisites for this test are the same as for the test "C2132186 C2132187 Verify Basket empty state as a guest and logged in user".
 * This test is using the same dedicated test users per browser, defined via environment variables.
 */
test('C2132198 C2162476 Verify add to Basket', async ({
  header,
  basketPage,
  countryDetector,
  signinPage,
  page,
  mobileNavigation,
  mainNavigation,
  productListingPage,
  productDetailPage,
  breadcrumb,
}, testInfo) => {
  await test.step('Add product to Basket, log in and assert the product is still in Basket', async () => {
    await basketPage.navigate(page, '/', 'networkidle')
    await countryDetector.closeModal()

    await navigateToPlp(page, mobileNavigation, mainNavigation)
    await breadcrumb.breadcrumbCategoryActive.waitFor()
    await productListingPage.productImage.first().click()
    await productDetailPage.variantPicker.waitFor()

    const productBrand =
      (await productDetailPage.productBrand.textContent()) as string
    const productName =
      (await productDetailPage.productName.textContent()) as string

    await productDetailPage.chooseProductVariant()
    await productDetailPage.addProductToBasket()
    await header.visitBasketPage()
    await page.waitForLoadState('domcontentloaded')
    await expect(header.basketNumItems).toHaveText('1')
    await basketPage.assertProductIsInBasket(productBrand, productName)
    await header.headerLoginButton.click()

    const projectName = testInfo.project.name
    const { email, password } = getUserForBrowser(projectName)

    await signinPage.fillLoginData(email, password)
    await header.visitBasketPage()
    await basketPage.assertProductIsInBasket(productBrand, productName)
  })

  /**
   * As a part of verifying Basket functionalities, this step verifies Basket SEO data.
   * Since the product is in Basket, the page is loaded and user is logged-in,
   * this step eliminates the need to repeat adding to basket and logging in in a separated test.
   */
  await test.step('Check Basket SEO data', async () => {
    await expect(async () => {
      await basketPage.h1.waitFor()

      const pageTitle = (await basketPage.pageTitle
        .nth(0)
        .textContent()) as string

      await verifySeoMetaTags(page, {
        robots: BASKET_TEST_DATA.seoRobots,
        canonical: page.url(),
      })
      await expect(basketPage.h1).toBeAttached()
      await expect(basketPage.h1).toContainText(pageTitle)
    }).toPass()
  })
  await test.step('Remove product from Basket', async () => {
    await expect(async () => {
      await basketPage.removeItemFromBasket()
      await expect(header.basketNumItems).not.toBeVisible()
    }).toPass()
  })
})

/**
 * Verifies that the price summary in the basket is calculated correctly for a single, regular-priced (non-sale) product.
 *
 * This test ensures that when a regular item is added to the cart, the subtotal and final price on the basket page
 * match the product's price, and no unexpected discounts are applied. It serves as a key regression test for the
 * core basket calculation logic.
 */
test('C2167319 Verify Basket Price summary - regular product', async ({
  header,
  basketPage,
  countryDetector,
  page,
  availableRegularProduct,
  productDetailPage,
}) => {
  await test.step('Add regular product to Basket', async () => {
    const initialProductId = availableRegularProduct.id
    console.log(
      `[PDP Test] Running with initial product ID: ${initialProductId}`,
    )
    const initialPdpUrl = `/p-${initialProductId}`

    await productDetailPage.navigate(page, '/p' + initialPdpUrl, 'networkidle')
    await countryDetector.closeModal()

    await productDetailPage.variantPicker.waitFor()
    await productDetailPage.chooseProductVariant()
    await productDetailPage.addProductToBasket()

    await header.visitBasketPage()
    await page.waitForLoadState('domcontentloaded')
    await expect(header.basketNumItems).toHaveText('1')
  })

  await test.step('Check regular product price summary', async () => {
    await basketPage.priceFinal.waitFor()
    await basketPage.assertBasketPriceSummary()
  })
})
