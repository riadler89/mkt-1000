import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { BLOCKS, INLINES } from '@contentful/rich-text-types'
import type { TypeRichTextComponentWithoutUnresolvableLinksResponse } from '../types/gen/TypeRichTextComponent'
import RichText from './RichTextComponent.vue'

const mockGetLocalizedRoute = vi.fn().mockImplementation((url: string) => url)

vi.mock('~/composables', () => ({
  useRouteHelpers: () => ({
    getLocalizedRoute: mockGetLocalizedRoute,
  }),
}))

describe('Contentful RichText Component', () => {
  const createWrapper = (
    contentElement: {
      fields?: Partial<
        TypeRichTextComponentWithoutUnresolvableLinksResponse['fields']
      >
    } & Partial<
      Omit<TypeRichTextComponentWithoutUnresolvableLinksResponse, 'fields'>
    >,
  ) => {
    return mount(RichText, {
      props: {
        contentElement:
          contentElement as TypeRichTextComponentWithoutUnresolvableLinksResponse,
      },
    })
  }

  it('renders simple paragraph content', () => {
    const wrapper = createWrapper({
      fields: {
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
                  value: 'Test paragraph content',
                  marks: [],
                  data: {},
                },
              ],
            },
          ],
        },
      },
    })

    expect(wrapper.html()).toContain('<p>Test paragraph content</p>')
  })

  it('renders h1 heading with custom styling', () => {
    const wrapper = createWrapper({
      fields: {
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
                  value: 'Main Heading',
                  marks: [],
                  data: {},
                },
              ],
            },
          ],
        },
      },
    })

    expect(wrapper.html()).toContain(
      '<h1 class="text-3xl font-semibold">Main Heading</h1>',
    )
  })

  it('renders h2 heading with custom styling', () => {
    const wrapper = createWrapper({
      fields: {
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
                  value: 'Section Heading',
                  marks: [],
                  data: {},
                },
              ],
            },
          ],
        },
      },
    })

    expect(wrapper.html()).toContain(
      '<h2 class="text-2xl font-semibold">Section Heading</h2>',
    )
  })

  it('renders h3 heading with custom styling', () => {
    const wrapper = createWrapper({
      fields: {
        content: {
          nodeType: BLOCKS.DOCUMENT,
          data: {},
          content: [
            {
              nodeType: BLOCKS.HEADING_3,
              data: {},
              content: [
                {
                  nodeType: 'text',
                  value: 'Subsection Heading',
                  marks: [],
                  data: {},
                },
              ],
            },
          ],
        },
      },
    })

    expect(wrapper.html()).toContain(
      '<h3 class="text-xl font-semibold">Subsection Heading</h3>',
    )
  })

  it('renders hyperlinks with custom styling', () => {
    const wrapper = createWrapper({
      fields: {
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
                      value: 'website',
                      marks: [],
                      data: {},
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    })

    expect(wrapper.html()).toContain(
      '<a class="font-semibold" href="https://example.com">website</a>',
    )
  })

  it('renders unordered list with custom styling', () => {
    const wrapper = createWrapper({
      fields: {
        content: {
          nodeType: BLOCKS.DOCUMENT,
          data: {},
          content: [
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
                          value: 'First item',
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
                          value: 'Second item',
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
    })

    expect(wrapper.html()).toBe(`<div data-contentful-field-id="content">
  <ul class="list-disc pl-6">
    <li>
      <p>First item</p>
    </li>
    <li>
      <p>Second item</p>
    </li>
  </ul>
</div>`)
  })

  it('renders ordered list with custom styling', () => {
    const wrapper = createWrapper({
      fields: {
        content: {
          nodeType: BLOCKS.DOCUMENT,
          data: {},
          content: [
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
                          value: 'Step one',
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
                          value: 'Step two',
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
    })

    expect(wrapper.html()).toBe(`<div data-contentful-field-id="content">
  <ol class="list-decimal pl-6">
    <li>
      <p>Step one</p>
    </li>
    <li>
      <p>Step two</p>
    </li>
  </ol>
</div>`)
  })

  it('renders complex content with multiple elements', () => {
    const wrapper = createWrapper({
      fields: {
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
                  value: 'Getting Started',
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
                  value: 'Welcome to our guide. Please visit our ',
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
                  value: ' for details.',
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
                  value: 'Steps to follow:',
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
                          value: 'Read the documentation',
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
    })

    // Check that all elements are rendered
    expect(wrapper.html()).toBe(`<div data-contentful-field-id="content">
  <h1 class="text-3xl font-semibold">Getting Started</h1>
  <p>Welcome to our guide. Please visit our <a class="font-semibold" href="https://docs.example.com">documentation</a> for details.</p>
  <h2 class="text-2xl font-semibold">Steps to follow:</h2>
  <ol class="list-decimal pl-6">
    <li>
      <p>Read the documentation</p>
    </li>
  </ol>
</div>`)
  })

  it('handles empty content gracefully', () => {
    const wrapper = createWrapper({
      fields: {
        content: {
          nodeType: BLOCKS.DOCUMENT,
          data: {},
          content: [],
        },
      },
    })

    expect(wrapper.html()).toContain('<div data-contentful-field-id="content">')
    expect(wrapper.text()).toBe('')
  })

  it('renders br element for empty paragraphs with no content', () => {
    const wrapper = createWrapper({
      fields: {
        content: {
          nodeType: BLOCKS.DOCUMENT,
          data: {},
          content: [
            {
              nodeType: BLOCKS.PARAGRAPH,
              data: {},
              content: [],
            },
          ],
        },
      },
    })

    expect(wrapper.html()).toBe(
      '<div data-contentful-field-id="content"><br></div>',
    )
  })

  it('renders br element for paragraphs with empty text content', () => {
    const wrapper = createWrapper({
      fields: {
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
                  value: '',
                  marks: [],
                  data: {},
                },
              ],
            },
          ],
        },
      },
    })

    expect(wrapper.html()).toBe(
      '<div data-contentful-field-id="content"><br></div>',
    )
  })

  it('renders multiple br elements for multiple empty paragraphs', () => {
    const wrapper = createWrapper({
      fields: {
        content: {
          nodeType: BLOCKS.DOCUMENT,
          data: {},
          content: [
            {
              nodeType: BLOCKS.PARAGRAPH,
              data: {},
              content: [],
            },
            {
              nodeType: BLOCKS.PARAGRAPH,
              data: {},
              content: [
                {
                  nodeType: 'text',
                  value: '',
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
                  value: 'Some text',
                  marks: [],
                  data: {},
                },
              ],
            },
          ],
        },
      },
    })

    expect(wrapper.html()).toBe(
      `<div data-contentful-field-id="content"><br><br>
  <p>Some text</p>
</div>`,
    )
  })
})
