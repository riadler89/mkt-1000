import { computed } from 'vue'
import type { StoryObj } from '@storybook-vue/nuxt'
import { BLOCKS, INLINES } from '@contentful/rich-text-types'
import type { TypeRichTextComponentWithoutUnresolvableLinksResponse } from '../types/gen/TypeRichTextComponent'
import RichText from './RichTextComponent.vue'

/**
 * Contentful Rich Text component renders rich text content with custom styling for headings, lists, and links.
 * It uses the Contentful rich text renderer to convert rich text documents into HTML with Tailwind CSS classes.
 *
 * Key features:
 * - Custom heading styles (H1, H2, H3) with semantic markup and font-semibold
 * - Styled hyperlinks with font-semibold class
 * - Custom list styling with appropriate indentation and bullet/number styles
 * - Full rich text document support with nested content structures
 * - HTML rendering with v-html directive for complex rich text content
 */
interface RichTextStoryArgs {
  content: TypeRichTextComponentWithoutUnresolvableLinksResponse['fields']['content']
}

const createContentElement = (
  content: TypeRichTextComponentWithoutUnresolvableLinksResponse['fields']['content'],
): TypeRichTextComponentWithoutUnresolvableLinksResponse =>
  ({
    fields: {
      content,
    },
  }) as TypeRichTextComponentWithoutUnresolvableLinksResponse

const meta = {
  title: 'CMS/Contentful/RichText',
  component: RichText,
  argTypes: {
    content: {
      control: 'object',
      description: 'Rich text content document structure',
      name: 'contentElement.fields.content',
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
          'A rich text renderer component with custom styles for headings, lists, links and full document structure support using Contentful rich text format.',
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
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: 'text',
              value:
                'This is a simple paragraph of rich text content that will be rendered with default styling.',
              marks: [],
              data: {},
            },
          ],
        },
      ],
    },
  },
}

/**
 * Rich text with headings demonstrating the custom heading styles
 */
