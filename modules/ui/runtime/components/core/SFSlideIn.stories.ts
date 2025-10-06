import type { ComponentPropsAndSlots, Meta } from '@storybook-vue/nuxt'
import { fn } from 'storybook/test'
import SFHeadline from '../headlines/SFHeadline.vue'
import { useSlideIn } from '../../composables'
import SFButton from './SFButton.vue'
import SFSlideIn from './SFSlideIn.client.vue'

/**
 * SFSlideIn is a client-side slide-in panel component that provides a side overlay interface
 * for additional content, forms, or navigation. It's commonly used for filters, shopping carts,
 * user menus, and detailed information panels that need to be accessible without losing context.
 *
 * Key features:
 * - Responsive design (full screen on mobile, side panel on desktop)
 * - Focus trap for accessibility and keyboard navigation
 * - Backdrop click to close functionality
 * - Escape key support for closing
 * - Route change handling with configurable close behavior
 * - Structured slots for header, body, and actions
 * - Smooth slide animations with backdrop
 */
export default {
  title: 'Base Components/SFSlideIn',
  component: SFSlideIn,
  args: {
    onOpen: fn(),
    onClose: fn(),
  },
  argTypes: {
    slideClass: {
      control: 'select',
      options: ['p-4', 'p-6', 'p-8'],
    },
  },
}

/**
 * Basic slide-in with header, body, and actions. This is the most common usage pattern
 * for filters, shopping carts, and detailed information panels.
 */
export const Default = {
  render: (args: ComponentPropsAndSlots<typeof SFSlideIn>) => ({
    components: { SFSlideIn, SFButton, SFHeadline },
    setup() {
      const { toggle, close, isOpen } = useSlideIn('filterPanel')
      return { args, isOpen, toggle, close }
    },
    template: `
    <div class="p-4">
      <SFButton @click="toggle">Open Filter Panel</SFButton>
      <SFSlideIn name="filterPanel" v-model:is-open="isOpen" v-bind="args">
        <template #slide-in-header="{ toggle }">
          <div class="flex items-center justify-between">
            <SFHeadline tag="h2" size="lg">Product Filters</SFHeadline>
            <SFButton
                class="group my-3 -mr-2 bg-gray-200 md:bg-transparent hover:md:bg-gray-200"
                fab
                variant="raw"
                data-testid="close-filters"
                :aria-label="$t('filter_header.close')"
                @click="toggle"
                >
                <template #icon>
                    <IconClose
                    class="size-4 md:text-secondary group-hover:md:text-primary"
                    />
                </template>
            </SFButton>
          </div>
        </template>
        <template #slide-in-body>
          <div class="p-6 space-y-6">
            <div>
              <h3 class="font-semibold mb-3">Categories</h3>
              <div class="divide-y">
                <label class="flex items-center py-4">
                  <input type="checkbox" class="mr-2"> Clothing
                </label>
                <label class="flex items-center py-4">
                  <input type="checkbox" class="mr-2"> Electronics
                </label>
                <label class="flex items-center py-4">
                  <input type="checkbox" class="mr-2"> Home & Garden
                </label>
              </div>
            </div>
            <div>
              <h3 class="font-semibold mb-3">Price Range</h3>
              <div class="divide-y">
                <label class="flex items-center py-4">
                  <input type="radio" name="price" class="mr-2"> Under $50
                </label>
                <label class="flex items-center py-4">
                  <input type="radio" name="price" class="mr-2"> $50 - $100
                </label>
                <label class="flex items-center py-4">
                  <input type="radio" name="price" class="mr-2"> Over $100
                </label>
              </div>
            </div>
          </div>
        </template>
        <template #slide-in-actions>
          <div class="flex gap-2">
            <SFButton variant="secondary" @click="close">Clear All</SFButton>
            <SFButton @click="close">Apply Filters</SFButton>
          </div>
        </template>
      </SFSlideIn>
    </div>`,
  }),
} satisfies Meta<typeof SFSlideIn>
