import { describe, expect, it } from 'vitest'
import { getQuantitySelectionList } from './quantity'

describe('getQuantitySelectionList', () => {
  it('handles various quantity ranges and edge cases', () => {
    // Basic functionality with excludeZero parameter
    expect(getQuantitySelectionList(5, false)).toEqual([0, 1, 2, 3, 4, 5])
    expect(getQuantitySelectionList(5, true)).toEqual([1, 2, 3, 4, 5])

    // Edge cases
    expect(getQuantitySelectionList(0, false)).toEqual([0])
    expect(getQuantitySelectionList(0, true)).toEqual([])
    expect(getQuantitySelectionList(1, false)).toEqual([0, 1])
    expect(getQuantitySelectionList(1, true)).toEqual([1])

    // Maximum quantity cap at 10
    expect(getQuantitySelectionList(10, false)).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    ])
    expect(getQuantitySelectionList(10, true)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    ])
    expect(getQuantitySelectionList(15, false)).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    ])
    expect(getQuantitySelectionList(100, false)).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    ])

    // Negative quantities treated as zero
    expect(getQuantitySelectionList(-5, false)).toEqual([0])
    expect(getQuantitySelectionList(-5, true)).toEqual([])
  })

  it('handles default parameters and various quantity ranges', () => {
    // Default parameters
    expect(getQuantitySelectionList()).toEqual([0])
    expect(getQuantitySelectionList(undefined, false)).toEqual([0])
    expect(getQuantitySelectionList(undefined, true)).toEqual([])
    expect(getQuantitySelectionList(3)).toEqual([0, 1, 2, 3]) // default excludeZero = false

    // Small quantities (2-4)
    expect(getQuantitySelectionList(2, false)).toEqual([0, 1, 2])
    expect(getQuantitySelectionList(3, false)).toEqual([0, 1, 2, 3])
    expect(getQuantitySelectionList(4, false)).toEqual([0, 1, 2, 3, 4])

    // Medium quantities (6-9)
    expect(getQuantitySelectionList(6, false)).toEqual([0, 1, 2, 3, 4, 5, 6])
    expect(getQuantitySelectionList(8, false)).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7, 8,
    ])
    expect(getQuantitySelectionList(9, false)).toEqual([
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    ])
  })
})
