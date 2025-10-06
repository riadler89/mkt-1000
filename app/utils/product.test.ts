import type {
  CentAmount,
  Price,
  Promotion,
  BasketItem,
  ApplicablePromotion,
  BasketItemPromotion,
  BuyXGetYEffect,
} from '@scayle/storefront-nuxt'
import { it, describe, expect } from 'vitest'
import {
  attributeGroupSingleFactory,
  attributeGroupMultiFactory,
  productFactory,
  automaticDiscountPromotionFactory,
  basketItemFactory,
  buyXGetYPromotionFactory,
} from '@scayle/storefront-nuxt/test/factories'
import {
  getProductSiblings,
  getProductSiblingData,
  getPromotionsForProduct,
  createCustomPrice,
  getMaxQuantity,
  getPromotionsForProductDetailPage,
  getBuyXGetYPromotionForProductDetailPage,
  getDistinctPrimaryImageTypes,
  hasCampaignReduction,
  isBuyXGetX,
} from './product'
import { sortPromotionsByPriority } from '#storefront-promotions/utils'

describe('getPromotionsForProduct', () => {
  it('should get applicable promotions and return empty array for no promotions', () => {
    const product = productFactory.build({
      attributes: {
        promotion: attributeGroupSingleFactory.build({
          key: 'promotion',
          values: {
            id: 2432,
            label: '20% on Everything',
            value: '20_on_everything',
          },
        }),
      },
    })

    // Test with matching promotion
    const promotions = [
      automaticDiscountPromotionFactory.build({
        customData: {
          product: {
            badgeLabel: '-20% Off',
            attributeId: 2432,
          },
        },
      }),
      automaticDiscountPromotionFactory.build({
        customData: {
          product: {
            badgeLabel: '-20% Off',
            attributeId: 9999, // Non-matching
          },
        },
      }),
    ] as Promotion[]

    expect(getPromotionsForProduct(product, promotions)).toEqual([
      promotions[0],
    ])
    expect(getPromotionsForProduct(product, [])).toEqual([])
  })

  it('should handle multiple promotions with priority sorting and products without promotion attributes', () => {
    const productWithPromotions = productFactory.build({
      attributes: {
        promotion: attributeGroupMultiFactory.build({
          key: 'promotion',
          values: [
            { id: 2477, value: 'free_caps', label: 'Free Caps' },
            { id: 2432, label: '20% on Everything', value: '20_on_everything' },
          ],
        }),
      },
    })

    const productWithoutPromotions = productFactory.build({
      attributes: {},
    })

    const promotions = [
      automaticDiscountPromotionFactory.build({
        id: '1',
        customData: { product: { badgeLabel: '-20% Off', attributeId: 2432 } },
        priority: 9,
      }),
      automaticDiscountPromotionFactory.build({
        id: '2',
        customData: { product: { badgeLabel: 'Free Caps', attributeId: 2477 } },
        priority: 1,
      }),
    ] as Promotion[]

    expect(getPromotionsForProduct(productWithPromotions, promotions)).toEqual(
      promotions.toSorted(sortPromotionsByPriority),
    )
    expect(
      getPromotionsForProduct(productWithoutPromotions, promotions),
    ).toEqual([])
  })

  it('should handle promotions with missing customData or attributeId', () => {
    const product = productFactory.build({
      attributes: {
        promotion: attributeGroupSingleFactory.build({
          key: 'promotion',
          values: {
            id: 2432,
            label: '20% on Everything',
            value: '20_on_everything',
          },
        }),
      },
    })

    const promotions = [
      automaticDiscountPromotionFactory.build({ customData: undefined }),
      automaticDiscountPromotionFactory.build({ customData: { product: {} } }),
      automaticDiscountPromotionFactory.build({
        customData: { product: { badgeLabel: '-20% Off', attributeId: 2432 } },
      }),
    ] as Promotion[]

    expect(getPromotionsForProduct(product, promotions)).toEqual([
      promotions[2],
    ])
  })
})

