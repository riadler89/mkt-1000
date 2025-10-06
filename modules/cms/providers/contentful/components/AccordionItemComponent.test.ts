import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import type {
  TypeAccordionItemComponentWithoutUnresolvableLinksResponse,
  TypeTextComponentWithoutUnresolvableLinksResponse,
} from '../types'
import AccordionItem from './AccordionItemComponent.vue'

describe('Contentful AccordionItem Component', () => {
  const createWrapper = (
    contentElement: Partial<TypeAccordionItemComponentWithoutUnresolvableLinksResponse>,
  ) => {
    return mount(AccordionItem, {
      props: {
        contentElement: {
          sys: { id: 'test-item-sys-id' },
          fields: {
            title: 'Test Title',
            content: [],
            ...contentElement.fields,
          },
          ...contentElement,
        } as TypeAccordionItemComponentWithoutUnresolvableLinksResponse,
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

  it('renders SFAccordionEntry with correct id and title', () => {
    const wrapper = createWrapper({
      fields: {
        title: 'Custom Title',
      },
    })

    const title = wrapper.find('[data-testid="mobile-nav-accordion"]')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('Custom Title')
  })

  it('renders child components inside SFAccordionEntry', () => {
    const mockContent = [
      {
        sys: { id: 'child-1' },
      } as TypeTextComponentWithoutUnresolvableLinksResponse,
      {
        sys: { id: 'child-2' },
      } as TypeTextComponentWithoutUnresolvableLinksResponse,
    ]

    const wrapper = createWrapper({
      fields: {
        title: 'Test Title',
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

  it('handles empty title', () => {
    const wrapper = createWrapper({
      fields: {
        title: '',
      },
    })
    const title = wrapper.find('[data-testid="mobile-nav-accordion"]')
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe('')
  })

  it('handles empty content array', () => {
    const wrapper = createWrapper({
      fields: {
        title: 'Test Title',
        content: [],
      },
    })

    expect(wrapper.find('[data-testid="mobile-nav-accordion"]').exists()).toBe(
      true,
    )
    expect(
      wrapper.findAll('[data-testid="contentful-component"]'),
    ).toHaveLength(0)
  })
})
