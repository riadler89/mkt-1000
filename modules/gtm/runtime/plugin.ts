import { defineNuxtPlugin, useRouter } from 'nuxt/app'
import { createGtm, type VueGtmUseOptions } from '@gtm-support/vue-gtm'

export default defineNuxtPlugin((nuxt) => {
  // Google Tag Manager required an `id` to function. If necessary `id` is not set the application will run into a crashing runtime error during startup.
  if (import.meta.client && nuxt.$config.public.gtm.id) {
    const options = nuxt.$config.public.gtm

    const router = useRouter()

    const pluginOptions: VueGtmUseOptions = {
      ...options,
      vueRouter:
        options.enableRouterSync && router
          ? (router as VueGtmUseOptions['vueRouter'])
          : undefined,
    }

    nuxt.vueApp.use(createGtm(pluginOptions))
  }
})