describe('getProductSiblings', () => {
  it('handles various sibling filtering and sorting options', ({ expect }) => {
    const product = productFactory.build({
      id: 1,
      siblings: [
        productFactory.build({ id: 2, isActive: true, isSoldOut: false }),
        productFactory.build({ id: 3, isActive: false, isSoldOut: true }),
        productFactory.build({ id: 4, isActive: true, isSoldOut: false }),
      ],
    })

    // Default behavior: includes current product and all siblings
    expect(getProductSiblings(product, 'color').map((item) => item.id)).toEqual(
      [1, 2, 3, 4],
    )

    // Exclude current product
    expect(
      getProductSiblings(product, 'color', {
        includeCurrentProduct: false,
      }).map((item) => item.id),
    ).toEqual([2, 3, 4])

    // Omit sold out siblings
    expect(
      getProductSiblings(product, 'color', { omitSoldOut: true }).map(
        (item) => item.id,
      ),
    ).toEqual([1, 2, 4])

    // Sort sold out to end
    expect(
      getProductSiblings(product, 'color', { sortBySoldOut: true }).map(
        (item) => item.id,
      ),
    ).toEqual([1, 2, 4, 3])

    // Combined options
    expect(
      getProductSiblings(product, 'color', {
        includeCurrentProduct: false,
        omitSoldOut: true,
      }).map((item) => item.id),
    ).toEqual([2, 4])
  })

  it('handles edge cases and different color attribute names', ({ expect }) => {
    const product = productFactory.build({
      id: 1,
      siblings: [
        productFactory.build({ id: 2, isActive: true, isSoldOut: false }),
      ],
    })

    // No siblings
    const productNoSiblings = productFactory.build({ id: 1, siblings: [] })
    expect(getProductSiblings(productNoSiblings, 'color')).toEqual([
      getProductSiblingData(productNoSiblings, 'color'),
    ])

    // Null product
    expect(getProductSiblings(null, 'color')).toEqual([])
    expect(getProductSiblings(undefined, 'color')).toEqual([])

    // Different color attribute name
    expect(
      getProductSiblings(product, 'colorDetail').map((item) => item.id),
    ).toEqual([1, 2])
  })
})

describe('getProductSiblingData', () => {
  it('should return product sibling data', ({ expect }) => {
    const product = productFactory.build({
      id: 1,
      images: [
        {
          hash: 'images/fe8ee645c772b98de23b00e4f600a613.png',
          attributes: {},
        },
      ],
      isActive: true,
      isSoldOut: false,
      attributes: {
        name: attributeGroupSingleFactory.build({
          values: {
            label: "HUGO Sweatshirt 'Dakimara'",
          },
        }),
        brand: attributeGroupSingleFactory.build({
          values: {
            label: 'HUGO',
          },
        }),
        color: attributeGroupSingleFactory.build({
          values: {
            id: 6,
            label: 'Weiß',
            value: 'weiss',
          },
        }),
      },
    })
    const sibling = getProductSiblingData(product, 'color')
    expect(sibling).toStrictEqual({
      id: 1,
      name: "HUGO Sweatshirt 'Dakimara'",
      brand: 'HUGO',
      image: {
        hash: 'images/fe8ee645c772b98de23b00e4f600a613.png',
        attributes: {},
      },
      colors: [
        {
          id: 6,
          label: 'Weiß',
          value: 'weiss',
        },
      ],
      isSoldOut: false,
    })
  })
})

describe('createCustomPrice', () => {
  it('should replace product prices attribute with given value', () => {
    const price: Price = {
      currencyCode: 'EUR',
      withTax: 8990 as CentAmount,
      withoutTax: 7555 as CentAmount,
      appliedReductions: [],
      tax: {
        vat: {
          amount: 1435 as CentAmount,
          rate: 0.19,
        },
      },
    }

    const customPrice = createCustomPrice(price, { withTax: 0 as CentAmount })

    expect(customPrice).toStrictEqual({
      currencyCode: 'EUR',
      withTax: 0 as CentAmount,
      withoutTax: 7555 as CentAmount,
      appliedReductions: [],
      tax: {
        vat: {
          amount: 1435 as CentAmount,
          rate: 0.19,
        },
      },
    })
  })
})

describe('getMaxQuantity', () => {
  it('handles various stock quantities and edge cases', () => {
    // Normal stock quantities
    expect(getMaxQuantity(5)).toBe(5)
    expect(getMaxQuantity(9)).toBe(9)
    expect(getMaxQuantity(10)).toBe(10)

    // Stock above maximum limit (10)
    expect(getMaxQuantity(15)).toBe(10)
    expect(getMaxQuantity(100)).toBe(10)
    expect(getMaxQuantity(1000)).toBe(10)

    // Edge cases
    expect(getMaxQuantity(0)).toBe(0)
    expect(getMaxQuantity(undefined)).toBe(1)
    expect(getMaxQuantity(null as unknown as number)).toBe(1)

    // Negative stock (should be treated as 0)
    expect(getMaxQuantity(-5)).toBe(0)
  })
})

