<template>
  <div class="rounded-lg border bg-gray-300 font-semibold">
    <div class="rounded-lg bg-white p-2" data-testid="osp-delivery-date">
      <div class="text-md text-secondary">
        {{ $t('order_information.order_details.estimated_delivery_date') }}:
        {{ formatDate(new Date(Date.parse(deliveryDate.minimum))) }} -
        {{ formatDate(new Date(Date.parse(deliveryDate.maximum))) }}
      </div>
    </div>
    <div class="p-2 text-sm text-secondary" data-testid="osp-carrier">
      {{ $t('order_information.order_details.delivered_by') }}
      {{ $t('global.carrier_key.' + sender) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { DeliveryDate } from '~~/types/order'
import { useFormat } from '~/composables'

defineProps<{ deliveryDate: DeliveryDate; sender: string }>()

const { formatDate } = useFormat()
</script>
