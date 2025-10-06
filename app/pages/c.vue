<template>
  <NuxtPage
    :root-categories="rootCategories"
    :fetching-categories="status === 'pending'"
  />
</template>

<script setup lang="ts">
import { NuxtPage } from '#components'
import { useCategoryTree } from '#storefront/composables'

const { data: rootCategories, status } = useCategoryTree(
  {
    params: {
      children: 5,
      properties: { withName: ['sale'] },
      hideEmptyCategories: true,
    },
  },
  'category-navigation-tree',
)
</script>
