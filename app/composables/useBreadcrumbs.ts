import type { Category, ProductCategory } from '@scayle/storefront-nuxt'
import { useRouteHelpers } from '.'
import type { BreadcrumbItem } from '~~/types/breadcrumbs'
import { getCategoryAncestors } from '#storefront-product-listing'

export function useBreadcrumbs() {
  const { buildCategoryPath } = useRouteHelpers()

  const getBreadcrumbsFromProductCategories = (
    categories: ProductCategory[],
  ): BreadcrumbItem[] => {
    return categories.map((category) => ({
      value: category.categoryName,
      to: buildCategoryPath({
        id: category.categoryId,
        path: category.categoryUrl,
      }),
    }))
  }

  const getBreadcrumb = (category: Category) => ({
    to: buildCategoryPath(category),
    value: category.name,
  })

  const getBreadcrumbsFromCategory = (
    category: Category,
    includeActiveCategory = false,
  ): BreadcrumbItem[] => {
    const items = getCategoryAncestors(category).map(getBreadcrumb)
    return !includeActiveCategory ? items : [...items, getBreadcrumb(category)]
  }

  return {
    getBreadcrumb,
    getBreadcrumbsFromCategory,
    getBreadcrumbsFromProductCategories,
  }
}
