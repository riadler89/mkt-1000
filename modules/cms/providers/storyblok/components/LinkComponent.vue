<template>
  <SFLink
    v-editable="contentElement"
    :to="url"
    :target="contentElement?.url?.target"
  >
    <StoryblokComponent
      v-for="element in contentElement.content"
      :key="element._uid"
      :content-element="element"
    />
  </SFLink>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { LinkComponent } from '../types'
import { generateLink } from '../utils/helpers'
import StoryblokComponent from './StoryblokComponent.vue'
import SFLink from '~~/modules/ui/runtime/components/links/SFLink.vue'
import { isExternalLink } from '~/utils'
import { useRouteHelpers } from '~/composables'

const { contentElement } = defineProps<{ contentElement: LinkComponent }>()

const { getLocalizedRoute } = useRouteHelpers()

const url = computed(() => {
  const url = generateLink(contentElement?.url) as string

  if (isExternalLink(url)) {
    return url
  }

  return getLocalizedRoute(url)
})
</script>
