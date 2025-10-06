<template>
  <ul class="flex flex-col gap-1 text-sm font-medium leading-4">
    <li
      v-if="campaignReduction && campaign"
      class="flex h-7 items-center justify-between gap-1.5 rounded-md px-2"
      :style="getCampaignStyle(campaign)"
    >
      <span>
        {{ getCampaignHeadline(campaign) }}
      </span>
      <span class="leading-3" data-testid="basket-discount-campaign">
        {{
          formatCurrency(-Math.abs(campaignReduction.amount.absoluteWithTax))
        }}
      </span>
    </li>
    <li
      v-for="{ promotion, total } in validPromotions"
      :key="promotion?.id"
      class="flex h-7 items-center justify-between gap-1.5 rounded-md px-2"
      data-testid="basket-summary-promotion-item"
      :style="getPromotionStyle(promotion)"
    >
      <span v-if="promotion?.customData">
        {{ getHeadlineParts(promotion) }}
      </span>
      <span class="leading-3" data-testid="basket-discount-promotion">
        {{ formatCurrency(-Math.abs(total)) }}
      </span>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type {
  BasketResponseData,
  Campaign,
  Promotion,
} from '@scayle/storefront-nuxt'
import { computed } from 'vue'
import { useFormatHelpers } from '#storefront/composables'
import { getCampaignStyle, getPromotionStyle } from '~/utils'
import type { PromotionReductionItem } from '#storefront-promotions/composables'

const {
  validPromotions: validPromotions = [],
  basket,
  campaign,
} = defineProps<{
  basket: BasketResponseData
  validPromotions?: PromotionReductionItem[]
  campaign?: Campaign | null
}>()

const getHeadlineParts = (promotion: Promotion): string => {
  return promotion.displayName || promotion.name
}

const getCampaignHeadline = (campaign: Campaign): string => {
  return campaign.headline || campaign.name
}

const campaignReduction = computed(() => {
  return basket.cost.appliedReductions.find(
    (reduction) => reduction.category === 'campaign',
  )
})

const { formatCurrency } = useFormatHelpers()
</script>
