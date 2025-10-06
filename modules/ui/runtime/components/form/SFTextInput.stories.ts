import type { ComponentPropsAndSlots, Meta } from '@storybook-vue/nuxt'
import { ref } from 'vue'
import SFTextInput from './SFTextInput.vue'

/**
 * SFTextInput is a comprehensive text input component with floating labels.
 * It automatically handles label positioning, focus states, and error display.
 * The component supports various input types and includes append icon slots for additional functionality.
 */
export default {
  title: 'Base Components/SFTextInput',
  component: SFTextInput,
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'date'],
    },
  },
  render: (args: ComponentPropsAndSlots<typeof SFTextInput>) => ({
    components: { SFTextInput },
    setup() {
      return { args }
    },
    template: `<SFTextInput v-bind="args" />`,
  }),
}

/**
 * Basic text input with placeholder.
 * Shows the default state with floating label behavior.
 */
export const Default = {
  args: {
    placeholder: 'Enter your name',
    modelValue: '',
  },
}

/**
 * Password input type.
 * Demonstrates the component configured for password input.
 */
export const Password = {
  args: {
    placeholder: 'Password',
    type: 'password',
    modelValue: '',
  },
}

/**
 * Date input type.
 * Demonstrates the component configured for date selection.
 */
export const DateInput = {
  args: {
    placeholder: 'Birth date',
    type: 'date',
    modelValue: '',
  },
}

/**
 * Input with append icon.
 * Demonstrates how to add icons or buttons to the right side of the input.
 */
export const WithAppendIcon = {
  render: (args: ComponentPropsAndSlots<typeof SFTextInput>) => ({
    components: { SFTextInput },
    setup() {
      const modelValue = ref('')
      return { args, modelValue }
    },
    template: `
    <SFTextInput v-bind="args" v-model="modelValue">
      <template #append-icon>
        <button 
          @click="modelValue = ''"
          type="button"
          class="flex h-full w-full items-center justify-center text-secondary hover:text-primary"
        >
          <IconClose class="size-4" />
        </button>
      </template>
    </SFTextInput>`,
  }),
  args: {
    placeholder: 'Search products',
    modelValue: 'shirt',
  },
} satisfies Meta<typeof SFTextInput>
