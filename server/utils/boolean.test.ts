import { describe, expect, it } from 'vitest'
import { stringToBoolean } from './boolean'

describe('stringToBoolean', () => {
  it('should return boolean true if string true is passed', () => {
    expect(stringToBoolean('true')).toBe(true)
  })

  it('should return boolean true if string all uppercase TRUE is passed', () => {
    expect(stringToBoolean('TRUE')).toBe(true)
  })

  it('should return boolean false if string false is passed', () => {
    expect(stringToBoolean('false')).toBe(false)
  })

  it('should return boolean false if string all uppercase FALSE is passed', () => {
    expect(stringToBoolean('FALSE')).toBe(false)
  })

  it('should return boolean false if passed value is undefined', () => {
    expect(stringToBoolean(undefined)).toBe(false)
  })

  it('should return boolean true if passed value is undefined and default set to true', () => {
    expect(stringToBoolean(undefined, true)).toBe(true)
  })

  it('should return boolean false if string false is passed and default set to true', () => {
    expect(stringToBoolean('false', true)).toBe(false)
  })
})
