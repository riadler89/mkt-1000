import { renderSuspended } from '@nuxt/test-utils/runtime'
import { expect, it, vi } from 'vitest'
import { fireEvent } from '@testing-library/vue'
import { ref } from 'vue'
import SFUserNavigationItem from './SFUserNavigationItem.vue'

const { useUser } = vi.hoisted(() => ({
  useUser: vi.fn(),
}))

vi.mock('#storefront/composables', async () => {
  const actual = await vi.importActual('#storefront/composables')
  return {
    ...actual,
    useUser,
    useCurrentShop: () => ref({ locale: new Intl.Locale('de-DE') }),
  }
})

it('should render logged out sate', async () => {
  useUser.mockReturnValue({
    user: ref(undefined),
    status: ref('success'),
  })

  const { getByRole, getByTestId } = await renderSuspended(SFUserNavigationItem)
  await fireEvent.mouseEnter(getByTestId('popoverContainer'))

  expect(getByRole('link', { name: 'Mein Konto' })).toHaveAttribute(
    'href',
    '/de/signin',
  )
  const loginLink = getByRole('link', { name: 'Anmelden' })
  expect(loginLink).toBeInTheDocument()

  const registerLink = getByRole('link', { name: 'Registrieren' })
  expect(registerLink).toBeInTheDocument()
})

it('should render logged in state', async () => {
  useUser.mockReturnValue({
    user: ref({
      email: 'user@scayle.com',
      firstName: 'firstName',
      lastName: 'lastName',
      status: {
        isGuestCustomer: false,
      },
    }),
    status: ref('success'),
  })

  const { getByRole, getByTestId, getAllByRole } =
    await renderSuspended(SFUserNavigationItem)
  await fireEvent.mouseEnter(getByTestId('popoverContainer'))

  expect(getByRole('link', { name: 'Mein Konto' })).toHaveAttribute(
    'href',
    '/de/account',
  )
  expect(getAllByRole('link')).toHaveLength(4)
  expect(getByRole('button', { name: 'Abmelden' })).toBeInTheDocument()
})
