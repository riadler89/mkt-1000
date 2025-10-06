import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { useCurrentShopLocale } from './useCurrentShopLocale'

const currentShop = ref({ locale: 'de-DE', shopId: 1 })

vi.mock('#storefront/composables', () => ({
  useCurrentShop: () => currentShop,
}))

describe('useCurrentShopLocale', () => {
  it('returns a locale for the current shop', async () => {
    const shopLocale = useCurrentShopLocale()

    currentShop.value = { locale: 'de-DE', shopId: 1 }
    expect(shopLocale.value?.region).toEqual('DE')
    expect(shopLocale.value?.language).toEqual('de')

    currentShop.value = { locale: 'en-US', shopId: 1 }
    expect(shopLocale.value?.region).toEqual('US')
    expect(shopLocale.value?.language).toEqual('en')
  })
})
