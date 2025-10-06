<template>
  <div
    class="flex flex-wrap items-center gap-1"
    :class="{ 'flex-col !items-end justify-end': !inline }"
  >
    <div
      v-if="showBadges && appliedReductions.length"
      class="flex flex-wrap gap-1"
    >
      <span
        v-for="(reduction, index) in appliedReductions"
        :key="`${reduction.amount.relative}-badge-${reduction.category}-${index}`"
        class="mr-1 inline-block rounded bg-product-sale px-1 text-sm font-semibold text-white"
        :style="
          (reduction.category === 'promotion' &&
            getPromotionStyleById(reduction.promotionId)) ||
          (reduction.category === 'campaign' && campaignStyle)
        "
      >
        {{ getReduction(reduction) }}
      </span>
    </div>
    <p class="text-primary" :class="classes" data-testid="price">
      <span
        :class="{
          'text-secondary line-through': strikeThroughPrice,
          'text-product-sale': appliedReductions.length && !strikeThroughPrice,
        }"
      >
        <template v-if="showPriceFrom">
          {{ $t('price.starting_from') }}
        </template>
        {{ formatCurrency(totalPrice) }}
      </span>
      <span
        v-for="(reduction, index) in strikeThroughPrices"
        :key="`${reduction}-${index}`"
        class="mx-1 font-normal text-secondary line-through last-of-type:mr-0"
        data-testid="initialProductPrice"
      >
        {{ formatCurrency(reduction) }}
      </span>
    </p>

    <sup
      v-if="showTaxInfo"
      class="ml-1 text-right text-sm text-secondary md:text-left"
      data-testid="tax-info"
    >
      {{ $t('global.including_vat') }}
    </sup>
    <div
      v-if="
        lowestPriorPrice?.withTax &&
        lowestPriorPrice?.relativeDifferenceToPrice !== null
      "
      class="mt-1 w-full text-sm text-secondary"
      :class="{ 'text-end': !inline }"
      data-testid="lowest-prior-price"
    >
      {{ $t('price.30_day_best_price') }}
      {{ formatCurrency(lowestPriorPrice.withTax) }}
      ({{
        formatPercentage(lowestPriorPrice.relativeDifferenceToPrice, {
          signDisplay: 'exceptZero',
        })
      }})
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type {
  LowestPriorPrice,
  Price,
  Promotion,
  Campaign,
  AppliedReduction,
} from '@scayle/storefront-nuxt'
import { Size } from '#storefront-ui'
import { getPromotionStyle, getCampaignStyle } from '~/utils'
import {
  useFormatHelpers,
  useProductPrice,
  type BasketItemPrice,
} from '#storefront/composables'
import type { OrderPrice } from '~~/types/order'
import { useI18n } from '#i18n'

const {
  showTaxInfo = false,
  showPriceFrom = false,
  showBadges = true,
  size = Size.MD,
  type = 'normal',
  promotions = undefined,
  campaign = undefined,
  price,
  inline = true,
  lowestPriorPrice = undefined,
  strikeThroughPrice = false,
} = defineProps<{
  price: Price | BasketItemPrice | OrderPrice
  lowestPriorPrice?: LowestPriorPrice
  promotions?: Promotion[] | null
  campaign?: Campaign | null
  showTaxInfo?: boolean
  showPriceFrom?: boolean
  showBadges?: boolean
  size?: Size
  type?: 'normal' | 'whisper' | 'loud'
  inline?: boolean
  strikeThroughPrice?: boolean
}>()

const { appliedReductions, strikeThroughPrices, totalPrice } = useProductPrice(
  () => price,
)

const { formatCurrency, formatPercentage } = useFormatHelpers()
const { t } = useI18n()

const getPromotionStyleById = (promotionId?: string) => {
  const promotion = promotions?.find(
    (promotion) => promotion.id === promotionId,
  )
  return getPromotionStyle(promotion)
}

/**
 * Determines the reduction display value based on its type:
 * - Relative: shown as a percentage.
 *   - If the value is `1`, a "Free" label is displayed.
 * - Absolute: shown as a currency value.
 *
 * @param reduction - The reduction to get the value from.
 * @returns The reduction value.
 */
const getReduction = (reduction: AppliedReduction) => {
  switch (reduction.type) {
    case 'relative':
      return reduction.amount.relative === 1
        ? t('promotion.free_label')
        : `-${formatPercentage(reduction.amount.relative)}`
    case 'absolute':
      return `-${formatCurrency(reduction.amount.absoluteWithTax)}`
    default:
      return `-${formatCurrency(reduction.amount.absoluteWithTax)}`
  }
}

const campaignStyle = computed(() => getCampaignStyle(campaign))
const classes = computed(() => ({
  'text-xl': size === Size.XL,
  'text-lg': size === Size.LG,
  'text-sm': size === Size.SM,
  'text-md': size === Size.MD,
  'font-bold': type === 'loud',
  'font-semibold': type === 'whisper',
  'font-normal': type === 'normal',
  'text-end': !inline,
}))
</script>
