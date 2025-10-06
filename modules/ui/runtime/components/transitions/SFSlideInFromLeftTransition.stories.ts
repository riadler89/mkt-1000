import type { ComponentPropsAndSlots, Meta } from '@storybook-vue/nuxt'
import { ref } from 'vue'
import SFButton from '../core/SFButton.vue'
import SFSlideInFromLeftTransition from './SFSlideInFromLeftTransition.vue'

/**
 * SFSlideInFromLeftTransition creates a horizontal slide animation from the left edge.
 * It uses translate-x transforms with discrete transitions for smooth performance.
 * Perfect for sidebars, navigation menus, or content that should enter from the left.
 */
export default {
  title: 'Base Components/Transitions/SFSlideInFromLeftTransition',
  component: SFSlideInFromLeftTransition,
  argTypes: {
    duration: {
      control: { type: 'select' },
      options: [75, 100, 150, 200, 300, 500, 700, 1000],
    },
  },
  render: (
    args: ComponentPropsAndSlots<typeof SFSlideInFromLeftTransition>,
  ) => ({
    components: { SFSlideInFromLeftTransition, SFButton },
    setup() {
      const visible = ref(false)
      setTimeout(() => {
        visible.value = true
      }, 500)
      return { args, visible }
    },
    template: `
    <div class="p-8 w-96 h-56 relative">
        <SFSlideInFromLeftTransition v-bind="args">
          <div v-if="visible" class="border border-black p-6 rounded-lg shadow-lg max-w-sm">
            <h3 class="text-lg font-semibold mb-2">Slide In From Left</h3>
            <p>This content slides in from the left edge with a ${
              args.duration || 200
            }ms duration.</p>
          </div>
        </SFSlideInFromLeftTransition>
        <SFButton class="absolute bottom-0 right-0" @click="visible = !visible">Toggle</SFButton>
      </div>
    `,
  }),
} satisfies Meta<typeof SFSlideInFromLeftTransition>

/**
 * Default slide transition with 200ms duration provides a smooth, natural
 * movement that feels responsive and polished.
 */
export const Default = {
  args: {
    duration: 200,
  },
}
