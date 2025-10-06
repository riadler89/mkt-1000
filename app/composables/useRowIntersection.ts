import { type MaybeRefOrGetter, computed, ref } from 'vue'
import type { Product } from '@scayle/storefront-nuxt'
import { toRef } from '@vueuse/core'
import { useRoute } from '#app/composables/router'
import { useDefaultBreakpoints } from '#storefront-ui/composables'
import { ProductsPerRow, PRODUCTS_PER_PAGE } from '~~/shared/constants'

/**
 * Represents the data for a row intersection.
 * It includes the row number and all product items, each with their respective index in that row.
 */
export type CollectedRowIntersection = {
  row: number
  items: (Product & { index: number })[]
}

export interface UseRowIntersectionReturn {
  /** Collects row data on intersection. */
  collectRowIntersection: (
    index: number,
  ) => CollectedRowIntersection | undefined
}
/**
 * Composable for collecting row data on intersection.
 *
 * @param productItems - Product items on which the row intersection will be manipulated.
 * @returns An {@link UseRowIntersectionReturn} object containing row intersection collector function.
 */
export function useRowIntersection(
  productItems: MaybeRefOrGetter<Product[]>,
): UseRowIntersectionReturn {
  const route = useRoute()

  const products = toRef(productItems)

  const trackingCollector = ref<CollectedRowIntersection[]>([])
  const { greaterOrEqual } = useDefaultBreakpoints()

  const isGreaterOrEqualThenLg = greaterOrEqual('lg')
  const isGreaterOrEqualThenMd = greaterOrEqual('md')

  const columns = computed(() => {
    if (isGreaterOrEqualThenLg.value) {
      return ProductsPerRow.DESKTOP
    }
    return isGreaterOrEqualThenMd.value
      ? ProductsPerRow.TABLET
      : ProductsPerRow.MOBILE
  })

  const _getRowByIndex = (index: number) => {
    const currentPage = parseInt(route.query.page as string) || 1
    const adjustedIndex = index + (currentPage - 1) * PRODUCTS_PER_PAGE

    return Math.floor(adjustedIndex / columns.value)
  }

  const collectRowIntersection = (
    index: number,
  ): CollectedRowIntersection | undefined => {
    const row = _getRowByIndex(index)
    const isFirstItemInRow = index % columns.value === 0

    const hasRowBeenTracked = trackingCollector.value.some(
      (item) => item.row === row,
    )

    if (isFirstItemInRow && !hasRowBeenTracked) {
      const itemsInRow = products.value
        .slice(index, index + columns.value)
        .map((item, idx) => ({ ...item, index: index + idx }))

      trackingCollector.value.push({ row, items: itemsInRow })

      return { row, items: itemsInRow }
    }
  }

  return {
    collectRowIntersection,
  }
}
