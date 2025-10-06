import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import type { VideoComponent as VideoType } from '../types'
import type { StoryblokAsset } from '../types/gen/storyblok'
import VideoComponent from './VideoComponent.vue'

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
  useRuntimeConfig: vi.fn(() => ({
    public: {
      storefrontUI: {
        breakpoints: {
          lg: 1024,
        },
      },
    },
  })),
  nextTick: vi.fn(() => Promise.resolve()),
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

vi.mock('vue', async () => {
  const actual = (await vi.importActual('vue')) as {
    ref: (value: unknown) => { value: unknown }
  }
  return {
    ...actual,
    useTemplateRef: vi.fn((key: string) => {
      if (key === 'videoEl') {
        return actual.ref({ play: vi.fn() })
      }
      return actual.ref(null)
    }),
  }
})

vi.mock('~~/modules/cms/utils/image', () => ({
  getImageSources: vi.fn(() => [
    {
      src: 'https://example.com/image.webp',
      type: 'image/webp',
      sizes: '100vw',
      srcset: 'https://example.com/image.webp 1x',
      media: '(width >= 1024px)',
    },
  ]),
}))

describe('Storyblok Video Component', () => {
  const createWrapper = (contentElement: Partial<VideoType>) => {
    return mount(VideoComponent, {
      props: {
        contentElement: contentElement as VideoType,
      },
      global: {
        directives: {
          editable: vEditableMock,
        },
        stubs: {
          SFButton: {
            template: '<button @click="$emit(\'click\')"><slot /></button>',
          },
        },
      },
    })
  }

  const mockVideoAsset = {
    filename: 'https://a.storyblok.com/f/123456/video.mp4',
  } as StoryblokAsset

  const mockPreviewImageAsset = {
    filename:
      'https://a.storyblok.com/f/123456/1920x1080/abc123/preview.jpg/m/1920x1080',
    meta_data: {
      size: '1920x1080',
    },
  } as unknown as StoryblokAsset

  it('renders preview image and play button when not autoplaying', () => {
    const wrapper = createWrapper({
      video: mockVideoAsset,
      previewImageDesktop: mockPreviewImageAsset,
      autoplay: false,
    })

    const picture = wrapper.find('picture')
    expect(picture.exists()).toBe(true)

    const playButton = wrapper.find('button')
    expect(playButton.exists()).toBe(true)
    expect(playButton.text()).toBe('▶')

    const video = wrapper.find('video')
    expect(video.exists()).toBe(false)
  })

  it('renders video element when autoplay is true', () => {
    const wrapper = createWrapper({
      video: mockVideoAsset,
      previewImageDesktop: mockPreviewImageAsset,
      autoplay: true,
    })

    const video = wrapper.find('video')
    expect(video.exists()).toBe(true)
    expect(video.attributes('src')).toBe(mockVideoAsset.filename)
    expect(video.attributes('autoplay')).toBeDefined()

    const picture = wrapper.find('picture')
    expect(picture.exists()).toBe(false)
  })

  it('sets correct video attributes based on props', () => {
    const wrapper = createWrapper({
      video: mockVideoAsset,
      previewImageDesktop: mockPreviewImageAsset,
      autoplay: true,
      muted: false,
      loop: false,
      showControls: true,
    })

    const video = wrapper.find('video')
    expect(video.attributes('muted')).toBeUndefined()
    expect(video.attributes('loop')).toBeUndefined()
    expect(video.attributes('controls')).toBeDefined()
  })

  describe('aspect ratio calculations', () => {
    it('sets correct aspect ratio for 16:9', () => {
      const wrapper = createWrapper({
        video: mockVideoAsset,
        previewImageDesktop: mockPreviewImageAsset,
        aspectRatio: '16:9',
        autoplay: false,
      })

      const container = wrapper.find('div')
      const style = container.attributes('style')
      expect(style).toContain('--aspect-ratio: 16/9')
    })

    it('sets correct aspect ratio for 1:1', () => {
      const wrapper = createWrapper({
        video: mockVideoAsset,
        previewImageDesktop: mockPreviewImageAsset,
        aspectRatio: '1:1',
        autoplay: false,
      })

      const container = wrapper.find('div')
      const style = container.attributes('style')
      expect(style).toContain('--aspect-ratio: 1/1')
    })

    it('sets correct aspect ratio for 4:3', () => {
      const wrapper = createWrapper({
        video: mockVideoAsset,
        previewImageDesktop: mockPreviewImageAsset,
        aspectRatio: '4:3',
        autoplay: false,
      })

      const container = wrapper.find('div')
      const style = container.attributes('style')
      expect(style).toContain('--aspect-ratio: 4/3')
    })

    it('defaults to 16:9 aspect ratio when not specified', () => {
      const wrapper = createWrapper({
        video: mockVideoAsset,
        previewImageDesktop: mockPreviewImageAsset,
        autoplay: false,
      })

      const container = wrapper.find('div')
      const style = container.attributes('style')
      expect(style).toContain('--aspect-ratio: 16/9')
    })
  })

  it('starts video when play button is clicked', async () => {
    const wrapper = createWrapper({
      video: mockVideoAsset,
      previewImageDesktop: mockPreviewImageAsset,
      autoplay: false,
    })

    const playButton = wrapper.find('button')
    await playButton.trigger('click')

    // Wait for next tick and re-check
    await wrapper.vm.$nextTick()

    // After clicking play, the video should be visible
    const video = wrapper.find('video')
    expect(video.exists()).toBe(true)
  })
})