export const WithHeadings: Story = {
  args: {
    content: {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.HEADING_1,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'Main Heading (H1)',
              marks: [],
              data: {},
            },
          ],
        },
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'Some introductory text after the main heading.',
              marks: [],
              data: {},
            },
          ],
        },
        {
          nodeType: BLOCKS.HEADING_2,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'Section Heading (H2)',
              marks: [],
              data: {},
            },
          ],
        },
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: 'text',
              value:
                'Content under the section heading with additional details.',
              marks: [],
              data: {},
            },
          ],
        },
        {
          nodeType: BLOCKS.HEADING_3,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'Subsection Heading (H3)',
              marks: [],
              data: {},
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
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.HEADING_2,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'Shopping List',
              marks: [],
              data: {},
            },
          ],
        },
        {
          nodeType: BLOCKS.UL_LIST,
          data: {},
          content: [
            {
              nodeType: BLOCKS.LIST_ITEM,
              data: {},
              content: [
                {
                  nodeType: BLOCKS.PARAGRAPH,
                  data: {},
                  content: [
                    {
                      nodeType: 'text',
                      value: 'Organic vegetables',
                      marks: [],
                      data: {},
                    },
                  ],
                },
              ],
            },
            {
              nodeType: BLOCKS.LIST_ITEM,
              data: {},
              content: [
                {
                  nodeType: BLOCKS.PARAGRAPH,
                  data: {},
                  content: [
                    {
                      nodeType: 'text',
                      value: 'Fresh bread',
                      marks: [],
                      data: {},
                    },
                  ],
                },
              ],
            },
            {
              nodeType: BLOCKS.LIST_ITEM,
              data: {},
              content: [
                {
                  nodeType: BLOCKS.PARAGRAPH,
                  data: {},
                  content: [
                    {
                      nodeType: 'text',
                      value: 'Local dairy products',
                      marks: [],
                      data: {},
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          nodeType: BLOCKS.HEADING_2,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'Setup Instructions',
              marks: [],
              data: {},
            },
          ],
        },
        {
          nodeType: BLOCKS.OL_LIST,
          data: {},
          content: [
            {
              nodeType: BLOCKS.LIST_ITEM,
              data: {},
              content: [
                {
                  nodeType: BLOCKS.PARAGRAPH,
                  data: {},
                  content: [
                    {
                      nodeType: 'text',
                      value: 'Download and install the application',
                      marks: [],
                      data: {},
                    },
                  ],
                },
              ],
            },
            {
              nodeType: BLOCKS.LIST_ITEM,
              data: {},
              content: [
                {
                  nodeType: BLOCKS.PARAGRAPH,
                  data: {},
                  content: [
                    {
                      nodeType: 'text',
                      value: 'Create your account and verify email',
                      marks: [],
                      data: {},
                    },
                  ],
                },
              ],
            },
            {
              nodeType: BLOCKS.LIST_ITEM,
              data: {},
              content: [
                {
                  nodeType: BLOCKS.PARAGRAPH,
                  data: {},
                  content: [
                    {
                      nodeType: 'text',
                      value: 'Configure your preferences and start using',
                      marks: [],
                      data: {},
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
 * Rich text with hyperlinks demonstrating custom link styling
 */
export const WithLinks: Story = {
  args: {
    content: {
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'Visit our ',
              marks: [],
              data: {},
            },
            {
              nodeType: INLINES.HYPERLINK,
              data: {
                uri: 'https://example.com',
              },
              content: [
                {
                  nodeType: 'text',
                  value: 'main website',
                  marks: [],
                  data: {},
                },
              ],
            },
            {
              nodeType: 'text',
              value: ' for more information about our products and services.',
              marks: [],
              data: {},
            },
          ],
        },
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'You can also check out our ',
              marks: [],
              data: {},
            },
            {
              nodeType: INLINES.HYPERLINK,
              data: {
                uri: 'https://blog.example.com',
              },
              content: [
                {
                  nodeType: 'text',
                  value: 'blog',
                  marks: [],
                  data: {},
                },
              ],
            },
            {
              nodeType: 'text',
              value: ' and ',
              marks: [],
              data: {},
            },
            {
              nodeType: INLINES.HYPERLINK,
              data: {
                uri: 'https://support.example.com',
              },
              content: [
                {
                  nodeType: 'text',
                  value: 'support center',
                  marks: [],
                  data: {},
                },
              ],
            },
            {
              nodeType: 'text',
              value: ' for additional resources.',
              marks: [],
              data: {},
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
      nodeType: BLOCKS.DOCUMENT,
      data: {},
      content: [
        {
          nodeType: BLOCKS.HEADING_1,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'Getting Started Guide',
              marks: [],
              data: {},
            },
          ],
        },
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: 'text',
              value:
                'Welcome to our comprehensive guide! This document will help you understand all the features available.',
              marks: [],
              data: {},
            },
          ],
        },
        {
          nodeType: BLOCKS.HEADING_2,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'Prerequisites',
              marks: [],
              data: {},
            },
          ],
        },
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'Before you begin, please ensure you have the following:',
              marks: [],
              data: {},
            },
          ],
        },
        {
          nodeType: BLOCKS.UL_LIST,
          data: {},
          content: [
            {
              nodeType: BLOCKS.LIST_ITEM,
              data: {},
              content: [
                {
                  nodeType: BLOCKS.PARAGRAPH,
                  data: {},
                  content: [
                    {
                      nodeType: 'text',
                      value: 'A modern web browser',
                      marks: [],
                      data: {},
                    },
                  ],
                },
              ],
            },
            {
              nodeType: BLOCKS.LIST_ITEM,
              data: {},
              content: [
                {
                  nodeType: BLOCKS.PARAGRAPH,
                  data: {},
                  content: [
                    {
                      nodeType: 'text',
                      value: 'Internet connection',
                      marks: [],
                      data: {},
                    },
                  ],
                },
              ],
            },
            {
              nodeType: BLOCKS.LIST_ITEM,
              data: {},
              content: [
                {
                  nodeType: BLOCKS.PARAGRAPH,
                  data: {},
                  content: [
                    {
                      nodeType: 'text',
                      value: 'Access to the ',
                      marks: [],
                      data: {},
                    },
                    {
                      nodeType: INLINES.HYPERLINK,
                      data: {
                        uri: 'https://admin.example.com',
                      },
                      content: [
                        {
                          nodeType: 'text',
                          value: 'admin panel',
                          marks: [],
                          data: {},
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
          nodeType: BLOCKS.HEADING_3,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'Next Steps',
              marks: [],
              data: {},
            },
          ],
        },
        {
          nodeType: BLOCKS.PARAGRAPH,
          data: {},
          content: [
            {
              nodeType: 'text',
              value: 'Once you have everything set up, visit our ',
              marks: [],
              data: {},
            },
            {
              nodeType: INLINES.HYPERLINK,
              data: {
                uri: 'https://docs.example.com',
              },
              content: [
                {
                  nodeType: 'text',
                  value: 'documentation',
                  marks: [],
                  data: {},
                },
              ],
            },
            {
              nodeType: 'text',
              value: ' for detailed instructions.',
              marks: [],
              data: {},
            },
          ],
        },
      ],
    },
  },
}
