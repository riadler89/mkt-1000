import type { Locator, Page } from '@playwright/test'
import { Base } from './base/base'

/**
 * Page Object Model for the Sign-In and Registration Page.
 * Encapsulates locators and methods for interacting with user login,
 * new user registration, and password reset functionalities.
 */
export class SignInPage extends Base {
  // --- Login Form Locators ---
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly loginButton: Locator
  readonly notificationError: Locator
  readonly loginTab: Locator
  readonly loginForm: Locator

  // --- Registration Form Locators ---
  readonly registerTab: Locator
  readonly regGenderSelector: Locator
  readonly regGenderOption: Locator
  readonly regInputFirstName: Locator
  readonly regInputLastName: Locator
  readonly regInputEmailAddress: Locator
  readonly regInputPassword: Locator
  readonly regConfirmPassword: Locator
  readonly registerButton: Locator
  readonly registerForm: Locator
  readonly registerGuestSwitch: Locator
  readonly registerGuestInfo: Locator

  // --- Password Toggle Locators ---
  readonly passwordVisibilityIcon: Locator

  // --- Password Reset / Forgot Password Locators ---
  readonly forgotPasswordForm: Locator
  readonly resetPasswordForm: Locator
  readonly forgotPasswordButton: Locator
  readonly resetPasswordEmailInput: Locator
  readonly resetPasswordButton: Locator
  readonly forgotPasswordNotificationError: Locator
  readonly forgotPasswordNotificationSuccess: Locator
  readonly resetPasswordInput: Locator
  readonly resetPasswordConfirmInput: Locator
  readonly validationErrorText: Locator
  readonly resetPasswordNotificationError: Locator
  readonly resetPasswordNotificationSuccess: Locator
  readonly submitNewPasswordButton: Locator

  // --- User Popover / Header Elements (after login) ---
  readonly greetingUserFirstName: Locator
  readonly userPopoverEmail: Locator
  readonly userPopoverLogoutButton: Locator

  // --- Generic Page Elements / Links ---
  readonly h1: Locator
  readonly pageTitle: Locator
  readonly createAccountLabel: Locator
  readonly signinPageLink: Locator
  readonly privacyDisclaimerInfo: Locator
  readonly termsOfServiceLink: Locator
  readonly privacyPolicyLink: Locator
  readonly loginPageLink: Locator

