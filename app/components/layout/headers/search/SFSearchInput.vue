<template>
  <section
    ref="root"
    role="search"
    class="relative transition-all duration-150 max-lg:flex"
    :class="{
      'max-lg:px-0 lg:max-w-[475px]': hasFocus,
      'max-lg:px-3 lg:max-w-64': !hasFocus,
    }"
  >
    <form
      ref="searchBox"
      class="w-full"
      aria-haspopup="listbox"
      data-testid="search-form"
      role="search"
      @submit.prevent="goToSearchResolutionOrSearchPage"
    >
      <div
        role="button"
        class="group flex h-11 cursor-pointer items-center gap-2 overflow-hidden border border-gray-200 px-3 transition-all duration-150 max-lg:grow lg:h-10"
        :class="{
          'bg-white lg:rounded-md': hasFocus,
          'rounded-md bg-gray-200 pr-8 hover:bg-gray-300': !hasFocus,
        }"
        :tabindex="hasFocus ? -1 : 0"
        :aria-label="$t('global.search')"
        @click="openAndFocus"
      >
        <SFButton
          variant="raw"
          tabindex="-1"
          class="flex items-center justify-center max-lg:size-11"
          aria-hidden="true"
        >
          <IconSearch class="size-5 shrink-0" />
        </SFButton>
        <div class="flex h-full min-w-0 grow items-center gap-2">
          <label :for="id" class="hidden">{{ $t('global.search') }}</label>
          <input
            :id="id"
            ref="input"
            v-model.trim="searchQuery"
            :tabindex="hasFocus ? 0 : -1"
            type="search"
            :placeholder="$t('search_input.placeholder')"
            class="min-w-0 grow bg-gray-200 transition-colors placeholder:text-gray-500 placeholder-shown:truncate focus-visible:shadow-none focus-visible:outline-none"
            data-testid="header-search-input"
            :class="{
              'bg-white ': hasFocus,
              'group-hover:bg-gray-300': !hasFocus,
            }"
            :aria-placeholder="$t('global.search')"
          />
        </div>
        <SFButton
          ref="resetButton"
          type="reset"
          variant="raw"
          class="h-6 rounded px-1.5 py-1 text-sm leading-5 text-secondary transition duration-150 hover:bg-gray-200 focus:bg-gray-200 focus:px-1.5"
          data-testid="search-reset-button"
          :class="{ hidden: !hasFocus }"
          @click.stop="resetSearch"
          @keydown.enter.stop="resetSearch"
        >
          {{ $t('global.cancel') }}
        </SFButton>
      </div>
    </form>
    <SFSearchResultsContainer
      v-if="searchQuery.length >= 3"
      ref="resultContainer"
      :products="products"
      :categories="categories"
      :navigation-items="navigationItems"
      :search-query="searchQuery"
      :show-suggestions-loader="showSuggestionsLoader"
      @click-result="trackSearchClickAndClose"
      @close="closeAndReset"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, watch, ref, useId } from 'vue'
import {
  onClickOutside,
  onKeyStroke,
  useDebounceFn,
  useEventListener,
} from '@vueuse/core'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'
import type { SearchEntity } from '@scayle/storefront-nuxt'
import { useTrackingEvents, useRouteHelpers } from '~/composables'
import SFSearchResultsContainer from '~/components/search/SFSearchResultsContainer.vue'
import { useSearchInputKeybindings } from '~/composables/useSearchInputKeybindings'
import { SFButton } from '#storefront-ui/components'
import { useSearch } from '#storefront-search/composables/useSearch'
import { DEBOUNCED_SEARCH_DURATION } from '~~/shared/constants'

const emit = defineEmits<{
  close: []
  clickResult: [result: SearchEntity | 'show_all']
}>()

const { getSearchRoute, localizedNavigateTo, getSearchSuggestionPath } =
  useRouteHelpers()

const {
  searchQuery,
  getSearchSuggestions,
  resetSearch,
  products,
  categories,
  navigationItems,
  totalCount,
  resolveSearch,
  hasSuggestions,
  status,
} = useSearch()

const id = computed(() => `search-input-${useId()}`)

const debouncedSearch = useDebounceFn(async () => {
  await getSearchSuggestions()
}, DEBOUNCED_SEARCH_DURATION)

const showSuggestionsLoader = computed(() => {
  return (
    status.value === 'pending' && (!searchQuery.value || !hasSuggestions.value)
  )
})

watch(
  () => searchQuery.value,
  async () => {
    await debouncedSearch()
  },
)

const root = ref<HTMLElement>()
const input = ref<HTMLInputElement>()
const resultContainer = ref()
const searchBox = ref<HTMLElement>()
const resetButton = ref<HTMLButtonElement>()
const hasFocus = ref(false)

const openAndFocus = () => {
  input.value?.focus()
  hasFocus.value = true
}

const reset = async () => {
  resetSearch()
  hasFocus.value = false
  await nextTick()
  searchBox.value?.focus()
}

const closeAndReset = async () => {
  await reset()
  emit('close')
}

const { trackSearchSuggestionClick, trackSearch } = useTrackingEvents()
const trackSearchClickAndClose = (suggestion: SearchEntity | 'show_all') => {
  if (suggestion === 'show_all') {
    const route = getSearchRoute(searchQuery.value)
    trackSearch({
      searchTerm: searchQuery.value,
      pagePayload: {
        content_name: route,
        page_type: 'search',
        page_type_id: '',
      },
      suggestion: '',
      searchAction: 'search_term',
      searchDestination: route,
    })
    closeAndReset()
    return
  }
  trackSearchSuggestionClick(searchQuery.value, suggestion)
  closeAndReset()
  emit('clickResult', suggestion)
}

const goToSearchResolutionOrSearchPage = async () => {
  if (!searchQuery.value) {
    return
  }

  const resolved = await resolveSearch()
  if (resolved?.type) {
    const route = getSearchSuggestionPath(resolved)
    if (route) {
      trackSearchSuggestionClick(searchQuery.value, resolved)
      await localizedNavigateTo(route)
      closeAndReset()
      return
    }
  }

  const route = getSearchRoute(searchQuery.value)

  trackSearch({
    searchTerm: searchQuery.value,
    pagePayload: {
      content_name: route,
      page_type: 'search',
      page_type_id: '',
    },
    suggestion: '',
    searchAction: 'search_term',
    searchDestination: route,
  })

  await localizedNavigateTo(route)

  closeAndReset()
}

const ARROW_KEYS = ['ArrowUp', 'ArrowDown']

onKeyStroke(
  ARROW_KEYS,
  // Prevent scrolling the page on arrow keys
  (event: KeyboardEvent) => event.preventDefault(),
  { target: root },
)

onClickOutside(root, () => {
  if (!hasFocus.value) {
    return
  }
  reset()
})

const { activate, deactivate } = useFocusTrap(resultContainer, {
  isKeyBackward: (keyEvent) => keyEvent.code === 'ArrowUp',
  isKeyForward: (keyEvent) => keyEvent.code === 'ArrowDown',
  allowOutsideClick: true,
  returnFocusOnDeactivate: false,
})

useEventListener(resultContainer, 'focusin', () => activate())

useSearchInputKeybindings(
  input,
  resultContainer,
  searchBox,
  resetButton,
  hasFocus,
  activate,
  deactivate,
  openAndFocus,
  reset,
  closeAndReset,
  searchQuery,
  totalCount,
)
</script>
