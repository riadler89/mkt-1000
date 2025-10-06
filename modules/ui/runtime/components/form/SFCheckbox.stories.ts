import type { ComponentPropsAndSlots } from '@storybook-vue/nuxt'
import SFCheckbox from './SFCheckbox.vue'

/**
 * SFCheckbox is a form control component that allows users to select one or multiple options.
 * It supports both single boolean values and multiple selection with array values.
 * The component includes a custom styled checkbox with a check icon and optional label.
 */
export default {
  title: 'Base Components/SFCheckbox',
  component: SFCheckbox,
  argTypes: {
    modelValue: {
      control: 'object',
      description:
        'The current value(s) of the checkbox. Can be a boolean for single selection or an array for multiple selection.',
    },
  },
  render: (args: ComponentPropsAndSlots<typeof SFCheckbox>) => ({
    components: { SFCheckbox },
    setup() {
      return { args }
    },
    template: `<SFCheckbox v-bind="args" />`,
  }),
}

/**
 * Basic checkbox with a simple label for single selection.
 * Used for boolean values like "I agree to terms" or "Subscribe to newsletter".
 */
export const Default = {
  args: {
    id: 'checkbox-default',
    label: 'Accept terms and conditions',
    modelValue: false,
  },
}

/**
 * Checkbox with custom label via slot.
 * Demonstrates how to use the label slot for more complex content.
 */
export const CustomLabel = {
  render: (args: ComponentPropsAndSlots<typeof SFCheckbox>) => ({
    components: { SFCheckbox },
    setup() {
      return { args }
    },
    template: `
    <SFCheckbox v-bind="args">
      <template #label>
        <span class="text-sm">
          I agree to the 
          <a href="#" class="text-accent underline">Terms of Service</a> 
          and 
          <a href="#" class="text-accent underline">Privacy Policy</a>
        </span>
      </template>
    </SFCheckbox>`,
  }),
  args: {
    id: 'checkbox-custom-label',
    modelValue: false,
  },
}
