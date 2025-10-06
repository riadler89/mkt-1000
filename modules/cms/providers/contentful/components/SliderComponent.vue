<template>
  <SFItemsSlider
    class="w-full snap-x snap-mandatory"
    :with-arrows="contentElement?.fields?.showNavigationArrows ?? true"
    :data-contentful-entry-id="contentElement.sys.id"
    data-contentful-field-id="content"
  >
    <template v-for="item in contentElement?.fields?.content ?? []">
      <div
        v-if="item"
        :key="item?.sys?.id"
        class="flex min-w-full snap-start snap-always place-content-center items-center"
        tabindex="-1"
      >
        <ContentfulComponent :content-element="item" />
      </div>
    </template>
    <template
      v-if="contentElement?.fields?.showPaginationIndicators ?? true"
      #thumbnails="{ activeSlide, scrollImageIntoView }"
    >
      <div class="absolute bottom-3 z-10 flex w-full justify-center gap-2">
        <template
          v-for="(item, index) in contentElement?.fields?.content ?? []"
        >
          <button
            v-if="item"
            :key="item.sys.id"
            class="size-2.5 rounded-full bg-black"
            :class="{
              'opacity-10': activeSlide !== index,
            }"
            @click="scrollImageIntoView(index, 'smooth')"
          />
        </template>
      </div>
    </template>
  </SFItemsSlider>
</template>

<script setup lang="ts">
import type { TypeSliderComponentWithoutUnresolvableLinksResponse } from '../types'
import ContentfulComponent from './ContentfulComponent.vue'
import SFItemsSlider from '~~/modules/ui/runtime/components/sliders/SFItemsSlider.vue'

const { contentElement } = defineProps<{
  contentElement: TypeSliderComponentWithoutUnresolvableLinksResponse
}>()
</script>
