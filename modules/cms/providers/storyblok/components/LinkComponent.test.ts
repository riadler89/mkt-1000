import type { VueWrapper } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import type {
  ImageComponent,
  LinkComponent as LinkComponentType,
  TextComponent,
} from '../types'
import type { StoryblokAsset, StoryblokMultilink } from '../types/gen/storyblok'
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
      '<p data-testid="text-component">{{ contentElement.content }}</p>',
  },
  ImageComponent: {
    name: 'ImageComponent',
    props: ['contentElement'],
    template:
      '<img data-testid="image-component" :src="contentElement.imageDesktop.filename" :alt="contentElement.altText" />',
  },
}

describe('Storyblok Link Component', () => {
  const imageContent = {
    _uid: 'image',
    component: 'ImageComponent',
    altText: 'alt',
    imageDesktop: {
      filename: 'image.jpg',
    } as StoryblokAsset,
  } as ImageComponent
  it('should render link with image content external link', async () => {
    const contentElement: LinkComponentType = {
      _uid: 'test-1',
      component: 'LinkComponent',
      url: {
        linktype: 'url',
        url: 'https://example.com',
        cached_url: 'https://example.com',
        fieldtype: 'multilink',
        id: '1',
        target: '_blank',
      },
      content: [imageContent],
    }

    const wrapper: VueWrapper = mount(LinkComponent, {
      props: {
        contentElement,
      },
      global: {
        stubs,
        directives: {
          editable: {},
        },
      },
    })
    const sfLink = wrapper.find('[data-testid="sf-link"]')
    expect(sfLink.exists()).toBe(true)
    expect(sfLink.attributes('href')).toBe('https://example.com')
    expect(sfLink.attributes('target')).toBe('_blank')

    const imageComponent = wrapper.find('img')
    expect(imageComponent.exists()).toBe(true)
    expect(imageComponent.attributes('src')).toBe('image.jpg')
    expect(imageComponent.attributes('alt')).toBe('alt')
  })

  it('should render link with image content link type story for the URL', () => {
    const contentElement: LinkComponentType = {
      _uid: 'test-2',
      component: 'LinkComponent',
      url: {
        linktype: 'story',
        story: {
          full_slug: 'test2',
        },
        cached_url: 'not-used',
        fieldtype: 'multilink',
        id: '1',
        target: '_self',
      } as StoryblokMultilink,
      content: [imageContent],
    }

    const wrapper: VueWrapper = mount(LinkComponent, {
      props: {
        contentElement,
      },
      global: {
        stubs,
        directives: {
          editable: {},
        },
      },
    })

    const sfLink = wrapper.find('[data-testid="sf-link"]')
    expect(sfLink.exists()).toBe(true)
    expect(sfLink.attributes('href')).toBe('test2')
    expect(sfLink.attributes('target')).toBe('_self')

    const imageComponent = wrapper.find('img')
    expect(imageComponent.exists()).toBe(true)
    expect(imageComponent.attributes('src')).toBe('image.jpg')
    expect(imageComponent.attributes('alt')).toBe('alt')
  })

  it('renders link with cached_url when url and story are undefined', () => {
    const contentElement: LinkComponentType = {
      _uid: 'test-3',
      component: 'LinkComponent',
      url: {
        id: '82b9aabd-9536-4d30-bd74-ef6eef128982',
        url: '',
        linktype: 'story',
        fieldtype: 'multilink',
        cached_url: '/fallback-url',
        target: '_self',
      } as StoryblokMultilink,
      content: [imageContent],
    }

    const wrapper: VueWrapper = mount(LinkComponent, {
      props: {
        contentElement,
      },
      global: {
        stubs,
        directives: {
          editable: {},
        },
      },
    })

    const sfLink = wrapper.find('[data-testid="sf-link"]')
    expect(sfLink.exists()).toBe(true)
    expect(sfLink.attributes('href')).toBe('/fallback-url')
    expect(sfLink.attributes('target')).toBe('_self')

    const imageComponent = wrapper.find('img')
    expect(imageComponent.exists()).toBe(true)
    expect(imageComponent.attributes('src')).toBe('image.jpg')
    expect(imageComponent.attributes('alt')).toBe('alt')
  })

  it('renders link with image and text content', () => {
    const textContent = {
      _uid: 'text-1',
      component: 'TextComponent',
      content: 'Sample text',
    } as TextComponent
    const contentElement: LinkComponentType = {
      _uid: 'test-4',
      component: 'LinkComponent',
      url: {
        id: '1234',
        url: '/test-image-text',
        linktype: 'url',
        fieldtype: 'multilink',
        cached_url: '',
        target: '_self',
      } as StoryblokMultilink,
      content: [textContent],
    }

    const wrapper: VueWrapper = mount(LinkComponent, {
      props: {
        contentElement,
      },
      global: {
        stubs,
        directives: {
          editable: {},
        },
      },
    })

    const sfLink = wrapper.find('[data-testid="sf-link"]')
    expect(sfLink.exists()).toBe(true)
    expect(sfLink.attributes('href')).toBe('/test-image-text')
    expect(sfLink.attributes('target')).toBe('_self')

    const textComponent = wrapper.find('p')
    expect(textComponent.exists()).toBe(true)
    expect(textComponent.text()).toBe('Sample text')
  })

  it('renders link with openInNewTab set to true', () => {
    const contentElement: LinkComponentType = {
      _uid: 'test-5',
      component: 'LinkComponent',
      url: {
        id: '5678',
        url: 'https://external-link',
        linktype: 'url',
        fieldtype: 'multilink',
        cached_url: '',
        target: '_blank',
      } as StoryblokMultilink,
      content: [imageContent],
    }

    const wrapper: VueWrapper = mount(LinkComponent, {
      props: {
        contentElement,
      },
      global: {
        stubs,
        directives: {
          editable: {},
        },
      },
    })

    const sfLink = wrapper.find('[data-testid="sf-link"]')
    expect(sfLink.exists()).toBe(true)
    expect(sfLink.attributes('href')).toBe('https://external-link')
    expect(sfLink.attributes('target')).toBe('_blank')

    const imageComponent = wrapper.find('img')
    expect(imageComponent.exists()).toBe(true)
    expect(imageComponent.attributes('src')).toBe('image.jpg')
    expect(imageComponent.attributes('alt')).toBe('alt')
  })
})
