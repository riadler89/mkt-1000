import { expect } from '@playwright/test'
import { test } from '../../fixtures/fixtures'
import {
  getUserForBrowser,
  verifySeoMetaTags,
  navigateToPlp,
} from '../../support/utils'
import { ROUTES, OSP_TEST_DATA } from '../../support/constants'

/**
 * @file Contains end-to-end tests for the Order Success Page (OSP), verifying
 * order details, product information, price summary, SEO data, CTA buttons,
 * and the error page displayed for incorrect tokens.
 */

/**
 * Prerequisites for all tests:
 * To avoid conflicts between browsers in the process of buying the product, every browser should use its own dedicated test user.
 * Five test users should be registered in the system and their e-mail addresses and password should match the values of
 * environment variables, as follows:
 * - `TEST_USER_EMAIL1` - test user for desktop Chromium.
 * - `TEST_USER_EMAIL2` - test user for desktop Firefox.
 * - `TEST_USER_EMAIL3` - test user for desktop Webkit (Safari).
 * - `TEST_USER_EMAIL4` - test user for mobile Chrome.
 * - `TEST_USER_EMAIL5` - test user for mobile Webkit (Safari).
 * - The password for all test users is the same, and must be defined via `TEST_USER_PASSWORD` environment variable.
 */
test.beforeEach(
  async ({ accountPage, homePage, page, countryDetector }, testInfo) => {
    const projectName = testInfo.project.name
    const { email, password } = getUserForBrowser(projectName)

    await homePage.navigate(page, '/', 'networkidle')
    await page.waitForLoadState('networkidle')
    await countryDetector.closeModal()
    await accountPage.userAuthentication(email, password)
  },
)

/**
 * Verifies the visibility of the greeting box and order data on the OSP.
 * Verifies the visibility of payment and delivery address details on the OSP.
 * Verifies the details of the ordered product(s) on the OSP.
 * Verifies the price summary displayed on the OSP.
 * Verifies the SEO meta tags on the OSP.
 * Verifies the functionality of the "Continue Shopping" and "Order Details" CTA buttons on the OSP.
 * Verifies the overall structure and content of the OSP.
 *
 * Test prerequisite: Since this test "buys" the product, there should be some test product
 * in the system with available quantity in stock.
 */
test('C2173505 C2173506 C2173507 C2173508 C2181795 C2182370 C2181791 Verify OSP', async ({
  checkoutPage,
  page,
  orderSuccessPage,
  homePage,
  mainNavigation,
  mobileNavigation,
  productListingPage,
  productDetailPage,
  countryDetector,
  breadcrumb,
}) => {
  test.setTimeout(60000)

  await test.step('Add product to Basket', async () => {
    await navigateToPlp(page, mobileNavigation, mainNavigation)

    await breadcrumb.breadcrumbCategoryActive.waitFor()
    await productListingPage.productCard.first().waitFor()
    await productListingPage.productImage.first().click()
    await page.waitForLoadState('domcontentloaded')
    await productDetailPage.chooseProductVariant()
    await productDetailPage.addProductToBasket()
  })

  await test.step('Visit Checkout page and continue with order', async () => {
    await orderSuccessPage.navigate(page, ROUTES.checkout, 'networkidle')
    await checkoutPage.basketContainer.waitFor()

    const pageUrl = page.url()

    expect(pageUrl).toContain(ROUTES.checkout)
    await checkoutPage.basketContainer.waitFor()
    await checkoutPage.checkboxAcceptTerms.scrollIntoViewIfNeeded()
    await checkoutPage.checkboxAcceptTerms.check()
    await checkoutPage.ctaPayButton.click()
  })

  await test.step('Verify OSP Order overview', async () => {
    await orderSuccessPage.ospGreetingBox.waitFor()
    await countryDetector.closeModal()

    await expect(orderSuccessPage.ospGreetingBox).toBeVisible()
    await expect(orderSuccessPage.ospGreetingBoxHeadline).toBeVisible()
    await expect(orderSuccessPage.ospOrderData).toBeVisible()
    await expect(orderSuccessPage.ospPaymentData).toBeVisible()
    await expect(orderSuccessPage.ospDeliveryAddress).toBeVisible()
  })

  await test.step('Verify OSP Order product details', async () => {
    await expect(orderSuccessPage.ospDeliveryDate).toBeVisible()
    await expect(orderSuccessPage.ospCarrier).toBeVisible()
    await expect(orderSuccessPage.ospProductCard.first()).toBeVisible()
    await expect(orderSuccessPage.ospProductImage.first()).toBeVisible()
    await expect(orderSuccessPage.ospProductBrand.first()).toBeVisible()
    await expect(orderSuccessPage.ospProductName.first()).toBeVisible()
    await expect(orderSuccessPage.ospProductColor.first()).toBeVisible()
    await expect(orderSuccessPage.ospProductSize.first()).toBeVisible()
    await expect(orderSuccessPage.ospProductQuantity.first()).toBeVisible()
    await expect(orderSuccessPage.ospProductPrice.first()).toBeVisible()
  })

  await test.step('Verify OSP Price summary', async () => {
    await orderSuccessPage.assertOspPriceSummary()
  })

  await test.step('Verify OSP SEO', async () => {
    await verifySeoMetaTags(page, {
      robots: OSP_TEST_DATA.seoRobots,
    })
  })

  await test.step('Verify OSP CTA buttons', async () => {
    await orderSuccessPage.ospButtonContinueShopping.click()
    await homePage.homepageContent.waitFor()

    await expect(homePage.homepageContent).toBeAttached()

    await page.goBack()
    await page.waitForLoadState('networkidle')
    await orderSuccessPage.ospButtonOrderDetails.waitFor()
    await orderSuccessPage.ospButtonOrderDetails.click()
    await page.waitForTimeout(500)

    expect(page.url()).toContain(ROUTES.orders)
  })
})

/**
 * Verifies that when the OSP is visited with an expired
 * confirmation token in the URL, an appropriate error page with a
 * specific headline, subheadline, and icon is displayed. It also checks
 * that the "Continue Shopping" button on the error page navigates
 * the user back to the homepage.
 */
test('C2182954 Verify OSP Error page', async ({
  page,
  orderSuccessPage,
  homePage,
}) => {
  await test.step('Visit OSP with incorrect token and assert page elements', async () => {
    await orderSuccessPage.navigate(
      page,
      OSP_TEST_DATA.incorrectCbdUrl,
      'networkidle',
    )
    await orderSuccessPage.ospEmptyStateContainer.waitFor()

    await expect(orderSuccessPage.ospEmptyStateHeadline).toBeVisible()
    await expect(orderSuccessPage.ospEmptyStateSubheadline).toBeVisible()
    await expect(orderSuccessPage.ospEmptyStateIcon).toBeVisible()
  })

  await test.step('Click Continue Shopping button and assert Homepage is loaded', async () => {
    await orderSuccessPage.ospEmptyStateContinueShoppingButton.waitFor()
    await orderSuccessPage.ospEmptyStateContinueShoppingButton.click()
    await homePage.homepageContent.waitFor()

    await expect(homePage.homepageContent).toBeAttached()
  })
})
