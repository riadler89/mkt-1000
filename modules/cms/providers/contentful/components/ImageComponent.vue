<template>
  <div
    class="aspect-[--mobile-aspect-ratio] max-h-[--mobile-max-height] max-w-[--mobile-max-width] overflow-hidden lg:aspect-[--desktop-aspect-ratio] lg:max-h-[--desktop-max-height] lg:max-w-[--desktop-max-width]"
    :style="cssVars"
    v-bind="$attrs"
    :data-contentful-entry-id="contentElement?.sys?.id"
    data-contentful-field-id="imageDesktop"
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
            :alt="contentElement.fields.altText"
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
import type { TypeImageComponentWithoutUnresolvableLinksResponse } from '../types'
import { useCMSContext } from '../../../utils/useCMSContext'
import { useRuntimeConfig } from '#imports'
import { useImage } from '#image/composables'
import {
  getImageSizes,
  getImageSources,
  type Source,
} from '~~/modules/cms/utils/image'

const { contentElement } = defineProps<{
  contentElement: TypeImageComponentWithoutUnresolvableLinksResponse
}>()

const getImageDimensions = (
  image:
    | TypeImageComponentWithoutUnresolvableLinksResponse['fields']['imageDesktop']
    | TypeImageComponentWithoutUnresolvableLinksResponse['fields']['imageMobile'],
) => {
  return {
    width: image?.fields?.file?.details?.image?.width || 0,
    height: image?.fields?.file?.details?.image?.height || 0,
  }
}

const getAspectRatio = (
  aspectRatio:
    | TypeImageComponentWithoutUnresolvableLinksResponse['fields']['aspectRatioDesktop']
    | TypeImageComponentWithoutUnresolvableLinksResponse['fields']['aspectRatioMobile'] = 'original',
  image:
    | TypeImageComponentWithoutUnresolvableLinksResponse['fields']['imageDesktop']
    | TypeImageComponentWithoutUnresolvableLinksResponse['fields']['imageMobile'],
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
    contentElement!.fields.imageDesktop!.fields.file!.url!,
    contentElement?.fields.imageMobile?.fields.file?.url ||
      contentElement!.fields.imageDesktop!.fields.file!.url!,
    breakpoints.lg as number,
    'contentful',
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
    contentElement?.fields.aspectRatioMobile,
    contentElement?.fields.imageMobile || contentElement?.fields.imageDesktop,
  )
  const desktopAspectRatio = getAspectRatio(
    contentElement?.fields.aspectRatioDesktop,
    contentElement?.fields.imageDesktop,
  )
  const mobileDimensions = getImageDimensions(
    contentElement?.fields.imageMobile || contentElement?.fields.imageDesktop,
  )
  const desktopDimensions = getImageDimensions(
    contentElement?.fields.imageDesktop,
  )
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
