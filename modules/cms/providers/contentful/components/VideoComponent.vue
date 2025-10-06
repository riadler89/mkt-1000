<template>
  <div
    class="flex aspect-[--aspect-ratio] w-full items-center justify-center overflow-hidden object-bottom"
    :style="cssVars"
    :data-contentful-entry-id="contentElement.sys.id"
    data-contentful-field-id="video"
  >
    <div
      v-if="!playing"
      class="relative m-auto flex size-full items-center justify-center"
    >
      <picture>
        <template v-for="(source, index) of previewImageSources">
          <source
            v-if="index + 1 < previewImageSources.length"
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
              :src="source.src"
              :sizes="source.sizes"
              :srcset="source.srcset"
              :alt="contentElement.fields.video?.fields.title ?? ''"
            />
          </template>
        </template>
      </picture>
      <SFButton
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        aria-label="Play video"
        title="Play video"
        @click="startVideo"
      >
        ▶
      </SFButton>
    </div>
    <video
      v-else
      ref="videoEl"
      playsinline
      :src="contentElement.fields.video?.fields.file?.url"
      :autoplay="contentElement.fields.autoplay ?? true"
      :loop="contentElement.fields.loop ?? true"
      :controls="contentElement.fields.showControls ?? false"
      :muted="contentElement.fields.muted ?? true"
      class="m-auto size-full max-h-full max-w-full object-contain"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef } from 'vue'
import type { TypeVideoComponentWithoutUnresolvableLinksResponse } from '../types'
import SFButton from '~~/modules/ui/runtime/components/core/SFButton.vue'
import { getImageSources, type Source } from '~~/modules/cms/utils/image'
import { useImage, useRuntimeConfig } from '#imports'

const { contentElement } = defineProps<{
  contentElement: TypeVideoComponentWithoutUnresolvableLinksResponse
}>()

const playing = ref(contentElement.fields.autoplay ?? true)
const videoEl = useTemplateRef('videoEl')

const startVideo = async () => {
  playing.value = true
  await nextTick()
  videoEl.value?.play()
}

const cssVars = computed(() => {
  switch (contentElement.fields.aspectRatio) {
    case '1:1':
      return {
        '--aspect-ratio': '1/1',
      }
    case '4:3':
      return {
        '--aspect-ratio': '4/3',
      }
    case '16:9':
    default:
      return {
        '--aspect-ratio': '16/9',
      }
  }
})

const { breakpoints } = useRuntimeConfig().public.storefrontUI
const $img = useImage()

const previewImageSources = computed<Source[]>(() => {
  return getImageSources(
    contentElement!.fields.previewImageDesktop!.fields.file!.url!,
    contentElement?.fields.previewImageMobile?.fields.file?.url ||
      contentElement!.fields.previewImageDesktop!.fields.file!.url!,
    breakpoints.lg as number,
    'contentful',
    $img,
  )
})
</script>
