<template>
  <SFFilterGroup
    v-if="!hideSorting"
    class="md:hidden"
    :label="$t('filter_slide_in_content.sorting')"
  >
    <SFMobileSortSelection
      :selected-sort="selectedSort"
      :sort-links="sortLinks"
    />
  </SFFilterGroup>

  <SFFilterGroup
    v-if="primaryImageTypeOptions?.length"
    class="max-md:border-t"
    :label="$t('filter_slide_in_content.product_image_view')"
  >
    <SFPreferredPrimaryImageTypeToggle
      v-model:selected-primary-image-type="selectedPrimaryImageType"
      :primary-image-type-options="primaryImageTypeOptions"
    />
  </SFFilterGroup>
  <template v-for="(filter, index) in availableFilters" :key="filter.slug">
    <template
      v-if="
        filter.type === 'range' &&
        filter.values[0]?.min !== filter.values[0]?.max
      "
    >
      <SFFilterGroup
        v-if="filter.slug === 'prices'"
        :label="filter.name"
        :show-action="
          !!(appliedFilter.maxPrice || appliedFilter.minPrice) &&
          (appliedFilter.minPrice !== filter.values[0]?.min ||
            appliedFilter.maxPrice !== filter.values[0]?.max)
        "
        :class="{ 'border-t': index !== 0 || primaryImageTypeOptions?.length }"
        @click-reset="$emit('resetPriceFilter')"
      >
        <SFFilterRangeSlider
          filter-slug="prices"
          :model-value="
            getPriceRange(filter.values[0].min, filter.values[0].max)
          "
          class="mt-10"
          :max="filter.values[0]?.max"
          :min="filter.values[0]?.min"
          @drag-end="
            handleApplyOrResetPriceFilterEmit(
              $event,
              filter.values[0].min,
              filter.values[0].max,
            )
          "
          @input-field-update="
            handleApplyOrResetPriceFilterEmit(
              $event,
              filter.values[0].min,
              filter.values[0].max,
            )
          "
        />
      </SFFilterGroup>
      <SFFilterGroup
        v-if="filter.slug === 'max_savings_percentage'"
        :label="filter.name"
        :show-action="
          !!(appliedFilter.maxReduction || appliedFilter.minReduction) &&
          (appliedFilter.minReduction !== filter.values[0]?.min ||
            appliedFilter.maxReduction !== filter.values[0]?.max)
        "
        :class="{ 'border-t': index !== 0 || primaryImageTypeOptions?.length }"
        @click-reset="$emit('resetReductionFilter')"
      >
        <SFFilterRangeSlider
          filter-slug="max_savings_percentage"
          :model-value="
            getReductionRange(filter.values[0].min, filter.values[0].max)
          "
          class="mt-10"
          :max="filter.values[0]?.max"
          :min="filter.values[0]?.min"
          @drag-end="
            handleApplyOrResetReductionFilterEmit(
              $event,
              filter.values[0].min,
              filter.values[0].max,
            )
          "
          @input-field-update="
            handleApplyOrResetReductionFilterEmit(
              $event,
              filter.values[0].min,
              filter.values[0].max,
            )
          "
        />
      </SFFilterGroup>
    </template>
    <SFFilterGroup
      v-if="filter.type === 'boolean'"
      :class="{ 'border-t': index !== 0 || primaryImageTypeOptions?.length }"
    >
      <SFSwitch
        :id="filter.slug"
        :model-value="appliedBooleanValues[filter.slug]"
        :label="getBooleanFilterLabel(filter)"
        @update:model-value="$emit('applyBooleanFilter', filter.slug, $event)"
      />
    </SFFilterGroup>
    <template v-if="filter.type === 'attributes'">
      <SFFilterGroup
        v-if="filter.slug === 'color'"
        :badge="appliedAttributeValues[filter.slug]?.length"
        :label="filter.name"
        :class="{ 'border-t': index !== 0 || primaryImageTypeOptions?.length }"
        class="pb-9 xl:pb-9"
        @click-reset="$emit('reset', filter.slug)"
      >
        <div class="flex flex-wrap gap-y-4">
          <template v-for="item in filter.values">
            <SFFilterColorChip
              v-if="ProductColor[item.value]"
              :key="item.id"
              data-testid="filter-color-circle"
              :color="item"
              :is-checked="
                appliedAttributeValues[filter.slug]?.includes(item.id)
              "
              @change="$emit('applyAttributeFilter', filter.slug, item.id)"
            >
              {{ item.name }}
            </SFFilterColorChip>
          </template>
        </div>
      </SFFilterGroup>
      <SFFilterGroup
        v-else-if="filter.slug === 'size'"
        :badge="appliedAttributeValues[filter.slug]?.length"
        :label="filter.name"
        :class="{ 'border-t': index !== 0 || primaryImageTypeOptions?.length }"
        @click-reset="$emit('reset', filter.slug)"
      >
        <div class="flex flex-wrap items-start gap-4">
          <SFChip
            v-for="item in filter.values"
            :key="item.id"
            :model-value="appliedAttributeValues[filter.slug]"
            :item="item.id"
            :input-aria-label="item.name"
            @change="$emit('applyAttributeFilter', filter.slug, item.id)"
          >
            {{ item.name }}
          </SFChip>
        </div>
      </SFFilterGroup>
      <SFFilterGroup
        v-else
        :badge="appliedAttributeValues[filter.slug]?.length"
        :label="filter.name"
        :class="{ 'border-t': index !== 0 || primaryImageTypeOptions?.length }"
        @click-reset="$emit('reset', filter.slug)"
      >
        <div class="flex flex-col gap-3">
          <SFCheckbox
            v-for="item in filter.values"
            :id="item.name"
            :key="item.id"
            :model-value="appliedAttributeValues[filter.slug]"
            :item="item.id"
            :label="item.name"
            @change="$emit('applyAttributeFilter', filter.slug, item.id)"
          />
        </div>
      </SFFilterGroup>
    </template>
  </template>