  /**
   * Initializes the SignInPage Page Object.
   * @param page - The Playwright Page object.
   */
  constructor(page: Page) {
    super(page)

    // Login Form
    this.emailInput = page.locator('[data-test-id="login-email"]')
    this.passwordInput = page.locator('[data-test-id="login-password"]')
    this.loginButton = page.locator('[data-test-id="login-and-continue"]')
    this.notificationError = page.locator('[data-test-id="notification-error"]')
    this.loginTab = page.locator('[data-test-id="login-option"]')
    this.loginForm = page.locator('[data-test-id="login-form"]')

    // Registration Form
    this.registerTab = page.locator('[data-test-id="register-option"]')
    this.regGenderSelector = page.locator(
      '[data-test-id="register-gender-dropdown"]',
    )
    this.regGenderOption = page.locator(
      '[data-test-id="register-gender-dropdown-option"]',
    )
    this.regInputFirstName = page.locator('[data-test-id="register-firstName"]')
    this.regInputLastName = page.locator('[data-test-id="register-lastName"]')
    this.regInputEmailAddress = page.locator('[data-test-id="register-email"]')
    this.regInputPassword = page.locator('[data-test-id="register-password"]')
    this.regConfirmPassword = page.locator(
      '[data-test-id="register-confirm-password"]',
    )
    this.registerButton = page.locator('[data-test-id="register-and-continue"]')
    this.registerForm = page.locator('[data-test-id="register-form"]')
    this.registerGuestSwitch = page.getByTestId('register-guest-switch')
    this.registerGuestInfo = page.getByTestId('register-guest-info')

    // Password Toggle
    this.passwordVisibilityIcon = page.locator(
      '[data-test-id="password-visibility-icon"]',
    )

    // Password Reset / Forgot Password
    this.forgotPasswordForm = page.locator(
      '[data-test-id="forgot-password-form"]',
    )
    this.resetPasswordForm = page.locator(
      '[data-test-id="password-reset-form"]',
    )
    this.forgotPasswordButton = page.locator('[data-test-id="forgot-password"]')
    this.resetPasswordEmailInput = page.locator(
      '[data-test-id="forgot-password-email"]',
    )
    this.resetPasswordButton = page.locator('[data-test-id="reset-password"]')
    this.forgotPasswordNotificationError = page.locator(
      '[data-test-id=forgot-password-notification-error]',
    )
    this.forgotPasswordNotificationSuccess = page.locator(
      '[data-test-id=forgot-password-notification-success]',
    )
    this.resetPasswordInput = page.locator('[data-test-id="reset-password"]')
    this.resetPasswordConfirmInput = page.locator(
      '[data-test-id="reset-confirm-password"]',
    )
    this.validationErrorText = page.getByTestId('validation-error-text')
    this.resetPasswordNotificationError = page.locator(
      '[data-test-id="notification-error"]',
    )
    this.resetPasswordNotificationSuccess = page.locator(
      '[data-test-id="notification-success"]',
    )
    this.submitNewPasswordButton = page.locator(
      '[data-test-id="submit-password-reset"]',
    )

    // User Popover / Header Elements
    this.greetingUserFirstName = page.getByTestId('greeting-user-firstname')
    this.userPopoverEmail = page.getByTestId('user-popover-email')
    this.userPopoverLogoutButton = page.getByTestId(
      'user-popover-logout-button',
    )

    // Generic Page Elements / Links
    this.h1 = page.locator('h1')
    this.pageTitle = page.getByTestId('headline')
    this.createAccountLabel = page.getByTestId('create-account-label')
    this.signinPageLink = page.getByTestId('signin-page-link')
    this.privacyDisclaimerInfo = page.getByTestId('privacy-disclaimer-info')
    this.termsOfServiceLink = page.getByTestId('terms-of-service-link')
    this.privacyPolicyLink = page.getByTestId('privacy-policy-link')
    this.loginPageLink = page.getByTestId('login-page-link')
  }

  // --- Private Helper Methods ---

  /**
   * Returns a Locator for a specific gender option within the gender selection component.
   * This is a helper method used internally by `selectGender`.
   * @param gender - The gender code (e.g., 'f' for female, 'm' for male).
   * @returns A Playwright Locator for the specific gender option.
   */
  private genderOption(gender: string): Locator {
    return this.page.getByTestId(`gender-option-${gender}`)
  }

  // --- Action Methods ---

  /**
   * Fills in the email and password fields on the login form.
   * @param email - The email address to enter.
   * @param password - The password to enter.
   */
  async fillLoginData(email: string, password: string) {
    await this.emailInput.focus()
    await this.emailInput.fill(email)
    await this.passwordInput.focus()
    await this.passwordInput.fill(password)
  }

  /**
   * Clicks the login button and waits for the page to load.
   * Includes a short timeout to allow for potential asynchronous operations.
   */
  async clickLoginButton() {
    await this.loginButton.click()
    await this.page.waitForTimeout(500)
    await this.page.waitForLoadState('domcontentloaded')
  }

  /**
   * Fills in the registration form fields for a new user.
   * @param firstName - The first name for registration.
   * @param lastName - The last name for registration.
   * @param emailAddress - The email address for registration.
   * @param password - The password for registration.
   */
  async fillRegistrationData(
    firstName: string,
    lastName: string,
    emailAddress: string,
    password: string,
  ) {
    await this.regInputFirstName.waitFor()
    await this.regInputFirstName.focus()
    await this.regInputFirstName.fill(firstName)

    await this.regInputLastName.focus()
    await this.regInputLastName.fill(lastName)

    await this.regInputEmailAddress.focus()
    await this.regInputEmailAddress.fill(emailAddress)

    await this.regInputPassword.focus()
    await this.regInputPassword.fill(password)

    await this.regConfirmPassword.focus()
    await this.regConfirmPassword.fill(password)
  }
}
