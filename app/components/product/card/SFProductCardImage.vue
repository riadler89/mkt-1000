<template>
  <SFLocalizedLink class="min-w-full" :to="link" raw tabindex="-1">
    <SFProductImage
      :image="image"
      :image-loading="imageLoading"
      :alt="alt"
      :preload="preload"
      sizes="xs:50vw sm:50vw md:40vw lg:33vw xl:320px"
    />
  </SFLocalizedLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ProductImage as ProductImageType } from '@scayle/storefront-nuxt'
import SFProductImage from '../SFProductImage.vue'
import { PRODUCT_CARD_IMAGE_EAGER_LOAD_SIZE } from '~~/shared/constants'
import SFLocalizedLink from '~/components/SFLocalizedLink.vue'

const { productIndex } = defineProps<{
  link: string
  image: ProductImageType
  alt: string
  productIndex: number
}>()

const imageLoading = computed(() => {
  return productIndex < PRODUCT_CARD_IMAGE_EAGER_LOAD_SIZE ? 'eager' : 'lazy'
})

const preload = computed(
  () => productIndex < PRODUCT_CARD_IMAGE_EAGER_LOAD_SIZE,
)
</script>
