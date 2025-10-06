<template>
  <div class="flex flex-col gap-2.5">
    <div
      v-for="({ items }, packageId) in getOrderDeliveries(orderDetails)"
      :key="packageId"
      class="grid grid-cols-1"
    >
      <ul v-if="items.length" class="mb-3 flex flex-col gap-3 divide-y *:pt-3">
        <li v-for="item in items" :key="item.id" class="pt-3">
          <SFOrderDetailProductCard :order-item="item" />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import SFOrderDetailProductCard from './SFOrderDetailProductCard.vue'
import type { Order } from '~~/types/order'
import { getOrderDeliveries } from '~/utils'

const { orderDetails } = defineProps<{ orderDetails: Order }>()
</script>
