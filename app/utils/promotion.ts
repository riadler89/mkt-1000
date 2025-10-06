import type { Campaign, Promotion } from '@scayle/storefront-nuxt'
import Color from 'color'
import { theme } from '#tailwind-config'
import type { DealDisplayData } from '~~/types/promotion'

const getRGBAValue = (color: string, alpha: AlphaValue) =>
  Color(color)
    .alpha(alpha / 100)
    .rgb()
    .string()

export const FALLBACK_COLOR = theme.colors.promotion

export const FALLBACK_PROMOTION_COLORS = {
  background: FALLBACK_COLOR,
  text: theme.colors.primary,
}

export const FALLBACK_CAMPAIGN_COLORS = {
  background: theme.colors.campaign,
  text: theme.colors.primary,
}

type AlphaValue = 0 | 5 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 100

export type PromotionStyle =
  | {
      textColor: string
      backgroundColor: string
      color?: string
    }
  | {
      textColor?: string
      backgroundColor: string
      color: string
    }

/**
 * Returns a style object with a background color based on the provided color and alpha values.
 *
 * @param color - The color to use for the background. If not provided, the fallback color will be used.
 * @param alpha - The alpha value to apply to the color. If not provided, no alpha will be applied.
 *
 * @returns An object containing the background color style as hex color.
 */
export const getBackgroundColorStyle = (
  color?: string | unknown,
  alpha?: AlphaValue,
): { backgroundColor: string } => {
  const colorHex = Color(color ?? FALLBACK_COLOR).hex()

  return {
    backgroundColor:
      alpha !== undefined ? getRGBAValue(colorHex, alpha) : colorHex,
  }
}
/**
 * Returns a style object with a text color based on the provided color and alpha values.
 *
 * @param color - The color to use for the text. If not provided, the fallback color will be used.
 * @param alpha - The alpha value to apply to the color. If not provided, no alpha will be applied.
 *
 * @returns An object containing the text color style as hex color.
 */
export const getTextColorStyle = (
  color?: string | unknown,
  alpha?: AlphaValue,
) => {
  const colorHex = Color(color ?? FALLBACK_COLOR).hex()
  return {
    color: alpha !== undefined ? getRGBAValue(colorHex, alpha) : colorHex,
  }
}

/**
 * Returns a promotion style object based on the provided promotion.
 *
 * @param promotion - The promotion to use for determining the style. If not provided, an empty style will be returned.
 *
 * @returns An object containing the promotion style as hex color.
 */
export const getPromotionStyle = (
  promotion?: Promotion | null,
): PromotionStyle => {
  if (!promotion) {
    return {
      backgroundColor: FALLBACK_PROMOTION_COLORS.background,
      color: FALLBACK_PROMOTION_COLORS.text,
    }
  }

  return {
    backgroundColor:
      promotion.customData?.color?.background ||
      FALLBACK_PROMOTION_COLORS.background,
    color: promotion.customData?.color?.text || FALLBACK_PROMOTION_COLORS.text,
  }
}

/**
 * Returns a campaign style object based on the provided campaign.
 *
 * @param campaign - The campaign to use for determining the style. If not provided, an empty style will be returned.
 *
 * @returns An object containing the campaign style as hex color.
 */
export const getCampaignStyle = (
  campaign?: Campaign | null,
): PromotionStyle => {
  if (!campaign) {
    return {
      backgroundColor: FALLBACK_CAMPAIGN_COLORS.background,
      color: FALLBACK_CAMPAIGN_COLORS.text,
    }
  }

  return {
    backgroundColor:
      campaign?.color?.background || FALLBACK_CAMPAIGN_COLORS.background,
    color: campaign?.color?.text || FALLBACK_CAMPAIGN_COLORS.text,
  }
}

/**
 * Returns a promotion object with tiers if the promotion has tiers, otherwise returns the promotion object with an empty tiers array.
 *
 * @param promotion - The promotion to use for determining the tiers.
 *
 * @returns An object containing the promotion with tiers.
 */
export function getTieredPromotion(
  promotion: Promotion,
): Promotion & Required<Pick<Promotion, 'tiers'>> {
  if (promotion.tiers?.length) {
    return promotion as Promotion & Required<Pick<Promotion, 'tiers'>>
  } else if (promotion.customData.minimumOrderValue) {
    return {
      ...promotion,
      tiers: [
        {
          effect: promotion.effect,
          id: 1,
          name: 'mov',
          mov: promotion.customData.minimumOrderValue,
        },
      ],
    }
  } else {
    return {
      ...promotion,
      tiers: [],
    }
  }
}

/**
 * Checks if a promotion has pricing tiers.
 *
 * A promotion is considered tiered if its `tiers` array is not empty.
 *
 * @param promotion - The promotion to check.
 *
 * @returns `true` if the promotion has one or more tiers, otherwise `false`.
 */
export function isTieredPromotion(promotion: Promotion): boolean {
  return !!getTieredPromotion(promotion).tiers.length
}

/**
 * Returns a promotion display data object based on the provided promotion.
 *
 * @param promotion - The promotion to use for determining the display data.
 *
 * @returns An object containing the promotion display data.
 */
export function getPromotionDisplayData(promotion: Promotion): DealDisplayData {
  return {
    id: promotion.id,
    name: promotion.name,
    headline: promotion.displayName || promotion.name,
    subline: promotion.customData.subline,
    link: promotion.customData.link,
    hideCountdown: promotion.customData.hideCountdown || false,
    colorStyle: getPromotionStyle(promotion),
    conditions: promotion.customData.conditions,
    expirationDate: promotion.schedule.to,
  }
}

/**
 * Returns a campaign display data object based on the provided campaign.
 *
 * @param campaign - The campaign to use for determining the display data.
 *
 * @returns An object containing the campaign display data.
 */
export function getCampaignDisplayData(campaign: Campaign): DealDisplayData {
  return {
    id: campaign.id.toString(),
    name: campaign.name,
    headline: campaign.headline || campaign.name,
    subline: campaign.subline,
    link: campaign.link,
    hideCountdown: campaign.hideCountdown || false,
    colorStyle: getCampaignStyle(campaign),
    conditions: campaign.condition,
    expirationDate: campaign.endsAt,
  }
}
