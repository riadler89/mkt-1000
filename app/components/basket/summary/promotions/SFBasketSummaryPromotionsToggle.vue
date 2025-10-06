<template>
  <SFButton
    variant="raw"
    class="flex items-center !gap-1 !p-0 text-md font-semibold leading-4 text-secondary"
    :aria-expanded="visible.toString()"
    @click="visible = !visible"
  >
    {{ $t('basket_summary.discount') }}
    <template #append-icon>
      <IconChevronUp v-if="visible" class="mt-px !size-3.5" />
      <IconChevronDown v-else class="mt-px !size-3.5" />
    </template>
  </SFButton>
</template>

<script setup lang="ts">
import { SFButton } from '#storefront-ui/components'

const visible = defineModel('visible', { type: Boolean, default: false })
</script>
