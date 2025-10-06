import { describe, it, expect } from 'vitest'
import type { CentAmount } from '@scayle/storefront-nuxt'
import { getShippingCost, divideByHundred, type AppliedFees } from './price'

describe('getShippingCost', () => {
  it('handles various fee scenarios and edge cases', () => {
    const appliedFees: AppliedFees = [
      {
        amount: {
          withoutTax: 500 as CentAmount,
          withTax: 700 as CentAmount,
        },
        category: 'delivery',
        key: 'test-key-1',
        option: 'test-option-1',
        tax: {
          vat: {
            amount: 200,
            rate: 0.4,
          },
        },
      },
      {
        amount: {
          withoutTax: 300 as CentAmount,
          withTax: 400 as CentAmount,
        },
        category: 'delivery',
        key: 'test-key-2',
        option: 'test-option-2',
        tax: {
          vat: {
            amount: 100,
            rate: 0.33,
          },
        },
      },
      {
        amount: {
          withoutTax: 200 as CentAmount,
          withTax: 250 as CentAmount,
        },
        category: 'payment',
        key: 'test-key-3',
        option: 'test-option-3',
        tax: {
          vat: {
            amount: 50,
            rate: 0.25,
          },
        },
      },
    ]

    // Test without tax (default behavior)
    expect(getShippingCost(appliedFees)).toEqual(800) // 500 + 300 (only delivery fees)

    // Test with tax included
    expect(getShippingCost(appliedFees, { includeTax: true })).toEqual(1100) // 700 + 400

    // Test with empty fees
    expect(getShippingCost([])).toEqual(0)
    expect(getShippingCost(undefined)).toEqual(0)

    // Test with only non-delivery fees
    const nonDeliveryFees: AppliedFees = [
      {
        amount: {
          withoutTax: 100 as CentAmount,
          withTax: 120 as CentAmount,
        },
        category: 'payment',
        key: 'test-key',
        option: 'test-option',
        tax: {
          vat: {
            amount: 20,
            rate: 0.2,
          },
        },
      },
    ]
    expect(getShippingCost(nonDeliveryFees)).toEqual(0)
    expect(getShippingCost(nonDeliveryFees, { includeTax: true })).toEqual(0)
  })
})

describe('divideByHundred', () => {
  it('handles various number inputs and edge cases', () => {
    // Basic functionality
    expect(divideByHundred(1000)).toEqual(10)
    expect(divideByHundred(500)).toEqual(5)
    expect(divideByHundred(100)).toEqual(1)
    expect(divideByHundred(50)).toEqual(0.5)
    expect(divideByHundred(1)).toEqual(0.01)

    // Negative numbers
    expect(divideByHundred(-1000)).toEqual(-10)
    expect(divideByHundred(-500)).toEqual(-5)
    expect(divideByHundred(-1)).toEqual(-0.01)

    // Zero and edge cases
    expect(divideByHundred(0)).toEqual(0)
    expect(divideByHundred(0.5)).toEqual(0.005)
    expect(divideByHundred(-0.5)).toEqual(-0.005)

    // Large numbers (realistic for cent amounts)
    expect(divideByHundred(999999)).toEqual(9999.99)
    expect(divideByHundred(123456)).toEqual(1234.56)

    // Decimal precision
    expect(divideByHundred(123)).toEqual(1.23)
    expect(divideByHundred(1234)).toEqual(12.34)
    expect(divideByHundred(12345)).toEqual(123.45)
  })
})
