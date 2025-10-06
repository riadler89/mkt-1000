import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { describe, expect, vi, it } from 'vitest'
import { vPopover } from './popover'

describe('v-popover directive', () => {
  it('should add popover attribute', () => {
    const component = defineComponent({
      directives: {
        popover: vPopover,
      },
      data() {
        return { value: true }
      },
      template: '<div v-popover="value"></div>',
    })

    HTMLElement.prototype.showPopover = vi.fn()

    const wrapper = mount(component)
    expect(wrapper.attributes('popover')).toBe('manual')
  })

  it('should open the dialog when the value is truthy', () => {
    const component = defineComponent({
      directives: {
        popover: vPopover,
      },
      data() {
        return { value: true }
      },
      template: '<div v-popover="value"></div>',
    })

    const mockShow = vi.fn()
    HTMLElement.prototype.showPopover = mockShow

    mount(component)
    expect(mockShow).toHaveBeenCalled()
  })

  it('should close the dialog when the value is is falsy', () => {
    const component = defineComponent({
      directives: {
        popover: vPopover,
      },
      data() {
        return { value: false }
      },
      template: '<div v-popover="value"></div>',
    })

    const mockClose = vi.fn()
    HTMLElement.prototype.hidePopover = mockClose

    mount(component)
    expect(mockClose).toHaveBeenCalled()
  })

  it('should open and close when the value changes', async () => {
    const component = defineComponent({
      directives: {
        popover: vPopover,
      },
      data() {
        return { value: false }
      },
      template: '<div v-popover="value"></div>',
    })

    const mockShowModal = vi.fn()
    const mockClose = vi.fn()
    HTMLElement.prototype.showPopover = mockShowModal
    HTMLElement.prototype.hidePopover = mockClose

    const wrapper = await mount(component)

    mockClose.mockReset()
    mockShowModal.mockReset()

    await wrapper.setData({ value: true })
    expect(mockShowModal).toHaveBeenCalled()

    await wrapper.setData({ value: false })
    expect(mockClose).toHaveBeenCalled()
  })
})
