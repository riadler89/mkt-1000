<template>
  <div
    v-if="hasSubscriptionData"
    class="overflow-hidden border-gray-300 max-lg:rounded-lg max-lg:border"
  >
    <div
      class="border-gray-300 px-4 py-2.5 text-md font-semibold text-primary max-lg:border-b max-lg:bg-gray-100 lg:pl-0 lg:text-sm"
      data-testid="main-label"
    >
      {{ $t('subscription.subscription') }}:
    </div>
    <div class="space-y-2 px-4 py-2.5 lg:pl-0 lg:pt-0">
      <div
        v-for="attribute in subscriptionAttributes"
        :key="attribute.label"
        class="flex gap-1"
      >
        <div
          class="text-md font-semibold leading-none text-secondary lg:text-sm"
          data-testid="main-label"
        >
          {{ attribute.label }}:
        </div>
        <div
          class="text-md font-normal leading-none text-secondary lg:text-sm"
          data-testid="sub-label"
        >
          {{ attribute.value }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BasketItem } from '@scayle/storefront-nuxt'
import useSubscriptionAttributes from '../composables/useSubscriptionAttributes'

const { basketItem } = defineProps<{ basketItem: BasketItem }>()

const { hasSubscriptionData, subscriptionAttributes } =
  useSubscriptionAttributes(basketItem)
</script>
