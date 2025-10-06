import { expect } from '@playwright/test'
import { test } from '../../fixtures/fixtures'
import { getUserForBrowser } from '../../support/utils'
import { USER_ACCOUNT, TEST_USERS } from '../../support/constants'

/**
 * @file Contains end-to-end tests for the user account area functionality.
 * This suite verifies account page navigation, user data updates, and password management.
 */

/**
 * Global setup hook for the Account E2E test suite.
 * Performs user authentication before each test to ensure a logged-in state.
 * To avoid conflicts in parallel execution, each browser project is assigned a dedicated test user.
 * Check `/playwright/support/utils.ts` to get the details on how the test users are defined.
 *
 * @description
 * The login process involves visiting the homepage, closing any country detector modals,
 * navigating to the login form, filling in credentials obtained from environment variables
 * (mapped per browser project), submitting the form, dismissing the toast message,
 * and finally opening the user account popover/menu.
 */
test.beforeEach(
  async (
    { signinPage, page, countryDetector, header, toastMessage, homePage },
    testInfo,
  ) => {
    const projectName = testInfo.project.name
    const { email, password } = getUserForBrowser(projectName)

    await homePage.navigate(page, '/', 'networkidle')
    await countryDetector.closeModal()
    await header.headerLoginButton.click()
    await signinPage.h1.waitFor()
    await signinPage.fillLoginData(email, password)
    await signinPage.clickLoginButton()
    await toastMessage.toastInfo.waitFor()
    await toastMessage.clickToastMessageButton()
    await header.mainHeader.waitFor()
    await header.headerLoginButton.click()
    await page.waitForLoadState('domcontentloaded')
  },
)

/**
 * Verifies that the Orders tab is loaded by default upon navigating to the Account area.
 * Verifies that the Orders tab has the 'aria-current' attribute set to 'page' and that the URL contains the orders route.
 * It then proceeds to verify the loading of the Subscriptions and Profile pages by clicking their respective tabs.
 */
test('C2188614 C2188628 Verify Account area landing page', async ({
  accountPage,
  page,
}) => {
  await test.step('Verify Orders tab is loaded by default', async () => {
    await accountPage.accountTabOrders.waitFor()

    await expect(accountPage.accountTabOrders).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(page.url()).toContain(USER_ACCOUNT.routeOrders)
  })

  await test.step('Verify Subscription page is loaded', async () => {
    await accountPage.accountTabSubscriptions.click()
    await page.waitForLoadState('domcontentloaded')

    await expect(accountPage.accountTabSubscriptions).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(page.url()).toContain(USER_ACCOUNT.routeSubscriptions)
  })

  await test.step('Verify Profile page is loaded', async () => {
    await accountPage.accountTabProfile.click()
    await page.waitForLoadState('domcontentloaded')

    await expect(accountPage.accountTabProfile).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(page.url()).toContain(USER_ACCOUNT.routeProfile)
    await expect(accountPage.userProfileHeadline).toBeVisible()
    await expect(accountPage.accountInfoHeadline).toBeVisible()
    await expect(accountPage.personalInfoHeadline).toBeVisible()
    await expect(accountPage.passwordHeadline).toBeVisible()
  })
})

/**
 * Verifies the process of updating user personal data with both
 * correct and incorrect input formats for the birth date, asserting
 * success messages or validation errors accordingly.
 */
test('C2190952 Verify Account user data update', async ({
  accountPage,
  toastMessage,
  page,
}) => {
  await test.step('Update user data - correct input format', async () => {
    await accountPage.accountTabProfile.click()
    await page.waitForLoadState('domcontentloaded')
    await accountPage.selectGender('f')
    await accountPage.updateUserData(
      USER_ACCOUNT.userFirstName,
      USER_ACCOUNT.userLastName,
      USER_ACCOUNT.userBirthDateCorrect,
      true,
    )
    await toastMessage.assertToastInfoIsVisible()
  })
  await test.step('Update user data - incorrect birth date input format', async () => {
    await accountPage.updateUserData(
      USER_ACCOUNT.userFirstName,
      USER_ACCOUNT.userLastName,
      USER_ACCOUNT.userBirthDateIncorrect,
      false,
    )
    await expect(accountPage.birthdateValidationLabel).toBeVisible()
    await expect(accountPage.formSaveButton).not.toBeEnabled()
  })
})

/**
 * Verifies the password update process, including successful updates
 * with correct credentials and the display of error messages for incorrect
 * current passwords.
 */
test('C2188629 Verify Account password update', async ({
  accountPage,
  toastMessage,
  page,
}) => {
  await test.step('Update password - correct format and matching passwords', async () => {
    await accountPage.accountTabProfile.click()
    await page.waitForLoadState('domcontentloaded')
    await accountPage.updatePassword(
      TEST_USERS.testUserPassword,
      TEST_USERS.testUserPassword,
      true,
    )
    await toastMessage.assertToastInfoIsVisible()
    await toastMessage.clickToastMessageButton()
  })
  await test.step('Update password - incorrect current password', async () => {
    await accountPage.updatePassword(
      USER_ACCOUNT.nonMatchingPassword,
      TEST_USERS.testUserPassword,
      true,
    )
    await accountPage.passwordErrorMessage.waitFor()
    await expect(accountPage.passwordErrorMessage).toBeVisible()
  })
})
