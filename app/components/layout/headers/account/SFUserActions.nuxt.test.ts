import { describe, expect, it, vi } from 'vitest'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import { ref } from 'vue'
import { fireEvent } from '@testing-library/vue'
import SFUserActions from './SFUserActions.vue'

const { useUser, useAuthentication } = vi.hoisted(() => {
  return {
    useUser: vi.fn(),
    useAuthentication: vi.fn(),
  }
})

vi.mock('#storefront/composables', async () => {
  const actual = await vi.importActual('#storefront/composables')
  return {
    ...actual,
    useUser,
    useCurrentShop: () => ref({ locale: new Intl.Locale('de-DE') }),
  }
})
vi.mock('~/composables', async () => {
  const actual = await vi.importActual('~/composables')
  return {
    ...actual,
    useAuthentication,
  }
})

const logoutMock = vi.fn()
useAuthentication.mockReturnValue({
  isSubmitting: ref(false),
  logout: logoutMock,
})

describe('logged in user', () => {
  it('should render with links', async () => {
    useUser.mockReturnValue({
      user: ref({
        email: 'user@scayle.com',
        firstName: 'firstName',
        lastName: 'lastName',
        status: {
          isGuestCustomer: false,
        },
      }),
    })
    const { getByText, getByRole } = await renderSuspended(SFUserActions)

    expect(getByText('Hallo firstName')).toBeTruthy()
    expect(getByText('user@scayle.com')).toBeTruthy()

    const settingsLink = getByRole('link', { name: 'Kontoeinstellungen' })
    expect(settingsLink).toBeInTheDocument()
    expect(settingsLink).toHaveAttribute('href', '/de/account/profile')

    const ordersLink = getByRole('link', { name: 'Deine Bestellungen' })
    expect(ordersLink).toBeInTheDocument()
    expect(ordersLink).toHaveAttribute('href', '/de/account/orders')

    const subscriptionLink = getByRole('link', { name: 'Deine Abonnements' })
    expect(subscriptionLink).toBeInTheDocument()
    expect(subscriptionLink).toHaveAttribute(
      'href',
      '/de/account/subscriptions',
    )

    expect(getByRole('button', { name: 'Abmelden' })).toBeInTheDocument()
  })

  it('should emit "close" event when link is clicked', async () => {
    useUser.mockReturnValue({
      user: ref({
        email: 'user@scayle.com',
        firstName: 'firstName',
        lastName: 'lastName',
        status: {
          isGuestCustomer: false,
        },
      }),
    })
    const { emitted, getAllByRole } = await renderSuspended(SFUserActions)
    const links = getAllByRole('link')
    await Promise.all(links.map((link) => fireEvent.click(link)))
    expect(emitted()['close']).toHaveLength(3)
  })
})

describe('guest user', () => {
  it('should not render links', async () => {
    useUser.mockReturnValue({
      user: ref({
        email: 'user@scayle.com',
        firstName: 'firstName',
        lastName: 'lastName',
        status: {
          isGuestCustomer: true,
        },
      }),
    })
    const { getByText, queryByRole, getByRole } =
      await renderSuspended(SFUserActions)

    expect(getByText('Hallo firstName')).toBeTruthy()
    expect(getByText('user@scayle.com')).toBeTruthy()

    const settingsLink = queryByRole('link', { name: 'Kontoeinstellungen' })
    expect(settingsLink).not.toBeInTheDocument()

    const ordersLink = queryByRole('link', { name: 'Deine Bestellungen' })
    expect(ordersLink).not.toBeInTheDocument()

    const subscriptionLink = queryByRole('link', { name: 'Deine Abonnements' })
    expect(subscriptionLink).not.toBeInTheDocument()

    expect(getByRole('button', { name: 'Abmelden' })).toBeInTheDocument()
  })
})

it('should trigger an logout and emit "close" event when logout is clicked', async () => {
  useUser.mockReturnValue({
    user: ref({
      email: 'user@scayle.com',
      firstName: 'firstName',
      lastName: 'lastName',
      status: {
        isGuestCustomer: true,
      },
    }),
  })

  const { emitted, getByRole } = await renderSuspended(SFUserActions)
  const logoutButton = getByRole('button', { name: 'Abmelden' })
  await fireEvent.click(logoutButton)
  expect(logoutMock).toBeCalledTimes(1)
  expect(emitted()['close']).toHaveLength(1)
})
