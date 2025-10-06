import { useRoute } from '#app'
import type { TrackingEvent, TrackingPayload } from '~~/types/tracking'

const useFeatureEvents = (
  track: (event: TrackingEvent, payload: TrackingPayload) => void,
) => {
  return {
    trackFeatureError: (errorInformation: string) => {
      track('feature', {
        action: 'impression',
        name: 'error',
        label: errorInformation,
        content_name: useRoute().fullPath,
      })
    },
  }
}

export default useFeatureEvents
