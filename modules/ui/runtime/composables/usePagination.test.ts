// @vitest-environment nuxt
import { describe, expect, it, vi } from 'vitest'
import { usePagination } from '#storefront-ui'

const mocks = vi.hoisted(() => {
  return {
    route: { query: {}, path: '/' },
  }
})

vi.mock('#app/composables/router', () => ({
  useRoute: vi.fn().mockReturnValue(mocks.route),
}))

describe('usePagination', () => {
  it('should have no limited list of pages', () => {
    const { limitedPages } = usePagination(6, 6)

    expect(limitedPages.value).toStrictEqual([
      { number: 1, to: { path: '/', query: {} }, isActive: true },
      { number: 2, to: { path: '/', query: { page: '2' } }, isActive: false },
      { number: 3, to: { path: '/', query: { page: '3' } }, isActive: false },
      { number: 4, to: { path: '/', query: { page: '4' } }, isActive: false },
      { number: 5, to: { path: '/', query: { page: '5' } }, isActive: false },
      { number: 6, to: { path: '/', query: { page: '6' } }, isActive: false },
    ])
  })

  /**
   * Verifies visible page numbers and ellipsis display for various current pages.
   * Total page count configured is `8`.

   *
   * Test Data:
   * [
   *   <currentPageNumber>,          // Current page number
   *   <expectedPages>,              // Expected visible page numbers and states
   *   <expectedShowFirstDots>,      // Should show first ellipsis
   *   <expectedShowSecondDots>,     // Should show second ellipsis
   * ]
   *
   * Asserts `limitedPages`, `showFirstDots`, and `showSecondDots` against expected values.
   */
  it.each([
    [
      '1',
      [
        { number: 2, to: { path: '/', query: { page: '2' } }, isActive: false },
        { number: 3, to: { path: '/', query: { page: '3' } }, isActive: false },
      ],
      false,
      true,
    ],
    [
      '2',
      [
        { number: 2, to: { path: '/', query: { page: '2' } }, isActive: true },
        { number: 3, to: { path: '/', query: { page: '3' } }, isActive: false },
      ],
      false,
      true,
    ],
    [
      '3',
      [
        { number: 2, to: { path: '/', query: { page: '2' } }, isActive: false },
        { number: 3, to: { path: '/', query: { page: '3' } }, isActive: true },
        { number: 4, to: { path: '/', query: { page: '4' } }, isActive: false },
      ],
      false,
      true,
    ],
    [
      '4',
      [
        { number: 3, to: { path: '/', query: { page: '3' } }, isActive: false },
        { number: 4, to: { path: '/', query: { page: '4' } }, isActive: true },
        { number: 5, to: { path: '/', query: { page: '5' } }, isActive: false },
      ],
      true,
      true,
    ],
    [
      '5',
      [
        { number: 4, to: { path: '/', query: { page: '4' } }, isActive: false },
        { number: 5, to: { path: '/', query: { page: '5' } }, isActive: true },
        { number: 6, to: { path: '/', query: { page: '6' } }, isActive: false },
      ],
      true,
      true,
    ],
    [
      '6',
      [
        { number: 5, to: { path: '/', query: { page: '5' } }, isActive: false },
        { number: 6, to: { path: '/', query: { page: '6' } }, isActive: true },
        { number: 7, to: { path: '/', query: { page: '7' } }, isActive: false },
      ],
      true,
      false,
    ],
    [
      '7',
      [
        { number: 6, to: { path: '/', query: { page: '6' } }, isActive: false },
        { number: 7, to: { path: '/', query: { page: '7' } }, isActive: true },
      ],
      true,
      false,
    ],
    [
      '8',
      [
        { number: 6, to: { path: '/', query: { page: '6' } }, isActive: false },
        { number: 7, to: { path: '/', query: { page: '7' } }, isActive: false },
      ],
      true,
      false,
    ],
    [
      '2.0',
      [
        { number: 2, to: { path: '/', query: { page: '2' } }, isActive: true },
        { number: 3, to: { path: '/', query: { page: '3' } }, isActive: false },
      ],
      false,
      true,
    ],
  ])(
    'should show correct limited pages for page %s',
    (page, expectedPages, expectedShowFirstDots, expectedShowSecondDots) => {
      mocks.route.query = { page }

      const { limitedPages, areSecondDotsShown, areFirstDotsShown } =
        usePagination(6, 8)

      expect(areFirstDotsShown.value).toBe(expectedShowFirstDots)
      expect(areSecondDotsShown.value).toBe(expectedShowSecondDots)
      expect(limitedPages.value).toStrictEqual(expectedPages)
    },
  )

  it('should allow navigating left', () => {
    mocks.route.query = { page: '2' }

    const { canNavigateLeft } = usePagination(6, 10)
    expect(canNavigateLeft.value).toBeTruthy()
  })

  it('should not allow navigating left', () => {
    mocks.route.query = { page: '1' }

    const { canNavigateLeft } = usePagination(6, 10)
    expect(canNavigateLeft.value).toBeFalsy()
  })
  it('should allow navigating right', () => {
    mocks.route.query = { page: '9' }

    const { canNavigateRight } = usePagination(6, 10)
    expect(canNavigateRight.value).toBeTruthy()
  })
  it('should not allow navigating right', () => {
    mocks.route.query = { page: '10' }

    const { canNavigateRight } = usePagination(6, 10)
    expect(canNavigateRight.value).toBeFalsy()
  })

  it('should have correct next and previous page', () => {
    mocks.route.query = { page: '8' }

    const { nextPage, previousPage } = usePagination(6, 10)
    expect(nextPage.value).toStrictEqual({
      number: 9,
      to: { path: '/', query: { page: '9' } },
      isActive: false,
    })
    expect(previousPage.value).toStrictEqual({
      number: 7,
      to: { path: '/', query: { page: '7' } },
      isActive: false,
    })
  })
  it.each([
    [
      '-1',
      [
        { number: 2, to: { path: '/', query: { page: '2' } }, isActive: false },
        { number: 3, to: { path: '/', query: { page: '3' } }, isActive: false },
      ],
    ],
    [
      '0',
      [
        { number: 2, to: { path: '/', query: { page: '2' } }, isActive: false },
        { number: 3, to: { path: '/', query: { page: '3' } }, isActive: false },
      ],
    ],
    [
      'x',
      [
        { number: 2, to: { path: '/', query: { page: '2' } }, isActive: false },
        { number: 3, to: { path: '/', query: { page: '3' } }, isActive: false },
      ],
    ],
    [
      '2.5',
      [
        { number: 2, to: { path: '/', query: { page: '2' } }, isActive: false },
        { number: 3, to: { path: '/', query: { page: '3' } }, isActive: false },
      ],
    ],
  ])('%s should fallback to first page', (page, expectedPages) => {
    mocks.route.query = { page }

    const { limitedPages, firstPage } = usePagination(1, 3)
    expect(limitedPages.value).toStrictEqual(expectedPages)
    expect(firstPage.value).toStrictEqual({
      number: 1,
      to: { path: '/', query: {} },
      isActive: true,
    })
  })
})
