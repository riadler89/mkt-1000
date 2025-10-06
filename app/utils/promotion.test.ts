import { describe, expect, it } from 'vitest'
import { buyXGetYPromotionFactory } from '@scayle/storefront-nuxt/test/factories'
import type { Campaign, CentAmount } from '@scayle/storefront-nuxt'
import {
  getBackgroundColorStyle,
  getTextColorStyle,
  getPromotionStyle,
  getCampaignStyle,
  getTieredPromotion,
  isTieredPromotion,
  getPromotionDisplayData,
  getCampaignDisplayData,
  FALLBACK_CAMPAIGN_COLORS,
  FALLBACK_PROMOTION_COLORS,
} from './promotion'

describe('getBackgroundColorStyle', () => {
  it('handles various color formats and edge cases', () => {
    // Valid hex colors
    expect(getBackgroundColorStyle('#ff0000')).toEqual({
      backgroundColor: '#FF0000',
    })
    expect(getBackgroundColorStyle('#FF0000')).toEqual({
      backgroundColor: '#FF0000',
    })
    expect(getBackgroundColorStyle('#abc')).toEqual({
      backgroundColor: '#AABBCC',
    })

    // Invalid/missing colors fall back to default
    expect(getBackgroundColorStyle()).toEqual({
      backgroundColor: FALLBACK_PROMOTION_COLORS.background,
    })
    expect(getBackgroundColorStyle(null)).toEqual({
      backgroundColor: FALLBACK_PROMOTION_COLORS.background,
    })
    expect(getBackgroundColorStyle(undefined)).toEqual({
      backgroundColor: FALLBACK_PROMOTION_COLORS.background,
    })
    expect(() => getBackgroundColorStyle('')).toThrow(
      'Unable to parse color from string:',
    )
    expect(() => getBackgroundColorStyle('invalid')).toThrow(
      'Unable to parse color from string: invalid',
    )
  })
})

describe('getTextColorStyle', () => {
  it('handles various color formats and edge cases', () => {
    // Valid hex colors
    expect(getTextColorStyle('#ff0000')).toEqual({ color: '#FF0000' })
    expect(getTextColorStyle('#FF0000')).toEqual({ color: '#FF0000' })
    expect(getTextColorStyle('#abc')).toEqual({ color: '#AABBCC' })

    // Invalid/missing colors fall back to default
    expect(getTextColorStyle()).toEqual({ color: '#AEECEF' })
    expect(getTextColorStyle(null)).toEqual({
      color: FALLBACK_PROMOTION_COLORS.background,
    })
    expect(getTextColorStyle(undefined)).toEqual({
      color: FALLBACK_PROMOTION_COLORS.background,
    })
    expect(() => getTextColorStyle('')).toThrow(
      'Unable to parse color from string:',
    )
    expect(() => getTextColorStyle('invalid')).toThrow(
      'Unable to parse color from string: invalid',
    )
  })
})

describe('getPromotionStyle', () => {
  it('handles various promotion data structures and edge cases', () => {
    // Valid promotion with custom colors
    const validPromotion = buyXGetYPromotionFactory.build({
      customData: {
        color: {
          background: '#ffffff',
          text: '#EEEEEE',
        },
      },
    })
    expect(getPromotionStyle(validPromotion)).toEqual({
      backgroundColor: '#ffffff',
      color: '#EEEEEE',
    })

    // Various invalid/missing data scenarios
    const fallbackStyle = {
      backgroundColor: FALLBACK_PROMOTION_COLORS.background,
      color: FALLBACK_PROMOTION_COLORS.text,
    }

    expect(
      getPromotionStyle(
        buyXGetYPromotionFactory.build({ customData: undefined }),
      ),
    ).toEqual(fallbackStyle)
    expect(
      getPromotionStyle(buyXGetYPromotionFactory.build({ customData: {} })),
    ).toEqual(fallbackStyle)
    expect(
      getPromotionStyle(
        buyXGetYPromotionFactory.build({ customData: { color: {} } }),
      ),
    ).toEqual(fallbackStyle)
    expect(getPromotionStyle(null)).toEqual(fallbackStyle)
    expect(getPromotionStyle(undefined)).toEqual(fallbackStyle)
  })
})

