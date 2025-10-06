import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import type { RichTextComponent } from '../types'
import RichText from './RichTextComponent.vue'

// Mock the v-editable directive since it's not available in test environment
const vEditableMock = {
  beforeMount: () => {},
  updated: () => {},
}

const mockGetLocalizedRoute = vi.fn().mockImplementation((url: string) => url)

vi.mock('~/composables', () => ({
  useRouteHelpers: () => ({
    getLocalizedRoute: mockGetLocalizedRoute,
  }),
}))

describe('Storyblok RichText Component', () => {
  const createWrapper = (contentElement: Partial<RichTextComponent>) => {
    return mount(RichText, {
      props: {
        contentElement: contentElement as RichTextComponent,
      },
      global: {
        directives: {
          editable: vEditableMock,
        },
      },
    })
  }

  it('renders simple paragraph content', () => {
    const wrapper = createWrapper({
      content: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Test paragraph content',
              },
            ],
          },
        ],
      },
    })

    expect(wrapper.text()).toContain('Test paragraph content')
    expect(wrapper.find('p').exists()).toBe(true)
  })

  it('renders h1 heading with custom styling', () => {
    const wrapper = createWrapper({
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
                text: 'Main Heading',
              },
            ],
          },
        ],
      },
    })

    const h1 = wrapper.find('h1')
    expect(h1.exists()).toBe(true)
    expect(h1.text()).toBe('Main Heading')
    expect(h1.classes()).toContain('text-3xl')
    expect(h1.classes()).toContain('font-semibold')
  })

  it('renders h2 heading with custom styling', () => {
    const wrapper = createWrapper({
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
                text: 'Section Heading',
              },
            ],
          },
        ],
      },
    })

    const h2 = wrapper.find('h2')
    expect(h2.exists()).toBe(true)
    expect(h2.text()).toBe('Section Heading')
    expect(h2.classes()).toContain('text-2xl')
    expect(h2.classes()).toContain('font-semibold')
  })

  it('renders h3 heading with custom styling', () => {
    const wrapper = createWrapper({
      content: {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: {
              level: 3,
            },
            content: [
              {
                type: 'text',
                text: 'Subsection Heading',
              },
            ],
          },
        ],
      },
    })

    const h3 = wrapper.find('h3')
    expect(h3.exists()).toBe(true)
    expect(h3.text()).toBe('Subsection Heading')
    expect(h3.classes()).toContain('text-xl')
    expect(h3.classes()).toContain('font-semibold')
  })

  it('defaults to h1 when heading level is not 1, 2, or 3', () => {
    const wrapper = createWrapper({
      content: {
        type: 'doc',
        content: [
          {
            type: 'heading',
            attrs: {
              level: 5,
            },
            content: [
              {
                type: 'text',
                text: 'Unknown Level Heading',
              },
            ],
          },
        ],
      },
    })

    const h1 = wrapper.find('h1')
    expect(h1.exists()).toBe(true)
    expect(h1.text()).toBe('Unknown Level Heading')
    expect(h1.classes()).toContain('text-3xl')
    expect(h1.classes()).toContain('font-semibold')
  })

  it('renders unordered list with custom styling', () => {
    const wrapper = createWrapper({
      content: {
        type: 'doc',
        content: [
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
                        text: 'First item',
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
                        text: 'Second item',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    })

    const ul = wrapper.find('ul')
    expect(ul.exists()).toBe(true)
    expect(ul.classes()).toContain('list-disc')
    expect(ul.classes()).toContain('pl-6')

    const listItems = wrapper.findAll('li')
    expect(listItems).toHaveLength(2)
    expect(listItems[0]?.text()).toContain('First item')
    expect(listItems[1]?.text()).toContain('Second item')
  })

  it('renders ordered list with custom styling', () => {
    const wrapper = createWrapper({
      content: {
        type: 'doc',
        content: [
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
                        text: 'Step one',
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
                        text: 'Step two',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    })

    const ol = wrapper.find('ol')
    expect(ol.exists()).toBe(true)
    expect(ol.classes()).toContain('list-decimal')
    expect(ol.classes()).toContain('pl-6')

    const listItems = wrapper.findAll('li')
    expect(listItems).toHaveLength(2)
    expect(listItems[0]?.text()).toContain('Step one')
    expect(listItems[1]?.text()).toContain('Step two')
  })

  it('renders links with custom styling', () => {
    const wrapper = createWrapper({
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
                text: 'website',
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
                text: ' for more info.',
              },
            ],
          },
        ],
      },
    })

    const paragraph = wrapper.find('p')
    expect(paragraph.exists()).toBe(true)
    expect(paragraph.text()).toContain('Visit our website for more info.')

    const link = wrapper.find('a')
    expect(link.exists()).toBe(true)
    expect(link.text()).toBe('website')
    expect(link.classes()).toContain('font-semibold')
    expect(link.attributes('href')).toBe('https://example.com')
    expect(link.attributes('target')).toBe('_blank')
  })

  it('renders complex content with multiple elements', () => {
    const wrapper = createWrapper({
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
                text: 'Getting Started',
              },
            ],
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Welcome to our guide. Please visit our ',
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
                text: ' for details.',
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
                text: 'Steps to follow:',
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
                        text: 'Read the documentation',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    })

    // Check that all elements are rendered with correct styling
    const h1 = wrapper.find('h1')
    expect(h1.exists()).toBe(true)
    expect(h1.text()).toBe('Getting Started')
    expect(h1.classes()).toContain('text-3xl')
    expect(h1.classes()).toContain('font-semibold')

    const h2 = wrapper.find('h2')
    expect(h2.exists()).toBe(true)
    expect(h2.text()).toBe('Steps to follow:')
    expect(h2.classes()).toContain('text-2xl')
    expect(h2.classes()).toContain('font-semibold')

    const link = wrapper.find('a')
    expect(link.exists()).toBe(true)
    expect(link.text()).toBe('documentation')
    expect(link.classes()).toContain('font-semibold')
    expect(link.attributes('href')).toBe('https://docs.example.com')

    const ol = wrapper.find('ol')
    expect(ol.exists()).toBe(true)
    expect(ol.classes()).toContain('list-decimal')
    expect(ol.classes()).toContain('pl-6')
  })

  it('handles empty content gracefully', () => {
    const wrapper = createWrapper({
      content: {
        type: 'doc',
        content: [],
      },
    })

    expect(wrapper.find('div').exists()).toBe(true)
    expect(wrapper.text()).toBe('')
  })

  it('handles content with only empty paragraphs', () => {
    const wrapper = createWrapper({
      content: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [],
          },
        ],
      },
    })

    expect(wrapper.find('p').exists()).toBe(true)
    expect(wrapper.text()).toBe('')
  })

  it('renders br element for paragraphs with no children', () => {
    const wrapper = createWrapper({
      content: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            // No content property means no children
          },
        ],
      },
    })

    expect(wrapper.find('br').exists()).toBe(true)
    expect(wrapper.find('p').exists()).toBe(false)
    expect(wrapper.text()).toBe('')
  })

  it('renders br elements for multiple empty paragraphs without children', () => {
    const wrapper = createWrapper({
      content: {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            // No content property
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Some text',
              },
            ],
          },
          {
            type: 'paragraph',
            // No content property
          },
        ],
      },
    })

    const brElements = wrapper.findAll('br')
    expect(brElements).toHaveLength(2)

    const paragraph = wrapper.find('p')
    expect(paragraph.exists()).toBe(true)
    expect(paragraph.text()).toBe('Some text')
  })

  it('renders mixed content with br elements and regular paragraphs', () => {
    const wrapper = createWrapper({
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
                text: 'Title',
              },
            ],
          },
          {
            type: 'paragraph',
            // Empty paragraph - should render as br
          },
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'Regular paragraph content',
              },
            ],
          },
        ],
      },
    })

    // Check h2 heading exists
    const h2 = wrapper.find('h2')
    expect(h2.exists()).toBe(true)
    expect(h2.text()).toBe('Title')

    // Check br element exists for empty paragraph
    const br = wrapper.find('br')
    expect(br.exists()).toBe(true)

    // Check regular paragraph exists
    const paragraph = wrapper.find('p')
    expect(paragraph.exists()).toBe(true)
    expect(paragraph.text()).toBe('Regular paragraph content')
  })
})
