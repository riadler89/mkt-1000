import { renderSuspended } from '@nuxt/test-utils/runtime'
import type { Product } from '@scayle/storefront-nuxt'
import { expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/vue'
import {
  productFactory,
  priceFactory,
  attributeGroupFactory,
} from '@scayle/storefront-nuxt/test/factories'
import SFProductSuggestionList from './SFProductSuggestionList.vue'

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

const getProductSuggestionsComponent = (product: Product) => {
  return renderSuspended(SFProductSuggestionList, {
    props: {
      productSuggestions: [
        {
          type: 'product',
          productSuggestion: {
            product,
          },
        },
      ],
    },
  })
}

const product = productFactory.build({
  id: 1,
  attributes: {
    name: attributeGroupFactory.build({
      key: 'name',
      label: 'Test Product',
      values: {
        label: 'Test Product',
      },
    }),
    brand: attributeGroupFactory.build({
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
it('should render suggestions and suggestion count', async () => {
  const { getByText, getByRole } = await getProductSuggestionsComponent(product)
  expect(getByText('Produkte')).toBeInTheDocument()
  expect(getByText('1')).toBeInTheDocument()
  expect(
    getByRole('option', { name: 'Test Brand Test Product 1€' }),
  ).toBeInTheDocument()
})

it("should emit 'click:result' event", async () => {
  const { emitted, getByText } = await getProductSuggestionsComponent(product)
  await fireEvent.click(getByText('Test Product'))
  expect(emitted()['clickResult']).toHaveLength(1)
  expect(emitted()['clickResult']![0]).toStrictEqual([
    {
      type: 'product',
      productSuggestion: {
        product,
      },
    },
  ])
})
