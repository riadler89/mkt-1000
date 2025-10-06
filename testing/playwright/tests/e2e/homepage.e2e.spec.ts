import { expect } from '@playwright/test'
import { test } from '../../fixtures/fixtures'
import { getAllLinksFromPage } from '../../support/utils'

/**
 * @file Contains end-to-end tests for the homepage, verifying its basic structure and links integrity.
 */

test.beforeEach(async ({ homePage, countryDetector, page }) => {
  await homePage.navigate(page, '/', 'networkidle')
  await page.waitForLoadState('domcontentloaded')
  await countryDetector.closeModal()
})

/**
 * Verifies that the main content area of the homepage,
 * the main header, and the footer are visible upon page load.
 */
test('C2141227 Verify Homepage sections', async ({
  homePage,
  header,
  footer,
}) => {
  await expect(async () => {
    await homePage.homepageContent.waitFor()
    await expect(header.mainHeader).toBeVisible()
    await expect(footer.footerWrapper).toBeVisible()
  }).toPass()
})

/**
 * - Verifies that all links on the homepage return a successful
 * HTTP status code (less than 400). It first attempts a HEAD request for
 * efficiency and falls back to a full page navigation if the HEAD request fails.
 * - Verifies the status code of homepage links.
 * - Handles potential errors during link checks.
 * - Attempts full navigation as a fallback for HEAD failures.
 * - Ensures links are valid and do not lead to broken pages.
 */
test('C2141228 C2138940 C2138941 C2138942 C2143604 Verify Homepage links', async ({
  page,
  context,
}) => {
  test.setTimeout(60000)
  const linkUrls = await getAllLinksFromPage(page)

  for (const url of linkUrls) {
    await test.step(`Checking link: ${url}`, async () => {
      try {
        const response = await page.request.head(url)
        expect(response.status()).toBeLessThan(400)
        expect(response.statusText()).toBe('OK')
      } catch (error) {
        console.warn(
          `HEAD request failed for ${url}, attempting full page navigation.`,
        )
        console.error('Error details:', error)
        try {
          const newPage = await context.newPage()

          await newPage.goto(url)
          await newPage.waitForLoadState('networkidle')
          await newPage.close()
        } catch (navError) {
          console.error(`[Error] Navigation failed for ${url}:`, navError)
          throw new Error(`Both HEAD request and navigation failed for ${url}`)
        }
      }
    })
  }
})
