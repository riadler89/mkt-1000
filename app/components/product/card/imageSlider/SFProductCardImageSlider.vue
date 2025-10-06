<template>
  <SFItemsSlider
    ref="productImageSlider"
    class="size-full"
    :with-arrows="areArrowsShown"
    tabindex="-1"
    :slider-tabindex="-1"
    :scrollable="imagesScrollable"
  >
    <template #prev-button="{ prev, isPrevEnabled }">
      <SFSliderArrowButton
        class="absolute top-[40%] bg-white hover:bg-white"
        :aria-label="$t('image_slider.a11ly.go_to_previous_image')"
        :disabled="!isPrevEnabled"
        direction="left"
        translate-on-hover
        data-testid="image-slider-prev-button"
        @click="prev()"
      />
    </template>
    <template #next-button="{ next, isNextEnabled }">
      <SFSliderArrowButton
        class="absolute top-[40%] bg-white hover:bg-white"
        :aria-label="$t('image_slider.a11ly.go_to_next_image')"
        :disabled="!isNextEnabled"
        direction="right"
        translate-on-hover
        data-testid="image-slider-next-button"
        @click="next()"
      />
    </template>
    <SFLink
      v-for="(item, imageIndex) in images"
      :key="item.hash"
      :to="link"
      raw
      class="relative min-w-full snap-start snap-always"
      tabindex="-1"
    >
      <SFProductImage
        v-if="item"
        :image="item"
        :alt="
          $t('product_image.alt_with_image_index', {
            alt,
            index: imageIndex + 1,
            total: images.length,
          })
        "
        :image-loading="getImageLoading(imageIndex)"
        :preload="shouldPreload(imageIndex)"
        sizes="xs:50vw sm:50vw md:40vw lg:33vw xl:320px"
      />
    </SFLink>
  </SFItemsSlider>
</template>

<script setup lang="ts">
import type { ProductImage as ProductImageType } from '@scayle/storefront-nuxt'
import { computed, useTemplateRef } from 'vue'
import SFProductImage from '../../SFProductImage.vue'
import { PRODUCT_CARD_IMAGE_EAGER_LOAD_SIZE } from '~~/shared/constants'
import { SFItemsSlider, SFLink } from '#storefront-ui/components'
import SFSliderArrowButton from '~~/modules/ui/runtime/components/core/SFSliderArrowButton.vue'

const { isProductHovered, images, productIndex } = defineProps<{
  link: string
  isProductHovered: boolean
  alt: string
  images: ProductImageType[]
  productIndex: number
  imagesScrollable: boolean
}>()

const slider = useTemplateRef('productImageSlider')
const scrollImageIntoView = (
  index: number,
  scrollBehavior: ScrollBehavior = 'auto',
) => {
  slider.value?.scrollImageIntoView(index, scrollBehavior)
}

defineExpose({
  scrollImageIntoView,
})

const areArrowsShown = computed(() => {
  if (import.meta.server) {
    return false
  }
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
  return !isTouchDevice && isProductHovered && images.length > 1
})

const getImageLoading = (index: number) => {
  const shouldEagerLoad = productIndex < PRODUCT_CARD_IMAGE_EAGER_LOAD_SIZE
  return shouldEagerLoad && index === 0 ? 'eager' : 'lazy'
}

const shouldPreload = (index: number) => {
  const shouldPreload = productIndex < PRODUCT_CARD_IMAGE_EAGER_LOAD_SIZE
  return shouldPreload && index === 0
}
</script>
