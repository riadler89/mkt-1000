import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import type { AccordionComponent, AccordionItemComponent } from '../types'
import Accordion from './AccordionComponent.vue'

describe('Storyblok Accordion Component', () => {
  const createWrapper = (contentElement: Partial<AccordionComponent>) => {
    return mount(Accordion, {
      props: {
        contentElement: {
          _uid: 'test-uid',
          content: [],
          ...contentElement,
        } as AccordionComponent,
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

  it('renders without title when title is not provided', () => {
    const wrapper = createWrapper({})

    expect(wrapper.find('.text-xl.font-medium').exists()).toBe(false)
  })

  it('renders title when title is provided', () => {
    const wrapper = createWrapper({
      title: 'Test Accordion Title',
    })

    const titleElement = wrapper.find('.text-xl.font-medium')
    expect(titleElement.exists()).toBe(true)
    expect(titleElement.text()).toBe('Test Accordion Title')
  })

  it('renders child components', () => {
    const mockContent = [
      {
        _uid: 'child-1',
        component: 'AccordionItemComponent',
      } as AccordionItemComponent,
      {
        _uid: 'child-2',
        component: 'AccordionItemComponent',
      } as AccordionItemComponent,
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

  it('handles empty content array', () => {
    const wrapper = createWrapper({
      title: 'Test Title',
      content: [],
    })

    expect(wrapper.find('.text-xl.font-medium').text()).toBe('Test Title')
    expect(wrapper.findAll('[data-testid="storyblok-component"]')).toHaveLength(
      0,
    )
  })
})
