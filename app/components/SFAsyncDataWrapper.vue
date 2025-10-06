<template>
  <slot v-if="data && status !== 'error'" :data="data" />
  <slot v-else-if="status === 'pending' || status === 'idle'" name="loading" />
  <slot v-else-if="status === 'error'" name="error">
    <slot name="loading" />
  </slot>
</template>

<script setup lang="ts" generic="T">
import { computed, toValue } from 'vue'
import type { AsyncDataRequestStatus, AsyncData } from '#app'

const { asyncData } = defineProps<{
  asyncData: AsyncData<T, unknown> | Awaited<AsyncData<T, unknown>>
}>()

const status = computed<AsyncDataRequestStatus>(() => toValue(asyncData.status))
const data = computed<T>(() => toValue(asyncData.data))

defineSlots<{
  default(props: { data: NonNullable<T> }): unknown
  loading(): unknown
  error(): unknown
}>()
</script>
