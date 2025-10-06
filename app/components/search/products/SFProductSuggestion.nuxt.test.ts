import { expect, it, vi } from 'vitest'
import type { Product } from '@scayle/storefront-nuxt'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import {
  priceFactory,
  attributeGroupSingleFactory,
  productFactory,
} from '@scayle/storefront-nuxt/test/factories'
import SFProductSuggestion from './SFProductSuggestion.vue'

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

const getProductSuggestionComponent = (product: Product) => {
  return renderSuspended(SFProductSuggestion, {
    props: {
      productSuggestion: {
        type: 'product',
        productSuggestion: {
          product,
        },
      },
    },
  })
}

it('should render only category name"', async () => {
  const product = productFactory.build({
    id: 1,
    attributes: {
      name: attributeGroupSingleFactory.build({
        key: 'name',
        label: 'Test Product',
        values: {
          label: 'Test Product',
        },
      }),
      brand: attributeGroupSingleFactory.build({
        key: 'name',
        label: 'Test Brand',
        values: {
          label: 'Test Brand',
          value: 'Test Brand',
        },
      }),
    },
    images: [{ hash: 'hash' }],
    priceRange: {
      min: priceFactory.build({ withTax: 100 }),
    },
  })
  const { getByRole } = await getProductSuggestionComponent(product)

  // TODO should we set a  better aria label?
  expect(
    getByRole('link', { name: 'Test Brand Test Product 1€' }),
  ).toHaveAttribute('href', '/de/p/test-product-1')
  expect(getByRole('img')).toHaveAttribute(
    'src',
    'https://cdn-test.url/hash?width=60&quality=75',
  )
})
