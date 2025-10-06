import type { ComponentPropsAndSlots, Meta } from '@storybook-vue/nuxt'
import SFToast from './SFToast.vue'

/**
 * SFToast is a versatile component designed to display toast message in response to user actions.
 * It serves as a visual feedback mechanism for events such as requests, notifications, or status updates.
 * Common use cases include displaying messages for error, success, or informational states.
 *
 * Key Features:
 * - Unique identifier for each notification
 * - Configurable display duration
 * - Customizable styling with support for classes and icons
 * - Flexible action handling: supports links or direct click actions
 */
export default {
  title: 'Base Components/SFToast',
  component: SFToast,
  render: (args: ComponentPropsAndSlots<typeof SFToast>) => ({
    components: { SFToast },
    setup() {
      return { args }
    },
    template: `<SFToast v-bind="args" />`,
  }),
} satisfies Meta<typeof SFToast>

/**
 * Shows success toast
 */
export const Success = {
  args: {
    notification: {
      id: '1',
      message: 'Success message',
      duration: 5000,
      type: {
        classes: 'text-status-success bg-status-success-light',
        iconComponent: 'IconCheckGreen',
      },
      action: { text: 'VIEW', href: '/' },
    },
  },
} satisfies Meta<typeof SFToast>

/**
 * Shows failure (error) toast
 */
export const Failure = {
  args: {
    notification: {
      id: '1',
      message: 'Error message',
      duration: 5000,
      type: {
        classes: 'text-status-error bg-status-error-light',
        iconComponent: 'IconError',
      },
      action: { text: 'VIEW', href: '/' },
    },
  },
} satisfies Meta<typeof SFToast>

/**
 * Shows info toast
 */
export const Info = {
  args: {
    notification: {
      id: '1',
      message: 'Info message',
      duration: 5000,
      type: {
        classes: 'text-accent bg-status-info',
        iconComponent: 'IconInfo',
      },
      action: { text: 'VIEW', href: '/' },
    },
  },
} satisfies Meta<typeof SFToast>
