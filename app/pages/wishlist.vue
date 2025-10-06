<template>
  <SFAsyncStatusWrapper :status="status">
    <SFEmptyState
      v-if="!count"
      :title="$t('wishlist_page.empty_wishlist_title')"
      :description="$t('wishlist_page.empty_wishlist_description')"
      icon="EmptyWishlist"
    />
    <div v-else class="container mt-8 max-sm:max-w-none">
      <SFHeadline
        tag="h1"
        class="mt-1.5 text-primary max-sm:text-2xl max-sm:leading-6 sm:mt-0"
      >
        {{ $t('wishlist_page.title') }}
        <ClientOnly>
          <SFFadeInTransition v-if="count !== undefined && count > 0" appear>
            <SFBadge
              :badge="count"
              :is-visible="count !== undefined && count > 0"
            />
          </SFFadeInTransition>
        </ClientOnly>
      </SFHeadline>

      <div
        class="mt-8 grid w-auto grid-cols-12 gap-4 xl:max-xl:grid-cols-10"
        data-testid="wishlist-items-wrapper"
      >
        <SFProductCard
          v-for="({ product, key }, index) in items"
          :id="product.id"
          :key="`product-${key}-${product}`"
          :index="index"
          :product="product"
          :campaign="campaign"
          data-testid="wishlist-card"
          class="col-span-6 mb-4 sm:col-span-4 lg:col-span-3 xl:col-span-2"
        />
      </div>
    </div>

    <template #loading>
      <div class="mt-8 grid w-auto grid-cols-12 gap-4 xl:max-xl:grid-cols-10">
        <SFProductCardSkeleton
          v-for="index in 12"
          :key="`product-loading-${index}`"
          type="custom"
          class="col-span-6 mb-4 sm:col-span-4 lg:col-span-3 xl:col-span-2"
        />
      </div>
    </template>
  </SFAsyncStatusWrapper>
</template>

<script setup lang="ts">
import { whenever } from '@vueuse/core'
import { sanitizeCanonicalURL } from '@scayle/storefront-nuxt'
import { join } from 'pathe'
import {
  useHead,
  useSeoMeta,
  definePageMeta,
  useNuxtApp,
  useRoute,
  useRequestURL,
} from '#imports'
import SFProductCardSkeleton from '~/components/product/card/SFProductCardSkeleton.vue'
import SFAsyncStatusWrapper from '~/components/SFAsyncStatusWrapper.vue'
import { useWishlistTracking } from '~/composables'
import { useWishlist, useCampaign } from '#storefront/composables'
import SFEmptyState from '~/components/SFEmptyState.vue'
import SFProductCard from '~/components/product/card/SFProductCard.vue'
import {
  SFHeadline,
  SFFadeInTransition,
  SFBadge,
} from '#storefront-ui/components'
import { ClientOnly } from '#components'
import { useI18n } from '#i18n'

const { count, status, items, products } = useWishlist()
const { origin } = useRequestURL()
const { t } = useI18n()
const { data: campaign } = useCampaign()
const { trackWishlistPage } = useWishlistTracking()

// Track the wishlist once it is loaded
whenever(
  () => status.value !== 'pending',
  () => trackWishlistPage(products.value),
  { once: true, immediate: true },
)

const { $config } = useNuxtApp()
useSeoMeta({
  robots: 'noindex, nofollow',
  title: t('wishlist_page.meta.title'),
  description: t('wishlist_page.meta.description'),
})

const route = useRoute()
useHead({
  link: [
    {
      rel: 'canonical',
      key: 'canonical',
      href: sanitizeCanonicalURL(
        `${origin}${join($config.app.baseURL, route.fullPath)}`,
      ),
    },
  ],
})
defineOptions({ name: 'WishlistPage' })
definePageMeta({ pageType: 'wishlist_page' })
</script>
