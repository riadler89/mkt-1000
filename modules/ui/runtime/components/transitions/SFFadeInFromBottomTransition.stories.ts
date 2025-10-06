import type { ComponentPropsAndSlots, Meta } from '@storybook-vue/nuxt'
import { ref } from 'vue'
import SFButton from '../core/SFButton.vue'
import SFFadeInFromBottomTransition from './SFFadeInFromBottomTransition.vue'

/**
 * SFFadeInFromBottomTransition combines opacity and vertical movement to create
 * a subtle upward animation. Content fades in while sliding up from a slight
 * offset, creating a natural and engaging entrance effect.
 */
export default {
  title: 'Base Components/Transitions/SFFadeInFromBottomTransition',
  component: SFFadeInFromBottomTransition,
  argTypes: {
    duration: {
      control: { type: 'select' },
      options: [75, 100, 150, 200, 300, 500, 700, 1000],
    },
  },
  render: (
    args: ComponentPropsAndSlots<typeof SFFadeInFromBottomTransition>,
  ) => ({
    components: { SFFadeInFromBottomTransition, SFButton },
    setup() {
      const visible = ref(false)
      setTimeout(() => {
        visible.value = true
      }, 500)
      return { args, visible }
    },
    template: `
    <div class="p-8 w-96 h-56 relative">
      <SFFadeInFromBottomTransition v-bind="args">
        <div v-if="visible" class="border border-black p-6 rounded-lg shadow-lg w-96">
          <h3 class="text-lg font-semibold mb-2">Fade In From Bottom</h3>
          <p>This content fades in while sliding up from below with a ${
            args.duration || 200
          }ms duration.</p>
        </div>
      </SFFadeInFromBottomTransition>
      <SFButton class="absolute bottom-0 right-0" @click="visible = !visible">Toggle</SFButton>
    </div>
    `,
  }),
} satisfies Meta<typeof SFFadeInFromBottomTransition>

/**
 * Default transition with 200ms duration provides a smooth, subtle animation
 * that enhances content appearance without being distracting.
 */
export const Default = {
  args: {
    duration: 200,
  },
}
