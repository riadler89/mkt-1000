import { ref, computed } from 'vue'
import { useEventListener } from '@vueuse/core'
import { useClientId } from './useClientId'
import { useAuthentication } from './useAuthentication'
import { useRoute, useScript } from '#imports'
import { useCurrentShop, useRpcCall, useLog } from '#storefront/composables'
import type { AuthTrackingEvent } from '~~/types/tracking'
import type {
  RefreshTokenHook,
  ExchangeAuthCodeHook,
  Scayle,
} from '~~/types/checkout'

type AuthAPI = Scayle['auth']['V3']
type AUTH_FLOW_SOURCE =
  | 'login'
  | 'login-guest'
  | 'register'
  | 'new-password'
  | 'init'

function mapSourceToTrackingEventType(
  source: AUTH_FLOW_SOURCE,
): AuthTrackingEvent {
  if (source === 'login-guest') {
    return 'guest_login'
  }
  if (source === 'register') {
    return 'sign_up'
  }
  if (source === 'new-password') {
    return 'reset_password'
  }
  return 'login'
}

// Global because we only load and initialize checkout once
const apiInitialized = ref(false)

export function useCheckoutWebComponent() {
  const log = useLog('useCheckoutWebComponent')
  const handleAuthCode = useRpcCall('handleIDPLoginCallback')
  const refreshAccessToken = useRpcCall('refreshAccessToken')
  const getAccessToken = useRpcCall('getAccessToken')
  const getExternalIdpRedirect = useRpcCall('getExternalIdpRedirect')

  const currentShop = useCurrentShop()
  const { authenticated, messageForEvent } = useAuthentication()
  const clientId = useClientId()

  const tryGetAccessToken = async () => {
    try {
      return await getAccessToken({ forceTokenRefresh: false })
    } catch {
      log.error('Unable to get access token')
      return undefined
    }
  }

  useScript(
    `${currentShop.value?.checkout.host}/frontend/checkout-wc/js?appId=${currentShop.value?.shopId}`,
    {
      key: 'checkout-wc',
      bundle: false,
      tagPriority: 'high',
      warmupStrategy: 'preload',
      trigger: 'client',
    },
  )

  useEventListener('scayle.auth.ready', () => {
    initCheckoutAuth(window.scayle.auth.V3)
  })

  const route = useRoute()
  const idpParams = computed(() => ({
    queryParams:
      typeof route.query.redirectUrl === 'string'
        ? { redirectUrl: route.query.redirectUrl }
        : undefined,
  }))

  const exchangeAuthCodeHook: ExchangeAuthCodeHook = async ({ authCode }) => {
    await handleAuthCode({ code: authCode })
    const accessToken = await tryGetAccessToken()

    if (!accessToken) {
      throw new Error('Unable to get access token')
    }

    return { accessToken }
  }

  const refreshTokenHook: RefreshTokenHook = async (code) => {
    if ('authorizationCode' in code && code.authorizationCode) {
      await handleAuthCode({ code: code.authorizationCode })
      const accessToken = await tryGetAccessToken()

      if (!accessToken) {
        throw new Error('Unable to get access token')
      }

      return { accessToken }
    }

    await refreshAccessToken()
    const accessToken = await tryGetAccessToken()

    if (!accessToken) {
      throw new Error('Unable to get access token')
    }

    return { accessToken }
  }

  async function initCheckoutAuth(auth: AuthAPI) {
    // clear any old data
    window.localStorage.removeItem('scayle:auth:accessToken')
    window.localStorage.removeItem('scayle:auth:refreshToken')

    auth.events.listen(
      // @ts-expect-error the string is correct but because of nominal typing typescript throws an error
      'auth:success',
      ({ source }: { source: AUTH_FLOW_SOURCE }) => {
        // Ignore the event fired on init since that isn't really an authentication event, we're already logged in.
        if (source === 'init') {
          return
        }
        const event = mapSourceToTrackingEventType(source)
        authenticated(event, messageForEvent(event))
      },
    )

    const accessToken = await tryGetAccessToken()

    if (!clientId.value) {
      throw new Error('Unable to load clientId')
    }

    auth.geIdentitiesProviders = async () => {
      const redirects = await getExternalIdpRedirect(idpParams.value)
      return Object.entries(redirects).map(([key, redirectUrl]) => ({
        key,
        driver: key,
        redirectUrl,
      }))
    }

    const isAuthenticated = await auth.init({
      clientId: clientId.value,
      accessToken,
      hooks: {
        exchangeAuthCodeHook,
        refreshTokenHook,
      },
    })

    apiInitialized.value = true

    log.info('Auth API initialized')
    if (isAuthenticated) {
      log.info('User is already authenticated')
    } else {
      log.info('User needs to log in')
    }
  }

  return {
    apiInitialized,
    authApi: computed(() =>
      apiInitialized.value ? window.scayle.auth.V3 : undefined,
    ),
  }
}
