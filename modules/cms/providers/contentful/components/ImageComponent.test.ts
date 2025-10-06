import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import type { Asset } from 'contentful'
import type { TypeImageComponentWithoutUnresolvableLinksResponse } from '../types/gen/TypeImageComponent'
import ImageComponent from './ImageComponent.vue'

const vEditableMock = {
  beforeMount: () => {},
  updated: () => {},
}

vi.mock('#imports', () => ({
  useImage: vi.fn(() => ({
    options: {
      format: ['webp', 'jpeg'],
    },
    getSizes: vi.fn((src, options) => ({
      src: src,
      srcset: `${src} 1x, ${src} 2x`,
      sizes: options.sizes || '100vw',
    })),
  })),
}))

vi.mock('#app/nuxt', () => ({
  useRuntimeConfig: vi.fn(() => ({
    public: {
      storefrontUI: {
        breakpoints: {
          lg: 1024,
        },
      },
    },
    app: {
      baseURL: '/',
    },
  })),
  useNuxtApp: vi.fn(() => ({
    $img: null,
    _img: null,
    ssrContext: null,
  })),
}))

vi.mock('#build/image-options.mjs', () => ({
  imageOptions: {
    format: ['webp', 'jpeg'],
    densities: [1, 2],
    providers: {
      storyblok: {
        name: 'storyblok',
      },
    },
  },
}))

describe('Contentful Image Component', () => {
  const createWrapper = (
    contentElement: Partial<TypeImageComponentWithoutUnresolvableLinksResponse>,
  ) => {
    return mount(ImageComponent, {
      props: {
        contentElement:
          contentElement as TypeImageComponentWithoutUnresolvableLinksResponse,
      },
      global: {
        directives: {
          editable: vEditableMock,
        },
      },
    })
  }

  const mockImageAsset = {
    fields: {
      file: {
        url: 'https://images.ctfassets.net/abc123/1920x1080/test-image.jpg',
        details: {
          image: {
            width: 1920,
            height: 1080,
          },
        },
      },
    },
  } as Asset<'WITHOUT_UNRESOLVABLE_LINKS', string>

  const mockImageAssetWithoutDetails = {
    fields: {
      file: {
        url: 'https://images.ctfassets.net/def456/800x600/test-image-2.jpg',
        details: {
          image: {
            width: 800,
            height: 600,
          },
        },
      },
    },
  } as Asset<'WITHOUT_UNRESOLVABLE_LINKS', string>

  it('renders image when imageDesktop is provided', () => {
    const wrapper = createWrapper({
      fields: {
        imageDesktop: mockImageAsset,
        imageMobile: undefined,
        altText: 'Test image',
        aspectRatioDesktop: undefined,
        aspectRatioMobile: undefined,
      },
    })

    const picture = wrapper.find('picture')
    expect(picture.exists()).toBe(true)

    const sources = wrapper.findAll('source')
    expect(sources.length).toBeGreaterThan(0)

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('alt')).toBe('Test image')
  })

  it('renders multiple sources when both mobile and desktop images are provided', () => {
    const wrapper = createWrapper({
      fields: {
        imageDesktop: mockImageAsset,
        imageMobile: mockImageAssetWithoutDetails,
        altText: 'Test mobile image',
        aspectRatioDesktop: undefined,
        aspectRatioMobile: undefined,
      },
    })

    const picture = wrapper.find('picture')
    expect(picture.exists()).toBe(true)

    const sources = wrapper.findAll('source')
    expect(sources.length).toBeGreaterThan(0)

    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('alt')).toBe('Test mobile image')
  })

  describe('aspect ratio calculations', () => {
    it('calculates correct aspect ratio for 16:9', () => {
      const wrapper = createWrapper({
        fields: {
          imageDesktop: mockImageAsset,
          imageMobile: undefined,
          aspectRatioDesktop: '16:9',
          aspectRatioMobile: undefined,
          altText: 'Alt',
        },
      })

      const container = wrapper.find('div')
      const style = container.attributes('style')
      expect(style).toContain('--desktop-aspect-ratio: 16/9')
    })

    it('calculates correct aspect ratio for 1:1', () => {
      const wrapper = createWrapper({
        fields: {
          imageDesktop: mockImageAsset,
          imageMobile: undefined,
          aspectRatioDesktop: '1:1',
          aspectRatioMobile: undefined,
          altText: 'Alt',
        },
      })

      const container = wrapper.find('div')
      const style = container.attributes('style')
      expect(style).toContain('--desktop-aspect-ratio: 1/1')
    })

    it('calculates correct aspect ratio for 4:3', () => {
      const wrapper = createWrapper({
        fields: {
          imageDesktop: mockImageAsset,
          imageMobile: undefined,
          aspectRatioDesktop: '4:3',
          aspectRatioMobile: undefined,
          altText: 'Alt',
        },
      })

      const container = wrapper.find('div')
      const style = container.attributes('style')
      expect(style).toContain('--desktop-aspect-ratio: 4/3')
    })

    it('calculates correct aspect ratio for original', () => {
      const wrapper = createWrapper({
        fields: {
          imageDesktop: mockImageAsset,
          imageMobile: undefined,
          aspectRatioDesktop: 'original',
          aspectRatioMobile: undefined,
          altText: 'Alt',
        },
      })

      const container = wrapper.find('div')
      const style = container.attributes('style')
      expect(style).toContain('--desktop-aspect-ratio: 1920/1080')
    })

    it('handles image without details by using provided dimensions', () => {
      const wrapper = createWrapper({
        fields: {
          imageDesktop: mockImageAssetWithoutDetails,
          imageMobile: undefined,
          aspectRatioDesktop: 'original',
          aspectRatioMobile: undefined,
          altText: 'Alt',
        },
      })

      const container = wrapper.find('div')
      const style = container.attributes('style')
      expect(style).toContain('--desktop-aspect-ratio: 800/600')
    })

    it('should set mobile and desktop aspect ratio when both are provided', () => {
      const wrapper = createWrapper({
        fields: {
          imageDesktop: mockImageAsset,
          imageMobile: mockImageAssetWithoutDetails,
          altText: 'Alt',
          aspectRatioDesktop: '16:9',
          aspectRatioMobile: '4:3',
        },
      })

      const container = wrapper.find('div')
      const style = container.attributes('style')
      expect(style).toContain('--desktop-aspect-ratio: 16/9')
      expect(style).toContain('--mobile-aspect-ratio: 4/3')
    })

    it('sets correct max-width and max-height based on image dimensions', () => {
      const wrapper = createWrapper({
        fields: {
          imageDesktop: mockImageAsset,
          imageMobile: undefined,
          aspectRatioDesktop: undefined,
          aspectRatioMobile: undefined,
          altText: 'Alt',
        },
      })

      const container = wrapper.find('div')
      const style = container.attributes('style')
      expect(style).toContain('--desktop-max-width: 1920px')
      expect(style).toContain('--desktop-max-height: 1080px')
    })
  })
})
