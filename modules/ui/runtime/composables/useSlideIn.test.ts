// @vitest-environment nuxt
import { describe, expect, it } from 'vitest'
import { useSlideIn } from '.'

describe('useSlideIn', () => {
  it('should have "isOpen" state to "false" by default', () => {
    const { isOpen } = useSlideIn('gift')
    expect(isOpen.value).toEqual(false)
  })

  it('should be shown or hidden when initiating the "toggle"', () => {
    const { isOpen, toggle } = useSlideIn('gift')
    toggle()
    expect(isOpen.value).toEqual(true)
    toggle()
    expect(isOpen.value).toEqual(false)
  })
})
