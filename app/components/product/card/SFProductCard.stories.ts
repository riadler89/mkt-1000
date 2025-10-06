import { userEvent, within } from 'storybook/test'
import type { StoryObj, ComponentPropsAndSlots } from '@storybook-vue/nuxt'
import type {
  CentAmount,
  Campaign as CampaignType,
} from '@scayle/storefront-nuxt'
import {
  productFactory,
  priceFactory,
} from '@scayle/storefront-nuxt/dist/test/factories'
import SFProductCard from './SFProductCard.vue'

/**
 * SFProductCard displays product information in a card format, commonly used in product listing pages.
 * It provides a comprehensive view of product details including images, pricing, and interactive elements.
 *
 * Key features:
 * - Multiple product image support with hover interaction
 * - Price display with tax information
 * - Product status indicators (new, sold out)
 * - Support for product variants and siblings
 */
export default {
  title: 'Product/SFProductCard',
  component: SFProductCard,
  argTypes: {
    onClickProduct: {
      action: 'product-clicked',
      description:
        'Event handler for product card clicks. Use this to handle navigation to product details or custom interactions.',
    },
    onIntersectProduct: {
      action: 'product-intersected',
      description:
        'Event handler for product card intersection. Use this to track product visibility for analytics or lazy loading.',
    },
    'onProduct-image:mouseover': {
      action: 'product-image-hovered',
      description:
        'Event handler for product image hover. Use this to trigger additional product information or image gallery.',
    },
    'onProduct-image:mouseleave': {
      action: 'product-image-left',
      description:
        'Event handler for product image mouse leave. Use this to handle hover state cleanup.',
    },
  },
  render: (args: ComponentPropsAndSlots<typeof SFProductCard>) => ({
    components: { SFProductCard },
    setup() {
      return { args }
    },
    template: `<SFProductCard class="col-span-6 mb-5 w-96 lg:col-span-4 xl:col-span-3" v-bind="args" />`,
  }),
}

const singleImageProduct = productFactory.build({
  priceRange: {
    min: {
      currencyCode: 'EUR',
      withTax: 4990 as CentAmount,
      withoutTax: 2495 as CentAmount,
      tax: {
        vat: {
          amount: 2495 as CentAmount,
          rate: 0.999999,
        },
      },
      appliedReductions: [],
    },
    max: {
      currencyCode: 'EUR',
      withTax: 10000 as CentAmount,
      withoutTax: 5000 as CentAmount,
      tax: {
        vat: {
          amount: 5000 as CentAmount,
          rate: 0.999999,
        },
      },
      appliedReductions: [],
    },
  },
  images: [
    {
      hash: 'https://next-qa.cdn.scayle.cloud/images/34be74e93c141978eec5be5a1c9b34fa.png?width=338&height=451&quality=75',
      attributes: {
        primaryImage: {
          id: 7061,
          key: 'primaryImage',
          label: 'Primary Image',
          type: '',
          multiSelect: false,
          values: {
            id: 2433,
            label: 'true',
            value: 'true',
          },
        },
      },
    },
  ],
  siblings: [
    {
      id: 205629,
      isActive: true,
      isSoldOut: false,
      isNew: false,
      createdAt: '2024-07-12T23:09:12+00:00',
      updatedAt: '2025-05-06T07:30:33+00:00',
      indexedAt: new Date('2025-05-14T14:16:42+00:00'),
      firstLiveAt: new Date('2024-09-18T09:20:21+00:00'),
      masterKey: 'SW244-131',
      referenceKey: 'HK5250-pc',
      attributes: {
        brand: {
          id: 550,
          key: 'brand',
          label: 'Brand',
          type: '',
          multiSelect: false,
          values: {
            id: 2259,
            label: 'ADIDAS ORIGINALS',
            value: 'adidas_originals',
          },
        },
        name: {
          id: 20005,
          key: 'name',
          label: 'Name',
          type: '',
          multiSelect: false,
          values: {
            id: 20005,
            label: "Jacke 'Premium '",
            value: 'name',
          },
        },
        color: {
          id: 1000,
          key: 'color',
          label: 'Farbe',
          type: '',
          multiSelect: true,
          values: [
            {
              id: 2279,
              label: 'Lila',
              value: 'lila',
            },
          ],
        },
      },
      images: [
        {
          hash: 'https://next-qa.cdn.scayle.cloud/images/86ec3ab34cbf210b87f1f0a4eb4b8cb1.jpg?width=640&height=854&quality=75',
          attributes: {
            primaryImage: {
              id: 7061,
              key: 'primaryImage',
              label: 'Primary Image',
              type: '',
              multiSelect: false,
              values: {
                id: 2433,
                label: 'true',
                value: 'true',
              },
            },
          },
        },
      ],
      priceRange: {
        min: {
          currencyCode: 'EUR',
          withTax: 10000 as CentAmount,
          withoutTax: 5000 as CentAmount,
          tax: {
            vat: {
              amount: 5000 as CentAmount,
              rate: 0.999999,
            },
          },
          appliedReductions: [],
        },
        max: {
          currencyCode: 'EUR',
          withTax: 10000 as CentAmount,
          withoutTax: 5000 as CentAmount,
          tax: {
            vat: {
              amount: 5000 as CentAmount,
              rate: 0.999999,
            },
          },
          appliedReductions: [],
        },
      },
    },
  ],
})