describe('getPromotionsForProductDetailPage', () => {
  it('should return empty array when product is null', () => {
    const result = getPromotionsForProductDetailPage(null, [])
    expect(result).toEqual([])
  })

  it('should return only product promotions when no basket item is provided', () => {
    const product = productFactory.build({
      attributes: {
        promotion: attributeGroupSingleFactory.build({
          key: 'promotion',
          values: {
            id: 2432,
            label: '20% on Everything',
            value: '20_on_everything',
          },
        }),
      },
    })

    const promotions = [
      automaticDiscountPromotionFactory.build({
        id: 'promo-1',
        customData: {
          product: {
            badgeLabel: '-20% Off',
            attributeId: 2432,
          },
        },
        priority: 5,
      }),
    ] as Promotion[]

    const result = getPromotionsForProductDetailPage(product, promotions)

    expect(result).toEqual([promotions[0]])
  })

  it('should combine and deduplicate product and basket promotions when basket item is provided', () => {
    const product = productFactory.build({
      attributes: {
        promotion: attributeGroupSingleFactory.build({
          key: 'promotion',
          values: {
            id: 2432,
            label: '20% on Everything',
            value: '20_on_everything',
          },
        }),
      },
    })

    const productPromotion = automaticDiscountPromotionFactory.build({
      id: 'promo-1',
      customData: {
        product: {
          badgeLabel: '-20% Off',
          attributeId: 2432,
        },
      },
      priority: 5,
    }) as Promotion

    const basketPromotion = automaticDiscountPromotionFactory.build({
      id: 'promo-2',
      priority: 3,
    }) as Promotion

    const basketItem = basketItemFactory.build({
      promotions: [basketPromotion as BasketItemPromotion],
    }) as BasketItem

    const result = getPromotionsForProductDetailPage(
      product,
      [productPromotion],
      basketItem,
    )

    // Should contain both promotions, sorted by priority (3 before 5)
    expect(result).toEqual([basketPromotion, productPromotion])
  })

  it('should remove duplicate promotions between basket and product promotions', () => {
    const product = productFactory.build({
      attributes: {
        promotion: attributeGroupSingleFactory.build({
          key: 'promotion',
          values: {
            id: 2432,
            label: '20% on Everything',
            value: '20_on_everything',
          },
        }),
      },
    })

    const sharedPromotion = automaticDiscountPromotionFactory.build({
      id: 'promo-shared',
      customData: {
        product: {
          badgeLabel: '-20% Off',
          attributeId: 2432,
        },
      },
      priority: 5,
    }) as Promotion

    const basketItem = basketItemFactory.build({
      promotions: [sharedPromotion as BasketItemPromotion],
    }) as BasketItem

    const result = getPromotionsForProductDetailPage(
      product,
      [sharedPromotion],
      basketItem,
    )

    // Should contain only one instance of the shared promotion
    expect(result).toEqual([sharedPromotion])
    expect(result).toHaveLength(1)
  })

  it('should return sorted promotions sorted correctly', () => {
    const product = productFactory.build({
      attributes: {
        promotion: attributeGroupMultiFactory.build({
          key: 'promotion',
          values: [
            {
              id: 2432,
              label: '20% on Everything',
              value: '20_on_everything',
            },
            {
              id: 2433,
              label: 'Free Shipping',
              value: 'free_shipping',
            },
          ],
        }),
      },
    })

    const highPriorityPromotion = automaticDiscountPromotionFactory.build({
      id: 'promo-high',
      customData: {
        product: {
          badgeLabel: '-20% Off',
          attributeId: 2432,
        },
      },
      priority: 1,
    }) as Promotion

    const lowPriorityPromotion = automaticDiscountPromotionFactory.build({
      id: 'promo-low',
      customData: {
        product: {
          badgeLabel: 'Free Shipping',
          attributeId: 2433,
        },
      },
      priority: 10,
    }) as Promotion

    const basketPromotion = automaticDiscountPromotionFactory.build({
      id: 'promo-basket',
      priority: 5,
    }) as Promotion

    const basketItem = basketItemFactory.build({
      promotions: [basketPromotion as BasketItemPromotion],
    }) as BasketItem

    const result = getPromotionsForProductDetailPage(
      product,
      [lowPriorityPromotion, highPriorityPromotion],
      basketItem,
    )

    expect(result).toEqual([
      highPriorityPromotion,
      basketPromotion,
      lowPriorityPromotion,
    ])
  })

  it('should return empty array when product has no promotion attributes', () => {
    const product = productFactory.build({
      attributes: {},
    })

    const promotions = [
      automaticDiscountPromotionFactory.build({
        id: 'promo-1',
        customData: {
          product: {
            badgeLabel: '-20% Off',
            attributeId: 2432,
          },
        },
      }),
    ] as Promotion[]

    const result = getPromotionsForProductDetailPage(product, promotions)

    expect(result).toEqual([])
  })
})

