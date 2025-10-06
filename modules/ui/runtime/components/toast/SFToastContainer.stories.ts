import type { ComponentPropsAndSlots, Meta } from '@storybook-vue/nuxt'
import { useNotification } from '../../composables'
import SFButton from '../core/SFButton.vue'
import SFToastContainer from './SFToastContainer.vue'

/**
 * SFToastContainer is a versatile component designed to elegantly display toast notifications.
 *
 * Key Features:
 * - Seamlessly handles single or multiple toast messages within a unified container.
 * - Integrates smooth transition effects for disappearing toasts and rapid appearance of multiple toasts.
 * - Ideal for providing user feedback in response to actions or events.
 */
export default {
  title: 'Base Components/SFToastContainer',
}

/**
 * Triggers the display action to showcase a toast.
 */
export const Show = {
  render: (args: ComponentPropsAndSlots<typeof SFToastContainer>) => ({
    components: { SFToastContainer, SFButton },
    setup() {
      const { notifications, show } = useNotification()
      const showToast = () => {
        show('Success toast message', {
          type: {
            classes: 'text-status-success bg-status-success-light',
            iconComponent: 'IconCheckGreen',
          },
          action: { text: 'VIEW', href: '/' },
        })
      }
      return { args, notifications, showToast }
    },
    template: `
    <div style="padding-bottom: 100px;">
       <SFToastContainer />
       <SFButton @click="showToast">
         Show Toast
       </SFButton>
    </div>
     `,
  }),
} satisfies Meta<typeof SFToastContainer>
