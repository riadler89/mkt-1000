<template>
  <div
    class="flex w-full flex-col px-5 py-8 lg:ml-7 lg:mr-13 lg:w-3/5 lg:items-end"
  >
    <div>
      <SFHeadline size="xl" tag="h1">
        {{ $t('order_success_page.title') }}
      </SFHeadline>
      <SFOspGreetingBox :order-data="orderData" class="mt-4" />
      <div class="text-md sm:grid">
        <div class="mt-4 grid w-full grid-cols-1 gap-4 md:grid-cols-2">
          <SFOspBasicOrderData :order-data="orderData" />
          <SFOspPaymentData
            v-if="orderData.payment"
            :payment-data="orderData.payment"
          />
          <SFOspAddressInformation
            v-if="orderData.address"
            :address="orderData.address"
          />
        </div>
        <SFOspCtaButtons
          :order-data="orderData"
          class="mt-4 w-full max-md:hidden"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SFOspBasicOrderData from './SFOspBasicOrderData.vue'
import SFOspAddressInformation from './SFOspAddressInformation.vue'
import SFOspCtaButtons from './SFOspCtaButtons.vue'
import SFOspPaymentData from './SFOspPaymentData.vue'
import { SFHeadline } from '#storefront-ui/components'
import SFOspGreetingBox from '~/components/osp/SFOspGreetingBox.vue'
import type { Order } from '~~/types/order'

defineProps<{
  orderData: Order
}>()
</script>
