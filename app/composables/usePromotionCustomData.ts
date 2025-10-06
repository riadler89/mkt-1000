import { computed, toRef, type ComputedRef, type MaybeRefOrGetter } from 'vue'
import type { Promotion, RFC33339Date } from '@scayle/storefront-nuxt'
import type { RouteLocationAsPathGeneric } from '#vue-router'
import { getPromotionStyle, type PromotionStyle } from '~/utils'
import { useRouteHelpers } from '~/composables'

interface UsePromotionCustomDataReturn {
  /**
   * The headline of the promotion, defaulting to the promotion's name if no custom headline is provided.
   */
  headline: ComputedRef<string | undefined>
  /**
   * Optional subline text associated with the promotion.
   */
  subline: ComputedRef<string | undefined>

  /**
   * Conditions or terms related to the promotion, if any.
   */
  conditions: ComputedRef<string | undefined>
  /**
   * The color style of the promotion, derived from its properties.
   */
  colorStyle: ComputedRef<PromotionStyle>
  /**
   * Indicates whether to hide the countdown timer for the promotion.
   */
  hideCountdown: ComputedRef<boolean>

  /**
   * A link associated with the promotion, if any; defaults to undefined if no custom link is provided.
   */
  link: ComputedRef<string | RouteLocationAsPathGeneric | undefined>
  /**
   * The date and time when the promotion schedule ends.
   */
  expirationDate: ComputedRef<RFC33339Date | undefined>
}

/**
 * A composable to easily access custom data of a promotion.
 * @param _promotion - The promotion of witch the custom data is taken from.
 * @returns An object containing computed properties for the promotion's custom data.
 */

export function usePromotionCustomData(
  _promotion: MaybeRefOrGetter<Promotion | undefined>,
): UsePromotionCustomDataReturn {
  const { getLocalizedRoute } = useRouteHelpers()
  const promotion = toRef(_promotion)

  const headline = computed(
    () => promotion.value?.displayName || promotion.value?.name,
  )

  const subline = computed(() => promotion.value?.customData.subline)

  const conditions = computed(() => promotion.value?.customData.conditions)

  const colorStyle = computed(() => getPromotionStyle(promotion.value))

  const hideCountdown = computed(
    () => promotion.value?.customData.hideCountdown || false,
  )

  const expirationDate = computed(() => promotion.value?.schedule.to)

  const link = computed(() => {
    return promotion.value?.customData.link
      ? getLocalizedRoute(promotion.value?.customData.link)
      : undefined
  })

  return {
    headline,
    subline,
    conditions,
    colorStyle,
    hideCountdown,
    link,
    expirationDate,
  }
}
