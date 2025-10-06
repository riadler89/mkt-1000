import type { StoryObj, ComponentPropsAndSlots } from '@storybook-vue/nuxt'
import { productFactory } from '@scayle/storefront-nuxt/test/factories'
import type { CentAmount } from '@scayle/storefront-nuxt'
import SFSiblingSelection from './SFSiblingSelection.vue'

/**
 * SFSiblingSelection displays a horizontal slider of product siblings (same product in different colors).
 * It allows users to switch between different color variants of the same product with hover interactions.
 */
export default {
  title: 'Product/SFSiblingSelection',
  component: SFSiblingSelection,
  render: (args: ComponentPropsAndSlots<typeof SFSiblingSelection>) => ({
    components: { SFSiblingSelection },
    setup() {
      return { args }
    },
    template: `
      <div class="w-full max-w-lg">
        <SFSiblingSelection v-bind="args" />
      </div>
    `,
  }),
}

type Story = StoryObj<typeof SFSiblingSelection>

const productWithSiblings = productFactory.build({
  id: 1,
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
      values: { id: 20005, label: "Jacket 'Premium'", value: 'name' },
    },
    color: {
      id: 1000,
      key: 'color',
      label: 'Color',
      type: '',
      multiSelect: true,
      values: [{ id: 1232, label: 'Black', value: 'black' }],
    },
  },
  images: [
    {
      hash: 'product-1.avif',
      attributes: {
        primaryImage: {
          id: 7061,
          key: 'primaryImage',
          label: 'Primary Image',
          type: '',
          multiSelect: false,
          values: { id: 2433, label: 'true', value: 'true' },
        },
      },
    },
  ],
  siblings: [
    {
      id: 3,
      isActive: true,
      isSoldOut: false,
      isNew: false,
      createdAt: '2024-07-12T23:09:12+00:00',
      updatedAt: '2025-05-06T07:30:33+00:00',
      indexedAt: new Date('2025-05-14T14:16:42+00:00'),
      firstLiveAt: new Date('2024-09-18T09:20:21+00:00'),
      masterKey: 'SW244-132',
      referenceKey: 'HK5251-pc',
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
          values: { id: 20005, label: "Jacket 'Premium'", value: 'name' },
        },
        color: {
          id: 1000,
          key: 'color',
          label: 'Color',
          type: '',
          multiSelect: true,
          values: [{ id: 2280, label: 'Blue', value: 'blue' }],
        },
      },
      images: [
        {
          hash: 'product-2.avif',
          attributes: {},
        },
      ],
    },
    {
      id: 4,
      isActive: true,
      isSoldOut: true,
      isNew: false,
      createdAt: '2024-07-12T23:09:12+00:00',
      updatedAt: '2025-05-06T07:30:33+00:00',
      indexedAt: new Date('2025-05-14T14:16:42+00:00'),
      firstLiveAt: new Date('2024-09-18T09:20:21+00:00'),
      masterKey: 'SW244-133',
      referenceKey: 'HK5252-pc',
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
          values: { id: 20005, label: "Jacket 'Premium'", value: 'name' },
        },
        color: {
          id: 1000,
          key: 'color',
          label: 'Color',
          type: '',
          multiSelect: true,
          values: [{ id: 2281, label: 'Green', value: 'green' }],
        },
      },
      images: [
        {
          hash: 'product-3.avif',
          attributes: {},
        },
      ],
    },
  ],
})

/**
 * Shows the sibling selection with multiple color variants available.
 * Displays a horizontal slider with different color options and hover interactions.
 */
export const Default: Story = {
  args: {
    product: productWithSiblings,
  },
}

/**
 * Shows the sibling selection with a product that has no siblings.
 * Displays an empty state when there are no color variants available.
 */
export const NoSiblings: Story = {
  name: 'No siblings',
  args: {
    product: productFactory.build({
      id: 205629,
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
          values: { id: 20005, label: "Jacket 'Premium'", value: 'name' },
        },
        color: {
          id: 1000,
          key: 'color',
          label: 'Color',
          type: '',
          multiSelect: true,
          values: [{ id: 1232, label: 'Black', value: 'black' }],
        },
      },
      images: [
        {
          hash: 'https://next-qa.cdn.scayle.cloud/images/3fe81c390b3af8b4be530eec6715bc49.jpg?width=640&height=854&quality=75',
          attributes: {
            primaryImage: {
              id: 7061,
              key: 'primaryImage',
              label: 'Primary Image',
              type: '',
              multiSelect: false,
              values: { id: 2433, label: 'true', value: 'true' },
            },
          },
        },
      ],
      siblings: [],
    }),
  },
}

/**
 * Shows the sibling selection with only sold-out variants.
 * Displays all siblings as sold-out with disabled state and strikethrough styling.
 */
export const AllSoldOut: Story = {
  name: 'All sold out',
  args: {
    product: productFactory.build({
      id: 1,
      isSoldOut: true,
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
          values: { id: 20005, label: "Jacket 'Premium'", value: 'name' },
        },
        color: {
          id: 1000,
          key: 'color',
          label: 'Color',
          type: '',
          multiSelect: true,
          values: [{ id: 1232, label: 'Black', value: 'black' }],
        },
      },
      images: [
        {
          hash: 'https://next-qa.cdn.scayle.cloud/images/3fe81c390b3af8b4be530eec6715bc49.jpg?width=640&height=854&quality=75',
          attributes: {
            primaryImage: {
              id: 7061,
              key: 'primaryImage',
              label: 'Primary Image',
              type: '',
              multiSelect: false,
              values: { id: 2433, label: 'true', value: 'true' },
            },
          },
        },
      ],
      siblings: [
        {
          id: 2,
          isActive: true,
          isSoldOut: true,
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
              values: { id: 20005, label: "Jacket 'Premium'", value: 'name' },
            },
            color: {
              id: 1000,
              key: 'color',
              label: 'Color',
              type: '',
              multiSelect: true,
              values: [{ id: 2279, label: 'Purple', value: 'purple' }],
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
                  values: { id: 2433, label: 'true', value: 'true' },
                },
              },
            },
          ],
          priceRange: {
            min: {
              currencyCode: 'EUR',
              withTax: 10000 as CentAmount,
              withoutTax: 5000 as CentAmount,
              tax: { vat: { amount: 5000 as CentAmount, rate: 0.999999 } },
              appliedReductions: [],
            },
            max: {
              currencyCode: 'EUR',
              withTax: 10000 as CentAmount,
              withoutTax: 5000 as CentAmount,
              tax: { vat: { amount: 5000 as CentAmount, rate: 0.999999 } },
              appliedReductions: [],
            },
          },
        },
      ],
    }),
  },
}
