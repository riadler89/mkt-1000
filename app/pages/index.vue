<template>
  <PageComponent slug="homepage" data-testid="home-page-content">
    <template #loading>
      <SFContentPageSkeletonLoader />
    </template>
  </PageComponent>
</template>

<script setup lang="ts">
import { sanitizeCanonicalURL } from '@scayle/storefront-nuxt'
import { useAvailableShops } from '@scayle/storefront-nuxt/composables'
import type { OnlineStore, WithContext } from 'schema-dts'
import { join } from 'pathe'
import {
  useHead,
  useSeoMeta,
  definePageMeta,
  useSwitchLocalePath,
} from '#imports'
import { useNuxtApp, useRequestURL, useRuntimeConfig } from '#app'
import { useRoute } from '#app/composables/router'
import PageComponent from '#storefront-cms/components/PageComponent.vue'
import { useJsonld } from '~/composables/useJsonld'
import SFContentPageSkeletonLoader from '~/components/SFContentPageSkeletonLoader.vue'
import { type Locale, useI18n } from '#i18n'
import { useRouteHelpers } from '~/composables'

const route = useRoute()
const availableShops = useAvailableShops()
const i18n = useI18n()
const switchLocalePath = useSwitchLocalePath()
const { getLocalizedHref } = useRouteHelpers()
const { origin } = useRequestURL()
const config = useRuntimeConfig()
useSeoMeta({ robots: 'index,follow' })

useHead({
  link: [
    {
      rel: 'canonical',
      key: 'canonical',
      href: sanitizeCanonicalURL(
        `${origin}${join(config.app.baseURL, route?.fullPath)}`,
      ),
    },
    ...availableShops.value.flatMap((shop) => {
      const href = getLocalizedHref(
        shop.path as Locale,
        switchLocalePath(shop.path as Locale),
      )

      const links = [
        {
          rel: 'alternate',
          hreflang: shop.locale,
          href,
        },
      ]
      if (shop.path === i18n.defaultLocale) {
        links.push({
          rel: 'alternate',
          hreflang: 'x-default',
          href,
        })
      }
      return links
    }),
  ],
})

defineOptions({ name: 'HomePage' })
definePageMeta({ pageType: 'homepage' })

const {
  $config: {
    public: { shopName },
  },
} = useNuxtApp()

useJsonld(
  () =>
    ({
      '@context': 'https://schema.org',
      '@type': 'OnlineStore',
      name: shopName,
      url: origin,
      logo: `${origin}${join(config.app.baseURL, 'logo.svg')}`,
    }) as WithContext<OnlineStore>,
)
</script>
