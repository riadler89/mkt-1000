import { it, describe, expect } from 'vitest'
import {
  normalizePathRoute,
  hasLocalePrefix,
  isExternalLink,
  getProtectedRouteList,
  routeList,
  getCategoryId,
  getProductId,
} from './route'

describe('normalizePathRoute', () => {
  it('handles various path formats and edge cases', () => {
    // Add leading slash to paths without one
    expect(normalizePathRoute('women/clothing-2')).toEqual('/women/clothing-2')
    expect(normalizePathRoute('a')).toEqual('/a')
    expect(normalizePathRoute('')).toEqual('/')

    // Leave already normalized paths unchanged
    expect(normalizePathRoute('/women/clothing-2')).toEqual('/women/clothing-2')
    expect(normalizePathRoute('/')).toEqual('/')
    expect(normalizePathRoute('/women/clothing-2/')).toEqual(
      '/women/clothing-2/',
    )

    // Preserve query parameters and hash fragments
    expect(normalizePathRoute('women/clothing-2?color=red')).toEqual(
      '/women/clothing-2?color=red',
    )
    expect(normalizePathRoute('women/clothing-2#section1')).toEqual(
      '/women/clothing-2#section1',
    )
    expect(normalizePathRoute('women/clothing-2?color=red#section1')).toEqual(
      '/women/clothing-2?color=red#section1',
    )
  })
})

describe('hasLocalePrefix', () => {
  it('returns true when locale prefix matches', () => {
    expect(hasLocalePrefix('de/women/clothing-2', 'de')).toEqual(true)
    expect(hasLocalePrefix('/de', 'de')).toEqual(true)
    expect(hasLocalePrefix('de-DE/women/clothing-2', 'de-DE')).toEqual(true)
  })

  it('returns false when locale prefix does not match or is missing', () => {
    expect(hasLocalePrefix('/women/clothing-2')).toEqual(false)
    expect(hasLocalePrefix('en/women/clothing-2', 'de')).toEqual(false)
    expect(hasLocalePrefix('de/women/clothing-2', '')).toEqual(false)
  })

  it('preserves query parameters and hash fragments', () => {
    expect(hasLocalePrefix('de/women/clothing-2?color=red', 'de')).toEqual(true)
    expect(hasLocalePrefix('de/women/clothing-2#section1', 'de')).toEqual(true)
  })
})

describe('isExternalLink', () => {
  it('returns true for http/https links', () => {
    expect(isExternalLink('http://example.com')).toEqual(true)
    expect(isExternalLink('https://example.com')).toEqual(true)
    expect(isExternalLink('https://www.example.com')).toEqual(true)
    expect(
      isExternalLink('https://example.com/path?param=value#section'),
    ).toEqual(true)
  })

  it('returns false for relative links and non-http protocols', () => {
    expect(isExternalLink('/women/clothing')).toEqual(false)
    expect(isExternalLink('women/clothing')).toEqual(false)
    expect(isExternalLink('#section1')).toEqual(false)
    expect(isExternalLink('ftp://example.com')).toEqual(false)
    expect(isExternalLink('mailto:test@example.com')).toEqual(false)
  })
})

describe('getProtectedRouteList', () => {
  it('returns all protected routes by default', () => {
    const protectedRoutes = getProtectedRouteList()
    expect(protectedRoutes).toHaveLength(6)
    expect(protectedRoutes.every((route) => route.isProtected)).toBe(true)
    expect(protectedRoutes.map((route) => route.name)).toContain('account')
    expect(protectedRoutes.map((route) => route.name)).toContain(
      'account-profile',
    )
  })

  it('excludes specified route when provided', () => {
    const routesWithoutAccount = getProtectedRouteList('account')
    expect(routesWithoutAccount).toHaveLength(5)
    expect(
      routesWithoutAccount.find((route) => route.name === 'account'),
    ).toBeUndefined()
  })
})

describe('routeList', () => {
  it('has correct structure and contains all expected routes', () => {
    const expectedKeys = [
      'home',
      'search',
      'wishlist',
      'category',
      'pdp',
      'osp',
      'location',
      'basket',
      'signin',
      'signinCallback',
      'signup',
      'checkout',
      'profile',
      'account',
      'orders',
      'orderDetail',
      'subscriptionOverview',
      'subscriptionCancellations',
    ]

    expectedKeys.forEach((key) => {
      expect(routeList).toHaveProperty(key)
      const route = routeList[key as keyof typeof routeList]
      expect(route).toHaveProperty('name')
      expect(route).toHaveProperty('path')
      expect(typeof route.name).toBe('string')
      expect(typeof route.path).toBe('string')
    })
  })

  it('has correct protected routes and special configurations', () => {
    const protectedRoutes = Object.values(routeList).filter(
      (route) => route.isProtected,
    )
    expect(protectedRoutes).toHaveLength(6)
    expect(protectedRoutes.map((route) => route.name)).toContain('account')
    expect(routeList.signup.query).toEqual({ register: 'true' })
  })

  it('has correct key paths', () => {
    expect(routeList.home.path).toBe('/')
    expect(routeList.search.path).toBe('/search')
    expect(routeList.category.path).toBe('/c')
    expect(routeList.pdp.path).toBe('/p')
    expect(routeList.account.path).toBe('/account')
  })
})

describe('getCategoryId', () => {
  it('extracts category ID from route params', () => {
    expect(getCategoryId({ id: '123' })).toBe(123)
    expect(getCategoryId({ id: ['456'] })).toBe(456)
    expect(getCategoryId({ id: '789' })).toBe(789)
  })

  it('handles edge cases', () => {
    expect(getCategoryId({ id: '0' })).toBe(0)
    expect(getCategoryId({ id: '-1' })).toBe(-1)
    expect(getCategoryId({ id: 'abc' })).toBeNaN()
  })
})

describe('getProductId', () => {
  it('extracts product ID from route params', () => {
    expect(getProductId({ id: '123' })).toBe(123)
    expect(getProductId({ id: ['456'] })).toBe(456)
    expect(getProductId({ id: '789' })).toBe(789)
  })

  it('handles edge cases', () => {
    expect(getProductId({ id: '0' })).toBe(0)
    expect(getProductId({ id: '-1' })).toBe(-1)
    expect(getProductId({ id: 'abc' })).toBeNaN()
  })
})
