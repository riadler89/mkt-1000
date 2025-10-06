<template>
  <SFFadeInTransition>
    <div
      v-if="message"
      class="flex items-center space-x-2 rounded-xl bg-status-error-light px-4 py-3 text-sm font-semibold leading-4 text-primary lg:mt-0.5"
    >
      <IconErrorHexagon class="size-4 fill-white text-primary" />
      <span class="flex-1">{{ message }}</span>
    </div>
  </SFFadeInTransition>
</template>

<script lang="ts" setup>
import { SFFadeInTransition } from '#storefront-ui/components'

defineProps<{ message: string | null | undefined }>()
</script>
