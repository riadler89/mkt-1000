import type { StoryObj, ComponentPropsAndSlots } from '@storybook-vue/nuxt'
import type { Value } from '@scayle/storefront-nuxt'
import type { SortLink, SelectedSort } from '@scayle/storefront-product-listing'
import SFFilterSlideIn from './SFFilterSlideIn.vue'
import { useSlideIn } from '#storefront-ui'
import { SFButton } from '#storefront-ui/components'

/**
 * SFFilterSlideIn provides a slide-in panel for product filtering and sorting options.
 * It includes various filter types like price ranges, attributes, boolean filters,
 * and sorting options with a clean mobile-first interface.
 */
export default {
  title: 'Filter/SFFilterSlideIn',
  component: SFFilterSlideIn,
  render: (args: ComponentPropsAndSlots<typeof SFFilterSlideIn>) => ({
    components: { SFFilterSlideIn, SFButton },
    setup() {
      const { toggle, isOpen } = useSlideIn('FilterSlideIn')
      return { args, toggle, isOpen }
    },
    template: `
      <div class="w-full max-w-screen-sm flex justify-center">
        <SFButton size="md" @click="toggle()">Toggle filter</SFButton>
        <SFFilterSlideIn v-bind="args" />
      </div>
    `,
  }),
}

type Story = StoryObj<typeof SFFilterSlideIn>

/**
 * Shows the filter slide-in with all available options including sorting and image type selection.
 * Displays the complete filtering interface with various filter types and sorting options.
 */
export const Default: Story = {
  argTypes: {
    hideSorting: {
      control: false,
    },
  },
  args: (() => {
    const sortLinks: SortLink[] = [
      { key: 'newest', label: 'Newest', to: '?sort=newest' },
      { key: 'price-asc', label: 'Price asc', to: '?sort=price-asc' },
      { key: 'price-desc', label: 'Price desc', to: '?sort=price-desc' },
    ]

    const primaryImageTypeOptions: Value[] = [
      { id: 1, label: 'Model', value: 'model' },
      { id: 2, label: 'Model 1', value: 'model_1' },
    ]
    const selectedSort: SelectedSort = { key: 'newest', label: 'Newest' }

    return {
      currentCategoryId: 1,
      hideSorting: false,
      sortLinks,
      selectedSort,
      primaryImageTypeOptions,
    }
  })(),
}

export const Mobile: Story = {
  name: 'Mobile',
  args: (() => {
    const sortLinks: SortLink[] = [
      { key: 'newest', label: 'Newest', to: '?sort=newest' },
      { key: 'price-asc', label: 'Price asc', to: '?sort=price-asc' },
      { key: 'price-desc', label: 'Price desc', to: '?sort=price-desc' },
    ]

    const primaryImageTypeOptions: Value[] = [
      { id: 1, label: 'Model', value: 'model' },
      { id: 2, label: 'Model 1', value: 'model_1' },
    ]
    const selectedSort: SelectedSort = { key: 'newest', label: 'Newest' }

    return {
      currentCategoryId: 1,
      hideSorting: false,
      sortLinks,
      selectedSort,
      primaryImageTypeOptions,
    }
  })(),
  globals: {
    viewport: { value: 'mobile2', isRotated: false },
  },
}
/**
 * Shows the filter slide-in without primary image type options.
 * Displays the basic filtering interface without image type selection.
 */
export const NoImageTypeOptions: Story = {
  name: 'No image type options',
  args: (() => {
    const sortLinks: SortLink[] = [
      { key: 'newest', label: 'Newest', to: '?sort=newest' },
      { key: 'price-asc', label: 'Price asc', to: '?sort=price-asc' },
    ]
    const selectedSort: SelectedSort = { key: 'newest', label: 'Newest' }

    return {
      currentCategoryId: 1,
      hideSorting: false,
      sortLinks,
      selectedSort,
    }
  })(),
}
