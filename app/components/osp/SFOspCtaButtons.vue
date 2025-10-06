<template>
  <div class="flex gap-4">
    <SFButton
      variant="primary"
      :to="getLocalizedRoute(routeList.home)"
      class="flex-1"
      data-testid="osp-continue-shopping-button"
    >
      {{ $t('global.continue_shopping') }}
    </SFButton>
    <SFButton
      v-if="orderData.id && !orderData.customer?.status.isGuestCustomer"
      variant="tertiary"
      class="flex-1"
      data-testid="osp-order-details-button"
      :to="getOrderDetailsRoute(orderData.id)"
    >
      {{ $t('order_success_page.go_to_order_details') }}
    </SFButton>
  </div>
</template>
<script lang="ts" setup>
import type { Order } from '~~/types/order'
import { useRouteHelpers } from '~/composables/useRouteHelpers'
import { SFButton } from '#storefront-ui/components'
import { routeList } from '~/utils/route'

defineProps<{
  orderData: Order
}>()

const { getOrderDetailsRoute, getLocalizedRoute } = useRouteHelpers()
</script>
