import type { LocaleObject } from "@nuxtjs/i18n";

type LocaleCode = LocaleObject['code']

/**
 * Configuration for a shop and its locale settings.
 *
 * @typedef ShopAndLocaleConfig
 * @property locale - A BCP-47 format locale code (e.g. 'de-DE').
 * @property code - A unique identifying code for the shop/locale.
 *   Also used to create the shop's default path prefix (e.g. 'de').
 * @property shopId - The shop's unique identifier.
 * @property currency - The ISO 4217 currency code for the shop (e.g. 'EUR').
 * @property isDefault - Flags the current shop as the default.
 *   - With `path` selection, the default shop will be redirected to when loading the base route.
 *   - With `path_or_default` selection, the default shop will use the base route itself.
 * @property translationFile - The file with the translations to load for the shop/locale (relative to /langs).
 */
interface ShopAndLocaleConfig {
  locale: string
  code: LocaleCode | LocaleCode[]
  shopId: number
  currency: string
  isDefault: boolean
  translationFile: string
  countryCode: string
}

/**
 * List of configurations to be used to define the `shops` list for `storefront-nuxt` and `locales` for `nuxt-i18n`
 */
export const shops: ShopAndLocaleConfig[] = [
  {
    locale: "en-GB",
    code: "gb",
    shopId: 1001,
    currency: "GBP",
    isDefault: true,
    translationFile: "en_GB.json",
    countryCode: "GB"
  },
  {
    locale: "en-US",
    code: "us",
    shopId: 1002,
    currency: "USD",
    isDefault: false,
    translationFile: "en_US.json",
    countryCode: "US"
  },
  {
    locale: "de-DE",
    code: "de",
    shopId: 1003,
    currency: "EUR",
    isDefault: false,
    translationFile: "de_DE.json",
    countryCode: "DE"
  },
  {
    locale: "sv-SE",
    code: "se",
    shopId: 1004,
    currency: "SEK",
    isDefault: false,
    translationFile: "sv_SE.json",
    countryCode: "SE"
  },
  {
    locale: "es-ES",
    code: "es",
    shopId: 1005,
    currency: "EUR",
    isDefault: false,
    translationFile: "es_ES.json",
    countryCode: "ES"
  },
  {
    locale: "fr-FR",
    code: "fr",
    shopId: 1008,
    currency: "EUR",
    isDefault: false,
    translationFile: "fr_FR.json",
    countryCode: "FR"
  },
  {
    locale: "en-GB",
    code: "aa",
    shopId: 1017,
    currency: "EUR",
    isDefault: false,
    translationFile: "en_GB.json",
    countryCode: "AA"
  },
  {
    locale: "es-MX",
    code: "mx",
    shopId: 1018,
    currency: "MXN",
    isDefault: false,
    translationFile: "es_MX.json",
    countryCode: "MX"
  },
  {
    locale: "en-CA",
    code: "ca",
    shopId: 1019,
    currency: "CAD",
    isDefault: false,
    translationFile: "en_CA.json",
    countryCode: "CA"
  },
  {
    locale: "ko-KR",
    code: "kr",
    shopId: 1020,
    currency: "KRW",
    isDefault: false,
    translationFile: "ko_KR.json",
    countryCode: "KR"
  },
  {
    locale: "pt-PT",
    code: "pt",
    shopId: 1022,
    currency: "EUR",
    isDefault: false,
    translationFile: "pt_PT.json",
    countryCode: "PT"
  },
  {
    locale: "it-CH",
    code: "it-ch",
    shopId: 1023,
    currency: "CHF",
    isDefault: false,
    translationFile: "it_CH.json",
    countryCode: "CH"
  },
  {
    locale: "fr-CH",
    code: "fr-ch",
    shopId: 1024,
    currency: "CHF",
    isDefault: false,
    translationFile: "fr_CH.json",
    countryCode: "CH"
  },
  {
    locale: "de-CH",
    code: "de-ch",
    shopId: 1025,
    currency: "CHF",
    isDefault: false,
    translationFile: "de_CH.json",
    countryCode: "CH"
  }
]