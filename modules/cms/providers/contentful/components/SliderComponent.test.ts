import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import type {
  TypeSliderComponentWithoutUnresolvableLinksResponse,
  TypeTextComponentWithoutUnresolvableLinksResponse,
} from '../types'
import SliderComponent from './SliderComponent.vue'

describe('Contentful SliderComponent', () => {
  const createTextComponent = (
    content: string,
    textType: 'h1' | 'h2' | 'h3' | 'h4' | 'p' = 'p',
    id: string = 'text-1',
  ): TypeTextComponentWithoutUnresolvableLinksResponse =>
    ({
      sys: {
        id,
        type: 'Entry',
        contentType: {
          sys: {
            id: 'TextComponent',
            type: 'Link',
            linkType: 'ContentType',
          },
        },
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        locale: 'en-US',
        revision: 1,
      },
      fields: {
        content,
        textType,
      },
    }) as unknown as TypeTextComponentWithoutUnresolvableLinksResponse

  const createWrapper = (
    contentElement: {
      fields?: Partial<
        TypeSliderComponentWithoutUnresolvableLinksResponse['fields']
      >
    } & Partial<
      Omit<TypeSliderComponentWithoutUnresolvableLinksResponse, 'fields'>
    >,
  ) => {
    const defaultSliderComponent = {
      sys: {
        id: 'slider-1',
        type: 'Entry',
        contentType: {
          sys: {
            id: 'SliderComponent',
            type: 'Link',
            linkType: 'ContentType',
          },
        },
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
        locale: 'en-US',
        revision: 1,
      },
      fields: {},
      ...contentElement,
    } as unknown as TypeSliderComponentWithoutUnresolvableLinksResponse

    return mount(SliderComponent, {
      props: {
        contentElement: defaultSliderComponent,
      },
    })
  }

  it('renders slider', () => {
    const textComponents = [
      createTextComponent('First slide text', 'h1', 'text-1'),
      createTextComponent('Second slide text', 'p', 'text-2'),
      createTextComponent('Third slide text', 'h2', 'text-3'),
    ]

    const wrapper = createWrapper({
      fields: {
        content: textComponents,
      },
    })

    expect(wrapper.findComponent({ name: 'SFItemsSlider' }).exists()).toBe(true)
    expect(
      wrapper.findAllComponents({ name: 'ContentfulComponent' }),
    ).toHaveLength(3)

    const contentfulComponents = wrapper.findAllComponents({
      name: 'ContentfulComponent',
    })
    expect(contentfulComponents?.[0]?.text()).toBe('First slide text')
    expect(contentfulComponents?.[1]?.text()).toBe('Second slide text')
    expect(contentfulComponents?.[2]?.text()).toBe('Third slide text')
  })

  it('handles empty content array', () => {
    const wrapper = createWrapper({
      fields: {
        content: [],
      },
    })

    expect(wrapper.findComponent({ name: 'SFItemsSlider' }).exists()).toBe(true)
    expect(
      wrapper.findAllComponents({ name: 'ContentfulComponent' }),
    ).toHaveLength(0)
  })

  it('passes withArrows prop correctly when showNavigationArrows is true', () => {
    const wrapper = createWrapper({
      fields: {
        content: [createTextComponent('Test content')],
        showNavigationArrows: true,
      },
    })

    const sfItemsSlider = wrapper.findComponent({ name: 'SFItemsSlider' })
    expect(sfItemsSlider.props('withArrows')).toBe(true)
  })

  it('passes withArrows prop correctly when showNavigationArrows is false', () => {
    const wrapper = createWrapper({
      fields: {
        content: [createTextComponent('Test content')],
        showNavigationArrows: false,
      },
    })

    const sfItemsSlider = wrapper.findComponent({ name: 'SFItemsSlider' })
    expect(sfItemsSlider.props('withArrows')).toBe(false)
  })

  it('defaults to showing navigation arrows when showNavigationArrows is undefined', () => {
    const wrapper = createWrapper({
      fields: {
        content: [createTextComponent('Test content')],
      },
    })

    const sfItemsSlider = wrapper.findComponent({ name: 'SFItemsSlider' })
    expect(sfItemsSlider.props('withArrows')).toBe(true)
  })

  it('renders pagination indicators when showPaginationIndicators is true', () => {
    const textComponents = [
      createTextComponent('First slide', 'p', 'text-1'),
      createTextComponent('Second slide', 'p', 'text-2'),
    ]

    const wrapper = createWrapper({
      fields: {
        content: textComponents,
        showPaginationIndicators: true,
      },
    })

    const paginationButtons = wrapper.findAll('.size-2\\.5')
    expect(paginationButtons).toHaveLength(2)
  })

  it('does not render pagination indicators when showPaginationIndicators is false', () => {
    const textComponents = [
      createTextComponent('First slide', 'p', 'text-1'),
      createTextComponent('Second slide', 'p', 'text-2'),
    ]

    const wrapper = createWrapper({
      fields: {
        content: textComponents,
        showPaginationIndicators: false,
      },
    })

    const paginationButtons = wrapper.findAll('.size-2\\.5')
    expect(paginationButtons).toHaveLength(0)
  })

  it('defaults to showing pagination indicators when showPaginationIndicators is undefined', () => {
    const textComponents = [
      createTextComponent('First slide', 'p', 'text-1'),
      createTextComponent('Second slide', 'p', 'text-2'),
    ]

    const wrapper = createWrapper({
      fields: {
        content: textComponents,
      },
    })

    const paginationButtons = wrapper.findAll('.size-2\\.5')
    expect(paginationButtons).toHaveLength(2)
  })
})
