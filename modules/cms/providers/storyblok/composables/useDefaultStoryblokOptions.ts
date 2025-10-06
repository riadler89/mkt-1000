import type { ISbStoriesParams } from '@storyblok/vue'
import type { StoryblokRuntimeConfig } from '../types'
import { isInEditorMode } from '../utils/helpers'
import { useRuntimeConfig } from '#app/nuxt'
import { useRoute } from '#app/composables/router'
import { useCurrentShop } from '#storefront/composables'

export function useDefaultStoryblokOptions(): Pick<
  ISbStoriesParams,
  'language' | 'version' | 'resolve_links'
> {
  const route = useRoute()
  const currentShop = useCurrentShop()
  const config = useRuntimeConfig()
  const { allowDrafts } = config.public.cms as StoryblokRuntimeConfig

  return {
    version: isInEditorMode(route) && allowDrafts ? 'draft' : 'published',
    language: currentShop.value.locale ?? '',
    resolve_links: 'url',
  }
}
