<template>
  <section class="container my-10 overflow-hidden py-2 max-md:max-w-none">
    <!-- eslint-disable-next-line vue/no-undef-components -->
    <subscription-cancellation
      v-if="isSubscriptionCancellationWebComponentLoaded"
      :base-url="apiUrl"
      :shop-id="shopId"
    />
  </section>
</template>

<script setup lang="ts">
import useSubscriptionWebComponent from '../composables/useSubscriptionWebComponent'
import { useHead, definePageMeta } from '#imports'
import { useI18n } from '#i18n'
import { useCurrentShop } from '#storefront/composables'

const currentShop = useCurrentShop()
const shopId = currentShop.value.shopId

const {
  apiUrl,
  isSubscriptionCancellationWebComponentLoaded,
  loadCancellationPage,
} = useSubscriptionWebComponent()

loadCancellationPage()

const i18n = useI18n()
useHead({
  titleTemplate: (pageTitle) => pageTitle ?? null,
  title: i18n.t('subscription_page.headline'),
})

definePageMeta({ pageType: 'subscription-cancellation' })
</script>
