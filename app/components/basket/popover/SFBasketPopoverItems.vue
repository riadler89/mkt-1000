<template>
  <ul
    v-if="items?.length"
    class="max-h-xs overflow-y-auto overflow-x-hidden scrollbar-hide"
    :aria-label="$t('basket.available_products')"
  >
    <SFBasketPopoverCard
      v-for="item in items"
      :key="item.key"
      :basket-item="item"
      :campaign="campaign"
      class="w-80 sm:w-96"
    />
  </ul>
  <p v-else class="w-60 text-wrap p-3 text-center text-md text-secondary">
    {{ $t('basket_popover_items.no_items_info') }}
  </p>
</template>

<script setup lang="ts">
import type { Campaign } from '@scayle/storefront-nuxt'
import SFBasketPopoverCard from './SFBasketPopoverCard.vue'
import { useBasket } from '#storefront/composables'

const { items } = useBasket()
const { campaign } = defineProps<{
  campaign?: Campaign | null
}>()
</script>
