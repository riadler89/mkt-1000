import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderSuspended } from '@nuxt/test-utils/runtime'
import { ref } from 'vue'
import { fireEvent, within } from '@testing-library/vue'
import SFCountryDetection from './SFCountryDetection.vue'

const { useSessionStorage } = vi.hoisted(() => {
  return {
    useSessionStorage: vi.fn().mockReturnValue(() => ref(false)),
  }
})

vi.mock('@vueuse/core', async () => {
  const actual = await vi.importActual('@vueuse/core')
  return {
    ...actual,
    useSessionStorage,
  }
})
vi.mock('#storefront/composables', () => ({
  useCurrentShop: () => ref({ locale: new Intl.Locale('de-DE') }),
}))
const suggestionActive = ref(true)
vi.mock('#storefront-country-detection', () => ({
  useCountryDetection: () => ({
    suggestedShops: ref([
      {
        locale: new Intl.Locale('en-US'),
        shopId: 1,
        path: '/us',
      },
      {
        locale: new Intl.Locale('en-GB'),
        shopId: 2,
        path: '/gb',
      },
    ]),
    detectedRegion: ref('US'),
    suggestionActive,
    markUserAsPrompted: vi.fn(),
  }),
}))

describe('SFCountryDetection.vue', () => {
  beforeEach(() => {
    suggestionActive.value = true
  })
  it('should autofocus first suggested shop', async () => {
    const { getByTestId } = await renderSuspended(SFCountryDetection)

    const dialog = getByTestId('country-detection-dialog')
    expect(dialog).toBeVisible()

    const [usShopButton, gbShopButton] =
      within(dialog).getAllByTestId('button-switch-shop')

    expect(usShopButton).toBeVisible()
    expect(usShopButton).toHaveAttribute('autofocus', 'true')

    expect(gbShopButton).toBeVisible()
    expect(gbShopButton).toHaveAttribute('autofocus', 'false')
  })

  it('should close dialog and emit event when suggested shop was chosen', async () => {
    const { getByTestId, emitted } = await renderSuspended(SFCountryDetection)
    const dialog = getByTestId('country-detection-dialog')
    expect(dialog).toBeVisible()

    const [usShopButton] = within(dialog).getAllByTestId('button-switch-shop')
    expect(usShopButton).toBeDefined()
    await fireEvent.click(usShopButton!)
    expect(dialog).not.toBeVisible()
    expect(emitted().switchShop).toHaveLength(1)
    expect(emitted().switchShop![0]).toEqual([
      {
        locale: new Intl.Locale('en-US'),
        path: '/us',
        shopId: 1,
      },
    ])
  })

  it('should not emit "switchShop" event when staying in shop was chosen', async () => {
    const { getByTestId, emitted } = await renderSuspended(SFCountryDetection)
    const dialog = getByTestId('country-detection-dialog')
    expect(dialog).toBeVisible()

    const stayInShopButton = within(dialog).getByTestId('button-stay-in-shop')
    await fireEvent.click(stayInShopButton)
    expect(emitted().switchShop).toBeUndefined()
  })

  it('should not show dialog when suggestionActive is false', async () => {
    suggestionActive.value = false
    const { getByTestId } = await renderSuspended(SFCountryDetection)
    const dialog = getByTestId('country-detection-dialog')
    expect(dialog).not.toBeVisible()
  })
})
