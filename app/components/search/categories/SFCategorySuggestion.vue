<template>
  <SFSearchResultItem
    :to="to"
    @click="$emit('clickResult', categorySuggestion)"
  >
    <div ref="container" class="flex space-x-2 text-secondary">
      <template v-for="({ value }, index) in breadcrumbs" :key="value">
        <span
          :class="{
            hidden: isOverflowing && index > 0,
            'shrink-0': index === 0,
          }"
        >
          {{ value }}
        </span>
        <span
          v-if="index < breadcrumbs.length"
          :class="{
            hidden: isOverflowing && index > 0,
          }"
          >|</span
        >
      </template>
      <template v-if="isOverflowing">
        <span>...</span>
        <span>|</span>
      </template>
      <span class="shrink-0 font-semibold">
        {{ category.categorySuggestion.category.name }}
      </span>
    </div>
    <div
      v-if="filters.length"
      class="flex flex-wrap gap-2"
      data-testid="search-suggestion-tag-group"
    >
      <div
        v-for="label in filters"
        :key="label"
        class="flex h-5 items-center rounded-md bg-gray-300 p-1 text-sm leading-none text-secondary"
        :data-testid="`search-suggestion-tag-${label}`"
      >
        {{ label }}
      </div>
    </div>
  </SFSearchResultItem>
</template>

<script setup lang="ts">
import type { CategorySearchSuggestion } from '@scayle/storefront-nuxt'
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import SFSearchResultItem from '../SFSearchResultItem.vue'
import { useBreadcrumbs, useRouteHelpers } from '~/composables'
import { getSearchFilterLabels } from '#storefront-search/utils'

const { categorySuggestion: category } = defineProps<{
  categorySuggestion: CategorySearchSuggestion
}>()

defineEmits<{ clickResult: [result: CategorySearchSuggestion] }>()

const filters = computed(() => {
  return getSearchFilterLabels(category.categorySuggestion.filters)
})

const { buildCategorySuggestionRoute } = useRouteHelpers()
const to = computed(() => buildCategorySuggestionRoute(category))

const { getBreadcrumbsFromCategory } = useBreadcrumbs()
const breadcrumbs = getBreadcrumbsFromCategory(
  category.categorySuggestion.category,
)

const container = useTemplateRef('container')
const suggestionLengthInPixel = ref(0)
const isOverflowing = ref(false)

/**
 * Calculates the width required to display the suggested category
 * and its full ancestry in a single line.
 *
 * The calculation is performed by measuring the text width
 * using the `measureText` method of the CanvasRenderingContext2D
 * associated with an HTMLCanvasElement.
 */
const getSuggestionNameLength = () => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (!context || !container.value) {
    return 0
  }

  const style = window.getComputedStyle(container.value)
  const weight = style.getPropertyValue('font-weight')
  const size = style.getPropertyValue('font-size')
  const font = style.getPropertyValue('font-family')
  context.font = `${weight} ${size} ${font}`

  const spacing = 18
  const breadcrumbsWidth = breadcrumbs.reduce((acc, category) => {
    return (
      acc +
      context.measureText(category.value).width +
      spacing +
      context.measureText('|').width
    )
  }, 0)
  return (
    breadcrumbsWidth +
    context.measureText(category.categorySuggestion.category.name).width
  )
}

onMounted(() => {
  suggestionLengthInPixel.value = getSuggestionNameLength()
})
useResizeObserver(container, () => {
  isOverflowing.value =
    (container.value?.clientWidth || 0) < suggestionLengthInPixel.value
})
</script>
