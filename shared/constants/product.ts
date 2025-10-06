export const ProductsPerRow = {
  MOBILE: 2,
  TABLET: 3,
  DESKTOP: 4,
} as const

export const PRODUCT_CARD_IMAGE_EAGER_LOAD_SIZE = 8
export const PRODUCT_CARD_SKELETON_LOADERS_SIZE = 20
export const PRODUCT_CARD_SIBLINGS_LIMIT = 4
export const FETCH_PRODUCTS_CACHE_TTL = 1000
export const PRODUCTS_PER_PAGE = 24
export const PRODUCT_IMAGE_QUALITY_MODIFIER = '75'

export const productListingMetaData = {
  name: 'PDP',
  id: 'PDP',
} as const

export const ProductColor: Record<string, string | string[]> = {
  weiss_1: '#ffffff',
  beige: '#e3dad1',
  schwarz: '#000000',
  grau: '#6b7280',
  rot: '#ef4444',
  blau: '#3b82f6',
  gruen: '#22c55e',
  gelb: '#eab308',
  orange: '#f97316',
  braun: '#bfa094',
  pink: '#ec4899',
  lila: '#a855f7',
  mischfarben: ['#0000ff', '#ffa500', '#ff0000', '#008000'],
}
