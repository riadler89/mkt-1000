<template>
  <SFAccordionEntry
    :id="contentElement._uid"
    v-editable="contentElement"
    :title="contentElement.title"
  >
    <template v-for="content in contentElement.content">
      <StoryblokComponent
        v-if="contentElement"
        :key="content?._uid"
        :content-element="content"
      />
    </template>
  </SFAccordionEntry>
</template>

<script setup lang="ts">
import type { AccordionItemComponent } from '../types'
import StoryblokComponent from './StoryblokComponent.vue'
import SFAccordionEntry from '~~/modules/ui/runtime/components/accordion/SFAccordionEntry.vue'

const { contentElement } = defineProps<{
  contentElement: AccordionItemComponent
}>()
</script>
