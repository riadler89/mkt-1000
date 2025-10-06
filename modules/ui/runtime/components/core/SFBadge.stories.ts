import type { ComponentPropsAndSlots } from '@storybook-vue/nuxt'
import SFBadge from './SFBadge.vue'

/**
 * SFBadge is a compact numeric indicator component used to display counts, notifications, or other numeric values.
 * It provides a consistent visual style for showing quantities throughout the application with a rounded pill design.
 *
 * Key features:
 * - Displays numeric values in a compact, visually appealing format
 * - Consistent styling with primary color scheme
 * - Small, unobtrusive design that doesn't interfere with main content
 * - Commonly used for cart item counts, notification numbers, or inventory indicators
 */
export default {
  title: 'Base Components/SFBadge',
  component: SFBadge,

  render: (args: ComponentPropsAndSlots<typeof SFBadge>) => ({
    components: { SFBadge },
    setup() {
      return { args }
    },
    template: `<SFBadge v-bind="args" />`,
  }),
}

/**
 * Standard badge displaying a typical count value.
 * This is the most common use case for showing quantities like cart items or notifications.
 */
export const Default = {
  args: {
    badge: 5,
  },
}