/**
 * Shows a product card with a single image.
 * This is the basic implementation suitable for products with one main image.
 */
export const Default: StoryObj<typeof SFProductCard> = {
  args: {
    product: singleImageProduct,
    multipleImages: true,
  },
}

const multipleImagesProduct = productFactory.build({
  priceRange: {
    min: {
      currencyCode: 'EUR',
      withTax: 4990 as CentAmount,
      withoutTax: 2495 as CentAmount,
      tax: {
        vat: {
          amount: 2495 as CentAmount,
          rate: 0.999999,
        },
      },
      appliedReductions: [
        {
          category: 'sale',
          type: 'relative',
          amount: {
            relative: 0.5,
            absoluteWithTax: 5000 as CentAmount,
          },
        },
      ],
    },
    max: {
      currencyCode: 'EUR',
      withTax: 10000 as CentAmount,
      withoutTax: 5000 as CentAmount,
      tax: {
        vat: {
          amount: 5000 as CentAmount,
          rate: 0.999999,
        },
      },
      appliedReductions: [],
    },
  },
  images: [
    {
      hash: 'https://next-qa.cdn.scayle.cloud/images/34be74e93c141978eec5be5a1c9b34fa.png?width=338&height=451&quality=75',
      attributes: {
        primaryImage: {
          id: 7061,
          key: 'primaryImage',
          label: 'Primary Image',
          type: '',
          multiSelect: false,
          values: {
            id: 2433,
            label: 'true',
            value: 'true',
          },
        },
      },
    },
    {
      hash: 'https://next-qa.cdn.scayle.cloud/images/5c7c2a3c5eccba3c4b35f35240f4dd8b.jpg?width=338&height=451&quality=75',
      attributes: {
        primaryImage: {
          id: 7061,
          key: 'primaryImage',
          label: 'Primary Image',
          type: '',
          multiSelect: false,
          values: {
            id: 2433,
            label: 'true',
            value: 'true',
          },
        },
      },
    },
    {
      hash: 'https://next-qa.cdn.scayle.cloud/images/d6afcf46fb3840eb1e939e57244036cb.jpg?width=338&height=451&quality=75',
      attributes: {},
    },
    {
      hash: 'https://next-qa.cdn.scayle.cloud/images/3fdc955648eb954bdb1505e42345efa6.jpg?width=338&height=451&quality=75',
      attributes: {},
    },
    {
      hash: 'https://next-qa.cdn.scayle.cloud/images/c95dd072516be2bdbb89438cfdfafd62.jpg?width=338&height=451&quality=75',
      attributes: {},
    },
  ],
  siblings: [
    {
      id: 205629,
      isActive: true,
      isSoldOut: false,
      isNew: false,
      createdAt: '2024-07-12T23:09:12+00:00',
      updatedAt: '2025-05-06T07:30:33+00:00',
      indexedAt: new Date('2025-05-14T14:16:42+00:00'),
      firstLiveAt: new Date('2024-09-18T09:20:21+00:00'),
      masterKey: 'SW244-131',
      referenceKey: 'HK5250-pc',
      attributes: {
        brand: {
          id: 550,
          key: 'brand',
          label: 'Brand',
          type: '',
          multiSelect: false,
          values: {
            id: 2259,
            label: 'ADIDAS ORIGINALS',
            value: 'adidas_originals',
          },
        },
        name: {
          id: 20005,
          key: 'name',
          label: 'Name',
          type: '',
          multiSelect: false,
          values: {
            id: 20005,
            label: "Jacke 'Premium '",
            value: 'name',
          },
        },
        color: {
          id: 1000,
          key: 'color',
          label: 'Farbe',
          type: '',
          multiSelect: true,
          values: [
            {
              id: 2279,
              label: 'Lila',
              value: 'lila',
            },
          ],
        },
      },
      images: [
        {
          hash: 'https://next-qa.cdn.scayle.cloud/images/86ec3ab34cbf210b87f1f0a4eb4b8cb1.jpg?width=640&height=854&quality=75',
          attributes: {
            primaryImage: {
              id: 7061,
              key: 'primaryImage',
              label: 'Primary Image',
              type: '',
              multiSelect: false,
              values: {
                id: 2433,
                label: 'true',
                value: 'true',
              },
            },
          },
        },
      ],
      priceRange: {
        min: {
          currencyCode: 'EUR',
          withTax: 10000 as CentAmount,
          withoutTax: 5000 as CentAmount,
          tax: {
            vat: {
              amount: 5000 as CentAmount,
              rate: 0.999999,
            },
          },
          appliedReductions: [],
        },
        max: {
          currencyCode: 'EUR',
          withTax: 10000 as CentAmount,
          withoutTax: 5000 as CentAmount,
          tax: {
            vat: {
              amount: 5000 as CentAmount,
              rate: 0.999999,
            },
          },
          appliedReductions: [],
        },
      },
    },
  ],
})

