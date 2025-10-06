<template>
  <div class="xl:container max-xl:mx-5 md:pt-4">
    <PageComponent :slug="slug" data-testid="content-page">
      <template #loading>
        <SFContentPageSkeletonLoader />
      </template>
    </PageComponent>
  </div>
</template>

<script setup lang="ts">
import { computed, definePageMeta, useRoute } from '#imports'
import PageComponent from '#storefront-cms/components/PageComponent.vue'
import SFContentPageSkeletonLoader from '~/components/SFContentPageSkeletonLoader.vue'
import { provideCMSContext } from '~~/modules/cms/utils/useCMSContext'

defineOptions({ name: 'ContentPage' })
definePageMeta({
  pageType: 'content_pages',
  validate: (route) => {
    return !!route.params.slug && route.params.slug.length > 0
  },
})
const route = useRoute()
const slug = computed(() => {
  // `route.params.slug` only contains dynamic segments, so we need to add the static part 'content' to the slug
  const slugParts = ['content']
  if (typeof route.params.slug === 'string') {
    slugParts.push(route.params.slug)
  } else if (Array.isArray(route.params.slug)) {
    slugParts.push(...route.params.slug)
  }

  return slugParts.join('/')
})

// Starting at the `xl` breakpoint a content container with a `max-width` of `1280px` is used.
// By setting the `max-width` for the `xl` breakpoint, we can avoid loading images wider than the content container and thus save bandwidth and increase overall loading times.
provideCMSContext({
  maxWidths: { xl: 1280 },
})
</script>
