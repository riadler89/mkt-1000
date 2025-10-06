import type {
  Meta,
  StoryObj,
  ComponentPropsAndSlots,
} from '@storybook-vue/nuxt'
import SFGoBackLink from './SFGoBackLink.vue'

/**
 * SFGoBackLink is a link component designed for going back in terms of navigation and interaction.
 * It provides a fallback link for scenarios where navigation history is unavailable.
 *
 * Key features:
 * - Configurable fallback link for graceful navigation.
 */
export default {
  title: 'Base Components/SFGoBackLink',
  component: SFGoBackLink,
  render: (args: ComponentPropsAndSlots<typeof SFGoBackLink>) => ({
    components: { SFGoBackLink },
    setup() {
      return { args }
    },
    template: `<SFGoBackLink v-bind="args">{{ args.default }}</SFGoBackLink>`,
  }),
} satisfies Meta<typeof SFGoBackLink>

type Story = StoryObj<typeof SFGoBackLink>

/**
 * Default story showcasing the SFGoBackLink with the root fallback link
 */
export const Default: Story = {
  args: {
    fallbackLink: '/',
  },
}
