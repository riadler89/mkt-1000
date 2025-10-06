import {
  type Promotion,
  type Price,
  type Product,
  getAttributeValueTuples,
  getFirstAttributeValue,
  type ProductImage,
  type Value,
  type BasketItem,
  type ApplicablePromotion,
  type BuyXGetYEffect,
} from '@scayle/storefront-nuxt'
import type { BasketItemPrice } from '@scayle/storefront-nuxt/composables'
import { getPrimaryImage } from './image'
import type { ProductSibling } from '~~/types/siblings'
import {
  isBuyXGetYType,
  isGiftConditionMet,
  sortPromotionsByPriority,
} from '#storefront-promotions/utils'
import { getVariantIds } from '#storefront-promotions/utils/promotion'

export { ProductImageType } from '@scayle/storefront-nuxt'

/**
 * Retrieves all promotions configured for a given product.
 *
 * @param {Product} product - The product for which to find a promotion.
 * @returns {Promotion[]} - All promotions for the product or an empty array if none match.
 */
export const getPromotionsFromProductAttributes = (product?: Product) => {
  if (!product) {
    return []
  }
  return getAttributeValueTuples(product.attributes, 'promotion') || []
}

/**
 * Retrieves all promotions applicable to a given product.
 *
 * @param {Product} product - The product for which to find a promotion.
 * @param {Promotion[]} promotions - A list of available promotions.
 * @returns {Promotion[]} - All promotions for the product or an empty array if none match.
 */
export const getPromotionsForProduct = (
  product: Product,
  promotions: Promotion[],
): Promotion[] => {
  const productPromotions = getPromotionsFromProductAttributes(product)

  if (!productPromotions?.length) {
    return []
  }

  // We filter all available promotions that are configured for the product
  const items = promotions.filter(({ customData }) => {
    if (!customData?.product?.attributeId) {
      return false
    }
    return productPromotions.some(
      (promotion) => promotion.id === customData.product?.attributeId,
    )
  })

  return items.toSorted(sortPromotionsByPriority) || []
}

export const getProductSiblingData = (
  { id, images, attributes, isSoldOut }: Product,
  colorAttributeName = 'colorDetail',
): ProductSibling => ({
  id,
  name: getFirstAttributeValue(attributes, 'name')?.label ?? '',
  brand: getFirstAttributeValue(attributes, 'brand')?.label ?? '',
  image: getPrimaryImage(images) ?? images[0],
  colors: getAttributeValueTuples(attributes, colorAttributeName),
  isSoldOut,
})

export const getProductSiblings = (
  product?: Product | null,
  colorAttributeName = 'colorDetail',
  options: {
    omitSoldOut?: boolean
    includeCurrentProduct?: boolean
    sortBySoldOut?: boolean
  } = {},
): ProductSibling[] => {
  if (!product) {
    return []
  }

  const {
    omitSoldOut = false,
    includeCurrentProduct = true,
    sortBySoldOut = false,
  } = options
  const siblingItems =
    product?.siblings?.filter(({ isActive }) => {
      return omitSoldOut ? isActive : true
    }) ?? []

  const items = siblingItems.map((item) =>
    getProductSiblingData(item, colorAttributeName),
  )

  if (sortBySoldOut) {
    items.sort((a, b) => {
      const soldOutOrder = a.isSoldOut ? 1 : -1

      return a.isSoldOut === b.isSoldOut ? 0 : soldOutOrder
    })
  }

  return includeCurrentProduct
    ? [getProductSiblingData(product, colorAttributeName), ...items]
    : items
}

/**
 * Creates a new price object by merging the original price with any overwrite properties.
 *
 * @param price - The original price object.
 * @param overwrite - Optional overwrite properties for the price object.
 * @returns A new price object with merged properties.
 */
export const createCustomPrice = <T = Price | BasketItemPrice>(
  price: T,
  overwrite: Partial<T>,
): T => {
  return {
    ...price,
    ...overwrite,
  }
}
/**
 * Returns the maximum allowed quantity for a variant, taking into account stock and an upper limit of 10.
 *
 * @param variant - The variant to get the max quantity for
 * @returns The maximum allowed quantity
 */
