<!-- eslint-disable vue/no-v-html -->
<template>
  <SFLocalizedLink
    data-testid="display-all-results"
    :to="getSearchRoute(searchTerm)"
    :aria-label="showMoreAriaLabel"
    class="!flex h-11 max-w-fit rounded transition-all duration-150 hover:right-1 hover:bg-gray-200 hover:px-1.5 focus:bg-gray-200 focus:px-1.5 lg:h-5"
  >
    <span
      class="truncate text-md font-normal leading-5 text-secondary max-lg:py-3 lg:text-md"
      v-html="showMoreLabel"
    />
  </SFLocalizedLink>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import DOMpurify from 'dompurify'
import { useI18n } from '#i18n'
import { useRouteHelpers } from '~/composables'
import SFLocalizedLink from '~/components/SFLocalizedLink.vue'

const { searchTerm } = defineProps<{ searchTerm: string }>()

const { getSearchRoute } = useRouteHelpers()

const { t } = useI18n()

const showMoreLabel = computed(() => {
  const regex = new RegExp(searchTerm.replaceAll(' ', '|'), 'gi')
  return DOMpurify.sanitize(
    t('show_all_results_link.open_on_search_page', { searchTerm }).replace(
      regex,
      '<span class="font-semibold">$&</span>',
    ),
    {
      ALLOWED_TAGS: ['span'],
    },
  )
})
const showMoreAriaLabel = computed(() => {
  return DOMpurify.sanitize(
    t('show_all_results_link.open_on_search_page', { searchTerm }),
  )
})
</script>
