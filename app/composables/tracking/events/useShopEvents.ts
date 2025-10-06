import { version } from '../../../../package.json'
import { useCurrentShop } from '#storefront/composables'
import type { TrackingEvent, TrackingPayload } from '~~/types/tracking'

const SHOP_GENDER: 'male' | 'female' | 'other' | '' = ''

const useShopEvents = (
  track: (event: TrackingEvent, payload: TrackingPayload) => void,
) => {
  const currentShop = useCurrentShop().value
  const currency = currentShop!.currency
  const locale = currentShop!.locale
  const shopId = currentShop!.shopId

  return {
    trackShopInit: () => {
      return track('shop_init', {
        shop_currency: currency,
        shop_id: shopId,
        shop_gender: SHOP_GENDER,
        shop_version: version,
        locale: locale?.replace('_', '-'),
        landing_page: window.location.href ?? '',
        referrer: window.document.referrer ?? '',
        parameter: window.location.search ?? '',
        origin: 'web',
      })
    },

    trackShopChange: () => {
      return track('shop_change', {
        shop_id: String(shopId),
        shop_gender: SHOP_GENDER,
        locale: locale.replace(/_/g, '-'),
        shop_currency: currency,
      })
    },
  }
}

export default useShopEvents
