import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import type { ImageComponent as ImageType } from '../types'
import type { StoryblokAsset } from '../types/gen/storyblok'
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

describe('Storyblok Image Component', () => {
  const createWrapper = (contentElement: Partial<ImageType>) => {
    return mount(ImageComponent, {
      props: {
        contentElement: contentElement as ImageType,
      },
      global: {
        directives: {
          editable: vEditableMock,
        },
      },
    })
  }

  const mockImageAsset = {
    filename:
      'https://a.storyblok.com/f/123456/1920x1080/abc123/test-image.jpg/m/1920x1080',
    meta_data: {
      size: '1920x1080',
    },
  } as unknown as StoryblokAsset

  const mockImageAssetWithoutMetadata = {
    filename:
      'https://a.storyblok.com/f/123456/800x600/def456/test-image-2.jpg/m/800x600',
  } as StoryblokAsset

  it('renders image when imageDesktop is provided', () => {
    const wrapper = createWrapper({
      imageDesktop: mockImageAsset,
      imageMobile: undefined,
      altText: 'Test image',
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
      imageDesktop: mockImageAsset,
      imageMobile: mockImageAssetWithoutMetadata,
      altText: 'Test mobile image',
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
        imageDesktop: mockImageAsset,
        imageMobile: undefined,
        aspectRatioDesktop: '16:9',
      })

      const container = wrapper.find('div')
      const style = container.attributes('style')
      expect(style).toContain('--desktop-aspect-ratio: 16/9')
    })

    it('calculates correct aspect ratio for 1:1', () => {
      const wrapper = createWrapper({
        imageDesktop: mockImageAsset,
        imageMobile: undefined,
        aspectRatioDesktop: '1:1',
      })

      const container = wrapper.find('div')
      const style = container.attributes('style')
      expect(style).toContain('--desktop-aspect-ratio: 1/1')
    })

    it('calculates correct aspect ratio for 4:3', () => {
      const wrapper = createWrapper({
        imageDesktop: mockImageAsset,
        imageMobile: undefined,
        aspectRatioDesktop: '4:3',
      })

      const container = wrapper.find('div')
      const style = container.attributes('style')
      expect(style).toContain('--desktop-aspect-ratio: 4/3')
    })

    it('calculates correct aspect ratio for original', () => {
      const wrapper = createWrapper({
        imageDesktop: mockImageAsset,
        imageMobile: undefined,
        aspectRatioDesktop: 'original',
      })

      const container = wrapper.find('div')
      const style = container.attributes('style')
      expect(style).toContain('--desktop-aspect-ratio: 1920/1080')
    })

    it('handles image without meta_data by parsing filename', () => {
      const wrapper = createWrapper({
        imageDesktop: mockImageAssetWithoutMetadata,
        imageMobile: undefined,
        aspectRatioDesktop: 'original',
      })

      const container = wrapper.find('div')
      const style = container.attributes('style')
      expect(style).toContain('--desktop-aspect-ratio: 800/600')
    })

    it('should set mobile and desktop aspect ratio when both are provided', () => {
      const wrapper = createWrapper({
        imageDesktop: mockImageAsset,
        imageMobile: mockImageAssetWithoutMetadata,
        altText: 'Alt',
        aspectRatioDesktop: '16:9',
        aspectRatioMobile: '4:3',
      })

      const container = wrapper.find('div')
      const style = container.attributes('style')
      expect(style).toContain('--desktop-aspect-ratio: 16/9')
      expect(style).toContain('--mobile-aspect-ratio: 4/3')
    })

    it('sets correct max-width and max-height based on image dimensions', () => {
      const wrapper = createWrapper({
        imageDesktop: mockImageAsset,
        imageMobile: undefined,
      })

      const container = wrapper.find('div')
      const style = container.attributes('style')
      expect(style).toContain('--desktop-max-width: 1920px')
      expect(style).toContain('--desktop-max-height: 1080px')
    })
  })
})
