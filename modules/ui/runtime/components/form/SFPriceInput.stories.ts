import type { ComponentPropsAndSlots } from '@storybook-vue/nuxt'
import { ref } from 'vue'
import SFPriceInput from './SFPriceInput.vue'

/**
 * SFPriceInput is a specialized input component for entering price values.
 * It automatically formats currency values for display and handles conversion between major and minor currency units.
 * The component switches between text (formatted) and number (editable) modes based on focus state.
 */
export default {
  title: 'Base Components/SFPriceInput',
  component: SFPriceInput,
  argTypes: {
    modelValue: {
      control: 'number',
      description:
        'The current price value in minor currency units (e.g., cents). This is the actual value used by the application.',
    },
    currencyCode: {
      control: 'select',
      options: ['USD', 'EUR', 'GBP'],
    },
    locale: {
      control: 'select',
      options: ['en-US', 'de-DE', 'en-GB'],
    },
  },
  render: (args: ComponentPropsAndSlots<typeof SFPriceInput>) => ({
    components: { SFPriceInput },
    setup() {
      const modelValue = ref(args.modelValue)
      return { args, modelValue }
    },
    template: `<SFPriceInput v-bind="args" v-model="modelValue" />`,
  }),
}

/**
 * Basic price input with USD currency.
 * Shows the component with standard US dollar formatting.
 */
export const USD = {
  args: {
    modelValue: 2500, // $25.00
    currencyCode: 'USD',
    locale: 'en-US',
    min: 0,
    max: 100000, // $1000.00
  },
}

/**
 * Price input with Euro currency.
 * Demonstrates the component with European currency formatting.
 */
export const EUR = {
  args: {
    modelValue: 1999, // €19.99
    currencyCode: 'EUR',
    locale: 'de-DE',
    min: 0,
    max: 50000, // €500.00
  },
}

/**
 * Price input with British Pound.
 * Shows the component with UK currency formatting.
 */
export const GBP = {
  args: {
    modelValue: 1500, // £15.00
    currencyCode: 'GBP',
    locale: 'en-GB',
    min: 0,
    max: 75000, // £750.00
  },
}
