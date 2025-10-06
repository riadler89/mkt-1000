import type { ComponentPropsAndSlots, Meta } from '@storybook-vue/nuxt'
import SFSkeletonLoader from './SFSkeletonLoader.vue'
import { SkeletonType } from '#storefront-ui'

/**
 * SFSkeletonLoader is a loading placeholder component that displays animated
 * skeleton elements while content is being fetched or processed. It provides
 * visual feedback to users and maintains layout stability during loading states.
 *
 * Key features:
 * - Multiple skeleton types (button, headline, custom) for different content shapes
 * - Animated pulse effect for visual feedback
 * - Responsive width options (fixed or full width)
 * - Consistent styling with the design system
 * - Customizable dimensions for specific use cases
 * - Improves perceived performance and user experience
 */
export default {
  title: 'Base Components/SFSkeletonLoader',
  component: SFSkeletonLoader,
  argTypes: {
    type: {
      control: { type: 'select' },
      options: Object.values(SkeletonType),
    },
  },
  render: (args: ComponentPropsAndSlots<typeof SFSkeletonLoader>) => ({
    components: { SFSkeletonLoader },
    setup() {
      return { args }
    },
    template: `<SFSkeletonLoader v-bind="args" />`,
  }),
}

export const Default = {
  render: (args) => ({
    components: { SFSkeletonLoader },
    setup() {
      return { args }
    },
    template: `<SFSkeletonLoader v-bind="args" />`,
  }),
} satisfies Meta<typeof SFSkeletonLoader>

/**
 * Multiple skeleton elements in a layout. Shows how to combine
 * different skeleton types to create realistic loading states
 * for complex content areas.
 */
export const Layout = {
  render: (args) => ({
    components: { SFSkeletonLoader },
    setup() {
      return { args, SkeletonType }
    },
    template: `
    <div class="space-y-4 p-4">
      <div class="space-y-2">
        <SFSkeletonLoader :type="SkeletonType.HEADLINE" />
        <SFSkeletonLoader :type="SkeletonType.CUSTOM" :full-width="true" class="h-4" />
        <SFSkeletonLoader :type="SkeletonType.CUSTOM" :full-width="true" class="h-4" />
      </div>
      <div class="flex gap-2">
        <SFSkeletonLoader :type="SkeletonType.BUTTON" />
        <SFSkeletonLoader :type="SkeletonType.BUTTON" />
      </div>
    </div>`,
  }),
} satisfies Meta<typeof SFSkeletonLoader>

/**
 * Product card skeleton layout. Demonstrates a realistic use case
 * for skeleton loaders in e-commerce applications.
 */
export const ProductCard = {
  render: (args) => ({
    components: { SFSkeletonLoader },
    setup() {
      return { args, SkeletonType }
    },
    template: `
    <div class="border border-gray-200 rounded-lg p-4 max-w-sm">
      <div class="space-y-3">
        <!-- Product image skeleton -->
        <SFSkeletonLoader :type="SkeletonType.CUSTOM" class="h-48 w-full rounded" />

        <!-- Product title skeleton -->
        <SFSkeletonLoader :type="SkeletonType.HEADLINE" />

        <!-- Product description skeleton -->
        <div class="space-y-1">
          <SFSkeletonLoader :type="SkeletonType.CUSTOM" class="h-3 w-full" />
          <SFSkeletonLoader :type="SkeletonType.CUSTOM" class="h-3 w-3/4" />
        </div>

        <!-- Price and button skeleton -->
        <div class="flex justify-between items-center gap-8">
          <SFSkeletonLoader :type="SkeletonType.CUSTOM" class="h-6 w-16" />
          <SFSkeletonLoader :type="SkeletonType.BUTTON" />
        </div>
      </div>
    </div>`,
  }),
} satisfies Meta<typeof SFSkeletonLoader>
