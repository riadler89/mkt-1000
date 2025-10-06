<template>
  <span
    class="rounded px-1 text-sm font-semibold"
    :style="getPromotionStyle(promotion)"
    :data-testid="`reduction-badge-${promotion.id}`"
  >
    {{ reduction }}
  </span>
</template>

<script setup lang="ts">
import type { Promotion, BuyXGetYEffect } from '@scayle/storefront-nuxt'
import { computed } from 'vue'
import { getPromotionStyle } from '~/utils'
import { useI18n } from '#i18n'
import { useFormatHelpers } from '#storefront/composables'

const { promotion } = defineProps<{ promotion: Promotion<BuyXGetYEffect> }>()

const { t } = useI18n()
const { formatCurrency } = useFormatHelpers()

/**
 * Computed reduction value based on the promotion type and value.
 * If the discount type is relative and the value is 100, the reduction value is "Free".
 * If the discount type is absolute, the reduction value is the discount value, with a minus sign and the currency formatted.
 * If the discount type is relative and the value is not 100, the reduction value is the discount value with a minus sign and a percentage sign.
 */
const reduction = computed(() => {
  if (
    promotion.effect.additionalData.discountType === 'relative' &&
    promotion.effect.additionalData.discountValue === 100
  ) {
    return t('promotion.free_label')
  }

  if (promotion.effect.additionalData.discountType === 'absolute') {
    return `-${formatCurrency(promotion.effect.additionalData.discountValue)}`
  }

  return `-${promotion.effect.additionalData.discountValue}%`
})
</script>
