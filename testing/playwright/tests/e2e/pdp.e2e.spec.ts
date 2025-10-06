import { expect } from '@playwright/test'
import { test } from '../../fixtures/fixtures'
import { PDP_E2E } from '../../support/constants'
import { verifySeoMetaTags, navigateToPlp } from '../../support/utils'

/**
 * @file Contains end-to-end tests for the Product Detail Page (PDP),
 * verifying elements like name, brand, price, wishlist functionality,
 * page title, and SEO meta tags.
 */

/**
 * Verifies that the product brand, name, regular price, and
 * tax information are visible on the Product Detail Page.
 */
test('C2141594: Verify PDP name brand, price and image', async ({
  productDetailPage,
  countryDetector,
  page,
  mobileNavigation,
  mainNavigation,
  breadcrumb,
  productListingPage,
}) => {
  await productDetailPage.navigate(page, '/', 'networkidle')
  await page.waitForLoadState('networkidle')
  await countryDetector.closeModal()

  await navigateToPlp(page, mobileNavigation, mainNavigation)
  await breadcrumb.breadcrumbCategoryActive.waitFor()

  await expect(async () => {
    await productListingPage.productImage.first().click()
    await page.waitForLoadState('domcontentloaded')
    await productDetailPage.h1.waitFor()
    await countryDetector.closeModal()
    await productDetailPage.productImageMain.waitFor()

    await expect(productDetailPage.productBrand).toBeVisible()
    await expect(productDetailPage.productName).toBeVisible()
    await expect(productDetailPage.productImageMain).toBeVisible()
    await expect(productDetailPage.priceRegular.first()).toBeVisible()
    await expect(productDetailPage.taxInfo).toBeVisible()
  }).toPass()
})

/**
 * C2141598: Verifies that a user can add a product to their Wishlist from the
 * Product Detail Page and that the Wishlist item counter in the header is updated.
 * It also verifies the removal of the product from the Wishlist, checking if the
 * counter is updated accordingly.
 */
test('C2141598: Verify PDP add and remove to/from Wishlist', async ({
  productDetailPage,
  header,
  page,
  countryDetector,
  mobileNavigation,
  mainNavigation,
  breadcrumb,
  productListingPage,
}) => {
  await productDetailPage.navigate(page, '/', 'networkidle')
  await page.waitForLoadState('networkidle')
  await countryDetector.closeModal()
  await navigateToPlp(page, mobileNavigation, mainNavigation)
  await breadcrumb.breadcrumbCategoryActive.waitFor()
  await productListingPage.productImage.first().click()
  await page.waitForLoadState('domcontentloaded')
  await productDetailPage.h1.waitFor()

  await test.step('Adding product to Wishlist', async () => {
    await productDetailPage.assertAddToWishlistIconVisibility()
    await page.waitForLoadState('networkidle')
    await productDetailPage.addProductToWishlist()
    await productDetailPage.assertRemoveFromWishlistIconVisibility()
    await expect(header.wishlistNumItems).toHaveText('1')
  })

  await test.step('Removing product from Wishlist', async () => {
    await productDetailPage.removeProductFromWishlist()
    await expect(header.wishlistNumItems).not.toBeVisible()
  })
})

/**
 * Verifies the presence and correctness of specific SEO meta tags
 * (robots and canonical) on the Product Detail Page, checks if the
 * main headline (H1) contains the page title and that the product name
 * is contained in the SEO page title.
 */
test('C2141150 C2141757 Verify PDP SEO data', async ({
  productDetailPage,
  countryDetector,
  page,
  mobileNavigation,
  mainNavigation,
  breadcrumb,
  productListingPage,
}) => {
  await productDetailPage.navigate(page, '/', 'networkidle')
  await page.waitForLoadState('networkidle')
  await countryDetector.closeModal()
  await navigateToPlp(page, mobileNavigation, mainNavigation)
  await breadcrumb.breadcrumbCategoryActive.waitFor()
  await productListingPage.productImage.first().click()
  await productDetailPage.h1.waitFor()

  const pageTitle = (await productDetailPage.pageTitle.textContent()) as string
  const pageTitleSEO = await page.title()
  const productName = await productDetailPage.productName.textContent()

  await verifySeoMetaTags(page, {
    robots: PDP_E2E.seoRobots,
    canonical: page.url(),
  })
  await expect(productDetailPage.h1).toBeAttached()
  await expect(productDetailPage.h1).toContainText(pageTitle)
  expect(pageTitleSEO).toContain(productName)
})