</template>

<script setup lang="ts">
import type {
  CentAmount,
  ProductSearchQuery,
  BooleanFilterItemWithValues,
  FilterItemWithValues,
  Value,
} from '@scayle/storefront-nuxt'
import type {
  RangeTuple,
  SortLink,
  SelectedSort,
} from '@scayle/storefront-product-listing'
import SFMobileSortSelection from '../sorting/SFMobileSortSelection.vue'
import SFFilterColorChip from './SFFilterColorChip.vue'
import SFFilterGroup from './SFFilterGroup.vue'
import SFPreferredPrimaryImageTypeToggle from './SFPreferredPrimaryImageTypeToggle.vue'
import { ProductColor } from '~~/shared/constants/product'
import {
  SFCheckbox,
  SFSwitch,
  SFChip,
  SFFilterRangeSlider,
} from '#storefront-ui/components'
import { useI18n } from '#i18n'

const { appliedFilter } = defineProps<{
  availableFilters?: FilterItemWithValues[]
  appliedAttributeValues: Record<string, (string | number)[]>
  appliedBooleanValues: Record<string, boolean>
  appliedFilter: ProductSearchQuery
  hideSorting: boolean
  selectedSort?: SelectedSort
  sortLinks: SortLink[]
  primaryImageTypeOptions?: Value[]
}>()

const selectedPrimaryImageType = defineModel<Value>('selectedPrimaryImageType')

const emit = defineEmits<{
  resetPriceFilter: []
  applyPriceFilter: [range: RangeTuple]
  resetReductionFilter: []
  applyReductionFilter: [range: RangeTuple]
  applyBooleanFilter: [slug: string, value: boolean]
  reset: [slug: string]
  applyAttributeFilter: [slug: string, value: number]
}>()

const { t: $t } = useI18n()

/**
 * Emits an event based on whether the provided event values match the filter limits.
 * This ensures that the price filter can be reset even when the right / left slider
 * is at its highest position, addressing the issue where the filter would
 * otherwise remain applied.
 */
const handleApplyOrResetPriceFilterEmit = (
  event: RangeTuple,
  filterMin: number,
  filterMax: number,
) => {
  if (event[0] === filterMin && event[1] === filterMax) {
    emit('resetPriceFilter')
  } else {
    emit('applyPriceFilter', event)
  }
}

const handleApplyOrResetReductionFilterEmit = (
  event: RangeTuple,
  filterMin: number,
  filterMax: number,
) => {
  if (event[0] === filterMin && event[1] === filterMax) {
    emit('resetReductionFilter')
  } else {
    emit('applyReductionFilter', event)
  }
}

const getPriceRange = (
  currentMin: CentAmount,
  currentMax: CentAmount,
): RangeTuple => {
  const appliedMin = appliedFilter.minPrice
  const appliedMax = appliedFilter.maxPrice

  const min = Math.max(currentMin, appliedMin ?? currentMin, 0)
  const max = Math.min(currentMax, appliedMax ?? currentMax)

  return [min, max]
}

const getReductionRange = (
  currentMin: number,
  currentMax: number,
): RangeTuple => {
  const appliedMin = appliedFilter.minReduction
  const appliedMax = appliedFilter.maxReduction

  const min = Math.max(currentMin, appliedMin ?? currentMin, 0)
  const max = Math.min(currentMax, appliedMax ?? currentMax)

  return [min, max]
}

const getBooleanFilterLabel = ({ name, slug }: BooleanFilterItemWithValues) => {
  return slug !== 'sale' ? name : $t('filter_slide_in_content.only_sale_option')
}
</script>
