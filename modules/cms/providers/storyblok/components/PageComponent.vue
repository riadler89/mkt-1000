<template>
  <div :key="slug" v-editable="data?.data?.story?.content">
    <slot v-if="status === 'pending'" name="loading" />
    <template v-else>
      <StoryblokComponent
        v-for="element in data?.data?.story?.content?.content"
        :key="element._uid"
        :content-element="element"
      />
    </template>
  </div>
</template>
<script lang="ts" setup>
import { whenever } from '@vueuse/core'
import { HttpStatusCode } from '@scayle/storefront-nuxt'
import { useCMSBySlug } from '../composables/useCMS'
import { useStoryblokEditor } from '../composables/useStoryblokEditor'
import type { PageComponent } from '../types'
import StoryblokComponent from './StoryblokComponent.vue'
import { createError, useSeoMeta } from '#imports'

const { slug } = defineProps<{
  slug: string
}>()

const { data, status, error } = await useCMSBySlug<PageComponent>(slug, slug, {
  lazy: true,
})

useStoryblokEditor(data)

whenever(
  error,
  () => {
    throw createError({
      ...(error.value?.cause
        ? error.value.cause
        : {
            statusCode: HttpStatusCode.NOT_FOUND,
          }),
      fatal: true,
    })
  },
  { immediate: true },
)

useSeoMeta({
  title: () => data.value?.data?.story?.content?.metaTitle,
  description: () => data.value?.data?.story?.content?.metaDescription,
  robots: () => data.value?.data?.story?.content?.robots,
})
</script>
