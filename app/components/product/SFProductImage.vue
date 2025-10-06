<template>
  <ScaylePicture
    :alt="alt"
    :quality="quality"
    :sizes="sizes"
    :height="height"
    :width="width"
    :should-trim="shouldTrim"
    densities="x1"
    :src="image.hash"
    :loading="imageLoading"
    :preload="preload"
    :aspect-ratio="aspectRatio"
    :class="{
      'm-auto h-[90%]': isCentered,
      'mix-blend-darken': withMixBlendDarken,
    }"
    :img-attrs="{
      class: [
        'w-full h-full',
        {
          'object-contain': fit === 'contain',
          'object-cover object-center': fit === 'cover',
        },
      ],
    }"
    data-testid="product-image"
    class="picture block"
    @load="load"
  />
</template>

<script setup lang="ts">
import type { ProductImage } from '@scayle/storefront-nuxt'
import { ScaylePicture } from '#components'
import { PRODUCT_IMAGE_ASPECT_RATIO } from '~~/config/ui'

const {
  sizes = '',
  shouldTrim = false,
  isCentered = false,
  withMixBlendDarken = true,
  fit = 'contain',
  imageLoading = 'eager',
  preload = false,
  quality = 75,
  aspectRatio = PRODUCT_IMAGE_ASPECT_RATIO,
  load = () => {},
} = defineProps<{
  image: ProductImage
  sizes?: string
  fit?: 'contain' | 'cover'
  alt: string
  imageLoading?: 'lazy' | 'eager'
  preload?: boolean
  quality?: number
  load?: () => void
  shouldTrim?: boolean
  isCentered?: boolean
  withMixBlendDarken?: boolean
  height?: number | string
  width?: number | string
  aspectRatio?: [number, number]
}>()
</script>
