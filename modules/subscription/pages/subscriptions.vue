<template>
  <div>
    <SFHeadline
      class="mb-5 xl:mb-7"
      tag="h2"
      data-testid="subscriptions-headline"
    >
      {{ $t('subscription_page.headline') }}
    </SFHeadline>
    <subscription-overview
      v-if="isSubscriptionOverviewWebComponentLoaded && accessToken"
      :base-url="apiUrl"
      :customer-token="accessToken"
      :shop-id="shopId"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import useSubscriptionWebComponent from '../composables/useSubscriptionWebComponent'
import { useI18n } from '#i18n'
import { useSeoMeta, definePageMeta } from '#imports'
import { useCurrentShop } from '#storefront/composables'
import { SFHeadline } from '#storefront-ui/components'

const currentShop = useCurrentShop()
const shopId = currentShop.value.shopId

const {
  isSubscriptionOverviewWebComponentLoaded,
  apiUrl,
  loadOverviewPage,
  accessToken,
} = useSubscriptionWebComponent()

onMounted(() => loadOverviewPage())

const { t } = useI18n()

useSeoMeta({
  robots: 'noindex, nofollow',
  title: t('subscription_page.meta.title'),
  description: t('subscription_page.meta.description'),
})

definePageMeta({ pageType: 'subscription' })
defineOptions({ name: 'SubscriptionPage' })
</script>
