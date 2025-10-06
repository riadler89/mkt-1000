<template>
  <section
    class="stack relative min-h-[var(--min-height-mobile)] w-full overflow-hidden lg:min-h-[var(--min-height-desktop)]"
    :style="{
      '--min-height-desktop': minHeightDesktop,
      '--min-height-mobile': minHeightMobile,
      'background-color': !!contentElement.backgroundColor
        ? contentElement.backgroundColor
        : undefined,
    }"
  >
    <picture
      v-if="
        contentElement.backgroundImageDesktop?.filename ||
        contentElement.backgroundImageMobile?.filename
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
      <StoryblokComponent
        v-for="(element, index) in contentElement.content"
        :key="element._uid"
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
import type { SectionComponent } from '../types'
import { useCMSContext } from '../../../utils/useCMSContext'
import StoryblokComponent from './StoryblokComponent.vue'
import { useImage } from '#image/composables'
import { useRuntimeConfig } from '#imports'
import {
  getImageSizes,
  getImageSources,
  type Source,
} from '~~/modules/cms/utils/image'

const { contentElement } = defineProps<{
  contentElement: SectionComponent
}>()

const paddingClasses = computed(() => {
  switch (contentElement?.padding) {
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

const $img = useImage()

const minHeightDesktop = computed(() => {
  return `${contentElement?.minHeightDesktop || 0}px`
})
const minHeightMobile = computed(() => {
  return `${contentElement?.minHeightMobile || contentElement?.minHeightDesktop || 0}px`
})

const horizontalContentAlignment = computed(() => {
  switch (contentElement.horizontalContentAlignment) {
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
      contentElement.verticalContentAlignment || 'Middle',
    )
  )
}

const shouldAddBottomMargin = (index: number) => {
  return (
    index === (contentElement?.content?.length ?? 0) - 1 &&
    ['Top', 'Middle'].includes(
      contentElement.verticalContentAlignment || 'Middle',
    )
  )
}

const { desktopViewportFraction, mobileViewportFraction, maxWidths } =
  useCMSContext()
const { breakpoints } = useRuntimeConfig().public.storefrontUI
const sources = computed<Source[]>(() => {
  return getImageSources(
    contentElement!.backgroundImageDesktop!.filename!,
    contentElement?.backgroundImageMobile?.filename ||
      contentElement!.backgroundImageDesktop!.filename!,
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
