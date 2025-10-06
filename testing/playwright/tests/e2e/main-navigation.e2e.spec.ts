import { expect } from '@playwright/test'
import { test } from '../../fixtures/fixtures'
import { isMobile, navigationItemLabel } from '../../support/utils'

/**
 * @file Contains end-to-end tests for the main navigation, verifying its flyout
 * on desktop and mobile navigation, and the ability to navigate to Product
 * Listing Pages (PLPs) from the main navigation.
 */
test.beforeEach(async ({ homePage, countryDetector, page }) => {
  await homePage.navigate(page, '/', 'networkidle')
  await page.waitForLoadState('domcontentloaded')
  await countryDetector.closeModal()
})

/**
 * - Verifies the main navigation flyout on desktop browsers.
 * - Verifies navigating to a main category PLP from the main navigation
 * and asserts the page title.
 * - Verifies navigating to a sub-category PLP from the main navigation
 * and asserts the page title on desktop.
 * - Verifies navigating to a 2nd level category PLP
 * and asserts the page title.
 */
test('C2130722 C2143633 C2143634 Verify Main Navigation Flyout and navigating to Main category PLP', async ({
  mainNavigation,
  mobileNavigation,
  page,
  breadcrumb,
}) => {
  if (isMobile(page)) {
    await test.step('Mobile - navigate to 2nd category level', async () => {
      await mobileNavigation.openPlpMobile()

      const mainCategoryLabel =
        (await breadcrumb.breadcrumbCategoryLvl0.textContent()) as string
      const activeCategoryLabel =
        (await breadcrumb.breadcrumbCategoryActive.textContent()) as string

      await expect(page.title()).resolves.toContain(
        `${mainCategoryLabel} - ${navigationItemLabel(activeCategoryLabel)} | `,
      )
    })
  } else {
    await test.step('Desktop - check navigation overlay', async () => {
      await mainNavigation.openMainNavigationOverlay()
      await expect(mainNavigation.desktopNavigationFlyout).toBeVisible()
    })
    await test.step('Desktop - navigate to main category PLP', async () => {
      await mainNavigation.navigateToPlpMainCategory()
      await breadcrumb.breadcrumbCategoryActive.waitFor()
      await page.mouse.move(0, 0)

      const activeCategoryLabel =
        (await breadcrumb.breadcrumbCategoryActive.textContent()) as string

      await expect(page.title()).resolves.toContain(
        `${activeCategoryLabel.replace(/\d/g, '').trim()} | `,
      )
    })
    await test.step('Desktop - navigate to sub-category PLP', async () => {
      await mainNavigation.navigateToPlpSubCategory()

      const mainCategoryLabel =
        (await breadcrumb.breadcrumbCategoryLvl0.textContent()) as string
      const activeCategoryLabel =
        (await breadcrumb.breadcrumbCategoryActive.textContent()) as string

      await expect(page.title()).resolves.toContain(
        `${mainCategoryLabel} - ${navigationItemLabel(activeCategoryLabel)} | `,
      )
    })
  }
})
