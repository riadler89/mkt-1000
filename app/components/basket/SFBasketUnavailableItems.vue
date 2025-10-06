<template>
  <ul
    class="flex w-full flex-col items-end pt-px lg:min-w-md lg:max-w-2xl lg:-translate-y-10"
    data-testid="unavailable-product-list"
    :aria-label="$t('basket.unavailable_products')"
  >
    <SFBasketCard
      v-for="item in unavailableItems"
      :key="item.key"
      :basket-item="item"
      class="-mt-px w-full focus-within:z-10 max-lg:first:border-t-0 lg:first:!rounded-t-none lg:first:!border-t-0 lg:first:pt-6"
      @delete="$emit('delete', item)"
    />
  </ul>
</template>

<script setup lang="ts">
import type { BasketItem } from '@scayle/storefront-nuxt'
import SFBasketCard from './SFBasketCard.vue'

const { unavailableItems = [] } = defineProps<{
  unavailableItems?: BasketItem[]
}>()

defineEmits<{ delete: [item: BasketItem] }>()
</script>
