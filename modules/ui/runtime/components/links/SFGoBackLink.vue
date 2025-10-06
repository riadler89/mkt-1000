<template>
  <component
    v-bind="
      hasHistory ? {} : { to: fallbackLink, ...(fallbackLink && { raw: true }) }
    "
    :is="componentName"
    data-testid="back-button"
    class="absolute flex items-center gap-2 text-primary"
    v-on="backClickEventHandling"
  >
    <IconBack class="size-4" />
    <span class="text-sm font-semibold">{{ $t('global.back') }}</span>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useMounted } from '@vueuse/core'
import type { RouteLocationRaw } from '#vue-router'
import { SFLink } from '#storefront-ui/components'

const { fallbackLink = '/' } = defineProps<{
  /**
   * The fallback route to navigate to when there is no browser history available.
   * Accepts a Vue Router raw location object.
   */
  fallbackLink?: RouteLocationRaw
}>()

const mounted = useMounted()

const hasHistory = computed(() => mounted.value && window.history.state.back)

const backClickEventHandling = computed(() => {
  return hasHistory.value ? { click: goBack } : {}
})

const componentName = computed(() => (hasHistory.value ? 'button' : SFLink))

const goBack = () => window?.history.back()
</script>
