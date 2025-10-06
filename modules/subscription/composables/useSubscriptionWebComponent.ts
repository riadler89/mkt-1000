import { ref } from 'vue'
import { useHead } from '#imports'
import { useRuntimeConfig } from '#app'
import { useLog, useRpc } from '#storefront/composables'

const isSubscriptionOverviewWebComponentLoaded = ref(false)
const isSubscriptionCancellationWebComponentLoaded = ref(false)

export default () => {
  const runtimeConfig = useRuntimeConfig()
  const { overviewWebHost, cancellationWebHost, apiUrl } =
    runtimeConfig.public.subscription

  const log = useLog('useSubscriptionWebComponent')

  const loadOverviewPage = () => {
    if (!overviewWebHost?.length) {
      log.error(
        'Cannot load subscription overview web component, host is not configured as environment variable.',
      )
      return
    }

    useHead({
      script: [
        {
          defer: true,
          src: overviewWebHost,
          onload() {
            isSubscriptionOverviewWebComponentLoaded.value = true
          },
        },
      ],
    })
  }
  const loadCancellationPage = () => {
    if (!cancellationWebHost?.length) {
      log.error(
        'Cannot load subscription cancellation web component, host is not configured as environment variable.',
      )
      return
    }

    useHead({
      script: [
        {
          type: 'module',
          src: cancellationWebHost,
          onload() {
            isSubscriptionCancellationWebComponentLoaded.value = true
          },
        },
      ],
    })
  }

  const { data: accessToken } = useRpc(
    'getAccessToken',
    'subscription-accessToken',
    { forceTokenRefresh: true },
    { server: false },
  )

  return {
    isSubscriptionOverviewWebComponentLoaded,
    isSubscriptionCancellationWebComponentLoaded,
    loadCancellationPage,
    loadOverviewPage,
    apiUrl,
    accessToken,
  }
}
