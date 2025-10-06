import { computed, type ComputedRef } from 'vue'
import { useCountryDetection } from '@scayle/storefront-country-detection/composables'
import { useSwitchLocalePath, useI18n, type Locale, useLocalePath } from '#i18n'
import { useCurrentShop, useAvailableShops } from '#storefront/composables'
import { useTrackingEvents } from '~/composables/useTrackingEvents'
import { useCurrentShopLocale } from '~/composables/useCurrentShopLocale'
import { useCurrentShopTranslators } from '~/composables/useCurrentShopTranslators'

type ShopConfig = ReturnType<typeof useAvailableShops>['value'][0]

interface ShopSwitcherUtils {
  /**
   * A reactive list of available regions, including all shops for the region
   */
  availableCountries: ComputedRef<
    {
      /** The shops for the region */
      shops: [ShopConfig, ...ShopConfig[]]
      /** The region code */
      code: string
      /** The name of the region, translated in the current shop's language */
      name: string
    }[]
  >

  /**
   * A reactive list of available language shops for the same region as the current shop
   */
  availableLanguages: ComputedRef<
    {
      /** The shop for the language */
      shop: ShopConfig
      /** The language code */
      code: string
      /** The name of the language, translated in the current shop's language */
      name: string
    }[]
  >

  /**
   * Function to change the current shop.
   * If `locale` matches the current locale, the function will exit early
   *
   * @param path the path of the target shop
   * @param locale the locale of the target shop
   * @returns
   */
  changeShop: (path?: string, locale?: string) => void
}

/**
 * This composable provides utilities for switching between different shops
 * in the storefront application.
 */
export function useShopSwitcher(
  switchToHomePage: boolean = true,
): ShopSwitcherUtils {
  const currentShop = useCurrentShop()
  const availableShops = useAvailableShops()

  const switchLocalePath = useSwitchLocalePath()
  const localePath = useLocalePath()

  const { trackShopChange } = useTrackingEvents()

  const currentLocale = useCurrentShopLocale()
  const { languageTranslator, regionTranslator } = useCurrentShopTranslators()
  const i18n = useI18n()

  const { markShopAsSwitched } = useCountryDetection()

  const availableLanguages = computed(() => {
    return availableShops.value
      .filter((shop) => shop.countryCode === currentLocale.value?.region)
      .map((shop) => {
        const locale = new Intl.Locale(shop.locale)
        return {
          shop,
          code: locale.language,
          name: languageTranslator.value?.of(locale.language) ?? '',
        }
      })
  })

  const availableCountries = computed(() => {
    const grouped = Object.groupBy(
      availableShops.value,
      (shop) => shop.countryCode,
    )

    return Object.entries(grouped)
      .map(([regionCode, shops]) => ({
        name: regionTranslator.value?.of(regionCode) ?? '',
        code: regionCode,
        shops: shops as [ShopConfig, ...ShopConfig[]],
      }))
      .toSorted((a, b) =>
        a.name.localeCompare(b.name, currentShop.value.locale),
      )
  })

  const changeShop = async (path?: string, locale?: string) => {
    if (!path) {
      throw new Error('Shop has no path configured')
    }

    if (locale === currentShop.value.locale) {
      return
    }

    markShopAsSwitched()

    trackShopChange()
    if (switchToHomePage) {
      if (i18n.differentDomains) {
        // When `i18n.differentDomains` is true, `switchLocalePath()` will return a full URL.
        // We only need the origin to redirect to the home page.
        const { origin } = new URL(switchLocalePath(path as Locale))
        window.location.replace(`${origin}`)
      } else {
        // For path based shop selection, the homepage is under `/<shopPath>`. We just redirect to the passed path.
        window.location.replace(localePath('/', path as Locale))
      }
    } else {
      // When `i18n.differentDomains` is false we preserve the current path and only change the origin or shop path using `switchLocalePath()`
      const newLocalePath = switchLocalePath(path as Locale).split(
        '?',
      )[0] as string
      window.location.replace(newLocalePath)
    }
  }

  return {
    availableCountries,
    availableLanguages,
    changeShop,
  }
}
