<template>
  <div>
    <div
      v-if="contentElement.fields.title"
      class="text-xl font-medium"
      :data-contentful-entry-id="contentElement?.sys?.id"
      data-contentful-field-id="title"
    >
      {{ contentElement.fields.title }}
    </div>
    <template v-for="content in contentElement.fields.content">
      <ContentfulComponent
        v-if="content"
        :key="content?.sys.id"
        :content-element="content"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { TypeAccordionComponentWithoutUnresolvableLinksResponse } from '../types'
import ContentfulComponent from './ContentfulComponent.vue'

const { contentElement } = defineProps<{
  contentElement: TypeAccordionComponentWithoutUnresolvableLinksResponse
}>()
</script>
