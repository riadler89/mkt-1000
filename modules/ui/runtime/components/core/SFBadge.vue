<template>
  <span
    class="ml-0.5 inline-flex h-4.5 items-center rounded-full bg-primary px-2 text-sm font-semibold leading-4 text-white"
  >
    {{ badge }}
  </span>
</template>

<script setup lang="ts">
defineProps<{
  /**
   * The numeric value to display in the badge. Used for showing counts, notifications, or other numeric indicators.
   */
  badge: number
}>()
</script>
