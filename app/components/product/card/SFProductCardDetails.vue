<template>
  <div class="relative min-h-36 md:min-h-24">
    <div class="relative w-full overflow-hidden md:h-[4.5rem]">
      <div
        class="mt-2 block transition-all delay-0 duration-200 ease-in transition-discrete group-hover/product-card:block group-hover/product-card:translate-y-0 group-hover/product-card:opacity-100 group-hover/product-card:delay-100 group-hover/product-card:starting:translate-y-4 group-hover/product-card:starting:opacity-0 md:mt-3 md:hidden md:translate-y-4 md:opacity-0"
      >
        <SFProductCardSiblingsPicker
          :product="product"
          :siblings="nonSoldOutSiblings"
          :limit="2"
        />
      </div>
      <div
        class="mt-3 flex flex-col opacity-100 transition-all delay-100 duration-200 ease-in transition-discrete group-hover/product-card:delay-0 loaded:starting:opacity-0 max-md:mb-4 md:absolute md:inset-0 md:mt-4 group-hover/product-card:md:hidden group-hover/product-card:md:opacity-0"
      >
        <p
          data-testid="product-card-product-brand"
          class="mb-2.5 truncate text-md font-semibold text-primary"
        >
          {{ brand }}
        </p>
        <p
          data-testid="product-card-product-name"
          class="truncate text-sm text-secondary"
        >
          {{ name }}
        </p>
      </div>
    </div>
    <SFProductPrice
      v-if="price"
      :promotions="promotions"
      :campaign="campaign"
      :price="price"
      :lowest-prior-price="lowestPriorPrice"
      :show-price-from="showPriceFrom"
      class="left-2 md:left-0"
    />
  </div>
</template>

<script setup lang="ts">
import type { Product, Campaign } from '@scayle/storefront-nuxt'
import { computed } from 'vue'
import SFProductPrice from '../SFProductPrice.vue'
import SFProductCardSiblingsPicker from './siblings/SFProductCardSiblingsPicker.vue'
import { useProductBaseInfo } from '~/composables'
import { getPromotionsForProduct } from '~/utils'
import { useCurrentPromotions } from '#storefront/composables'

const { product, campaign } = defineProps<{
  product: Product
  campaign?: Campaign | null
}>()

const { brand, name, price, lowestPriorPrice, nonSoldOutSiblings } =
  useProductBaseInfo(() => product)

const showPriceFrom = computed(
  () => product.priceRange?.min.withTax !== product.priceRange?.max.withTax,
)

const promotionData = useCurrentPromotions()

const promotions = computed(() => {
  return getPromotionsForProduct(
    product,
    promotionData.data?.value?.entities ?? [],
  )
})
</script>
