import { HttpStatusCode } from '@scayle/storefront-nuxt'
import { defineNuxtRouteMiddleware, navigateTo } from '#app/composables/router'

export const normalizeURLPath = (path: string): string => {
  while (path.endsWith('/') && path.length > 1) {
    path = path.slice(0, -1)
  }
  return path || '/'
}

export default defineNuxtRouteMiddleware((to) => {
  if (to.path !== '/' && to.path.endsWith('/')) {
    const nextPath = normalizeURLPath(to.path)

    return navigateTo(
      { path: nextPath, query: to.query, hash: to.hash },
      {
        redirectCode: HttpStatusCode.MOVED_PERMANENTLY,
      },
    )
  }
})
