import { computed } from 'vue'
import type { MaybeRefOrGetter, ComputedRef } from 'vue'
import { toRef } from '@vueuse/core'
import type { RouteLocationNamedRaw, RouteLocationRaw } from '#vue-router'
import { useRoute } from '#app/composables/router'

export type Page = {
  number: number
  to: Partial<RouteLocationRaw>
  isActive: boolean
}

export interface UsePaginationReturn {
  limitedPages: ComputedRef<(Page | undefined)[]>
  previousPage: ComputedRef<Page | undefined>
  nextPage: ComputedRef<Page | undefined>
  areFirstDotsShown: ComputedRef<boolean>
  areSecondDotsShown: ComputedRef<boolean>
  firstPage: ComputedRef<Page | undefined>
  lastPage: ComputedRef<Page | undefined>
  canNavigateLeft: ComputedRef<boolean>
  canNavigateRight: ComputedRef<boolean>
}

/**
 * @param _visiblePageNumbers - Current visible page numbers
 * @param _totalPageCount - Total page count
 * @returns An {@link UsePaginationReturn} object containing reactive pagination data.
 */
export function usePagination(
  _visiblePageNumbers: MaybeRefOrGetter<number>,
  _totalPageCount: MaybeRefOrGetter<number>,
): UsePaginationReturn {
  const visiblePageNumbers = toRef(_visiblePageNumbers)
  const totalPageCount = toRef(_totalPageCount)

  const route = useRoute()
  const currentPage = computed(() => {
    if (!route.query.page) {
      return 1
    }
    const isNumericString = !isNaN(Number(route.query.page?.toString()))

    const numericPageValue = +route.query.page

    return isNumericString &&
      numericPageValue &&
      Number.isInteger(numericPageValue) &&
      numericPageValue > 0
      ? numericPageValue
      : 1
  })

  const pageList = computed<Page[]>(() => {
    const list = Array.from({ length: totalPageCount.value }, (_, i) => i + 1)
    return list.map((page) => {
      const query: RouteLocationNamedRaw['query'] = {
        ...route.query,
        page: page.toString(),
      }

      if (page === 1) {
        delete query.page
      }

      return {
        number: page,
        to: {
          path: route.path,
          query,
        },
        isActive: currentPage.value === page,
      }
    })
  })

  const firstPage = computed(() => pageList.value[0])
  const lastPage = computed(() => pageList.value?.at(-1))

  const previousPage = computed(() => {
    return (
      pageList.value.find((page) => page.number === currentPage.value - 1) ||
      firstPage.value
    )
  })

  const nextPage = computed(() => {
    return (
      pageList.value.find((page) => page.number === currentPage.value + 1) ||
      lastPage.value
    )
  })

  const limitedPages = computed(() => {
    if (totalPageCount.value <= visiblePageNumbers.value) {
      return pageList.value
    }

    if (currentPage.value === 1) {
      return [pageList.value[1], pageList.value[2]]
    } else if (currentPage.value === totalPageCount.value) {
      return [
        pageList.value[pageList.value.length - 3],
        pageList.value[pageList.value.length - 2],
      ]
    }

    // Do not show previous/next page if its the first/last page
    const mergedPreviousPage =
      firstPage.value?.number === previousPage.value?.number
        ? []
        : [previousPage.value]
    const mergedNextPage =
      lastPage.value &&
      nextPage.value &&
      lastPage.value.number === nextPage.value.number
        ? []
        : [nextPage.value]

    return [
      ...mergedPreviousPage,
      pageList.value[currentPage.value - 1],
      ...mergedNextPage,
    ]
  })

  const areFirstDotsShown = computed(() => {
    if (totalPageCount.value <= visiblePageNumbers.value) {
      return false
    }
    const firstLimitedPage = limitedPages.value[0]

    if (!firstLimitedPage) {
      return false
    }
    if (!firstPage.value) {
      return false
    }

    return firstPage.value.number < firstLimitedPage.number - 1
  })

  const areSecondDotsShown = computed(() => {
    if (totalPageCount.value <= visiblePageNumbers.value) {
      return false
    }

    const lastLimitedPage = limitedPages.value?.at(-1)

    if (!lastLimitedPage) {
      return false
    }

    return totalPageCount.value > lastLimitedPage.number + 1
  })

  const canNavigateLeft = computed(() => currentPage.value !== 1)

  const canNavigateRight = computed(
    () => currentPage.value !== totalPageCount.value,
  )

  return {
    limitedPages,
    previousPage,
    nextPage,
    areFirstDotsShown,
    areSecondDotsShown,
    firstPage,
    lastPage,
    canNavigateLeft,
    canNavigateRight,
  }
}
