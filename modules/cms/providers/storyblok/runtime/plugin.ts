// plugins/storyblok.js
import { StoryblokVue, apiPlugin } from '@storyblok/vue'
import type { StoryblokRuntimeConfig } from '../types'
import { isInEditorMode } from '../utils/helpers'
import { defineNuxtPlugin, useRoute, useRuntimeConfig } from '#app'
import { useLog } from '#storefront/composables'

export default defineNuxtPlugin(({ vueApp }) => {
  const runtimeConfig = useRuntimeConfig()
  const route = useRoute()
  const log = useLog()
  const cms = runtimeConfig.public.cms as StoryblokRuntimeConfig

  if (isInEditorMode(route) && !cms.allowDrafts) {
    log.warn(
      'Storyblok is in editor mode but allowDrafts is false. This will prevent you from seeing content.',
    )
  }
  vueApp.use(StoryblokVue, {
    ...JSON.parse(JSON.stringify(runtimeConfig.public.storyblok)),
    // NOTE: accessToken needs to be located after the destructured original storyblok runtimeConfig
    // else, it will get overridden with the empty default string of the Storyblok nuxt module.
    accessToken:
      cms.accessToken ?? import.meta.env.NUXT_PUBLIC_CMS_ACCESS_TOKEN,
    use: [apiPlugin],
  })
})
