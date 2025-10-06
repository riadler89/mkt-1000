import { beforeEach, describe, it, vi, expect, type Mock } from 'vitest'
import { routeFactory } from '@scayle/storefront-nuxt/test/factories'
import { toRef } from 'vue'
import authGuardMiddleware from './authGuard.global'
import type { RouteLocation } from '#vue-router'
import { useCurrentShop, useUser } from '#storefront/composables'
import { navigateTo } from '#app/composables/router'

vi.mock('#app', () => ({
  useNuxtApp: vi.fn().mockReturnValue({ ssrContext: null }),
}))

vi.mock('#app/composables/router', () => ({
  defineNuxtRouteMiddleware: vi.fn((fn) => fn),
  navigateTo: vi.fn(),
}))

vi.mock('#i18n', () => ({
  useLocalePath: vi.fn(() => vi.fn((path) => path)),
  useRouteBaseName: vi
    .fn()
    .mockReturnValue((route: RouteLocation) => route.name),
}))

vi.mock('#storefront/composables', () => ({
  useCurrentShop: vi.fn(),
  useUser: vi.fn(),
}))

describe('authGuard', async () => {
  const useCurrentShopMock = useCurrentShop as Mock
  const useUserMock = useUser as Mock

  beforeEach(() => {
    vi.clearAllMocks()
    useCurrentShopMock.mockReturnValue(toRef({ shopId: 1 }))
  })

  it('should call "navigateTo" with signin path if user is not logged in and accessing a protected route', async () => {
    useUserMock.mockReturnValue({
      user: toRef(null),
      status: 'success',
      refresh: vi.fn(),
    })

    const to = routeFactory.build({
      name: 'account',
      path: '/account',
      fullPath: '/de/account',
    })
    const from = routeFactory.build({
      name: 'home',
      path: '/',
      fullPath: '/de',
    })
    await authGuardMiddleware(to, from)

    expect(navigateTo).toHaveBeenCalledWith({
      path: '/signin',
      query: { redirectUrl: '/de/account' },
    })
  })

  it('should not redirect if accessing a non-protected route', async () => {
    useUserMock.mockReturnValue({
      user: { value: null },
      refresh: vi.fn(),
      status: 'success',
    })

    const to = routeFactory.build({ name: 'home', path: '/', fullPath: '/de' })
    const from = routeFactory.build({
      name: 'wishlist',
      path: '/wishlist',
      fullPath: '/de/wishlist',
    })

    await authGuardMiddleware(to, from)

    expect(navigateTo).not.toHaveBeenCalled()
  })

  it('should redirect to home if user is logged in and accessing signin path', async () => {
    useUserMock.mockReturnValue({
      user: { value: { id: 1 } },
      status: 'success',
      refresh: vi.fn(),
    })

    const to = routeFactory.build({
      name: 'signin',
      path: '/signin',
      fullPath: '/de/signin',
    })
    const from = routeFactory.build({
      name: 'home',
      path: '/',
      fullPath: '/de',
    })

    await authGuardMiddleware(to, from)

    expect(navigateTo).toHaveBeenCalledWith({ path: '/' })
  })

  it('should add "redirectUrl" to query if user is not logged in and navigating to signin from another page', async () => {
    useUserMock.mockReturnValue({
      user: { value: null },
      status: 'success',
      refresh: vi.fn(),
    })

    const to = routeFactory.build({
      name: 'signin',
      path: '/signin',
      fullPath: '/de/signin',
    })
    const from = routeFactory.build({
      name: 'wishlist',
      path: '/wishlist',
      fullPath: '/de/wishlist',
    })

    await authGuardMiddleware(to, from)

    expect(navigateTo).toHaveBeenCalledWith({
      path: '/de/signin',
      query: { redirectUrl: '/de/wishlist' },
    })
  })

  it('should not add "redirectUrl" to query if user is not logged in and navigating to signin from signin page', async () => {
    useUserMock.mockReturnValue({
      user: { value: null },
      status: 'success',
      refresh: vi.fn(),
    })

    const to = routeFactory.build({
      name: 'signin',
      path: '/signin',
      fullPath: '/de/signin',
    })
    const from = routeFactory.build({
      name: 'signin',
      path: '/signin',
      fullPath: '/signin?redirectUrl=/de/wishlist',
    })

    await authGuardMiddleware(to, from)

    expect(navigateTo).not.toHaveBeenCalled()
  })

  it('should redirect guest user to home if accessing protected route (excluding checkout)', async () => {
    useUserMock.mockReturnValue({
      user: { value: { id: 1, status: { isGuestCustomer: true } } },
      status: 'success',
      refresh: vi.fn(),
    })

    const to = routeFactory.build({
      name: 'account',
      path: '/account',
      fullPath: '/de/account',
    })
    const from = routeFactory.build({
      name: 'home',
      path: '/',
      fullPath: '/de',
    })

    await authGuardMiddleware(to, from)

    expect(navigateTo).toHaveBeenCalledWith({ path: '/' })
  })

  it('should not redirect guest user to home or redirect URL if accessing checkout', async () => {
    useUserMock.mockReturnValue({
      user: { value: { id: 1, status: { isGuestCustomer: true } } },
      refresh: vi.fn(),
      status: 'success',
    })

    const to = routeFactory.build({
      name: 'checkout',
      path: '/checkout',
      fullPath: '/de/checkout',
    })
    const from = routeFactory.build({
      name: 'home',
      path: '/',
      fullPath: '/de',
    })

    await authGuardMiddleware(to, from)

    expect(navigateTo).not.toHaveBeenCalled()
  })

  it('should not redirect if shop does not exist', async () => {
    useCurrentShopMock.mockReturnValue({})
    useUserMock.mockReturnValue({
      user: { value: null },
      status: 'success',
      refresh: vi.fn(),
    })

    await authGuardMiddleware(routeFactory.build(), routeFactory.build())

    expect(navigateTo).not.toHaveBeenCalled()
  })

  it('should not redirect for API path', async () => {
    useUserMock.mockReturnValue({
      user: { value: null },
      status: 'success',
      refresh: vi.fn(),
    })

    await authGuardMiddleware(
      routeFactory.build({ path: '/api/test' }),
      routeFactory.build(),
    )

    expect(navigateTo).not.toHaveBeenCalled()
  })
  it('should not fetch the user, when the the target page is not protected', async () => {
    const refreshMock = vi.fn()
    useUserMock.mockReturnValue({
      user: toRef(null),
      status: 'success',
      refresh: refreshMock,
    })

    const to = routeFactory.build({
      name: 'home',
      path: '/',
      fullPath: '/de',
    })
    const from = routeFactory.build({
      name: 'p-name-id',
      path: '/p',
      fullPath: '/de/p',
    })

    await authGuardMiddleware(to, from)
    expect(refreshMock).not.toBeCalled()
  })
})
