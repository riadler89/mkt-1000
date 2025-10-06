import type { ComponentPropsAndSlots, Meta } from '@storybook-vue/nuxt'
import { ref } from 'vue'
import SFChip from './SFChip.vue'

/**
 * SFChip is a selectable chip component that functions as a checkbox with enhanced visual styling.
 * It's commonly used in filter interfaces, tag selection, and multi-select scenarios where
 * users need to choose from a set of options with clear visual feedback.
 *
 * Key features:
 * - Checkbox functionality with `v-model` support for arrays
 * - Hover and selected state visual feedback
 * - Accessible with proper ARIA labels
 * - Generic type support for flexible data handling
 * - Slot-based content rendering for custom labels
 */
export default {
  title: 'Base Components/SFChip',
  component: SFChip,
  argTypes: {
    modelValue: {
      control: 'object',
      description:
        'The array of selected values. Use `v-model` to bind to this prop for two-way data binding.',
    },
  },
  render: (args: ComponentPropsAndSlots<typeof SFChip>) => ({
    components: { SFChip },
    setup() {
      const selectedItems = ref<string[]>([])
      return { args, selectedItems }
    },
    template: `<SFChip v-model="selectedItems" v-bind="args">{{ args.default }}</SFChip>`,
  }),
}

/**
 * Basic chip with text content. This is the most common usage pattern
 * where the chip displays a simple text label that can be selected/deselected.
 */
export const Default = {
  args: {
    item: 'option1',
    default: 'Option 1',
    inputAriaLabel: 'Select Option 1',
  },
}

/**
 * Multiple chips in a group demonstrate how chips work together in a filter
 * or multi-select interface. Each chip maintains its own selection state
 * while contributing to a shared selection array.
 */
export const ChipGroup = {
  render: (args: ComponentPropsAndSlots<typeof SFChip>) => ({
    components: { SFChip },
    setup() {
      const selectedItems = ref<string[]>([])
      return { args, selectedItems }
    },
    template: `
    <div class="flex flex-wrap gap-2">
      <SFChip v-model="selectedItems" item="small" input-aria-label="Select Small">
        Small
      </SFChip>
      <SFChip v-model="selectedItems" item="medium" input-aria-label="Select Medium">
        Medium
      </SFChip>
      <SFChip v-model="selectedItems" item="large" input-aria-label="Select Large">
        Large
      </SFChip>
      <SFChip v-model="selectedItems" item="xlarge" input-aria-label="Select X-Large">
        X-Large
      </SFChip>
    </div>
    <div class="mt-4 text-sm text-gray-600">
      Selected: {{ selectedItems.join(', ') || 'None' }}
    </div>`,
  }),
} satisfies Meta<typeof SFChip>

/**
 * Pre-selected chips show the component in its checked state.
 * This is useful for displaying existing selections or default values.
 */
export const PreSelected = {
  render: (args) => ({
    components: { SFChip },
    setup() {
      const selectedItems = ref<string[]>(['option1', 'option3'])
      return { args, selectedItems }
    },
    template: `
    <div class="flex flex-wrap gap-2">
      <SFChip v-model="selectedItems" item="option1" input-aria-label="Select Option 1">
        Option 1
      </SFChip>
      <SFChip v-model="selectedItems" item="option2" input-aria-label="Select Option 2">
        Option 2
      </SFChip>
      <SFChip v-model="selectedItems" item="option3" input-aria-label="Select Option 3">
        Option 3
      </SFChip>
    </div>
    <div class="mt-4 text-sm text-gray-600">
      Selected: {{ selectedItems.join(', ') }}
    </div>`,
  }),
} satisfies Meta<typeof SFChip>
