import type { ComponentPropsAndSlots, StoryObj } from '@storybook-vue/nuxt'
import SFOrderList from './SFOrderList.vue'

/**
 * SFOrderList displays a list of customer orders with essential order information.
 * It provides a clear overview of order history and status, making it easy for customers to track their purchases.
 *
 * Key features:
 * - Display of orders
 * - Order status indicators
 * - Order date and item count information
 */
export default {
  title: 'Order/SFOrderList',
  component: SFOrderList,
  render: (args: ComponentPropsAndSlots<typeof SFOrderList>) => ({
    components: { SFOrderList },
    setup() {
      return { args }
    },
    template: `
      <div class="w-full max-w-md">
        <SFOrderList v-bind="args" />
      </div>
    `,
  }),
}

/**
 * The default implementation shows a list of orders with their basic information.
 * Each order displays its status, date, and number of items, providing a quick overview of the order history.
 */
export const Default: StoryObj<typeof SFOrderList> = {
  args: {
    items: [
      {
        id: 1001,
        confirmedAt: '2024-06-01T10:00:00Z',
        itemCount: 3,
        shopId: 1,
        status: 'invoice_completed',
      },
      {
        id: 1002,
        confirmedAt: '2024-05-15T14:30:00Z',
        itemCount: 1,
        shopId: 1,
        status: 'payment_pending',
      },
      {
        id: 1003,
        confirmedAt: '2024-04-20T09:15:00Z',
        itemCount: 2,
        shopId: 1,
        status: 'order_open',
      },
    ],
    count: 3,
  },
}
