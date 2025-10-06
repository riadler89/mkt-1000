<template>
  <div v-if="hasSubscriptionData" class="flex flex-col gap-2">
    <div class="text-sm font-semibold text-primary">
      {{ $t('subscription.subscription') }}
    </div>
    <ul class="flex flex-col gap-1 text-sm text-secondary">
      <li
        v-for="attribute in subscriptionAttributes"
        :key="attribute.label"
        class="flex gap-1"
      >
        <span class="font-medium"> {{ attribute.label }}: </span>
        <span>
          {{ attribute.value }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import useSubscriptionAttributes from '../composables/useSubscriptionAttributes'
import type { OrderItem } from '~~/types/order'

const { orderItem } = defineProps<{ orderItem: OrderItem }>()

const { subscriptionAttributes, hasSubscriptionData } =
  useSubscriptionAttributes(orderItem)
</script>
