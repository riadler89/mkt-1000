import { describe, expect, it } from 'vitest'
import { normalizeURLPath } from './redirectTrailingSlash.global'

describe('normalizeURLPath', () => {
  it('should remove trailing slashes from a URL path', () => {
    expect(normalizeURLPath('/en/c/some-category-12345///')).toBe(
      '/en/c/some-category-12345',
    )
  })

  it('should return a single slash for a path with only slashes', () => {
    expect(normalizeURLPath('///')).toBe('/')
  })

  it('should not modify a path without trailing slashes', () => {
    expect(normalizeURLPath('/en/c/some-category-12345')).toBe(
      '/en/c/some-category-12345',
    )
  })

  it('should handle an empty path', () => {
    expect(normalizeURLPath('')).toBe('/')
  })
})
