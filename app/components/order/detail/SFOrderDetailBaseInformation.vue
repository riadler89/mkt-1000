<template>
  <div
    class="grid grid-cols-1 gap-4 text-md font-normal text-secondary lg:grid-cols-2"
  >
    <SFOrderDetailBox :title="$t('order_information.order_details.title')">
      <div v-if="orderDetails.confirmedAt" class="flex items-center gap-1">
        <span class="font-medium">
          {{ $t('order_information.order_details.order_date') }}:
        </span>
        {{ formatDate(new Date(orderDetails.confirmedAt)) }}
      </div>
    </SFOrderDetailBox>
    <SFOrderDetailBox :title="$t('order_information.payment_details.title')">
      <div class="flex items-center gap-1">
        <span class="font-medium">
          {{ $t('order_information.payment_details.payment_method') }}:
        </span>
        <span>
          {{ $t(`global.payment_key.${paymentKey}`) }}
        </span>
      </div>
    </SFOrderDetailBox>
    <SFOrderDetailAddressBox
      :title="shippingAddressTitle"
      :address="address?.shipping"
      :class="{ 'col-span-full': areSameAddresses }"
    />
    <SFOrderDetailAddressBox
      v-if="!areSameAddresses"
      :address="address?.billing"
      :title="$t('order_information.address_details.billing_address')"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SFOrderDetailBox from './SFOrderDetailBox.vue'
import SFOrderDetailAddressBox from './SFOrderDetailAddressBox.vue'
import type { Order } from '~~/types/order'
import { useFormat } from '~/composables'
import { useI18n } from '#i18n'

const { t } = useI18n()

const { formatDate } = useFormat()

const { orderDetails } = defineProps<{ orderDetails: Order }>()

const address = computed(() => orderDetails.address)

const areSameAddresses = computed(() => {
  return address.value?.billing?.id === address.value?.shipping?.id
})

const shippingAddressTitle = computed(() => {
  return areSameAddresses.value
    ? t('order_information.address_details.delivery_and_billing_address')
    : t('order_information.address_details.delivery_address')
})

const paymentKey = computed(() => orderDetails.payment?.[0]?.key)
</script>
