import type { Product } from '@scayle/storefront-nuxt'
import { usePageState } from '~/composables/usePageState'
import { useTrackingEvents } from '~/composables/useTrackingEvents'
import type { ListItem } from '~~/types/tracking'

import { useRoute } from '#app/composables/router'
import { WishlistListingMetadata } from '~~/shared/constants'

export function useWishlistTracking() {
  const {
    trackRemoveFromWishlist,
    trackAddToWishlist,
    trackViewItemList,
    trackWishlist,
    collectProductListItems,
  } = useTrackingEvents()

  const route = useRoute()
  const { pageState } = usePageState()

  const trackWishlistItemEvent = (
    action: 'added' | 'removed',
    params: {
      product: Product
      listingMetaData?: ListItem
    },
  ) => {
    const { product, listingMetaData } = params
    if (!product) {
      return
    }

    const payload = {
      product,
      listingMetaData,
      pagePayload: {
        content_name: route.fullPath,
        page_type: pageState.value.type,
        page_type_id: route.params.id?.toString() || '',
      },
    }

    return action === 'added'
      ? trackAddToWishlist(payload)
      : trackRemoveFromWishlist(payload)
  }

  const trackWishlistPage = (products: Product[]) => {
    trackWishlist(
      collectProductListItems(products, {
        listId: WishlistListingMetadata.ID,
        listName: WishlistListingMetadata.NAME,
      }),
    )

    trackViewItemList({
      items: products.map((product, index) => ({ ...product, index })),
      listingMetaData: {
        id: WishlistListingMetadata.ID,
        name: WishlistListingMetadata.NAME,
      },
      source: 'wishlist',
    })
  }

  return {
    trackWishlistItemEvent,
    trackWishlistPage,
  }
}
