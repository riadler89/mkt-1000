import { beforeEach, describe, expect, it } from 'vitest'
import { automaticDiscountPromotionFactory } from '@scayle/storefront-nuxt/test/factories'
import type { Promotion } from '@scayle/storefront-nuxt'
import { usePromotionCustomData } from './usePromotionCustomData'
import { FALLBACK_PROMOTION_COLORS } from '~/utils'

describe('usePromotionCustomData', () => {
  let promotion: Promotion

  beforeEach(() => {
    promotion = automaticDiscountPromotionFactory.build({
      name: 'Test Promotion',
      displayName: 'Display Name',
      customData: {},
      schedule: {
        to: '2024-01-01T00:00:00.000Z',
      },
    }) as Promotion
  })

  it('should return default values when no custom data is provided', () => {
    const {
      headline,
      subline,
      conditions,
      colorStyle,
      hideCountdown,
      link,
      expirationDate,
    } = usePromotionCustomData(promotion)

    expect(headline.value).toBe('Display Name')
    expect(subline.value).toBeUndefined()
    expect(conditions.value).toBeUndefined()
    expect(colorStyle.value).toStrictEqual({
      color: FALLBACK_PROMOTION_COLORS.text,
      backgroundColor: FALLBACK_PROMOTION_COLORS.background,
    })
    expect(hideCountdown.value).toBeFalsy()
    expect(link.value).toBeUndefined()
    expect(expirationDate.value).toBe('2024-01-01T00:00:00.000Z')
  })

  it('should return custom data when provided', () => {
    promotion.customData = {
      subline: 'Custom Subline',
      conditions: 'Custom Conditions',
      color: { text: 'white', background: 'red' },
      hideCountdown: true,
      link: '/custom-link',
    }

    const { headline, subline, conditions, colorStyle, hideCountdown, link } =
      usePromotionCustomData(promotion)

    expect(headline.value).toBe('Display Name')
    expect(subline.value).toBe('Custom Subline')
    expect(conditions.value).toBe('Custom Conditions')
    expect(colorStyle.value).toStrictEqual({
      color: 'white',
      backgroundColor: 'red',
    })
    expect(hideCountdown.value).toBe(true)
    expect(link.value).toBe('/custom-link')
  })

  it('should return undefined categoryLink if no link is provided', () => {
    promotion.customData = {
      link: undefined,
    }

    const { link } = usePromotionCustomData(promotion)

    expect(link.value).toBeUndefined()
  })
})
