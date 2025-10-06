import type { Value } from '@scayle/storefront-nuxt'

export const formatColors = (colors: Value[] = []): string => {
  if (!colors.length) {
    return ''
  }
  const colorLabels = colors.map((color) => color.label)
  if (colorLabels.length === 1) {
    return colorLabels[0] as string
  }
  const lastColorLabel = colorLabels.at(-1)
  const restColorLabels = colorLabels.slice(0, -1)
  return `${restColorLabels.join(', ')} & ${lastColorLabel}`
}
