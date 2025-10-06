import type { StoryObj, ComponentPropsAndSlots } from '@storybook-vue/nuxt'
import type { CentAmount, Campaign } from '@scayle/storefront-nuxt'
import {
  basketItemFactory,
  productFactory,
  variantFactory,
} from '@scayle/storefront-nuxt/dist/test/factories'
import SFBasketCard from './SFBasketCard.vue'

/**
 * SFBasketCard displays individual basket items with product information, pricing, and quantity controls.
 * It supports sold out states, campaigns, and provides quantity update and deletion functionality.
 */
export default {
  title: 'Basket/SFBasketCard',
  component: SFBasketCard,
  argTypes: {
    onDelete: {
      action: 'item-deleted',
      description: 'Event handler for item deletion from basket.',
    },
    'onUpdate:quantity': {
      action: 'quantity-updated',
      description: 'Event handler for quantity changes.',
    },
  },
  render: (args: ComponentPropsAndSlots<typeof SFBasketCard>) => ({
    components: { SFBasketCard },
    setup() {
      return { args }
    },
    template: `
      <div class="w-2/3 p-6 bg-gray-50">
        <ul class="bg-white rounded-lg border border-gray-200">
          <SFBasketCard v-bind="args" />
        </ul>
      </div>
    `,
  }),
}

const availableBasketItem = basketItemFactory.build({
  key: 'available-item',
  quantity: 2,
  availableQuantity: 5,
  status: 'available',
  product: productFactory.build({
    id: 12345,
    referenceKey: 'REF-001',
    attributes: {
      brand: {
        id: 1,
        key: 'brand',
        label: 'Brand',
        type: 'string',
        multiSelect: false,
        values: {
          id: 1,
          label: 'ADIDAS',
          value: 'adidas',
        },
      },
      name: {
        id: 2,
        key: 'name',
        label: 'Name',
        type: 'string',
        multiSelect: false,
        values: {
          id: 2,
          label: 'Running Shoes Pro',
          value: 'running-shoes-pro',
        },
      },
    },
    images: [
      {
        hash: 'product-1.avif',
        attributes: {},
      },
    ],
  }),
  variant: variantFactory.build({
    id: 67890,
    attributes: {
      size: {
        id: 3,
        key: 'size',
        label: 'Size',
        type: 'string',
        multiSelect: false,
        values: {
          id: 3,
          label: 'EU 42',
          value: '42',
        },
      },
      color: {
        id: 4,
        key: 'color',
        label: 'Color',
        type: 'string',
        multiSelect: false,
        values: {
          id: 4,
          label: 'Black',
          value: 'black',
        },
      },
    },
  }),
  price: {
    total: {
      currencyCode: 'EUR',
      withTax: 9990 as CentAmount,
      withoutTax: 8403 as CentAmount,
      appliedReductions: [],
    },
    unit: {
      currencyCode: 'EUR',
      withTax: 4995 as CentAmount,
      withoutTax: 4201 as CentAmount,
      appliedReductions: [],
    },
  },
})

/**
 * Shows an available basket item that can be modified or removed.
 * This is the standard state for items that are in stock and available for purchase.
 */
export const Available: StoryObj<typeof SFBasketCard> = {
  args: {
    basketItem: availableBasketItem,
  },
}

/**
 * Shows a sold out basket item with disabled controls.
 * Demonstrates how the component handles unavailable products with appropriate visual indicators.
 */
export const SoldOut: StoryObj<typeof SFBasketCard> = {
  args: {
    basketItem: basketItemFactory.build({
      ...availableBasketItem,
      key: 'sold-out-item',
      status: 'unavailable',
      availableQuantity: 0,
    }),
  },
}

/**
 * Shows a basket item with an active campaign.
 * Displays campaign badges and special pricing when a promotional campaign is applied.
 */
export const WithCampaign: StoryObj<typeof SFBasketCard> = {
  args: {
    basketItem: basketItemFactory.build({
      ...availableBasketItem,
      key: 'campaign-item',
      price: {
        ...availableBasketItem.price,
        total: {
          ...availableBasketItem.price.total,
          appliedReductions: [
            {
              category: 'campaign',
              type: 'relative',
              amount: {
                relative: 0.2,
                absoluteWithTax: 2000 as CentAmount,
              },
            },
          ],
        },
      },
    }),
    campaign: {
      id: 1,
      name: 'Summer Sale',
      headline: 'Summer Collection',
      subline: 'Limited Time Offer',
      link: '#',
      hideCountdown: false,
      color: { background: '#FFE4E6', text: '#991B1B' },
      product: { badgeLabel: 'SALE' },
      condition: 'summer-sale',
      endsAt: new Date(Date.now() + 86400000 * 7).toISOString(),
    } as Campaign,
  },
}

/**
 * Shows a basket item with sale pricing.
 * Demonstrates strike-through pricing when regular sales discounts are applied to the item.
 */
export const OnSale: StoryObj<typeof SFBasketCard> = {
  args: {
    basketItem: basketItemFactory.build({
      ...availableBasketItem,
      key: 'sale-item',
      price: {
        ...availableBasketItem.price,
        total: {
          ...availableBasketItem.price.total,
          appliedReductions: [
            {
              category: 'sale',
              type: 'relative',
              amount: {
                relative: 0.3,
                absoluteWithTax: 4300 as CentAmount,
              },
            },
          ],
        },
      },
    }),
  },
}
