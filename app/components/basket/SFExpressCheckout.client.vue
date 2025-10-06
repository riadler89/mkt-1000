<template>
  <!--
    We need to use a `key` to force the web component to re-render when the breakpoint changes.
    Otherwise, the component will not be rendered when it gets teleported to a different
    DOM node.
  -->
  <scayle-express-checkout
    v-if="ready"
    :key="`express-checkout-desktop-${isDesktop}`"
    origin="web"
    :jwt="checkoutJwt"
    :access-token="accessToken"
    :consent="JSON.stringify(consent)"
    :basket-total="basket?.cost.withTax"
    @consent-missing="onConsentMissing"
    @express-error="onExpressError"
    @out-of-constraints="onOutOfConstraints"
    @express-checkout-finished="onExpressCheckoutFinished"
  />
</template>
<script setup lang="ts">
import { watch, computed, reactive } from 'vue'
import { useBasket, useLog, useRpc } from '@scayle/storefront-nuxt/composables'
import { navigateTo } from '#app/composables/router'
import {
  useCheckoutWebComponent,
  useRouteHelpers,
  useToast,
} from '~/composables'
import { useI18n } from '#i18n'
import { useDefaultBreakpoints } from '#storefront-ui/composables'

const isDesktop = computed(
  () => useDefaultBreakpoints().greaterOrEqual('lg').value,
)

const log = useLog('SFExpressCheckout')

log.warn(
  '<SFExpressCheckout /> does not handle consent management by default. Please adjust the consent object to respect the users consent based on your implemented consent management.',
)

const consent = reactive<Record<string, boolean>>({
  paypal: true,
  klarna: true,
})

const { apiInitialized: authApiInitialized, authApi } =
  useCheckoutWebComponent()

const { data, status: getCheckoutTokenStatus } = useRpc(
  'getCheckoutToken',
  'getCheckoutToken',
  undefined,
  {
    server: false,
    dedupe: 'defer',
  },
)
const accessToken = computed(() => data.value?.accessToken)
const checkoutJwt = computed(() => data.value?.checkoutJwt)

watch(accessToken, (accessToken) => {
  if (accessToken && authApi.value?.getAccessToken() !== accessToken) {
    authApi.value?.setAccessToken(accessToken)
  }
})

const { data: basket } = useBasket()
const ready = computed(
  () =>
    // `getCheckoutToken` shares cache with `getCheckoutToken` from the `checkout` page.
    //  We need to wait for the status to be success to avoid initializing the checkout with an outdated token.
    getCheckoutTokenStatus.value === 'success' &&
    !!basket.value &&
    !!authApiInitialized.value,
)

const toast = useToast()

type ExpressCheckoutConsentMissingEvent = Event & {
  detail: {
    paymentKey: string
    provider: string
  }
}

const onConsentMissing = (e: ExpressCheckoutConsentMissingEvent) => {
  log.warn(
    `The consent is missing for the payment provider ${e.detail.provider}. Adding "${e.detail.provider}: false" to the consent object.`,
  )
  consent[e.detail.provider] = false
}

type ExpressCheckoutSDKError = {
  message: string
  paymentKey: string
  provider: string
}

type ExpressCheckoutApiError = {
  url: string
  statusCode: number
  errorKey:
    | 'device_not_supported'
    | 'payment_method_not_available'
    | 'psp_session_creation_failed'
    | 'failed_to_fetch_session'
    | 'basket_not_found'
    | 'basket_invalid'
    | 'error_shipping_address_validation_failed'
    | 'failed_dependency'
  message: string
}

type ExpressCheckoutErrorEvent = Event & {
  detail: ExpressCheckoutSDKError | ExpressCheckoutApiError
}

const i18n = useI18n()
const onExpressError = (error: ExpressCheckoutErrorEvent) => {
  if (typeof error?.detail === 'object' && 'errorKey' in error.detail) {
    const getErrorMessage = (errorKey: ExpressCheckoutApiError['errorKey']) => {
      switch (errorKey) {
        case 'device_not_supported':
          return i18n.t('expressCheckout.error.deviceNotSupported')
        case 'payment_method_not_available':
          return i18n.t('expressCheckout.error.paymentMethodNotAvailable')
        case 'psp_session_creation_failed':
          return i18n.t('expressCheckout.error.pspSessionCreationFailed')
        case 'failed_to_fetch_session':
          return i18n.t('expressCheckout.error.failedToFetchSession')
        case 'basket_not_found':
          return i18n.t('expressCheckout.error.basketNotFound')
        case 'basket_invalid':
          return i18n.t('expressCheckout.error.basketInvalid')
        case 'error_shipping_address_validation_failed':
          return i18n.t(
            'expressCheckout.error.errorShippingAddressValidationFailed',
          )
        case 'failed_dependency':
          return i18n.t('expressCheckout.error.failedDependency')
        default:
          return i18n.t('expressCheckout.error.unknownError')
      }
    }

    toast.show(getErrorMessage(error.detail.errorKey), {
      action: 'CONFIRM',
      type: 'ERROR',
    })

    return
  }

  toast.show(i18n.t('expressCheckout.error.unknownError'), {
    action: 'CONFIRM',
    type: 'ERROR',
  })
}

type ExpressCheckoutFinishedEvent = Event & {
  detail: {
    isFinalized: boolean
    orderId: number
    id: string
  }
}

const { getExpressCheckoutRoute } = useRouteHelpers()
const onExpressCheckoutFinished = async (
  event: ExpressCheckoutFinishedEvent,
) => {
  if (event.detail.isFinalized) {
    log.debug('Express checkout in a single step is not supported.')
    return
  }

  await navigateTo(getExpressCheckoutRoute(event.detail.id))
}

const onOutOfConstraints = () => {
  toast.show(i18n.t('expressCheckout.error.outOfConstraints'), {
    action: 'CONFIRM',
    type: 'ERROR',
  })
}
</script>
