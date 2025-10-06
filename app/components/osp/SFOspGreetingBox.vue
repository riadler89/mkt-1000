<template>
  <div
    class="flex flex-col items-center gap-2 rounded-xl bg-status-success-light p-5"
    data-testid="osp-greeting-box"
  >
    <div class="mb-2 w-fit rounded-full border-2 border-primary bg-white p-1.5">
      <IconCheckmark class="size-6" />
    </div>
    <SFHeadline
      size="lg"
      class="flex items-center"
      data-testid="osp-greeting-box-headline"
    >
      {{ $t('order_success_page_greeting.title') }}
    </SFHeadline>
    <p class="text-sm text-secondary">
      {{ $t('order_success_page_greeting.email_confirmation') }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { Order } from '~~/types/order'
import { SFHeadline } from '#storefront-ui/components'

defineProps<{ orderData: Order }>()
</script>