describe('getCampaignStyle', () => {
  it('handles various campaign data structures and edge cases', () => {
    // Valid campaign with custom colors
    const validCampaign = {
      name: 'Test Campaign',
      color: {
        background: '#ffffff',
        text: '#EEEEEE',
      },
    } as Campaign
    expect(getCampaignStyle(validCampaign)).toEqual({
      backgroundColor: '#ffffff',
      color: '#EEEEEE',
    })

    // Various invalid/missing data scenarios
    const fallbackStyle = {
      backgroundColor: FALLBACK_CAMPAIGN_COLORS.background,
      color: FALLBACK_CAMPAIGN_COLORS.text,
    }

    expect(getCampaignStyle({ name: 'Test Campaign' } as Campaign)).toEqual(
      fallbackStyle,
    )
    expect(
      getCampaignStyle({
        name: 'Test Campaign',
        color: {},
      } as unknown as Campaign),
    ).toEqual(fallbackStyle)
    expect(getCampaignStyle(null)).toEqual(fallbackStyle)
    expect(getCampaignStyle(undefined)).toEqual(fallbackStyle)
  })
})

describe('getTieredPromotion', () => {
  it('should return promotion with existing tiers when tiers are present', () => {
    const promotion = buyXGetYPromotionFactory.build({
      tiers: [
        {
          id: 1,
          name: 'tier1',
          mov: 100 as CentAmount,
          effect: {
            type: 'combo_deal',
            additionalData: {
              price: 1000,
              eligibleItemsQuantity: 2,
              maxCountType: 'per_eligible_items_quantity' as const,
            },
          },
        },
      ],
    })

    const result = getTieredPromotion(promotion)

    expect(result.tiers).toHaveLength(1)
    expect(result.tiers[0]).toEqual({
      id: 1,
      name: 'tier1',
      mov: 100 as CentAmount,
      effect: {
        type: 'combo_deal',
        additionalData: {
          price: 1000,
          eligibleItemsQuantity: 2,
          maxCountType: 'per_eligible_items_quantity' as const,
        },
      },
    })
  })

  it('should create tier from minimumOrderValue when no tiers exist', () => {
    const promotion = buyXGetYPromotionFactory.build({
      tiers: undefined,
      customData: {
        minimumOrderValue: 50,
      },
    })

    const result = getTieredPromotion(promotion)

    expect(result.tiers).toHaveLength(1)
    expect(result.tiers[0]).toEqual({
      id: 1,
      name: 'mov',
      mov: 50,
      effect: promotion.effect,
    })
  })

  it('should return empty tiers array when no tiers and no minimumOrderValue', () => {
    const promotion = buyXGetYPromotionFactory.build({
      tiers: undefined,
      customData: {},
    })

    const result = getTieredPromotion(promotion)

    expect(result.tiers).toEqual([])
  })

  it('should return empty tiers array when tiers is empty array', () => {
    const promotion = buyXGetYPromotionFactory.build({
      tiers: [],
      customData: {},
    })

    const result = getTieredPromotion(promotion)

    expect(result.tiers).toEqual([])
  })
})

describe('isTieredPromotion', () => {
  it('should return true when promotion has tiers', () => {
    const promotion = buyXGetYPromotionFactory.build({
      tiers: [
        {
          id: 1,
          name: 'tier1',
          mov: 100 as CentAmount,
          effect: {
            type: 'combo_deal',
            additionalData: {
              price: 1000,
              eligibleItemsQuantity: 2,
              maxCountType: 'per_eligible_items_quantity' as const,
            },
          },
        },
      ],
    })

    expect(isTieredPromotion(promotion)).toBe(true)
  })

  it('should return true when promotion has minimumOrderValue creating a tier', () => {
    const promotion = buyXGetYPromotionFactory.build({
      tiers: undefined,
      customData: {
        minimumOrderValue: 50,
      },
    })

    expect(isTieredPromotion(promotion)).toBe(true)
  })

  it('should return false when promotion has no tiers and no minimumOrderValue', () => {
    const promotion = buyXGetYPromotionFactory.build({
      tiers: undefined,
      customData: {},
    })

    expect(isTieredPromotion(promotion)).toBe(false)
  })

  it('should return false when promotion has empty tiers array', () => {
    const promotion = buyXGetYPromotionFactory.build({
      tiers: [],
      customData: {},
    })

    expect(isTieredPromotion(promotion)).toBe(false)
  })
})

