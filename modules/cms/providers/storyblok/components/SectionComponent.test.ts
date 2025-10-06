import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import type {
  ImageComponent,
  SectionComponent as SectionType,
  TextComponent,
} from '../types'
import type { StoryblokAsset } from '../types/gen/storyblok'
import SectionComponent from './SectionComponent.vue'
import StoryblokComponent from './StoryblokComponent.vue'

const vEditableMock = {
  beforeMount: () => {},
  updated: () => {},
}

vi.mock('./StoryblokComponent.vue', () => ({
  default: {
    name: 'StoryblokComponent',
    template:
      '<div data-testid="storyblok-child">Mock Storyblok Component</div>',
    props: ['contentElement'],
  },
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
    $img: {
      options: {
        format: ['webp', 'jpeg'],
      },
      getImage: vi.fn((url: string) => ({ url })),
      getSizes: vi.fn((src, options) => ({
        src: src,
        srcset: `${src} 1x, ${src} 2x`,
        sizes: options.sizes || '100vw',
      })),
    },
    _img: null,
    ssrContext: null,
  })),
}))

describe('Storyblok Section Component', () => {
  const createWrapper = (contentElement: Partial<SectionType>) => {
    return mount(SectionComponent, {
      props: {
        contentElement: contentElement as SectionType,
      },
      global: {
        directives: {
          editable: vEditableMock,
        },
        components: {
          StoryblokComponent,
        },
      },
    })
  }

  const mockBackgroundImage = {
    filename: 'https://a.storyblok.com/f/123456/1920x1080/abc123/bg-image.jpg',
  } as StoryblokAsset

  const mockMobileBackgroundImage = {
    filename: 'https://a.storyblok.com/f/123456/800x600/def456/bg-mobile.jpg',
  } as StoryblokAsset

  const mockChildContent = [
    {
      component: 'TextComponent',
      _uid: 'text-1',
      content: 'Test content',
    } as TextComponent,
    {
      component: 'ImageComponent',
      _uid: 'image-1',
      altText: 'Test image',
    } as ImageComponent,
  ]

  it('renders section element with basic props', () => {
    const wrapper = createWrapper({
      backgroundColor: '#f0f0f0',
      padding: 'medium',
      content: mockChildContent,
    })

    const section = wrapper.find('section')
    expect(section.exists()).toBe(true)
    const content = section.find('div')
    expect(content.classes()).toContain('p-5')
    expect(content.classes()).toContain('lg:p-9')
  })

  it.each([
    { padding: 'small', expectedClasses: ['p-3', 'lg:p-5'] },
    { padding: 'medium', expectedClasses: ['p-5', 'lg:p-9'] },
    { padding: 'large', expectedClasses: ['p-9', 'lg:p-12'] },
    { padding: 'none', expectedClasses: ['p-0'] },
    { padding: undefined, expectedClasses: ['p-0'] },
  ])(
    'applies correct padding class for padding: $padding',
    ({ padding, expectedClasses }) => {
      const wrapper = createWrapper({
        padding: padding as SectionType['padding'],
        content: [],
      })

      for (const expectedClass of expectedClasses) {
        expect(wrapper.find('section > div').classes()).toContain(expectedClass)
      }
    },
  )

  it('applies background color correctly', () => {
    const wrapper = createWrapper({
      backgroundColor: '#ff0000',
      content: [],
    })

    const section = wrapper.find('section')
    const style = section.attributes('style')
    expect(style).toContain('background-color: #ff0000')
  })

  it('applies background images correctly', () => {
    const wrapper = createWrapper({
      backgroundImageDesktop: mockBackgroundImage,
      backgroundImageMobile: mockMobileBackgroundImage,
      content: [],
    })

    const section = wrapper.find('section')
    expect(section.classes()).toContain('relative')
    const picture = section.find('picture')
    expect(picture.element.children).toHaveLength(4)
  })

  it('falls back to desktop image when mobile image is not provided', () => {
    const wrapper = createWrapper({
      backgroundImageDesktop: mockBackgroundImage,
      content: [],
    })

    const section = wrapper.find('section')
    expect(section.classes()).toContain('relative')
    const picture = section.find('picture')
    expect(picture.element.children).toHaveLength(2)
    expect(picture.find('source').attributes('media')).toBeUndefined()
  })

  it('renders child components correctly', () => {
    const wrapper = createWrapper({
      content: mockChildContent,
    })

    const childComponents = wrapper.findAllComponents({
      name: 'StoryblokComponent',
    })
    expect(childComponents).toHaveLength(2)
    expect(childComponents?.[0]?.props('contentElement')).toEqual(
      mockChildContent[0],
    )
    expect(childComponents?.[1]?.props('contentElement')).toEqual(
      mockChildContent[1],
    )
  })

  it('handles sections without background images', () => {
    const wrapper = createWrapper({
      backgroundColor: '#f0f0f0',
      padding: 'medium',
      content: [mockChildContent[0] as TextComponent],
    })

    const section = wrapper.find('section')
    expect(section.findAll('picture')).toHaveLength(0)
    expect(section.exists()).toBe(true)
    const content = section.find('div')
    expect(content.classes()).toContain('p-5')
    expect(content.classes()).toContain('lg:p-9')
    const childComponents = content.findAllComponents({
      name: 'StoryblokComponent',
    })
    expect(childComponents).toHaveLength(1)
  })
})
