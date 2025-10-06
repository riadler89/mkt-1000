<template>
  <section
    class="stack relative min-h-[var(--min-height-mobile)] w-full overflow-hidden lg:min-h-[var(--min-height-desktop)]"
    :style="{
      '--min-height-desktop': minHeightDesktop,
      '--min-height-mobile': minHeightMobile,
      'background-color': !!contentElement.fields.backgroundColor
        ? contentElement.fields.backgroundColor
        : undefined,
    }"
  >
    <picture
      v-if="
        contentElement.fields.backgroundImageDesktop?.fields?.file?.url ||
        contentElement.fields.backgroundImageMobile?.fields?.file?.url
      "
      class="absolute size-full object-cover object-center"
    >
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
          <!-- eslint-disable-next-line vuejs-accessibility/alt-text -->
          <img
            ref="imgEl"
            :key="'last' + source.src"
            class="size-full object-cover object-center"
            :src="source.src"
            :sizes="source.sizes"
            :srcset="source.srcset"
          />
        </template>
      </template>
    </picture>

    <div
      class="z-10 flex size-full flex-col"
      :class="[paddingClasses, horizontalContentAlignment]"
    >
      <ContentfulComponent
        v-for="(element, index) in contentElement.fields.content"
        :key="element?.sys.id"
        :content-element="element"
        :class="{
          'mt-auto': shouldAddTopMargin(index),
          'mb-auto': shouldAddBottomMargin(index),
        }"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TypeSectionComponentWithoutUnresolvableLinksResponse } from '../types'
import { useCMSContext } from '../../../utils/useCMSContext'
import ContentfulComponent from './ContentfulComponent.vue'
import { useImage } from '#image/composables'
import { useRuntimeConfig } from '#imports'
import {
  getImageSizes,
  getImageSources,
  type Source,
} from '~~/modules/cms/utils/image'

const { contentElement } = defineProps<{
  contentElement: TypeSectionComponentWithoutUnresolvableLinksResponse
}>()

const paddingClasses = computed(() => {
  switch (contentElement.fields.padding) {
    case 'small':
      return 'p-3 lg:p-5'
    case 'medium':
      return 'p-5 lg:p-9'
    case 'large':
      return 'p-9 lg:p-12'
    case 'none':
    default:
      return 'p-0'
  }
})

const minHeightDesktop = computed(() => {
  return `${contentElement?.fields?.minHeightDesktop || 0}px`
})
const minHeightMobile = computed(() => {
  return `${contentElement?.fields?.minHeightMobile || contentElement?.fields?.minHeightDesktop || 0}px`
})

const horizontalContentAlignment = computed(() => {
  switch (contentElement.fields.horizontalContentAlignment) {
    case 'Left':
      return 'items-start'
    case 'Right':
      return 'items-end'
    case 'Center':
    default:
      return 'items-center'
  }
})
const shouldAddTopMargin = (index: number) => {
  return (
    index === 0 &&
    ['Bottom', 'Middle'].includes(
      contentElement?.fields?.verticalContentAlignment || 'Middle',
    )
  )
}

const shouldAddBottomMargin = (index: number) => {
  return (
    index === (contentElement?.fields?.content?.length ?? 0) - 1 &&
    ['Top', 'Middle'].includes(
      contentElement?.fields?.verticalContentAlignment || 'Middle',
    )
  )
}

const $img = useImage()
const { desktopViewportFraction, mobileViewportFraction, maxWidths } =
  useCMSContext()
const { breakpoints } = useRuntimeConfig().public.storefrontUI
const sources = computed<Source[]>(() => {
  return getImageSources(
    contentElement!.fields.backgroundImageDesktop!.fields.file!.url!,
    contentElement?.fields.backgroundImageMobile?.fields.file?.url ||
      contentElement!.fields.backgroundImageDesktop!.fields.file!.url!,
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
</script>
<style scoped>
.stack {
  display: grid;
  grid-template-areas: 'stack';
}
.stack > * {
  grid-area: stack;
}
</style>
