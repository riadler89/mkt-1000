<template>
  <SFAsyncStatusWrapper :status="status">
    <SFEmptyState
      v-if="ordersCount === 0"
      :title="$t('order_list.no_orders.title')"
      :description="$t('order_list.no_orders.description')"
    />
    <div v-else>
      <SFHeadline tag="h2" data-testid="orders-headline" class="mb-5 xl:mb-7">
        {{ $t('orders_page.title') }}
        <span
          v-if="ordersCount"
          class="ml-1 inline-flex h-4.5 items-center rounded-full bg-primary px-2 text-sm font-semibold leading-4 text-white"
        >
          {{ ordersCount }}
        </span>
      </SFHeadline>
      <SFOrderList :items="orders" :count="ordersCount" />
    </div>
    <NuxtPage />
    <template #loading>
      <SFOrderSkeletonLoader />
    </template>
  </SFAsyncStatusWrapper>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSeoMeta, definePageMeta } from '#imports'
import SFEmptyState from '~/components/SFEmptyState.vue'
import { useI18n } from '#i18n'
import { NuxtPage } from '#components'
import { useUser } from '#storefront/composables'
import SFOrderSkeletonLoader from '~/components/order/SFOrderSkeletonLoader.vue'
import SFAsyncStatusWrapper from '~/components/SFAsyncStatusWrapper.vue'
import SFOrderList from '~/components/order/SFOrderList.vue'
import { SFHeadline } from '#storefront-ui/components'

const { t } = useI18n()

const { status, user } = useUser()

const orders = computed(() => user?.value?.orderSummary ?? [])

const ordersCount = computed(() => orders.value.length)

useSeoMeta({
  robots: 'noindex, nofollow',
  title: t('orders_page.meta.title'),
  description: t('orders_page.meta.description'),
})

defineOptions({ name: 'OrderHistoryPage' })
definePageMeta({ pageType: 'account_area:orders' })
</script>
