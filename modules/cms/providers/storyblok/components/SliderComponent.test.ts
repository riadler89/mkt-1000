import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import type {
  SliderComponent as SliderComponentType,
  TextComponent,
} from '../types'
import SliderComponent from './SliderComponent.vue'

describe('Storyblok SliderComponent', () => {
  const createTextComponent = (
    content: string,
    textType: string = 'p',
    uid: string = 'text-1',
  ): TextComponent => ({
    _uid: uid,
    component: 'TextComponent',
    content,
    textType: textType as '' | 'p' | 'h1' | 'h2' | 'h3' | 'h4',
  })

  const createWrapper = (contentElement: Partial<SliderComponentType>) => {
    return mount(SliderComponent, {
      props: {
        contentElement: {
          _uid: 'slider-1',
          component: 'SliderComponent',
          ...contentElement,
        } as SliderComponentType,
      },
      global: {
        directives: {
          editable: {},
        },
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
      content: textComponents,
    })

    expect(wrapper.findComponent({ name: 'SFItemsSlider' }).exists()).toBe(true)
    expect(
      wrapper.findAllComponents({ name: 'StoryblokComponent' }),
    ).toHaveLength(3)

    const storyblokComponents = wrapper.findAllComponents({
      name: 'StoryblokComponent',
    })
    expect(storyblokComponents?.[0]?.text()).toBe('First slide text')
    expect(storyblokComponents?.[1]?.text()).toBe('Second slide text')
    expect(storyblokComponents?.[2]?.text()).toBe('Third slide text')
  })

  it('renders empty slider when no content is provided', () => {
    const wrapper = createWrapper({
      content: [],
    })

    expect(wrapper.findComponent({ name: 'SFItemsSlider' }).exists()).toBe(true)
    expect(
      wrapper.findAllComponents({ name: 'StoryblokComponent' }),
    ).toHaveLength(0)
  })

  it('passes withArrows prop correctly when showNavigationArrows is true', () => {
    const wrapper = createWrapper({
      content: [createTextComponent('Test content')],
      showNavigationArrows: true,
    })

    const sfItemsSlider = wrapper.findComponent({ name: 'SFItemsSlider' })
    expect(sfItemsSlider.props('withArrows')).toBe(true)
  })

  it('passes withArrows prop correctly when showNavigationArrows is false', () => {
    const wrapper = createWrapper({
      content: [createTextComponent('Test content')],
      showNavigationArrows: false,
    })

    const sfItemsSlider = wrapper.findComponent({ name: 'SFItemsSlider' })
    expect(sfItemsSlider.props('withArrows')).toBe(false)
  })

  it('defaults to showing navigation arrows when showNavigationArrows is undefined', () => {
    const wrapper = createWrapper({
      content: [createTextComponent('Test content')],
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
      content: textComponents,
      showPaginationIndicators: true,
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
      content: textComponents,
      showPaginationIndicators: false,
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
      content: textComponents,
    })

    const paginationButtons = wrapper.findAll('.size-2\\.5')
    expect(paginationButtons).toHaveLength(2)
  })
})
