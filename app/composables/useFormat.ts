import { useCurrentShop } from '#storefront/composables'

export function useFormat() {
  const currentShop = useCurrentShop()

  const formatterKm = new Intl.NumberFormat(
    currentShop.value.locale ?? 'en-GB',
    {
      maximumFractionDigits: 1,
      style: 'unit',
      unit: 'kilometer',
    },
  )

  const formatterMeter = new Intl.NumberFormat(
    currentShop.value.locale ?? 'en-GB',
    {
      maximumSignificantDigits: 3,
      style: 'unit',
      unit: 'meter',
    },
  )

  const formatterDate = new Intl.DateTimeFormat(currentShop.value.locale, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  })

  /**
   * Format a Date object in a numeric format according to the current shop's locale
   * e.g. 25.12.2024 (DE), 25/12/2024 (UK), 12/25/2024 (US)
   * @param date The Date object to be formatted
   * @returns
   */
  const formatDate = (date: Date): string | undefined => {
    if (!date || isNaN(date.valueOf())) {
      return undefined
    }

    return formatterDate.format(date)
  }

  /**
   * Format a distance according to the current shop's locale
   * Uses meters for short distances (<1000) and kilometers for longer distances
   *
   * @param distance The distance to be formatted in meters
   * @returns
   */
  const formatDistance = (distance: number): string | undefined => {
    if (isNaN(distance)) {
      return undefined
    }

    return distance < 1000
      ? formatterMeter.format(distance)
      : formatterKm.format(distance / 1000)
  }

  return {
    formatDate,
    formatDistance,
  }
}
