<template>
  <div id="ayCheckoutContainer" class="min-h-[85vh]">
    <scayle-checkout
      v-if="ready"
      ref="checkoutRef"
      :access-token="accessToken"
      :jwt="checkoutJwt"
      header-element="#header"
      :transaction-id="$route.query.transactionId"
      @error="handleError"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref, watch } from 'vue'
import { useEventListener } from '@vueuse/core'
import type { CheckoutEvent } from '@scayle/storefront-nuxt'
import { useSeoMeta, definePageMeta } from '#imports'
import {
  useCheckoutWebComponent,
  useCheckoutStepTrackingInterceptor,
} from '~/composables'
import { useBasket, useLog, useUser, useRpc } from '#storefront/composables'
import { useI18n } from '#i18n'
import { useApplyPromotions } from '#storefront-promotions/composables/useApplyPromotions'
import { isEqual } from '~/utils'

const { refresh: refreshBasket, status, data: basket } = useBasket()

const { applyPromotions } = useApplyPromotions({ basket })

const { user, refresh: refreshUser } = useUser()

const { t } = useI18n()
const { apiInitialized: authApiInitialized, authApi } =
  useCheckoutWebComponent()

const {
  data,
  clear,
  refresh,
  status: getCheckoutTokenStatus,
} = useRpc('getCheckoutToken', 'getCheckoutToken', undefined, {
  server: false,
  dedupe: 'defer',
})

const accessToken = computed(() => data.value?.accessToken)
const checkoutJwt = computed(() => data.value?.checkoutJwt)

watch(accessToken, (accessToken) => {
  if (accessToken && authApi.value?.getAccessToken() !== accessToken) {
    authApi.value?.setAccessToken(accessToken)
  }
})

const ready = computed(
  () =>
    checkoutJwt.value &&
    authApiInitialized &&
    // `getCheckoutToken` shares cache with `getCheckoutToken` from the `SFExpressCheckout` component.
    // Therefore we already have data. We need to wait for the status to be success to avoid initializing the checkout with an outdated token.
    getCheckoutTokenStatus.value === 'success',
)

const log = useLog('CheckoutPage')

useCheckoutStepTrackingInterceptor()

const checkoutRef = ref(null)

// If the user logs in through the checkout web component we need to
// refresh and remount with the new basket id representing the merged basket.
watch(
  () => user.value,
  (newUser, oldUser) => {
    if (!isEqual(newUser, oldUser)) {
      clear()
      refresh()
    }
  },
)

const onCheckoutUpdate = async (
  event: MessageEvent<CheckoutEvent>,
  fetching: boolean,
  fetchCallback: () => Promise<void>,
) => {
  if (fetching) {
    return
  } // prevent multiple fetches
  if (event?.data?.type === 'tracking') {
    const actionType = event.data.event?.event

    if (actionType === 'add_to_cart' || actionType === 'remove_from_cart') {
      await fetchCallback()
      // Update promotions in case some got applicable after the cart was updated
      await applyPromotions()
    }
  }
}

// Refresh basket if the user changes quantity or removes an item at checkout
useEventListener('message', (event) =>
  onCheckoutUpdate(event, status.value === 'pending', refreshBasket),
)

onBeforeMount(async () => {
  await Promise.all([refreshBasket(), refreshUser()])
  await applyPromotions(basket)
})

const handleError = (payload = {}) => {
  console.error('Checkout web component ran into an error: ', payload)
  const loggingPayload = JSON.stringify({
    userId: user.value?.id,
    checkoutJwt: checkoutJwt.value,
  })
  log.error('[onCheckoutError]', loggingPayload)
}

useSeoMeta({ robots: 'index,follow', title: t('checkout_page.title') })

defineOptions({ name: 'CheckoutPage' })
definePageMeta({ pageType: 'checkout', layout: 'simple' })
</script>
