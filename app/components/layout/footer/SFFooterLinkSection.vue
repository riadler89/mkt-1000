<template>
  <div class="flex flex-col gap-5" data-testid="footer-link-section">
    <div
      class="flex cursor-pointer items-center text-lg font-semibold text-primary md:cursor-default md:text-sm"
      data-testid="footer-link-section-title"
      @click="expanded = !expanded"
    >
      <h2>
        <SFNavigationTreeItem :navigation-item="sectionWithDisabledLink" />
      </h2>
      <div class="ml-auto flex md:hidden">
        <IconPlus v-if="!expanded" class="size-6 text-black" />
        <IconMinus v-else class="size-6 text-black" />
      </div>
    </div>
    <ul
      ref="content"
      class="flex-col gap-x-2 gap-y-5 transition-all md:flex"
      :class="{
        flex: expanded,
        hidden: !expanded,
      }"
    >
      <li v-for="item in section.children" :key="item.id">
        <SFNavigationTreeItem :navigation-item="item" />
      </li>
    </ul>
  </div>
</template>
<script setup lang="ts">
import { computed, ref } from 'vue'
import type { NavigationTreeItem as NavigationTreeItemType } from '@scayle/storefront-nuxt'
import { useRouter } from '#app/composables/router'
import SFNavigationTreeItem from '~/components/layout/SFNavigationTreeItem.vue'

const { section } = defineProps<{
  section: NavigationTreeItemType
}>()

const expanded = ref(false)
const sectionWithDisabledLink = computed(() => {
  return {
    ...section,
    customData: {
      ...(section?.customData || {}),
      disabledLink: true,
    },
  }
})

// Reset `expanded` if current route is left
useRouter().afterEach(() => {
  expanded.value = false
})
</script>
