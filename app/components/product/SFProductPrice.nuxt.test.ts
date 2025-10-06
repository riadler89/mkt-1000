import { describe, it, expect, vi } from 'vitest'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import type { CentAmount } from '@scayle/storefront-nuxt'
import {
  priceFactory,
  automaticDiscountPromotionFactory,
} from '@scayle/storefront-nuxt/test/factories'
import SFProductPrice from './SFProductPrice.vue'

const { formatPercentageMock } = vi.hoisted(() => ({
  formatPercentageMock: vi.fn(),
}))
vi.mock('#storefront/composables', async () => {
  const actual = await vi.importActual('#storefront/composables')
  return {
    ...actual,
    useFormatHelpers: () => ({
      formatCurrency: (value: number) => `${value / 100}€`,
      formatPercentage: formatPercentageMock.mockImplementation(
        (value: number) => `${value * 100}%`,
      ),
    }),
  }
})

describe('ProductPrice.vue', () => {
  describe('lowest Prior Price', () => {
    it('should not render lowest prior price if its not present', async () => {
      const price = priceFactory.build()
      const { queryByTestId } = await renderSuspended(SFProductPrice, {
        props: { price },
      })
      expect(queryByTestId('lowest-prior-price')).not.toBeInTheDocument()
    })
    it('should not render lowest prior price its values are null', async () => {
      const price = priceFactory.build()
      const { queryByTestId } = await renderSuspended(SFProductPrice, {
        props: {
          price,
          lowestPriorPrice: { withTax: null, relativeDifferenceToPrice: null },
        },
      })
      expect(queryByTestId('lowest-prior-price')).not.toBeInTheDocument()
    })

    it('should show prior price', async () => {
      const price = priceFactory.build({ withTax: 100 })
      const { getByTestId } = await renderSuspended(SFProductPrice, {
        props: {
          price,
          lowestPriorPrice: { withTax: 90, relativeDifferenceToPrice: 0.1 },
        },
      })
      const priorPrice = getByTestId('lowest-prior-price')
      expect(priorPrice).toBeInTheDocument()
      expect(priorPrice).toHaveTextContent('30-Tage-Bestpreis: 0.9€ (10%)')
      expect(formatPercentageMock).toHaveBeenCalledWith(0.1, {
        signDisplay: 'exceptZero',
      })
    })
  })

  describe('tax info', () => {
    it('should not show tax info', async () => {
      const price = priceFactory.build()
      const { queryByTestId } = await renderSuspended(SFProductPrice, {
        props: { price },
      })
      expect(queryByTestId('tax-info')).not.toBeInTheDocument()
    })
    it('should show tax info', async () => {
      const price = priceFactory.build()
      const { queryByTestId } = await renderSuspended(SFProductPrice, {
        props: { price, showTaxInfo: true },
      })
      expect(queryByTestId('tax-info')).toBeVisible()
    })
  })

  describe('price from', () => {
    it('should show price form', async () => {
      const price = priceFactory.build({ withTax: 100 })
      const { getByText } = await renderSuspended(SFProductPrice, {
        props: { price, showPriceFrom: true },
      })
      expect(getByText('ab 1€')).toBeVisible()
    })

    it('should not show price form', async () => {
      const price = priceFactory.build({ withTax: 100 })
      const { getByText } = await renderSuspended(SFProductPrice, {
        props: { price },
      })
      expect(getByText('1€')).toBeVisible()
    })
  })
  describe('reductions', () => {
    it('should show a absolute reduction', async () => {
      const price = priceFactory.build({
        appliedReductions: [
          {
            category: 'sale',
            type: 'absolute',
            amount: { absoluteWithTax: 1000 as CentAmount, relative: 0.1 },
          },
        ],
      })
      const { getByText, getByTestId } = await renderSuspended(SFProductPrice, {
        props: { price },
      })
      expect(getByText('-10€')).toBeVisible()
      const strikeThroughPrice = getByTestId('initialProductPrice')
      expect(strikeThroughPrice).toHaveTextContent('11€')
      expect(strikeThroughPrice).toHaveClass('line-through')
      expect(getByTestId('price')).toHaveTextContent('1€')
    })

    it('should show a relative reduction', async () => {
      const price = priceFactory.build({
        appliedReductions: [
          {
            category: 'sale',
            type: 'relative',
            amount: { absoluteWithTax: 10 as CentAmount, relative: 0.1 },
          },
        ],
      })
      const { getByText, getByTestId } = await renderSuspended(SFProductPrice, {
        props: { price },
      })
      expect(getByText('-10%')).toBeVisible()
      const strikeThroughPrice = getByTestId('initialProductPrice')
      expect(strikeThroughPrice).toHaveTextContent('1.1€')
      expect(strikeThroughPrice).toHaveClass('line-through')
      expect(getByTestId('price')).toHaveTextContent('1€')
    })

    it('should hide badges', async () => {
      const price = priceFactory.build({
        appliedReductions: [
          {
            category: 'sale',
            type: 'relative',
            amount: { absoluteWithTax: 10 as CentAmount, relative: 0.1 },
          },
        ],
      })
      const { getByTestId, queryByText } = await renderSuspended(
        SFProductPrice,
        {
          props: { price, showBadges: false },
        },
      )
      expect(queryByText('-10%')).not.toBeInTheDocument()
      const strikeThroughPrice = getByTestId('initialProductPrice')
      expect(strikeThroughPrice).toHaveTextContent('1.1€')
      expect(strikeThroughPrice).toHaveClass('line-through')
      expect(getByTestId('price')).toHaveTextContent('1€')
    })

    it('should apply promotion color', async () => {
      const price = priceFactory.build({
        appliedReductions: [
          {
            category: 'promotion',
            type: 'relative',
            amount: { absoluteWithTax: 10 as CentAmount, relative: 0.1 },
            promotionId: 'promotion-id-1',
          },
        ],
      })
      const promotion = automaticDiscountPromotionFactory.build({
        id: 'promotion-id-1',
        customData: {
          color: {
            background: '#FFFFFF',
            text: '#EEEEEE',
          },
        },
      })
      const { getByTestId, getByText } = await renderSuspended(SFProductPrice, {
        props: { price, promotions: [promotion] },
      })

      const badge = getByText('-10%')
      expect(badge).toBeVisible()
      expect(badge).toHaveStyle({
        'background-color': '#FFFFFF',
        color: '#EEEEEE',
      })
      const strikeThroughPrice = getByTestId('initialProductPrice')
      expect(strikeThroughPrice).toHaveTextContent('1.1€')
      expect(strikeThroughPrice).toHaveClass('line-through')
      expect(getByTestId('price')).toHaveTextContent('1€')
    })

    it('should multiple reductions', async () => {
      const price = priceFactory.build({
        appliedReductions: [
          {
            category: 'sale',
            type: 'absolute',
            amount: { absoluteWithTax: 1000 as CentAmount, relative: 0.1 },
          },
          {
            category: 'sale',
            type: 'relative',
            amount: { absoluteWithTax: 10 as CentAmount, relative: 0.1 },
          },
        ],
      })
      const { getByText, getByTestId, getAllByTestId } = await renderSuspended(
        SFProductPrice,
        {
          props: { price },
        },
      )
      const absoluteReduction = getByText('-10€')
      expect(absoluteReduction).toBeVisible()
      const relativeReduction = getByText('-10%')
      expect(relativeReduction).toBeVisible()

      const [firstStrikeThrough, secondStrikeThrough] = getAllByTestId(
        'initialProductPrice',
      )
      expect(firstStrikeThrough).toBeVisible()
      expect(firstStrikeThrough).toHaveTextContent('1.1€')
      expect(firstStrikeThrough).toHaveClass('line-through')

      expect(secondStrikeThrough).toBeVisible()
      expect(secondStrikeThrough).toHaveTextContent('11.1€')
      expect(secondStrikeThrough).toHaveClass('line-through')

      expect(getByTestId('price')).toHaveTextContent('1€')
    })
  })
})
