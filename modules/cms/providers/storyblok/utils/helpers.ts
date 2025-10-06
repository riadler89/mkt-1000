import type { StoryblokMultilink } from '../types/gen/storyblok'
import { isExternalLink } from '../../../utils/helpers'
import type { RouteLocationNormalizedLoadedGeneric } from '#vue-router'

export const generateLink = (url: StoryblokMultilink) => {
  if (url.linktype === 'story' && url.story?.full_slug) {
    return url.story.full_slug
  }

  if (isExternalLink(url.url || url.cached_url)) {
    return url.url || url.cached_url
  }

  return url.url || url.cached_url
}

export const isInEditorMode = (route: RouteLocationNormalizedLoadedGeneric) => {
  return '_storyblok' in route.query
}
