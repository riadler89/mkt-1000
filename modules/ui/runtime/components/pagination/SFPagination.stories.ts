import type { ComponentPropsAndSlots, Meta } from '@storybook-vue/nuxt'
import SFPagination from './SFPagination.vue'
import { useRoute } from '#app'

/**
 * SFPagination is a comprehensive pagination component that displays page navigation controls.
 * It automatically handles page calculations, navigation arrows, and ellipsis for large page counts.
 * The component provides extensive slot customization for different pagination layouts.
 */
export default {
  title: 'Base Components/SFPagination',
  component: SFPagination,
  render: (args: ComponentPropsAndSlots<typeof SFPagination>) => ({
    components: { SFPagination },
    setup() {
      return { args }
    },
    template: `<SFPagination v-bind="args" />`,
  }),
}

/**
 * Basic pagination with few pages.
 * Shows the component with a small number of pages where all are visible.
 */
export const Default = {
  args: {
    totalPageCount: 3,
    visible: 6,
  },
}

/**
 * Pagination with many pages.
 * Demonstrates how the component handles large page counts with ellipsis.
 */
export const ManyPages = {
  args: {
    totalPageCount: 15,
    visible: 6,
  },
  render: (args: ComponentPropsAndSlots<typeof SFPagination>) => ({
    components: { SFPagination },
    setup() {
      const route = useRoute()
      route.query.page = '5'
      return { args }
    },
    template: `<SFPagination v-bind="args" />`,
  }),
}

/**
 * Pagination with single page.
 * Demonstrates the component behavior when there's only one page.
 */
export const SinglePage = {
  args: {
    totalPageCount: 1,
    visible: 6,
  },
}

/**
 * Pagination with custom slots.
 * Shows how to customize the pagination layout using slots.
 */
export const CustomSlots = {
  render: (args: ComponentPropsAndSlots<typeof SFPagination>) => ({
    components: { SFPagination },
    setup() {
      return { args }
    },
    template: `
    <SFPagination v-bind="args">
      <template #previous-button="{ canNavigateLeft, previousPage }">
        <button 
          :disabled="!canNavigateLeft"
          class="flex px-3 py-2 text-sm disabled:opacity-50"
        >
          ← Previous
        </button>
      </template>
      
      <template #next-button="{ canNavigateRight, nextPage }">
        <button 
          :disabled="!canNavigateRight"
          class="flex px-3 py-2 text-sm disabled:opacity-50"
        >
          Next →
        </button>
      </template>
    </SFPagination>`,
  }),
  args: {
    totalPageCount: 8,
    visible: 6,
  },
} satisfies Meta<typeof SFPagination>
