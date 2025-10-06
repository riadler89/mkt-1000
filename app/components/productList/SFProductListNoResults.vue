<template>
  <div
    class="flex w-full flex-col items-start rounded-xl border border-gray-300 p-8"
  >
    <SFHeadline tag="h2" size="lg" class="mb-4 text-primary">
      {{ $t('product_list_no_results.title') }}
    </SFHeadline>
    <SFHeadline class="mb-10 !font-normal text-secondary" size="md">
      {{ $t('product_list_no_results.description') }}
    </SFHeadline>
    <div
      class="flex flex-wrap items-center justify-start gap-4 max-sm:flex-col"
    >
      <SFButton
        v-if="category"
        :to="buildCategoryPath(category)"
        size="md"
        class="max-sm:w-full"
      >
        <template #icon>
          <IconChevronLeft class="size-3.5" />
        </template>
        {{
          $t('product_list_no_results.back_to_category', {
            category: category.name,
          })
        }}
      </SFButton>
      <SFButton
        v-if="areFiltersApplied"
        variant="secondary"
        size="md"
        class="max-sm:w-full"
        @click="resetFilters"
      >
        {{ $t('product_list_no_results.reset_filters') }}
      </SFButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { toRef } from 'vue'
import type { Category } from '@scayle/storefront-nuxt'
import { useRouteHelpers, useFilter } from '~/composables'
import { SFButton, SFHeadline } from '#storefront-ui/components'
import { useAppliedFilters } from '#storefront-product-listing'
import { useRoute } from '#app/composables/router'

const { category } = defineProps<{ category?: Category }>()

const currentCategory = category ? toRef(() => category) : undefined

const { buildCategoryPath } = useRouteHelpers()

const { resetFilters } = await useFilter(currentCategory?.value.id, {
  immediate: false,
})

const { areFiltersApplied } = useAppliedFilters(useRoute())
</script>
