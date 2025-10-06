import { useNuxtApp } from '#app'
import { defineNuxtRouteMiddleware, navigateTo } from '#app/composables/router'
import { useLocalePath, useRouteBaseName } from '#i18n'
import { useCurrentShop, useUser } from '#storefront/composables'
import { getProtectedRouteList, routeList, type LinkList } from '~/utils/route'

export default defineNuxtRouteMiddleware(async (to, from) => {
  const currentShop = useCurrentShop()

  if (to.path.includes('/api') || !currentShop.value) {
    return
  }

  const nuxt = useNuxtApp()
  const getLocalePath = useLocalePath()
  const userComposable = await useUser({
    key: 'authGuard-user',
    immediate: false,
  })

  const localePath = (routePath: LinkList[keyof LinkList]['path']) => {
    return getLocalePath(routePath) || routePath
  }

  const getRouteBaseName = useRouteBaseName()
  const isProtectedRoute = (exclude?: string): boolean => {
    const routes = getProtectedRouteList(exclude)
    const targetBaseName = getRouteBaseName(to)

    return routes.some(
      (protectedRoute) => protectedRoute.name === targetBaseName,
    )
  }

  if (!nuxt.ssrContext && !userComposable.user.value && isProtectedRoute()) {
    await userComposable.refresh()
  }

  const user = nuxt?.ssrContext
    ? nuxt?.ssrContext?.event?.context?.$rpcContext?.user
    : userComposable.user.value

  // If the user is not logged in and attempts to access protected routes, redirect them to the signin page
  if (!user && isProtectedRoute()) {
    return navigateTo({
      path: localePath(routeList.signin.path),
      query: {
        redirectUrl: to.fullPath,
      },
    })
  }

  const localizedSignInPath = localePath(routeList.signin.path)

  // If the user is not logged in and attempts to access the signin page from any
  // other page except signin page itself, attach previous route redirect URL
  if (
    !user &&
    to.path === localizedSignInPath &&
    to.fullPath !== from.fullPath &&
    !to.query.redirectUrl
  ) {
    if (from.name === to.name) {
      return
    }

    return navigateTo({
      path: to.fullPath,
      query: {
        ...to.query,
        redirectUrl: from.fullPath,
      },
    })
  }

  // If the user is already logged in and tries to access the signin page, redirect them to the home page.
  // "to.path" is used to cover all signin path variants (e.g ignoring "register" query param)
  if (user && to.path === localizedSignInPath) {
    return navigateTo({ path: localePath(routeList.home.path) })
  }

  const isGuest = !!user?.status?.isGuestCustomer

  // If the user is a guest, navigate to the redirect URL or home page
  if (user && isGuest && isProtectedRoute()) {
    const redirectPath =
      (to.query.redirectUrl as string) || localePath(routeList.home.path)
    return navigateTo({ path: redirectPath })
  }
})
