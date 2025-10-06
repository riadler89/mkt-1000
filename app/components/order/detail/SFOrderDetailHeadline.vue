<template>
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-4">
      <SFButton
        variant="raw"
        fab
        size="sm"
        class="size-10 border border-gray-300"
        data-testid="back-to-order-list"
        :aria-label="$t('global.back')"
        :to="link"
      >
        <IconChevronLeft class="size-4 text-secondary" />
      </SFButton>
      <SFHeadline tag="h2" data-testid="order-detail-headline">
        {{ $t('order_detail_page.title', { id }) }}
      </SFHeadline>
    </div>
    <SFOrderStatus :status="status" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { OrderStatus } from '@scayle/storefront-nuxt'
import SFOrderStatus from '../SFOrderStatus.vue'
import { SFHeadline, SFButton } from '#storefront-ui/components'
import { routeList } from '~/utils'
import { useRouteHelpers } from '~/composables'
import { useRouter } from '#app/composables/router'

const { id, status } = defineProps<{ id: number; status: OrderStatus }>()

const { options } = useRouter()

const link = computed(() => {
  const previousRoute = (options?.history?.state?.back as string) ?? ''
  return previousRoute.includes(routeList.orders.path)
    ? previousRoute
    : getLocalizedRoute(routeList.orders)
})

const { getLocalizedRoute } = useRouteHelpers()
</script>
