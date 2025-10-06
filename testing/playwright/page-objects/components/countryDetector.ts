import type { Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { Base } from '../base/base'

/**
 * Page Object Model for the Country Detector modal.
 * Encapsulates locators and methods for interacting with and asserting states of
 * the country/shop selection popup that might appear on first visit.
 */
export class CountryDetector extends Base {
  // --- Country Detector Elements ---
  readonly closeButton: Locator
  readonly switchShopButton: Locator
  readonly stayInShopButton: Locator

  /**
   * Initializes the CountryDetector Page Object.
   * @param page - The Playwright Page object.
   */
  constructor(page: Page) {
    super(page)

    this.closeButton = page.getByTestId('close-button')
    this.switchShopButton = page.getByTestId('button-switch-shop')
    this.stayInShopButton = page.getByTestId('button-stay-in-shop')
  }

  // --- Action Methods ---

  /**
   * Attempts to close the Country Detector modal if it is visible.
   * Waits for the page to be stable before checking for the button.
   * Handles cases where the modal might not be present by continuing execution.
   */
  async closeModal() {
    try {
      // Use a shorter timeout for networkidle to avoid long waits
      await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 })

      // Check if modal is visible with a reasonable timeout
      if (await this.closeButton.first().isVisible({ timeout: 5000 })) {
        await this.closeButton.first().click()
        await expect(this.closeButton.first()).toBeHidden({ timeout: 10000 })
        // Use domcontentloaded instead of networkidle for faster execution
        await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 })
      }
    } catch (error) {
      console.error('Error closing modal:', error)
      // Continue execution even if modal closing fails
    }
  }
}
