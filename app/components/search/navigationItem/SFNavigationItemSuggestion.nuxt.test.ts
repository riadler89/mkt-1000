import { expect, it } from 'vitest'
import type {
  NavigationItemCategory,
  NavigationItemExternal,
  NavigationItemPage,
  NavigationTreeItem,
} from '@scayle/storefront-nuxt'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import { fireEvent, within } from '@testing-library/vue'
import { categoryFactory } from '@scayle/storefront-nuxt/test/factories'
import SFNavigationItemSuggestion from './SFNavigationItemSuggestion.vue'

const getNavigationItemSuggestionComponent = (
  navigationItem: NavigationTreeItem,
  searchTerm?: string,
) => {
  return renderSuspended(SFNavigationItemSuggestion, {
    props: {
      navigationItemSuggestion: {
        type: 'navigationItem',
        navigationItemSuggestion: {
          navigationItem: navigationItem,
        },
      },
      searchTerm,
    },
  })
}
it('should work with individual link navigation items', async () => {
  const navigationItem: NavigationItemExternal = {
    id: 5717,
    assets: {},
    name: 'Home',
    visibleFrom: null,
    visibleTo: null,
    children: [],
    type: 'individual-link',
    options: { url: 'https://google.com', isOpenInNewWindow: true },
  }
  const { getByRole } =
    await getNavigationItemSuggestionComponent(navigationItem)
  const link = getByRole('link', { name: 'Home' })
  expect(link).toBeInTheDocument()
  expect(link).toHaveAttribute('href', 'https://google.com')
})

it('should work with categories navigation items', async () => {
  const categoryItem: NavigationItemCategory = {
    id: 5717,
    assets: {},
    name: 'CategoryName',
    visibleFrom: null,
    visibleTo: null,
    children: [],
    extraFilters: {},
    type: 'category',
    categoryId: 1,
    filters: [],
    category: categoryFactory.build({ id: 1, path: '/path' }),
  }
  const { getByRole } = await getNavigationItemSuggestionComponent(categoryItem)
  const link = getByRole('link', { name: 'CategoryName' })
  expect(link).toBeInTheDocument()
  expect(link).toHaveAttribute('href', '/de/c/path-1')
})

it('should work with page  navigation items', async () => {
  const pageItem: NavigationItemPage = {
    id: 5717,
    assets: {},
    name: 'PageName',
    visibleFrom: null,
    visibleTo: null,
    children: [],
    type: 'page',
    page: '/page',
  }
  const { getByRole } = await getNavigationItemSuggestionComponent(
    pageItem,
    'Page',
  )
  const link = getByRole('link', { name: 'PageName' })
  expect(link).toBeInTheDocument()
  expect(link).toHaveAttribute('href', '/page')
})

it('should should emit a "clickResult" event', async () => {
  const navigationItem: NavigationItemExternal = {
    id: 5717,
    assets: {},
    name: 'Home',
    visibleFrom: null,
    visibleTo: null,
    children: [],
    type: 'individual-link',
    options: { url: 'https://google.com', isOpenInNewWindow: true },
  }
  const { getByRole, emitted } =
    await getNavigationItemSuggestionComponent(navigationItem)
  const link = getByRole('link', { name: 'Home' })
  await fireEvent.click(link)
  expect(emitted()['clickResult']).toHaveLength(1)
  expect(emitted()['clickResult']![0]).toStrictEqual([
    {
      type: 'navigationItem',
      navigationItemSuggestion: {
        navigationItem,
      },
    },
  ])
})

it('should highlight the search term', async () => {
  const navigationItem: NavigationItemExternal = {
    id: 5717,
    assets: {},
    name: 'Home',
    visibleFrom: null,
    visibleTo: null,
    children: [],
    type: 'individual-link',
    options: { url: 'https://google.com', isOpenInNewWindow: true },
  }
  const { getByRole } = await getNavigationItemSuggestionComponent(
    navigationItem,
    'om',
  )
  const link = getByRole('link', { name: 'Home' })
  expect(link).toBeInTheDocument()
  expect(link).toHaveAttribute('href', 'https://google.com')
  const highlight = within(link).getByText('om')
  expect(highlight).toHaveClass('font-semibold')
})
