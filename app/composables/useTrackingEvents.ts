import {
  useBasketEvents,
  useCheckoutEvents,
  useContentEvents,
  useCustomerEvents,
  useFeatureEvents,
  useFilterEvents,
  useProductEvents,
  usePromotionEvents,
  usePurchaseEvents,
  useSearchEvents,
  useShopEvents,
  useUserActionEvents,
  useWishlistEvents,
} from './tracking'
import { usePageState } from '~/composables/usePageState'
import { useTracking } from '~/composables/useTracking'
import { mapProductToTrackingPayload, mapTrackingDataForEvent } from '~/utils'
import type { TrackingEvent, TrackingPayload } from '~~/types/tracking'

/**
 * Higher order composable which serves as a single entry point to unify different ecommerce tracking events
 */
export function useTrackingEvents() {
  const tracking = useTracking()

  const { pageState } = usePageState()
  const track = (event: TrackingEvent, payload: TrackingPayload) => {
    if (import.meta.server) {
      return
    }
    const eventData: Partial<{
      event: TrackingEvent
      ecommerce?: TrackingPayload
      content_name?: string
      page_type?: string
      page_type_id?: string
    }> = mapTrackingDataForEvent(event, payload)
    if ('ecommerce' in eventData) {
      eventData.content_name = document.location.pathname
      eventData.page_type = pageState.value.type
      eventData.page_type_id = pageState.value.typeId
    }

    return tracking.push(eventData)
  }

  /**
   * NOTE: Important considerations:
   * sub-composable(s) such as useBasketEvents, etc. should not be utilized directly
   * instead make use of the higher order composable (useTrackingEvents) to keep things clean
   * new events should be added to relevant sub-composable to ensure DRY code and separation of concerns
   */

  return {
    ...useShopEvents(track),
    ...useBasketEvents(track),
    ...useWishlistEvents(track),
    ...useProductEvents(track),
    ...useCheckoutEvents(track),
    ...useSearchEvents(track),
    ...usePurchaseEvents(),
    ...useFilterEvents(track),
    ...usePromotionEvents(track),
    ...useUserActionEvents(track),
    ...useCustomerEvents(track),
    ...useContentEvents(track),
    ...useFeatureEvents(track),
    mapProductToTrackingPayload,
  }
}
