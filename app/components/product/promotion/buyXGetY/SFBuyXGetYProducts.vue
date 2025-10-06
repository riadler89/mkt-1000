<template>
  <div class="rounded-xl border">
    <div
      class="mb-3 rounded-xl px-5 py-3"
      :style="{
        ...colorStyle,
        stroke: colorStyle.color,
      }"
    >
      <div class="flex gap-1">
        <IconGift class="size-4" />
        <SFHeadline tag="h2" size="md" is-bold data-testid="headline">
          {{ $t('buy_x_get_y_products.headline') }}
        </SFHeadline>
      </div>

      <p class="mt-1 text-sm">
        {{ $t('buy_x_get_y_products.description') }}
      </p>
    </div>
    <div class="flex flex-col">
      <div v-for="(item, index) in products" :key="item.id">
        <SFBuyXGetYProduct
          :color-style="colorStyle"
          :eager-image-loading="index < 2"
          :product="item"
          :promotion="promotion"
          :data-testid="`buy-x-get-y-item-${item.id}`"
          :disabled="item.isSoldOut"
          :class="{ 'border-t': index !== 0 }"
          @select-item="onSelectItem"
        />
      </div>
    </div>
    <SFProductPromotionSelectionModal
      v-if="selectedItem"
      :visible="isModalOpen"
      :product="selectedItem"
      :promotion="promotion"
      :color-style="colorStyle"
      @update:visible="onSelectionModalVisibilityChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import type {
  Product,
  Promotion,
  BuyXGetYEffect,
} from '@scayle/storefront-nuxt'
import SFProductPromotionSelectionModal from '../SFProductPromotionSelectionModal.client.vue'
import SFBuyXGetYProduct from './SFBuyXGetYProduct.vue'
import { SFHeadline } from '#storefront-ui/components'
import { IconGift } from '#components'
import { usePromotionGifts } from '#storefront-promotions/composables'
import { usePromotionCustomData } from '~/composables'

const { promotion } = defineProps<{
  promotion: Promotion<BuyXGetYEffect>
}>()

const selectedItem = ref<Product>()
const isModalOpen = ref(false)

const onSelectItem = async (item: Product) => {
  selectedItem.value = item
  // wait until the next tick to avoid showing an previous gift initially
  await nextTick()
  isModalOpen.value = true
}
const onSelectionModalVisibilityChange = (isVisible: boolean) => {
  isModalOpen.value = isVisible
}

const { products } = usePromotionGifts(
  promotion,
  `buy-x-get-y-products-${promotion.id}`,
)
const { colorStyle } = usePromotionCustomData(promotion)
</script>
