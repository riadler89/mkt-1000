<template>
  <SFOspDetailBox
    :title="$t('order_information.order_details.title')"
    data-testid="osp-order-data"
  >
    <ul class="flex flex-col gap-1 text-secondary">
      <li v-if="orderConfirmedAt">
        <span class="font-medium"
          >{{ $t('order_information.order_details.order_date') }}:</span
        >
        {{ orderConfirmedAt }}
      </li>
      <li v-if="orderData.id">
        <span class="font-medium"
          >{{ $t('order_information.order_details.order_number') }}:</span
        >
        {{ orderData.id }}
      </li>
      <li v-if="orderData.customer">
        <span class="font-medium"
          >{{ $t('order_information.order_details.customer_id') }}:</span
        >
        {{ orderData.customer.id }}
      </li>
    </ul>
  </SFOspDetailBox>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SFOspDetailBox from './SFOspDetailBox.vue'
import { useCurrentShop } from '#storefront/composables'
import type { Order } from '~~/types/order'

const { orderData } = defineProps<{
  orderData: Order
}>()

const currentShop = useCurrentShop()

const orderConfirmedAt = computed(() => {
  if (!orderData.confirmedAt) {
    return
  }
  return new Date(orderData.confirmedAt).toLocaleDateString(
    currentShop.value?.locale?.replace('_', '-'),
  )
})
</script>
