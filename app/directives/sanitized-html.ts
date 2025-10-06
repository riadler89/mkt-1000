import type { ObjectDirective } from 'vue'
import DOMpurify from 'dompurify'

/**
 * `v-sanitized-html` expects a string and inserts it as plain HTML.
 *  Before the HTML is updated, the string will be sanitized using {@link https://github.com/cure53/DOMPurify} with the `html` profile enabled.
 */
export const vSanitizedHtml: ObjectDirective<HTMLElement> = {
  beforeMount(el, { value }) {
    el.innerHTML = DOMpurify.sanitize(value, { USE_PROFILES: { html: true } })
  },
  updated(el, { oldValue, value }) {
    if (oldValue === value) {
      return
    }
    el.innerHTML = DOMpurify.sanitize(value, { USE_PROFILES: { html: true } })
  },
}
