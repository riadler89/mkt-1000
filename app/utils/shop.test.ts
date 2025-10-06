import { it, describe, expect } from 'vitest'
import { getShopName, hasMultipleShopsForCountry } from './shop'

describe('getShopName', () => {
  it('returns localized country names with and without language codes', () => {
    // Basic functionality
    expect(getShopName('en-DE')).toBe('Germany')
    expect(getShopName('de-DE')).toBe('Deutschland')
    expect(getShopName('en-US')).toBe('United States')
    expect(getShopName('de-CH')).toBe('Schweiz')

    // With language code
    expect(getShopName('en-DE', true)).toBe('Germany | EN')
    expect(getShopName('de-DE', true)).toBe('Deutschland | DE')
    expect(getShopName('de-CH', true)).toBe('Schweiz | DE')

    // Default behavior (includeLanguage = false)
    expect(getShopName('de-DE')).toBe('Deutschland')
  })

  it('handles various international locales and edge cases', () => {
    // International locales
    expect(getShopName('fr-FR')).toBe('France')
    expect(getShopName('it-IT')).toBe('Italia')
    expect(getShopName('ja-JP')).toBe('日本')
    expect(getShopName('zh-CN')).toBe('中国')

    // Edge case region codes
    expect(getShopName('en-GB')).toBe('United Kingdom')
    expect(getShopName('en-AU')).toBe('Australia')
    expect(getShopName('en-CA')).toBe('Canada')

    // Non-standard but valid locale formats
    expect(getShopName('en-150')).toBe('Europe') // UN M.49 region code
    expect(getShopName('en-419')).toBe('Latin America') // UN M.49 region code
  })

  it('handles malformed and invalid locale strings', () => {
    // Invalid formats should throw
    expect(() => getShopName('en')).toThrow() // Missing region
    expect(() => getShopName('')).toThrow() // Empty string
    expect(() => getShopName('invalid-locale-format')).toThrow()
    expect(() => getShopName('en-')).toThrow()
    expect(() => getShopName('-DE')).toThrow()
    expect(() => getShopName('en-DE@')).toThrow() // Special characters
    expect(() => getShopName('en-DE ')).toThrow() // Whitespace
  })
})

describe('hasMultipleShopsForCountry', () => {
  it('detects multiple shops for the same country and handles various scenarios', () => {
    // Basic functionality
    expect(
      hasMultipleShopsForCountry([
        { locale: 'en-DE' },
        { locale: 'de-DE' },
        { locale: 'en-US' },
      ]),
    ).toBe(true)

    expect(
      hasMultipleShopsForCountry([
        { locale: 'en-DE' },
        { locale: 'en-US' },
        { locale: 'de-CH' },
      ]),
    ).toBe(false)

    // Edge cases
    expect(hasMultipleShopsForCountry([])).toBe(false)
    expect(hasMultipleShopsForCountry([{ locale: 'en-DE' }])).toBe(false)

    // Multiple duplicates
    expect(
      hasMultipleShopsForCountry([
        { locale: 'en-DE' },
        { locale: 'de-DE' },
        { locale: 'fr-DE' },
        { locale: 'en-US' },
      ]),
    ).toBe(true)

    // Identical locales
    expect(
      hasMultipleShopsForCountry([{ locale: 'en-DE' }, { locale: 'en-DE' }]),
    ).toBe(true)
  })

  it('handles malformed locales and edge cases gracefully', () => {
    // Mixed valid and invalid locales
    expect(
      hasMultipleShopsForCountry([
        { locale: 'en-DE' },
        { locale: 'invalid-locale' },
        { locale: 'de-DE' },
      ]),
    ).toBe(true) // DE appears twice

    // Empty locale strings
    expect(
      hasMultipleShopsForCountry([
        { locale: 'en-DE' },
        { locale: '' },
        { locale: 'de-DE' },
      ]),
    ).toBe(true) // DE appears twice

    // Locales with only language codes
    expect(
      hasMultipleShopsForCountry([{ locale: 'en' }, { locale: 'de' }]),
    ).toBe(true) // Both have undefined country code

    // Case sensitivity
    expect(
      hasMultipleShopsForCountry([{ locale: 'en-DE' }, { locale: 'EN-DE' }]),
    ).toBe(true)

    // Special characters and whitespace
    expect(
      hasMultipleShopsForCountry([{ locale: 'en-DE' }, { locale: 'de-DE@' }]),
    ).toBe(false) // DE vs DE@ are different

    expect(
      hasMultipleShopsForCountry([{ locale: 'en-DE' }, { locale: 'de-DE ' }]),
    ).toBe(false) // DE vs DE  are different
  })

  it('handles performance with large datasets', () => {
    // Large array with duplicates
    const largeShopArray = Array.from({ length: 1000 }, (_, i) => ({
      locale: i % 2 === 0 ? 'en-DE' : 'de-DE',
    }))
    expect(hasMultipleShopsForCountry(largeShopArray)).toBe(true)

    // Large array with unique countries
    const uniqueShopArray = Array.from({ length: 10 }, (_, i) => ({
      locale: `en-${String.fromCharCode(65 + (i % 26))}${String.fromCharCode(
        65 + ((i + 1) % 26),
      )}`,
    }))
    expect(hasMultipleShopsForCountry(uniqueShopArray)).toBe(false)
  })
})
