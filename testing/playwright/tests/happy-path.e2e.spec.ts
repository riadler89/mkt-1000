import { expect } from '@playwright/test'
import { test } from '../fixtures/fixtures'
import { navigateToPlp } from '../support/utils'
import { ROUTES } from '../support/constants'

/**
 * Simulates a happy path user journey starting from the homepage,
 * navigating to a Product Listing Page (PLP), adding a product to the wishlist,
 * opening the Product Detail Page (PDP), adding the product to the basket,
 * and finally navigating to the checkout page, without "buying" the product.
 * The basket is emptied at the end to ensure a clean state for subsequent tests.
 */
test('C2139186: E2E from Home to Checkout - happy path', async ({
  homePage,
  productListingPage,
  productDetailPage,
  header,
  basketPage,
  page,
  signinPage,
  mobileNavigation,
  countryDetector,
  mainNavigation,
  breadcrumb,
}) => {
  await test.step('Navigate to PLP', async () => {
    await homePage.navigate(page, '/', 'networkidle')
    await page.waitForLoadState('networkidle')
    await countryDetector.closeModal()
    await navigateToPlp(page, mobileNavigation, mainNavigation)
    await breadcrumb.breadcrumbCategoryActive.waitFor()
  })

  await test.step('Add product to Wishlist from PLP', async () => {
    await expect(async () => {
      await productListingPage.addProductToWishlist()
      await page.waitForLoadState('networkidle')
      await expect(header.wishlistNumItems).toBeVisible()
      await expect(header.wishlistNumItems).toHaveText('1')
    }).toPass()
  })

  await test.step('Open PDP and add product to Basket', async () => {
    await expect(async () => {
      await productListingPage.productImage.first().click()
      await productDetailPage.variantPicker.waitFor()
      await productDetailPage.chooseProductVariant()
      await productDetailPage.addProductToBasket()
    }).toPass()
    const basketProductBrandText =
      await productDetailPage.productBrand.textContent()
    const basketProductNameText =
      await productDetailPage.productName.textContent()

    await expect(async () => {
      await header.visitBasketPage()
      await basketPage.basketProductCard.first().waitFor()
      await basketPage.assertProductIsInBasket(
        basketProductBrandText as string,
        basketProductNameText as string,
      )
    }).toPass()
  })

  await test.step('Go to Checkout page', async () => {
    await expect(async () => {
      await basketPage.checkoutButton.waitFor({ state: 'visible' })
      await basketPage.checkoutButton.click()
      await signinPage.loginButton.waitFor({ state: 'visible' })
      expect(page.url()).toContain(ROUTES.homepageDefault + ROUTES.checkout)
    }).toPass()
  })

  await test.step('Empty Basket to have clean state after test execution', async () => {
    await expect(async () => {
      await header.backToShopButton.click()
      await page.waitForLoadState('networkidle')
      await homePage.homepageContent.waitFor()
      await countryDetector.closeModal()
      await header.visitBasketPage()
      await basketPage.basketProductCard.first().waitFor()
      await basketPage.removeItemFromBasket()
    }).toPass()
  })
})
