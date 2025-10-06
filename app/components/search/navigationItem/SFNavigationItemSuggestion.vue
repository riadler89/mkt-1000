<template>
  <SFNavigationTreeItem
    :navigation-item="
      navigationItemSuggestion.navigationItemSuggestion.navigationItem
    "
    raw
    class="block cursor-pointer space-y-2 rounded-lg border border-secondary p-4 hover:border-primary hover:bg-gray-200 focus:border-primary focus:bg-gray-200"
    data-testid="search-suggestions-item"
    @click="$emit('clickResult', navigationItemSuggestion)"
  >
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div class="text-secondary" :aria-label="navigationName" v-html="title" />
  </SFNavigationTreeItem>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import DOMpurify from 'dompurify'
import type { NavigationItemSuggestion } from '@scayle/storefront-nuxt'
import SFNavigationTreeItem from '~/components/layout/SFNavigationTreeItem.vue'

const { navigationItemSuggestion, searchTerm = '' } = defineProps<{
  navigationItemSuggestion: NavigationItemSuggestion
  searchTerm?: string
}>()

defineEmits<{ clickResult: [result: NavigationItemSuggestion] }>()

const navigationName = computed(
  () => navigationItemSuggestion.navigationItemSuggestion.navigationItem.name,
)

const title = computed(() => {
  if (!searchTerm) {
    return navigationName.value
  }

  const regex = new RegExp(searchTerm.replaceAll(' ', '|'), 'gi')
  return DOMpurify.sanitize(
    navigationName.value.replace(
      regex,
      '<span class="font-semibold">$&</span>',
    ),
    {
      ALLOWED_TAGS: ['span'],
    },
  )
})
</script>
