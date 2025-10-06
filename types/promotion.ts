import type { CentAmount } from '@scayle/storefront-nuxt'
import type { PromotionStyle } from '~/utils/promotion'
import type { RouteLocationAsPathGeneric } from '#vue-router'

declare module '@scayle/storefront-nuxt' {
  interface PromotionCustomData {
    product?: {
      attributeId: number
      badgeLabel: string
    }
    subline?: string
    conditions?: string
    minimumOrderValue?: CentAmount
    color?: {
      background: string
      text: string
    }
    hideCountdown?: boolean
    link?: string
  }
}

export interface DealDisplayData {
  /**
   * The ID of the promotion or campaign
   */
  id: string
  /**
   * The name of the promotion or campaign
   */
  name: string
  /**
   * The headline of the promotion or campaign
   */
  headline?: string
  /**
   * The subline of the promotion or campaign
   */
  subline?: string
  /**
   * The link of the promotion or campaign
   */
  link?: string | RouteLocationAsPathGeneric
  /**
   * The color style of the promotion or campaign
   */
  colorStyle: PromotionStyle
  /**
   * The conditions of the promotion or campaign
   */
  conditions?: string
  /**
   * Whether the promotion or campaign has a countdown
   */
  hideCountdown: boolean
  /**
   * The expiration date of the promotion or campaign
   */
  expirationDate?: string | null
}
