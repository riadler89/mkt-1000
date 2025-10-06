import type { PublicShopConfig } from '@scayle/storefront-nuxt'

/**
 * Get a string that describes a shop based on its locale.
 * It will include the shop's region, translated to the shop's language
 * and optionally the shop's language as well.
 *
 * @param locale the locale of the shop
 * @param includeLanguage whether to include the language in the name
 * @returns the name of the shop
 */
export function getShopName(
  locale: string,
  includeLanguage: boolean = false,
): string | undefined {
  const [languageCode, regionCode] = locale.split('-') as [string, string]

  const region = new Intl.DisplayNames([locale], {
    type: 'region',
  }).of(regionCode)

  return includeLanguage ? `${region} | ${languageCode.toUpperCase()}` : region
}

/**
 * Determine if there are multiple shops with the same country/region
 *
 * @param shops the list of shops to check
 * @returns true if there is a shop which shares its country/region with another shop. Otherwise, false.
 */
export function hasMultipleShopsForCountry(
  shops: Pick<PublicShopConfig, 'locale'>[],
): boolean {
  const counts = shops.reduce(
    (acc, shop) => {
      const [, countryCode] = shop.locale.split('-') as [string, string]
      acc[countryCode] = (acc[countryCode] ?? 0) + 1

      return acc
    },
    {} as Record<string, number>,
  )

  return Object.values(counts).some((count) => count > 1)
}
