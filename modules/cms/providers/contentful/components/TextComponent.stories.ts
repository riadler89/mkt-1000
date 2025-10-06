import { computed } from 'vue'
import type { StoryObj } from '@storybook-vue/nuxt'
import type { TypeTextComponentWithoutUnresolvableLinksResponse } from '../types'
import Text from './TextComponent.vue'

/**
 * Contentful Text component displays text content with configurable HTML elements and styling.
 * It supports different text types (h1-h4, p) with appropriate semantic markup and Tailwind CSS classes.
 *
 * Key features:
 * - Multiple text types (h1, h2, h3, h4, p) for semantic hierarchy
 * - Automatic CSS class application based on text type
 * - Contentful field-based data structure (fields.content, fields.textType)
 * - Responsive typography with font-semibold for headings
 */
interface TextStoryArgs {
  content: string
  textType: 'p' | 'h1' | 'h2' | 'h3' | 'h4'
}

const createContentElement = (
  content: string,
  textType: 'p' | 'h1' | 'h2' | 'h3' | 'h4' = 'p',
): TypeTextComponentWithoutUnresolvableLinksResponse =>
  ({
    fields: {
      content,
      textType,
    },
  }) as TypeTextComponentWithoutUnresolvableLinksResponse

const meta = {
  title: 'CMS/Contentful/Text',
  component: Text,
  argTypes: {
    content: {
      control: 'text',
      description: 'Text content to display',
      name: 'contentElement.fields.content',
    },
    textType: {
      control: 'select',
      options: ['p', 'h1', 'h2', 'h3', 'h4'],
      description: 'HTML element type for semantic markup',
      name: 'contentElement.fields.textType',
    },
  },
  parameters: {
    docs: {
      source: {
        code: `
          <template>
            <TextComponent :contentElement="contentElement" />
          </template>
        `,
      },
    },
  },
  render: (args: TextStoryArgs) => {
    return {
      components: { Text },
      setup() {
        const contentElement = computed(() =>
          createContentElement(args.content, args.textType),
        )
        return {
          contentElement,
        }
      },
      template: `
        <Text :contentElement="contentElement" />
      `,
    }
  },
}

export default meta
type Story = StoryObj<TextStoryArgs>

/**
 * Default paragraph text example
 */
export const Paragraph: Story = {
  args: {
    content:
      'This is a paragraph of text that will be rendered as a <p> element.',
    textType: 'p',
  },
}

/**
 * Main heading (H1) with large, bold styling
 */
export const Heading1: Story = {
  args: {
    content: 'Main Page Heading',
    textType: 'h1',
  },
}

/**
 * Section heading (H2) with medium-large, bold styling
 */
export const Heading2: Story = {
  args: {
    content: 'Section Heading',
    textType: 'h2',
  },
}

/**
 * Subsection heading (H3) with medium, bold styling
 */
export const Heading3: Story = {
  args: {
    content: 'Subsection Heading',
    textType: 'h3',
  },
}

/**
 * Minor heading (H4) with small, bold styling
 */
export const Heading4: Story = {
  args: {
    content: 'Minor Heading',
    textType: 'h4',
  },
}
