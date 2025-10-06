import type { Ref, ShallowRef } from 'vue'
import { nextTick, ref, watch } from 'vue'
import { onClickOutside, onKeyStroke } from '@vueuse/core'
import { tabbable } from 'tabbable'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'

type Refs = {
  rootRef: Readonly<ShallowRef<HTMLDivElement | null>>
  buttonRef: Readonly<ShallowRef<HTMLDivElement | null>>
  optionsRef: Readonly<ShallowRef<HTMLDivElement | null>>
}

type State = {
  open: () => void
  close: () => void
  isOpen: Ref<boolean>
}

export function useDropdownKeyboardBehavior(
  { rootRef, buttonRef, optionsRef }: Refs,
  { close, isOpen }: State,
) {
  const trapFocusImmediately = ref(false)

  onClickOutside(rootRef, () => {
    if (isOpen.value) {
      close()
    }
  })

  const { activate, deactivate } = useFocusTrap(optionsRef, {
    immediate: isOpen.value,
    isKeyBackward: (keyEvent) => keyEvent.code === 'ArrowUp',
    isKeyForward: (keyEvent) => keyEvent.code === 'ArrowDown',
    allowOutsideClick: true,
  })

  watch(isOpen, async (open) => {
    await nextTick()
    if (open) {
      activate()
    } else {
      deactivate({ returnFocus: trapFocusImmediately.value })
      trapFocusImmediately.value = false
    }
  })

  // Focus the element that is next or previous to the button ref
  const tabOut = (direction: 'next' | 'previous' | undefined) => {
    setTimeout(() => {
      const button = buttonRef.value?.querySelector('button')
      if (!button) {
        return
      }

      const tabbables = tabbable(document.body).filter(
        (el) => el === button || !rootRef.value?.contains(el),
      )
      const index = tabbables.indexOf(button)

      if (direction === undefined || index === -1) {
        button.focus()
      } else if (direction === 'next' && tabbables[index + 1]) {
        tabbables[index + 1]!.focus()
      } else if (direction === 'previous' && tabbables[index - 1]) {
        tabbables[index - 1]!.focus()
      }
    }, 0)
  }

  const ARROW_KEYS = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']

  onKeyStroke(
    ARROW_KEYS,
    (event: KeyboardEvent) => {
      // Prevent scrolling the page on arrow keys
      event.preventDefault()
    },
    { target: rootRef },
  )

  onKeyStroke(
    'Escape',
    () => {
      close()
    },
    { target: rootRef },
  )

  onKeyStroke(
    'Enter',
    () => {
      if (isOpen.value) {
        trapFocusImmediately.value = true
      }
    },
    { target: rootRef },
  )

  onKeyStroke(
    'Tab',
    (event: KeyboardEvent) => {
      if (isOpen.value) {
        event.preventDefault()
        deactivate()
        close()
        tabOut(event.shiftKey ? 'previous' : 'next')
      }
    },
    { target: rootRef },
  )
}
