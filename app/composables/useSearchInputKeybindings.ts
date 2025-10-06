import type { ComponentPublicInstance, Ref } from 'vue'
import { onKeyStroke } from '@vueuse/core'
import type { ActivateOptions, DeactivateOptions } from 'focus-trap'
import { tabbable } from 'tabbable'

// Only printable chars should have a length of 1
// https://developer.mozilla.org/en-US/docs/Web/API/UI_Events/Keyboard_event_key_values#numeric_keypad_keys
const isPrintableChar = (event: KeyboardEvent) =>
  event.key.length === 1 && !event.metaKey

export function useSearchInputKeybindings(
  input: Ref<HTMLInputElement | undefined>,
  resultContainer: Ref<ComponentPublicInstance & EventTarget>,
  searchBox: Ref<HTMLElement | undefined>,
  resetButton: Ref<HTMLButtonElement | undefined>,
  hasFocus: Ref<boolean>,
  activate: (opts?: ActivateOptions) => void,
  deactivate: (opts?: DeactivateOptions) => void,
  openAndFocus: () => void,
  reset: () => void,
  closeAndReset: () => void,
  searchQuery: Ref<string>,
  totalCount: Ref<number>,
) {
  // Searchbar
  // Open search
  onKeyStroke(
    'Enter',
    async (event) => {
      event.stopPropagation()
      if (hasFocus.value) {
        return
      }
      openAndFocus()
    },
    { target: searchBox },
  )
  // close search
  onKeyStroke(
    'Escape',
    (event) => {
      event.stopPropagation()
      reset()
    },
    { target: searchBox },
  )
  // Enable pasting to when searchbox is focused
  onKeyStroke(
    async (event) => {
      if (hasFocus.value) {
        return
      }
      if (event.key === 'Paste' || (event.key === 'v' && event.metaKey)) {
        openAndFocus()
        searchQuery.value = await navigator.clipboard.readText()
      }
      if (isPrintableChar(event)) {
        openAndFocus()
      }
    },
    { target: searchBox },
  )
  // Switch from search box to first suggestion
  onKeyStroke(
    'ArrowDown',
    () => {
      if (totalCount.value <= 0) {
        return
      }
      activate()
    },
    { target: searchBox },
  )
  // Switch from search box to last suggestion
  onKeyStroke(
    'ArrowUp',
    () => {
      if (totalCount.value <= 0 || !resultContainer.value) {
        return
      }
      activate({
        onPostActivate() {
          const focusableElements = tabbable(resultContainer.value.$el)
          focusableElements.at(-1)?.focus()
        },
      })
    },
    { target: searchBox },
  )
  // Go to next focusable item if reset button is focused and no suggestions are present
  onKeyStroke(
    'Tab',
    () => {
      if (totalCount.value > 0) {
        return
      }
      closeAndReset()
    },
    { target: resetButton },
  )
  // Close and reset search if user has the the input field focused and tabs to previous tabbable item
  onKeyStroke(
    'Tab',
    (event) => {
      if (!event.shiftKey) {
        return
      }
      closeAndReset()
    },
    { target: input },
  )

  // SearchResults
  // Allow continuing typing when option is focused
  onKeyStroke(
    (event) => {
      if (isPrintableChar(event)) {
        event.preventDefault()
        deactivate({
          onPostDeactivate() {
            input.value?.focus()
            searchQuery.value += event.key
          },
        })
      }
      if (event.key === 'Backspace') {
        input.value?.focus()
      }
    },
    { target: resultContainer },
  )
  // Focus input when option is focused
  onKeyStroke(
    'Escape',
    (event) => {
      event.stopPropagation()
      deactivate({
        onPostDeactivate() {
          input.value?.focus()
        },
      })
    },
    { target: resultContainer },
  )
  // Focus input and position cursor at the start when option is focused
  onKeyStroke(
    'Home',
    (event) => {
      event.stopPropagation()
      event.preventDefault()
      deactivate({
        onPostDeactivate() {
          input.value?.focus()
          input.value?.setSelectionRange(0, 0)
        },
      })
    },
    { target: resultContainer },
  )
  // Focus input and position cursor at the end when option is focused
  onKeyStroke(
    'End',
    (event) => {
      event.stopPropagation()
      event.preventDefault()
      deactivate({
        onPostDeactivate() {
          input.value?.focus()
          input.value?.setSelectionRange(
            searchQuery.value.length,
            searchQuery.value.length,
          )
        },
      })
    },
    { target: resultContainer },
  )
}
