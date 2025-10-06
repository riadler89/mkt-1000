import type {
  GuestRequest,
  LoginRequest,
  RegisterRequest,
  UpdatePasswordByHashRequest,
} from '@scayle/storefront-nuxt'
import { useRouter } from '#app/composables/router'
import { clearNuxtData } from '#app/composables/asyncData'
import { useRouteHelpers, useToast, useTrackingEvents } from '~/composables'
import type { AuthTrackingEvent, AuthenticationType } from '~~/types/tracking'
import { useI18n, useRouteBaseName } from '#i18n'
import {
  useBasket,
  useLog,
  useSession,
  useUser,
  useWishlist,
} from '#storefront/composables'
import { routeList } from '~/utils'
import { useApplyPromotions } from '#storefront-promotions/composables/useApplyPromotions'

export interface UseAuthenticationReturn {
  /**
   * An async function that handles the authentication process for a regular user
   * @throws {FetchError} If the authentication process fails
   */
  login: (data: Omit<LoginRequest, 'shop_id'>) => Promise<void>
  /**
   * An async function that handles the authentication process for a guest user
   * @throws {FetchError} If the authentication process fails
   */
  guestLogin: (data: Omit<GuestRequest, 'shop_id'>) => Promise<void>
  /**
   * An async function that handles logging out the user
   * @throws {FetchError} If the logout process fails
   */
  logout: () => Promise<void>
  /**
   * An async function that handles registering the user
   * @throws {FetchError} If the registration process fails
   */
  register: (data: Omit<RegisterRequest, 'shop_id'>) => Promise<void>
  /**
   * An async function that handles the password recovery process for a specific user
   * @throws {FetchError} If the password recovery process fails
   */
  forgotPassword: (email: string) => Promise<void>
  /**
   * An async function that handles resetting the password using a hash
   * @throws {FetchError} If the password reset process fails
   */
  resetPasswordByHash: (
    data: Omit<UpdatePasswordByHashRequest, 'shop_id'>,
  ) => Promise<void>
  /**
   * An async function that handles login through an identity provider (IDP)
   * @throws {FetchError} If the login through an identity provider (IDP) fails
   */
  loginIDP: (code: string) => Promise<void>
  /** A function that is called when authentication succeeds */
  authenticated: (
    event: AuthTrackingEvent,
    successMessage?: string,
  ) => Promise<void>
  /** Map an AuthTrackingEvent to a localized message */
  messageForEvent: (event: AuthTrackingEvent) => string | undefined
}

/**
 * A composable for authentication actions and data manipulation.
 * In addition of interacting with the authentication, it also takes care of tracking,
 * handling errors and displaying success toast messages.

 * @param method - Authentication type method
 * @returns An {@link UseAuthenticationReturn} object containing reactive authentication data and functions.
 */
