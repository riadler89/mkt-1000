<template>
  <div
    id="a11y-skip-links"
    class="group mx-4 flex h-0 items-center justify-center gap-4 opacity-0 focus-within:h-20 focus-within:opacity-100"
  >
    <SFButton
      variant="secondary"
      class="pointer-events-none group-focus-within:pointer-events-auto"
      data-testid="button-skip-to-main"
      :aria-label="$t('skip_links.jump_to_main')"
      @click="focusMainContent"
    >
      {{ $t('skip_links.jump_to_main') }}
    </SFButton>
    <SFButton
      variant="secondary"
      class="pointer-events-none group-focus-within:pointer-events-auto"
      data-testid="button-skip-to-search"
      :aria-label="$t('skip_links.jump_to_search')"
      @click="focusSearch"
    >
      {{ $t('skip_links.jump_to_search') }}
    </SFButton>
  </div>
</template>

<script setup lang="ts">
import { nextTick } from 'vue'
import { SFButton } from '#storefront-ui/components'
import { useDefaultBreakpoints } from '#storefront-ui/composables'

const isMobileSidebarOpen = defineModel('isMobileSidebarOpen', {
  type: Boolean,
})

const { greaterOrEqual } = useDefaultBreakpoints()
const isDesktopLayout = greaterOrEqual('lg')

/**
 * Provides a way to skip all focusable elements and jump directly to the search field.
 * This improves accessibility by allowing users to bypass navigation links and other repetitive elements.
 *
 * @see https://webaim.org/techniques/skipnav/
 */
const focusSearch = async () => {
  const id = isDesktopLayout.value ? 'search-desktop' : 'search-mobile'
  const search = document.getElementById(id)
  const form = search?.querySelector('form')

  if (!search || !form) {
    return
  }

  if (!isDesktopLayout.value) {
    isMobileSidebarOpen.value = true
    await nextTick()
  }

  if (!(form.firstElementChild instanceof HTMLDivElement)) {
    return
  }

  form.firstElementChild.focus({ preventScroll: true })
}

/**
 * Provides a way to skip all focusable elements and jump directly to the main content.
 * This improves accessibility by allowing users to bypass navigation links and other repetitive elements.
 *
 * @see https://webaim.org/techniques/skipnav/
 */
const focusMainContent = () => {
  document.querySelector('main')?.focus({ preventScroll: true })
}
</script>
