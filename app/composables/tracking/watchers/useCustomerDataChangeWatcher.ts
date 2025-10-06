import { getCurrentScope, watch } from 'vue'
import { onNuxtReady } from '#app/composables/ready'
import { useUser } from '#storefront/composables'
import { useTrackingEvents } from '~/composables/useTrackingEvents'

export const useCustomerDataChangeWatcher = () => {
  const scope = getCurrentScope()
  const { trackCustomerData } = useTrackingEvents()
  const { isLoggedIn, customerType, user, status } = useUser()

  watch(
    () => user.value,
    (userData) => {
      trackCustomerData({
        isLoggedIn: isLoggedIn.value,
        customerType: customerType.value,
        user: userData,
      })
    },
  )

  // NOTE: Sometimes, when the user is logged in, “duplicate” `customer_data` events on page refresh will be triggered.
  // This is actually not a real "duplicate" event, as the first event will have a guest user,
  // and the second one will be an existing one, due to the fact that the user is not fetched yet on initial rendering.
  // As a solution we remove the event that has the guest user in it since the user is already logged in.
  onNuxtReady(() => {
    scope?.run(() => {
      watch(
        () => status.value,
        (newStatus) => {
          if (newStatus === 'pending' || isLoggedIn.value) {
            return
          }
          trackCustomerData({
            isLoggedIn: false,
            customerType: 'guest',
          })
        },
        { once: true },
      )
    })
  })
}
