import type { OrderAddress } from '~~/types/order'

export function getFormattedLocaleAddresses({
  countryCode,
  recipient,
  houseNumber,
  city,
  street,
  zipCode,
  additional,
  state,
}: OrderAddress): string[] {
  const fullName = `${recipient.firstName} ${recipient.lastName}`

  const localeAddresses = [fullName]
  if (countryCode === 'USA') {
    localeAddresses.push(
      `${houseNumber} ${street}`,
      `${city}, ${state} ${zipCode}`,
    )
  } else if (countryCode === 'GBR') {
    localeAddresses.push(`${houseNumber} ${street}`, `${city} ${zipCode}`)
  } else {
    localeAddresses.push(`${street} ${houseNumber}`, `${zipCode} ${city}`)
  }

  return additional ? [...localeAddresses, additional] : localeAddresses
}
