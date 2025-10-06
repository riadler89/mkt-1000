<template>
  <div class="flex flex-row justify-center">
    <div
      class="mx-4 flex h-14 max-w-full flex-row items-center justify-between gap-1 rounded-md border md:w-min md:gap-2"
    >
      <slot
        :can-navigate-left="canNavigateLeft"
        :previous-page="previousPage"
        name="previous-button"
      >
        <SFPaginationButton
          v-if="previousPage"
          :disabled="!canNavigateLeft"
          :page="previousPage"
          data-testid="paginationButton-previousPage"
          :aria-label="$t('pagination.a11y.go_to_previous_page')"
        >
          <IconChevronLeft class="size-4" />
        </SFPaginationButton>
      </slot>

      <slot name="first-page" :first-page="firstPage">
        <SFPaginationButton
          v-if="firstPage && isFirstOrLastPageButtonShown"
          :page="firstPage"
          data-testid="paginationButton-firstPage"
        />
      </slot>

      <slot name="first-dots">
        <div
          v-if="areFirstDotsShown"
          class="inline-flex h-full items-center border-t-2 border-transparent text-sm font-bold leading-none text-secondary"
        >
          ...
        </div>
      </slot>

      <slot name="page-buttons" :limited-pages="limitedPages">
        <template v-for="page in limitedPages" :key="page?.number">
          <SFPaginationButton v-if="page" :page="page" />
        </template>
      </slot>

      <slot name="second-dots">
        <div
          v-if="areSecondDotsShown"
          class="inline-flex h-full items-center border-t-2 border-transparent text-sm font-bold leading-none text-secondary"
        >
          ...
        </div>
      </slot>

      <slot name="last-page" :last-page="lastPage">
        <SFPaginationButton
          v-if="lastPage && isFirstOrLastPageButtonShown"
          :page="lastPage"
          data-testid="paginationButton-lastPage"
        />
      </slot>

      <slot
        name="next-button"
        :can-navigate-right="canNavigateRight"
        :next-page="nextPage"
      >
        <SFPaginationButton
          v-if="nextPage"
          :disabled="!canNavigateRight"
          :page="nextPage"
          data-testid="paginationButton-nextPage"
          :aria-label="$t('pagination.a11y.go_to_pnext_page')"
        >
          <IconChevronRight class="size-4" />
        </SFPaginationButton>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { usePagination, type Page } from '#storefront-ui'
import { SFPaginationButton } from '#storefront-ui/components'

const { visible = 6, totalPageCount } = defineProps<{
  /** Total number of pages available for navigation. */
  totalPageCount: number
  /** Number of page buttons to display at once (default: 6). */
  visible?: number
}>()

const {
  limitedPages,
  previousPage,
  nextPage,
  canNavigateLeft,
  canNavigateRight,
  areFirstDotsShown,
  areSecondDotsShown,
  firstPage,
  lastPage,
} = usePagination(
  () => visible,
  () => totalPageCount,
)

const isFirstOrLastPageButtonShown = computed(() => {
  return totalPageCount !== 1 && totalPageCount > visible
})

defineSlots<{
  /** Custom previous button with navigation state */
  'previous-button': (props: {
    canNavigateLeft: boolean
    previousPage: Page | undefined
  }) => unknown
  /** Custom first page button */
  'first-page': (props: { firstPage: Page | undefined }) => unknown
  /** Custom first dots indicator */
  'first-dots': () => unknown
  /** Custom page buttons with limited pages */
  'page-buttons': (props: { limitedPages: (Page | undefined)[] }) => unknown
  /** Custom second dots indicator */
  'second-dots': () => unknown
  /** Custom last page button */
  'last-page': (props: { lastPage: Page | undefined }) => unknown
  /** Custom next button with navigation state */
  'next-button': (props: {
    canNavigateRight: boolean
    nextPage: Page | undefined
  }) => unknown
}>()
</script>
