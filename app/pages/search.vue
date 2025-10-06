<template>
  <section class="container overflow-hidden pt-4 max-md:max-w-none md:pt-8">
    <div class="flex w-full flex-wrap justify-between gap-4">
      <SFHeadline
        tag="h1"
        class="mt-1.5 line-clamp-2 text-primary max-sm:text-2xl max-sm:leading-6 sm:mt-0"
      >
        {{ $t('search_page.title', { term }) }}
        <SFFadeInTransition>
          <span
            v-if="totalProductsCount > 0 && status === 'success'"
            class="rounded-full bg-primary px-2 py-0.5 text-sm font-semibold leading-4 text-white"
          >
            {{ totalProductsCount }}
          </span>
        </SFFadeInTransition>
      </SFHeadline>

      <SFFilterToggleButton
        v-if="showFiltersButton"
        class="hidden md:flex"
        :label="$t('filter.show_filter')"
      />
    </div>

    <SFFilterToggleButton
      v-if="showFiltersButton"
      class="mt-4 md:hidden"
      :label="$t('filter.show_filter')"
    />

    <SFProductList
      :products="products"
      :pagination="pagination"
      :loading="isLoading"
      :preferred-primary-image-type="primaryImageType"
      class="mt-6"
    />

    <SFFilterSlideIn
      hide-sorting
      :selected-primary-image-type="primaryImageType"
      :primary-image-type-options="imageTypeOptions"
    />
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Value } from '@scayle/storefront-nuxt'
import { useSeoMeta, definePageMeta } from '#imports'
import { useRoute } from '#app/composables/router'
import {
  PRODUCT_TILE_WITH_PARAMS,
  PRODUCTS_PER_PAGE,
} from '~~/shared/constants'
import { SFHeadline, SFFadeInTransition } from '#storefront-ui/components'
import {
  useAppliedFilters,
  useProductsForListing,
} from '#storefront-product-listing'
import { useNuxtApp } from '#app/nuxt'
import SFProductList from '~/components/productList/SFProductList.vue'
import SFFilterSlideIn from '~/components/filter/SFFilterSlideIn.vue'
import SFFilterToggleButton from '~/components/filter/SFFilterToggleButton.vue'
import { getDistinctPrimaryImageTypes } from '~/utils'
import { usePrimaryImageType } from '~/composables/usePrimaryImageType'

const route = useRoute()
const { $i18n } = useNuxtApp()

const { appliedFilter } = useAppliedFilters(route)
const imageTypeOptions = computed<Value[]>(() => {
  return getDistinctPrimaryImageTypes(products.value)
})
const { primaryImageType } = usePrimaryImageType(() => imageTypeOptions.value)

const term = computed(() => appliedFilter.value.term ?? '')

/**
 * A computed property which represents the current page number
 *
 * This is separate and not inlined into `params` so that `params` is not recomputed
 * each time `route` changes. It's only recomputed when the actual number changes.
 */
const pageNumber = computed(() => Number(route.query.page) || 1)
const { products, pagination, status, totalProductsCount } =
  useProductsForListing({
    params: computed(() => ({
      where: appliedFilter.value,
      perPage: PRODUCTS_PER_PAGE,
      page: pageNumber.value,
      with: PRODUCT_TILE_WITH_PARAMS,
      includeSoldOut: false,
      includeSellableForFree: false,
    })),
  })

const isLoading = computed(() => status.value === 'pending')
const showFiltersButton = computed(() => {
  // Show the filters buttons always when we are in the loading state
  if (isLoading.value) {
    return true
  }

  // Otherwise we only show it when we have some products
  return totalProductsCount.value > 0
})

useSeoMeta({
  robots: 'noindex,follow',
  title: () => $i18n.t('search_page.meta.title', { term: term.value }),
})

defineOptions({ name: 'SearchPage' })
definePageMeta({ pageType: 'search_result_page' })
</script>
