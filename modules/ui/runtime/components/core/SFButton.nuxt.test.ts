import type { VueWrapper } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { SFButton } from '#storefront-ui/components'

const hasClass = (component: VueWrapper, className: string) => {
  return component.classes().some((name) => name.includes(className))
}

describe('button', () => {
  it('should be mounted', async () => {
    const button = await mountSuspended(SFButton)
    expect(button.vm).toBeTruthy()
  })

  it('should emit a click event when clicked', async () => {
    const clicked = vi.fn()
    const button = await mountSuspended(SFButton, {
      attrs: { onClick: clicked },
    })
    await button.trigger('click')
    expect(clicked).toHaveBeenCalled()
  })

  it('should render correctly', async () => {
    const button = await mountSuspended(SFButton)
    expect(button.element).toBeTruthy()
  })

  it('should render as a button by default', async () => {
    const button = await mountSuspended(SFButton)
    expect(button.find('button').exists()).toBe(true)
  })

  it('should render as an anchor if "to" prop is provided', async () => {
    const button = await mountSuspended(SFButton, {
      props: { to: '/' },
    })
    expect(button.find('a').exists()).toBe(true)
  })

  it('should disable button', async () => {
    const button = await mountSuspended(SFButton, { attrs: { disabled: true } })

    expect(button.attributes('disabled')).toBeDefined()
    expect(hasClass(button, 'disabled')).toEqual(true)
  })

  it('should render full width button', async () => {
    const button = await mountSuspended(SFButton, {
      props: { isFullWidth: true },
    })

    expect(hasClass(button, 'w-full')).toEqual(true)
  })

  it('should render loader within the button', async () => {
    const button = await mountSuspended(SFButton, { props: { loading: true } })

    expect(hasClass(button, 'animate-pulse')).toEqual(true)
  })
})
