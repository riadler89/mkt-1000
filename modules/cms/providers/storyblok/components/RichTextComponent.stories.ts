import { computed } from 'vue'
import type { StoryObj } from '@storybook-vue/nuxt'
import type { RichTextComponent } from '../types'
import RichText from './RichTextComponent.vue'

/**
 * The Storyblok Rich Text component renders rich text content with custom Vue resolvers for different block types.
 * It uses the StoryblokRichText component with custom resolvers to render headings, lists, and links with Tailwind CSS styling.
 * This component is designed to work with Storyblok CMS content structure.
 */
interface RichTextStoryArgs {
  content: RichTextComponent['content']
}

const createContentElement = (
  content: RichTextComponent['content'],
): RichTextComponent => ({
  content,
  component: 'RichTextComponent',
  _uid: 'story-uid',
})

const meta = {
  title: 'CMS/Storyblok/RichText',
  component: RichText,
  argTypes: {
    content: {
      control: 'object',
      description: 'Rich text content document structure',
      name: 'contentElement.content',
    },
  },
  parameters: {
    docs: {
      source: {
        code: `
          <template>
            <RichTextComponent :contentElement="contentElement" />
          </template>
        `,
      },
      description: {
        component:
          'A rich text renderer component with custom resolvers for headings, lists, links and full document structure support using Storyblok rich text format.',
      },
    },
  },
  render: (args: RichTextStoryArgs) => {
    return {
      components: { RichText },
      setup() {
        const contentElement = computed(() =>
          createContentElement(args.content),
        )
        return {
          contentElement,
        }
      },
      template: `<RichText :contentElement="contentElement" />`,
    }
  },
}

export default meta
type Story = StoryObj<RichTextStoryArgs>

/**
 * Simple paragraph text with basic formatting
 */
export const SimpleParagraph: Story = {
  args: {
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'This is a simple paragraph of rich text content that will be rendered with default styling.',
            },
          ],
        },
      ],
    },
  },
}

/**
 * Rich text with headings demonstrating the custom heading resolvers
 */
export const WithHeadings: Story = {
  args: {
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: {
            level: 1,
          },
          content: [
            {
              type: 'text',
              text: 'Main Heading (H1)',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Some introductory text after the main heading.',
            },
          ],
        },
        {
          type: 'heading',
          attrs: {
            level: 2,
          },
          content: [
            {
              type: 'text',
              text: 'Section Heading (H2)',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Content under the section heading with additional details.',
            },
          ],
        },
        {
          type: 'heading',
          attrs: {
            level: 3,
          },
          content: [
            {
              type: 'text',
              text: 'Subsection Heading (H3)',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Final paragraph with some concluding thoughts.',
            },
          ],
        },
      ],
    },
  },
}

/**
 * Rich text with lists showing both ordered and unordered list styling
 */
export const WithLists: Story = {
  args: {
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: {
            level: 2,
          },
          content: [
            {
              type: 'text',
              text: 'Shopping List',
            },
          ],
        },
        {
          type: 'bullet_list',
          content: [
            {
              type: 'list_item',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Organic vegetables',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list_item',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Fresh bread',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list_item',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Local dairy products',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'heading',
          attrs: {
            level: 2,
          },
          content: [
            {
              type: 'text',
              text: 'Setup Instructions',
            },
          ],
        },
        {
          type: 'ordered_list',
          content: [
            {
              type: 'list_item',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Download and install the application',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list_item',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Create your account and verify email',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list_item',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Configure your preferences and start using',
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
}

/**
 * Rich text with links demonstrating custom link resolver styling
 */
export const WithLinks: Story = {
  args: {
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Visit our ',
            },
            {
              type: 'text',
              text: 'main website',
              marks: [
                {
                  type: 'link',
                  attrs: {
                    href: 'https://example.com',
                    target: '_blank',
                  },
                },
              ],
            },
            {
              type: 'text',
              text: ' for more information about our products and services.',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'You can also check out our ',
            },
            {
              type: 'text',
              text: 'blog',
              marks: [
                {
                  type: 'link',
                  attrs: {
                    href: 'https://blog.example.com',
                    target: '_blank',
                  },
                },
              ],
            },
            {
              type: 'text',
              text: ' and ',
            },
            {
              type: 'text',
              text: 'support center',
              marks: [
                {
                  type: 'link',
                  attrs: {
                    href: 'https://support.example.com',
                    target: '_self',
                  },
                },
              ],
            },
            {
              type: 'text',
              text: ' for additional resources.',
            },
          ],
        },
      ],
    },
  },
}

/**
 * Complex rich text content combining all features - headings, lists, and links
 */
export const ComplexContent: Story = {
  args: {
    content: {
      type: 'doc',
      content: [
        {
          type: 'heading',
          attrs: {
            level: 1,
          },
          content: [
            {
              type: 'text',
              text: 'Getting Started Guide',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Welcome to our comprehensive guide! This document will help you understand all the features available.',
            },
          ],
        },
        {
          type: 'heading',
          attrs: {
            level: 2,
          },
          content: [
            {
              type: 'text',
              text: 'Prerequisites',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Before you begin, please ensure you have the following:',
            },
          ],
        },
        {
          type: 'bullet_list',
          content: [
            {
              type: 'list_item',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'A modern web browser',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list_item',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Internet connection',
                    },
                  ],
                },
              ],
            },
            {
              type: 'list_item',
              content: [
                {
                  type: 'paragraph',
                  content: [
                    {
                      type: 'text',
                      text: 'Access to the ',
                    },
                    {
                      type: 'text',
                      text: 'admin panel',
                      marks: [
                        {
                          type: 'link',
                          attrs: {
                            href: 'https://admin.example.com',
                            target: '_blank',
                          },
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          type: 'heading',
          attrs: {
            level: 3,
          },
          content: [
            {
              type: 'text',
              text: 'Next Steps',
            },
          ],
        },
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: 'Once you have everything set up, visit our ',
            },
            {
              type: 'text',
              text: 'documentation',
              marks: [
                {
                  type: 'link',
                  attrs: {
                    href: 'https://docs.example.com',
                    target: '_blank',
                  },
                },
              ],
            },
            {
              type: 'text',
              text: ' for detailed instructions.',
            },
          ],
        },
      ],
    },
  },
}
