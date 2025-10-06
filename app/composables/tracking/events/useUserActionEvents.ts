import { useRoute } from '#app/composables/router'
import { getEmailHash, mapCustomerInfoToTrackingPayload } from '~/utils'
import type {
  TrackingEvent,
  TrackingPayload,
  AuthenticationType,
  AuthTrackingEvent,
  CustomerType,
} from '~~/types/tracking'
import { usePageState } from '~/composables/usePageState'

export type AuthTrackingEventData = {
  customer_id?: number
  customer_type?: CustomerType
  eh?: string
  event: AuthTrackingEvent
  method?: AuthenticationType
  status?: 'successful' | 'error'
}

const METHOD_DEFAULT = 'none'

const useUserActionEvents = (
  track: (event: TrackingEvent, payload: TrackingPayload) => void,
) => {
  const route = useRoute()
  const { pageState } = usePageState()

  return {
    trackLogout: () => {
      track('logout', {
        customer_id: undefined,
        eh: undefined,
        content_name: route.fullPath,
        page_type: pageState.value.type,
        page_type_id: pageState.value.typeId,
      })
    },

    trackAuthenticated: async (payload: AuthTrackingEventData, email = '') => {
      const eh = payload.eh || (email && (await getEmailHash(email)))
      const {
        customer_id: customerId,
        method,
        status,
        customer_type: customerType = 'new',
      } = payload

      const isLoginOrSignUpEvent =
        payload.event === 'login' || payload.event === 'sign_up'
      const methodKeyName = isLoginOrSignUpEvent ? 'login_method' : 'method'

      track(
        payload.event || 'login',
        mapCustomerInfoToTrackingPayload({
          customer_id: customerId,
          [methodKeyName]: method || METHOD_DEFAULT,
          eh,
          customer_type: customerType, // NOTE: CO should add this to payload as well
          status,
          pagePayload: {
            content_name: route.fullPath,
            page_type: pageState.value.type,
            page_type_id: pageState.value.typeId,
          },
        }),
      )
    },
  }
}

export default useUserActionEvents
