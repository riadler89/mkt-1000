import { it, describe, expect } from 'vitest'
import type { CentAmount } from '@scayle/storefront-nuxt'
import {
  productFactory,
  priceFactory,
} from '@scayle/storefront-nuxt/test/factories'
import { mapProductToTrackingPayload } from '~/utils/tracking'

describe('tracking', () => {
  it('should return without price discount', () => {
    const product = productFactory.build()
    expect(mapProductToTrackingPayload(product)).toStrictEqual({
      campaign_discount: 0,
      item_brand: 'Brand Name',
      item_brand_id: '101',
      item_id: '1',
      item_name: 'Test Product',
      item_size: '',
      original_price: 1,
      price: 0.02,
      sale_discount: 0,
      tax: 0.98,
    })
  })

  it('should return with price discount', () => {
    const price = priceFactory.build({
      appliedReductions: [
        {
          category: 'sale',
          type: 'absolute',
          amount: {
            relative: 10,
            absoluteWithTax: 100 as CentAmount,
          },
        },
        {
          category: 'campaign',
          type: 'absolute',
          amount: {
            relative: 20,
            absoluteWithTax: 200 as CentAmount,
          },
        },
      ],
    })
    const product = productFactory.build({ priceRange: { min: price } })
    expect(mapProductToTrackingPayload(product)).toStrictEqual({
      campaign_discount: 2,
      item_brand: 'Brand Name',
      item_brand_id: '101',
      item_id: '1',
      item_name: 'Test Product',
      item_size: '',
      original_price: 4,
      price: 0.02,
      sale_discount: 1,
      tax: 3.98,
    })
  })
})
