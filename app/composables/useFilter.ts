import { extendPromise } from '@scayle/storefront-nuxt'
import {
  computed,
  type MaybeRefOrGetter,
  readonly,
  type Ref,
  ref,
  toValue,
} from 'vue'
import type { RangeTuple } from '@scayle/storefront-product-listing'
import type { LocationQuery } from '#vue-router'
import { useTrackingEvents, useToast } from '~/composables'
import { useRoute, useRouter } from '#app/composables/router'
import { useI18n } from '#i18n'
import {
  useFiltersForListing,
  getClearedFilterQueryByKey,
  createNewBoolAttributeQuery,
  createNewAttributeQuery,
  createNewPriceQuery,
  useAppliedFilters,
  type UseFiltersForListingReturn,
  createNewReductionQuery,
} from '#storefront-product-listing'

interface FilterOptions {
  immediate?: boolean
  keyPrefix?: string
}

type UseFilterReturn = Awaited<UseFiltersForListingReturn> & {
  /**
   * Callback function that should be called by SFFilterSlideIn.vue when the filter slide-in is opened.
   * It tracks the filter flyout open event.
   */
  onSlideInOpen: () => void
  /**
   * Callback function that should be called by SFFilterSlideIn.vue when the filter slide-in is closed.
   * It tracks the filter flyout close event.
   */
  onSlideInClose: () => void
  /**
   * Applies a price filter to the current category.
   * @param prices - The prices to apply.
   */
  applyPriceFilter: (prices: RangeTuple) => Promise<void>
  /**
   * Applies a reduction filter to the current category.
   * @param reductions - The reductions to apply.
   */
  applyReductionFilter: (reductions: RangeTuple) => Promise<void>
  /**
   * Applies a boolean filter to the current category.
   * @param slug - The name of the filter.
   * @param value - The value of the filter.
   */
  applyBooleanFilter: (slug: string, value: boolean) => Promise<void>
  /**
   * Applies an attribute filter to the current category.
   * @param slug - The name of the filter.
   * @param id - The id of the attribute.
   */
  applyAttributeFilter: (slug: string, id: number) => Promise<void>
  /**
   * Tracks the filter flyout event.
   * @param event - The event to track.
   * @param value - The value of the event.
   */
  trackFilterFlyout: (event: string, value: string) => void
  /**
   * Resets all filters.
   */
  resetFilters: () => Promise<void>
  /**
   * Resets the price filter.
   */
  resetPriceFilter: () => Promise<void>
  /**
   * Resets the reduction filter.
   */
  resetReductionFilter: () => Promise<void>
  /**
   * Resets a specific filter.
   * @param key - The name of the filter that should be reset.
   */
  resetFilter: (key: string) => Promise<void>
  /**
   * Indicates if all filters are cleared.
   * This flag will be automatically reset after 3 seconds.
   */
  areFiltersCleared: Readonly<Ref<boolean>>
}

/**
 * The `useFilter` composable centralizes the business logic for applying filters to the current category and tracking filter usage.
 *
 * @param currentCategoryId - The current category id.
 * @param options - The options for the filter.
 * @param options.immediate - Whether to fetch filters immediately.
 * @param options.keyPrefix - The prefix of the filter key.
 * @returns A {@link UseFilterReturn} object containing functions to apply filters and track filter usage.
 */
