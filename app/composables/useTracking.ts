import { useDebounceFn, useEventListener } from '@vueuse/core'
import type { Log } from '@scayle/storefront-nuxt'
import { useGtm } from '@gtm-support/vue-gtm'
import { useRuntimeConfig } from '#app'
import { useLog } from '#storefront/composables'
import { useState } from '#app/composables/state'
import { usePageState } from '~/composables/usePageState'

const WAIT_TIME_MS = 1000

/**
 * Handles tracking events when GTM is not initialized, logging a warning message with event data,
 * as tracking events on server-side might need additional / extended handling if `gtm` is not initialized.
 *
 * @param log The logging utility instance.
 *
 * @returns An object with `push` and `hasEventInQueue` functions that log warnings.
 */
const handleNonInitializedTracking = (log: Log) => ({
  push: (data: unknown) => {
    log.warn(`Gtm was not initialized yet. Event: ${JSON.stringify(data)}`)
  },
  hasEventInQueue: (eventName: string) => {
    log.warn(
      `Gtm was not initialized yet. "${eventName} does not exist in queue`,
    )
  },
})

/**
 * Provides a composable for managing tracking events with GTM, including queuing and flushing.
 * Ensures correct event order based on `trackingEventOrder` config and handles page type data.
 *
 * @returns An object with `push` and `hasEventInQueue` functions.
 */
export function useTracking() {
  // NOTE: useGtm will only return a GTM instance on client side.
  const gtm = useGtm()
  const log = useLog('tracking')

  if (!gtm) {
    return handleNonInitializedTracking(log)
  }

  const { pageState } = usePageState()

  const config = useRuntimeConfig()

  type Push = typeof gtm.push
  type DataLayerObject = Parameters<typeof gtm.push>[0]

  let lastIndex = -1

  const queue = useState<{ data: DataLayerObject; index: number }[]>(
    'tracking-queue',
    () => [],
  )

  /**
   * Queues a tracking event, respecting the configured `trackingEventOrder`.
   * Events not present in the `trackingEventOrder` are added to the end of the queue.
   *
   * @param data The data layer object for the event.
   *
   * @returns The new length of the `queue` if the event is **not** in `trackingEventOrder`, otherwise returns `undefined`.
   */
  const push: Push = (data) => {
    const trackingEvents = (config.public.trackingEventOrder as string[]) ?? []
    const index = data.event ? (trackingEvents.indexOf(data.event) ?? -1) : -1

    // If the event is not in the trackingEventOrder, add it to the end of the queue.
    if (index === -1) {
      return queue.value.push({ data, index: lastIndex })
    }

    queue.value.push({ data, index })
    lastIndex = index

    flushDebounced()
  }

  /**
   * Flushes the queued events to GTM, ordered by `trackingEventOrder` and enriching with page data.
   * Clears the previous ecommerce object before pushing a new one.
   */
  const flush = (): void => {
    const sortedEvents = queue.value.sort((a, b) => a.index - b.index)

    sortedEvents.forEach((item) => {
      if ('ecommerce' in item.data) {
        gtm.push({ ecommerce: null }) // Clear the previous ecommerce object
      }

      const {
        event,
        content_name: contentName,
        page_type: pageType,
        page_type_id: pageTypeId,
        ...data // Using destructuring to make properties optional
      } = item.data

      gtm.push({
        event,
        ...(contentName && { content_name: contentName }), // Conditionally adds properties
        page_type: pageType || pageState.value.type,
        page_type_id: pageTypeId || pageState.value.typeId,
        ...data,
      })
    })

    queue.value.length = 0
  }

  /**
   * Checks if an event with the given name exists in the queue.
   *
   * @param eventName The name of the event to check for.
   *
   * @returns `true` if the event exists in the queue, `false` otherwise.
   */
  const hasEventInQueue = (eventName: string): boolean => {
    return queue.value.some((item) => item.data.event === eventName)
  }

  const flushDebounced = useDebounceFn(flush, WAIT_TIME_MS)

  useEventListener('beforeunload', flush)

  return { push, hasEventInQueue }
}
