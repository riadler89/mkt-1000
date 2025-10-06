<template>
  <div
    v-if="content?.fields?.teaserContent?.length"
    :data-contentful-entry-id="content?.sys?.id"
    data-contentful-field-id="teaserContent"
  >
    <ContentfulComponent
      v-for="blok in content?.fields?.teaserContent"
      :key="blok?.sys.id"
      :content-element="blok"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCMSBySlug } from '../composables/useCMS'
import { useContentfulEditor } from '../composables/useContentfulEditor'
import type { TypeProductListingPageComponentSkeleton } from '../types'
import ContentfulComponent from './ContentfulComponent.vue'

const { categoryId } = defineProps<{ categoryId: number }>()

const slug = computed(() => `c/c-${categoryId}`)

const { data: content } = useCMSBySlug<TypeProductListingPageComponentSkeleton>(
  `product-listing-page-${categoryId}`,
  {
    content_type: 'productListingPageComponent',
    'fields.slug[match]': slug.value,
  },
)

useContentfulEditor<TypeProductListingPageComponentSkeleton>(content)
</script>
