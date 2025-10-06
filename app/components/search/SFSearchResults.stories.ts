import type { StoryObj, ComponentPropsAndSlots } from '@storybook-vue/nuxt'
import {
  categorySearchSuggestionFactory,
  productSearchSuggestionFactory,
  navigationItemSuggestionFactory,
} from '@scayle/storefront-nuxt/test/factories'
import type { CategorySearchSuggestion } from '@scayle/storefront-nuxt'
import SFSearchResults from './SFSearchResults.vue'

// Constants to avoid magic strings and repeated values
const TEST_IMAGES = {
  image1: 'product-1.avif',
  image2: 'product-2.avif',
  image3: 'product-3.avif',
} as const

const TEST_NAMES = {
  categories: [
    'Dresses',
    'Shoes',
    'Accessories',
    "Women's Clothing",
    "Women's Shoes",
  ],
  navigation: ['New In', 'Clothing', 'Sale', 'Clearance'],
} as const

// Helper functions to reduce code duplication
const createCategoryPatch = (
  c: CategorySearchSuggestion,
  name: string,
): CategorySearchSuggestion => ({
  ...c,
  categorySuggestion: {
    ...c.categorySuggestion,
    category: { ...c.categorySuggestion.category, name },
  },
})

const createNavigationPatch = (
  n: ReturnType<typeof navigationItemSuggestionFactory.build>,
  name: string,
): ReturnType<typeof navigationItemSuggestionFactory.build> => ({
  ...n,
  navigationItemSuggestion: {
    ...n.navigationItemSuggestion,
    navigationItem: {
      ...n.navigationItemSuggestion.navigationItem,
      name,
    },
  },
})

const createProductWithImage = (
  suggestion: ReturnType<typeof productSearchSuggestionFactory.build>,
  imageHash: string,
): ReturnType<typeof productSearchSuggestionFactory.build> => ({
  ...suggestion,
  productSuggestion: {
    ...suggestion.productSuggestion,
    product: {
      ...suggestion.productSuggestion.product,
      images: [
        {
          hash: imageHash,
          attributes: {},
        },
      ],
    },
  },
})

/**
 * SFSearchResults displays search suggestions organized by type (products, categories, navigation items).
 * It provides a unified interface for displaying different types of search results with appropriate styling.
 */
export default {
  title: 'Search/SFSearchResults',
  component: SFSearchResults,
  render: (args: ComponentPropsAndSlots<typeof SFSearchResults>) => ({
    components: { SFSearchResults },
    setup() {
      return { args }
    },
    template: `
      <div class="w-full max-w-screen-sm">
        <SFSearchResults v-bind="args" />
      </div>
    `,
  }),
}

type Story = StoryObj<typeof SFSearchResults>

/**
 * Shows the search results with all types of suggestions (products, categories, navigation items).
 * Displays a comprehensive search result interface with different content types.
 */
export const Default: Story = {
  args: {
    searchTerm: 'dress',
    categories: (() => {
      const c1 = categorySearchSuggestionFactory.build()
      const c2 = categorySearchSuggestionFactory.build()
      const c3 = categorySearchSuggestionFactory.build()
      return [
        createCategoryPatch(c1, TEST_NAMES.categories[0]),
        createCategoryPatch(c2, TEST_NAMES.categories[1]),
        createCategoryPatch(c3, TEST_NAMES.categories[2]),
      ]
    })(),
    products: (() => {
      const s1 = productSearchSuggestionFactory.build()
      const s2 = productSearchSuggestionFactory.build()
      const s3 = productSearchSuggestionFactory.build()
      return [
        createProductWithImage(s1, TEST_IMAGES.image1),
        createProductWithImage(s2, TEST_IMAGES.image2),
        createProductWithImage(s3, TEST_IMAGES.image3),
      ]
    })(),
    navigationItems: (() => {
      const n1 = navigationItemSuggestionFactory.build()
      const n2 = navigationItemSuggestionFactory.build()
      const n3 = navigationItemSuggestionFactory.build()
      return [
        createNavigationPatch(n1, TEST_NAMES.navigation[0]),
        createNavigationPatch(n2, TEST_NAMES.navigation[1]),
        createNavigationPatch(n3, TEST_NAMES.navigation[2]),
      ]
    })(),
  },
}

/**
 * Shows the search results with only product suggestions.
 * Displays only product search results without categories or navigation items.
 */
export const ProductsOnly: Story = {
  name: 'Products only',
  args: {
    searchTerm: 'shirt',
    categories: [],
    products: (() => {
      const s1 = productSearchSuggestionFactory.build()
      const s2 = productSearchSuggestionFactory.build()
      return [
        createProductWithImage(s1, TEST_IMAGES.image1),
        createProductWithImage(s2, TEST_IMAGES.image2),
      ]
    })(),
    navigationItems: [],
  },
}

/**
 * Shows the search results with only category suggestions.
 * Displays only category search results without products or navigation items.
 */
export const CategoriesOnly: Story = {
  name: 'Categories only',
  args: {
    searchTerm: 'women',
    categories: (() => {
      const c1 = categorySearchSuggestionFactory.build()
      const c2 = categorySearchSuggestionFactory.build()
      return [
        createCategoryPatch(c1, TEST_NAMES.categories[3]),
        createCategoryPatch(c2, TEST_NAMES.categories[4]),
      ]
    })(),
    products: [],
    navigationItems: [],
  },
}

/**
 * Shows the search results with only navigation item suggestions.
 * Displays only navigation item search results without products or categories.
 */
export const NavigationItemsOnly: Story = {
  name: 'Navigation items only',
  args: {
    searchTerm: 'sale',
    categories: [],
    products: [],
    navigationItems: (() => {
      const n1 = navigationItemSuggestionFactory.build()
      const n2 = navigationItemSuggestionFactory.build()
      return [
        createNavigationPatch(n1, TEST_NAMES.navigation[2]),
        createNavigationPatch(n2, TEST_NAMES.navigation[3]),
      ]
    })(),
  },
}
