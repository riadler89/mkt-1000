import type { ComponentPropsAndSlots } from '@storybook-vue/nuxt'
import SFSliderArrowButton from './SFSliderArrowButton.vue'

/**
 * SFSliderArrowButton provides navigation controls for slider/carousel components.
 * It offers directional navigation with customizable styling and behavior options.
 *
 * Key features:
 * - Left and right directional controls
 * - Optional inverted radius styling
 */
export default {
  title: 'Base Components/SFSliderArrowButton',
  component: SFSliderArrowButton,
  argTypes: {
    direction: {
      control: {
        type: 'select',
      },
      options: ['left', 'right'],
    },
    onClick: {
      action: 'clicked',
      description:
        'Event handler for button clicks. Use this to handle navigation between slider items.',
    },
  },
  render: (args: ComponentPropsAndSlots<typeof SFSliderArrowButton>) => ({
    components: { SFSliderArrowButton },
    setup() {
      return { args }
    },
    template:
      '<SFSliderArrowButton class="bg-white" v-bind="args">Button</SFSliderArrowButton>',
  }),
}

/**
 * Shows both left and right navigation buttons side by side.
 */
export const BothDirections = {
  render: (args: ComponentPropsAndSlots<typeof SFSliderArrowButton>) => ({
    components: { SFSliderArrowButton },
    setup() {
      return { args }
    },
    template: `
      <div class="flex gap-2">
        <SFSliderArrowButton v-bind="args" class="bg-white" direction="left">Left</SFSliderArrowButton>
        <SFSliderArrowButton v-bind="args" class="bg-white" direction="right">Right</SFSliderArrowButton>
      </div>
    `,
  }),
}

/**
 * Demonstrates a single navigation button.
 */
export const SingleDirection = {
  args: {
    direction: 'left',
    disabled: false,
    invertedRadius: false,
    translateOnHover: false,
  },
}

/**
 * Shows navigation buttons with inverted radius styling.
 */
export const BothDirectionsInverted = {
  render: (args: ComponentPropsAndSlots<typeof SFSliderArrowButton>) => ({
    components: { SFSliderArrowButton },
    setup() {
      return { args }
    },
    template: `
      <div class="flex gap-2">
        <SFSliderArrowButton v-bind="args" class="bg-white" direction="left" inverted-radius>Left</SFSliderArrowButton>
        <SFSliderArrowButton v-bind="args" class="bg-white" direction="right" inverted-radius>Right</SFSliderArrowButton>
      </div>
    `,
  }),
}
