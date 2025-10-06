import { computed, type ComputedRef } from 'vue'
import { useCurrentShop } from '#storefront/composables'

/**
 * Composable to get a reactive Locale object for the current shop
 *
 * @returns the Locale for the current shop
 */
export function useCurrentShopLocale(): ComputedRef<Intl.Locale | undefined> {
  const currentShop = useCurrentShop()
  return computed(() => {
    if (!currentShop.value || !currentShop.value.locale) {
      return
    }
    return new Intl.Locale(currentShop.value.locale)
  })
}
