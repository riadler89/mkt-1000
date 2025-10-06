<template>
  <div
    v-if="item?.children?.length"
    class="flex h-80 gap-x-14 border-t border-gray-300 bg-white px-20 py-10 drop-shadow"
    data-testid="desktop-navigation-flyout"
  >
    <ul
      v-for="columnItem in item.children"
      :key="columnItem.id"
      class="flex flex-col space-y-2.5"
    >
      <li>
        <SFNavigationTreeItem
          :navigation-item="columnItem"
          class="mb-2.5 !font-semibold"
          @click="onItemClick(columnItem)"
        />

        <ul
          v-if="columnItem.children.length > 0"
          class="grid w-fit grid-flow-col grid-rows-7 flex-col flex-wrap gap-x-5 gap-y-2.5"
        >
          <li v-for="rowItem in columnItem.children" :key="rowItem.id">
            <SFNavigationTreeItem
              :navigation-item="rowItem"
              @click="onItemClick(rowItem)"
            />
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { NavigationTreeItem as NavigationTreeItemType } from '@scayle/storefront-nuxt'
import SFNavigationTreeItem from '~/components/layout/SFNavigationTreeItem.vue'

defineProps<{ item: NavigationTreeItemType }>()

const emit = defineEmits<{ close: [] }>()

const onItemClick = (item: NavigationTreeItemType) => {
  if (item?.customData?.disabledLink) {
    return
  }
  emit('close')
}
</script>
