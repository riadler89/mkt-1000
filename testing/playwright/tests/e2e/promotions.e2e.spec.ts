import { expect } from '@playwright/test'
import { test } from '../../fixtures/fixtures'

/**
 * @file Contains end-to-end tests for verifying the functionality and
 * visibility of promotion elements, including the promotion ribbon and flyout.
 *
 * Prerequisite for these tests is to have active promotions.
 * If there are no promotions set, the tests can be skipped by setting `test.skip` for each test.
 * Once when promotions are set and activated, the tests can be activated again.
 */

test.beforeEach(async ({ homePage, countryDetector, page }) => {
  await homePage.navigate(page, '/', 'networkidle')
  await countryDetector.closeModal()
})

/**
 * Verifies that the promotion ribbon is visible on the homepage
 * and contains the expected promotion data (timer, headline, subheadline).
 * It also checks if the ribbon remains visible after scrolling down the page
 * and asserts that it is not visible on the basket page.
 */
test('C2185235 Verify Promotion Ribbon', async ({
  promotions,
  page,
  basketPage,
  header,
}) => {
  await test.step('Check the Ribbon is visible and contains promotion data', async () => {
    await promotions.promotionRibbon.waitFor()
    await expect(promotions.promotionRibbon).toBeVisible()
    await expect(promotions.promotionRibbonTimer).toBeVisible()
    await expect(promotions.promotionRibbonHeadline).toBeVisible()
    await expect(promotions.promotionRibbonSubheadline).toBeVisible()
  })

  await test.step('Check Ribbon scrolled state', async () => {
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })
    await expect(promotions.promotionRibbon).toBeVisible()
  })

  await test.step('Check Ribbon not visible on Basket page', async () => {
    await header.visitBasketPage()
    await basketPage.emptyState.waitFor()
    await expect(promotions.promotionRibbon).not.toBeVisible()
  })
})

/**
 * - Verifies that the promotion flyout button in the header can be clicked.
 * - Verifies that clicking the promotion flyout button opens the flyout,
 * displaying the promotions counter and at least one promotion card.
 */
test('C2185240 C2185241 Verify Promotion Flyout', async ({
  promotions,
  header,
}) => {
  await test.step('Check the Promotion flyout button', async () => {
    await header.promotionsButton.waitFor()
    await header.promotionsButton.click()
  })

  await test.step('Check the Promotion flyout open state', async () => {
    await promotions.closeFlyoutButton.waitFor()
    await expect(promotions.promotionsCounter).toBeVisible()
    await expect(promotions.promotionCard.first()).toBeVisible()
  })
})
