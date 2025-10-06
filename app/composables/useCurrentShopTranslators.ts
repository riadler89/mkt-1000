import { computed, type ComputedRef } from 'vue'
import { useCurrentShop } from '#storefront/composables'

interface ShopTranslators {
  regionTranslator: ComputedRef<Intl.DisplayNames | undefined>
  languageTranslator: ComputedRef<Intl.DisplayNames | undefined>
}

/**
 * Return translator utils based on the current shop's locale
 *
 * @returns an object containing `regionTranslator` and `languageTranslator`
 */
export function useCurrentShopTranslators(): ShopTranslators {
  const currentShop = useCurrentShop()

  const regionTranslator = computed(() => {
    if (!currentShop.value) {
      return
    }
    return new Intl.DisplayNames([currentShop.value.locale], { type: 'region' })
  })

  const languageTranslator = computed(() => {
    if (!currentShop.value) {
      return
    }
    return new Intl.DisplayNames([currentShop.value.locale], {
      type: 'language',
    })
  })

  return { regionTranslator, languageTranslator }
}
