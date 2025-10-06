import { defineNuxtPlugin } from 'nuxt/app'
import { useClientId } from '../composables/useClientId'

/**
 * Nuxt plugin to provide the oauth clientId.
 *
 * It retrieves the oauth clientId from the server context during server-side rendering and provides it to the client.
 *
 * @see https://nuxt.com/docs/guide/directory-structure/plugins#providing-helpers
 *
 */
export default defineNuxtPlugin((nuxtApp) => {
  if (!import.meta.server || !nuxtApp.ssrContext?.event.context.$currentShop) {
    return
  }

  const clientId = useClientId()
  const oauth = nuxtApp.ssrContext.event.context.$rpcContext?.oauth

  clientId.value = oauth?.clientId ? parseInt(oauth.clientId, 10) : undefined
})
