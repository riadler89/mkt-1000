import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import type {
  TypeAccordionComponentWithoutUnresolvableLinksResponse,
  TypeAccordionItemComponentWithoutUnresolvableLinksResponse,
} from '../types'
import Accordion from './AccordionComponent.vue'

describe('Contentful Accordion Component', () => {
  const createWrapper = (
    contentElement: Partial<TypeAccordionComponentWithoutUnresolvableLinksResponse>,
  ) => {
    return mount(Accordion, {
      props: {
        contentElement: {
          sys: { id: 'test-sys-id' },
          fields: {
            content: [],
            ...contentElement.fields,
          },
          ...contentElement,
        } as TypeAccordionComponentWithoutUnresolvableLinksResponse,
      },
      global: {
        stubs: {
          ContentfulComponent: {
            name: 'ContentfulComponent',
            template:
              '<div data-testid="contentful-component">{{ contentElement.sys.id }}</div>',
            props: ['contentElement'],
          },
        },
      },
    })
  }

  it('renders without title when title is not provided', () => {
    const wrapper = createWrapper({
      fields: {
        content: [],
      },
    })

    expect(wrapper.find('.text-xl.font-medium').exists()).toBe(false)
  })

  it('renders title when title is provided', () => {
    const wrapper = createWrapper({
      fields: {
        title: 'Test Accordion Title',
        content: [],
      },
    })

    const titleElement = wrapper.find('.text-xl.font-medium')
    expect(titleElement.exists()).toBe(true)
    expect(titleElement.text()).toBe('Test Accordion Title')
  })

  it('renders child components', () => {
    const mockContent = [
      {
        sys: { id: 'child-1' },
      } as TypeAccordionItemComponentWithoutUnresolvableLinksResponse,
      {
        sys: { id: 'child-2' },
      } as TypeAccordionItemComponentWithoutUnresolvableLinksResponse,
    ]

    const wrapper = createWrapper({
      fields: {
        content: mockContent,
      },
    })

    const childComponents = wrapper.findAll(
      '[data-testid="contentful-component"]',
    )
    expect(childComponents).toHaveLength(2)
    expect(childComponents?.[0]?.text()).toBe('child-1')
    expect(childComponents?.[1]?.text()).toBe('child-2')
  })

  it('handles empty content array', () => {
    const wrapper = createWrapper({
      fields: {
        title: 'Test Title',
        content: [],
      },
    })

    expect(wrapper.find('.text-xl.font-medium').text()).toBe('Test Title')
    expect(
      wrapper.findAll('[data-testid="contentful-component"]'),
    ).toHaveLength(0)
  })
})
