import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import type { TypeDividerComponentWithoutUnresolvableLinksResponse } from '../types'
import DividerComponent from './DividerComponent.vue'

describe('Contentful Divider', () => {
  const createContentElement = (
    height: TypeDividerComponentWithoutUnresolvableLinksResponse['fields']['height'],
    showLine = false,
  ): TypeDividerComponentWithoutUnresolvableLinksResponse =>
    ({
      fields: {
        height,
        showLine,
      },
    }) as TypeDividerComponentWithoutUnresolvableLinksResponse

  it('should render with correct default spacing for small height', () => {
    const contentElement = createContentElement('small')
    const wrapper = mount(DividerComponent, {
      props: { contentElement },
    })

    expect(wrapper.classes()).toContain('py-3')
    expect(wrapper.classes()).toContain('lg:py-5')
    expect(wrapper.classes()).toContain('w-full')
    expect(wrapper.find('hr').exists()).toBe(false)
  })

  it('should render with correct spacing for medium height', () => {
    const contentElement = createContentElement('medium')
    const wrapper = mount(DividerComponent, {
      props: { contentElement },
    })

    expect(wrapper.classes()).toContain('py-5')
    expect(wrapper.classes()).toContain('lg:py-9')
    expect(wrapper.classes()).toContain('w-full')
    expect(wrapper.find('hr').exists()).toBe(false)
  })

  it('should render with correct spacing for large height', () => {
    const contentElement = createContentElement('large')
    const wrapper = mount(DividerComponent, {
      props: { contentElement },
    })

    expect(wrapper.classes()).toContain('py-9')
    expect(wrapper.classes()).toContain('lg:py-12')
    expect(wrapper.classes()).toContain('w-full')
    expect(wrapper.find('hr').exists()).toBe(false)
  })

  it('should render hr element when showLine is true', () => {
    const contentElement = createContentElement('small', true)
    const wrapper = mount(DividerComponent, {
      props: { contentElement },
    })

    const hr = wrapper.find('hr')
    expect(hr.exists()).toBe(true)
  })
})
