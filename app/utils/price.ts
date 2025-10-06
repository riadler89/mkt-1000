import type { Order } from '@scayle/storefront-nuxt'

export type AppliedFees = Order['cost']['appliedFees']

export const getShippingCost = (
  appliedFees: AppliedFees = [],
  options: { includeTax: boolean } = { includeTax: false },
): number => {
  if (!appliedFees?.length) {
    return 0
  }

  return appliedFees
    .filter((fee) => fee.category === 'delivery')
    .reduce((total, fee) => {
      return (
        total +
        (options.includeTax ? fee.amount.withTax : fee.amount.withoutTax)
      )
    }, 0)
}

export const divideByHundred = (price: number): number => price / 100
