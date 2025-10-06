<template>
  <aside class="h-dvh pb-8">
    <ul
      class="h-full overflow-y-scroll pb-2 pl-2 scrollbar-hide"
      data-testid="side-navigation"
    >
      <li
        v-for="(category, index) in rootCategories"
        :key="`category-navigation-tree-item-${category.id}`"
        :data-testid="`root-category-${index}`"
        class="mb-5 mt-2 first:mt-0 last:mb-0"
      >
        <SFCategorySideNavigationItem
          :category="category"
          :is-active="category.id === currentCategory?.id"
          :is-sale="isSaleCategory(category)"
          class="font-semibold !text-primary"
        />
        <SFCategorySideNavigationChildren
          v-if="category.children?.length"
          :current-category="currentCategory"
          :sub-categories="category.children"
          :is-parent-sale="isSaleCategory(category)"
        />
      </li>
    </ul>
  </aside>
</template>

<script setup lang="ts">
import type { Category } from '@scayle/storefront-nuxt'
import SFCategorySideNavigationChildren from './SFCategorySideNavigationChildren.vue'
import SFCategorySideNavigationItem from './SFCategorySideNavigationItem.vue'
import { isSaleCategory } from '#storefront-product-listing'

defineProps<{
  /**
   * Array of root categories with their children hierarchy. Each category should have a children array for nested navigation.
   */
  rootCategories: Category[]
  /**
   * The currently selected category. Used to highlight the active category in the navigation tree.
   */
  currentCategory: Category | null
}>()
</script>
