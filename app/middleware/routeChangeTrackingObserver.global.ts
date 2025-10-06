import { defineNuxtRouteMiddleware } from '#app/composables/router'
import { usePageState, useTracking } from '~/composables'
import { mapTrackingDataForEvent } from '~/utils'

const TIMEOUT_DELAY = 500

export default defineNuxtRouteMiddleware((to, from) => {
  const { pageState } = usePageState()
  const tracking = useTracking()

  if (import.meta.server) {
    return
  }

  // We need to add delay because title is not properly retrieved from "document".
  setTimeout(() => {
    tracking.push(
      mapTrackingDataForEvent('content_view', {
        content_name: to.path,
        title: document.title || '',
        page_type: pageState.value.type,
        page_type_id: pageState.value.typeId,
        click_origin: from?.fullPath,
      }),
    )
  }, TIMEOUT_DELAY)
})
