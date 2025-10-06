import type {
  SearchV2With,
  WishlistWithOptions,
  BasketWithOptions,
  ProductWith,
} from '@scayle/storefront-nuxt'
import type { RuntimeConfig } from 'nuxt/schema'

export const PRODUCT_DETAIL_WITH_PARAMS = {
  attributes: 'all',
  advancedAttributes: 'all',
  variants: {
    attributes: 'all',
    lowestPriorPrice: true,
  },
  images: {
    attributes: {
      withKey: ['primaryImage'],
    },
  },
  categories: 'all',
  siblings: {
    images: {
      attributes: {
        withKey: ['primaryImage'],
      },
    },
    attributes: {
      withKey: ['color', 'name', 'brand'],
    },
    priceRange: true,
  },
  priceRange: true,
  lowestPriorPrice: true,
} satisfies ProductWith

export const PRODUCT_TILE_WITH_PARAMS = {
  attributes: {
    withKey: ['color', 'name', 'brand', 'storefrontBadge', 'promotion'],
  },
  images: {
    attributes: {
      withKey: ['primaryImage', 'primaryImageType'],
    },
  },
  categories: 'all',
  siblings: {
    images: {
      attributes: {
        withKey: ['primaryImage'],
      },
    },
    attributes: {
      withKey: ['color', 'name', 'brand'],
    },
    priceRange: true,
  },
  priceRange: true,
  lowestPriorPrice: true,
} satisfies ProductWith

export default {
  wishlist: {
    items: {
      product: PRODUCT_TILE_WITH_PARAMS,
    },
  } satisfies WishlistWithOptions,
  basket: {
    items: {
      product: PRODUCT_DETAIL_WITH_PARAMS,
      variant: PRODUCT_DETAIL_WITH_PARAMS.variants,
      promotion: true,
    },
    applicablePromotions: true,
  } satisfies BasketWithOptions,
  product: PRODUCT_DETAIL_WITH_PARAMS,
  searchV2: {
    product: PRODUCT_TILE_WITH_PARAMS,
    categories: {
      parents: 'all',
      children: 0,
    },
    navigationItem: {
      category: 'all',
    },
  } satisfies SearchV2With,
} satisfies RuntimeConfig['storefront']['withParams']
