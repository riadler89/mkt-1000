<template>
  <div class="flex w-full p-3" data-testid="product-promotion-gift-item">
    <div class="relative flex shrink-0 items-center rounded-lg bg-gray-300">
      <SFProductImage
        v-if="image"
        :image="image"
        :alt="alt"
        :image-loading="eagerImageLoading ? 'eager' : 'lazy'"
        sizes="92px"
        :aspect-ratio="[1, 1]"
        class="size-24"
        :class="{ 'opacity-20': disabled }"
      />
    </div>
    <div class="flex w-full flex-row items-center justify-between p-3">
      <div class="flex h-full flex-col justify-between">
        <div>
          <div
            class="text-sm font-semibold"
            :class="disabled ? 'text-secondary' : 'text-primary'"
          >
            {{ brand }}
          </div>
          <SFHeadline
            size="lg"
            data-testid="pdp-product-name"
            tag="h3"
            class="text-sm !font-normal"
            :class="disabled ? 'text-secondary' : 'text-primary'"
          >
            {{ name }}
          </SFHeadline>
        </div>
        <div v-if="!product.isSoldOut" class="flex flex-row items-end gap-2">
          <SFReductionBadge
            class="flex h-full items-center"
            :promotion="promotion"
          />
          <SFProductPrice
            v-if="price"
            :class="{ disabled: 'opacity-50' }"
            :price="price"
            :promotions="[promotion]"
            strike-through-price
            :show-badges="false"
          />
        </div>
        <div v-else class="text-sm text-product-sold-out">
          {{ $t('global.sold_out') }}
        </div>
      </div>
      <div class="flex items-end justify-between">
        <SFButton
          size="sm"
          variant="raw"
          class="size-11 rounded-xl bg-gray-300"
          data-testid="add-free-product-button"
          :disabled="disabled"
          :aria-label="$t('buy_x_get_y_products.a11y.add_item', { name })"
          @click="$emit('selectItem', product)"
        >
          <IconPlus class="size-6" />
        </SFButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type {
  Product,
  Promotion,
  BuyXGetYEffect,
} from '@scayle/storefront-nuxt'
import SFProductPrice from '../../SFProductPrice.vue'
import SFProductImage from '../../SFProductImage.vue'
import SFReductionBadge from '../SFReductionBadge.vue'
import { useProductBaseInfo } from '~/composables'
import { SFButton, SFHeadline } from '#storefront-ui/components'
import type { PromotionStyle } from '~/utils'

const {
  disabled = false,
  product,
  promotion,
} = defineProps<{
  product: Product
  promotion: Promotion<BuyXGetYEffect>
  colorStyle: PromotionStyle
  eagerImageLoading: boolean
  disabled?: boolean
}>()
defineEmits<{
  selectItem: [product: Product]
}>()

const { name, image, price, brand, alt } = useProductBaseInfo(() => product)
</script>
