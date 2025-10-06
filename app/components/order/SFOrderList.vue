<template>
  <div v-if="currentPage <= totalPageCount" class="flex flex-col items-center">
    <ul class="w-full">
      <li
        v-for="{ id, confirmedAt, itemCount, status } in itemsBatch"
        :key="id"
        class="mb-6 last-of-type:mb-0"
      >
        <SFOrderCard
          :id="id"
          :confirmed-at="confirmedAt"
          :status="status"
          :item-count="itemCount"
        />
      </li>
    </ul>
    <SFPagination
      v-if="totalPageCount > 1"
      :total-page-count="totalPageCount"
      class="mt-10"
    />
  </div>
  <SFEmptyState
    v-else
    :title="$t('order_list.no_orders.title')"
    :description="$t('order_list.no_orders.description')"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { OrderSummary } from '@scayle/storefront-nuxt'
import SFOrderCard from '~/components/order/SFOrderCard.vue'
import { SFPagination } from '#storefront-ui/components'
import { useRoute } from '#app/composables/router'
import SFEmptyState from '~/components/SFEmptyState.vue'

const ORDERS_PER_PAGE = 8

const route = useRoute()

const { items, count } = defineProps<{
  /**
   * Array of order objects containing order details like ID, date, status, and item count.
   */
  items: OrderSummary[]
  /**
   * Total number of orders available. Used for pagination calculations.
   */
  count: number
}>()

const currentPage = computed(() => Number(route.query.page) || 1)

const totalPageCount = computed(() => Math.ceil(count / ORDERS_PER_PAGE))

const itemsBatch = computed(() => {
  const startIndex = (currentPage.value - 1) * ORDERS_PER_PAGE
  return items.slice(startIndex, startIndex + ORDERS_PER_PAGE)
})
</script>
