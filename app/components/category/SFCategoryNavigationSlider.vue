<template>
  <SFItemsSlider
    class="w-full snap-x snap-mandatory scrollbar-hide"
    slider-class="py-1"
  >
    <SFCategoryNavigationSliderItem
      v-for="category in categories"
      :key="category.id"
      :category="category"
      :is-active="category.id === currentCategory?.id"
      class="mr-2"
    />
  </SFItemsSlider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Category } from '@scayle/storefront-nuxt'
import SFCategoryNavigationSliderItem from './SFCategoryNavigationSliderItem.vue'
import { SFItemsSlider } from '#storefront-ui/components'

const { allCategories, currentCategory } = defineProps<{
  /**
   * Array of all available categories used for filtering and displaying navigation items.
   */
  allCategories: Category[]
  /**
   * The currently selected category. Determines which subcategories or siblings are displayed in the slider.
   */
  currentCategory: Category | null
}>()

const categories = computed(() => {
  // If the category is a leaf node, select all categories which have the same parent
  if (currentCategory?.childrenIds.length === 0) {
    return allCategories.filter((item) => {
      return currentCategory.parentId === item.parentId
    })
  }

  // If the category has children, we return all categories which have our current category as a parent
  return allCategories.filter((item) => {
    return currentCategory?.id === item.parentId
  })
})
</script>
