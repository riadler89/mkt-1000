import { describe, expect, it, vi } from 'vitest'
import {
  attributeGroupMultiFactory,
  basketItemFactory,
  productFactory,
  automaticDiscountPromotionFactory,
  buyXGetYPromotionFactory,
} from '@scayle/storefront-nuxt/test/factories'
import {
  PromotionEffectType,
  type BasketItemPromotion,
  type RFC33339Date,
} from '@scayle/storefront-nuxt'
import { useActivePromotions } from './useActivePromotions'
// Hoisted mocks for all dependencies
const { useBasket, useCurrentPromotions } = vi.hoisted(() => ({
  useBasket: vi.fn(),
  useCurrentPromotions: vi.fn(),
}))

// Mock external dependencies
vi.mock('#storefront/composables', async () => {
  const actual = await vi.importActual('#storefront/composables')
  return {
    ...actual,
    useBasket,
    useCurrentPromotions,
  }
})

describe('useActivePromotions', () => {
  it('should return the mov, tiered and combo deal promotions for promotion configured for the product attributes', () => {
    useBasket.mockReturnValue({
      items: {
        value: [
          basketItemFactory.build({
            product: productFactory.build({
              attributes: {
                promotion: attributeGroupMultiFactory.build({
                  key: 'promotion',
                  values: [
                    {
                      id: 1,
                      label: 'Combo Deal',
                    },
                    {
                      id: 2,
                      label: 'Tiered Promotion',
                    },
                    {
                      id: 3,
                      label: 'MOV Promotion',
                    },
                  ],
                }),
              },
            }),
          }),
        ],
      },
    })

    useCurrentPromotions.mockReturnValue({
      data: {
        value: {
          entities: [
            {
              id: '1',
              customData: {
                product: {
                  attributeId: 1,
                },
              },
              effect: {
                type: PromotionEffectType.COMBO_DEAL,
              },
            },
            {
              id: '2',
              customData: {
                product: {
                  attributeId: 2,
                },
              },
              tiers: [
                {
                  id: 1,
                  name: 'Tier 1',
                  mov: 10000,
                  effect: {
                    type: PromotionEffectType.AUTOMATIC_DISCOUNT,
                  },
                },
              ],
            },
            {
              id: '3',
              customData: {
                product: {
                  attributeId: 3,
                },
                minimumOrderValue: 10000,
              },
            },
          ],
        },
      },
    })

    const { promotions } = useActivePromotions()

    expect(promotions.value).toHaveLength(3)
    expect(promotions.value[0]?.id).toBe('1')
    expect(promotions.value[1]?.id).toBe('2')
    expect(promotions.value[2]?.id).toBe('3')
  })

  it('should return the mov, tiered and combo deal promotions for promotion configured for the basket promotions', () => {
    useBasket.mockReturnValue({
      items: {
        value: [
          basketItemFactory.build({
            status: 'available',
            promotions: [
              {
                id: '1',
                name: 'Combo Deal',
                schedule: {
                  from: '2021-01-01' as RFC33339Date,
                  to: '2021-01-01' as RFC33339Date,
                },
                isActive: true,
                effect: {
                  type: PromotionEffectType.COMBO_DEAL,
                  additionalData: {
                    price: 100,
                    eligibleItemsQuantity: 1,
                    maxCountType: 'per_eligible_items_quantity',
                  },
                },
                conditions: [],
                customData: {},
                priority: 1,
                isValid: true,
                failedConditions: [],
              } as BasketItemPromotion,
              automaticDiscountPromotionFactory.build({
                id: '2',
                name: 'Tiered Promotion',
                isValid: true,
              }) as BasketItemPromotion,
              automaticDiscountPromotionFactory.build({
                id: '3',
                name: 'MOV Promotion',
                isValid: true,
              }) as BasketItemPromotion,
            ],
          }),
        ],
      },
    })

    useCurrentPromotions.mockReturnValue({
      data: {
        value: {
          entities: [
            {
              id: '1',
              customData: {
                product: {
                  attributeId: 1,
                },
              },
              effect: {
                type: PromotionEffectType.COMBO_DEAL,
              },
            },
            {
              id: '2',
              customData: {
                product: {
                  attributeId: 2,
                },
              },
              tiers: [
                {
                  id: 1,
                  name: 'Tier 1',
                  mov: 10000,
                  effect: {
                    type: PromotionEffectType.AUTOMATIC_DISCOUNT,
                  },
                },
              ],
            },
            {
              id: '3',
              customData: {
                product: {
                  attributeId: 3,
                },
                minimumOrderValue: 10000,
              },
            },
          ],
        },
      },
    })

    const { promotions } = useActivePromotions()

    expect(promotions.value).toHaveLength(3)
    expect(promotions.value[0]?.id).toBe('1')
    expect(promotions.value[1]?.id).toBe('2')
    expect(promotions.value[2]?.id).toBe('3')
  })

  it('should exclude buy x get y and automatic discount promotions', () => {
    useBasket.mockReturnValue({
      items: {
        value: [
          basketItemFactory.build({
            promotions: [
              {
                id: '1',
                name: 'Combo Deal',
                schedule: {
                  from: '2021-01-01' as RFC33339Date,
                  to: '2021-01-01' as RFC33339Date,
                },
                isActive: true,
                effect: {
                  type: PromotionEffectType.COMBO_DEAL,
                  additionalData: {
                    price: 100,
                    eligibleItemsQuantity: 1,
                    maxCountType: 'per_eligible_items_quantity',
                  },
                },
                conditions: [],
                customData: {},
                priority: 1,
                isValid: true,
                failedConditions: [],
              } as BasketItemPromotion,
              buyXGetYPromotionFactory.build({
                id: '2',
                name: 'Buy X Get Y Promotion',
                isValid: true,
              }) as BasketItemPromotion,
              automaticDiscountPromotionFactory.build({
                id: '3',
                name: 'MOV Promotion',
                isValid: true,
              }) as BasketItemPromotion,
            ],
          }),
        ],
      },
    })

    useCurrentPromotions.mockReturnValue({
      data: {
        value: {
          entities: [
            {
              id: '1',
              customData: {
                product: {
                  attributeId: 1,
                },
              },
              effect: {
                type: PromotionEffectType.COMBO_DEAL,
              },
            },
            {
              id: '2',
              customData: {
                product: {
                  attributeId: 2,
                },
              },
            },
            {
              id: '3',
              customData: {
                product: {
                  attributeId: 3,
                },
              },
            },
          ],
        },
      },
    })

    const { promotions } = useActivePromotions()

    expect(promotions.value).toHaveLength(1)
    expect(promotions.value[0]?.id).toBe('1')
  })
})
