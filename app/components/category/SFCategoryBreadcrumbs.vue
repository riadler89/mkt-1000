<template>
  <div class="flex flex-col flex-wrap sm:flex-row sm:items-center">
    <div
      class="inline-flex flex-wrap"
      :class="{
        'border-r border-secondary max-sm:border-none md:border-r-2':
          categoryAncestors.length,
      }"
    >
      <SFLocalizedLink
        v-for="({ to, value }, index) in categoryAncestors"
        :key="`breadcrumb-${value}`"
        :data-testid="`category-breadcrumb-${index}`"
        :to="to"
        raw
        class="flex items-center px-2 text-lg font-medium text-secondary sm:text-2xl"
        :class="{
          'border-r border-secondary md:border-r-2': showDividerTag(
            index,
            categoryAncestors.length,
          ),
          'pl-0': index === 0,
        }"
      >
        <span class="leading-none">{{ value }}</span>
      </SFLocalizedLink>
    </div>
    <SFHeadline
      tag="h1"
      data-testid="active-category-breadcrumb"
      class="mt-1.5 text-primary max-sm:text-2xl max-sm:leading-6 sm:mt-0"
      :class="{ 'pl-2 max-sm:pl-0': categoryAncestors.length }"
    >
      {{ category.name }}
      <SFFadeInTransition>
        <SFBadge
          v-if="!loading && productsCount !== undefined"
          :badge="productsCount"
          data-testid="breadcrumb-product-counter"
        />
      </SFFadeInTransition>
    </SFHeadline>
  </div>
</template>

<script setup lang="ts">
import type { Category } from '@scayle/storefront-nuxt'
import { computed } from 'vue'
import SFLocalizedLink from '../SFLocalizedLink.vue'
import type { BreadcrumbItem } from '~~/types/breadcrumbs'
import { useBreadcrumbs } from '~/composables'
import {
  SFFadeInTransition,
  SFHeadline,
  SFBadge,
} from '#storefront-ui/components'
import { showDividerTag } from '#storefront-ui'

const {
  category,
  productsCount,
  loading = false,
} = defineProps<{
  category: Category
  productsCount?: number
  loading?: boolean
}>()

const { getBreadcrumbsFromCategory } = useBreadcrumbs()

const categoryAncestors = computed<BreadcrumbItem[]>(() => {
  return getBreadcrumbsFromCategory(category)
})
</script>
