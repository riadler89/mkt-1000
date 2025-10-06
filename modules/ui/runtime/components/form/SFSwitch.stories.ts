import type { ComponentPropsAndSlots } from '@storybook-vue/nuxt'
import SFSwitch from './SFSwitch.vue'

/**
 * SFSwitch is a toggle switch component that provides a visual way to enable or disable features.
 * It includes proper accessibility attributes and supports custom thumb content via slots.
 * The component automatically handles the toggle state and provides visual feedback.
 */
export default {
  title: 'Base Components/SFSwitch',
  component: SFSwitch,
  argTypes: {
    modelValue: {
      control: 'boolean',
      description:
        'The current state of the switch. True for enabled, false for disabled.',
    },
  },
  render: (args: ComponentPropsAndSlots<typeof SFSwitch>) => ({
    components: { SFSwitch },
    setup() {
      return { args }
    },
    template: `<SFSwitch v-bind="args" />`,
  }),
}

/**
 * Basic switch with a simple label.
 * Used for simple on/off toggles like "Enable notifications" or "Dark mode".
 */
export const Default = {
  args: {
    id: 'switch-default',
    label: 'Enable notifications',
    modelValue: false,
  },
}

/**
 * Switch with custom label via slot.
 * Demonstrates how to use the label slot for more complex content.
 */
export const CustomLabel = {
  render: (args: ComponentPropsAndSlots<typeof SFSwitch>) => ({
    components: { SFSwitch },
    setup() {
      return { args }
    },
    template: `
    <SFSwitch v-bind="args">
      <template #label>
        <div class="ml-2">
          <div class="text-md font-medium">Two-factor authentication</div>
          <div class="text-sm text-secondary">Add an extra layer of security</div>
        </div>
      </template>
    </SFSwitch>`,
  }),
  args: {
    id: 'switch-custom-label',
    modelValue: false,
  },
}
