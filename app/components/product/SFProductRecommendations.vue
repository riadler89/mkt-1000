<template>
  <SFBaseProductSlider
    ref="slider"
    :products="products ?? []"
    :title="title"
    :status="status"
    :slider-tabindex="-1"
  />
</template>
<script setup lang="ts">
import SFBaseProductSlider from './SFBaseProductSlider.vue'
import { useProductsByIds } from '#storefront/composables'
import { PRODUCT_TILE_WITH_PARAMS } from '~~/shared/constants'

const { productIds } = defineProps<{ title: string; productIds: number[] }>()

const { data: products, status } = useProductsByIds({
  params: { ids: productIds, with: PRODUCT_TILE_WITH_PARAMS },
})
</script>
