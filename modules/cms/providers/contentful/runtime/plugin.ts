import { createClient } from 'contentful'
import type { ContentfulRuntimeConfig } from '../types'
import { isInEditorMode } from '../utils/helpers'
import { useLog } from '#storefront/composables'
import { useRoute } from '#app/composables/router'
import { defineNuxtPlugin, useRuntimeConfig } from '#app'

export default defineNuxtPlugin({
  name: 'cms:contentful',
  setup() {
    const config = useRuntimeConfig()
    const log = useLog()
    const cms = config.public.cms as ContentfulRuntimeConfig

    const route = useRoute()
    const isInEditor = isInEditorMode(route)

    if (isInEditor && !cms.allowDrafts) {
      log.warn(
        'Contentful is in editor mode but allowDrafts is false. This will prevent you from seeing draft content.',
      )
    }

    if (isInEditor && cms.allowDrafts && !cms.previewAccessToken) {
      log.error(
        'Contentful is in editor mode but previewAccessToken is not set. This will prevent you from loading content.',
      )
    }

    const host = isInEditor && cms.allowDrafts ? cms.previewHost : cms.host

    const accessToken =
      isInEditor && cms.allowDrafts
        ? (cms.previewAccessToken ?? '')
        : cms.accessToken

    // https://contentful.github.io/contentful.js/contentful/7.14.8/contentful.html#.createClient
    const client = createClient({
      accessToken,
      space: cms.space,
      host,
    })

    return {
      provide: {
        contentful: client,
      },
    }
  },
})
