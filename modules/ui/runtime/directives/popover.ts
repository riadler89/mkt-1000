// A directive to trigger the show/hide methods of the popover api
// https://developer.mozilla.org/en-US/docs/Web/API/Popover_API
// Supports the Vue transition component
// https://vuejs.org/guide/built-ins/transition.html

import type { ObjectDirective } from 'vue'

function togglePopover(el: HTMLElement, value: unknown): void {
  if (!value) {
    el.hidePopover()
    return
  }

  el.showPopover()
}

export const vPopover: ObjectDirective<HTMLElement> = {
  created(el) {
    el.setAttribute('popover', 'manual')
  },
  beforeMount(el, { value }, { transition }) {
    if (transition && value) {
      transition.beforeEnter(el)
    }
  },

  mounted(el, { value }, { transition }) {
    if (transition && value) {
      transition.enter(el)
    }

    togglePopover(el, value)
  },

  updated(el, { value, oldValue }, { transition }) {
    if (!value === !oldValue) {
      return
    }

    if (transition) {
      if (value) {
        transition.beforeEnter(el)
        togglePopover(el, true)
        transition.enter(el)
      } else {
        transition.leave(el, () => {
          togglePopover(el, false)
        })
      }
    } else {
      togglePopover(el, value)
    }
  },

  beforeUnmount(el) {
    togglePopover(el, false)
  },
}