describe('getPromotionDisplayData', () => {
  it('should return complete promotion display data', () => {
    const promotion = buyXGetYPromotionFactory.build({
      id: '123',
      name: 'Test Promotion',
      displayName: 'Special Offer',
      customData: {
        subline: 'Limited time offer',
        link: '/promotions/test',
        hideCountdown: true,
        conditions: 'Valid until stock lasts',
        color: {
          background: '#ff0000',
          text: '#ffffff',
        },
      },
      schedule: {
        from: '2024-01-01T00:00:00Z',
        to: '2024-12-31T23:59:59Z',
      },
    })

    const result = getPromotionDisplayData(promotion)

    expect(result).toEqual({
      id: '123',
      name: 'Test Promotion',
      headline: 'Special Offer',
      subline: 'Limited time offer',
      link: '/promotions/test',
      hideCountdown: true,
      colorStyle: {
        backgroundColor: '#ff0000',
        color: '#ffffff',
      },
      conditions: 'Valid until stock lasts',
      expirationDate: '2024-12-31T23:59:59Z',
    })
  })

  it('should use name as headline when displayName is not provided', () => {
    const promotion = buyXGetYPromotionFactory.build({
      name: 'Test Promotion',
      displayName: undefined,
    })

    const result = getPromotionDisplayData(promotion)

    expect(result.headline).toBe('Test Promotion')
  })

  it('should handle missing customData properties gracefully', () => {
    const promotion = buyXGetYPromotionFactory.build({
      customData: {},
    })

    const result = getPromotionDisplayData(promotion)

    expect(result.subline).toBeUndefined()
    expect(result.link).toBeUndefined()
    expect(result.hideCountdown).toBe(false)
    expect(result.conditions).toBeUndefined()
  })
})

describe('getCampaignDisplayData', () => {
  it('should return complete campaign display data', () => {
    const campaign = {
      id: 456,
      name: 'Test Campaign',
      headline: 'Campaign Headline',
      subline: 'Campaign subline',
      link: '/campaigns/test',
      hideCountdown: false,
      condition: 'Terms and conditions apply',
      color: {
        background: '#00ff00',
        text: '#000000',
      },
      endsAt: '2024-06-30T23:59:59Z',
    } as unknown as Campaign

    const result = getCampaignDisplayData(campaign)

    expect(result).toEqual({
      id: '456',
      name: 'Test Campaign',
      headline: 'Campaign Headline',
      subline: 'Campaign subline',
      link: '/campaigns/test',
      hideCountdown: false,
      colorStyle: {
        backgroundColor: '#00ff00',
        color: '#000000',
      },
      conditions: 'Terms and conditions apply',
      expirationDate: '2024-06-30T23:59:59Z',
    })
  })

  it('should use name as headline when headline is not provided', () => {
    const campaign = {
      id: 456,
      name: 'Test Campaign',
      headline: undefined,
    } as unknown as Campaign

    const result = getCampaignDisplayData(campaign)

    expect(result.headline).toBe('Test Campaign')
  })

  it('should handle missing campaign properties gracefully', () => {
    const campaign = {
      id: 456,
      name: 'Test Campaign',
      subline: undefined,
      link: undefined,
      hideCountdown: false,
      condition: 'Test condition',
      endsAt: '2024-12-31T23:59:59Z',
    } as unknown as Campaign

    const result = getCampaignDisplayData(campaign)

    expect(result.subline).toBeUndefined()
    expect(result.link).toBeUndefined()
    expect(result.hideCountdown).toBe(false)
    expect(result.conditions).toBe('Test condition')
    expect(result.expirationDate).toBe('2024-12-31T23:59:59Z')
  })
})
