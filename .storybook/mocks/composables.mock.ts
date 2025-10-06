/**
 * Storybook Mock for Storefront Composables
 *
 * This file provides mock implementations of Storefront composables for Storybook development.
 * It serves two main purposes:
 * 1. Prevents unnecessary API calls during Storybook development by mocking composables that would normally make API requests
 * 2. Provides consistent mock data for UI component development and testing
 *
 * When adding new composables to Storybook:
 * - For simple data needs: Add a mock implementation in this file
 * - For complex functionality: Import the actual composable from '@scayle/storefront-nuxt/composables'
 */

import { ref } from 'vue'
import {
  automaticDiscountPromotionFactory,
  basketItemsFactory,
  buyXGetYPromotionFactory,
  promotionWithCodeFactory,
} from '@scayle/storefront-nuxt/dist/test/factories'

export { useProductPrice } from '@scayle/storefront-nuxt/composables'

// --- core ---
export function useAvailableShops() {
  return ref([])
}

export function useCurrentShop() {
  return ref({
    domain: 'localhost:3000',
    path: 'de',
    locale: 'de-DE',
    shopId: 1918,
    currency: 'EUR',
    isActive: true,
    checkout: {
      host: 'https://next-qa.checkout.api.scayle.cloud',
    },
    apiBasePath: '/api',
    paymentProviders: [
      'lastschrift',
      'visa',
      'mastercard',
      'discover',
      'diners',
      'ratepay',
      'klarna',
      'paypal',
    ],
    countryCode: 'DE',
  })
}

// We mock the `useFormatHelpers` composable to isolate this component for Storybook.
// This mock provides a simple implementation that returns formatted values (like currency and percentages)
// to ensure the story accurately represents the component's appearance with formatted data.
export function useFormatHelpers() {
  return {
    formatCurrency: (value: number) => `€${(value / 100).toFixed(2)}`,
    formatPercentage: (value: number) =>
      value.toLocaleString('en-US', {
        style: 'percent',
      }),
  }
}

export function useLog() {
  return {
    info: console.info,
    warn: console.warn,
    error: console.error,
    debug: console.debug,
  }
}

export function useIDP() {}

export function useRpc() {
  return {
    data: ref(null),
    error: ref(null),
    status: ref('success'),
    refresh: () => {},
    then: () => Promise.resolve({}),
  }
}

export function useRpcCall() {
  return () => Promise.resolve({})
}

export function useSession() {
  return ref({})
}

export function useUser() {
  return ref({})
}

// --- storefront ---
export function useBasket() {
  return { data: ref({ items: basketItemsFactory.build() }) }
}
export function useBrand() {
  return { data: ref({}) }
}
export function useBrands() {
  return { data: ref([]) }
}
export function useCategories() {
  return { data: ref([]) }
}
export function useCategoryById() {
  return { data: ref({}) }
}
export function useCategoryByPath() {
  return { data: ref([]) }
}
export function useCurrentPromotions() {
  return {
    data: ref({
      entities: [
        automaticDiscountPromotionFactory.build({
          customData: { product: { attributeId: 1 } },
        }),
        buyXGetYPromotionFactory.build({
          customData: {
            product: { attributeId: 1 },
            color: {
              background: '#800080',
              text: '#fff',
            },
          },
        }),
        promotionWithCodeFactory.build({
          customData: {
            product: { attributeId: 1 },
            color: {
              background: '#ffbf00',
              text: '#fff',
            },
          },
        }),
      ],
    }),
  }
}
export function useCampaign() {
  return { data: ref({}) }
}
export function useFilters() {
  return { data: ref([]) }
}
export function useNavigationTree() {
  return { data: ref({}) }
}
export function useNavigationTrees() {
  return { data: ref([]) }
}
export function useOrder() {
  return { data: ref({}) }
}
export function useOrderConfirmation() {
  return { data: ref({}) }
}
export function useProduct() {
  return { data: ref({}) }
}
export function useProducts() {
  return { data: ref([]) }
}
export function useProductsByIds() {
  return { data: ref([]) }
}
export function useProductsByReferenceKeys() {
  return { data: ref([]) }
}
export function useProductsCount() {
  return { data: ref(0) }
}
export function usePromotions() {
  return { data: ref([]) }
}
export function usePromotionsByIds() {
  return { data: ref([]) }
}
export function useShopConfiguration() {
  return { data: ref({}) }
}
export function useStorefrontSearch() {
  return { data: ref([]) }
}
export function useUserAddresses() {
  return { data: ref([]) }
}
export function useVariant() {
  return { data: ref({}) }
}
export function useCategoryTree() {
  return { data: ref([]) }
}

const contains = ref(true)
export function useWishlist() {
  return {
    data: ref([]),
    contains: () => contains.value,
    toggleItem: () => {
      contains.value = !contains.value
    },
    status: ref('success'),
  }
}
