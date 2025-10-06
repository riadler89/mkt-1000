import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import type { Asset } from 'contentful'
import type { TypeSectionComponentWithoutUnresolvableLinksResponse } from '../types/gen/TypeSectionComponent'
import type {
  TypeTextComponentWithoutUnresolvableLinksResponse,
  TypeImageComponentWithoutUnresolvableLinksResponse,
} from '../types'
import SectionComponent from './SectionComponent.vue'
import ContentfulComponent from './ContentfulComponent.vue'

vi.mock('./ContentfulComponent.vue', () => ({
  default: {
    name: 'ContentfulComponent',
    template:
      '<div data-testid="contentful-child">Mock Contentful Component</div>',
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

describe('Contentful Section Component', () => {
  const createWrapper = (
    contentElement: {
      fields?: Partial<
        TypeSectionComponentWithoutUnresolvableLinksResponse['fields']
      >
    } & Partial<
      Omit<TypeSectionComponentWithoutUnresolvableLinksResponse, 'fields'>
    >,
  ) => {
    return mount(SectionComponent, {
      props: {
        contentElement:
          contentElement as TypeSectionComponentWithoutUnresolvableLinksResponse,
      },
      global: {
        components: {
          ContentfulComponent,
        },
      },
    })
  }

  const mockBackgroundImage = {
    fields: {
      file: {
        url: 'https://images.ctfassets.net/abc123/1920x1080/bg-image.jpg',
      },
    },
  } as Asset<'WITHOUT_UNRESOLVABLE_LINKS', string>

  const mockMobileBackgroundImage = {
    fields: {
      file: {
        url: 'https://images.ctfassets.net/def456/800x600/bg-mobile.jpg',
      },
    },
  } as Asset<'WITHOUT_UNRESOLVABLE_LINKS', string>

  const mockChildContent = [
    {
      sys: { id: 'text-1', contentType: { sys: { id: 'TextComponent' } } },
      fields: { content: 'Test content' },
    } as TypeTextComponentWithoutUnresolvableLinksResponse,
    {
      sys: { id: 'image-1', contentType: { sys: { id: 'ImageComponent' } } },
      fields: { altText: 'Test image' },
    } as TypeImageComponentWithoutUnresolvableLinksResponse,
  ]

  it('renders section element with basic props', () => {
    const wrapper = createWrapper({
      fields: {
        backgroundColor: '#f0f0f0',
        padding: 'medium',
        content: mockChildContent,
      },
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
    { padding: undefined, expectedClasses: ['p-0'] }, // default
  ])(
    'applies correct padding class for padding: $padding',
    ({ padding, expectedClasses }) => {
      const wrapper = createWrapper({
        fields: {
          padding: padding as 'small' | 'medium' | 'large' | 'none',
          content: [],
        },
      })

      for (const expectedClass of expectedClasses) {
        expect(wrapper.find('section > div').classes()).toContain(expectedClass)
      }
    },
  )

  it('applies background color correctly', () => {
    const wrapper = createWrapper({
      fields: {
        backgroundColor: '#ff0000',
        backgroundImageDesktop: mockBackgroundImage,
        content: [],
      },
    })

    const section = wrapper.find('section')
    const style = section.attributes('style')
    expect(style).toContain('background-color: #ff0000')
  })

  it('applies background images correctly', () => {
    const wrapper = createWrapper({
      fields: {
        backgroundImageDesktop: mockBackgroundImage,
        backgroundImageMobile: mockMobileBackgroundImage,
        content: [],
      },
    })

    const section = wrapper.find('section')
    expect(section.classes()).toContain('relative')
    const picture = section.find('picture')
    expect(picture.element.children).toHaveLength(4)
  })

  it('falls back to desktop image when mobile image is not provided', () => {
    const wrapper = createWrapper({
      fields: {
        backgroundImageDesktop: mockBackgroundImage,
        content: [],
      },
    })

    const section = wrapper.find('section')
    expect(section.classes()).toContain('relative')
    const picture = section.find('picture')
    expect(picture.element.children).toHaveLength(2)
    expect(picture.find('source').attributes('media')).toBeUndefined()
  })

  it('renders child components correctly', () => {
    const wrapper = createWrapper({
      fields: {
        content: mockChildContent,
      },
    })

    const childComponents = wrapper.findAllComponents({
      name: 'ContentfulComponent',
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
      fields: {
        backgroundColor: '#f0f0f0',
        padding: 'medium',
        content: mockChildContent,
      },
    })
    const section = wrapper.find('section')
    expect(section.findAll('picture')).toHaveLength(0)
    expect(section.exists()).toBe(true)
    const content = section.find('div')
    expect(content.classes()).toContain('p-5')
    expect(content.classes()).toContain('lg:p-9')
    const childComponents = content.findAllComponents({
      name: 'ContentfulComponent',
    })
    expect(childComponents).toHaveLength(2)
  })
})
