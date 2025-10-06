import { describe, it, vi, expect, beforeEach } from 'vitest'
import type { CentAmount } from '@scayle/storefront-nuxt'
import { ref } from 'vue'
import { useFilter } from './useFilter'

const mocks = vi.hoisted(() => {
  return {
    route: { query: {} },
    router: { push: vi.fn() },
    useAppliedFilters: {
      productConditions: { value: '' },
      appliedFilter: { value: {} },
      appliedFiltersCount: { value: 0 },
    },
    useTrackingEvents: {
      trackFilterApply: vi.fn(),
      trackFilterFlyout: vi.fn(),
    },
    useFiltersForListing: vi.fn(),
    useToast: { show: vi.fn() },
    useI18n: { t: vi.fn().mockImplementation((key) => key) },
  }
})

vi.mock('#app/composables/router', () => ({
  useRoute: vi.fn().mockReturnValue(mocks.route),
  useRouter: vi.fn().mockReturnValue(mocks.router),
}))

vi.mock('#i18n', () => ({
  useI18n: vi.fn().mockReturnValue(mocks.useI18n),
}))

vi.mock('~/composables', () => ({
  useTrackingEvents: vi.fn().mockReturnValue(mocks.useTrackingEvents),
  useToast: vi.fn().mockReturnValue(mocks.useToast),
}))

vi.mock('#storefront-product-listing', async () => {
  const actual = await vi.importActual('#storefront-product-listing')

  return {
    ...actual,
    useFiltersForListing: mocks.useFiltersForListing,
    useAppliedFilters: vi.fn().mockReturnValue(mocks.useAppliedFilters),
  }
})

