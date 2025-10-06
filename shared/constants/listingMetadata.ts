export const BasketListingMetadata = {
  ID: 'BL',
  NAME: 'Basket List',
} as const

export const WishlistListingMetadata = {
  ID: 'WL',
  NAME: 'Wishlist List',
} as const

export const CategoryListingMetadata = {
  ID: 'CategoryProductList',
  NAME: 'Category Product List',
} as const

export const categoryListingMetaData = {
  id: CategoryListingMetadata.ID,
  name: CategoryListingMetadata.NAME,
}

export const basketListingMetaData = {
  id: BasketListingMetadata.ID,
  name: BasketListingMetadata.NAME,
}