// Note: The basket does not allow a quantity > 50, therefore we limit it to prevent errors
export const getMaxQuantity = (stockQuantity?: number) =>
  Math.max(Math.min(stockQuantity ?? 1, 10), 0)

/**
 * Returns a list of distinct primary image types from a list of products.
 *
 * @param products - The list of products to get the distinct primary image types from.
 * @returns A list of distinct primary image types.
 */
export const getDistinctPrimaryImageTypes = (products: Product[]) => {
  return Array.from(
    products
      .flatMap((product: Product) => {
        return product.images.filter((img: ProductImage) => {
          return !!img.attributes?.primaryImageType
        })
      })
      .reduce<Map<number, Value>>((acc, img) => {
        const value = getFirstAttributeValue(img.attributes, 'primaryImageType')
        if (value && value.id) {
          acc.set(value.id, value)
        }
        return acc
      }, new Map<number, Value>())
      .values(),
  )
}

/**
 * Checks if a price has a campaign reduction.
 *
 * @param price - The price to check.
 * @returns True if the price has a campaign reduction, false otherwise.
 */
export const hasCampaignReduction = (price?: Price) => {
  return price?.appliedReductions.find(
    (reduction) => reduction.category === 'campaign',
  )
}

/**
 * Aggregates promotions for a product on a product detail page, optionally merging them with promotions from a basket item.
 *
 * It retrieves promotions potentially applicable to the product and combines them with promotions
 * from the provided `basketItem`, if available. The resulting list is de-duplicated
 * by promotion ID and sorted by priority.
 *
 * @param product - The product for which to get promotions. Returns an empty array if `null`.
 * @param currentPromotions - The list of all currently active promotions.
 * @param basketItem - An optional basket item whose promotions will be merged.
 * @returns A unique array of promotions for the product, sorted by priority.
 */
export function getPromotionsForProductDetailPage(
  product: Product | null,
  currentPromotions: Promotion[] = [],
  basketItem?: BasketItem,
): Promotion[] {
  if (!product) {
    return []
  }

  const productPromotions = getPromotionsForProduct(product, currentPromotions)

  if (basketItem) {
    const basketPromotions = basketItem?.promotions ?? []

    const combined = [...basketPromotions, ...productPromotions]
    const uniquePromotions = combined.reduce<Promotion[]>((acc, promotion) => {
      if (!acc.find((p) => p.id === promotion.id)) {
        acc.push(promotion)
      }
      return acc
    }, [])

    return uniquePromotions.toSorted(sortPromotionsByPriority)
  }

  return productPromotions
}

/**
 * Checks if a promotion is a Buy X Get X promotion.
 * In these promotions, the purchased product itself is discounted or free, so no variant IDs are involved.
 *
 * @param promotion - The promotion to check.
 * @returns True if the promotion is a Buy X Get X promotion, false otherwise.
 */
export function isBuyXGetX(promotion: Promotion<BuyXGetYEffect>) {
  return (
    promotion.effect.additionalData.applicableItemSelectionType !==
      'variant_ids' && getVariantIds(promotion) === undefined
  )
}

/**
 * Selects the highest-priority 'Buy X Get Y' promotion from a list.
 *
 * This function filters an array to find promotions of the `buyXGetY` type
 * where the gift conditions are satisfied. Additionally, it checks if the promotion has variant ids.
 * From that subset, it sorts by priority and returns only the top one.
 *
 * @param promotions - The list of promotions to evaluate.
 * @param applicablePromotions - Promotions currently applied to the basket, used to determine if gift conditions are met.
 * @returns The `buyXGetY` promotion with the highest priority, or `undefined` if no eligible promotion is found.
 */
export function getBuyXGetYPromotionForProductDetailPage(
  promotions: Promotion[],
  applicablePromotions?: ApplicablePromotion[],
): Promotion<BuyXGetYEffect> | undefined {
  if (!promotions.length) {
    return
  }

  const buyXGetYPromotions = promotions.filter((promotion) => {
    if (!promotion) {
      return false
    }
    return (
      isBuyXGetYType(promotion) &&
      isGiftConditionMet(promotion, applicablePromotions) &&
      !isBuyXGetX(promotion)
    )
  })

  return buyXGetYPromotions.toSorted(
    sortPromotionsByPriority,
  )[0] as Promotion<BuyXGetYEffect>
}
