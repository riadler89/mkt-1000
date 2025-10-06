import { extendPromise, type Promotion } from '@scayle/storefront-nuxt'
import { computed, type ComputedRef } from 'vue'
import { useBasket, useCurrentPromotions } from '#storefront/composables'
import { getPromotionsFromProductAttributes } from '~/utils'
import { isComboDealType } from '#storefront-promotions/utils/promotion'

type UseActivePromotionsReturn = {
  /** A list of promotions which should be displayed in the deal banner on basket page. */
  promotions: ComputedRef<Promotion[]>
}

export function useActivePromotions(): UseActivePromotionsReturn &
  Promise<UseActivePromotionsReturn> {
  const basket = useBasket()
  const promotionData = useCurrentPromotions()

  const { items: basketItems } = basket

  const allCurrentPromotions = computed<Promotion[]>(() => {
    return promotionData.data?.value?.entities ?? []
  })

  /**
   * Pre-computes the promotions that are configured for the product of the basket item.
   * It maps the promotion ID to the product attribute IDs.
   */
  const basketItemPromotions = computed(() => {
    if (!basketItems.value?.length) {
      return new Map<number, Set<number>>()
    }

    const promotionMap = new Map<number, Set<number>>()

    basketItems.value.forEach(({ product, status }) => {
      if (status !== 'available') {
        return
      }

      const productPromotions = getPromotionsFromProductAttributes(product)
      productPromotions?.forEach((promotion) => {
        if (promotion.id && !promotionMap.has(promotion.id)) {
          promotionMap.set(promotion.id, new Set())
        } else if (product.id && promotion.id) {
          promotionMap.get(promotion.id)!.add(product.id)
        }
      })
    })

    return promotionMap
  })

  /**
   * Pre-computes the promotions that are applied to the basket item.
   * It creates a set of promotion IDs to simplify the lookup of applied promotions.
   */
  const appliedPromotionIds = computed(() => {
    if (!basketItems.value?.length) {
      return new Set<string>()
    }

    const ids = new Set<string>()
    basketItems.value.forEach(({ promotions, status }) => {
      if (status !== 'available' || !promotions) {
        return
      }

      promotions.forEach((promotion) => {
        if (promotion.isValid) {
          ids.add(promotion.id)
        }
      })
    })

    return ids
  })

  /**
   * Returns active promotions.
   * An active promotion is a promotion that is configured for the product of the basket item or applied to the basket item.
   * Additionally, it checks if the promotion is a tiered, MOV or a combo deal promotion.
   */
  const promotions = computed(() => {
    if (!allCurrentPromotions.value.length || !basketItems.value?.length) {
      return []
    }

    const basketPromotionMap = basketItemPromotions.value
    const appliedIds = appliedPromotionIds.value

    return allCurrentPromotions.value.filter((promotion) => {
      const attributeId = promotion.customData.product?.attributeId
      const hasPromotedBasketItem = attributeId
        ? basketPromotionMap.has(attributeId)
        : false
      const promotionIsAppliedToBasketItem = appliedIds.has(promotion.id)
      const isTieredOrMOVPromotion =
        promotion.tiers?.length || !!promotion?.customData?.minimumOrderValue

      return (
        (isTieredOrMOVPromotion || isComboDealType(promotion)) &&
        (promotionIsAppliedToBasketItem || hasPromotedBasketItem)
      )
    })
  })

  return extendPromise(
    Promise.all([basket, promotionData]).then(() => ({})),
    {
      promotions,
    },
  )
}
