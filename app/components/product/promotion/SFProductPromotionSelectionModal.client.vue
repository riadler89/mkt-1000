<template>
  <SFModal
    :visible="isGiftSelectionShown"
    class="!rounded-t-xl !p-0 max-md:m-0 max-md:mt-auto max-md:max-h-[calc(100vh-40px)] max-md:w-full max-md:max-w-screen md:max-w-[800px] md:!rounded-xl"
    data-testid="promo-product-selection-modal"
    :transition-component="SFSlideInFromBottomTransition"
    appear
    @update:visible="(open) => open || close()"
  >
    <div class="flex">
      <div class="hidden p-3 md:block">
        <div class="relative overflow-hidden rounded-xl bg-gray-300">
          <ProductImage
            v-if="image"
            :image="image"
            :alt="alt"
            sizes="700px"
            class="min-h-96 min-w-full"
          />
          <SFWishlistToggle class="absolute right-5 top-5" :product="product" />
        </div>
      </div>
      <div class="flex w-full flex-col justify-center p-6 md:p-8 md:py-14">
        <div class="mb-4 md:mb-auto">
          <span class="font-semibold text-primary">
            {{ brand }}
          </span>
          <SFHeadline
            data-testid="pdp-product-name"
            tag="h3"
            class="mb-4 text-md !font-normal text-secondary"
          >
            {{ name }}
          </SFHeadline>
          <SFReductionBadge :promotion="promotion" />
        </div>
        <div
          class="relative mb-8 overflow-hidden rounded-xl bg-gray-300 md:hidden"
        >
          <ProductImage
            v-if="image"
            :image="image"
            :alt="alt"
            sizes="500px"
            :aspect-ratio="[1, 1]"
          />
          <SFWishlistToggle class="absolute right-5 top-5" :product="product" />
        </div>
        <div class="flex flex-col gap-4">
          <div class="mt-7 text-md font-semibold leading-[14px] text-primary">
            {{ $t('product_attribute.size') }}:
          </div>
          <SFVariantPicker
            ref="variantPicker"
            v-model="activeVariant"
            v-model:visible="isVariantListVisible"
            :has-one-variant-only="hasOneVariantOnly"
            :variants="giftVariants"
            strike-through-price
            class="md:mb-4"
            :custom-badge-promotion="promotion"
          />

          <div class="flex justify-between gap-2">
            <SFButton
              data-testid="add-item-to-basket-button"
              variant="accent"
              :disabled="product.isSoldOut"
              :title="
                product.isSoldOut
                  ? $t('global.sold_out')
                  : $t('add_to_basket.add_to_basket')
              "
              :loading="status === 'pending'"
              class="w-full flex-[4] justify-between !px-4"
              @click="addToBasket"
            >
              {{
                product.isSoldOut
                  ? $t('global.sold_out')
                  : $t('add_to_basket.add_to_basket')
              }}
              <template #append-icon>
                <div class="flex items-center">
                  <IconPlus class="size-6 text-white" />
                </div>
              </template>
            </SFButton>
            <SFButton
              variant="tertiary"
              :to="getProductDetailRoute(product.id, name)"
              class="flex-1 !border-gray-400"
              @click="selectItem(product)"
            >
              {{ $t('product_promotion_selection_modal.details') }}
            </SFButton>
          </div>
        </div>
      </div>
    </div>
  </SFModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type {
  Product,
  Promotion,
  BuyXGetYEffect,
} from '@scayle/storefront-nuxt'
import { useElementVisibility } from '@vueuse/core'
import SFWishlistToggle from '../SFWishlistToggle.vue'
import ProductImage from '../SFProductImage.vue'
import SFVariantPicker from '../SFVariantPicker.vue'
import SFReductionBadge from './SFReductionBadge.vue'
import {
  usePageState,
  useProductBaseInfo,
  usePromotionGiftSelection,
  useRouteHelpers,
  useTrackingEvents,
} from '~/composables'
import { useRoute } from '#app/composables/router'
import {
  SFButton,
  SFHeadline,
  SFModal,
  SFSlideInFromBottomTransition,
} from '#storefront-ui/components'
import type { PromotionStyle } from '~/utils'

const { product, promotion } = defineProps<{
  product: Product
  promotion: Promotion<BuyXGetYEffect>
  colorStyle: PromotionStyle
}>()

const isGiftSelectionShown = defineModel('visible', {
  type: Boolean,
  default: false,
})

const { getProductDetailRoute } = useRouteHelpers()
const { trackSelectItem } = useTrackingEvents()
const route = useRoute()
const { pageState } = usePageState()

const { status, activeVariant, giftVariants, addItemToBasket } =
  usePromotionGiftSelection(() => product)

const { name, brand, image, hasOneVariantOnly, alt } = useProductBaseInfo(
  () => product,
)

const selectItem = (product: Product) => {
  trackSelectItem({
    product,
    pagePayload: {
      content_name: route.fullPath,
      page_type: pageState.value.type,
      page_type_id: route.params.id?.toString() || '',
    },
  })
}

const isVariantListVisible = ref(false)
const variantPicker = ref()
const isVariantPickerVisible = useElementVisibility(variantPicker, {
  threshold: 1,
})

const addToBasket = async () => {
  if (!activeVariant.value) {
    if (!isVariantPickerVisible.value) {
      variantPicker.value?.$el.scrollIntoView({ block: 'center' })
    }
    isVariantListVisible.value = true
    return
  }
  isGiftSelectionShown.value = false
  await addItemToBasket(promotion.id)
}

const close = () => {
  if (!hasOneVariantOnly.value) {
    activeVariant.value = undefined
  }
  isGiftSelectionShown.value = false
}
</script>
