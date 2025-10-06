import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import type { LocaleCode } from 'contentful'
import type {
  TypeImageComponent,
  TypeLinkComponent,
  TypeTextComponent,
} from '../types'
import LinkComponent from './LinkComponent.vue'

// Mock the composables and utilities
const mockGetLocalizedRoute = vi.fn().mockImplementation((url: string) => url)

vi.mock('~/composables', () => ({
  useRouteHelpers: () => ({
    getLocalizedRoute: mockGetLocalizedRoute,
  }),
}))

const stubs = {
  SFLink: {
    name: 'SFLink',
    props: ['to', 'target'],
    template:
      '<a :href="to" :target="target" data-testid="sf-link"><slot/></a>',
  },
  TextComponent: {
    name: 'TextComponent',
    props: ['contentElement'],
    template:
      '<p data-testid="text-component">{{ contentElement.fields.content }}</p>',
  },
  ImageComponent: {
    name: 'ImageComponent',
    props: ['contentElement'],
    template:
      '<img data-testid="image-component" :src="contentElement.fields.imageDesktop.fields.file.url" :alt="contentElement.fields.altText" />',
  },
}

describe('Contentful Link Component', () => {
  const imageContent = {
    metadata: { tags: [] },
    sys: {
      space: { sys: { type: 'Link', linkType: 'Space', id: 'space-id' } },
      id: 'image-id',
      type: 'Entry',
      createdAt: '2023-01-01T00:00:00.000Z',
      updatedAt: '2023-01-01T00:00:00.000Z',
      environment: {
        sys: { id: 'master', type: 'Link', linkType: 'Environment' },
      },
      revision: 1,
      contentType: {
        sys: {
          type: 'Link',
          linkType: 'ContentType',
          id: 'ImageComponent',
        },
      },
      locale: 'en-US',
    },
    fields: {
      altText: 'alt',
      imageDesktop: {
        metadata: { tags: [] },
        sys: {
          space: { sys: { type: 'Link', linkType: 'Space', id: 'space-id' } },
          id: 'asset-id',
          type: 'Asset',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
          environment: {
            sys: { id: 'master', type: 'Link', linkType: 'Environment' },
          },
          revision: 1,
          locale: 'en-US',
        },
        fields: {
          title: 'Image Title',
          description: 'Image Description',
          file: {
            url: 'https://images.ctfassets.net/space-id/asset-id/image.jpg',
            details: {
              size: 12345,
              image: {
                width: 800,
                height: 600,
              },
            },
            fileName: 'image.jpg',
            contentType: 'image/jpeg',
          },
        },
      },
    },
  } as unknown as TypeImageComponent<'WITHOUT_UNRESOLVABLE_LINKS', LocaleCode>

  it('should render link with image content external link', async () => {
    const contentElement = {
      metadata: { tags: [] },
      sys: {
        space: { sys: { type: 'Link', linkType: 'Space', id: 'space-id' } },
        id: 'test-1',
        type: 'Entry',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
        environment: {
          sys: { id: 'master', type: 'Link', linkType: 'Environment' },
        },
        revision: 1,
        contentType: {
          sys: {
            type: 'Link',
            linkType: 'ContentType',
            id: 'link',
          },
        },
        locale: 'en-US',
      },
      fields: {
        url: 'https://example.com',
        openInNewTab: true,
        content: imageContent,
      },
    } as unknown as TypeLinkComponent<'WITHOUT_UNRESOLVABLE_LINKS', LocaleCode>

    const wrapper: VueWrapper = mount(LinkComponent, {
      props: {
        contentElement,
      },
      global: {
        stubs,
      },
    })

    const sfLink = wrapper.find('[data-testid="sf-link"]')
    expect(sfLink.exists()).toBe(true)
    expect(sfLink.attributes('href')).toBe('https://example.com')
    expect(sfLink.attributes('target')).toBe('_blank')

    const imageComponent = wrapper.find('img')
    expect(imageComponent.exists()).toBe(true)
    expect(imageComponent.attributes('src')).toBe(
      'https://images.ctfassets.net/space-id/asset-id/image.jpg',
    )
    expect(imageComponent.attributes('alt')).toBe('alt')
  })

  it('should render link with image content internal link', () => {
    const contentElement = {
      metadata: { tags: [] },
      sys: {
        space: { sys: { type: 'Link', linkType: 'Space', id: 'space-id' } },
        id: 'test-2',
        type: 'Entry',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
        environment: {
          sys: { id: 'master', type: 'Link', linkType: 'Environment' },
        },
        revision: 1,
        contentType: {
          sys: {
            type: 'Link',
            linkType: 'ContentType',
            id: 'link',
          },
        },
        locale: 'en-US',
      },
      fields: {
        url: '/internal-page',
        openInNewTab: false,
        content: imageContent,
      },
    } as unknown as TypeLinkComponent<'WITHOUT_UNRESOLVABLE_LINKS', LocaleCode>

    const wrapper: VueWrapper = mount(LinkComponent, {
      props: {
        contentElement,
      },
      global: {
        stubs,
      },
    })

    const sfLink = wrapper.find('[data-testid="sf-link"]')
    expect(sfLink.exists()).toBe(true)
    expect(sfLink.attributes('href')).toBe('/internal-page')
    expect(sfLink.attributes('target')).toBe('_self')

    const imageComponent = wrapper.find('img')
    expect(imageComponent.exists()).toBe(true)
    expect(imageComponent.attributes('src')).toBe(
      'https://images.ctfassets.net/space-id/asset-id/image.jpg',
    )
    expect(imageComponent.attributes('alt')).toBe('alt')
  })

  it('renders link with text content', () => {
    const textContent = {
      metadata: { tags: [] },
      sys: {
        space: { sys: { type: 'Link', linkType: 'Space', id: 'space-id' } },
        id: 'text-1',
        type: 'Entry',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
        environment: {
          sys: { id: 'master', type: 'Link', linkType: 'Environment' },
        },
        revision: 1,
        contentType: {
          sys: {
            type: 'Link',
            linkType: 'ContentType',
            id: 'TextComponent',
          },
        },
        locale: 'en-US',
      },
      fields: {
        content: 'Sample text',
        textType: 'p',
      },
    } as unknown as TypeTextComponent<'WITHOUT_UNRESOLVABLE_LINKS', LocaleCode>

    const contentElement = {
      metadata: { tags: [] },
      sys: {
        space: { sys: { type: 'Link', linkType: 'Space', id: 'space-id' } },
        id: 'test-4',
        type: 'Entry',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
        environment: {
          sys: { id: 'master', type: 'Link', linkType: 'Environment' },
        },
        revision: 1,
        contentType: {
          sys: {
            type: 'Link',
            linkType: 'ContentType',
            id: 'link',
          },
        },
        locale: 'en-US',
      },
      fields: {
        url: '/test-text-link',
        openInNewTab: false,
        content: textContent,
      },
    } as unknown as TypeLinkComponent<'WITHOUT_UNRESOLVABLE_LINKS', LocaleCode>

    const wrapper: VueWrapper = mount(LinkComponent, {
      props: {
        contentElement,
      },
      global: {
        stubs,
      },
    })

    const sfLink = wrapper.find('[data-testid="sf-link"]')
    expect(sfLink.exists()).toBe(true)
    expect(sfLink.attributes('href')).toBe('/test-text-link')
    expect(sfLink.attributes('target')).toBe('_self')

    const textComponent = wrapper.find('p')
    expect(textComponent.exists()).toBe(true)
    expect(textComponent.text()).toBe('Sample text')
  })

  it('renders link with openInNewTab set to true', () => {
    const contentElement = {
      metadata: { tags: [] },
      sys: {
        space: { sys: { type: 'Link', linkType: 'Space', id: 'space-id' } },
        id: 'test-5',
        type: 'Entry',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
        environment: {
          sys: { id: 'master', type: 'Link', linkType: 'Environment' },
        },
        revision: 1,
        contentType: {
          sys: {
            type: 'Link',
            linkType: 'ContentType',
            id: 'link',
          },
        },
        locale: 'en-US',
      },
      fields: {
        url: 'https://external-link.com',
        openInNewTab: true,
        content: imageContent,
      },
    } as unknown as TypeLinkComponent<'WITHOUT_UNRESOLVABLE_LINKS', LocaleCode>

    const wrapper: VueWrapper = mount(LinkComponent, {
      props: {
        contentElement,
      },
      global: {
        stubs,
      },
    })

    const sfLink = wrapper.find('[data-testid="sf-link"]')
    expect(sfLink.exists()).toBe(true)
    expect(sfLink.attributes('href')).toBe('https://external-link.com')
    expect(sfLink.attributes('target')).toBe('_blank')

    const imageComponent = wrapper.find('img')
    expect(imageComponent.exists()).toBe(true)
    expect(imageComponent.attributes('src')).toBe(
      'https://images.ctfassets.net/space-id/asset-id/image.jpg',
    )
    expect(imageComponent.attributes('alt')).toBe('alt')
  })
})
