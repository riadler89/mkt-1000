import type { ISbStoriesParams, ISbStory } from '@storyblok/vue'
import type { MaybeRefOrGetter } from 'vue'
import { toValue } from 'vue'
import { useStoryblokApi } from '@storyblok/vue'
import { isInEditorMode } from '../utils/helpers'
import { useDefaultStoryblokOptions } from './useDefaultStoryblokOptions'
import { useRoute } from '#app/composables/router'
import { useAsyncData, type AsyncDataOptions } from '#app/composables/asyncData'

export function useCMSBySlug<T>(
  key: string,
  slug: MaybeRefOrGetter<string>,
  asyncDataOption?: AsyncDataOptions<ISbStory<T>>,
) {
  const storyblokApi = useStoryblokApi()
  const storyblokOptions = useDefaultStoryblokOptions()
  const route = useRoute()
  return useAsyncData(
    key,
    () =>
      storyblokApi.getStory(toValue(slug), {
        ...storyblokOptions,
      }) as unknown as Promise<ISbStory<T>>,
    {
      ...asyncDataOption,
      watch: [() => toValue(slug)],
      // Use deep reactive in editor mode , so every dependency can track when we apply the content from the editor
      deep: isInEditorMode(route),
    },
  )
}

export function useCMSByFolder<T>(
  key: string,
  folder: string,
  params?: ISbStoriesParams,
  asyncDataOption?: AsyncDataOptions<ISbStory<T>>,
) {
  const storyblokApi = useStoryblokApi()
  const storyblokOptions = useDefaultStoryblokOptions()
  return useAsyncData(
    key,
    () => {
      return storyblokApi.getStories({
        ...storyblokOptions,
        starts_with: folder,
        ...params,
      }) as unknown as Promise<ISbStory<T>>
    },
    asyncDataOption,
  )
}
