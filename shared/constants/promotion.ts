import type { ValuesType } from 'utility-types'

/* intentionally naming the variables the same as the type */

export const PromotionHeadlineSize = {
  BASE: 'base',
  SM: 'sm',
} as const

export type PromotionHeadlineSize = ValuesType<typeof PromotionHeadlineSize>

export const COUNTDOWN_LOADER_UNITS = 4
export const PROMOTIONS_CHANGE_DELAY = 5000
