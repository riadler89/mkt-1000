import { getCurrentScope, watch } from 'vue'
import { useBasket, useWishlist } from '#storefront/composables'
import { useTrackingEvents } from '~/composables/useTrackingEvents'
import {
  BasketListingMetadata,
  WishlistListingMetadata,
} from '~~/shared/constants'
import { didBasketDataChange, didWishlistDataChange } from '~/utils'

export const useUserItemsTrackingWatcher = async () => {
  const scope = getCurrentScope()

  const {
    trackBasket,
    trackWishlist,
    collectBasketItems,
    collectProductListItems,
  } = useTrackingEvents()

  const [{ data: wishlist, products: wishlistProducts }, { data: basket }] =
    await Promise.all([useWishlist(), useBasket()])

  scope?.run(() => {
    watch(
      () => basket.value,
      (newValues, oldValues) => {
        if (didBasketDataChange(oldValues, newValues)) {
          trackBasket(
            collectBasketItems(basket.value?.items, {
              listId: BasketListingMetadata.ID,
              listName: BasketListingMetadata.NAME,
            }),
          )
        }
      },
    )

    watch(
      () => wishlist.value,
      (newValues, oldValues) => {
        if (didWishlistDataChange(oldValues, newValues)) {
          trackWishlist(
            collectProductListItems(wishlistProducts.value, {
              listId: WishlistListingMetadata.ID,
              listName: WishlistListingMetadata.NAME,
            }),
          )
        }
      },
    )
  })
}
