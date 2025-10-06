import { describe, expect, it } from 'vitest'
import {
  showDividerTag,
  getDecimalPlacesForCurrency,
  roundDown,
  roundUp,
} from './utils'

describe('showDividerTag', () => {
  it('should return "true" for first item in the array', () => {
    const isDividerTagShown = showDividerTag(0, 4)

    expect(isDividerTagShown).toEqual(true)
  })

  it('should return "false" for last item in the array', () => {
    const isDividerTagShown = showDividerTag(4, 4)

    expect(isDividerTagShown).toEqual(false)
  })
})

describe('getDecimalPlacesForCurrency', () => {
  it('should return the correct number of decimal places', () => {
    expect(getDecimalPlacesForCurrency('USD')).toEqual(2)
    expect(getDecimalPlacesForCurrency('GBP')).toEqual(2)
    expect(getDecimalPlacesForCurrency('EUR')).toEqual(2)
    expect(getDecimalPlacesForCurrency('JOD')).toEqual(3)
    expect(getDecimalPlacesForCurrency('JPY')).toEqual(0)
    expect(getDecimalPlacesForCurrency('ISK')).toEqual(0)
  })
})

describe('roundDown', () => {
  it('should round down the correct amount', () => {
    expect(roundDown(7, 5)).toEqual(5)
    expect(roundDown(9, 5)).toEqual(5)
    expect(roundDown(22.22, 4)).toEqual(20)
    expect(roundDown(100101, 100)).toEqual(100100)
    expect(roundDown(-17, 4)).toEqual(-20)
    expect(roundDown(10, 10)).toEqual(10)
    expect(roundDown(10, 0)).toEqual(NaN)
    expect(roundDown(10, NaN)).toEqual(NaN)
  })
})

describe('roundUp', () => {
  it('should round up the correct amount', () => {
    expect(roundUp(7, 5)).toEqual(10)
    expect(roundUp(9, 5)).toEqual(10)
    expect(roundUp(22.22, 4)).toEqual(24)
    expect(roundUp(100101, 100)).toEqual(100200)
    expect(roundUp(-17, 4)).toEqual(-16)
    expect(roundUp(10, 10)).toEqual(10)
    expect(roundUp(10, 0)).toEqual(NaN)
    expect(roundUp(10, NaN)).toEqual(NaN)
  })
})
