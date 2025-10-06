<template>
  <div class="flex flex-col px-6 py-4 text-md text-secondary">
    {{ text }}
  </div>
</template>

<script setup lang="ts">
import type { ComboDealEffect, Promotion } from '@scayle/storefront-nuxt'
import { computed } from 'vue'
import { useI18n } from '#imports'
import { useBasket, useFormatHelpers } from '#storefront/composables'

const { t } = useI18n()
const { formatCurrency } = useFormatHelpers()

const { promotion } = defineProps<{
  promotion: Promotion<ComboDealEffect>
}>()
const { items: basketItems } = useBasket()

const isComboDealApplied = computed(() => {
  return basketItems.value?.some(({ promotions }) => {
    return promotions?.some(
      (basketPromotion) =>
        promotion.id === basketPromotion.id && basketPromotion.isValid,
    )
  })
})

const discount = computed(() => {
  let reductionAmount = 0
  for (const item of basketItems.value ?? []) {
    const appliedReduction = item.price.total.appliedReductions.find(
      (reduction) => reduction.promotionId === promotion.id,
    )
    reductionAmount += appliedReduction?.amount.absoluteWithTax ?? 0
  }

  return reductionAmount
})

const text = computed(() => {
  if (isComboDealApplied.value) {
    return t('promotion_progress_wrapper.combo_deal_unlocked', {
      amount: formatCurrency(discount.value),
    })
  }
  return t('promotion_progress_wrapper.combo_deal')
})
</script>