describe('getBuyXGetYPromotionForProductDetailPage', () => {
  it('should return undefined when no promotions are provided', () => {
    const result = getBuyXGetYPromotionForProductDetailPage([])
    expect(result).toBeUndefined()
  })

  it('should return undefined when promotions are provided but none are buyXGetY type', () => {
    const promotions = [
      automaticDiscountPromotionFactory.build({
        id: 'promo-1',
        effect: {
          additionalData: {
            type: 'relative',
            value: 1000,
          },
        },
      }),
    ] as Promotion[]

    const result = getBuyXGetYPromotionForProductDetailPage(promotions)

    expect(result).toBeUndefined()
  })

  it('should return undefined when buyXGetY promotion exists but gift condition is not met', () => {
    const buyXGetYPromotion = buyXGetYPromotionFactory.build({
      id: 'promo-buyxgety',
      effect: {
        additionalData: {
          variantIds: [1, 2, 3],
          applicableItemSelectionType: 'variant_ids',
        },
      },
    }) as Promotion

    const applicablePromotions: ApplicablePromotion[] = []

    const result = getBuyXGetYPromotionForProductDetailPage(
      [buyXGetYPromotion],
      applicablePromotions,
    )

    expect(result).toBeUndefined()
  })

  it('should return buyXGetY promotion when type matches and gift condition is met', () => {
    const buyXGetYPromotion = buyXGetYPromotionFactory.build({
      id: 'promo-buyxgety',
      effect: {
        additionalData: {
          variantIds: [1, 2, 3],
          applicableItemSelectionType: 'variant_ids',
        },
      },
      priority: 5,
    }) as Promotion

    const applicablePromotions: ApplicablePromotion[] = [
      { itemId: 'item-1', promotion: buyXGetYPromotion },
    ]

    const result = getBuyXGetYPromotionForProductDetailPage(
      [buyXGetYPromotion],
      applicablePromotions,
    )

    expect(result).toEqual(buyXGetYPromotion)
  })

  it('should return highest priority buyXGetY promotion when multiple are available', () => {
    const highPriorityPromotion = buyXGetYPromotionFactory.build({
      id: 'promo-high',
      effect: {
        additionalData: {
          variantIds: [1, 2, 3],
          applicableItemSelectionType: 'variant_ids',
        },
      },
      priority: 1,
    }) as Promotion

    const lowPriorityPromotion = buyXGetYPromotionFactory.build({
      id: 'promo-low',
      effect: {
        additionalData: {
          variantIds: [4, 5, 6],
        },
      },
      priority: 10,
    }) as Promotion

    const applicablePromotions: ApplicablePromotion[] = [
      { itemId: 'item-1', promotion: highPriorityPromotion },
      { itemId: 'item-2', promotion: lowPriorityPromotion },
    ]

    const result = getBuyXGetYPromotionForProductDetailPage(
      [lowPriorityPromotion, highPriorityPromotion],
      applicablePromotions,
    )

    expect(result).toEqual(highPriorityPromotion)
  })

  it('should filter out non-buyXGetY promotions and return only valid buyXGetY promotion', () => {
    const automaticDiscountPromotion = automaticDiscountPromotionFactory.build({
      id: 'promo-discount',
      effect: {
        additionalData: {
          type: 'relative',
          value: 1000,
        },
      },
      priority: 1,
    }) as Promotion

    const buyXGetYPromotion = buyXGetYPromotionFactory.build({
      id: 'promo-buyxgety',
      effect: {
        additionalData: {
          variantIds: [1, 2, 3],
          applicableItemSelectionType: 'variant_ids',
        },
      },
      priority: 5,
    }) as Promotion

    const applicablePromotions: ApplicablePromotion[] = [
      { itemId: 'item-1', promotion: buyXGetYPromotion },
    ]

    const result = getBuyXGetYPromotionForProductDetailPage(
      [automaticDiscountPromotion, buyXGetYPromotion],
      applicablePromotions,
    )

    expect(result).toEqual(buyXGetYPromotion)
  })

  it('should handle null promotions in the array gracefully', () => {
    const validPromotion = buyXGetYPromotionFactory.build({
      id: 'promo-valid',
      effect: {
        additionalData: {
          variantIds: [1, 2, 3],
          applicableItemSelectionType: 'variant_ids',
        },
      },
      priority: 5,
    }) as Promotion

    const applicablePromotions: ApplicablePromotion[] = [
      { itemId: 'item-1', promotion: validPromotion },
    ]

    // Include null in promotions array
    const promotionsWithNull = [
      null,
      validPromotion,
      null,
    ] as (Promotion | null)[]

    const result = getBuyXGetYPromotionForProductDetailPage(
      promotionsWithNull as Promotion[],
      applicablePromotions,
    )

    expect(result).toEqual(validPromotion)
  })
})

