<template>
  <SFBaseProductSlider
    v-if="products.length"
    ref="slider"
    :products="products"
    :title="$t('recentlyViewedProductsSlider.title')"
    :status="status"
    :slider-tabindex="-1"
  />
</template>
<script setup lang="ts">
import { nextTick, useTemplateRef, watch } from 'vue'
import SFBaseProductSlider from './SFBaseProductSlider.vue'
import { useRecentlyViewedProducts } from '#storefront-product-detail/composables'

const { products, status } = useRecentlyViewedProducts()

const sliderRef = useTemplateRef('slider')
watch(products, async () => {
  await nextTick()
  sliderRef.value?.scrollImageIntoView(0)
})
</script>
