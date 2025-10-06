<template>
  <section class="flex flex-col gap-4 px-6 py-7 xl:py-4">
    <div v-if="label" class="flex items-center justify-between">
      <slot name="label">
        <SFHeadline v-if="label" tag="h4" size="lg" class="leading-normal">
          {{ label }}
          <SFBadge
            class="opacity-0"
            :class="{ 'opacity-100': badge > 0 }"
            :badge="badge"
            data-testid="filter-group-counter"
          />
        </SFHeadline>
      </slot>
      <slot name="action">
        <SFButton
          v-if="badge > 0 || showAction"
          size="sm"
          variant="raw"
          class="rounded bg-gray-200 p-1 text-sm font-medium leading-none !text-secondary xl:bg-white xl:hover:translate-x-[-4px] xl:hover:bg-gray-200"
          @click="$emit('clickReset')"
        >
          {{ resetLabel ?? $t('filter_group.reset') }}
        </SFButton>
      </slot>
    </div>
    <div>
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import { SFButton, SFHeadline, SFBadge } from '#storefront-ui/components'

const {
  resetLabel,
  label = '',
  badge = 0,
  showAction = false,
} = defineProps<{
  label?: string
  resetLabel?: string
  badge?: number
  showAction?: boolean
}>()

defineEmits<{ clickReset: [] }>()
</script>