export function useAuthentication(
  method: AuthenticationType = 'email',
): UseAuthenticationReturn {
  const $i18n = useI18n()
  const router = useRouter()
  const routeBaseName = useRouteBaseName()

  const toast = useToast()

  const { trackAuthenticated, trackLogout } = useTrackingEvents()

  const session = useSession()
  const { localizedNavigateTo } = useRouteHelpers()
  const log = useLog('useAuthentication')

  const { refresh: refreshWishlist } = useWishlist()
  const { refresh: refreshBasket, data: basketData } = useBasket()
  const { user, refresh: refreshUser, customerType } = useUser()
  const { applyPromotions } = useApplyPromotions({ basket: basketData })

  const refresh = async (): Promise<void> => {
    await Promise.all([refreshUser(), refreshWishlist(), refreshBasket()])
    // After the a user logs in the "logged out" basket gets merged with the users basket.
    // The users basket could contain items where a promotion can be applied.
    await applyPromotions()
  }

  const login = async (data: Omit<LoginRequest, 'shop_id'>): Promise<void> => {
    try {
      await session.login(data)
      await authenticated(
        'login',
        $i18n.t('authentication.notification.success.login'),
      )
    } catch (error) {
      trackFailedAuthentication(data.email, 'login')
      handleError(error, 'login')
      throw error
    }
  }

  const loginIDP = async (code: string): Promise<void> => {
    try {
      await session.loginWithIDP({ code })
      await authenticated(
        'login',
        $i18n.t('authentication.notification.success.login'),
      )
    } catch (error) {
      handleError(error, 'login')
      throw error
    }
  }

  const guestLogin = async (
    data: Omit<GuestRequest, 'shop_id'>,
  ): Promise<void> => {
    try {
      await session.guestLogin(data)
      await authenticated(
        'guest_login',
        $i18n.t('authentication.notification.success.guest_login'),
      )
    } catch (error) {
      trackFailedAuthentication(data.email, 'guest_login')
      handleError(error, 'guest_login')
      throw error
    }
  }

  const register = async (
    data: Omit<RegisterRequest, 'shop_id'>,
  ): Promise<void> => {
    try {
      await session.register(data)
      await authenticated(
        'sign_up',
        $i18n.t('authentication.notification.success.sign_up'),
      )
    } catch (error) {
      trackFailedAuthentication(data.email, 'sign_up')
      handleError(error, 'sign_up')
      throw error
    }
  }

  const forgotPassword = async (email: string): Promise<void> => {
    try {
      await session.forgetPassword({ email })
      toast.show(
        $i18n.t('authentication.notification.success.forgot_password'),
        {
          action: 'CONFIRM',
          type: 'INFO',
        },
      )
    } catch (error) {
      trackFailedAuthentication(email, 'forgot_password')
      handleError(error, 'forgot_password')
      throw error
    }
  }

  const resetPasswordByHash = async (
    data: Omit<UpdatePasswordByHashRequest, 'shop_id'>,
  ): Promise<void> => {
    try {
      await session.resetPasswordByHash(data)
      await authenticated(
        'reset_password',
        $i18n.t('authentication.notification.success.reset_password'),
      )
    } catch (error) {
      handleError(error, 'reset_password')
      throw error
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await session.revokeToken()
      // we call `useUser` in templates/nuxt/app/middleware/authGuard.global.ts with the key `authGuard-user`.
      // We need to delete the user data for this key on logout to reset the state in the auth guard.
      // Without deleting the date, the auth guard would allow navigating to protected pages for logged out users.
      clearNuxtData('authGuard-user')

      //  Clear the `localStorage` used by Checkout so it does not attempt to use the revoked tokens
      window.localStorage.removeItem('scayle:auth:accessToken')
      window.localStorage.removeItem('scayle:auth:refreshToken')

      if (user.value) {
        trackLogout()
      }
    } catch (error) {
      handleError(error, 'logout')
      throw error
    } finally {
      await refresh()
      redirectUser(routeList.home.path)
    }
  }

  const messageForEvent = (event: AuthTrackingEvent) => {
    switch (event) {
      case 'login':
        return $i18n.t('authentication.notification.success.login')
      case 'sign_up':
        return $i18n.t('authentication.notification.success.sign_up')
      case 'forgot_password':
        return $i18n.t('authentication.notification.success.forgot_password')
      case 'reset_password':
        return $i18n.t('authentication.notification.success.reset_password')
      case 'guest_login':
        return $i18n.t('authentication.notification.success.guest_login')
      default:
        return undefined
    }
  }

  /**
   * After a user was authenticated by login in, or registering.
   * Refresh user data, basket & wishlist.
   */
  const authenticated = async (
    event: AuthTrackingEvent,
    successMessage?: string,
  ): Promise<void> => {
    await refresh()

    if (!user.value) {
      return
    }

    await trackAuthenticated(
      {
        event,
        method,
        status: 'successful',
        customer_id: user.value.id,
        customer_type: customerType.value,
      },
      user.value.email,
    )

    // When authenticating through the sign in page, we want to redirect and toast
    // but when logging in through checkout simply track the event and refresh the user.
    const route = router.currentRoute.value
    if (routeBaseName(route) !== 'checkout') {
      await redirectUser(
        (route.query.redirectUrl as string) ?? routeList.home.path,
      )

      if (successMessage) {
        toast.show(successMessage, { action: 'CONFIRM', type: 'SUCCESS' })
      }
    }
  }

  const trackFailedAuthentication = async (
    email: string,
    event: AuthTrackingEvent,
  ): Promise<void> => {
    await trackAuthenticated(
      {
        event,
        method,
        status: 'error',
      },
      email,
    )
  }

  const handleError = (error: unknown, event: AuthTrackingEvent): void => {
    // remove user data (email, password) from the error object, before logging it

    // @ts-expect-error Property 'config' does not exist on type '{}'.ts(2339)
    delete error?.config?.data
    log.error(`Error while ${event} was called.`, {
      error,
    })
  }

  const redirectUser = async (redirectTo: string) => {
    const route = router.currentRoute.value
    return route.fullPath === redirectTo
      ? window.location.reload()
      : await localizedNavigateTo(redirectTo)
  }

  return {
    login,
    guestLogin,
    logout,
    register,
    forgotPassword,
    resetPasswordByHash,
    loginIDP,
    authenticated,
    messageForEvent,
  }
}
