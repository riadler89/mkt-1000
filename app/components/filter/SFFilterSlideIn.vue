<template>
  <SFSlideIn
    name="FilterSlideIn"
    :close-on-route-change="false"
    @open="onSlideInOpen"
    @close="onSlideInClose"
  >
    <template #slide-in-header="{ toggle: toggleItem }">
      <SFFilterHeader :toggle-item="toggleItem" />
    </template>
    <template #slide-in-body>
      <SFFilterSlideInContent
        :selected-primary-image-type="selectedPrimaryImageType"
        :hide-sorting="hideSorting"
        :applied-attribute-values="appliedAttributeValues"
        :applied-boolean-values="appliedBooleanValues"
        :applied-filter="appliedFilter"
        :available-filters="availableFilters"
        :selected-sort="selectedSort"
        :sort-links="sortLinks"
        :primary-image-type-options="primaryImageTypeOptions"
        @apply-price-filter="applyPriceFilter"
        @apply-attribute-filter="applyAttributeFilter"
        @apply-boolean-filter="applyBooleanFilter"
        @reset-price-filter="resetPriceFilter"
        @reset-reduction-filter="resetReductionFilter"
        @apply-reduction-filter="applyReductionFilter"
        @update:selected-primary-image-type="applyPrimaryImageType"
        @reset="resetFilter"
      />
    </template>
    <template #slide-in-actions>
      <SFFilterActions
        :are-filters-cleared="areFiltersCleared"
        :filtered-product-count="filteredProductCount"
        @reset="resetFilters"
      />
    </template>
  </SFSlideIn>
</template>

<script setup lang="ts">
import type { SortLink, SelectedSort } from '@scayle/storefront-product-listing'
import type { Value } from '@scayle/storefront-nuxt'
import SFFilterSlideInContent from './SFFilterSlideInContent.vue'
import SFFilterActions from './SFFilterActions.vue'
import SFFilterHeader from './SFFilterHeader.vue'
import { useFilter } from '~/composables'
import { SFSlideIn } from '#storefront-ui/components'
import { useAppliedFilters } from '#storefront-product-listing'
import { useRoute } from '#app/composables/router'
import { usePrimaryImageType } from '~/composables/usePrimaryImageType'

const {
  currentCategoryId,
  hideSorting = false,
  selectedSort = undefined,
  sortLinks = [],
  primaryImageTypeOptions = [],
} = defineProps<{
  /**
   * ID of the current category for context-specific filtering.
   */
  currentCategoryId?: number
  /**
   * Whether to hide the sorting section in the filter panel (Only used for mobile).
   */
  hideSorting?: boolean
  /**
   * Currently selected sort option with label, key, and value.
   */
  selectedSort?: SelectedSort
  /**
   * Array of available sorting options with labels and navigation links.
   */
  sortLinks?: SortLink[]
  /**
   * Available primary image type options for product display preferences.
   */
  primaryImageTypeOptions?: Value[]
}>()

const selectedPrimaryImageType = defineModel<Value>('selectedPrimaryImageType')

const { appliedBooleanValues, appliedFilter, appliedAttributeValues } =
  useAppliedFilters(useRoute())

const {
  availableFilters,
  onSlideInOpen,
  onSlideInClose,
  applyPriceFilter,
  applyReductionFilter,
  applyAttributeFilter,
  applyBooleanFilter,
  resetPriceFilter,
  resetReductionFilter,
  resetFilters,
  resetFilter,
  filteredProductCount,
  areFiltersCleared,
} = useFilter(() => currentCategoryId)

const { applyPrimaryImageType } = usePrimaryImageType(
  () => primaryImageTypeOptions,
)
</script>
