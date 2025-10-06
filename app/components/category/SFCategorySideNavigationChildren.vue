<template>
  <ul>
    <li
      v-for="(category, index) in subCategories"
      :key="`category-navigation-item-${category.id}`"
      :data-testid="getDataTestId(index)"
      class="mt-1"
      :class="{ 'ml-2.5': category.depth > 2 }"
    >
      <SFCategorySideNavigationItem
        :category="category"
        :is-active="category.id === currentCategory?.id"
        :is-sale="!isParentSale && isSaleCategory(category)"
        class="!leading-5"
        :class="{
          '!text-md': category.depth === 2,
          '!text-sm': category.depth > 2,
        }"
      />
      <SFCategorySideNavigationChildren
        v-if="shouldShowChildren(category)"
        :current-category="currentCategory"
        :is-parent-sale="isSaleCategory(category)"
        :sub-categories="category.children ?? []"
        :parent-data-testid="getDataTestId(index)"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { Category } from '@scayle/storefront-nuxt'
import SFCategorySideNavigationChildren from './SFCategorySideNavigationChildren.vue'
import SFCategorySideNavigationItem from './SFCategorySideNavigationItem.vue'
import { isSaleCategory } from '#storefront-product-listing'

const { currentCategory, parentDataTestId } = defineProps<{
  subCategories: Category[]
  currentCategory: Category | null
  isParentSale: boolean
  parentDataTestId?: string
}>()

const shouldShowChildren = ({ id, children }: Category) => {
  if (!children?.length) {
    return false
  }
  const areAncestorsActive = currentCategory?.rootlineIds.includes(id)
  return id === currentCategory?.id || areAncestorsActive
}

const getDataTestId = (index: number) => {
  return !parentDataTestId
    ? `sub-category-${index}`
    : `${parentDataTestId}_${index}`
}
</script>
