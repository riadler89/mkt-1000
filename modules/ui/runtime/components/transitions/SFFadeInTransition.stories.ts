import type { ComponentPropsAndSlots, Meta } from '@storybook-vue/nuxt'
import { ref } from 'vue'
import SFButton from '../core/SFButton.vue'
import SFFadeInTransition from './SFFadeInTransition.vue'

/**
 * SFFadeInTransition provides a simple fade in/out animation for content.
 * It uses opacity transitions with a linear easing and includes an out-in mode
 * for sequential transitions. Ideal for content that needs to smoothly appear
 * and disappear without directional movement.
 */
export default {
  title: 'Base Components/Transitions/SFFadeInTransition',
  component: SFFadeInTransition,
  argTypes: {
    duration: {
      control: { type: 'select' },
      options: [75, 100, 150, 200, 300, 500, 700, 1000],
    },
  },
  render: (args: ComponentPropsAndSlots<typeof SFFadeInTransition>) => ({
    components: { SFFadeInTransition, SFButton },
    setup() {
      const visible = ref(false)
      setTimeout(() => {
        visible.value = true
      }, 500)
      return { args, visible }
    },
    template: `
    <div class="p-8 w-96 h-56 relative">
      <SFFadeInTransition v-bind="args">
        <div v-if="visible" class="border border-black p-6 rounded-lg shadow-lg">
          <h3 class="text-lg font-semibold mb-2">Fade In Content</h3>
          <p>This content fades in and out smoothly with a ${
            args.duration || 200
          }ms duration.</p>
        </div>
      </SFFadeInTransition>
      <SFButton class="absolute bottom-0 right-0" @click="visible = !visible">Toggle</SFButton>
    </div>
    `,
  }),
} satisfies Meta<typeof SFFadeInTransition>

/**
 * Default fade transition with 200ms duration provides a smooth, natural
 * appearance that feels responsive without being jarring.
 */
export const Default = {
  args: {
    duration: 200,
  },
}
