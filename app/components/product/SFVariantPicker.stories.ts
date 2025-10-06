import type { StoryObj, ComponentPropsAndSlots } from '@storybook-vue/nuxt'
import { variantFactory } from '@scayle/storefront-nuxt/test/factories'
import type { CentAmount, Variant } from '@scayle/storefront-nuxt'
import SFVariantPicker from './SFVariantPicker.vue'

/**
 * SFVariantPicker provides a dropdown interface for selecting product variants (e.g., sizes).
 * It displays available variants with pricing information and handles sold-out states.
 */
export default {
  title: 'Product/SFVariantPicker',
  component: SFVariantPicker,
  render: (args: ComponentPropsAndSlots<typeof SFVariantPicker>) => ({
    components: { SFVariantPicker },
    setup() {
      return { args }
    },
    template: `
      <div class="w-60">
        <SFVariantPicker v-bind="args" class="w-full "/>
      </div>
    `,
  }),
}

type Story = StoryObj<typeof SFVariantPicker>

const variants: Variant[] = [
  variantFactory.build({
    id: 1,
    attributes: {
      size: {
        id: 1,
        key: 'size',
        label: 'Size',
        type: '',
        multiSelect: false,
        values: {
          id: 1,
          label: 'S',
          value: 's',
        },
      },
    },
    stock: { quantity: 10 },
    price: {
      currencyCode: 'EUR',
      withTax: 4990,
      withoutTax: 2495,
      tax: {
        vat: {
          amount: 2495,
          rate: 0.999999,
        },
      },
      appliedReductions: [],
    },
  }),
  variantFactory.build({
    id: 2,
    attributes: {
      size: {
        id: 1,
        key: 'size',
        label: 'Size',
        type: '',
        multiSelect: false,
        values: {
          id: 2,
          label: 'M',
          value: 'm',
        },
      },
    },
    stock: { quantity: 5 },
    price: {
      currencyCode: 'EUR',
      withTax: 4990,
      withoutTax: 2495,
      tax: {
        vat: {
          amount: 2495,
          rate: 0.999999,
        },
      },
      appliedReductions: [],
    },
  }),
  variantFactory.build({
    id: 3,
    attributes: {
      size: {
        id: 1,
        key: 'size',
        label: 'Size',
        type: '',
        multiSelect: false,
        values: {
          id: 3,
          label: 'L',
          value: 'l',
        },
      },
    },
    stock: { quantity: 0 },
    price: {
      currencyCode: 'EUR',
      withTax: 4990,
      withoutTax: 2495,
      tax: {
        vat: {
          amount: 2495,
          rate: 0.999999,
        },
      },
      appliedReductions: [],
    },
  }),
]

/**
 * Shows the variant picker with multiple size options available.
 * Displays a dropdown with different sizes and their availability status.
 */
export const Default: Story = {
  args: {
    variants,
    hasOneVariantOnly: false,
  },
}

/**
 * Shows the variant picker with only one variant available.
 * The picker is disabled when there's only one option.
 */
export const OneVariantOnly: Story = {
  name: 'One variant only',
  args: {
    modelValue: variants[0],
    variants: variants.slice(0, 1),
    hasOneVariantOnly: true,
  },
}

/**
 * Shows the variant picker with strike-through pricing enabled.
 * Displays crossed-out prices for variants with applied reductions.
 */
export const StrikeThroughPrice: Story = {
  name: 'Strike-through price',
  args: {
    variants: [
      variantFactory.build({
        price: {
          appliedReductions: [
            {
              category: 'sale',
              type: 'relative',
              amount: { relative: 0.2, absoluteWithTax: 2000 as CentAmount },
            },
          ],
        },
      }),
    ],
    hasOneVariantOnly: false,
    strikeThroughPrice: true,
  },
}

/**
 * Shows the variant picker with sold-out variants.
 * Displays sold-out variants with disabled state and "Sold out" text.
 */
export const WithSoldOutVariants: Story = {
  name: 'With sold-out variants',
  args: {
    variants: [
      ...variants,
      variantFactory.build({
        id: 4,
        attributes: {
          size: {
            id: 1,
            key: 'size',
            label: 'Size',
            type: '',
            multiSelect: false,
            values: {
              id: 4,
              label: 'XL',
              value: 'xl',
            },
          },
        },
        stock: { quantity: 0 },
        price: {
          currencyCode: 'EUR',
          withTax: 4990,
          withoutTax: 2495,
          tax: {
            vat: {
              amount: 2495,
              rate: 0.999999,
            },
          },
          appliedReductions: [],
        },
      }),
    ],
    hasOneVariantOnly: false,
  },
}
