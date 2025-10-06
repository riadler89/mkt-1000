import type { ComponentPropsAndSlots, Meta } from '@storybook-vue/nuxt'
import SFSliderArrowButton from '../core/SFSliderArrowButton.vue'
import SFItemsSlider from './SFItemsSlider.vue'

/**
 * SFItemsSlider is a versatile slider component that supports both horizontal and vertical scrolling.
 * It includes navigation arrows, thumbnail support, and smooth scrolling behavior.
 * The component is commonly used for image galleries, product carousels, and content sliders.
 */
export default {
  title: 'Base Components/SFItemsSlider',
  component: SFItemsSlider,
  argTypes: {
    mode: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
    },
  },
  render: (args: ComponentPropsAndSlots<typeof SFItemsSlider>) => ({
    components: { SFItemsSlider, SFSliderArrowButton },
    setup() {
      return { args }
    },
    template: `
    <SFItemsSlider
      v-bind="args"
      style="width: 800px; height: 300px;"
    >
      <div class="relative min-w-full snap-start snap-always">
        <div class="w-full h-full bg-gray-200 rounded flex items-center justify-center">Slide 1</div>
      </div>
      <div class="relative min-w-full snap-start snap-always">
        <div class="w-full h-full bg-gray-200 rounded flex items-center justify-center">Slide 2</div>
      </div>
      <div class="relative min-w-full snap-start snap-always">
        <div class="w-full h-full bg-gray-200 rounded flex items-center justify-center">Slide 3</div>
      </div>
    </SFItemsSlider>`,
  }),
}

/**
 * Basic horizontal slider.
 * Shows the component with default horizontal scrolling behavior.
 */
export const Horizontal = {
  args: {
    withArrows: true,
    mode: 'horizontal',
    sliderTabindex: -1,
  },
}

/**
 * Horizontal slider without arrows.
 * Demonstrates the component without navigation arrows.
 */
export const HorizontalNoArrows = {
  args: {
    withArrows: false,
    mode: 'horizontal',
  },
}

/**
 * Vertical slider.
 * Shows the component with vertical scrolling behavior.
 */
export const Vertical = {
  render: (args: ComponentPropsAndSlots<typeof SFItemsSlider>) => ({
    components: { SFItemsSlider },
    setup() {
      return { args }
    },
    template: `
    <SFItemsSlider v-bind="args" class="h-96 w-full">
      <div class="flex flex-col gap-4 p-4">
        <div class="w-full h-32 bg-gray-200 rounded flex items-center justify-center">Item 1</div>
        <div class="w-full h-32 bg-gray-200 rounded flex items-center justify-center">Item 2</div>
        <div class="w-full h-32 bg-gray-200 rounded flex items-center justify-center">Item 3</div>
        <div class="w-full h-32 bg-gray-200 rounded flex items-center justify-center">Item 4</div>
        <div class="w-full h-32 bg-gray-200 rounded flex items-center justify-center">Item 5</div>
      </div>
    </SFItemsSlider>`,
  }),
  args: {
    withArrows: true,
    mode: 'vertical',
  },
} satisfies Meta<typeof SFItemsSlider>

/**
 * Slider with custom arrow buttons.
 * Demonstrates how to customize the navigation arrows using slots.
 */
export const CustomArrows = {
  render: (args: ComponentPropsAndSlots<typeof SFItemsSlider>) => ({
    components: { SFItemsSlider, SFSliderArrowButton },
    setup() {
      return { args }
    },
    template: `
    <SFItemsSlider
      class="size-full"
      v-bind="args"
    >
      <template #prev-button="{ prev, isPrevEnabled }">
        <SFSliderArrowButton
          class="absolute top-[40%] bg-white hover:bg-white"
          :disabled="!isPrevEnabled"
          direction="left"
          inverted-radius
          translate-on-hover
          @click="prev()"
        />
      </template>
      <template #next-button="{ next, isNextEnabled }">
        <SFSliderArrowButton
          class="absolute top-[40%] bg-white hover:bg-white"
          :disabled="!isNextEnabled"
          direction="right"
          translate-on-hover
          inverted-radius
          @click="next()"
        />
      </template>
      <div class="relative min-w-full snap-start snap-always">
        <div class="w-full h-32 bg-gray-200 rounded flex items-center justify-center">Slide 1</div>
      </div>
      <div class="relative min-w-full snap-start snap-always">
        <div class="w-full h-32 bg-gray-200 rounded flex items-center justify-center">Slide 2</div>
      </div>
      <div class="relative min-w-full snap-start snap-always">
        <div class="w-full h-32 bg-gray-200 rounded flex items-center justify-center">Slide 3</div>
      </div>
    </SFItemsSlider>`,
  }),
  args: {
    withArrows: true,
    mode: 'horizontal',
  },
} satisfies Meta<typeof SFItemsSlider>
