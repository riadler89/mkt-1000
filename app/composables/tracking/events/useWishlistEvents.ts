import { useCurrentShop } from '#storefront/composables'
import type {
  TrackingEvent,
  TrackingPayload,
  TrackRemoveFromWishListParams,
  TrackAddToWishListParams,
  ProductActionData,
  ProductListData,
} from '~~/types/tracking'

const getCategoryData = (category: { id?: number; name?: string }) => {
  const { id = -1, name = '' } = category
  return { id: id >= 0 ? id.toString() : '', name }
}

const processPayload = (
  data: TrackRemoveFromWishListParams | TrackAddToWishListParams,
  currencyCode: string,
): ProductActionData => {
  const {
    product,
    quantity = 1,
    listingMetaData,
    category,
    index = 1,
    pagePayload,
    variant,
  } = data

  return {
    product: { ...product, index },
    quantity,
    list: listingMetaData,
    currencyCode,
    ...(category && { category: getCategoryData(category) }),
    ...(variant && { variant }),
    pagePayload,
  }
}

const useWishlistEvents = (
  track: (event: TrackingEvent, payload: TrackingPayload) => void,
) => {
  const currencyCode = useCurrentShop().value!.currency

  return {
    trackRemoveFromWishlist: (data: TrackRemoveFromWishListParams) => {
      track('remove_from_wishlist', processPayload(data, currencyCode))
    },
    trackAddToWishlist: (data: TrackAddToWishListParams) => {
      track('add_to_wishlist', processPayload(data, currencyCode))
    },
    trackWishlist: (items: ProductListData[]) => {
      track('wishlist', {
        currencyCode,
        items,
      })
    },
  }
}
export default useWishlistEvents
