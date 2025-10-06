<template>
  <section class="flex flex-col gap-4 text-md font-semibold leading-4">
    <ul class="flex flex-col gap-4">
      <template
        v-for="reduction in basket.cost.appliedReductions"
        :key="reduction.category"
      >
        <li
          v-if="
            reduction.category !== 'promotion' &&
            reduction.category !== 'campaign'
          "
          class="flex justify-between text-product-sale"
        >
          <h2>{{ getReductionCategory(reduction) }}</h2>
          <span :data-testid="`basket-discount-${reduction.category}`">
            {{ formatCurrency(-Math.abs(reduction.amount.absoluteWithTax)) }}
          </span>
        </li>
      </template>
    </ul>
    <SFBasketSummaryPromotions :basket="basket" :campaign="campaign" />
  </section>
</template>

<script lang="ts" setup>
import type {
  AppliedReduction,
  BasketResponseData,
  Campaign,
} from '@scayle/storefront-nuxt'
import SFBasketSummaryPromotions from './promotions/SFBasketSummaryPromotions.vue'
import { useI18n } from '#i18n'
import { useFormatHelpers } from '#storefront/composables'

const { formatCurrency } = useFormatHelpers()

const { basket, campaign } = defineProps<{
  basket: BasketResponseData
  campaign?: Campaign | null
}>()

const { t } = useI18n()

const getReductionCategory = (reduction: AppliedReduction) => {
  switch (reduction.category) {
    case 'voucher':
      return t('basket_summary_reduction.voucher')
    case 'sale':
      return t('basket_summary_reduction.sale')
  }
}
</script>
