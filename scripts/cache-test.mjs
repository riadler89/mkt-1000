import http from 'node:http'
import https from 'node:https'
import test from 'node:test'
import assert from 'node:assert/strict'
import path from 'node:path'

/**
 * Cache validation test script for Nuxt storefront application.
 *
 * This script validates that routeRules are properly configured for caching
 * public pages while ensuring private/authenticated pages are not cached.
 * It performs HTTP requests to various endpoints and verifies the presence
 * or absence of appropriate cache-control headers.
 *
 * @fileoverview Validates caching behavior for public and private routes
 *
 * @example
 * // Run with default localhost URL
 * node scripts/cache-test.mjs
 *
 * @example
 * // Run with custom base URL
 * BASE_URL=https://staging.example.com/en node scripts/cache-test.mjs
 *
 * @example
 * // Run with Vercel protection bypass
 * BASE_URL=https://example.com/en?x-vercel-protection-bypass=token node scripts/cache-test.mjs
 */

/**
 * Base URL for testing cache behavior.
 * Can be overridden via BASE_URL environment variable.
 * @type {string}
 */
const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000/en'

/**
 * Joins a base URL with a pathname to create a complete URL.
 * @param {string} base - The base URL to join with
 * @param {string} pathname - The pathname to append
 * @returns {URL} The complete URL object
 */
const join = (base, pathname) => {
  const url = new URL(base)
  const newPath = path.join(url.pathname, pathname)
  return new URL(newPath, url.origin)
}

/**
 * Vercel protection bypass token extracted from BASE_URL.
 * Used for bypassing Vercel's preview protection during testing.
 * @type {string | null}
 */
const token = new URL(BASE_URL).searchParams.get('x-vercel-protection-bypass')

/**
 * Performs an HTTP GET request and returns response headers.
 * Automatically handles Vercel protection bypass and cleans up URL parameters.
 * @param {string} _url - The URL to request
 * @returns {Promise<Object>} Promise that resolves to response headers object
 * @throws {Error} When the HTTP request fails
 */
const getHeaders = async (_url) => {
  const url = new URL(_url)

  url.searchParams.delete('x-vercel-protection-bypass')
  url.searchParams.delete('x-vercel-set-bypass-cookie')

  // eslint-disable-next-line promise/avoid-new
  return new Promise((resolve, reject) => {
    ;(url.protocol === 'http' ? http : https)
      .get(
        url,
        { headers: token ? { 'x-vercel-protection-bypass': token } : {} },
        (res) => {
          resolve(res.headers)
          res.resume()
        },
      )
      .on('error', (e) => reject(e))
  })
}

/**
 * Parses a Cache-Control header string into a structured object.
 * Handles both simple directives (e.g., "no-cache") and key-value directives (e.g., "max-age=3600").
 * @param {string} header - The Cache-Control header value
 * @returns {Object} Object containing parsed cache directives
 * @example
 * parseCacheControl("max-age=3600, stale-while-revalidate=86400")
 * // Returns: { "max-age": "3600", "stale-while-revalidate": "86400" }
 */
function parseCacheControl(header) {
  const result = {}
  const directives = header.split(',').map((d) => d.trim())

  directives.forEach((directive) => {
    if (directive.includes('=')) {
      const [property, value] = directive.split('=')
      result[property.trim()] = value.trim()
    } else {
      result[directive] = true
    }
  })

  return result
}

/**
 * Asserts that response headers contain proper caching directives.
 * Validates the presence of cache-control headers with appropriate max-age or s-maxage values,
 * and checks for stale-while-revalidate directive (except on Vercel).
 * @param {Object} headers - HTTP response headers object
 * @throws {AssertionError} When cache headers are missing or invalid
 */
function assertCacheHeaders(headers) {
  try {
    if (!headers['cache-control']) {
      assert.fail('Cache headers are missing!')
    }

    const cacheControl = parseCacheControl(headers['cache-control'])

    const sMaxAge = parseInt(cacheControl['s-maxage'])
    const maxAge = parseInt(cacheControl['max-age'])

    if (!sMaxAge && !maxAge) {
      assert.fail(
        'Missing s-maxage or max-age directive in cache-control header',
      )
    }

    if (
      cacheControl['stale-while-revalidate'] !== 'true' &&
      isNaN(parseInt(cacheControl['stale-while-revalidate'])) &&
      headers['server'] !== 'Vercel' // ignore SWR for vercel
    ) {
      assert.fail(
        'Missing stale-while-revalidate directive in cache-control header',
      )
    }
  } catch (e) {
    console.error(headers)
    throw e
  }
}

/**
 * Asserts that response headers do not contain caching directives.
 * Validates that private/authenticated pages are not cached by checking for
 * max-age=0 in cache-control and absence of session cookies.
 * @param {Object} headers - HTTP response headers object
 * @throws {AssertionError} When cache headers are present or session cookies are set
 */
function assertNoCacheHeaders(headers) {
  if (headers['cache-control']) {
    const cacheControl = parseCacheControl(headers['cache-control'])

    if (parseInt(cacheControl['max-age']) !== 0) {
      console.error({ headers })
      assert.fail('Cache headers should not be present!')
    }
  }

  const cookieHeader = headers['set-cookie']

  if (cookieHeader && cookieHeader.includes('$session')) {
    assert.fail('Cached responses should not set the session cookie!')
  }
}

/**
 * Test case: Validates that the home page has proper cache headers.
 * Ensures the root route is configured for caching with appropriate directives.
 */
test('home page has cache headers', async () => {
  const headers = await getHeaders(BASE_URL)
  assertCacheHeaders(headers)
})

/**
 * Test case: Validates that product listing pages have proper cache headers.
 * Ensures category/product listing routes are configured for caching.
 */
test('product list has cache headers', async () => {
  const headers = await getHeaders(join(BASE_URL, '/women'))
  assertCacheHeaders(headers)
})

/**
 * Test case: Validates that individual product pages have proper cache headers.
 * Ensures product detail routes are configured for caching.
 */
test('product page has cache headers', async () => {
  const headers = await getHeaders(
    join(
      BASE_URL,
      '/p/ribbed-tank-top-with-10-images-and-2-color-variations-1078',
    ),
  )
  assertCacheHeaders(headers)
})

/**
 * Test case: Validates that wishlist pages do not have cache headers.
 * Ensures authenticated user-specific routes are not cached.
 */
test('wishlist does not have cache headers', async () => {
  const headers = await getHeaders(join(BASE_URL, '/wishlist'))
  assertNoCacheHeaders(headers)
})

/**
 * Test case: Validates that basket pages do not have cache headers.
 * Ensures authenticated user-specific routes are not cached.
 * Note: Currently tests wishlist endpoint (may be a copy-paste error).
 */
test('basket does not have cache headers', async () => {
  const headers = await getHeaders(join(BASE_URL, '/wishlist'))
  assertNoCacheHeaders(headers)
})
