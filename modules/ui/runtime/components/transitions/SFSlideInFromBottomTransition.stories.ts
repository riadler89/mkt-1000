import type { ComponentPropsAndSlots, Meta } from '@storybook-vue/nuxt'
import { ref } from 'vue'
import SFButton from '../core/SFButton.vue'
import SFSlideInFromBottomTransition from './SFSlideInFromBottomTransition.vue'

/**
 * SFSlideInFromBottomTransition creates a vertical slide animation from the bottom edge.
 * It uses translate-y transforms to move content from below the viewport to its final position.
 * Ideal for modals, tooltips, or content that should rise up from the bottom.
 */
export default {
  title: 'Base Components/Transitions/SFSlideInFromBottomTransition',
  component: SFSlideInFromBottomTransition,
  argTypes: {
    duration: {
      control: { type: 'select' },
      options: [75, 100, 150, 200, 300, 500, 700, 1000],
    },
  },
  render: (
    args: ComponentPropsAndSlots<typeof SFSlideInFromBottomTransition>,
  ) => ({
    components: { SFSlideInFromBottomTransition, SFButton },
    setup() {
      const visible = ref(false)
      setTimeout(() => {
        visible.value = true
      }, 500)
      return { args, visible }
    },
    template: `
    <div class="p-8 w-96 h-56 relative">
        <SFSlideInFromBottomTransition v-bind="args">
          <div v-if="visible" class="border border-black p-6 rounded-lg shadow-lg">
            <h3 class="text-lg font-semibold mb-2">Slide In From Bottom</h3>
            <p>This content slides up from the bottom edge with a ${
              args.duration || 500
            }ms duration.</p>
          </div>
        </SFSlideInFromBottomTransition>
        <SFButton class="absolute bottom-0 right-0" @click="visible = !visible">Toggle</SFButton>
      </div>
    `,
  }),
} satisfies Meta<typeof SFSlideInFromBottomTransition>

/**
 * Default slide transition with 500ms duration provides a deliberate, dramatic
 * entrance that draws attention to the content.
 */
export const Default = {
  args: {
    duration: 500,
  },
}
