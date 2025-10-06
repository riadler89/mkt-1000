<template>
  <div
    class="flex w-full flex-col border-gray-300 bg-gray-100 px-5 py-8 md:border-l lg:w-2/5 lg:items-start lg:pl-13 lg:pr-7"
  >
    <div class="text-sm">
      <SFHeadline size="xl" tag="h2" class="mb-4">
        {{
          $t('order_information.order_details.order_number_value', {
            orderNumber: orderData.id,
          })
        }}
      </SFHeadline>
      <div>
        <div
          v-for="({ items, shipment }, packageId) in getOrderDeliveries(
            orderData,
          )"
          :key="packageId"
          class="grid grid-cols-1 md:grid-cols-[minmax(auto,400px)]"
        >
          <SFOspDeliveryDate
            v-if="shipment.deliveryDate"
            :delivery-date="shipment.deliveryDate"
            :sender="shipment.carrierKey"
          />
          <ul
            v-if="items.length"
            class="mb-3 flex flex-col gap-3 divide-y *:pt-3"
          >
            <li v-for="orderItem in items" :key="orderItem.id" class="pt-3">
              <SFOrderDetailProductCard
                v-if="
                  orderItem.product?.advancedAttributes && orderItem.variant
                "
                :order-item="orderItem"
              />
            </li>
          </ul>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-[minmax(auto,400px)]">
          <SFOrderDetailPaymentSummary :cost="orderData.cost" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SFOrderDetailProductCard from '../order/detail/SFOrderDetailProductCard.vue'
import SFOrderDetailPaymentSummary from '../order/detail/SFOrderDetailPaymentSummary.vue'
import SFOspDeliveryDate from './SFOspDeliveryDate.vue'
import { SFHeadline } from '#storefront-ui/components'
import type { Order } from '~~/types/order'
import { getOrderDeliveries } from '~/utils'

const { orderData } = defineProps<{ orderData: Order }>()
</script>
