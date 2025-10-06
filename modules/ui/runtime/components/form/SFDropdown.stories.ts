import type { ComponentPropsAndSlots, Meta } from '@storybook-vue/nuxt'
import { ref } from 'vue'
import SFDropdown from './SFDropdown.vue'

/**
 * SFDropdown is a customizable dropdown component that displays a list of selectable items.
 * It supports custom item rendering, keyboard navigation, and mobile-responsive behavior.
 * The component automatically handles positioning and accessibility features.
 */
export default {
  title: 'Base Components/SFDropdown',
  component: SFDropdown,
  argTypes: {
    radius: {
      control: { type: 'select' },
      options: ['md', 'xl'],
    },
  },
  render: (args: ComponentPropsAndSlots<typeof SFDropdown>) => ({
    components: { SFDropdown },
    setup() {
      const selectedItem = ref(args.items[0])
      return { args, selectedItem }
    },
    template: `<SFDropdown v-bind="args">
      <template #default>
        <span class="max-w-[80%] overflow-hidden text-ellipsis !text-md">
          {{ selectedItem }}
        </span>
      </template>
    </SFDropdown>`,
  }),
}

/**
 * Basic dropdown with simple string items.
 * The default slot displays the selected value, and the item slot renders each option.
 */
export const Default = {
  args: {
    id: 'dropdown-default',
    items: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
    modelValue: 'Option 1',
  },
}

/**
 * Dropdown with custom item rendering.
 * Demonstrates how to use the item slot to create custom layouts for each option.
 */
export const CustomItems = {
  render: (args: ComponentPropsAndSlots<typeof SFDropdown>) => ({
    components: { SFDropdown },
    setup() {
      const selectedItem = ref(args.items[0])
      return { args, selectedItem }
    },
    template: `
    <SFDropdown v-bind="args" v-model="selectedItem">
      <span class="text-secondary !text-md">{{ selectedItem.name }}</span>
      <template #item="{ item, selectItem }">
        <div 
          class="flex items-center justify-between gap-4 p-2 hover:bg-gray-100 cursor-pointer"
          @click="selectItem(item)"
        >
          <span class="whitespace-nowrap">{{ item.name }}</span>
          <span class="text-sm text-secondary">{{ item.description }}</span>
        </div>
      </template>
    </SFDropdown>`,
  }),
  args: {
    id: 'dropdown-custom',
    items: [
      { name: 'Basic Plan', description: '$9/month' },
      { name: 'Pro Plan', description: '$19/month' },
      { name: 'Enterprise', description: '$49/month' },
    ],
    buttonClass: 'w-64',
    modelValue: { name: 'Basic Plan', description: '$9/month' },
  },
} satisfies Meta<typeof SFDropdown>