/**
 * Demonstrates a product card with multiple images and hover interaction.
 * Users can hover over the product to see additional images and use navigation arrows.
 */
export const MultipleImages: StoryObj<typeof SFProductCard> = {
  args: {
    product: multipleImagesProduct,
    multipleImages: true,
  },
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const article = canvas.getByTestId('article')
    await userEvent.hover(article)
    const imageSliderNextButton = canvas.getByTestId('image-slider-next-button')
    const imageSliderPrevButton = canvas.getByTestId('image-slider-prev-button')
    await userEvent.click(imageSliderNextButton, { delay: 500 })

    await userEvent.click(imageSliderPrevButton, { delay: 1000 })
  },
}

/**
 * Shows a product card with campaign badge.
 * Displays a campaign deal badge when a campaign is applied to the product.
 */
export const Campaign: StoryObj<typeof SFProductCard> = {
  args: {
    product: productFactory.build({
      ...singleImageProduct,
      priceRange: {
        min: priceFactory.build({
          appliedReductions: [
            {
              category: 'campaign',
              type: 'absolute',
              amount: {
                relative: 20,
                absoluteWithTax: 200 as CentAmount,
              },
            },
          ],
        }),
      },
    }),
    multipleImages: true,
    campaign: {
      id: 99,
      name: 'Spring Campaign',
      headline: 'Spring Collection',
      subline: 'Limited Time Offer',
      link: '#',
      hideCountdown: false,
      color: { background: '#E0F7FF', text: '#0F172A' },
      product: { badgeLabel: 'Spring Deal' },
      condition: 'test-condition',
      endsAt: new Date(Date.now() + 86400000).toISOString(),
    } as CampaignType,
  },
}

/**
 * Shows a product card with sale pricing.
 * Displays strike-through pricing when the product has applied reductions.
 */
export const Sale: StoryObj<typeof SFProductCard> = {
  args: {
    product: productFactory.build({
      ...singleImageProduct,
      priceRange: {
        min: {
          ...singleImageProduct.priceRange?.min,
          appliedReductions: [
            {
              category: 'sale',
              type: 'relative',
              amount: { relative: 0.3, absoluteWithTax: 3000 as CentAmount },
            },
          ],
        },
        max: singleImageProduct.priceRange?.max,
      },
    }),
    multipleImages: true,
  },
}

/**
 * Shows a product card with promotion badges.
 * Displays promotion deal badges when promotions are active for the product.
 */
export const Promotions: StoryObj<typeof SFProductCard> = {
  args: {
    product: productFactory.build({
      ...singleImageProduct,
      attributes: {
        promotion: {
          id: 1,
          key: 'deal',
          label: 'deal',
          type: '',
          multiSelect: false,
          values: {
            id: 1,
            label: 'Deal',
            value: 'Deal',
          },
        },
      },
    }),
    multipleImages: false,
  },
}

/**
 * Shows a product card with "In Basket" badge.
 * Displays the "Already in basket" badge when the product is in the user's basket.
 */
export const InBasketBadge: StoryObj<typeof SFProductCard> = {
  args: {
    product: singleImageProduct,
    multipleImages: false,
  },
}

/**
 * Shows a product card with all possible badges.
 * Demonstrates how multiple badges appear together on a single product card.
 */
export const AllBadges: StoryObj<typeof SFProductCard> = {
  args: {
    product: productFactory.build({
      ...singleImageProduct,
      isNew: true,
      attributes: {
        promotion: {
          id: 1,
          key: 'deal',
          label: 'deal',
          type: '',
          multiSelect: false,
          values: {
            id: 1,
            label: 'Deal',
            value: 'Deal',
          },
        },
      },
      priceRange: {
        min: {
          ...singleImageProduct.priceRange?.min,
          appliedReductions: [
            {
              category: 'sale',
              type: 'relative',
              amount: { relative: 0.25, absoluteWithTax: 3000 as CentAmount },
            },
            {
              category: 'campaign',
              type: 'absolute',
              amount: {
                relative: 20,
                absoluteWithTax: 200 as CentAmount,
              },
            },
          ],
        },
        max: singleImageProduct.priceRange?.max,
      },
    }),
    multipleImages: true,
    campaign: {
      id: 100,
      name: 'Mega Sale',
      headline: 'Mega Sale Event',
      subline: 'Everything Must Go',
      link: '#',
      hideCountdown: false,
      color: { background: '#FF6B6B', text: '#FFFFFF' },
      product: { badgeLabel: 'MEGA SALE' },
      condition: 'test-condition',
      endsAt: new Date(Date.now() + 86400000).toISOString(),
    } as CampaignType,
  },
}
