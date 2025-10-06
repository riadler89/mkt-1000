import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import type { DividerComponent } from '../types'
import Divider from './DividerComponent.vue'

describe('Storyblok Divider', () => {
  const createContentElement = (
    height: DividerComponent['height'] = 'small',
    showLine = false,
  ): DividerComponent => ({
    height,
    showLine,
    component: 'DividerComponent',
    _uid: 'test-uid',
  })

  it('should render with correct default spacing for small height', () => {
    const contentElement = createContentElement('small')
    const wrapper = mount(Divider, {
      props: { contentElement },
      global: {
        directives: {
          editable: {},
        },
      },
    })

    expect(wrapper.classes()).toContain('py-3')
    expect(wrapper.classes()).toContain('lg:py-5')
    expect(wrapper.classes()).toContain('w-full')
    expect(wrapper.find('hr').exists()).toBe(false)
  })

  it('should render with correct spacing for medium height', () => {
    const contentElement = createContentElement('medium')
    const wrapper = mount(Divider, {
      props: { contentElement },
      global: {
        directives: {
          editable: {},
        },
      },
    })

    expect(wrapper.classes()).toContain('py-5')
    expect(wrapper.classes()).toContain('lg:py-9')
    expect(wrapper.classes()).toContain('w-full')
    expect(wrapper.find('hr').exists()).toBe(false)
  })

  it('should render with correct spacing for large height', () => {
    const contentElement = createContentElement('large')
    const wrapper = mount(Divider, {
      props: { contentElement },
      global: {
        directives: {
          editable: {},
        },
      },
    })

    expect(wrapper.classes()).toContain('py-9')
    expect(wrapper.classes()).toContain('lg:py-12')
    expect(wrapper.classes()).toContain('w-full')
    expect(wrapper.find('hr').exists()).toBe(false)
  })

  it('should render with default spacing when height is empty string', () => {
    const contentElement = createContentElement('')
    const wrapper = mount(Divider, {
      props: { contentElement },
      global: {
        directives: {
          editable: {},
        },
      },
    })

    expect(wrapper.classes()).toContain('py-3')
    expect(wrapper.classes()).toContain('lg:py-5')
  })

  it('should render hr element when showLine is true', () => {
    const contentElement = createContentElement('small', true)
    const wrapper = mount(Divider, {
      props: { contentElement },
      global: {
        directives: {
          editable: {},
        },
      },
    })

    const hr = wrapper.find('hr')
    expect(hr.exists()).toBe(true)
  })
})
