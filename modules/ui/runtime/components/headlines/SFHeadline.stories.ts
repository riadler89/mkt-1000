import type {
  Meta,
  StoryObj,
  ComponentPropsAndSlots,
} from '@storybook-vue/nuxt'
import SFHeadline from './SFHeadline.vue'
import { HeadlineSize, HeadlineTag } from '#storefront-ui'

/**
 * SFHeadline is a versatile and accessible headline component designed for displaying text prominently.
 * It supports various styling options and behaviors to adapt to different use cases.
 *
 * Key features:
 * - Multiple visual sizes (3XL, 2XL, XL, LG, MD, SM, XS) for diverse design needs.
 * - Configurable HTML tags (h1, h2, h3, h4, h5, h6, p, span, div) for semantic structure.
 * - Options for bold and uppercase text styling.
 * - Badge support for additional context or emphasis.
 */
export default {
  title: 'Base Components/SFHeadline',
  component: SFHeadline,
  argTypes: {
    size: {
      control: 'select',
      options: Object.values(HeadlineSize),
    },
    tag: {
      control: 'select',
      options: Object.values(HeadlineTag),
    },
  },
  render: (args: ComponentPropsAndSlots<typeof SFHeadline>) => ({
    components: { SFHeadline },
    setup() {
      return { args }
    },
    template: `<SFHeadline v-bind="args">{{ args.default }}</SFHeadline>`,
  }),
} satisfies Meta<typeof SFHeadline>

type Story = StoryObj<typeof SFHeadline>

/**
 * Default story showcasing the SFHeadline with default props
 */
export const Default: Story = {
  args: {
    size: HeadlineSize['2XL'],
    tag: HeadlineTag.P,
    default: 'Default Headline',
  },
}

/**
 * Story showcasing the SFHeadline with a badge
 */
export const WithBadge: Story = {
  args: {
    size: HeadlineSize.XL,
    tag: HeadlineTag.H2,
    badge: 'New',
    default: 'Headline with Badge',
  },
}

/**
 * Story showcasing the SFHeadline with uppercase text
 */
export const Uppercase: Story = {
  args: {
    size: HeadlineSize.LG,
    tag: HeadlineTag.H3,
    isUppercase: true,
    default: 'Uppercase Headline',
  },
}

/**
 * Story showcasing the SFHeadline with bold text
 */
export const Bold: Story = {
  args: {
    size: HeadlineSize.MD,
    tag: HeadlineTag.H4,
    isBold: true,
    default: 'Bold Headline',
  },
}

/**
 * Stories showcasing the SFHeadline with each HTML tag
 */
export const Tags: Story = {
  render: (args: ComponentPropsAndSlots<typeof SFHeadline>) => ({
    components: { SFHeadline },
    setup() {
      const headlines = [
        {
          size: HeadlineSize.MD,
          tag: HeadlineTag.H1,
          title: 'H1 Headline',
        },
        {
          size: HeadlineSize.MD,
          tag: HeadlineTag.H2,
          title: 'H2 Headline',
        },
        {
          size: HeadlineSize.MD,
          tag: HeadlineTag.H3,
          title: 'H3 Headline',
        },
        {
          size: HeadlineSize.MD,
          tag: HeadlineTag.H4,
          title: 'H4 Headline',
        },
        {
          size: HeadlineSize.MD,
          tag: HeadlineTag.H5,
          title: 'H5 Headline',
        },
        {
          size: HeadlineSize.MD,
          tag: HeadlineTag.H6,
          title: 'H6 Headline',
        },
        {
          size: HeadlineSize.MD,
          tag: HeadlineTag.P,
          title: 'Paragraph Headline',
        },
        {
          size: HeadlineSize.MD,
          tag: HeadlineTag.SPAN,
          title: 'Span Headline',
        },
        {
          size: HeadlineSize.MD,
          tag: HeadlineTag.DIV,
          title: 'Div Headline',
        },
      ]
      return { args, headlines }
    },
    template: `
      <div class="flex flex-col gap-2">
        <SFHeadline
          v-for="{ size, tag, title } in headlines"
          v-bind="args"
          :size="size"
          :tag="tag"
        >
          {{ title }}
          <{{ tag }}>
        </SFHeadline>
      </div>
    `,
  }),
}

/**
 * Stories showcasing the SFHeadline with each size
 */
export const Sizes: Story = {
  render: (args: ComponentPropsAndSlots<typeof SFHeadline>) => ({
    components: { SFHeadline },
    setup() {
      const headlines = [
        {
          size: HeadlineSize['3XL'],
          tag: HeadlineTag.H1,
          title: '3XL Headline',
        },
        {
          size: HeadlineSize['2XL'],
          tag: HeadlineTag.H1,
          title: '2XL Headline',
        },
        {
          size: HeadlineSize.XL,
          tag: HeadlineTag.H3,
          title: 'XL Headline',
        },
        {
          size: HeadlineSize.LG,
          tag: HeadlineTag.H4,
          title: 'LG Headline',
        },
        {
          size: HeadlineSize.MD,
          tag: HeadlineTag.H5,
          title: 'MD Headline',
        },
        {
          size: HeadlineSize.SM,
          tag: HeadlineTag.H6,
          title: 'SM Headline',
        },
      ]
      return { args, headlines }
    },
    template: `
      <div class="flex flex-col gap-2">
        <SFHeadline
          v-for="{ size, tag, title } in headlines"
          v-bind="args"
          :size="size"
          :tag="tag"
        >
          {{ title }}
        </SFHeadline>
      </div>
    `,
  }),
}
