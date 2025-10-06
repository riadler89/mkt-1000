import type { Product } from '@scayle/storefront-nuxt'
import { getFirstAttributeValue } from '@scayle/storefront-nuxt'
import { useCurrentShop } from '#storefront/composables'
import { useRouteHelpers } from '~/composables/useRouteHelpers'
import { getDeepestCategoryForTracking } from '~/utils'
import type {
  TrackingEvent,
  TrackingPayload,
  ProductViewData,
  ProductListData,
  TrackSelectItemEventParams,
  TrackViewItemParams,
  TrackViewItemListEventParams,
} from '~~/types/tracking'

const collectProductListItems = (
  items: Product[],
  options: { listName: string; listId: string },
) => {
  return items.map(
    (product: Product, idx: number): ProductListData => ({
      product,
      list: {
        name: options.listName,
        id: options.listId,
        index: idx + 1,
      },
    }),
  )
}

const useProductEvents = (
  track: (event: TrackingEvent, payload: TrackingPayload) => void,
) => {
  const currencyCode = useCurrentShop().value!.currency
  const { getProductDetailRoute } = useRouteHelpers()

  return {
    trackSelectItem: ({
      product,
      category,
      listingMetaData,
      index = -1, // index starts from 1
      source,
      variant,
      quantity = 1,
      soldOut = false,
      pagePayload,
    }: TrackSelectItemEventParams) => {
      const payload = {
        product,
        destinationUrl: getProductDetailRoute(
          product.id,
          getFirstAttributeValue(product.attributes, 'name')?.label,
        ),
        destination: `product|${product.id}`,
        quantity,
        category: category
          ? {
              name: category?.name || '',
              id: category?.id?.toString() || '',
            }
          : undefined,
        list: listingMetaData
          ? {
              name: listingMetaData.name,
              id: listingMetaData.id,
              index: index > -1 ? index : undefined,
            }
          : undefined,
        variant: variant ?? undefined,
        source: source ?? undefined,
        sold_out: soldOut,
        pagePayload: pagePayload,
      }

      track('select_item', {
        ...payload,
        currencyCode,
      })
    },
    trackViewItemList: ({
      items,
      listingMetaData,
      paginationOffset = 0,
      source,
      category,
      positionOffset = -1,
    }: TrackViewItemListEventParams) => {
      const itemsToTrack =
        items?.map(
          (product): ProductViewData => ({
            product,
            category: category || {
              name: getDeepestCategoryForTracking(product.categories).name,
              id: getDeepestCategoryForTracking(product.categories).id,
            },
            list: {
              name: listingMetaData.name,
              id: listingMetaData.id,
              index: paginationOffset + (product.index + 1),
            },
            position:
              positionOffset > -1
                ? positionOffset + product.index + 1
                : undefined,
            destinationUrl: String(
              getProductDetailRoute(
                product.id,
                getFirstAttributeValue(product.attributes, 'name')?.label,
              ),
            ),
            destination: `product|${product.id}`,
            source:
              source ||
              `category|${
                getDeepestCategoryForTracking(product.categories).id || ''
              }`,
          }),
        ) || []

      track('view_item_list', {
        items: itemsToTrack,
        currencyCode,
      })
    },

    trackViewItem: ({
      product,
      quantity = 1,
      variant,
    }: TrackViewItemParams) => {
      track('view_item', {
        product,
        quantity,
        variant,
        list: {
          index: 1,
          name: '',
          id: '',
        },
        currencyCode,
      })
    },
    collectProductListItems,
  }
}

export default useProductEvents
