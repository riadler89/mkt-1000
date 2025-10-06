import type { LocaleObject } from '@nuxtjs/i18n'

type LocaleCode = LocaleObject['code']

interface ShopAndLocaleConfig {
  /** A BCP-47 format locale code (e.g. 'de-DE') */
  locale: string
  /** A unique identifying code for the shop/locale. Also used to create the shop's default path prefix. (e.g. 'de') */
  code: LocaleCode | LocaleCode[]
  /** The shopId */
  shopId: number
  /** The ISO 4217 currency code for the shop (e.g. 'EUR') */
  currency: string
  /** Flag the current shop as the default.
   * With `path` selection the default shop will be redirected to when loading the base route.
   * With `path_or_default` selection the default shop will use the base route itself */
  isDefault: boolean
  /** The file with the translations to load for the shop/locale (relative to /langs) */
  translationFile: string
  /** The country code for the shop region */
  countryCode: string
}

/**
 * List of configurations to be used to define the `shops` list for `storefront-nuxt` and `locales` for `nuxt-i18n`
 */
export const shops: [ShopAndLocaleConfig, ...ShopAndLocaleConfig[]] = [
  {
    locale: 'de-DE',
    code: 'de',
    shopId: 1918,
    currency: 'EUR',
    isDefault: true,
    translationFile: 'de_DE.json',
    countryCode: 'DE',
  },
  {
    locale: 'en-US',
    code: ['en', 'en-us'],
    shopId: 1919,
    currency: 'USD',
    isDefault: false,
    translationFile: 'en_GB.json',
    countryCode: 'US',
  },
  {
    locale: 'de-CH',
    code: 'ch',
    shopId: 1920,
    currency: 'CHF',
    isDefault: false,
    translationFile: 'de_DE.json',
    countryCode: 'CH',
  },
  {
    locale: 'de-AT',
    code: 'at',
    shopId: 1921,
    currency: 'EUR',
    isDefault: false,
    translationFile: 'de_DE.json',
    countryCode: 'AT',
  },
  {
    locale: 'en-DE',
    code: 'de-en',
    shopId: 1965,
    currency: 'EUR',
    isDefault: false,
    translationFile: 'en_GB.json',
    countryCode: 'DE',
  },
  {
    locale: 'hr-HR',
    code: 'hr',
    shopId: 2002,
    currency: 'EUR',
    isDefault: false,
    translationFile: 'en_GB.json',
    countryCode: 'HR',
  },
]
