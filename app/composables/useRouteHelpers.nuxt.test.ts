import { describe, it, expect, vi } from 'vitest'
import type { SearchEntity } from '@scayle/storefront-nuxt'
import { mockNuxtImport } from '@nuxt/test-utils/runtime'
import {
  navigationItemCategoryFactory,
  navigationItemExternalFactory,
  navigationItemPageFactory,
  categoryFactory,
  productFactory,
  attributeGroupSingleFactory,
} from '@scayle/storefront-nuxt/test/factories'
import { useRouteHelpers } from './useRouteHelpers'

vi.mock('#storefront/composables', () => ({
  useCurrentShop: () => ({
    value: { path: 'de' },
  }),
}))

const mockNavigateTo = vi.hoisted(() => vi.fn())

mockNuxtImport('navigateTo', () => mockNavigateTo)

describe('useRouteHelpers', () => {
  describe('localizedNavigateTo', () => {
    it('should call navigateTo with localized route', async () => {
      const { localizedNavigateTo } = useRouteHelpers()

      await localizedNavigateTo({ path: '/p/name-1' }, { replace: true })

      expect(mockNavigateTo).toBeCalledWith('/de/p/name-1', {
        replace: true,
      })
    })
  })

  describe('getProductDetailRoute', () => {
    it('should return correct product route', () => {
      const { getProductDetailRoute } = useRouteHelpers()
      expect(getProductDetailRoute(1, 'test-product')).toStrictEqual(
        '/de/p/test-product-1',
      )
      expect(getProductDetailRoute(2, 'name')).toStrictEqual('/de/p/name-2')
      expect(getProductDetailRoute(1, 'HelloWorld')).toStrictEqual(
        '/de/p/helloworld-1',
      )
    })
  })

  describe('getSearchRoute', () => {
    it('should return correct search route', () => {
      const { getSearchRoute } = useRouteHelpers()

      const searchRoute = getSearchRoute('test')
      expect(searchRoute).toStrictEqual('/de/search?filters[term]=test')
    })
  })

  describe('getSearchSuggestionPath', () => {
    it('should return correct product suggestion path', () => {
      const { getSearchSuggestionPath } = useRouteHelpers()
      const suggestion = {
        type: 'product',
        productSuggestion: {
          product: productFactory.build({
            id: 1,
            attributes: {
              name: attributeGroupSingleFactory.build({
                key: 'name',
                values: {
                  label: 'Suggested Product',
                },
              }),
            },
          }),
        },
      } as SearchEntity

      const searchSuggestionPath = getSearchSuggestionPath(suggestion)
      expect(searchSuggestionPath).toStrictEqual('/de/p/suggested-product-1')
    })

    it('should return correct category suggestion path', () => {
      const { getSearchSuggestionPath } = useRouteHelpers()
      const sampleCategorySearchSuggestion = {
        type: 'category',
        categorySuggestion: {
          category: categoryFactory.build({ id: 1, path: '/category-path' }),
          filters: [
            {
              type: 'attribute',
              attributeFilter: {
                group: {
                  id: 1,
                  key: 'color',
                  label: 'Color',
                  type: 'string',
                  multiSelect: true,
                },
                values: [
                  { id: 1, value: 'red', label: 'Red' },
                  { id: 2, value: 'blue', label: 'Blue' },
                ],
              },
            },
            {
              type: 'boolean',
              booleanFilter: {
                slug: 'isAvailable',
                value: true,
                label: 'Available',
              },
            },
          ],
        },
      } as SearchEntity

      const searchSuggestionPath = getSearchSuggestionPath(
        sampleCategorySearchSuggestion,
      )
      expect(searchSuggestionPath).toStrictEqual(
        '/de/c/category-path-1?filters[color]=1,2&filters[isAvailable]=true',
      )
    })
  })

  describe('getOrderDetailsRoute', () => {
    it('should return correct order details route', () => {
      const { getOrderDetailsRoute } = useRouteHelpers()

      const orderDetailsRoute = getOrderDetailsRoute(123)
      expect(orderDetailsRoute).toStrictEqual('/de/account/orders/123')
    })
  })

  describe('getLocalizedRoute', () => {
    it('should return localized route if not already localized for route object', () => {
      const { getLocalizedRoute } = useRouteHelpers()

      const localizedRoute = getLocalizedRoute({ path: '/p/name-1' })
      expect(localizedRoute).toStrictEqual('/de/p/name-1')
    })

    it('should return localized route if not already localized for route string', () => {
      const { getLocalizedRoute } = useRouteHelpers()

      const localizedRoute = getLocalizedRoute('/p/name-1')
      expect(localizedRoute).toBe('/de/p/name-1')
    })

    it('should return localized route if already localized for route object', () => {
      const { getLocalizedRoute } = useRouteHelpers()

      const localizedRoute = getLocalizedRoute({
        path: '/de/p/name-1',
      })
      expect(localizedRoute).toStrictEqual({
        path: '/de/p/name-1',
      })
    })

    it('should return localized route if already localized for route string', () => {
      const { getLocalizedRoute } = useRouteHelpers()

      const localizedRoute = getLocalizedRoute('/de/p/name-1')
      expect(localizedRoute).toBe('/de/p/name-1')
    })
  })

  describe('buildCategoryPath', () => {
    it(' should return correct category path', () => {
      const { buildCategoryPath } = useRouteHelpers()

      const category = { id: 1, path: '/category-path' }
      const categoryPath = buildCategoryPath(category)
      expect(categoryPath).toBe('/de/c/category-path-1')
    })
  })

  describe('buildNavigationTreeItemRoute', () => {
    it('should return correct path for a category navigation item', () => {
      const { buildNavigationTreeItemRoute } = useRouteHelpers()
      const route = buildNavigationTreeItemRoute(
        navigationItemCategoryFactory.build({
          category: categoryFactory.build({ path: '/category', id: 10 }),
          filters: [],
        }),
      )
      expect(route).toEqual({
        route: {
          path: '/de/c/category-10',
          query: {},
        },
        openInNew: false,
      })
    })

    it('should return correct path for a category navigation item with filters', () => {
      const { buildNavigationTreeItemRoute } = useRouteHelpers()
      const route = buildNavigationTreeItemRoute(
        navigationItemCategoryFactory.build({
          category: categoryFactory.build({ path: '/category', id: 10 }),
          filters: [
            {
              type: 'attribute',
              attributeFilter: {
                group: {
                  id: 1001,
                  key: 'color',
                  label: 'Detail Color',
                  type: '',
                  multiSelect: false,
                },
                values: [
                  {
                    id: 10,
                    value: 'blau',
                    label: 'Blau',
                  },
                  {
                    id: 13,
                    value: 'rot',
                    label: 'Rot',
                  },
                ],
              },
            },
          ],
        }),
      )
      expect(route).toEqual({
        route: {
          path: '/de/c/category-10',
          query: {
            'filters[color]': '10,13',
          },
        },
        openInNew: false,
      })
    })

    it('should return bo route when category of category navigation item is missing', () => {
      const { buildNavigationTreeItemRoute } = useRouteHelpers()
      const route = buildNavigationTreeItemRoute(
        navigationItemCategoryFactory.build({
          category: undefined,
        }),
      )
      expect(route).toBeUndefined()
    })

    it('should return correct route for a page navigation item', () => {
      const { buildNavigationTreeItemRoute } = useRouteHelpers()
      const route = buildNavigationTreeItemRoute(
        navigationItemPageFactory.build({
          page: '/page',
        }),
      )

      expect(route).toEqual({
        route: '/page',
        openInNew: true,
      })
    })

    it('should return correct route for an external navigation item that opens in a new tab', () => {
      const { buildNavigationTreeItemRoute } = useRouteHelpers()
      const route = buildNavigationTreeItemRoute(
        navigationItemExternalFactory.build({
          options: {
            isOpenInNewWindow: true,
            url: 'https://scayle.dev',
          },
        }),
      )

      expect(route).toEqual({
        route: 'https://scayle.dev',
        openInNew: true,
      })
    })
    it('should return correct route for an external navigation item', () => {
      const { buildNavigationTreeItemRoute } = useRouteHelpers()
      const route = buildNavigationTreeItemRoute(
        navigationItemExternalFactory.build({
          options: {
            url: 'https://scayle.dev',
            isOpenInNewWindow: false,
          },
        }),
      )

      expect(route).toEqual({
        route: 'https://scayle.dev',
        openInNew: false,
      })
    })
  })
})
