import type { TrackingEvent, TrackingPayload } from '~~/types/tracking'

const useFilterEvents = (
  track: (event: TrackingEvent, payload: TrackingPayload) => void,
) => ({
  trackFilterApply: (action: string, label: string) => {
    track('filter_slider', {
      action,
      label,
    })
  },

  trackFilterFlyout: (action: string, label: string) => {
    track('filter_flyout', {
      action,
      label,
    })
  },
})

export default useFilterEvents
