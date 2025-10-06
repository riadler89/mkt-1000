<template>
  <SFButton
    v-editable="contentElement"
    :variant="variant"
    :to="to"
    :target="contentElement.url.target"
  >
    {{ contentElement.text }}
  </SFButton>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { ButtonComponent } from '../types'
import { generateLink } from '../utils/helpers'
import SFButton from '~~/modules/ui/runtime/components/core/SFButton.vue'
import { isExternalLink } from '~/utils'
import { useRouteHelpers } from '~/composables'

const { contentElement } = defineProps<{ contentElement: ButtonComponent }>()

const { getLocalizedRoute } = useRouteHelpers()

const variant = computed(() => {
  switch (contentElement.style) {
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
  const url = generateLink(contentElement.url) as string

  if (isExternalLink(url)) {
    return url
  }

  return getLocalizedRoute(url)
})
</script>