export function useFilter(
  currentCategoryId?: MaybeRefOrGetter<number | undefined>,
  options: FilterOptions = {},
): UseFilterReturn & Promise<UseFilterReturn> {
  const route = useRoute()
  const router = useRouter()
  const areFiltersCleared = ref(false)
  const areFiltersUpdated = ref(false)

  const { appliedFiltersCount, appliedFilter } = useAppliedFilters(route)

  const sort = ref(route.query.sort)

  const params = computed(() => ({
    categoryId: toValue(currentCategoryId),
    where: appliedFilter.value,
    includeSellableForFree: true,
  }))

  const filterData = useFiltersForListing({
    params,
    fetchingOptions: options,
  })

  const { trackFilterApply, trackFilterFlyout } = useTrackingEvents()
  const { t } = useI18n()

  const { show } = useToast()

  const applyAttributeFilter = async (slug: string, id: number) => {
    const filters = createNewAttributeQuery(route, appliedFilter.value, {
      slug,
      id,
    })
    trackFilterApply(slug, id.toString())
    await applyFilters(filters)
  }

  const applyBooleanFilter = async (slug: string, value: boolean) => {
    const filters = createNewBoolAttributeQuery(route, appliedFilter.value, {
      slug,
      value,
    })
    trackFilterApply(slug, value.toString())
    await applyFilters(filters)
  }

  const applyPriceFilter = async (prices: RangeTuple) => {
    const filters = createNewPriceQuery(route, appliedFilter.value, prices)
    trackFilterApply('prices', prices.join(','))
    await applyFilters(filters)
  }

  const applyReductionFilter = async (prices: RangeTuple) => {
    const filters = createNewReductionQuery(route, appliedFilter.value, prices)
    trackFilterApply('reductions', prices.join(','))
    await applyFilters(filters)
  }

  const onSlideInOpen = () => trackFilterFlyout('open', 'true')

  const onSlideInClose = () => {
    trackFilterFlyout('close', 'true')
    const isSortUpdated = sort.value !== route.query.sort

    if (areFiltersUpdated.value && isSortUpdated) {
      show(t('filter.notification.filter_and_sort_updated'), {
        type: 'SUCCESS',
      })
      areFiltersUpdated.value = false
      sort.value = route.query.sort
    } else if (areFiltersUpdated.value) {
      show(t('filter.notification.filter_updated'), { type: 'SUCCESS' })
      areFiltersUpdated.value = false
    } else if (isSortUpdated) {
      show(t('filter.notification.sort_updated'), { type: 'SUCCESS' })
      sort.value = route.query.sort
    }
  }

  const resetPriceFilter = async () => {
    await applyFilters(getClearedFilterQueryByKey(route, 'prices'))
  }

  const resetReductionFilter = async () => {
    await applyFilters(getClearedFilterQueryByKey(route, 'reductions'))
  }

  const resetFilter = async (key: string) => {
    await applyFilters(getClearedFilterQueryByKey(route, key))
  }

  const resetFilters = async () => {
    await applyFilters({})
    areFiltersCleared.value = true
    areFiltersUpdated.value = false

    setTimeout(() => {
      areFiltersCleared.value = false
    }, 3000)
  }

  const applyFilters = async (filter?: LocationQuery, scrollToTop = true) => {
    if (!filter) {
      return
    }

    // Should not apply reset all filter if appliedFilter is empty
    if (!appliedFiltersCount.value && !Object.keys(filter).length) {
      return
    }

    const nonFilterQueryParams = Object.entries(
      route.query,
    ).reduce<LocationQuery>((acc, [key, value]) => {
      if (!key.startsWith('filters')) {
        acc[key] = value
      }
      return acc
    }, {})

    const query = {
      'filters[term]': route.query['filters[term]'],
      ...filter,
      ...nonFilterQueryParams,
    }

    if ('page' in query) {
      delete query.page
    }

    await router.push({ query })

    areFiltersUpdated.value = true

    if (scrollToTop) {
      window.scroll({ behavior: 'smooth', top: 0 })
    }
  }

  return extendPromise(filterData, {
    onSlideInOpen,
    onSlideInClose,
    applyPriceFilter,
    applyBooleanFilter,
    applyAttributeFilter,
    applyReductionFilter,
    trackFilterFlyout,
    resetFilters,
    resetPriceFilter,
    resetReductionFilter,
    resetFilter,
    areFiltersCleared: readonly(areFiltersCleared),
  })
}
