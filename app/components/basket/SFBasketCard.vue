<template>
  <li
    ref="basketCard"
    class="group space-y-2 border border-gray-300 p-3 max-lg:border-x-0 max-lg:px-0 max-lg:last:border-b-0 lg:first:rounded-t-xl lg:last:rounded-b-xl"
    data-testid="basket-card"
    tabindex="0"
    :alt="alt"
    v-bind="$attrs"
    role="link"
    @keydown.enter.self="goToPDP"
  >
    <SFBasketCardSoldOutTitle
      v-if="isSoldOut"
      class="hidden group-first:flex"
    />
    <div class="flex w-full">
      <SFBasketCardImage
        :basket-item="basketItem"
        :is-sold-out="isSoldOut"
        :campaign="campaign"
        @click="trackSelectItem(trackingItem)"
      />
      <div class="flex w-full flex-col overflow-hidden">
        <div class="ml-5 flex justify-between gap-1">
          <div data-testid="basket-product-brand" class="overflow-hidden">
            <div
              class="mt-3.5 truncate px-1 text-md font-medium leading-none text-primary"
              data-testid="main-label"
            >
              {{ brand }}
            </div>
            <SFLocalizedLink
              v-if="link"
              :to="link"
              raw
              tabindex="-1"
              class="mt-1 block truncate rounded px-1 py-px text-md font-normal text-primary duration-300 hover:bg-gray-200"
              data-testid="sub-label"
              @click="trackSelectItem(trackingItem)"
            >
              {{ name }}
            </SFLocalizedLink>
          </div>
          <div class="flex gap-x-2 max-lg:mt-3 lg:items-center">
            <SFQuantityInput
              :model-value="basketItem.quantity"
              :max-quantity="getMaxQuantity(basketItem.availableQuantity)"
              :disabled="isSoldOut"
              class="max-lg:hidden"
              :class="{
                invisible: isSoldOut,
              }"
              @update:model-value="$emit('update:quantity', $event)"
            />
            <SFButton
              variant="raw"
              class="size-11 rounded-lg outline-offset-0 hover:bg-gray-300 focus-visible:shadow-inner-solid-sm max-lg:bg-gray-300 lg:size-8"
              data-testid="basket-remove-item-button"
              :aria-label="$t('basket_card.confirm_removal')"
              @click="$emit('delete')"
            >
              <IconTrash class="size-4 shrink-0 stroke-2" />
            </SFButton>
          </div>
        </div>
        <div class="flex grow flex-col lg:justify-between">
          <SFBasketCardDetails :item="basketItem" class="mt-7 pl-6" />
          <div class="flex w-full justify-between">
            <SFBasketCardSubscriptionData
              class="mt-4 pl-6 max-lg:hidden"
              :basket-item="basketItem"
            />
            <SFProductPrice
              :price="price"
              :campaign="campaign"
              class="ml-auto max-lg:hidden"
              data-testid="basket-card-prices"
              :lowest-prior-price="basketItem?.lowestPriorPrice"
              :promotions="basketItem.promotions"
              :inline="false"
            />
          </div>
        </div>
      </div>
    </div>

    <SFBasketCardSubscriptionData class="lg:hidden" :basket-item="basketItem" />
    <div class="flex items-start justify-between lg:hidden">
      <SFQuantityInput
        :model-value="basketItem.quantity"
        :max-quantity="getMaxQuantity(basketItem.availableQuantity)"
        :disabled="isSoldOut"
        :class="{
          invisible: isSoldOut,
        }"
        @update:model-value="$emit('update:quantity', $event)"
      />
      <SFProductPrice
        :price="price"
        :campaign="campaign"
        :lowest-prior-price="basketItem?.lowestPriorPrice"
        :promotions="basketItem.promotions"
        class="self-end lg:hidden"
        data-testid="basket-card-prices"
        :inline="false"
      />
    </div>
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { BasketItem, Campaign } from '@scayle/storefront-nuxt'
import SFBasketCardDetails from './SFBasketCardDetails.vue'
import SFBasketCardImage from './SFBasketCardImage.vue'
import SFBasketCardSoldOutTitle from './SFBasketCardSoldOutTitle.vue'
import { SFBasketCardSubscriptionData } from '#storefront-subscription/components'
import SFQuantityInput from '~/components/product/SFQuantityInput.vue'
import SFProductPrice from '~/components/product/SFProductPrice.vue'
import SFLocalizedLink from '~/components/SFLocalizedLink.vue'
import {
  useProductBaseInfo,
  useRouteHelpers,
  useTrackingEvents,
} from '~/composables'
import SFButton from '~~/modules/ui/runtime/components/core/SFButton.vue'
import { getMaxQuantity } from '~/utils'
import type { TrackSelectItemEventParams } from '~~/types/tracking'
import { basketListingMetaData } from '~~/shared/constants'
import { useRoute } from '#app'

defineOptions({ inheritAttrs: false })

const { basketItem, campaign } = defineProps<{
  /** The basket item to display. */
  basketItem: BasketItem
  /** The campaign to display. */
  campaign?: Campaign | null
}>()

const route = useRoute()

const { alt, brand, name, link } = useProductBaseInfo(basketItem.product)

const isSoldOut = computed(() => basketItem.status !== 'available')
const price = computed(() => basketItem.price.total)

const { trackSelectItem } = useTrackingEvents()

const { getProductDetailRoute, localizedNavigateTo } = useRouteHelpers()

const trackingItem = computed<TrackSelectItemEventParams>(() => ({
  product: basketItem.product,
  variant: basketItem.variant,
  quantity: basketItem.quantity,
  soldOut: isSoldOut.value,
  listingMetaData: basketListingMetaData,
  pagePayload: {
    content_name: route.fullPath,
    page_type: 'basket',
    page_type_id: '',
  },
}))

const goToPDP = async () => {
  const route = getProductDetailRoute(basketItem.product.id, name.value)
  trackSelectItem(trackingItem.value)
  await localizedNavigateTo(route)
}

defineEmits<{
  delete: []
  'update:quantity': [newQuantity: number]
}>()
</script>
