import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import type { AccordionItemComponent, TextComponent } from '../types'
import AccordionItem from './AccordionItemComponent.vue'

describe('Storyblok AccordionItem Component', () => {
  const createWrapper = (contentElement: Partial<AccordionItemComponent>) => {
    return mount(AccordionItem, {
      props: {
        contentElement: {
          _uid: 'test-item-uid',
          title: 'Test Title',
          content: [],
          component: 'AccordionItemComponent',
          ...contentElement,
        } as AccordionItemComponent,
      },
      global: {
        stubs: {
          StoryblokComponent: {
            name: 'StoryblokComponent',
            template:
              '<div data-testid="storyblok-component">{{ contentElement._uid }}</div>',
            props: ['contentElement'],
          },
        },
        directives: {
          editable: {},
        },
      },
    })
  }

  it('renders SFAccordionEntry with correct id and title', () => {
    const wrapper = createWrapper({
      _uid: 'custom-uid',
      title: 'Custom Title',
    })

    const title = wrapper.find('[data-testid="mobile-nav-accordion"]')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('Custom Title')
  })

  it('renders child components inside SFAccordionEntry', () => {
    const mockContent = [
      {
        _uid: 'child-1',
        component: 'TestComponent',
      } as unknown as TextComponent,
      {
        _uid: 'child-2',
        component: 'TestComponent',
      } as unknown as TextComponent,
    ]

    const wrapper = createWrapper({
      content: mockContent,
    })

    const childComponents = wrapper.findAll(
      '[data-testid="storyblok-component"]',
    )
    expect(childComponents).toHaveLength(2)
    expect(childComponents?.[0]?.text()).toBe('child-1')
    expect(childComponents?.[1]?.text()).toBe('child-2')
  })

  it('handles empty title', () => {
    const wrapper = createWrapper({
      title: '',
    })

    const title = wrapper.find('[data-testid="mobile-nav-accordion"]')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('')
  })

  it('handles empty content array', () => {
    const wrapper = createWrapper({
      content: [],
    })

    const title = wrapper.find('[data-testid="mobile-nav-accordion"]')
    expect(title.exists()).toBe(true)
    expect(wrapper.findAll('[data-testid="storyblok-component"]')).toHaveLength(
      0,
    )
  })
})
