import type { ContentfulClientApi } from 'contentful'
import { useNuxtApp } from '#app'

export function useContentful() {
  const { $contentful } = useNuxtApp()
  return $contentful as ContentfulClientApi<undefined>
}
