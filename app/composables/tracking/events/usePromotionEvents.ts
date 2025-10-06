import type { TrackingEvent, TrackingPayload } from '~~/types/tracking'

export interface TrackingContent {
  _uid?: string
  item_id?: string
  item_name?: string
  promotion_id?: string
  promotion_name?: string
  creative_name?: string
  creative_slot?: string
  location_id?: string
  index?: string
}

const usePromotionEvents = (
  track: (event: TrackingEvent, payload: TrackingPayload) => void,
) => ({
  trackPromotion: (event: TrackingEvent, trackableObject: TrackingContent) => {
    if (!Object.values(trackableObject).some(Boolean)) {
      return
    }

    const trackingContent = trackableObject as Required<TrackingContent>

    track(event, {
      items: [
        {
          item_id: trackingContent.item_id,
          item_name: trackingContent.item_name,
          promotion_id: trackingContent.promotion_id,
          promotion_name: trackingContent.promotion_name,
          creative_name: trackingContent.creative_name,
          creative_slot: trackingContent.creative_slot,
          location_id: trackingContent.location_id,
          index: parseInt(`${trackableObject.index}`),
        },
      ],
    })
  },
})

export default usePromotionEvents