/**
 * Verifies that a multi-variant product can be successfully added to the basket from the PDP.
 * The test finds a random product with more than one variant, navigates to its PDP, selects a variant,
 * adds it to the basket, and asserts that the basket count and toast message are correct.
 */
test('C2141595: Verify PDP add to Basket for multi variant product', async ({
  page,
  productDetailPage,
  header,
  toastMessage,
  countryDetector,
  availableMultiVariantProduct,
}) => {
  const productId = availableMultiVariantProduct.id
  console.log(`[PDP Test] Running test with product ID: ${productId}`)
  const pdpUrl = `/p-${productId}`

  await productDetailPage.navigate(page, '/p' + pdpUrl, 'networkidle')
  await countryDetector.closeModal()

  await productDetailPage.variantPicker.waitFor()
  await productDetailPage.productName.waitFor()

  const productName = await productDetailPage.productName.textContent()

  await productDetailPage.variantPicker.waitFor()
  await productDetailPage.variantPicker.click({ force: true })
  await productDetailPage.getVariant().click()
  await productDetailPage.addProductToBasket()

  await expect(header.basketNumItems).toHaveText('1')
  await expect(toastMessage.toastInfo).toContainText(productName as string)
})

/**
 * Verifies that a single-variant product can be successfully added to the basket from the PDP.
 * The test finds a random product with only one variant, navigates to its PDP, adds it to the basket,
 * and asserts that the basket count and toast message are correct.
 */
test('C2141596: Verify PDP add to Basket for single variant product', async ({
  page,
  productDetailPage,
  header,
  toastMessage,
  countryDetector,
  availableSingleVariantProduct,
}) => {
  const productId = availableSingleVariantProduct.id
  console.log(`[PDP Test] Running test with product ID: ${productId}`)
  const pdpUrl = `/p-${productId}`

  await productDetailPage.navigate(page, '/p' + pdpUrl, 'networkidle')
  await countryDetector.closeModal()

  await productDetailPage.variantPicker.waitFor()
  await productDetailPage.productName.waitFor()

  const productName = await productDetailPage.productName.textContent()

  await productDetailPage.addProductToBasket()
  await header.basketNumItems.waitFor()

  await expect(header.basketNumItems).toHaveText('1')
  await expect(toastMessage.toastInfo).toBeVisible()
  await expect(toastMessage.toastInfo).toContainText(productName as string)
})

/**
 * Verifies that a user can click on a product sibling on the PDP and successfully navigate to that sibling's page.
 * The test finds a random product with multiple siblings, navigates to its PDP, clicks a random sibling, and asserts
 * that the new product's ID is reflected in the URL.
 */
test('C2266540: Verify PDP product siblings navigation', async ({
  page,
  productDetailPage,
  countryDetector,
  availableProductWithSiblings,
}) => {
  const initialProductId = availableProductWithSiblings.id
  console.log(`[PDP Test] Running with initial product ID: ${initialProductId}`)
  const initialPdpUrl = `/p-${initialProductId}`

  await productDetailPage.navigate(page, '/p' + initialPdpUrl, 'networkidle')
  await countryDetector.closeModal()

  await test.step('Click a random product sibling and verify URL change', async () => {
    const siblingCount = await productDetailPage.productSiblingLink.count()

    const randomSiblingIndex =
      // eslint-disable-next-line sonarjs/pseudo-random
      Math.floor(Math.random() * (siblingCount - 1)) + 1
    const randomSiblingButton =
      productDetailPage.productSiblingLink.nth(randomSiblingIndex)

    const siblingHref = await randomSiblingButton.getAttribute('href')
    expect(siblingHref).not.toBeNull()

    const siblingProductId = siblingHref!.split('-').pop()

    await randomSiblingButton.click()
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(500)

    expect(page.url()).toContain(siblingProductId as string)
  })

  await test.step('Verify new PDP is loaded and interactive', async () => {
    await productDetailPage.variantPicker.waitFor()

    await expect(productDetailPage.productName).toBeVisible()
  })
})
