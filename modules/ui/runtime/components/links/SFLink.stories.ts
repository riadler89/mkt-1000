import type { Meta, ComponentPropsAndSlots } from '@storybook-vue/nuxt'
import SFLink from './SFLink.vue'
import { LinkVariant } from '#storefront-ui'

/**
 * SFLink is a flexible and accessible link component designed for navigation and interaction.
 * It supports various styling options and behaviors to adapt to different use cases.
 *
 * Key features:
 * - Multiple visual variants (Normal, Loud, Whisper, Quiet) for diverse design needs.
 * - Configurable target attribute for controlling link behavior (_self, _blank, etc.).
 * - Raw mode for disabling default styling, enabling custom designs.
 * - Seamless integration with routing via the 'to' prop.
 */
export default {
  title: 'Base Components/SFLink',
  component: SFLink,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: Object.values(LinkVariant),
    },
    target: {
      control: {
        type: 'select',
      },
      options: ['_self', '_blank', '_parent', '_top'],
    },
  },
  render: (args: ComponentPropsAndSlots<typeof SFLink>) => ({
    components: { SFLink },
    setup() {
      return { args }
    },
    template: `<SFLink v-bind="args">{{ args.default }}</SFLink>`,
  }),
} satisfies Meta<typeof SFLink>

/**
 * Default story showcasing the SFLink component with standard styling and behavior.
 * Ideal for basic navigation links within the application.
 */
export const Default = {
  args: {
    to: '/',
    variant: LinkVariant.NORMAL,
    raw: false,
    target: '_self',
    default: 'Default',
  },
} satisfies Meta<typeof SFLink>

/**
 * LoudVariant story demonstrating the SFLink component with a bold and attention-grabbing style.
 * Suitable for emphasizing important links or calls to action.
 */
export const LoudVariant = {
  args: {
    to: '/',
    variant: LinkVariant.LOUD,
    raw: false,
    target: '_self',
    default: 'Loud Variant',
  },
} satisfies Meta<typeof SFLink>

/**
 * WhisperVariant story demonstrating the SFLink component with a subtle and understated style.
 * Suitable for links that require a softer visual presence.
 */
export const WhisperVariant = {
  args: {
    to: '/',
    variant: LinkVariant.WHISPER,
    raw: false,
    target: '_self',
    default: 'Whisper Variant',
  },
} satisfies Meta<typeof SFLink>

/**
 * QuietVariant story showcasing the SFLink component with a minimal style.
 * Ideal for links that blend seamlessly into the surrounding content.
 */
export const QuiteVariant = {
  args: {
    to: '/',
    variant: LinkVariant.QUIET,
    raw: false,
    target: '_self',
    default: 'Quite Variant',
  },
} satisfies Meta<typeof SFLink>

/**
 * RawLink story illustrating the SFLink component without default styling.
 * Useful for scenarios requiring custom or minimalistic link designs.
 */
export const Raw = {
  args: {
    to: '/',
    variant: LinkVariant.NORMAL,
    raw: true,
    target: '_self',
    default: 'Raw link',
  },
} satisfies Meta<typeof SFLink>
