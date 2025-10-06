<template>
  <div v-editable="contentElement">
    <div v-if="contentElement.title" class="text-xl font-medium">
      {{ contentElement.title }}
    </div>
    <template v-for="content in contentElement.content">
      <StoryblokComponent
        v-if="content"
        :key="content._uid"
        :content-element="content"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { AccordionComponent } from '../types'
import StoryblokComponent from './StoryblokComponent.vue'

const { contentElement } = defineProps<{
  contentElement: AccordionComponent
}>()
</script>
