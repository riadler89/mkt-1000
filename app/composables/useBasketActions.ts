import {
  extendPromise,
  ExistingItemHandling,
  AddToBasketFailureKind,
} from '@scayle/storefront-nuxt'
import type {
  AddOrUpdateItemType,
  BasketItem,
  BasketItemUpdateData,
} from '@scayle/storefront-nuxt'
import { useI18n, type Composer } from '#i18n'
import { useToast } from '~/composables/useToast'
import { useTrackingEvents } from '~/composables/useTrackingEvents'
import { useRouteHelpers } from '~/composables'
import { routeList } from '~/utils'
import { useBasket, useLog } from '#storefront/composables'
import { hasSubscriptionCustomData } from '~~/modules/subscription/helpers/subscription'
import { useApplyPromotions } from '#storefront-promotions/composables/useApplyPromotions'

export type AddToBasketItem = AddOrUpdateItemType & {
  productName: string
  interval?: string
  existingItemHandling?: ExistingItemHandling
}

export type UseBasketActionsReturn = {
  /** A function which adds an item to the basket and shows a success or error toast. */
  addItem: (item: AddToBasketItem) => Promise<void>
  /** A function which removes an item from the basket and shows a success or error toast. It also triggers a `remove_from_cart` tracking event.‚ */
  removeItem: (item: BasketItem) => Promise<void>
  /** A function which updates the quantity of the passed basket item and shows a success or error toast. It also triggers a `add_to_basket` tracking event.  */
  updateItemQuantity: (item: BasketItem, newQuantity: number) => Promise<void>
}

/**
 * Returns a translation key for a basket error message based on the provided error.
 *
 * @param error - The error to determine the error message key for
 * @returns The translation key corresponding to the error type
 */
export const getBasketToastErrorMessage = (
  error: unknown,
  i18n: Composer,
  productName?: string,
) => {
  if (error instanceof Error) {
    if (
      error.cause === AddToBasketFailureKind.ITEM_ADDED_WITH_REDUCED_QUANTITY
    ) {
      return i18n.t(
        'add_to_basket.notification.add_with_reduced_quantity_error',
      )
    } else if (error.cause === AddToBasketFailureKind.ITEM_UNAVAILABLE) {
      return i18n.t(
        'add_to_basket.notification.add_to_basket_variant_out_of_stock_error',
      )
    } else if (
      error.cause === AddToBasketFailureKind.MAXIMUM_ITEM_COUNT_REACHED
    ) {
      return i18n.t(
        'add_to_basket.notification.add_to_basket_max_basket_items_error',
      )
    }
  }
  return i18n.t('add_to_basket.notification.add_to_basket_error', {
    productName,
  })
}

/**
 * A composable to make it easier to add, update and remove items from the basket.
 * In addition of interacting with the basket, it also takes care of tracking and displaying toast messages.
 *
 * @returns An {@link UseBasketActionsReturn} object containing functions to add, update and remove items from the basket.
 */

export function useBasketActions(): UseBasketActionsReturn &
  Promise<UseBasketActionsReturn> {
  const i18n = useI18n()
  const log = useLog()

  const { show } = useToast()

  const { trackRemoveFromBasket, trackAddToBasket } = useTrackingEvents()

  const { getLocalizedRoute } = useRouteHelpers()

  const basket = useBasket()
  const { removeItemByKey, addItem: addItemToBasket, updateItem } = basket
  const { applyPromotions } = useApplyPromotions({ basket: basket.data })

  const removeItem = async ({
    key,
    product,
    quantity,
    variant,
  }: BasketItem) => {
    await removeItemByKey(key)
    await applyPromotions()
    trackRemoveFromBasket({ product, quantity, variant })
  }

  const showAddItemSuccessMessage = (
    item: AddToBasketItem,
    hasSubscriptionData: boolean,
  ) => {
    const message = hasSubscriptionData
      ? i18n.t(
          'add_to_basket.notification.add_subscription_to_basket_success',
          {
            productName: item.productName,
            interval: item.interval,
          },
        )
      : i18n.t('add_to_basket.notification.add_to_basket_success', {
          productName: item.productName,
        })

    show(message, {
      type: 'SUCCESS',
      action: 'ROUTE',
      to: getLocalizedRoute(routeList.basket),
    })
  }

  const addItem = async (item: AddToBasketItem) => {
    try {
      const hasSubscriptionData = hasSubscriptionCustomData(item.customData)
      const existingItemHandling =
        item.existingItemHandling ||
        ExistingItemHandling.ADD_QUANTITY_TO_EXISTING
      await addItemToBasket({ ...item, existingItemHandling })
      await applyPromotions(basket.data)
      showAddItemSuccessMessage(item, hasSubscriptionData)
    } catch (error) {
      log.error('Item could not be added to basket', error)
      show(
        i18n.t(getBasketToastErrorMessage(error, i18n), {
          productName: item.productName,
        }),
        { type: 'ERROR', action: 'CONFIRM' },
      )
    }
  }

  const updateItemQuantity = async (
    basketItem: BasketItem,
    newQuantity: number,
  ) => {
    await updateItem(basketItem.key, {
      quantity: newQuantity,
      customData: basketItem?.customData as BasketItemUpdateData['customData'],
      displayData: basketItem?.displayData,
      itemGroup: basketItem?.itemGroup,
      promotions: basketItem?.promotions,
    })
    await applyPromotions(basket.data)

    trackAddToBasket({
      product: basketItem.product,
      variant: basketItem.variant,
      quantity: newQuantity,
    })
  }

  return extendPromise(
    basket.then(() => ({})),
    {
      removeItem,
      addItem,
      updateItemQuantity,
    },
  )
}
