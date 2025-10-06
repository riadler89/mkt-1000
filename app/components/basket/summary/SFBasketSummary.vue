<template>
  <div
    class="relative hidden w-2/5 border-b border-l border-gray-300 bg-gray-100 px-5 py-8 pl-13 pr-7 lg:block"
  >
    <section
      id="basket-summary-desktop"
      class="sticky top-8 flex max-w-96 flex-col gap-4 text-md leading-4"
    ></section>
  </div>

  <!--
    We need to use a Teleport to move the component to the desktop container.
    This ensures we can use different sticky behavior for desktop and mobile.
  -->
  <Teleport :disabled="!isDesktop" to="#basket-summary-desktop" defer>
    <div
      class="flex w-full flex-col gap-4 border-t border-gray-300 bg-gray-100 px-5 pb-4 pt-8 text-md leading-4 lg:border-none lg:bg-transparent lg:p-0"
    >
      <SFHeadline tag="h2" data-testid="headline">
        {{ $t('basket_summary.total') }}
      </SFHeadline>
      <div class="flex justify-between">
        <h2>{{ $t('basket_summary.subtotal') }}</h2>
        <span v-if="subtotal" data-testid="basket-price-subtotal">
          {{ formatCurrency(subtotal) }}
        </span>
      </div>
      <div class="flex justify-between">
        <h2>{{ $t('basket_summary.delivery') }}</h2>
        <span>
          {{ deliveryCostsValue }}
        </span>
      </div>
      <SFFadeInFromBottomTransition>
        <SFBasketSummaryReductions
          v-if="basket.cost.appliedReductions.length > 0"
          :basket="basket"
          :campaign="campaign"
        />
      </SFFadeInFromBottomTransition>
    </div>

    <div
      class="sticky bottom-0 z-10 flex flex-col gap-4 border-gray-300 bg-gray-100 pb-5 lg:static lg:z-auto lg:block lg:border-none lg:bg-transparent lg:pb-0"
    >
      <hr class="h-px w-full border-none bg-gray-400 lg:mb-4 lg:w-auto" />

      <SFBasketSummaryFinalSection
        :cost="basket.cost"
        :basket-items="basket.items"
        class="px-5 lg:px-0"
      />
    </div>

    <div class="bg-gray-100 px-5 pb-5 lg:bg-transparent lg:p-0">
      <SFExpressCheckout />
      <SFBasketPromotionCodes />

      <p class="pb-8 text-sm text-secondary lg:pb-0">
        {{ deliveryCostsDisclaimer }}
      </p>
    </div>
  </Teleport>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import type { BasketResponseData, Campaign } from '@scayle/storefront-nuxt'
import SFBasketPromotionCodes from '../SFBasketPromotionCodes.vue'
import SFExpressCheckout from '../SFExpressCheckout.client.vue'
import SFBasketSummaryReductions from './SFBasketSummaryReductions.vue'
import SFBasketSummaryFinalSection from './SFBasketSummaryFinalSection.vue'
import {
  SFHeadline,
  SFFadeInFromBottomTransition,
} from '#storefront-ui/components'
import { useFormatHelpers } from '#storefront/composables'
import { getTotalPriceWithoutReductions } from '#storefront-basket/utils/basket'
import { useShopConfigCustomData } from '~/composables'
import { useDefaultBreakpoints } from '#storefront-ui/composables'

const isDesktop = computed(
  () => useDefaultBreakpoints().greaterOrEqual('lg').value,
)

const { basket, campaign } = defineProps<{
  basket: BasketResponseData
  campaign?: Campaign | null
}>()
const subtotal = computed(() => getTotalPriceWithoutReductions(basket.cost))

const { formatCurrency } = useFormatHelpers()

const { deliveryCostsValue, deliveryCostsDisclaimer } =
  useShopConfigCustomData()
</script>
