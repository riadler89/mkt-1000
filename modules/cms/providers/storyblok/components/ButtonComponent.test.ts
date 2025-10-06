import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import type { ButtonComponent } from '../types'
import type { StoryblokMultilink } from '../types/gen/storyblok.d'
import ButtonComponentVue from './ButtonComponent.vue'

// Mock the composables
vi.mock('~/composables', () => ({
  useRouteHelpers: () => ({
    getLocalizedRoute: vi.fn((url: string) => url),
  }),
}))

const vEditableMock = {
  beforeMount: () => {},
  updated: () => {},
}

describe('Storyblok ButtonComponent', () => {
  const createContentElement = (
    text = 'Button Text',
    style: ButtonComponent['style'] = 'primary',
    url = {
      fieldtype: 'multilink',
      id: 'test-id',
      url: 'https://example.com/test-page',
      linktype: 'url',
      target: '_self',
    } as StoryblokMultilink,
  ): ButtonComponent => ({
    text,
    style,
    url,
    component: 'ButtonComponent',
    _uid: 'test-uid',
  })

  it('should render button with default primary variant', () => {
    const contentElement = createContentElement()
    const wrapper = mount(ButtonComponentVue, {
      props: { contentElement },
      global: {
        stubs: {
          SFButton: {
            name: 'SFButton',
            template: '<button v-bind="$props"><slot /></button>',
            props: ['variant', 'to', 'target'],
          },
        },
        directives: {
          editable: vEditableMock,
        },
      },
    })

    const button = wrapper.findComponent({ name: 'SFButton' })
    expect(button.props('variant')).toBe('primary')
    expect(button.text()).toBe('Button Text')
  })

  it.each([
    { style: 'primary' as const, expectedVariant: 'primary' },
    { style: 'secondary' as const, expectedVariant: 'secondary' },
    { style: 'outline' as const, expectedVariant: 'tertiary' },
    { style: 'accent' as const, expectedVariant: 'accent' },
    { style: '' as const, expectedVariant: 'primary' },
  ])('should map style variants correctly', ({ style, expectedVariant }) => {
    const contentElement = createContentElement('Test', style)
    const wrapper = mount(ButtonComponentVue, {
      props: { contentElement },
      global: {
        stubs: {
          SFButton: {
            name: 'SFButton',
            template: '<button v-bind="$props"><slot /></button>',
            props: ['variant', 'to', 'target'],
          },
        },
        directives: {
          editable: vEditableMock,
        },
      },
    })

    const button = wrapper.findComponent({ name: 'SFButton' })
    expect(button.props('variant')).toBe(expectedVariant)
  })

  it('should fallback to primary variant for unknown style', () => {
    const contentElement = createContentElement('Test')
    const wrapper = mount(ButtonComponentVue, {
      props: { contentElement },
      global: {
        stubs: {
          SFButton: {
            name: 'SFButton',
            template: '<button v-bind="$props"><slot /></button>',
            props: ['variant', 'to', 'target'],
          },
        },
        directives: {
          editable: vEditableMock,
        },
      },
    })

    const button = wrapper.findComponent({ name: 'SFButton' })
    expect(button.props('variant')).toBe('primary')
  })

  it('should generate correct URL with localized route from cached_url', () => {
    const url = {
      fieldtype: 'multilink',
      id: 'test-id',
      cached_url: '/test-page',
      linktype: 'url',
      target: '_self',
    } as StoryblokMultilink

    const contentElement = createContentElement('Test', 'primary', url)
    const wrapper = mount(ButtonComponentVue, {
      props: { contentElement },
      global: {
        stubs: {
          SFButton: {
            name: 'SFButton',
            template: '<button v-bind="$props"><slot /></button>',
            props: ['variant', 'to', 'target'],
          },
        },
        directives: {
          editable: vEditableMock,
        },
      },
    })

    const button = wrapper.findComponent({ name: 'SFButton' })
    expect(button.props('to')).toBe('/test-page')
  })

  it('should pass through target attribute from URL', () => {
    const url = {
      fieldtype: 'multilink',
      id: 'test-id',
      url: 'https://example.com/test-page',
      linktype: 'url',
      target: '_blank',
    } as StoryblokMultilink
    const contentElement = createContentElement('Test', 'primary', url)
    const wrapper = mount(ButtonComponentVue, {
      props: { contentElement },
      global: {
        stubs: {
          SFButton: {
            name: 'SFButton',
            template: '<button v-bind="$props"><slot /></button>',
            props: ['variant', 'to', 'target'],
          },
        },
        directives: {
          editable: vEditableMock,
        },
      },
    })

    const button = wrapper.findComponent({ name: 'SFButton' })
    expect(button.props('target')).toBe('_blank')
  })

  it('should handle _self target attribute', () => {
    const url = {
      fieldtype: 'multilink',
      id: 'test-id',
      url: '/test-page',
      linktype: 'url',
      target: '_self',
    } as StoryblokMultilink
    const contentElement = createContentElement('Test', 'primary', url)
    const wrapper = mount(ButtonComponentVue, {
      props: { contentElement },
      global: {
        stubs: {
          SFButton: {
            name: 'SFButton',
            template: '<button v-bind="$props"><slot /></button>',
            props: ['variant', 'to', 'target'],
          },
        },
        directives: {
          editable: vEditableMock,
        },
      },
    })

    const button = wrapper.findComponent({ name: 'SFButton' })
    expect(button.props('target')).toBe('_self')
  })
  it('should render button text correctly', () => {
    const contentElement = createContentElement('Custom Button Text')
    const wrapper = mount(ButtonComponentVue, {
      props: { contentElement },
      global: {
        stubs: {
          SFButton: {
            name: 'SFButton',
            template: '<button v-bind="$props"><slot /></button>',
            props: ['variant', 'to', 'target'],
          },
        },
        directives: {
          editable: vEditableMock,
        },
      },
    })

    expect(wrapper.text()).toBe('Custom Button Text')
  })

  it('should handle different URL structures correctly', () => {
    const urlWithDifferentCachedUrl = {
      fieldtype: 'multilink',
      id: 'test-id',
      cached_url: '/different-cached-url',
      linktype: 'url',
      target: '_self',
    } as StoryblokMultilink

    const contentElement = createContentElement(
      'Test',
      'primary',
      urlWithDifferentCachedUrl,
    )
    const wrapper = mount(ButtonComponentVue, {
      props: { contentElement },
      global: {
        stubs: {
          SFButton: {
            name: 'SFButton',
            template: '<button v-bind="$props"><slot /></button>',
            props: ['variant', 'to', 'target'],
          },
        },
        directives: {
          editable: vEditableMock,
        },
      },
    })

    const button = wrapper.findComponent({ name: 'SFButton' })
    expect(button.props('to')).toBe('/different-cached-url')
  })

  it('should handle absolute URL structures correctly', () => {
    const urlWithAbsoluteUrl = {
      fieldtype: 'multilink',
      id: 'test-id',
      url: 'https://example.com/test-page',
      linktype: 'url',
      target: '_self',
    } as StoryblokMultilink

    const contentElement = createContentElement(
      'Test',
      'primary',
      urlWithAbsoluteUrl,
    )
    const wrapper = mount(ButtonComponentVue, {
      props: { contentElement },
      global: {
        stubs: {
          SFButton: {
            name: 'SFButton',
            template: '<button v-bind="$props"><slot /></button>',
            props: ['variant', 'to', 'target'],
          },
        },
        directives: {
          editable: vEditableMock,
        },
      },
    })

    const button = wrapper.findComponent({ name: 'SFButton' })
    expect(button.props('to')).toBe('https://example.com/test-page')
  })
})
