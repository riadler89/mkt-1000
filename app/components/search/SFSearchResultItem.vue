<template>
  <SFLocalizedLink
    :to="to"
    raw
    class="block cursor-pointer space-y-2 rounded-lg border border-secondary p-4 hover:border-primary hover:bg-gray-200 focus:border-primary focus:bg-gray-200"
    data-testid="search-suggestions-item"
  >
    <slot />
  </SFLocalizedLink>
</template>

<script setup lang="ts">
import SFLocalizedLink from '../SFLocalizedLink.vue'
import type { RouteLocationRaw } from '#vue-router'

defineProps<{ to: RouteLocationRaw }>()
</script>
