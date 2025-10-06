<template>
  <SFLink
    :to="url"
    :target="contentElement?.fields?.openInNewTab ? '_blank' : '_self'"
    :data-contentful-entry-id="contentElement?.sys?.id"
    data-contentful-field-id="url"
  >
    <ContentfulComponent :content-element="contentElement?.fields?.content" />
  </SFLink>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import type { LocaleCode } from 'contentful'
import type { TypeLinkComponent } from '../types'
import ContentfulComponent from './ContentfulComponent.vue'
import { useRouteHelpers } from '~/composables'
import SFLink from '~~/modules/ui/runtime/components/links/SFLink.vue'
import { isExternalLink } from '~/utils'

const { contentElement } = defineProps<{
  contentElement: TypeLinkComponent<'WITHOUT_UNRESOLVABLE_LINKS', LocaleCode>
}>()

const { getLocalizedRoute } = useRouteHelpers()

const url = computed(() => {
  if (isExternalLink(contentElement.fields.url)) {
    return contentElement.fields.url
  }
  return getLocalizedRoute(contentElement.fields.url)
})
</script>
