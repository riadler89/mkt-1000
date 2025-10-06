<template>
  <div
    v-if="content?.data?.story.content?.teaserContent?.length"
    v-editable="content?.data.story"
  >
    <StoryblokComponent
      v-for="blok in content?.data.story.content.teaserContent"
      :key="blok._uid"
      :content-element="blok"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCMSBySlug } from '../composables/useCMS'
import { useStoryblokEditor } from '../composables/useStoryblokEditor'
import type { ProductListingPageComponent } from '../types'
import StoryblokComponent from './StoryblokComponent.vue'

const { categoryId } = defineProps<{ categoryId: number }>()

const slug = computed(() => `c/c-${categoryId}`)

const { data: content } = useCMSBySlug<ProductListingPageComponent>(
  `product-listing-page-${categoryId}`,
  slug,
)

useStoryblokEditor<ProductListingPageComponent>(content)
</script>
