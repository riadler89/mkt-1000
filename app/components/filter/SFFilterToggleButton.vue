<template>
  <SFButton
    class="group relative w-full !justify-start rounded-md border border-black !px-3.5 !py-2 text-md font-semibold max-md:h-11 md:w-min md:border-gray-400 md:bg-gray-100 md:hover:bg-white"
    data-testid="filter-toggle-button"
    size="sm"
    variant="raw"
    @click="toggleFilter"
  >
    <template #icon="{ _class }">
      <IconFilter class="group-hover:text-accent md:hidden" :class="_class" />
    </template>
    {{ label }}
    <span
      v-if="appliedFiltersCount"
      class="right-3 inline-flex size-5 items-center justify-center rounded bg-gray-300 text-sm text-secondary max-md:absolute max-md:bg-primary max-md:text-white md:size-4"
      data-testid="filter-toggle-counter"
    >
      {{ appliedFiltersCount }}
    </span>

    <template #append-icon="{ _class }">
      <IconFilter
        class="group-hover:text-accent max-md:hidden"
        :class="_class"
      />
    </template>
  </SFButton>
</template>

<script setup lang="ts">
import { useSlideIn } from '#storefront-ui'
import { SFButton } from '#storefront-ui/components'
import { useAppliedFilters } from '#storefront-product-listing'
import { useRoute } from '#app/composables/router'

defineProps<{ label: string }>()

const { appliedFiltersCount } = useAppliedFilters(useRoute())

const { toggle: toggleFilter } = useSlideIn('FilterSlideIn')
</script>
