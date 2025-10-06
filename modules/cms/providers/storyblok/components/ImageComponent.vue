<template>
  <div
    v-editable="contentElement"
    class="aspect-[--mobile-aspect-ratio] max-h-[--mobile-max-height] max-w-[--mobile-max-width] overflow-hidden lg:aspect-[--desktop-aspect-ratio] lg:max-h-[--desktop-max-height] lg:max-w-[--desktop-max-width]"
    :style="cssVars"
    v-bind="$attrs"
  >
    <picture>
      <template v-for="(source, index) of sources">
        <source
          v-if="index + 1 < sources.length"
          :key="source.src"
          :type="source.type"
          :sizes="source.sizes"
          :srcset="source.srcset"
          :media="source.media"
        />
        <template v-else>
          <img
            ref="imgEl"
            :key="'last' + source.src"
            class="size-full object-cover object-center"
            :alt="contentElement.altText"
            :src="source.src"
            :sizes="source.sizes"
            :srcset="source.srcset"
          />
        </template>
      </template>
    </picture>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { StoryblokAsset } from '../types/gen/storyblok'
import type { ImageComponent } from '../types'
import { useCMSContext } from '../../../utils/useCMSContext'
import { useRuntimeConfig } from '#app/nuxt'
import { useImage } from '#image/composables'
import {
  getImageSizes,
  getImageSources,
  type Source,
} from '~~/modules/cms/utils/image'

const { contentElement } = defineProps<{
  contentElement: ImageComponent
}>()

const getImageDimensions = (image?: StoryblokAsset) => {
  // Get image dimensions from meta_data if available, otherwise use filename
  // https://www.storyblok.com/docs/concepts/assets#obtain-image-dimensions-in-the-api
  const dimensioning =
    image?.meta_data?.size || image?.filename?.split('/')?.[5]

  return {
    width: parseInt(dimensioning?.split('x')?.[0] || '0'),
    height: parseInt(dimensioning?.split('x')?.[1] || '0'),
  }
}

const getAspectRatio = (
  aspectRatio:
    | ImageComponent['aspectRatioDesktop']
    | ImageComponent['aspectRatioMobile'] = 'original',
  image?: StoryblokAsset,
) => {
  switch (aspectRatio) {
    case '16:9':
      return '16/9'
    case '1:1':
      return '1/1'
    case '4:3':
      return '4/3'
    case 'original':
    default: {
      const { width, height } = getImageDimensions(image)

      return `${width}/${height}`
    }
  }
}

const { breakpoints } = useRuntimeConfig().public.storefrontUI
const $img = useImage()

const { desktopViewportFraction, mobileViewportFraction, maxWidths } =
  useCMSContext()

const sources = computed<Source[]>(() => {
  return getImageSources(
    contentElement!.imageDesktop!.filename!,
    contentElement?.imageMobile?.filename ||
      contentElement!.imageDesktop!.filename!,
    breakpoints.lg as number,
    'storyblok',
    $img,
    getImageSizes(
      desktopViewportFraction.value,
      mobileViewportFraction.value,
      maxWidths,
    ),
  )
})

// Create CSS custom properties for dynamic styling
const cssVars = computed(() => {
  const mobileAspectRatio = getAspectRatio(
    contentElement?.aspectRatioMobile,
    contentElement?.imageMobile,
  )
  const desktopAspectRatio = getAspectRatio(
    contentElement?.aspectRatioDesktop,
    contentElement?.imageDesktop,
  )
  const mobileDimensions = getImageDimensions(
    contentElement?.imageMobile?.filename
      ? contentElement?.imageMobile
      : contentElement?.imageDesktop,
  )
  const desktopDimensions = getImageDimensions(contentElement?.imageDesktop)
  return {
    '--mobile-aspect-ratio': mobileAspectRatio,
    '--desktop-aspect-ratio': desktopAspectRatio,
    '--desktop-max-height': `${desktopDimensions.height}px`,
    '--desktop-max-width': `${desktopDimensions.width}px`,
    '--mobile-max-height': `${mobileDimensions.height}px`,
    '--mobile-max-width': `${mobileDimensions.width}px`,
  }
})
</script>
