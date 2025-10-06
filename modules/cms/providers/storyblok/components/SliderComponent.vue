<template>
  <SFItemsSlider
    v-editable="contentElement"
    class="w-full snap-x snap-mandatory"
    :with-arrows="contentElement.showNavigationArrows ?? true"
  >
    <div
      v-for="item in contentElement.content"
      :key="item._uid"
      class="flex min-w-full snap-start snap-always place-content-center items-center"
      tabindex="-1"
    >
      <StoryblokComponent :content-element="item" />
    </div>
    <template
      v-if="contentElement.showPaginationIndicators ?? true"
      #thumbnails="{ activeSlide, scrollImageIntoView }"
    >
      <div class="absolute bottom-3 z-10 flex w-full justify-center gap-2">
        <button
          v-for="(item, index) in contentElement.content"
          :key="item._uid"
          class="size-2.5 rounded-full bg-black"
          :class="{
            'opacity-10': activeSlide !== index,
          }"
          @click="scrollImageIntoView(index, 'smooth')"
        />
      </div>
    </template>
  </SFItemsSlider>
</template>

<script setup lang="ts">
import type { SliderComponent } from '../types'
import StoryblokComponent from './StoryblokComponent.vue'
import SFItemsSlider from '~~/modules/ui/runtime/components/sliders/SFItemsSlider.vue'

const { contentElement } = defineProps<{ contentElement: SliderComponent }>()
</script>
