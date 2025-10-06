import { readonly } from 'vue'
import { useState } from '#app/composables/state'

export function useSlideIn(name: string, isInitiallyOpened = false) {
  const isOpen = useState(`${name}-slide-in`, () => isInitiallyOpened)

  const toggle = () => {
    isOpen.value = !isOpen.value
  }

  const close = () => {
    isOpen.value = false
  }

  return {
    isOpen: readonly(isOpen),
    toggle,
    close,
  }
}
