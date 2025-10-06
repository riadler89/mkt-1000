import type { Value } from '@scayle/storefront-nuxt'
import { it, describe } from 'vitest'
import { formatColors } from './color'

// Helper function to create Value objects for testing
const createValue = (label: string, overrides: Partial<Value> = {}): Value => ({
  id: 1,
  label,
  value: label.toLowerCase().replace(/\s+/g, '-'),
  ...overrides,
})

describe('formatColors', () => {
  it('returns formatted colors for multiple colors', ({ expect }) => {
    const colorAttributes: Value[] = [
      createValue('Weiß'),
      createValue('Rot'),
      createValue('Blau'),
    ]
    const colors = formatColors(colorAttributes)
    expect(colors).toEqual('Weiß, Rot & Blau')
  })

  it('returns single formatted color if one color is provided', ({
    expect,
  }) => {
    const colorAttributes: Value[] = [createValue('Weiß')]
    const colors = formatColors(colorAttributes)
    expect(colors).toEqual('Weiß')
  })

  it('returns an empty string when colors are not provided', ({ expect }) => {
    const colors = formatColors()
    expect(colors).toEqual('')
  })

  it('returns an empty string when empty array is provided', ({ expect }) => {
    const colors = formatColors([])
    expect(colors).toEqual('')
  })

  it('handles two colors correctly', ({ expect }) => {
    const colorAttributes: Value[] = [createValue('Red'), createValue('Blue')]
    const colors = formatColors(colorAttributes)
    expect(colors).toEqual('Red & Blue')
  })

  it('handles many colors correctly', ({ expect }) => {
    const colorAttributes: Value[] = [
      createValue('Red'),
      createValue('Green'),
      createValue('Blue'),
      createValue('Yellow'),
      createValue('Purple'),
    ]
    const colors = formatColors(colorAttributes)
    expect(colors).toEqual('Red, Green, Blue, Yellow & Purple')
  })

  it('handles colors with special characters and spaces', ({ expect }) => {
    const colorAttributes: Value[] = [
      createValue('Dark Blue'),
      createValue('Light-Green'),
      createValue('Red/White'),
    ]
    const colors = formatColors(colorAttributes)
    expect(colors).toEqual('Dark Blue, Light-Green & Red/White')
  })

  it('handles colors with empty or undefined labels gracefully', ({
    expect,
  }) => {
    const colorAttributes: Value[] = [
      createValue('Red'),
      { id: 2, label: '', value: 'empty' },
      createValue('Blue'),
    ]
    const colors = formatColors(colorAttributes)
    expect(colors).toEqual('Red,  & Blue')
  })

  it('handles single color with empty label', ({ expect }) => {
    const colorAttributes: Value[] = [{ id: 1, label: '', value: 'empty' }]
    const colors = formatColors(colorAttributes)
    expect(colors).toEqual('')
  })
})
