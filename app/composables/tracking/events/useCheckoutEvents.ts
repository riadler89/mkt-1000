import type { BasketItem, Product, Variant } from '@scayle/storefront-nuxt'
import type {
  TrackingEvent,
  TrackingPayload,
  ProductListData,
} from '~~/types/tracking'

const collectBasketItems = (
  items: BasketItem<Product, Variant>[] = [],
  options: { listName: string; listId: string },
) => {
  return items.map(
    (basketItem): ProductListData => ({
      product: basketItem.product,
      list: {
        name: options.listName,
        id: options.listId,
      },
      quantity: basketItem.quantity,
    }),
  )
}

const useCheckoutEvents = (
  track: (event: TrackingEvent, payload: TrackingPayload) => void,
) => ({
  trackBeginCheckout: (
    items: BasketItem<Product, Variant>[] = [],
    listName: string,
    listId: string,
  ) => {
    track('begin_checkout', {
      items: collectBasketItems(items, { listName, listId }),
    })
  },
  collectBasketItems,
})
export default useCheckoutEvents