describe('useFilter', () => {
  beforeEach(() => {
    mocks.useAppliedFilters.appliedFilter.value = { attributes: [] }
    mocks.useAppliedFilters.appliedFiltersCount.value = 0
    mocks.route.query = {}

    vi.clearAllMocks()
  })

  it('should call filter fetch reactive', async () => {
    const categoryId = ref(123)
    useFilter(categoryId)

    expect(
      mocks.useFiltersForListing.mock.calls[0]?.[0]?.params.value,
    ).toStrictEqual({
      categoryId: 123,
      where: {
        attributes: [],
      },
      includeSellableForFree: true,
    })

    categoryId.value = 321
    expect(
      mocks.useFiltersForListing.mock.calls[0]?.[0]?.params.value,
    ).toStrictEqual({
      categoryId: 321,
      where: {
        attributes: [],
      },
      includeSellableForFree: true,
    })
  })

  describe('onSlideInClose', () => {
    it('should show toast message on filter applied and modal closed', async () => {
      mocks.useAppliedFilters.appliedFilter.value = {
        attributes: [
          { key: 'newAttribute', values: [2, 3, 4], type: 'attributes' },
        ],
      }

      const { applyAttributeFilter, onSlideInClose } = useFilter()
      await applyAttributeFilter('newAttribute', 1)
      onSlideInClose()
      expect(mocks.useToast.show).toBeCalledWith(
        'filter.notification.filter_updated',
        { type: 'SUCCESS' },
      )
    })
    it('should show toast message on sort applied and modal closed', async () => {
      mocks.route.query = {
        sort: 'price',
      }

      const { onSlideInClose } = useFilter()
      mocks.route.query = {
        sort: 'new',
      }
      onSlideInClose()
      expect(mocks.useToast.show).toBeCalledWith(
        'filter.notification.sort_updated',
        { type: 'SUCCESS' },
      )
    })

    it('should show toast message on filter and sort applied and modal closed', async () => {
      mocks.useAppliedFilters.appliedFilter.value = {
        attributes: [
          { key: 'newAttribute', values: [2, 3, 4], type: 'attributes' },
        ],
      }
      mocks.route.query = {
        sort: 'price',
      }

      const { applyAttributeFilter, onSlideInClose } = useFilter()
      mocks.route.query = {
        ...mocks.route.query,
        sort: 'new',
      }
      await applyAttributeFilter('newAttribute', 1)
      onSlideInClose()
      expect(mocks.useToast.show).toBeCalledWith(
        'filter.notification.filter_and_sort_updated',
        { type: 'SUCCESS' },
      )
    })

    it('should not show toast message on modal closed', async () => {
      const { onSlideInClose } = useFilter()
      onSlideInClose()
      expect(mocks.useToast.show).not.toBeCalled()
    })
  })

  describe('applyAttributeFilter', () => {
    it('should add new filter and value to query', () => {
      mocks.useAppliedFilters.appliedFilter.value = { attributes: [] }

      const { applyAttributeFilter } = useFilter()
      applyAttributeFilter('newAttribute', 1)
      expect(mocks.router.push).toBeCalledWith({
        query: {
          'filters[newAttribute]': '1',
        },
      })
    })

    it('should add new filter and value to query and merge with existing query', () => {
      mocks.useAppliedFilters.appliedFilter.value = { attributes: [] }
      mocks.route.query = {
        'filters[otherAttributes]': '1, 2, 3',
        sort: 'asc',
        term: 'term',
      }
      const { applyAttributeFilter } = useFilter()
      applyAttributeFilter('newAttribute', 1)
      expect(mocks.router.push).toBeCalledWith({
        query: {
          'filters[newAttribute]': '1',
          'filters[otherAttributes]': '1, 2, 3',
          sort: 'asc',
          term: 'term',
        },
      })
    })

    it('should add new value to query', () => {
      mocks.useAppliedFilters.appliedFilter.value = {
        attributes: [
          { key: 'newAttribute', values: [2, 3, 4], type: 'attributes' },
        ],
      }

      const { applyAttributeFilter } = useFilter()
      applyAttributeFilter('newAttribute', 1)
      expect(mocks.router.push).toBeCalledWith({
        query: {
          'filters[newAttribute]': '2,3,4,1',
        },
      })
    })

    it('should remove existing value from query', () => {
      mocks.useAppliedFilters.appliedFilter.value = {
        attributes: [
          { key: 'newAttribute', values: [2, 3, 4], type: 'attributes' },
        ],
      }

      const { applyAttributeFilter } = useFilter()
      applyAttributeFilter('newAttribute', 2)
      expect(mocks.router.push).toBeCalledWith({
        query: {
          'filters[newAttribute]': '3,4',
        },
      })
    })

    it('should remove existing value and filter from query', () => {
      mocks.useAppliedFilters.appliedFilter.value = {
        attributes: [{ key: 'newAttribute', values: [2], type: 'attributes' }],
      }

      mocks.useAppliedFilters.appliedFiltersCount.value = 1

      const { applyAttributeFilter } = useFilter()
      applyAttributeFilter('newAttribute', 2)
      expect(mocks.router.push).toBeCalledWith({ query: {} })
    })

    it('should reset page param when attribute filter is applied', () => {
      mocks.route.query = {
        page: '1',
      }

      const { applyAttributeFilter } = useFilter()
      applyAttributeFilter('newAttribute', 1)
      expect(mocks.router.push).toBeCalledWith({
        query: {
          'filters[newAttribute]': '1',
        },
      })
    })
  })

  describe('applyBooleanFilter', () => {
    it('should add boolean filter and value to query if true', () => {
      const { applyBooleanFilter } = useFilter()
      applyBooleanFilter('newBool', true)
      expect(mocks.router.push).toBeCalledWith({
        query: {
          'filters[newBool]': 'true',
        },
      })
    })

    it('should remove boolean filter and value from query if false', () => {
      mocks.useAppliedFilters.appliedFiltersCount.value = 1
      mocks.useAppliedFilters.appliedFilter.value = {
        attributes: [{ key: 'newBool', value: true, type: 'boolean' }],
      }

      const { applyBooleanFilter } = useFilter()
      applyBooleanFilter('newBool', false)
      expect(mocks.router.push).toBeCalledWith({
        query: {},
      })
    })

    it('should reset page param when boolean filter is applied', () => {
      mocks.route.query = {
        page: '1',
      }

      const { applyBooleanFilter } = useFilter()
      applyBooleanFilter('newBool', true)
      expect(mocks.router.push).toBeCalledWith({
        query: {
          'filters[newBool]': 'true',
        },
      })
    })
  })

  describe('applyPriceFilter', () => {
    it('should apply prices correctly', () => {
      const { applyPriceFilter } = useFilter()
      applyPriceFilter([99 as CentAmount, 2345 as CentAmount])
      expect(mocks.router.push).toBeCalledWith({
        query: {
          'filters[minPrice]': '99',
          'filters[maxPrice]': '2345',
        },
      })
    })

    it('should reset page param when price filter is applied', () => {
      mocks.route.query = {
        page: '1',
      }

      const { applyPriceFilter } = useFilter()
      applyPriceFilter([99 as CentAmount, 2345 as CentAmount])
      expect(mocks.router.push).toBeCalledWith({
        query: {
          'filters[minPrice]': '99',
          'filters[maxPrice]': '2345',
        },
      })
    })
  })

  describe('resetFilter', () => {
    it('should reset correctly', () => {
      mocks.useAppliedFilters.appliedFilter.value = {
        attributes: [
          { key: 'newAttribute', values: [1, 2, 3, 4], type: 'attributes' },
        ],
      }
      mocks.useAppliedFilters.appliedFiltersCount.value = 1
      mocks.route.query = {
        'filters[newAttribute]': [1, 2, 3, 4],
        page: '1',
      }
      const { resetFilter } = useFilter()
      resetFilter('newAttribute')
      expect(mocks.router.push).toBeCalledWith({
        query: {},
      })
    })

    it('should not reset if slug is not applied', () => {
      const { resetFilter } = useFilter()
      resetFilter('newAttribute')
      expect(mocks.router.push).not.toBeCalledWith({
        query: {},
      })
    })
  })

  describe('resetPriceFilter', () => {
    it('should reset correctly', () => {
      mocks.useAppliedFilters.appliedFiltersCount.value = 1
      mocks.route.query = {
        'filters[minPrice]': '1',
        'filters[maxPrice]': '12',
      }
      const { resetPriceFilter } = useFilter()
      resetPriceFilter()
      expect(mocks.router.push).toBeCalledWith({
        query: {},
      })
    })

    it('should not reset if price is not applied', () => {
      const { resetPriceFilter } = useFilter()
      resetPriceFilter()
      expect(mocks.router.push).not.toBeCalledWith({
        query: {},
      })
    })
  })

  describe('resetFilters', () => {
    it('should reset all correctly', () => {
      mocks.useAppliedFilters.appliedFiltersCount.value = 3
      mocks.route.query = {
        'filters[minPrice]': '1',
        'filters[maxPrice]': '12',
        'filters[attribute]': '[1,2,3,4,]',
        'filters[sale]': true,
      }
      const { resetFilters } = useFilter()
      resetFilters()
      expect(mocks.router.push).toBeCalledWith({
        query: {},
      })
    })

    it('should not reset if no filter is not applied', () => {
      const { resetFilters } = useFilter()
      resetFilters()
      expect(mocks.router.push).not.toBeCalledWith({
        query: {},
      })
    })

    it('should keep query params unrelated to filters', () => {
      mocks.useAppliedFilters.appliedFiltersCount.value = 4
      mocks.route.query = {
        unrelated: 'test',
        'filters[minPrice]': '1',
        'filters[maxPrice]': '12',
        'filters[attribute]': '[1,2,3,4,]',
        'filters[sale]': true,
      }
      const { resetFilters } = useFilter()
      resetFilters()
      expect(mocks.router.push).toBeCalledWith({
        query: {
          unrelated: 'test',
        },
      })
    })
  })
})
