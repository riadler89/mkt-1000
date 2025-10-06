<template>
  <div class="flex w-full flex-col space-y-5 py-2">
    <div>
      <div class="mb-1.5 text-sm text-secondary">
        {{ $t('subscription.interval') }}
      </div>
      <SFDropdown
        id="subscription-interval-selection-dropdown"
        v-model="selectedInterval"
        class="w-full"
        :items="subscriptionIntervals"
      >
        <template #default>
          {{ selectedInterval?.label }}
        </template>
        <template #item="{ item, selectItem }">
          <SFButton
            :key="JSON.stringify(item)"
            variant="raw"
            is-full-width
            class="inline !justify-start px-4 py-2 text-sm text-secondary first-of-type:rounded-t-lg last-of-type:rounded-b-lg hover:bg-gray-300 focus-visible:shadow-inner-solid-sm active:bg-gray-400"
            @keydown.enter="selectItem(item)"
            @click="selectItem(item)"
          >
            {{ item?.label }}
          </SFButton>
        </template>
      </SFDropdown>
    </div>
    <div>
      <div class="mb-1.5 text-sm text-secondary">
        {{ $t('subscription.follow_up_delivery') }}
      </div>
      <SFDropdown
        id="subscription-prefered-date-selection-dropdown"
        v-model="selectedPreferredDeliveryDate"
        class="w-full"
        :items="preferredDeliveryDate"
      >
        <template #default>
          {{
            $t('subscription.day_of_month_selection_caption', {
              dayOfMonth:
                selectedPreferredDeliveryDate?.day +
                _getOrdinalSuffix(ordinalSuffixKey),
            })
          }}
        </template>
        <template #item="{ item, selectItem }">
          <SFButton
            :key="JSON.stringify(item)"
            variant="raw"
            is-full-width
            class="block cursor-pointer !justify-start px-4 py-2 text-sm text-secondary first-of-type:rounded-t-lg last-of-type:rounded-b-lg hover:bg-gray-300 focus-visible:shadow-inner-solid-sm active:bg-gray-400"
            @keydown.enter="selectItem(item)"
            @click="selectItem(item)"
          >
            {{
              $t('subscription.day_of_month_selection_caption', {
                dayOfMonth:
                  item?.day +
                  _getOrdinalSuffix(getOrdinalSuffixKey(locale, item?.day)),
              })
            }}
          </SFButton>
        </template>
      </SFDropdown>
    </div>
    <SFButton
      variant="accent"
      data-testid="add-item-to-basket-button-subscribe"
      size="xl"
      :disabled="!subscriptionState.isEligible || product.isSoldOut"
      @click="$emit('addItemToBasket', itemToAdd)"
    >
      {{
        $t('product_subscription.add_to_basket', {
          interval: selectedInterval?.label,
        })
      }}
    </SFButton>
  </div>
</template>
<script setup lang="ts">
import { computed, watch } from 'vue'
import type { Product, Variant } from '@scayle/storefront-nuxt'
import { useSubscription } from '../composables/useSubscription'
import type { PreferredDeliveryDate } from '../helpers/subscription'
import { getOrdinalSuffixKey, ORDINAL_INDEX_MAP } from '../helpers/subscription'
import type { AddToBasketItem } from '~/composables'
import { SFButton, SFDropdown } from '#storefront-ui/components'
import { useCurrentShop } from '#storefront/composables'
import { useI18n } from '#i18n'

const { product, variant, preferredDeliveryDate, pricePromotionKey, quantity } =
  defineProps<{
    product: Product
    variant?: Variant
    preferredDeliveryDate: PreferredDeliveryDate[]
    pricePromotionKey: string
    quantity: number
  }>()

defineEmits<{ addItemToBasket: [item?: AddToBasketItem] }>()
const i18n = useI18n()
const currentShop = useCurrentShop()

const locale = computed(() => {
  return currentShop.value.locale
})

const {
  subscriptionIntervals,
  selectedInterval,
  itemToAdd,
  selectedPreferredDeliveryDate,
  subscriptionVariantEligible,
  ordinalSuffixKey,
} = await useSubscription(
  () => product,
  () => pricePromotionKey,
  () => variant,
  () => quantity,
  'product-subscription-selection.vue',
)

const _getOrdinalSuffix = (key?: string) => {
  const index = ORDINAL_INDEX_MAP[key || 'other'] ?? 0
  return i18n.t('global.ordinal_suffix', index)
}

const subscriptionState = computed(() => ({
  isInitial: !variant,
  isEligible: !!variant && subscriptionVariantEligible.value,
}))

watch(
  () => subscriptionIntervals.value,
  () => {
    if (!subscriptionIntervals.value.length) {
      selectedInterval.value = undefined
      return
    }

    const selectedIntervalIsInvalid = !subscriptionIntervals.value.some(
      (interval) => interval.value === selectedInterval.value,
    )

    selectedInterval.value = selectedIntervalIsInvalid
      ? subscriptionIntervals.value[0]
      : selectedInterval.value
  },
  { immediate: true },
)
</script>
