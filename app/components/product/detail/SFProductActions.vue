<template>
  <div
    v-if="product.isSoldOut"
    class="rounded-xl bg-product-sold-out/10 p-4 text-md text-product-sold-out max-md:mx-5"
  >
    {{ $t('global.sold_out_long') }}
  </div>
  <div v-else class="max-md:px-5">
    <SFSiblingSelection :product="product" />
    <div class="mt-7 text-md font-semibold leading-[14px] text-primary">
      {{ $t('product_attribute.size') }}:
    </div>
    <div class="my-3 mt-4 flex h-12 items-center space-x-4">
      <SFVariantPicker
        ref="variantPicker"
        v-model="activeVariant"
        v-model:visible="isVariantListVisible"
        :variants="variants"
        :promotions="promotions"
        :has-one-variant-only="hasOneVariantOnly"
        class="grow"
      />
      <SFQuantityInput v-model="quantity" :max-quantity="maxQuantity" />
    </div>
  </div>
  <div class="flex gap-3 max-md:hidden">
    <SFButton
      variant="accent"
      size="xl"
      class="grow justify-between"
      data-testid="add-item-to-basket-button"
      :disabled="isSoldOutOrOutOfStock"
      @click="addItemToBasket(basketItem)"
    >
      <template v-if="!isSoldOutOrOutOfStock">
        {{ $t('add_to_basket.add_to_basket') }}
      </template>
      <template v-else>
        {{ $t('global.sold_out') }}
      </template>
      <template #append-icon>
        <div class="flex items-center">
          <IconPlus
            class="size-4 scale-x-0 text-white transition-transform duration-150 group-hover:scale-100"
          />
          <IconBasket class="size-5 text-white" />
        </div>
      </template>
    </SFButton>
    <SFWishlistToggle
      :product="product"
      class="!size-13 !bg-gray-200 hover:!scale-100 hover:!bg-gray-300 hover:!text-black"
    />
  </div>
  <SFProductSubscription
    v-if="isProductSubscriptionEligible(product)"
    :product="product"
    :variant="activeVariant"
    :quantity="quantity"
    class="mt-4"
    @add-item-to-basket="addItemToBasket($event)"
  />
  <Teleport to="#teleports">
    <div
      class="fixed bottom-6 z-20 flex w-full items-center gap-x-3 px-3 md:hidden"
    >
      <SFButton
        variant="accent"
        size="xl"
        class="grow justify-between"
        data-testid="add-to-basket-button-mobile"
        :disabled="isSoldOutOrOutOfStock"
        @click="addItemToBasket(basketItem)"
      >
        <div class="flex w-full justify-between">
          <template v-if="!isSoldOutOrOutOfStock">
            {{ $t('add_to_basket.add_to_basket') }}
          </template>
          <template v-else>
            {{ $t('global.sold_out') }}
          </template>
        </div>
        <template #append-icon>
          <div class="flex items-center">
            <IconPlus
              class="size-4 scale-x-0 text-white transition-transform duration-150 group-hover:scale-100"
            />
            <IconBasket class="size-5 text-white" />
          </div>
        </template>
      </SFButton>
      <SFScrollToTopButton />
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Product, Variant, Promotion } from '@scayle/storefront-nuxt'
import { useElementVisibility } from '@vueuse/core'
import SFSiblingSelection from '../SFSiblingSelection.vue'
import SFVariantPicker from '../SFVariantPicker.vue'
import SFWishlistToggle from '../SFWishlistToggle.vue'
import SFQuantityInput from '../SFQuantityInput.vue'
import SFScrollToTopButton from '~/components/SFScrollToTopButton.vue'
import { isProductSubscriptionEligible } from '#storefront-subscription/helpers/subscription'
import { SFProductSubscription } from '#storefront-subscription/components'
import { SFButton } from '#storefront-ui/components'
import {
  useProductBaseInfo,
  useBasketActions,
  useTrackingEvents,
  type AddToBasketItem,
} from '~/composables'
import { getMaxQuantity } from '~/utils'

const { product, promotions } = defineProps<{
  product: Product
  promotions?: Promotion[]
}>()

const { hasOneVariantOnly, variants, name } = useProductBaseInfo(() => product)

const activeVariant = defineModel<Variant>('activeVariant')

const quantity = ref(1)

const maxQuantity = computed(() =>
  getMaxQuantity(activeVariant.value?.stock?.quantity),
)

watch(activeVariant, () => {
  quantity.value = 1
})

const basketItem = computed<AddToBasketItem | undefined>(() => {
  if (!activeVariant.value) {
    return
  }
  return {
    productName: name.value,
    variantId: activeVariant.value?.id,
    quantity: quantity.value,
  }
})

// Add to basket
const isVariantListVisible = ref(false)
const variantPicker = ref()
const { addItem } = useBasketActions()
const { trackAddToBasket } = useTrackingEvents()

const isVariantPickerVisible = useElementVisibility(variantPicker, {
  threshold: 1,
})

const isSoldOutOrOutOfStock = computed(
  () =>
    (activeVariant.value && activeVariant.value?.stock.quantity <= 0) ||
    product.isSoldOut,
)

const addItemToBasket = async (item: AddToBasketItem | undefined) => {
  if (!activeVariant.value) {
    if (!isVariantPickerVisible.value) {
      variantPicker.value?.$el.scrollIntoView({ block: 'center' })
    }
    isVariantListVisible.value = true
    return
  }
  if (!item) {
    return
  }
  await addItem(item)
  trackAddToBasket({
    product,
    variant: activeVariant.value,
    quantity: item.quantity,
  })
}
</script>
