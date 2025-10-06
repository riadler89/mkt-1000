import { expect } from '@playwright/test'
import { test } from '../../fixtures/fixtures'
import { ROUTES } from '../../support/constants'

/**
 * @file Contains end-to-end tests for the Country Detector modal, verifying
 * its behavior when closing, switching shops, staying in the current shop,
 * and its interaction with other page elements like flyouts.
 */

/**
 * Performs setup before each test case within this file.
 * It initially navigates to the English version of the homepage.
 */
test.beforeEach(async ({ page, baseURL, countryDetector }) => {
  await expect(async () => {
    const pageUrl = `${baseURL}/en`

    await countryDetector.navigate(page, pageUrl, 'networkidle')
  }).toPass()
})

/**
 * Test suite specifically running with the Berlin timezone to potentially
 * observe any timezone-specific behavior of the Country Detector on a page
 * that was initially loaded with a shop in different timezone.
 * It forces Country Detector modal to load, so the tests can be executed.
 */
test.describe('Test from Berlin against US shop', () => {
  test.use({
    timezoneId: 'Europe/Berlin',
  })

  test('C2141736: Verify Country Detector close button', async ({
    countryDetector,
  }) => {
    await countryDetector.closeButton.waitFor()
    await expect(async () => {
      await countryDetector.closeModal()
    }).toPass()
  })

  test('C2141737: Verify Country Detector switch shop', async ({
    countryDetector,
    page,
  }) => {
    await expect(async () => {
      await countryDetector.switchShopButton.first().waitFor()
      await countryDetector.switchShopButton.first().click()
      await page.waitForLoadState('networkidle')
      await page.waitForTimeout(500)

      const pageUrl = page.url()

      expect(pageUrl).toContain(ROUTES.homepageDefault)
      await expect(countryDetector.switchShopButton).not.toBeVisible()
    }).toPass()
  })

  test('C2141738: Verify Country Detector stay in the shop', async ({
    countryDetector,
    page,
  }) => {
    await expect(async () => {
      await countryDetector.stayInShopButton.waitFor()
      await countryDetector.stayInShopButton.click()

      const pageUrl = page.url()

      expect(pageUrl).toContain(ROUTES.homepage1)
      await expect(countryDetector.stayInShopButton).not.toBeVisible()
    }).toPass()
  })
})
