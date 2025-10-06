<template>
  <div class="relative flex gap-2">
    <Transition
      enter-from-class="translate-y-4 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      enter-active-class="transition ease-linear duration-200"
      leave-active-class="transition ease-linear duration-200 delay-100"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-4 opacity-0"
    >
      <div v-if="areFiltersCleared" class="absolute size-full">
        <div
          class="flex h-full items-center space-x-2 rounded-xl bg-status-success-light p-3 px-4 font-semibold leading-none text-status-success"
        >
          <IconCheckGreen class="my-auto size-4" />
          <span>{{ $t('filter.notification.all_filters_cleared') }}</span>
        </div>
      </div>
    </Transition>
    <SFButton
      data-testid="reset-filter-button"
      variant="tertiary"
      size="lg"
      class="w-1/2"
      @click="$emit('reset')"
    >
      {{ $t('filter_actions.reset_all_filter') }}
    </SFButton>
    <SFButton
      autofocus
      data-testid="apply-filter-button"
      size="lg"
      class="w-1/2"
      @click="toggle()"
    >
      {{ showResultsLabel }}
    </SFButton>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { SFButton } from '#storefront-ui/components'
import { useI18n } from '#i18n'
import { useSlideIn } from '#storefront-ui'

const { filteredProductCount, areFiltersCleared } = defineProps<{
  filteredProductCount: number
  areFiltersCleared: boolean
}>()

const { t } = useI18n()

const { toggle } = useSlideIn('FilterSlideIn')

defineEmits<{ reset: [] }>()

const showResultsLabel = computed(() => {
  return filteredProductCount
    ? t('filter_actions.show_results_with_count', {
        count: filteredProductCount,
      })
    : t('filter_actions.show_results')
})
</script>
