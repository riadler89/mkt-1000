export const deepClone = <T>(data: T): T => JSON.parse(JSON.stringify(data))

export const isEqual = <T>(x: T, y: T): boolean => {
  if (Object.is(x, y)) {
    return true
  }

  // Depending on object structure, checks for Date & RegEx can be removed
  if (x instanceof Date && y instanceof Date) {
    return x.getTime() === y.getTime()
  }
  if (x instanceof RegExp && y instanceof RegExp) {
    return x.toString() === y.toString()
  }

  // For non-objects or null, use strict equality
  if (
    typeof x !== 'object' ||
    x === null ||
    typeof y !== 'object' ||
    y === null
  ) {
    return x === y
  }

  // Compare objects
  const keys = Object.keys(x) as (keyof T)[]
  return (
    keys.length === Object.keys(y).length &&
    keys.every((key) => Reflect.has(y, key) && isEqual(x[key], y[key]))
  )
}
