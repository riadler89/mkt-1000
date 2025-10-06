<template>
  <slot v-if="status === 'success'" />
  <slot v-else-if="status === 'pending' || status === 'idle'" name="loading" />
  <slot v-else-if="status === 'error'" name="error">
    <slot name="loading" />
  </slot>
</template>

<script setup lang="ts">
import type { AsyncDataRequestStatus } from '#app'

defineProps<{ status: AsyncDataRequestStatus }>()
</script>
