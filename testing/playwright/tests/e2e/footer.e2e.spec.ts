import { expect } from '@playwright/test'
import { test } from '../../fixtures/fixtures'
import { ROUTES } from '../../support/constants'

/**
 * @file Contains end-to-end tests for the website footer, specifically
 * verifying the functionality of the footer logo.
 */

test.beforeEach(async ({ footer, countryDetector, page }) => {
  await footer.navigate(page, '/', 'networkidle')
  await countryDetector.closeModal()
  await footer.footerWrapper.scrollIntoViewIfNeeded()
})

/**
 * Verifies that clicking the footer logo from the homepage
 * keeps the user on the homepage and scrolls them back to the top of the page.
 * It also verifies that clicking the footer logo from a non-homepage
 * (e.g., the basket page) navigates the user back to the default homepage.
 */
test('C2143605 Verify footer logo', async ({
  footer,
  page,
  baseURL,
  header,
  countryDetector,
}) => {
  await test.step('Verify logo click from Homepage', async () => {
    await expect(async () => {
      await expect(footer.footerLogo).toBeVisible()

      const pageUrl = page.url()

      await footer.footerLogo.click()
      expect(page.url()).toEqual(pageUrl)
      await page.waitForTimeout(1000)

      await expect(header.mainHeader).toBeInViewport()

      const scrollPosition = await page.evaluate(() => window.scrollY)

      expect(scrollPosition).toBe(0)
    }).toPass()
  })
  await test.step('Verify logo click from non-Homepage', async () => {
    await expect(async () => {
      await footer.navigate(page, ROUTES.basket, 'networkidle')
      await countryDetector.closeModal()
      await expect(footer.footerLogo).toBeVisible()
      await footer.footerLogo.click()
      await page.waitForLoadState('domcontentloaded')
      await expect(header.mainHeader).toBeInViewport()
      expect(page.url()).toEqual(baseURL + ROUTES.homepageDefault)
    }).toPass()
  })
})
