<template>
  <SFDropdown
    id="sort-selection-dropdown"
    data-testid="sort-dropdown"
    class="h-9 w-full md:w-[12.5rem]"
    :items="sortLinks"
  >
    <template #default>
      <span class="max-w-[80%] overflow-hidden text-ellipsis !text-md">
        {{ selectedSort && selectedSort.label }}
      </span>
    </template>
    <template #item="{ item, selectItem }">
      <SFLocalizedLink
        :data-testid="`sort-item-${item.key}`"
        variant="whisper"
        class="mb-1 w-full rounded p-2 !text-md !font-medium last-of-type:mb-0 hover:bg-gray-200 focus-visible:shadow-inner-solid-sm"
        :class="{ 'bg-gray-200 !text-black': item.key === selectedSort?.key }"
        :to="item.to"
        @click="
          () => {
            selectItem(item)
            trackFilterApply('sort', item.key)
          }
        "
      >
        <span class="flex w-full items-center justify-between">
          {{ item.label }}
          <IconCheck
            v-if="item.key === selectedSort?.key"
            class="size-4 text-accent"
          />
        </span>
      </SFLocalizedLink>
    </template>
  </SFDropdown>
</template>

<script setup lang="ts">
import type { SortLink, SelectedSort } from '@scayle/storefront-product-listing'
import SFLocalizedLink from '../SFLocalizedLink.vue'
import { useTrackingEvents } from '~/composables'
import { SFDropdown } from '#storefront-ui/components'

const { selectedSort, sortLinks } = defineProps<{
  selectedSort?: SelectedSort
  sortLinks: SortLink[]
}>()
const { trackFilterApply } = useTrackingEvents()
</script>
