import { ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render } from '@testing-library/vue'
import SFScrollToTopButton from './SFScrollToTopButton.vue'

const arrivedState = ref({ top: false })
vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual('@vueuse/core')
  return {
    ...actual,
    useScroll: () => ({
      arrivedState,
    }),
  }
})
describe('scrollToTopButton.vue', () => {
  it('should not be visible when scroll has arrived on top', async () => {
    arrivedState.value.top = true
    const { queryByRole } = render(SFScrollToTopButton)
    expect(queryByRole('button')).not.toBeInTheDocument()
  })

  it('should be visible when page is scrolled down', async () => {
    arrivedState.value.top = false
    const { queryByRole } = render(SFScrollToTopButton)
    const button = queryByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toBeVisible()
  })

  it('should scroll to top when clicked', async () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo')
    arrivedState.value.top = false
    const { getByRole } = render(SFScrollToTopButton)
    const button = getByRole('button')

    await fireEvent.click(button)
    expect(scrollToSpy).toHaveBeenCalledTimes(1)
    expect(scrollToSpy).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })
})
