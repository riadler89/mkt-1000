<template>
  <SFAccordionEntry
    :id="contentElement.sys.id"
    :title="contentElement.fields.title"
    :data-contentful-entry-id="contentElement?.sys?.id"
    data-contentful-field-id="title"
  >
    <template v-for="content in contentElement.fields.content">
      <ContentfulComponent
        v-if="contentElement"
        :key="content?.sys.id"
        :content-element="content"
      />
    </template>
  </SFAccordionEntry>
</template>

<script setup lang="ts">
import type { TypeAccordionItemComponentWithoutUnresolvableLinksResponse } from '../types'
import ContentfulComponent from './ContentfulComponent.vue'
import SFAccordionEntry from '~~/modules/ui/runtime/components/accordion/SFAccordionEntry.vue'

const { contentElement } = defineProps<{
  contentElement: TypeAccordionItemComponentWithoutUnresolvableLinksResponse
}>()
</script>
