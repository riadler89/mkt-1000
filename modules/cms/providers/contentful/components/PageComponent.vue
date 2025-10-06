<template>
  <div
    :data-contentful-entry-id="data?.sys?.id"
    data-contentful-field-id="content"
  >
    <slot v-if="status === 'pending'" name="loading" />
    <template v-else>
      <ContentfulComponent
        v-for="element in data?.fields.content"
        :key="element?.sys.id"
        :content-element="element"
      />
    </template>
  </div>
</template>
<script lang="ts" setup>
import { whenever } from '@vueuse/core'
import { HttpStatusCode } from '@scayle/storefront-nuxt'
import { useCMSBySlug } from '../composables/useCMS'
import type { TypePageComponentSkeleton } from '../types'
import { useContentfulEditor } from '../composables/useContentfulEditor'
import ContentfulComponent from './ContentfulComponent.vue'
import { createError, useSeoMeta } from '#imports'

const { slug } = defineProps<{
  slug: string
}>()

const { data, status, error } = await useCMSBySlug<TypePageComponentSkeleton>(
  slug,
  {
    content_type: 'PageComponent',
    'fields.slug[match]': slug,
  },
  {
    lazy: true,
  },
)

useContentfulEditor(data)

// Handle errors
whenever(
  error,
  (newError) => {
    throw createError({
      ...('statusCode' in newError
        ? {
            ...newError,
            statusMessage: (newError?.cause as Error)?.name,
          }
        : {
            statusCode: HttpStatusCode.NOT_FOUND,
          }),
      fatal: true,
    })
  },
  { immediate: true },
)
//Handle no page found
whenever(
  () => status.value === 'success' && data.value === undefined,
  () => {
    throw createError({
      statusCode: HttpStatusCode.NOT_FOUND,
      message: `No page found for slug: ${slug}`,
      fatal: true,
    })
  },
)

useSeoMeta({
  title: () => data.value?.fields.metaTitle,
  description: () => data.value?.fields.metaDescription,
  robots: () => data.value?.fields.robots,
})
</script>
