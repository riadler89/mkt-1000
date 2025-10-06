import { expect } from '@playwright/test'
import { test } from '../../fixtures/fixtures'
import { isMobile, verifySeoMetaTags, fillInput } from '../../support/utils'
import {
  TEST_USERS,
  LOGIN_REGISTRATION,
  SIGNIN_URL,
  USER_ACCOUNT,
  ROUTES,
  TEST_PASSWORD_RESET_HASH,
} from '../../support/constants'

/**
 * @file Contains end-to-end tests related to user login and registration functionality.
 */

/**
 * Performs setup before each test case within this file.
 * It navigates to the homepage, waits for the network to be idle,
 * and closes the country detector modal if present.
 */
test.beforeEach(async ({ homePage, page, countryDetector }) => {
  await homePage.navigate(page, '/', 'networkidle')
  await page.waitForLoadState('networkidle')
  await countryDetector.closeModal()
})

/**
 * Verifies the user login and logout flow.
 *
 * Prerequisites for this test:
 * - A registered user account with valid credentials.
 * - The email address for this user must be defined via `TEST_USER_EMAIL1` environment variable
 * (e.g., "sfb.aqa1@testsystem.com").
 * - The password for this user must be defined via `TEST_USER_PASSWORD` environment variable.
 * The password should have a minimum length of 8 characters and include at least one
 * special character, one uppercase letter, one lowercase letter, and one number.
 */
test('C2130648 C2171377 Verify User login and log out', async ({
  signinPage,
  header,
  toastMessage,
  page,
  ordersPage,
  mobileNavigation,
}) => {
  await test.step('Log in', async () => {
    await header.headerLoginButton.click()
    await signinPage.fillLoginData(
      TEST_USERS.testUserEmail1,
      TEST_USERS.testUserPassword,
    )
    await signinPage.clickLoginButton()
    await toastMessage.assertToastInfoIsVisible()
    await toastMessage.clickToastMessageButton()
    await page.waitForLoadState('domcontentloaded')
    await header.headerLoginButton.click()
    await ordersPage.ordersHeadline.waitFor()
    expect(page.url()).toContain(USER_ACCOUNT.routeOrders)
  })
  await test.step('Log out', async () => {
    if (isMobile(page)) {
      await mobileNavigation.sideNavigationButton.click()
      await mobileNavigation.logoutButton.waitFor()
      await mobileNavigation.logoutButton.click()
    } else {
      await header.headerLoginButton.focus()
      await header.headerLoginButton.press('Space')
      await signinPage.userPopoverLogoutButton.click()
    }

    await page.waitForLoadState('domcontentloaded')
  })
})

/**
 * Verifies the user login with invalid credentials.
 *
 * Prerequisites for this test:
 * - The email address is defined in constant key `TEST_USERS.nonExistingEmail` as a correctly formatted dummy e-mail address.
 * - The password for this user must be defined via `TEST_USER_PASSWORD` environment variable.
 * The password should have a minimum length of 8 characters and include at least one
 * special character, one uppercase letter, one lowercase letter, and one number.
 */
test('C2130649 Verify User login with wrong credentials', async ({
  signinPage,
  header,
}) => {
  await expect(async () => {
    await header.headerLoginButton.click()
    await signinPage.fillLoginData(
      TEST_USERS.nonExistingEmail,
      TEST_USERS.wrongPassword,
    )

    await signinPage.clickLoginButton()
    await signinPage.notificationError.waitFor()
    await expect(signinPage.notificationError).toBeVisible()
  }).toPass()
})

/**
 * Verifies that attempting to register a user with an email
 * address that is already associated with an existing account displays
 * an error message and does not register the user.
 *
 * Prerequisites for this test:
 * - A registered user account with valid credentials.
 * - The email address for this user must be defined via `TEST_USER_EMAIL1` environment variable
 * (e.g., "sfb.aqa1@testsystem.com").
 * - The password for this user must be defined via `TEST_USER_PASSWORD` environment variable.
 * The password should have a minimum length of 8 characters and include at least one
 * special character, one uppercase letter, one lowercase letter, and one number.
 */
test('C2171373 Verify User registration with already registered user account', async ({
  signinPage,
  header,
  page,
}) => {
  await test.step('Open Signin page and switch to Register tab', async () => {
    await header.headerLoginButton.waitFor()
    await header.headerLoginButton.click()
    await signinPage.registerTab.waitFor()
    await signinPage.registerTab.click()
    await signinPage.registerForm.waitFor()
  })
  await test.step('Fill and submit register form', async () => {
    await signinPage.regGenderSelector.first().click()
    await signinPage.regGenderOption.first().click()
    await signinPage.fillRegistrationData(
      TEST_USERS.firstNameRegUser,
      TEST_USERS.lastNameRegUser,
      TEST_USERS.testUserEmail1,
      TEST_USERS.testUserPassword,
    )
    await signinPage.registerButton.click()
  })
  await test.step('Assert error banner is visible and user is not logged in', async () => {
    await signinPage.notificationError.waitFor()
    await expect(signinPage.notificationError).toBeVisible()
    await page.waitForLoadState('networkidle')
    await signinPage.loginTab.click()
    await expect(signinPage.loginButton).toBeVisible()
  })
})

/**
 * Verifies that the password toggle button on the registration
 * form correctly shows and hides the entered password, changing the input type.
 *
 * Prerequisites for this test:
 * - The password for this user must be defined via `TEST_USER_PASSWORD` environment variable.
 * The password should have a minimum length of 8 characters and include at least one
 * special character, one uppercase letter, one lowercase letter, and one number.
 */
