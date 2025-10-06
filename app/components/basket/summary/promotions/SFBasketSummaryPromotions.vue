<template>
  <div
    v-if="filteredValidPromotions.length"
    data-testid="basket-summary-promotions"
    class="flex flex-col justify-between gap-3"
  >
    <div class="flex items-center justify-between">
      <SFBasketSummaryPromotionsToggle
        id="promotion-discounts-header"
        v-model:visible="isPromotionsSummaryVisible"
        aria-controls="promotion-discounts-content"
        data-testid="promotion-summary-toggle-button"
      />
      <span
        v-if="totalPromotionReductions"
        class="text-md font-semibold leading-4"
        data-testid="summary-total-promotion-reduction"
      >
        {{ formatCurrency(-Math.abs(totalReduction)) }}
      </span>
    </div>
    <SFFadeInFromBottomTransition>
      <SFBasketSummaryPromotionsDiscounts
        v-if="isPromotionsSummaryVisible"
        id="promotion-discounts-content"
        role="region"
        aria-labelledby="promotion-discounts-header"
        :valid-promotions="filteredValidPromotions"
        :basket="basket"
        :campaign="campaign"
      />
    </SFFadeInFromBottomTransition>
  </div>
</template>

<script setup lang="ts">
import type { BasketResponseData, Campaign } from '@scayle/storefront-nuxt'
import { computed } from 'vue'
import SFBasketSummaryPromotionsDiscounts from './SFBasketSummaryPromotionsDiscounts.vue'
import SFBasketSummaryPromotionsToggle from './SFBasketSummaryPromotionsToggle.vue'
import { useFormatHelpers } from '#storefront/composables'
import { SFFadeInFromBottomTransition } from '#storefront-ui/components'
import { useBasketPromotions } from '#storefront-promotions/composables'

const { basket, campaign } = defineProps<{
  basket: BasketResponseData
  campaign?: Campaign | null
}>()

const { validPromotions, totalPromotionReductions } = useBasketPromotions(
  // We need to pass destructured props as a getter in order to keep reactivity:
  // https://vuejs.org/guide/components/props.html#passing-destructured-props-into-functions
  () => basket,
)

const filteredValidPromotions = computed(() => {
  return validPromotions.value.filter((promotion) => {
    return promotion.total > 0
  })
})

const totalReduction = computed(() => {
  const campaignReduction = basket.cost.appliedReductions.find(
    (reduction) => reduction.category === 'campaign',
  )
  return (
    totalPromotionReductions.value +
    (campaignReduction?.amount.absoluteWithTax || 0)
  )
})

const isPromotionsSummaryVisible = defineModel<boolean>('visible', {
  default: false,
})

const { formatCurrency } = useFormatHelpers()
</script>
