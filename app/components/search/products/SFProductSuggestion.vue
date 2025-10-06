<template>
  <SFSearchResultItem
    :to="getProductDetailRoute(product.id, name)"
    raw
    class="group flex items-center space-x-4 !p-1 !pr-6"
    data-testid="search-suggestions-item"
    @click="$emit('clickResult', productSuggestion)"
  >
    <div
      class="flex h-16 w-14 shrink-0 items-center overflow-hidden rounded-md bg-gray-200"
    >
      <ScayleImg v-if="image" :src="image?.hash" width="60px" />
    </div>
    <div class="grow overflow-hidden text-secondary">
      <div class="truncate text-md font-semibold">
        {{ brand }}
      </div>
      <div class="truncate text-md">
        {{ name }}
      </div>
    </div>
    <SFProductPrice :price="product.priceRange!.min" />
  </SFSearchResultItem>
</template>

<script setup lang="ts">
import type { ProductSearchSuggestion } from '@scayle/storefront-nuxt'
import SFSearchResultItem from '../SFSearchResultItem.vue'
import { ScayleImg } from '#components'
import { useProductBaseInfo, useRouteHelpers } from '~/composables'
import SFProductPrice from '~/components/product/SFProductPrice.vue'

const { productSuggestion } = defineProps<{
  productSuggestion: ProductSearchSuggestion
}>()

defineEmits<{ clickResult: [result: ProductSearchSuggestion] }>()

const product = productSuggestion.productSuggestion.product

const { getProductDetailRoute } = useRouteHelpers()
const { name, image, brand } = useProductBaseInfo(product)
</script>
