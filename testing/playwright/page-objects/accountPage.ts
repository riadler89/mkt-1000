import type { Locator, Page } from '@playwright/test'
import type { RPC } from './components/rpc'
import { Base } from './base/base'

/**
 * Page Object Model for the User Account Area.
 * Encapsulates locators and methods for interacting with and asserting states on user profile,
 * personal information, and password management sections within the account area.
 */
export class AccountPage extends Base {
  private readonly rpc: RPC

  // --- Profile & Personal Information Locators ---
  readonly userFirstName: Locator
  readonly userLastName: Locator
  readonly userBirthDate: Locator
  readonly genderSelection: Locator
  readonly birthdateValidationLabel: Locator
  readonly formSaveButton: Locator

  // --- Password Management Locators ---
  readonly passwordCurrent: Locator
  readonly passwordNew: Locator
  readonly passwordErrorMessage: Locator
  readonly passwordUpdateButton: Locator

  // --- Account Tab Navigation Locators ---
  readonly accountTabOrders: Locator
  readonly accountTabSubscriptions: Locator
  readonly accountTabProfile: Locator

  // --- Headline/Section Locators ---
  readonly userProfileHeadline: Locator
  readonly accountInfoHeadline: Locator
  readonly personalInfoHeadline: Locator
  readonly passwordHeadline: Locator

  // --- Internal/Helper Locators ---
  private readonly sectionBirthdate: Locator

  /**
   * Initializes the AccountPage Page Object.
   * @param page - The Playwright Page object.
   * @param rpc - The RPC (Remote Procedure Call) Page Object for direct API interactions.
   */
  constructor(page: Page, rpc: RPC) {
    super(page)

    this.rpc = rpc
    this.userFirstName = page.getByTestId('user-first-name')
    this.userLastName = page.getByTestId('user-last-name')
    this.userBirthDate = page.getByTestId('user-birthdate')
    this.formSaveButton = page.getByTestId('personal-info-submit')
    this.passwordCurrent = page.locator(
      '[data-testid="current-password"][type="password"]',
    )
    this.passwordNew = page.locator(
      '[data-testid="new-password"][type="password"]',
    )
    this.passwordUpdateButton = page.getByTestId('update-password-submit')
    this.sectionBirthdate = page.getByTestId('section-birthdate')
    this.birthdateValidationLabel = this.sectionBirthdate.getByTestId(
      'validation-error-text',
    )
    this.accountTabOrders = page.getByTestId('account-area-tab-0')
    this.accountTabSubscriptions = page.getByTestId('account-area-tab-1')
    this.accountTabProfile = page.getByTestId('account-area-tab-2')
    this.passwordErrorMessage = page.getByTestId(
      'password-error-message-container',
    )
    this.userProfileHeadline = page.getByTestId('user-profile-headline')
    this.accountInfoHeadline = page.getByTestId(
      'profile-account-information-headline',
    )
    this.personalInfoHeadline = page.getByTestId(
      'profile-personal-information-headline',
    )
    this.passwordHeadline = page.getByTestId('profile-password-headline')
    this.genderSelection = page.getByTestId('gender-selection')
  }

  /**
   * Updates the user's first name, last name, and birth date in the profile section.
   * Handles both correct and incorrect birth date formats by simulating sequential typing.
   * @param firstName - The new first name for the user.
   * @param lastName - The new last name for the user.
   * @param birthDate - The birth date string (e.g., "YYYY-MM-DD", or an invalid format for testing validation).
   * @param clickSaveButton - True to click the save button after filling fields, false otherwise.
   */
  async updateUserData(
    firstName: string,
    lastName: string,
    birthDate: string,
    clickSaveButton: boolean,
  ) {
    const userFields = [
      { field: this.userFirstName, value: firstName },
      { field: this.userLastName, value: lastName },
    ]

    for (const { field, value } of userFields) {
      await field.waitFor()
      await field.clear()
      await field.fill(value)
    }

    await this.userBirthDate.waitFor()
    await this.userBirthDate.clear()
    await this.userBirthDate.pressSequentially(birthDate, { delay: 50 })
    await this.userBirthDate.press('Tab')
    await this.page.waitForLoadState('domcontentloaded')

    if (clickSaveButton === true) {
      await this.formSaveButton.click()
    }
  }

  /**
   * Updates the user's password in the profile section.
   * @param currentPassword - The user's current password.
   * @param newPassword - The new password to set.
   * @param clickUpdateButton - True to click the update button after filling fields, false otherwise.
   */
  async updatePassword(
    currentPassword: string,
    newPassword: string,
    clickUpdateButton: boolean,
  ) {
    const passwordFields = [
      { field: this.passwordCurrent, value: currentPassword },
      { field: this.passwordNew, value: newPassword },
    ]

    for (const { field, value } of passwordFields) {
      await field.waitFor()
      await field.fill(value)
    }
    await this.page.waitForLoadState('domcontentloaded')

    if (clickUpdateButton === true) {
      await this.passwordUpdateButton.click()
    }
  }

  /**
   * Authenticates a user directly via RPC (Remote Procedure Call) to bypass UI login.
   * Used for faster test setup where login UI flow is not the primary focus.
   * @param email - The email of the user to authenticate.
   * @param password - The password of the user.
   * @throws {Error} If the RPC call to oauthLogin fails.
   */
  async userAuthentication(email: string, password: string) {
    try {
      await this.rpc.call('oauthLogin', {
        email,
        password,
      })
    } catch (error) {
      console.error('Error authenticating user:', error)
      throw error
    }
  }

  /**
   * Returns a Locator for a specific gender option within the gender selection component.
   * This is a helper method used internally by `selectGender`.
   * @param gender - The gender code (e.g., 'f' for female, 'm' for male).
   * @returns A Playwright Locator for the specific gender option.
   */
  private genderOption(gender: string): Locator {
    return this.page.getByTestId(`gender-option-${gender}`)
  }

  /**
   * Selects a gender option in the user profile.
   * @param gender - The gender code to select (e.g., 'f' for female, 'm' for male).
   */
  async selectGender(gender: string) {
    await this.genderSelection.waitFor()
    await this.genderSelection.click()
    await this.genderOption(gender).waitFor()
    await this.genderOption(gender).click()
  }
}
