import {
  type BasketItem,
  type ItemGroup,
  type Product,
  type Variant,
  getAttributeValue,
  getAttributeValueTuples,
} from '@scayle/storefront-nuxt'
import { nanoid } from 'nanoid'
import { isEqual } from '~/utils'

export const SUBSCRIPTION_ELIGIBILITY_ATTRIBUTE_NAME = 'subscriptionEligibility'
export const SUBSCRIPTION_INTERVALS_ATTRIBUTE_NAME =
  'subscriptionAvailableIntervals'
export const SUBSCRIPTION_TERM = 'subscriptionTerm'
export const SUBSCRIPTION_CANCELLATION_POLICY = 'subscriptionCancellationPolicy'

export type PreferredDeliveryDate = {
  day: number
  label: string
}

export const ORDINAL_INDEX_MAP: Record<string, number> = {
  one: 1,
  two: 2,
  few: 3,
  other: 0,
}

// check if at least one variant of the product is eligible for subscription
export const isProductSubscriptionEligible = (product?: Product) =>
  !!product?.variants?.length &&
  product.variants.some((variant) => {
    return (
      getAttributeValue(
        variant.attributes,
        SUBSCRIPTION_ELIGIBILITY_ATTRIBUTE_NAME,
      ) === 'true'
    )
  })

// check if the current variant fulfils the subscriptionEligibility condition and return all available intervals if so
export const getSubscriptionIntervals = (variant?: Variant) => {
  if (!variant) {
    return []
  }

  const attributeValue = getAttributeValue(
    variant.attributes,
    SUBSCRIPTION_ELIGIBILITY_ATTRIBUTE_NAME,
  )

  if (attributeValue !== 'true') {
    return []
  }

  return getAttributeValueTuples(
    variant.attributes,
    SUBSCRIPTION_INTERVALS_ATTRIBUTE_NAME,
  )
}

export const getOrdinalSuffixKey = (locale: string, value?: number) => {
  if (!value) {
    return
  }
  const ordinalRules = new Intl.PluralRules(locale, { type: 'ordinal' })

  return ordinalRules.select(value)
}

export const hasSubscriptionCustomData = (
  customData?: Record<string, unknown>,
) => {
  return Object.hasOwnProperty.call(customData || {}, 'subscriptionDefinition')
}

// This check is for rejecting adding variant in case of:
// 1) try to add subscription variant (priorItemToAdd) but the variant (subscription or not doesn't matter) is already in the basket
// 2) try to add non-subscription variant but the variant is already in the basket, and it's a subscription variant
export const isSubscriptionAlreadyInBasket = (
  isSubscriptionVariant: boolean,
  variantId: number,
  basketItems?: BasketItem[],
) => {
  const variantAlreadyInBasket = basketItems?.find(
    (basketItem) => basketItem.variant.id === variantId,
  )

  const hasVariantInBasketSubscriptionDefined = hasSubscriptionCustomData(
    variantAlreadyInBasket?.customData as Record<string, unknown>,
  )

  return (
    (isSubscriptionVariant && variantAlreadyInBasket) ||
    (!isSubscriptionVariant &&
      variantAlreadyInBasket &&
      hasVariantInBasketSubscriptionDefined)
  )
}

/**
 * Gets the item group for a given item and basket items.
 *
 * If the item already has an item group, return that. Otherwise, find the existing
 * subscription of the same variant in the basket and use its item group if available. If not found,
 * create a new item group with a unique id and mark it as required.
 *
 * @param item - The item to get the item group for.
 * @param basketItems - The current basket items.
 * @returns The subscription item group.
 */
export const getSubscriptionItemGroup = (
  variantId: number,
  basketItems: BasketItem[],
  subscriptionConditions: Record<string, unknown>,
): ItemGroup => {
  const existingSubscription = basketItems?.find((basketItem) => {
    return (
      basketItem.variant.id === variantId &&
      hasSubscriptionCustomData(
        basketItem.customData as Record<string, unknown>,
      ) &&
      isEqual(
        subscriptionConditions,
        (basketItem.customData as Record<string, unknown>)
          .subscriptionDefinition,
      )
    )
  })

  if (existingSubscription && existingSubscription.itemGroup) {
    return existingSubscription.itemGroup
  }

  return { id: nanoid(8), isMainItem: true, isRequired: true }
}