test('C2171375 Verify User registration password toggle button', async ({
  signinPage,
  header,
}) => {
  await header.headerLoginButton.waitFor()
  await header.headerLoginButton.click()
  await signinPage.registerTab.waitFor()
  await signinPage.registerTab.click()
  await signinPage.registerForm.waitFor()

  await signinPage.regInputPassword.focus()
  await signinPage.regInputPassword.fill(TEST_USERS.testUserPassword)
  await expect(signinPage.regInputPassword).toHaveAttribute('type', 'password')

  await signinPage.passwordVisibilityIcon.first().click()
  await expect(signinPage.regInputPassword).toHaveValue(
    TEST_USERS.testUserPassword,
  )
  await expect(signinPage.regInputPassword).toHaveAttribute('type', 'text')
})

/**
 * Verifies the functionality of the "Forgot Password" flow,
 * attempting to reset with a non-existent email, and successfully requesting a reset link for
 * an existing user.
 *
 * Prerequisites for this test:
 * - A registered user account with valid credentials.
 * - The email address for this user must be defined via `TEST_USER_EMAIL1` environment variable
 * (e.g., "sfb.aqa1@testsystem.com").
 */
test('C2171379 Verify User reset password flow', async ({
  signinPage,
  header,
}) => {
  await test.step('Visit Login page and click Forgot Password button', async () => {
    await header.headerLoginButton.click()
    await signinPage.forgotPasswordButton.waitFor()
    await signinPage.forgotPasswordButton.click()
    await signinPage.forgotPasswordForm.waitFor()

    await expect(signinPage.resetPasswordEmailInput).toHaveValue('')
    await expect(signinPage.resetPasswordButton).toBeVisible()
  })

  await test.step('Enter correct format non-existing e-mail and click Reset Password button', async () => {
    await signinPage.resetPasswordEmailInput.clear()
    await signinPage.resetPasswordEmailInput.focus()
    await signinPage.resetPasswordEmailInput.fill(TEST_USERS.nonExistingEmail)
    await signinPage.resetPasswordButton.click()
    await signinPage.forgotPasswordNotificationError.waitFor()

    await expect(signinPage.forgotPasswordNotificationError).toBeVisible()
    await expect(signinPage.resetPasswordButton).toBeVisible()
  })

  await test.step('Enter correct format existing e-mail and click Reset Password button', async () => {
    await signinPage.resetPasswordEmailInput.clear()
    await signinPage.resetPasswordEmailInput.focus()
    await signinPage.resetPasswordEmailInput.fill(TEST_USERS.testUserEmail1)
    await signinPage.resetPasswordButton.click()
    await signinPage.forgotPasswordNotificationSuccess.waitFor()

    await expect(signinPage.forgotPasswordNotificationSuccess).toBeVisible()
    await expect(signinPage.resetPasswordButton).toBeHidden()
  })
})

/**
 * Verifies the process of setting a new password, including
 * handling incorrectly formatted passwords and successfully submitting
 * a correctly formatted password (even though the test hash might lead to an error).
 * Any hash can be used for the testing purposes to verify that the new password flyout loads correctly.
 *
 * Prerequisites for this test:
 * - The password for this user must be defined via `TEST_USER_PASSWORD` environment variable.
 * The password should have a minimum length of 8 characters and include at least one
 * special character, one uppercase letter, one lowercase letter, and one number.
 */
test('C2171786 Verify setting the new password', async ({
  signinPage,
  page,
  countryDetector,
}) => {
  await test.step('Open reset password form', async () => {
    await signinPage.navigate(
      page,
      ROUTES.signin + TEST_PASSWORD_RESET_HASH,
      'networkidle',
    )
    await countryDetector.closeModal()
    await signinPage.resetPasswordInput.waitFor()

    await expect(signinPage.resetPasswordInput).toBeVisible()
    await expect(signinPage.resetPasswordConfirmInput).toBeVisible()
    await expect(signinPage.resetPasswordButton).toBeVisible()
  })

  await test.step('Enter correctly formatted password', async () => {
    await fillInput(signinPage.resetPasswordInput, TEST_USERS.testUserPassword)
    await fillInput(
      signinPage.resetPasswordConfirmInput,
      TEST_USERS.testUserPassword,
    )

    await signinPage.submitNewPasswordButton.click()

    // Error message is expected because the test hash is used.
    await signinPage.resetPasswordNotificationError.waitFor()
    await expect(signinPage.resetPasswordNotificationError).toBeVisible()
  })
})

/**
 * Verifies the presence and correctness of specific SEO meta tags
 * (robots and canonical) on the user login and registration pages.
 */
test('C2171377 Verify User login and registration SEO data', async ({
  signinPage,
  header,
  page,
  baseURL,
}) => {
  await header.headerLoginButton.waitFor()
  await header.headerLoginButton.click()
  await signinPage.loginTab.waitFor()
  const pageTitle = (await signinPage.pageTitle.nth(0).textContent()) as string

  await verifySeoMetaTags(page, {
    robots: LOGIN_REGISTRATION.seoRobots,
    canonical: baseURL + ROUTES.homepageDefault + SIGNIN_URL,
  })
  await expect(signinPage.h1).toBeAttached()
  await expect(signinPage.h1).toHaveText(pageTitle)
})
