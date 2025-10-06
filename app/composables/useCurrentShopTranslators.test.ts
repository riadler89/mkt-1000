import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { useCurrentShopTranslators } from './useCurrentShopTranslators'

const currentShop = ref({ locale: 'de-DE', shopId: 1 })

vi.mock('#storefront/composables', () => ({
  useCurrentShop: () => currentShop,
}))

describe('useCurrentShopTranslators', () => {
  it('should provide language translations', async () => {
    const { languageTranslator } = useCurrentShopTranslators()

    currentShop.value = { locale: 'de-DE', shopId: 1 }
    expect(languageTranslator.value?.of('en')).toEqual('Englisch')
    expect(languageTranslator.value?.of('de')).toEqual('Deutsch')

    currentShop.value = { locale: 'en-US', shopId: 1 }
    expect(languageTranslator.value?.of('en')).toEqual('English')
    expect(languageTranslator.value?.of('de')).toEqual('German')
  })

  it('should provide region translations', async () => {
    const { regionTranslator } = useCurrentShopTranslators()

    currentShop.value = { locale: 'de-DE', shopId: 1 }
    expect(regionTranslator.value?.of('US')).toEqual('Vereinigte Staaten')
    expect(regionTranslator.value?.of('DE')).toEqual('Deutschland')

    currentShop.value = { locale: 'en-US', shopId: 1 }
    expect(regionTranslator.value?.of('US')).toEqual('United States')
    expect(regionTranslator.value?.of('DE')).toEqual('Germany')
  })
})
