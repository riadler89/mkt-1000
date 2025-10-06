<template>
  <SFLink
    :to="buildCategoryPath(category)"
    raw
    class="flex h-10 w-fit flex-nowrap items-center justify-center whitespace-pre rounded-[2.375rem] bg-gray-200 px-4 text-md font-medium tracking-tighter text-secondary focus-visible:outline-offset-[-1px]"
    :class="{
      'border-2 border-primary bg-white font-semibold text-primary': isActive,
    }"
  >
    {{ category.name }}
  </SFLink>
</template>

<script setup lang="ts">
import type { Category } from '@scayle/storefront-nuxt'
import { useRouteHelpers } from '~/composables'
import { SFLink } from '#storefront-ui/components'

const { buildCategoryPath } = useRouteHelpers()

defineProps<{ category: Category; isActive: boolean }>()
</script>
