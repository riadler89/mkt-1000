<template>
  <div class="relative max-md:pt-1.5">
    <div
      class="text-center text-secondary max-md:absolute max-md:left-1/2 max-md:z-10 max-md:-translate-x-1/2 max-md:-translate-y-1/2 max-md:rounded-full max-md:border max-md:border-gray-400 max-md:bg-white max-md:text-sm md:mb-5 md:flex md:w-full md:items-center md:space-x-3"
    >
      <div class="h-px w-full bg-gray-400 max-md:hidden" />
      <span class="shrink-0 px-5 max-md:py-1 md:px-3">
        {{ $t('product_subscription.separation_text') }}
      </span>
      <div class="h-px w-full bg-gray-400 max-md:hidden" />
    </div>

    <div
      class="space-y-5 border-y border-gray-400 px-5 pb-10 pt-11 max-md:bg-gray-100 md:rounded-lg md:border md:border-accent md:py-5"
      data-testid="subscription-service"
    >
      <h2 class="text-2xl font-medium text-primary md:text-md md:font-semibold">
        {{ $t('product_subscription.subscribe') }}
      </h2>

      <div v-if="!subscriptionPrice" class="text-md text-secondary">
        {{ $t('product_subscription.select_size') }}
      </div>
      <div
        v-else-if="subscriptionPrice && !subscriptionVariantEligible"
        class="text-md text-secondary"
      >
        {{ $t('product_subscription.not_eligible_for_subscription_message') }}
      </div>
      <SFProductPrice
        v-else
        :promotions="promotions"
        :campaign="campaign"
        size="lg"
        type="normal"
        :price="subscriptionPrice"
        :applied-reductions="subscriptionPrice?.appliedReductions"
        show-tax-info
      />
      <SFFadeInTransition :duration="150">
        <SFProductSubscriptionSelection
          v-if="variant && subscriptionVariantEligible"
          :product="product"
          :variant="variant"
          :quantity="quantity"
          :preferred-delivery-date="preferredDeliveryDate"
          :price-promotion-key="pricePromotionKey"
          @add-item-to-basket="$emit('addItemToBasket', $event)"
        />
      </SFFadeInTransition>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { Product, Variant } from '@scayle/storefront-nuxt'
import { computed } from 'vue'
import { useSubscription } from '../composables/useSubscription'
import type { PreferredDeliveryDate } from '../helpers/subscription'
import { SFProductSubscriptionSelection } from '#storefront-subscription/components'
import type { AddToBasketItem } from '~/composables/useBasketActions'
import { useCampaign, useCurrentPromotions } from '#storefront/composables'
import { getPromotionsForProduct } from '~/utils'
import { SFFadeInTransition } from '#storefront-ui/components'
import SFProductPrice from '~/components/product/SFProductPrice.vue'

const {
  variant,
  product,
  pricePromotionKey = 'subscription',
  quantity,
  preferredDeliveryDate = [
    { day: 1, label: 'day_of_month_selection_caption' },
    { day: 15, label: 'day_of_month_selection_caption' },
  ],
} = defineProps<{
  product: Product
  variant?: Variant
  preferredDeliveryDate?: PreferredDeliveryDate[]
  pricePromotionKey?: string
  quantity: number
}>()

defineEmits<{ addItemToBasket: [item?: AddToBasketItem] }>()

const {
  selectedPreferredDeliveryDate,
  subscriptionPrice,
  subscriptionVariantEligible,
} = await useSubscription(
  () => product,
  () => pricePromotionKey,
  () => variant,
  () => quantity,
  'product-subscription.vue',
)

selectedPreferredDeliveryDate.value = preferredDeliveryDate[0]

const promotionData = useCurrentPromotions()

const promotions = computed(() => {
  return getPromotionsForProduct(
    product,
    promotionData.data?.value?.entities ?? [],
  )
})
const { data: campaign } = useCampaign()
</script>
