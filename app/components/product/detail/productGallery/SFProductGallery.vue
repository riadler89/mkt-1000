<template>
  <div
    class="grid w-full grid-cols-[fit-content(100%)_minmax(auto,_528px)] grid-rows-[fit-content(0)] max-md:grid-cols-1 max-md:grid-rows-1"
    data-testid="product-gallery"
  >
    <SFItemsSlider
      with-arrows
      mode="vertical"
      class="mr-4 w-24 shrink-0 max-md:hidden"
      data-testid="product-thumbnails"
    >
      <div
        v-for="(productThumbnail, index) in images"
        :key="productThumbnail.hash"
        :data-testid="`product-thumbnail-${index}`"
        class="my-2 w-24 shrink-0 cursor-pointer overflow-hidden rounded-md bg-gray-100 first:mt-0 last:mb-0"
        :class="index === activeSlide ? 'bg-primary/10' : 'bg-gray-100'"
        tabindex="-1"
        @mouseenter="scrollImageIntoView(index)"
        @click="isZoomModalOpen = true"
      >
        <SFProductImage
          :image="productThumbnail"
          :alt="
            $t('product_image.alt_with_image_index', {
              alt,
              index: index + 1,
              total: images.length,
            })
          "
          sizes="96px"
        />
      </div>
      <template #prev-button="{ prev, isPrevEnabled }">
        <button
          class="absolute left-1/2 top-2 size-8 -translate-x-1/2 rounded-md bg-white/85 p-1 text-secondary hover:text-primary disabled:hidden"
          :aria-label="$t('image_slider.a11ly.go_to_previous_image')"
          :disabled="!isPrevEnabled"
          @click="prev()"
        >
          <IconChevronUp class="size-6 p-0.5" />
        </button>
      </template>
      <template #next-button="{ next, isNextEnabled }">
        <button
          class="absolute bottom-2 left-1/2 size-8 -translate-x-1/2 rounded-md bg-white/85 p-1 text-secondary hover:text-primary disabled:hidden"
          :aria-label="$t('image_slider.a11ly.go_to_next_image')"
          :disabled="!isNextEnabled"
          @click="next()"
        >
          <IconChevronDown class="size-6 p-0.5" />
        </button>
      </template>
    </SFItemsSlider>
    <div class="relative">
      <SFItemsSlider
        id="image"
        ref="image"
        :with-arrows="images.length > 1"
        :slider-class="productImageSliderClass"
        data-testid="main-product-image"
        :slider-tabindex="-1"
        @update:active-slide="updateActiveSlide"
      >
        <SFProductImage
          v-for="(productImage, index) in images"
          :key="productImage.hash"
          :image="productImage"
          :image-loading="index === 0 ? 'eager' : 'lazy'"
          :preload="index === 0"
          :alt="
            $t('product_image.alt_with_image_index', {
              alt,
              index: index + 1,
              total: images.length,
            })
          "
          :data-testid="`product-image-${index}`"
          sizes="xs:100vw sm:100vw md:50vw lg:50vw xl:50vw"
          class="min-w-full cursor-pointer snap-start snap-always self-start overflow-hidden md:rounded-md"
          tabindex="-1"
          @click="isZoomModalOpen = true"
        />
        <template #arrows="{ prev, isPrevEnabled, next, isNextEnabled }">
          <div
            class="absolute bottom-4 right-4 z-10 flex space-x-px max-md:hidden"
          >
            <SFSliderArrowButton
              class="aspect-square h-9 bg-white focus-visible:shadow-inner-solid-sm disabled:bg-gray-100 disabled:text-secondary"
              :aria-label="$t('image_slider.a11ly.go_to_previous_image')"
              :disabled="!isPrevEnabled"
              direction="left"
              inverted-radius
              @click="prev()"
            />
            <SFSliderArrowButton
              class="aspect-square h-9 bg-white focus-visible:shadow-inner-solid-sm disabled:bg-gray-100 disabled:text-secondary"
              :aria-label="$t('image_slider.a11ly.go_to_next_image')"
              :disabled="!isNextEnabled"
              direction="right"
              inverted-radius
              @click="next()"
            />
          </div>
        </template>
        <template #thumbnails>
          <div
            class="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-1 md:hidden"
          >
            <div
              v-for="imageIndex in images.length"
              :key="imageIndex"
              class="size-1 rounded-full bg-gray-400 transition-all duration-300"
              :class="{ 'w-3 !bg-black': imageIndex - 1 === activeSlide }"
            />
          </div>
        </template>
      </SFItemsSlider>
      <SFWishlistToggle
        class="absolute right-5 top-5 z-10 md:hidden"
        :product="product"
      />
      <SFProductBadges
        :product="product"
        class="absolute left-5 max-md:bottom-5 md:top-5"
      />
      <SFGoBackLink
        class="left-1 top-1 z-10 p-4 md:hidden"
        :fallback-link="categoryLink"
      />
    </div>
  </div>
  <SFProductGalleryZoom
    v-model:visible="isZoomModalOpen"
    :alt="alt"
    :images="images"
    :start-index="activeSlide"
    @close="isZoomModalOpen = false"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Product } from '@scayle/storefront-nuxt'
import SFWishlistToggle from '../../SFWishlistToggle.vue'
import SFProductBadges from '../../card/SFProductBadges.vue'
import SFProductImage from '../../SFProductImage.vue'
import SFProductGalleryZoom from './SFProductGalleryZoom.vue'
import SFSliderArrowButton from '~~/modules/ui/runtime/components/core/SFSliderArrowButton.vue'

import { SFItemsSlider, SFGoBackLink } from '#storefront-ui/components'

import { useProductBaseInfo, useRouteHelpers } from '~/composables'

const { product, productImageSliderClass } = defineProps<{
  /**
   * Product object containing images array with hash URLs and attributes for the gallery display.
   */
  product: Product
  /**
   * Additional CSS classes to apply to the product image slider container.
   */
  productImageSliderClass?: string
}>()

const { buildCategoryPath } = useRouteHelpers()
const categoryLink = computed(() => {
  const category = longestCategoryList.value.at(-1)
  if (!category) {
    return
  }

  return buildCategoryPath({
    id: category.categoryId,
    path: category.categoryUrl,
  })
})

const image = ref()

const scrollImageIntoView = (index: number) => {
  image.value?.scrollImageIntoView(index, 'smooth')
  activeSlide.value = index
}

const activeSlide = ref(0)
const updateActiveSlide = (newSlide: number) => {
  activeSlide.value = Number.isFinite(newSlide) ? newSlide : 0
}

const isZoomModalOpen = ref(false)

const { alt, images, longestCategoryList } = useProductBaseInfo(() => product)
</script>
