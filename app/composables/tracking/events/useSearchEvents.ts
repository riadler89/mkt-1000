import type { SearchEntity } from '@scayle/storefront-nuxt'
import { getFirstAttributeValue } from '@scayle/storefront-nuxt'
import { useRouteHelpers } from '~/composables/useRouteHelpers'
import { useRouter } from '#app/composables/router'
import {
  isProductSuggestion,
  isCategorySuggestion,
  isNavigationItemSuggestion,
  getSuggestionName,
} from '#storefront-search/utils'

import type {
  TrackingEvent,
  TrackingPayload,
  TrackSearchEventParams,
} from '~~/types/tracking'

const useSearchEvents = (
  track: (event: TrackingEvent, payload: TrackingPayload) => void,
) => {
  const router = useRouter()
  const trackSearch = ({
    searchTerm,
    suggestion = '',
    searchAction,
    searchDestination = '',
    pagePayload,
  }: TrackSearchEventParams) => {
    track('search', {
      search_term: searchTerm,
      search_term_completed: suggestion || '',
      search_action: searchAction,
      search_destination: searchDestination,
      ...pagePayload,
    })
  }
  const {
    getSearchSuggestionPath,
    getProductDetailRoute,
    buildCategorySuggestionRoute,
    buildNavigationTreeItemRoute,
  } = useRouteHelpers()

  return {
    trackSearch,
    trackSearchSuggestionClick: (
      searchTerm: string,
      suggestion: SearchEntity,
    ) => {
      if (!suggestion.type) {
        return
      }

      const baseInfo = {
        searchTerm,
        suggestion: getSuggestionName(suggestion),
        searchDestination: getSearchSuggestionPath(suggestion) || '',
      } as const

      if (isProductSuggestion(suggestion)) {
        const { product } = suggestion.productSuggestion
        const route = getProductDetailRoute(
          product.id,
          getFirstAttributeValue(product.attributes, 'name')?.label,
        )
        trackSearch({
          ...baseInfo,
          searchAction: 'suggested_product',
          pagePayload: {
            content_name: route,
            page_type: 'adp',
            page_type_id: String(suggestion.productSuggestion.product.id),
          },
        })
        return
      }

      if (isCategorySuggestion(suggestion)) {
        const route = buildCategorySuggestionRoute(suggestion)
        trackSearch({
          ...baseInfo,
          searchAction: 'suggested_category',
          pagePayload: {
            content_name: route.path,
            page_type: 'category',
            page_type_id: String(suggestion.categorySuggestion.category.id),
          },
        })
        return
      }

      if (isNavigationItemSuggestion(suggestion)) {
        const navigationItem =
          suggestion.navigationItemSuggestion.navigationItem
        const { route } = buildNavigationTreeItemRoute(navigationItem) ?? {}
        if (typeof route !== 'string' && route?.path) {
          const matched = router.resolve(route.path)
          trackSearch({
            ...baseInfo,
            searchAction: 'suggested_page',
            pagePayload: {
              content_name: matched.path,
              page_type: String(matched.meta.pageType),
              page_type_id: '',
            },
          })
          return
        }
      }

      trackSearch({
        ...baseInfo,
        searchAction: 'search_term',
      })
    },
  }
}

export default useSearchEvents
