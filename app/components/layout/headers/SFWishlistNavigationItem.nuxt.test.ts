import { ref } from 'vue'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import { expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/vue'
import SFWishlistNavigationItem from './SFWishlistNavigationItem.vue'
import SFLoginActions from './account/SFLoginActions.vue'

const { useWishlist } = vi.hoisted(() => ({
  useWishlist: vi.fn(),
}))

vi.mock('#storefront/composables', async () => {
  const actual = await vi.importActual('#storefront/composables')
  return {
    ...actual,
    useWishlist,
  }
})

it('should render link to empty wishlist', async () => {
  useWishlist.mockReturnValue({ count: ref(0) })
  const { getByRole, getByTestId } = await renderSuspended(
    SFWishlistNavigationItem,
  )

  const link = getByRole('link', { name: 'Wunschliste' })
  expect(link).toBeInTheDocument()
  expect(link).toHaveAttribute('href', '/de/wishlist')
  expect(getByTestId('header-wishlist-count')).toBeEmptyDOMElement()
})

it('should render link to wishlist with 1 item', async () => {
  useWishlist.mockReturnValue({ count: ref(1) })
  const { getByRole, getByTestId } = await renderSuspended(
    SFWishlistNavigationItem,
  )
  const link = getByRole('link', { name: 'Wunschliste, 1 Artikel' })
  expect(link).toBeInTheDocument()
  expect(link).toHaveAttribute('href', '/de/wishlist')

  const wishlistCount = getByTestId('header-wishlist-count')
  expect(wishlistCount).toBeInTheDocument()
  expect(wishlistCount).toHaveTextContent('1')
})

it('should render link to wishlist with 2 items', async () => {
  useWishlist.mockReturnValue({ count: ref(2) })
  const { getByRole, getByTestId } = await renderSuspended(
    SFWishlistNavigationItem,
  )
  const link = getByRole('link', { name: 'Wunschliste, 2 Artikel' })
  expect(link).toBeInTheDocument()
  expect(link).toHaveAttribute('href', '/de/wishlist')

  const wishlistCount = getByTestId('header-wishlist-count')
  expect(wishlistCount).toBeInTheDocument()
  expect(wishlistCount).toHaveTextContent('2')
})

it('should emit "close" event when link is clicked', async () => {
  const { getAllByRole, emitted } = await renderSuspended(SFLoginActions)
  const links = getAllByRole('link')

  await Promise.all(links.map((link) => fireEvent.click(link)))

  expect(emitted()['close']).toHaveLength(2)
})
