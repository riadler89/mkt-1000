export const getQuantitySelectionList = (quantity = 0, excludeZero = false) => {
  const length = Math.max(Math.min(quantity, 10), 0)

  const quantityListWithoutZero = Array.from(
    { length },
    (_, index) => index + 1,
  )

  return excludeZero ? quantityListWithoutZero : [0, ...quantityListWithoutZero]
}
