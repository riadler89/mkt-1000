import { expect } from '@playwright/test'
import { test } from '../../fixtures/fixtures'
import { getUserForBrowser, navigateToPlp } from '../../support/utils'
import { ROUTES } from '../../support/constants'

/**
 * @file Contains end-to-end tests for verifying the order overview page during the checkout process.
 */

/**
 * Performs setup before each test case within this file.
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
 * Verifies the elements present on the checkout order overview page,
 * including items in the basket and delivery estimates.
 * Verifies the presence of a simplified footer on the checkout page
 * and the functionality to remove an item, leading to an empty basket state.
 *
 * Note: this test doesn't "buy" the product. The last verification point is on the
 * Checkout order overview page.
 */
test('C2132536 C2144177 Verify Checkout order overview', async ({
  checkoutPage,
  page,
  footer,
  mainNavigation,
  mobileNavigation,
  productListingPage,
  productDetailPage,
  breadcrumb,
  header,
  homePage,
  basketPage,
}) => {
  test.setTimeout(60000)
  await test.step('Adding product to Basket', async () => {
    await navigateToPlp(page, mobileNavigation, mainNavigation)
    await breadcrumb.breadcrumbCategoryActive.waitFor()
    await productListingPage.productImage.first().click()
    await productDetailPage.variantPicker.waitFor()
    await productDetailPage.chooseProductVariant()
    await productDetailPage.addProductToBasket()
    await productDetailPage.navigate(page, ROUTES.checkout, 'networkidle')
  })
  await test.step('Visit Checkout page and check Items', async () => {
    const pageUrl = page.url()

    expect(pageUrl).toContain(ROUTES.checkout)
    await expect(async () => {
      await checkoutPage.basketContainer.waitFor()
      await expect(checkoutPage.basketContainer).toBeAttached()
      await expect(checkoutPage.itemQuantity).toBeVisible()
      await expect(checkoutPage.deliveryEstimate).toBeVisible()
    }).toPass()
  })

  await test.step('Verify simplified Footer in Checkout', async () => {
    await expect(footer.footerCopyright).toBeVisible()

    const count = await footer.simpleFooterLink.count()

    for (let i = 0; i < count; i++) {
      const link = footer.simpleFooterLink.nth(i)
      const href = await link.getAttribute('href')
      if (href) {
        try {
          const response = await page.request.head(href)

          expect(response.status()).toBeLessThan(400)
        } catch (error) {
          console.error(`Error checking link ${href}:`, error)
        }
      } else {
        console.warn(`Link element ${i} does not have an href attribute.`)
      }
      await expect(footer.simpleFooterLink.nth(i)).toHaveAttribute(
        'target',
        '_blank',
        { timeout: 5000 },
      )
    }
  })
  await test.step('Go back to Shop and remove item from Basket', async () => {
    await header.backToShopButton.click()
    await homePage.homepageContent.waitFor()
    await header.visitBasketPage()
    await basketPage.removeItemButton.first().waitFor()
    await basketPage.removeItemFromBasket()

    await expect(basketPage.emptyState).toBeVisible()
  })
})
