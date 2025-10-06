<template>
  <SFLocalizedLink
    :to="getOrderDetailsRoute(id)"
    :data-testid="`order-detail-card-${id}`"
    :aria-label="$t('order_card.go_to_order', { orderNumber: id })"
    raw
    class="flex items-center justify-between rounded-xl border border-gray-400 bg-white p-5"
  >
    <div class="flex flex-col text-md text-secondary">
      <div class="mb-3 flex items-center gap-2.5">
        <SFHeadline
          class="text-primary"
          data-testid="order-item-headline"
          size="md"
          tag="h3"
        >
          {{ $t('order_card.title', { id }) }}
        </SFHeadline>
        <SFOrderStatus v-if="status" :status="status" />
      </div>
      <span v-if="confirmedAt" class="mb-1">
        {{ $t('order_card.order_date') }}:
        {{ formatDate(new Date(confirmedAt)) }}
      </span>
      <span v-if="itemCount">
        {{ $t('order_card.items') }}: {{ itemCount }}
      </span>
    </div>
    <SFButton
      :to="getOrderDetailsRoute(id)"
      :data-testid="`go-to-order-detail-${id}`"
      :aria-label="$t('order_card.go_to_order', { orderNumber: id })"
      variant="tertiary"
      class="mr-0.5 !size-10 !p-0"
    >
      <IconChevronRight class="size-4" />
    </SFButton>
  </SFLocalizedLink>
</template>

<script setup lang="ts">
import type { OrderStatus } from '@scayle/storefront-nuxt'
import SFLocalizedLink from '../SFLocalizedLink.vue'
import SFOrderStatus from './SFOrderStatus.vue'
import { SFHeadline, SFButton } from '#storefront-ui/components'
import { useFormat, useRouteHelpers } from '~/composables'

const { formatDate } = useFormat()
const { getOrderDetailsRoute } = useRouteHelpers()

const { id, confirmedAt, itemCount, status } = defineProps<{
  id: number
  status?: OrderStatus
  confirmedAt?: string
  itemCount?: number
}>()
</script>
