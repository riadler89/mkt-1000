import type { ComponentPropsAndSlots } from '@storybook-vue/nuxt'
import SFFilterRangeSlider from './SFFilterRangeSlider.vue'

/**
 * SFFilterRangeSlider is a dual-handle range slider component designed for filtering products by price or discount percentage.
 * It includes a visual slider with tooltips and input fields for precise value entry.
 * The component supports both price filtering (with currency formatting) and percentage-based discount filtering.
 */
export default {
  title: 'Base Components/SFFilterRangeSlider',
  component: SFFilterRangeSlider,
  argTypes: {
    filterSlug: {
      control: { type: 'select' },
      options: ['prices', 'max_savings_percentage'],
    },
    modelValue: {
      control: 'object',
      description:
        'Current range values as a tuple [min, max]. Values should match the filterSlug type.',
    },
  },
  render: (args: ComponentPropsAndSlots<typeof SFFilterRangeSlider>) => ({
    components: { SFFilterRangeSlider },
    setup() {
      return { args }
    },
    template: `<div class="w-96"><SFFilterRangeSlider v-bind="args" /></div>`,
  }),
}

/**
 * Price range slider for filtering products by price.
 * Displays values in currency format and handles price-specific rounding and formatting.
 */
export const PriceFilter = {
  args: {
    filterSlug: 'prices',
    min: 1000, // $10.00 in cents
    max: 50000, // $500.00 in cents
    modelValue: [2000, 30000], // $20.00 - $300.00
  },
}

/**
 * Discount percentage range slider for filtering products by savings.
 * Displays values as percentages and handles percentage-specific formatting.
 */
export const DiscountFilter = {
  args: {
    filterSlug: 'max_savings_percentage',
    min: 0,
    max: 80,
    modelValue: [10, 50],
  },
}
