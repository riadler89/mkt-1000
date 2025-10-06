import type { Locator, Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { Base } from './base/base'

/**
 * Page Object Model for the User's Orders Page.
 * Encapsulates locators and methods for viewing order history,
 * inspecting order details, and interacting with pagination.
 */
export class OrdersPage extends Base {
  // --- Order List Locators ---
  readonly orderListItem: Locator
  readonly orderListItemTitle: Locator
  readonly orderListItemData: Locator
  readonly ordersHeadline: Locator

  // --- Order Details Locators ---
  readonly orderDetailsHeadline: Locator
  readonly orderDetailsBackButton: Locator
  readonly addressCard: Locator
  readonly addressMobile: Locator
  readonly orderStatusBar: Locator
  readonly orderStatus: Locator
  readonly orderItemCard: Locator
  readonly orderItems: Locator
  readonly orderItemHeadline: Locator

  // --- Payment Summary Locators ---
  readonly paymentHeader: Locator
  readonly paymentOrderValue: Locator
  readonly paymentShippingCost: Locator

  // --- Empty State Locators ---
  readonly emptyState: Locator
  readonly headlineNoOrders: Locator
  readonly buttonContinueShopping: Locator

  /**
   * Initializes the OrdersPage Page Object.
   * @param page - The Playwright Page object.
   */
  constructor(page: Page) {
    super(page)

    this.orderListItem = page.getByTestId('order-history-list-item')
    this.orderListItemTitle = page.getByTestId('order-list-item-title')
    this.orderListItemData = page.getByTestId('order-list-item-data')
    this.addressCard = page.getByTestId('address-card')
    this.orderItems = page.getByTestId('order-items')
    this.orderStatusBar = page.getByTestId('order-status-bar')
    this.orderItemCard = page.getByTestId('order-item-card')
    this.paymentHeader = page.getByTestId('payment-header')
    this.paymentOrderValue = page.getByTestId('payment-order-value')
    this.paymentShippingCost = page.getByTestId('payment-shipping-cost')
    this.headlineNoOrders = page.getByTestId('headline-no-orders')
    this.buttonContinueShopping = page.getByTestId('button-continue-shopping')
    this.addressMobile = page.getByTestId('address-card-mobile')
    this.ordersHeadline = page.getByTestId('orders-headline')
    this.orderItemHeadline = page.getByTestId('order-item-headline')
    this.orderDetailsBackButton = page.getByTestId('back-to-order-list')
    this.orderDetailsHeadline = page.getByTestId('order-detail-headline')
    this.emptyState = page.getByTestId('empty-state')
    this.orderStatus = page.getByTestId('order-status')
  }

  // --- Private Helper Locators & Methods ---

  /**
   * Returns a locator for a specific "Go to Order Detail" button, identified by order number.
   * @param order - The order number as a string.
   * @returns A Playwright Locator for the order details button.
   */
  private orderDetailsButton(order: string): Locator {
    return this.page.getByTestId(`go-to-order-detail-${order}`)
  }

  /**
   * Returns a locator for a specific pagination button, identified by page number.
   * @param pageNum - The page number as a string.
   * @returns A Playwright Locator for the pagination button.
   */
  private ordersPageButton(pageNum: string): Locator {
    return this.page.getByTestId(`paginationButton-${pageNum}`)
  }

  // --- Action Methods ---

  /**
   * Selects and navigates to the details page of a specific order.
   * @param order - The order number as a string.
   */
  async selectOrder(order: string) {
    await this.orderDetailsButton(order).waitFor()
    await this.orderDetailsButton(order).click()
  }

  /**
   * Navigates to a specific page within the order history pagination.
   * @param pageNum - The page number to navigate to as a string.
   */
  async selectPage(pageNum: string) {
    await this.ordersPageButton(pageNum).waitFor()
    await this.ordersPageButton(pageNum).click()
  }

  // --- Assertion Methods ---

  /**
   * Asserts that at least one order list item is visible and contains its title and data.
   */
  async assertOrderListItem() {
    await this.orderListItem.first().waitFor()
    await expect(this.orderListItemTitle.first()).toBeVisible()
    await expect(this.orderListItemData.first()).toBeVisible()
  }
}