describe('getDistinctPrimaryImageTypes', () => {
  it('returns distinct primary image types from products', () => {
    const products = [
      productFactory.build({
        images: [
          {
            hash: 'image1.jpg',
            attributes: {
              primaryImageType: attributeGroupSingleFactory.build({
                values: { id: 1, label: 'Front', value: 'front' },
              }),
            },
          },
          {
            hash: 'image2.jpg',
            attributes: {
              primaryImageType: attributeGroupSingleFactory.build({
                values: { id: 2, label: 'Back', value: 'back' },
              }),
            },
          },
        ],
      }),
      productFactory.build({
        images: [
          {
            hash: 'image3.jpg',
            attributes: {
              primaryImageType: attributeGroupSingleFactory.build({
                values: { id: 1, label: 'Front', value: 'front' },
              }),
            },
          },
        ],
      }),
    ]

    const result = getDistinctPrimaryImageTypes(products)
    expect(result).toHaveLength(2)
    expect(result.map((img) => img.id)).toEqual([1, 2])
  })

  it('returns empty array for products without primary image types', () => {
    const products = [
      productFactory.build({
        images: [{ hash: 'image1.jpg', attributes: {} }],
      }),
      productFactory.build({ images: [] }),
    ]

    expect(getDistinctPrimaryImageTypes(products)).toEqual([])
  })

  it('handles empty products array', () => {
    expect(getDistinctPrimaryImageTypes([])).toEqual([])
  })
})

describe('hasCampaignReduction', () => {
  it('detects campaign reductions in price', () => {
    const priceWithCampaign = {
      currencyCode: 'EUR',
      withTax: 1000 as CentAmount,
      withoutTax: 840 as CentAmount,
      appliedReductions: [
        {
          category: 'campaign',
          amount: { relative: 10, absoluteWithTax: 100 as CentAmount },
          type: 'relative' as const,
        },
        {
          category: 'promotion',
          amount: { relative: 5, absoluteWithTax: 60 as CentAmount },
          type: 'relative' as const,
        },
      ],
      tax: { vat: { amount: 160 as CentAmount, rate: 0.19 } },
    } as Price

    const priceWithoutCampaign = {
      currencyCode: 'EUR',
      withTax: 1000 as CentAmount,
      withoutTax: 840 as CentAmount,
      appliedReductions: [
        {
          category: 'promotion',
          amount: { relative: 10, absoluteWithTax: 100 as CentAmount },
          type: 'relative' as const,
        },
      ],
      tax: { vat: { amount: 160 as CentAmount, rate: 0.19 } },
    } as Price

    expect(hasCampaignReduction(priceWithCampaign)).toBeTruthy()
    expect(hasCampaignReduction(priceWithoutCampaign)).toBeFalsy()
    expect(hasCampaignReduction(undefined)).toBeFalsy()
  })
})

describe('isBuyXGetX', () => {
  it('identifies Buy X Get X promotions correctly', () => {
    const buyXGetXPromotion = buyXGetYPromotionFactory.build({
      effect: {
        additionalData: {
          applicableItemSelectionType: 'cheapest' as const,
          variantIds: undefined,
        },
      },
    }) as Promotion<BuyXGetYEffect>

    const buyXGetYPromotion = buyXGetYPromotionFactory.build({
      effect: {
        additionalData: {
          applicableItemSelectionType: 'variant_ids' as const,
          variantIds: [1, 2, 3],
        },
      },
    }) as Promotion<BuyXGetYEffect>

    expect(isBuyXGetX(buyXGetXPromotion)).toBe(true)
    expect(isBuyXGetX(buyXGetYPromotion)).toBe(false)
  })
})
