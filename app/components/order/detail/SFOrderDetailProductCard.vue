<template>
  <SFLocalizedLink
    v-if="link"
    :aria-label="`${brand}, ${name}, ${color}, ${size}`"
    class="flex flex-col gap-1"
    data-testid="order-detail-product-card"
    raw
    :to="link"
  >
    <div class="flex gap-4">
      <SFProductImage
        v-if="image"
        :image="image"
        :alt="alt"
        :sizes="'80px'"
        class="size-20 max-h-20 overflow-hidden rounded-lg border"
        data-testid="order-detail-product-image"
      />
      <div class="flex flex-col gap-3 py-1">
        <SFOrderDetailProductDetails
          :name="name"
          :brand="brand"
          :size="size"
          :color="color"
          :quantity="quantity"
        />
        <SFOrderDetailProductSubscription :order-item="orderItem" />
      </div>
    </div>
    <div class="flex flex-col justify-end">
      <SFProductPrice
        :campaign="campaign"
        :price="orderItem.price"
        class="ml-auto"
        data-testid="order-product-card-prices"
        :inline="false"
      />
    </div>
  </SFLocalizedLink>
</template>

<script setup lang="ts">
import { getFirstAttributeValue, type Product } from '@scayle/storefront-nuxt'
import { computed } from 'vue'
import SFOrderDetailProductDetails from './SFOrderDetailProductDetails.vue'
import { SFOrderDetailProductSubscription } from '#storefront-subscription/components'
import SFProductPrice from '~/components/product/SFProductPrice.vue'
import SFLocalizedLink from '~/components/SFLocalizedLink.vue'
import type { OrderItem } from '~~/types/order'
import SFProductImage from '~/components/product/SFProductImage.vue'
import { useProductBaseInfo } from '~/composables'
import { useCampaign } from '#storefront/composables'

const { data: campaign } = useCampaign()

const { orderItem, quantity = 1 } = defineProps<{
  orderItem: OrderItem
  quantity?: number
}>()

const { name, brand, link, image, alt, color } = useProductBaseInfo(
  orderItem.product as unknown as Product,
)

const size = computed(
  () =>
    getFirstAttributeValue(orderItem.variant.attributes, 'size')?.label ?? '',
)
</script>
