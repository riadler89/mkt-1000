import {
  type Category,
  type CategorySearchSuggestion,
  type NavigationTreeItem,
  type SearchEntity,
  getFirstAttributeValue,
  slugify,
} from '@scayle/storefront-nuxt'
import { joinURL } from 'ufo'
import type { RouteLocationRaw } from '#vue-router'
import { type NavigateToOptions, navigateTo } from '#app/composables/router'
import { useCurrentShop } from '#storefront/composables'
import { useLocalePath, useSwitchLocalePath, type Locale } from '#i18n'
import {
  hasLocalePrefix,
  isExternalLink,
  normalizePathRoute,
  routeList,
} from '~/utils'
import {
  isProductSuggestion,
  isCategorySuggestion,
  isNavigationItemSuggestion,
} from '#storefront-search/utils'
import { buildQueryFromCategoryFilters } from '#storefront-product-listing'
import { useNuxtApp } from '#app/nuxt'
import { useRequestURL } from '#app'

/**
 * A collection of helpers for building and working with routes.
 *
 * @returns A collection of helpers for building and working with routes.
 */
export function useRouteHelpers() {
  const localePath = useLocalePath()
  const currentShop = useCurrentShop()
  const switchLocalePath = useSwitchLocalePath()
  const { $config, $i18n } = useNuxtApp()
  const { origin } = useRequestURL()

  /**
   * Localized a route and navigates to it.
   *
   * @param route - The route to localize and navigate to.
   * @param options - The options to navigate to.
   * @returns The result of the navigation.
   */
  const localizedNavigateTo = (
    route: RouteLocationRaw,
    options?: NavigateToOptions,
  ) => {
    return navigateTo(getLocalizedRoute(route), options)
  }

  /**
   * Gets a route for a product detail page.
   *
   * @param id - The id of the product.
   * @param name - The name of the product.
   * @param locale - The locale to get the route for.
   * @returns The route for the product detail page.
   */
  const getProductDetailRoute = (
    id: number,
    name?: string,
    locale?: Locale,
  ): string => {
    return localePath(
      {
        name: 'p-productName-id',
        params: {
          productName: slugify(name),
          id: `${id}`,
        },
      },
      locale,
    )
  }

  /**
   * Gets a route for a search page.
   *
   * @param term - The search term to get a route for.
   * @returns The route for the search page.
   */
  const getSearchRoute = (term: string): string => {
    return localePath({
      name: routeList.search.name,
      query: { 'filters[term]': term },
    })
  }

  /**
   * Builds a route for a category suggestion.
   *
   * @param categorySuggestion - The category suggestion to build a route for.
   * @returns The route for the category suggestion.
   */
  const buildCategorySuggestionRoute = ({
    categorySuggestion,
  }: CategorySearchSuggestion) => {
    const { category, filters } = categorySuggestion
    return {
      path: buildCategoryPath(category),
      query: buildQueryFromCategoryFilters(filters),
    } satisfies RouteLocationRaw
  }

  /**
   * Gets a path for a search suggestion.
   *
   * @param suggestion - The search suggestion entity to get a path for.
   * @returns The path for the search suggestion.
   */
  const getSearchSuggestionPath = (
    suggestion: SearchEntity,
  ): string | undefined => {
    if (!suggestion?.type) {
      return
    }

    if (isProductSuggestion(suggestion)) {
      const name = getFirstAttributeValue(
        suggestion.productSuggestion.product.attributes,
        'name',
      )?.label

      if (!name) {
        return
      }

      return getProductDetailRoute(
        suggestion.productSuggestion.product.id,
        name,
      )
    }

    if (isCategorySuggestion(suggestion)) {
      const route = buildCategorySuggestionRoute(suggestion)
      return localePath(route)
    }

    if (isNavigationItemSuggestion(suggestion)) {
      const { route } =
        buildNavigationTreeItemRoute(
          suggestion.navigationItemSuggestion.navigationItem,
        ) ?? {}

      if (typeof route === 'string') {
        return route
      }

      return route?.path ? localePath(route.path) : undefined
    }
  }

  /**
   * Gets a order details route for a given order id.
   *
   * @param id - The id of the order.
   * @returns The route for the order details page.
   */
  const getOrderDetailsRoute = (id: number): string => {
    return localePath({
      name: routeList.orderDetail.name,
      params: { id },
    })
  }

  /**
   * Gets a localized route.
   *
   * @param route - The route to get a localized route for.
   * @returns The localized route.
   */
  const getLocalizedRoute = (route: RouteLocationRaw) => {
    if (typeof route !== 'string') {
      const isLocalePath =
        'path' in route &&
        route.path !== undefined &&
        hasLocalePrefix(route.path, currentShop.value?.path)

      return isLocalePath ? route : localePath(route)
    }

    if (isExternalLink(route)) {
      return route
    }

    const normalizedPath = normalizePathRoute(route)

    return hasLocalePrefix(normalizedPath, currentShop.value?.path)
      ? normalizedPath
      : localePath(normalizedPath)
  }

  /**
   * Builds a path for a category.
   *
   * @param category - The category to build a path for.
   * @returns The path for the category.
   */
  const buildCategoryPath = (
    { id, path }: Category | { id: number; path: string },
    locale?: Locale,
  ): string => {
    return localePath(`${routeList.category.path}${path}-${id}`, locale)
  }

  /**
   * Builds a route for a navigation item.
   *
   * @param navigationItem - The navigation item to build a route for.
   * @returns The route for the navigation item.
   */
  const buildNavigationTreeItemRoute = (
    navigationItem: NavigationTreeItem,
  ): { route: RouteLocationRaw; openInNew: boolean } | undefined => {
    switch (navigationItem.type) {
      case 'category': {
        if (navigationItem.category) {
          return {
            route: {
              path: buildCategoryPath(navigationItem.category),
              query: buildQueryFromCategoryFilters(navigationItem.filters),
            },
            openInNew: false,
          }
        }
        return undefined
      }

      case 'page': {
        return {
          route: getLocalizedRoute(navigationItem.page),
          openInNew: true,
        }
      }

      case 'individual-link': {
        return {
          route: getLocalizedRoute(navigationItem.options?.url ?? ''),
          openInNew: navigationItem.options?.isOpenInNewWindow ?? false,
        }
      }
      default:
        return
    }
  }

  /**
   * Gets the full URL for a given locale and pathname.
   *
   * @note `@nuxtjs/i18n` calls `useNuxtApp` when resolving domains for a given locale. `getLocalizedHref` can therefore only be called within a nuxt context.
   *
   * @param locale - The locale to get the href for.
   * @param pathname - The pathname to get the href for.
   * @returns The full URL for the given locale and pathname.
   */
  const getLocalizedHref = (locale: Locale, pathname: string) => {
    const isAbsolute = pathname.startsWith('http')
    const baseUrlPrefix = $config.app.baseURL
    const fullPath = isAbsolute
      ? baseUrlPrefix
      : joinURL(baseUrlPrefix, pathname)

    const newOrigin = $i18n.differentDomains
      ? new URL(switchLocalePath(locale)).origin
      : origin
    return new URL(fullPath, newOrigin).href
  }

  const getExpressCheckoutRoute = (transactionId?: string) => {
    return localePath({
      name: routeList.checkout.name,
      query: { transactionId },
    })
  }

  return {
    localizedNavigateTo,
    getProductDetailRoute,
    getSearchRoute,
    getSearchSuggestionPath,
    getOrderDetailsRoute,
    getLocalizedRoute,
    buildCategorySuggestionRoute,
    buildCategoryPath,
    buildNavigationTreeItemRoute,
    getLocalizedHref,
    getExpressCheckoutRoute,
  }
}
