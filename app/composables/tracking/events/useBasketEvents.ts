import type { BasketItem, BasketTotalPrice } from '@scayle/storefront-nuxt'
import { useCurrentShop } from '#storefront/composables'
import { divideByHundred, sumReductionsByCategory } from '~/utils'
import type {
  TrackingEvent,
  BasicViewData,
  TrackingPayload,
  TrackAddToBasketParams,
  TrackRemoveFromBasketParams,
  BasketData,
  ProductListData,
} from '~~/types/tracking'

const useBasketEvents = (
  track: (event: TrackingEvent, payload: TrackingPayload) => void,
) => {
  const currencyCode = useCurrentShop().value!.currency

  return {
    trackBasketItems: (items: BasketItem[] = []) => {
      const basketPayload: BasketData = {
        items: items || [],
        total_campaign_reduction_with_tax: 0.0,
        total_sale_reduction_with_tax: 0.0,
        total_with_tax: 0.0,
        total_without_tax: 0.0,
      }

      items.forEach((basketItem) => {
        const { price } = basketItem
        const { appliedReductions } = price?.total || []

        basketPayload.total_sale_reduction_with_tax += sumReductionsByCategory(
          appliedReductions,
          'sale',
        )
        basketPayload.total_campaign_reduction_with_tax +=
          sumReductionsByCategory(appliedReductions, 'campaign')

        basketPayload.total_with_tax += price?.total?.withTax ?? 0
        basketPayload.total_without_tax += price?.total?.withoutTax ?? 0
      })

      track('cart', basketPayload)
    },

    trackAddToBasket: ({
      products,
      product,
      quantity = 1,
      variant,
      index = 1,
      list,
    }: TrackAddToBasketParams) => {
      track('add_to_cart', {
        ...(product && { product: { ...product, index } }),
        products,
        variant,
        quantity,
        currencyCode,
        list,
      })
    },

    trackRemoveFromBasket: ({
      product,
      products,
      quantity,
      variant,
      index = 1,
    }: TrackRemoveFromBasketParams) => {
      track('remove_from_cart', {
        ...(product && { product: { ...product, index } }),
        products,
        variant,
        quantity,
        currencyCode,
      })
    },

    trackBasket: (items: ProductListData[]) => {
      track('cart', { currencyCode, items })
    },

    trackViewBasket: (
      items: ProductListData[],
      pagePayload: BasicViewData,
      valueWithoutTax?: BasketTotalPrice,
    ) => {
      track('view_cart', {
        currencyCode,
        items,
        valueWithoutTax: divideByHundred(valueWithoutTax?.withoutTax || 0),
        pagePayload,
      })
    },
  }
}
export default useBasketEvents
