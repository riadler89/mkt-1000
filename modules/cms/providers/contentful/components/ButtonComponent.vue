<template>
  <SFButton
    :variant="variant"
    :to="to"
    :target="contentElement.fields.openInNewTab ? '_blank' : '_self'"
    :data-contentful-entry-id="contentElement?.sys?.id"
    data-contentful-field-id="text"
  >
    {{ contentElement.fields.text }}
  </SFButton>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { TypeButtonComponentWithoutUnresolvableLinksResponse } from '../types'
import SFButton from '~~/modules/ui/runtime/components/core/SFButton.vue'
import { useRouteHelpers } from '~/composables'
import { isExternalLink } from '~/utils'

const { contentElement } = defineProps<{
  contentElement: TypeButtonComponentWithoutUnresolvableLinksResponse
}>()

const { getLocalizedRoute } = useRouteHelpers()

const variant = computed(() => {
  switch (contentElement.fields.style) {
    case 'primary':
      return 'primary'
    case 'secondary':
      return 'secondary'
    case 'outline':
      return 'tertiary'
    case 'accent':
      return 'accent'
    default:
      return 'primary'
  }
})

const to = computed(() => {
  if (typeof contentElement.fields.url !== 'string') {
    return
  }

  if (isExternalLink(contentElement.fields.url)) {
    return contentElement.fields.url
  }

  return getLocalizedRoute(contentElement.fields.url)
})
</script>
