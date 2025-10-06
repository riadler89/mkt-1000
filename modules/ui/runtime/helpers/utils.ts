export const showDividerTag = (index: number, arrayLength: number): boolean => {
  return index >= 0 && arrayLength > 1 && index < arrayLength - 1
}

/**
 * Get the number of decimal places a currency uses in its standard representation
 * @param currencyCode - The ISO-4217 currency code
 * @returns the number of decimal places
 */
export function getDecimalPlacesForCurrency(currencyCode: string) {
  const parts = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
  }).formatToParts(0)

  const fraction = parts.find((p) => p.type === 'fraction')

  if (!fraction) {
    return 0
  }

  return fraction.value.length
}

/**
 * Round a number down to the next interval
 * @param value - the number to round
 * @param interval - the interval to round to
 * @returns the rounded number
 */
export function roundDown(value: number, interval: number) {
  if (isNaN(interval) || !interval) {
    return NaN
  }
  const div = value / interval
  return Math.floor(div) * interval
}

/**
 * Round a number down to the next interval
 * @param value - the number to round
 * @param interval - the interval to round to
 * @returns the rounded number
 */
export function roundUp(value: number, interval: number) {
  if (isNaN(interval) || !interval) {
    return NaN
  }
  const div = value / interval
  return Math.ceil(div) * interval
}
