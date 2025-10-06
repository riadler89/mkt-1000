import { expect } from '@playwright/test'
import { test } from '../../fixtures/fixtures'
import { isMobile } from '../../support/utils'

/**
 * @file Contains end-to-end tests for the Shop Selector functionality,
 * verifying the ability to switch between different shops.
 */

test.beforeEach(async ({ homePage, countryDetector, page }) => {
  await homePage.navigate(page, '/', 'networkidle')
  await page.waitForLoadState('domcontentloaded')
  await countryDetector.closeModal()
})

/**
 * Verifies that the Shop Selector is initially visible in a closed
 * state, can be opened by clicking its toggle button, and allows switching
 * to a different shop, presumably navigating the user away from the current shop.
 */
test('C2162469: Verify Shop Selector switch to different shop', async ({
  shopSelector,
  page,
  mobileNavigation,
}) => {
  await test.step('Assert Shop Selector is visible and in closed state', async () => {
    await expect(async () => {
      if (isMobile(page)) {
        await mobileNavigation.sideNavigationButton.click()
        await shopSelector.assertShopSelectorIsVisible(1)
        return
      }

      await shopSelector.assertShopSelectorIsVisible(0)
    }).toPass()
  })

  await test.step('Click Shop Selector toggle button and assert open state', async () => {
    await expect(async () => {
      const index = isMobile(page) ? 1 : 0

      await shopSelector.openShopSelector(index)
    }).toPass()
  })

  await test.step('Select different shop and assert the shop is switched', async () => {
    await expect(async () => {
      const initialUrl = page.url()

      await shopSelector.clickSwitchShop()
      await shopSelector.assertUrlHasChanged(initialUrl)
    }).toPass()
  })
})

/**
 * Verifies that when the Shop Selector is opened, and the user attempts
 * to select the currently active shop, the page likely remains on the current shop
 * without a full navigation or significant change.
 */
test('C2162470: Verify Shop Selector switch to the current shop', async ({
  shopSelector,
  page,
  mobileNavigation,
}) => {
  await expect(async () => {
    const initialUrl = page.url()

    if (isMobile(page)) {
      await mobileNavigation.sideNavigationButton.click()
      await page.waitForTimeout(500)
      await shopSelector.openShopSelector(1)
      await shopSelector.clickSwitchShopToCurrent()
    } else {
      await shopSelector.openShopSelector(0)
      await shopSelector.clickSwitchShopToCurrent()
    }
    await shopSelector.assertUrlHasNotChanged(initialUrl)
  }).toPass()
})

/**
 * Verifies that when a user navigates away from the homepage
 * (in this case, to the Wishlist page) and then uses the Shop Selector
 * to switch to a different shop, the user is navigated away from the
 * current page (Wishlist) and to the selected shop.
 */
test('C2162471: Verify Shop Selector switch from non-Homepage', async ({
  shopSelector,
  page,
  mobileNavigation,
  header,
  wishlistPage,
}, testInfo) => {
  // Test skipped only for Mobile Safari due to the timeouts occurring in the Gitlab CI execution.
  // Feel free to remove the line below and try to execute the test locally or in CI to check if the timeouts are encountered.
  test.skip(
    testInfo.project.name === 'mobile-safari',
    'Potential Gitlab CI execution issues in Mobile Safari',
  )

  await test.step('Navigate to Wishlist page', async () => {
    await header.wishlistLink.click()
    await page.waitForLoadState('domcontentloaded')
    await wishlistPage.emptyState.waitFor()
  })

  await test.step('Switch the shop and assert Wishlist page is loaded in different shop', async () => {
    if (isMobile(page)) {
      await mobileNavigation.sideNavigationButton.click()
      await page.waitForTimeout(500)
      await shopSelector.assertShopSelectorIsVisible(1)
      await shopSelector.openShopSelector(1)
      await shopSelector.clickSwitchShop()
    } else {
      await shopSelector.assertShopSelectorIsVisible(0)
      await shopSelector.openShopSelector(0)
      await shopSelector.clickSwitchShop()
    }

    const pageUrl = page.url()

    expect(pageUrl).not.toContain('/wishlist')
  })
})
