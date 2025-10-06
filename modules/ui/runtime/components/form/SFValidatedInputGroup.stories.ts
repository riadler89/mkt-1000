import type { ComponentPropsAndSlots, Meta } from '@storybook-vue/nuxt'
import SFValidatedInputGroup from './SFValidatedInputGroup.vue'
import SFTextInput from './SFTextInput.vue'

/**
 * SFValidatedInputGroup is a wrapper component that provides validation error display for form inputs.
 * It uses scoped slots to pass validation state to child components and automatically displays error messages.
 * The component integrates with Vuelidate for form validation and provides consistent error styling.
 */
export default {
  title: 'Base Components/SFValidatedInputGroup',
  component: SFValidatedInputGroup,
  render: (args: ComponentPropsAndSlots<typeof SFValidatedInputGroup>) => ({
    components: { SFValidatedInputGroup, SFTextInput },
    setup() {
      return { args }
    },
    template: `
    <SFValidatedInputGroup v-bind="args">
      <template #default="{ isValid }">
        <SFTextInput
          placeholder="Enter your email"
          :has-errors="!isValid"
          model-value=""
        />
      </template>
    </SFValidatedInputGroup>`,
  }),
}

/**
 * Validated input group with a single error.
 * Demonstrates how a single validation error is displayed.
 */
export const Default = {
  args: {
    errors: ['Please enter a valid email address'],
  },
}

/**
 * Validated input group with custom error styling.
 * Demonstrates how the component handles different types of validation errors.
 */
export const CustomErrorTypes = {
  render: (args: ComponentPropsAndSlots<typeof SFValidatedInputGroup>) => ({
    components: { SFValidatedInputGroup, SFTextInput },
    setup() {
      return { args }
    },
    template: `
    <div class="space-y-4">
      <SFValidatedInputGroup :errors="['This field is required']">
        <template #default="{ isValid }">
          <SFTextInput
            placeholder="Required field"
            :has-errors="!isValid"
            required
            model-value=""
          />
        </template>
      </SFValidatedInputGroup>

      <SFValidatedInputGroup :errors="['Please enter a valid phone number']">
        <template #default="{ isValid }">
          <SFTextInput
            placeholder="Phone number"
            type="tel"
            :has-errors="!isValid"
            model-value=""
          />
        </template>
      </SFValidatedInputGroup>

      <SFValidatedInputGroup :errors="['URL must start with http:// or https://']">
        <template #default="{ isValid }">
          <SFTextInput
            placeholder="Website URL"
            type="url"
            :has-errors="!isValid"
            model-value=""
          />
        </template>
      </SFValidatedInputGroup>
    </div>`,
  }),
  args: {},
} satisfies Meta<typeof SFValidatedInputGroup>
