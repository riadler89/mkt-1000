import { provide } from 'vue'
import { inject, ref, type Ref } from 'vue'
import type { BREAKPOINTS } from '~~/config/ui'
/**
 * The CMS context is a shared context that can be used to store and retrieve data from parents components in the content tree.
 */
export type CMSContext = {
  /**
   * The fraction that the viewport is covered on desktop by the current element
   */
  desktopViewportFraction: Ref<number>
  /**
   * The fraction that the viewport is covered on mobile by the current element
   */
  mobileViewportFraction: Ref<number>

  /**
   * The maximum width of the current element at each breakpoint
   * When a breakpoint is not provided, the element will be as wide as the viewport
   */
  maxWidths: Partial<Record<keyof typeof BREAKPOINTS, number>>
}

/**
 * Returns the {@link CMSContext} of the current component tree branch.
 *
 * The CMS context is a shared context that can be used to store and retrieve data from parents components in the content tree.
 * @returns CMS context
 */
export function useCMSContext(): CMSContext {
  return inject<CMSContext>('cmsContext', {
    desktopViewportFraction: ref(1),
    mobileViewportFraction: ref(1),
    maxWidths: {},
  })
}

/**
 * Provides {@link CMSContext context} about the CMS content tree. All data provided can be consumed by child components using {@link useCMSContext}.
 *
 * The CMS context is a shared context that can be used to store and retrieve data from parents components in the content tree.
 *
 * Whenever a property is provided, it will be merged with the existing context. When a property already exists, it will be overwritten.
 * @param context - Partial context
 */
export function provideCMSContext(context: Partial<CMSContext>) {
  provide('cmsContext', {
    ...useCMSContext(),
    ...context,
  })
}
