import { readonly } from 'vue'
import { useState } from '#app/composables/state'
import type { PageType } from '~~/types/tracking'

export type PageState = {
  type: PageType
  typeId: string
}

export function usePageState() {
  const state = useState<PageState>('page-type-state', () => ({
    type: '',
    typeId: '',
  }))

  const setPageState = (key: keyof PageState, value: string) => {
    state.value[key] = value
  }

  const pageState = readonly(state)

  return {
    setPageState,
    pageState,
  }
}
