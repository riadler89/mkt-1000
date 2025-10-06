import { describe, vi, it, expect } from 'vitest'
import type { Category, ProductCategory } from '@scayle/storefront-nuxt'
import { categoryFactory } from '@scayle/storefront-nuxt/test/factories'
import { useBreadcrumbs } from './useBreadcrumbs'

vi.mock('#app', () => ({
  useNuxtApp: vi.fn().mockReturnValue({
    $config: { public: { baseUrl: '' } },
  }),
}))
vi.mock('~/composables', () => ({
  useRouteHelpers: vi.fn().mockReturnValue({
    buildCategoryPath: ({
      id,
      path,
    }: Category | { id: number; path: string }) => `/de/c${path}-${id}`,
  }),
}))

describe('useBreadcrumbs', () => {
  describe('getBreadcrumbsFromCategory', () => {
    it('should return category breadcrumbs without active category breadcrumb', () => {
      const shirtCategory = categoryFactory.build({
        id: 2045,
        path: '/women/clothing/shirts',
        name: 'shirts',
      })
      const clothingCategory = categoryFactory.build({
        id: 2048,
        path: '/women/clothing',
        name: 'clothing',
        parent: shirtCategory,
      })
      const womenCategory = categoryFactory.build({
        id: 1,
        path: '/women',
        name: 'women',
        parent: clothingCategory,
      })

      const { getBreadcrumbsFromCategory } = useBreadcrumbs()

      const breadcrumbs = getBreadcrumbsFromCategory(womenCategory)

      expect(breadcrumbs).toStrictEqual([
        {
          to: '/de/c/women/clothing/shirts-2045',
          value: 'shirts',
        },
        {
          to: '/de/c/women/clothing-2048',
          value: 'clothing',
        },
      ])
    })

    it('should return category breadcrumbs with active category breadcrumb', () => {
      const shirtCategory = categoryFactory.build({
        id: 2045,
        path: '/women/clothing/shirts',
        name: 'shirts',
      })
      const clothingCategory = categoryFactory.build({
        id: 2048,
        path: '/women/clothing',
        name: 'clothing',
        parent: shirtCategory,
      })
      const womenCategory = categoryFactory.build({
        id: 1,
        path: '/women',
        name: 'women',
        parent: clothingCategory,
      })
      const { getBreadcrumbsFromCategory } = useBreadcrumbs()

      const breadcrumbs = getBreadcrumbsFromCategory(womenCategory, true)

      expect(breadcrumbs).toStrictEqual([
        {
          to: '/de/c/women/clothing/shirts-2045',
          value: 'shirts',
        },
        {
          to: '/de/c/women/clothing-2048',
          value: 'clothing',
        },
        { to: '/de/c/women-1', value: 'women' },
      ])
    })
  })

  describe('getBreadcrumbsFromProductCategories', () => {
    it('should return product categories breadcrumbs', () => {
      const categories: ProductCategory[] = [
        {
          categoryId: 1,
          categoryUrl: '/women',
          categoryName: 'women',
          categorySlug: 'women',
          categoryHidden: false,
        },
        {
          categoryId: 2048,
          categoryUrl: '/women/clothing',
          categoryName: 'clothing',
          categorySlug: 'clothing',
          categoryHidden: false,
        },
        {
          categoryId: 2045,
          categoryUrl: '/women/clothing/shirts',
          categoryName: 'shirts',
          categorySlug: 'shirts',
          categoryHidden: false,
        },
      ]
      const { getBreadcrumbsFromProductCategories } = useBreadcrumbs()

      const breadcrumbs = getBreadcrumbsFromProductCategories(categories)

      expect(breadcrumbs).toStrictEqual([
        { to: '/de/c/women-1', value: 'women' },
        {
          to: '/de/c/women/clothing-2048',
          value: 'clothing',
        },
        {
          to: '/de/c/women/clothing/shirts-2045',
          value: 'shirts',
        },
      ])
    })
  })

  describe('getBreadcrumb', () => {
    it('should return single category breadcrumb', () => {
      const womenCategory = categoryFactory.build({
        id: 1,
        path: '/women',
        name: 'women',
      })
      const { getBreadcrumb } = useBreadcrumbs()

      expect(getBreadcrumb(womenCategory)).toStrictEqual({
        to: '/de/c/women-1',
        value: 'women',
      })
    })
  })
})
