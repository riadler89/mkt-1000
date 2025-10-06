import { useBreakpoints } from '@vueuse/core'
import { useRuntimeConfig } from '#app/nuxt'

export function useDefaultBreakpoints() {
  const { breakpoints } = useRuntimeConfig().public.storefrontUI
  return useBreakpoints(breakpoints)
}
