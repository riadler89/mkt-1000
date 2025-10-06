import { renderSuspended } from '@nuxt/test-utils/runtime'
import { expect, it } from 'vitest'
import { fireEvent } from '@testing-library/vue'
import { navigationItemExternalFactory } from '@scayle/storefront-nuxt/test/factories'
import SFNavigationItemSuggestionList from './SFNavigationItemSuggestionList.vue'

const getNavigationItemSuggestionsComponent = (searchTerm: string = '') => {
  return renderSuspended(SFNavigationItemSuggestionList, {
    props: {
      navigationItemSuggestions: [
        {
          type: 'navigationItem',
          navigationItemSuggestion: {
            navigationItem: navigationItemExternalFactory.build({
              name: 'Home',
            }),
          },
        },
      ],
      searchTerm,
    },
  })
}

it('should render suggestions and suggestion count', async () => {
  const { getByText, getByRole } = await getNavigationItemSuggestionsComponent()
  expect(getByText('Seiten')).toBeInTheDocument()
  expect(getByText('1')).toBeInTheDocument()
  expect(getByRole('option', { name: 'Home' })).toBeInTheDocument()
})

it("should emit 'clickResult' event", async () => {
  const { emitted, getByText } = await getNavigationItemSuggestionsComponent()
  await fireEvent.click(getByText('Home'))
  expect(emitted()['clickResult']).toHaveLength(1)
  expect(emitted()['clickResult']![0]).toStrictEqual([
    {
      type: 'navigationItem',
      navigationItemSuggestion: {
        navigationItem: navigationItemExternalFactory.build({ name: 'Home' }),
      },
    },
  ])
})
