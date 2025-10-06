import { renderSuspended } from '@nuxt/test-utils/runtime'
import type { Category, CategoryFilter } from '@scayle/storefront-nuxt'
import { expect, it } from 'vitest'
import { fireEvent } from '@testing-library/vue'
import { categoryFactory } from '@scayle/storefront-nuxt/test/factories'
import SFCategorySuggestionList from './SFCategorySuggestionList.vue'

const getCategorySuggestionsComponent = (
  category: Category,
  filters: CategoryFilter[] = [],
) => {
  return renderSuspended(SFCategorySuggestionList, {
    props: {
      categorySuggestions: [
        {
          type: 'category',
          categorySuggestion: {
            category: category,
            filters,
          },
        },
      ],
    },
  })
}

it('should render suggestions and suggestion count', async () => {
  const { getByText, getByRole } = await getCategorySuggestionsComponent(
    categoryFactory.build({ name: 'Test Category' }),
  )
  expect(getByText('Kategorien')).toBeInTheDocument()
  expect(getByText('1')).toBeInTheDocument()
  expect(getByRole('option', { name: 'Test Category' })).toBeInTheDocument()
})

it("should emit 'click:result' event", async () => {
  const category = categoryFactory.build({ name: 'Category' })
  const { emitted, getByText } = await getCategorySuggestionsComponent(category)

  await fireEvent.click(getByText(category.name))
  expect(emitted()['clickResult']).toHaveLength(1)
  expect(emitted()['clickResult']![0]).toStrictEqual([
    {
      type: 'category',
      categorySuggestion: {
        category,
        filters: [],
      },
    },
  ])
})
