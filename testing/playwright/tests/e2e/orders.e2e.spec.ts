import { expect } from '@playwright/test'
import { test } from '../../fixtures/fixtures'
import { ROUTES, TEST_USERS } from '../../support/constants'

/**
 * @file Contains end-to-end tests for the user's Orders page, verifying
 * the display of orders for users with existing orders and the empty
 * state for users without any orders.
 */

/**
 * Verifies that a logged-in user with existing orders can view
 * their order history on the Orders page, open the details of a specific
 * order, navigate back to the orders list, and interact with pagination.
 *
 * Prerequisites for this test:
 * - A registered user account with some orders placed.
 * - The number of orders should be more than 8, so the last step checking the pagination
 * can be executed.
 * - The email address for this user must be defined via `TEST_USER_EMAIL1` environment variable
 * (e.g., "sfb.aqa1@testsystem.com").
 * - The password for this user must be defined via `TEST_USER_PASSWORD` environment variable.
 */
test('C2132533 Verify Orders for user that has orders', async ({
  ordersPage,
  page,
  countryDetector,
  header,
  signinPage,
  toastMessage,
}) => {
  await test.step('Visit Orders page and assert the page is loaded', async () => {
    await ordersPage.navigate(page, '/', 'networkidle')
    await page.waitForLoadState('networkidle')
    await countryDetector.closeModal()
    await header.headerLoginButton.click()
    await signinPage.fillLoginData(
      TEST_USERS.testUserEmail1,
      TEST_USERS.testUserPassword,
    )
    await signinPage.clickLoginButton()
    await toastMessage.clickToastMessageButton()
    await header.headerLoginButton.click()
    await ordersPage.ordersHeadline.waitFor()
    await expect(ordersPage.ordersHeadline).toBeVisible()
    await expect(ordersPage.orderStatus.first()).toBeVisible()
  })

  await test.step('Open the first order and check order details', async () => {
    const orderHeadlineText = (await ordersPage.orderItemHeadline
      .nth(0)
      .textContent()) as string
    const orderNumber = orderHeadlineText.split('#')[1]

    await ordersPage.selectOrder(orderNumber)
    await ordersPage.orderDetailsHeadline.waitFor()
    await expect(ordersPage.orderDetailsHeadline).toContainText(orderNumber)
    expect(page.url()).toContain(orderNumber)
    await expect(ordersPage.orderStatus).toBeVisible()
  })

  await test.step('Go back to orders list', async () => {
    await ordersPage.orderDetailsBackButton.click()
    await ordersPage.ordersHeadline.waitFor()
    expect(page.url()).toContain(ROUTES.orders)
  })

  await test.step('Check the pagination', async () => {})
  await ordersPage.selectPage('2')
  await page.waitForTimeout(500)
  expect(page.url()).toContain('?page=2')
})

/**
 * Verifies that a logged-in user who has not placed any orders
 * sees the empty state message and a "Continue Shopping" button on the
 * Orders page.
 *
 * Prerequisites for this test:
 * - A registered user account with no orders placed.
 * - The email address for this user must be defined via `TEST_USER_NO_ORDERS` environment variable
 * (e.g., "user.no.orders@testsystem.com").
 * - The password for this user must be defined via `TEST_USER_PASSWORD` environment variable.
 */
test('C2132126 Verify Orders page - user without orders', async ({
  ordersPage,
  page,
  countryDetector,
  header,
  signinPage,
  toastMessage,
}) => {
  await ordersPage.navigate(page, '/', 'networkidle')
  await countryDetector.closeModal()
  await page.waitForLoadState('networkidle')
  await header.headerLoginButton.click()
  await signinPage.fillLoginData(
    TEST_USERS.testUserNoOrders,
    TEST_USERS.testUserPassword,
  )
  await signinPage.clickLoginButton()
  await toastMessage.clickToastMessageButton()
  await header.headerLoginButton.click()
  await expect(ordersPage.emptyState).toBeVisible()
  await expect(ordersPage.buttonContinueShopping).toBeVisible()
})
