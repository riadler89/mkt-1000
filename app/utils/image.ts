import { getAttributeValue, type ProductImage } from '@scayle/storefront-nuxt'

export const getPrimaryImage = (
  images: ProductImage[],
  preferredPrimaryImageType?: string,
) => {
  if (preferredPrimaryImageType) {
    const imageByType = images.find(
      (img) => getImageType(img) === preferredPrimaryImageType,
    )
    if (imageByType) {
      return imageByType
    }
  }
  return images.find((img) => isPrimaryImage(img)) ?? images[0]
}

const isPrimaryImage = (image: ProductImage) => {
  return 'primaryImage' in (image.attributes ?? {})
}

const getImageType = (image: ProductImage) => {
  if (!('primaryImageType' in (image.attributes ?? {}))) {
    return undefined
  }
  return getAttributeValue(image.attributes, 'primaryImageType')
}

export const sortProductImages = (
  images: ProductImage[],
  preferredPrimaryImageType?: string,
) => {
  return images.toSorted((imageA, imageB) => {
    const isImageAPrimary = isPrimaryImage(imageA)
    const imageTypeA = getImageType(imageA)
    const isImageBPrimary = isPrimaryImage(imageB)
    const imageTypeB = getImageType(imageB)

    // If primaryImageType is provided, prioritize images with matching type
    if (preferredPrimaryImageType) {
      const aIsType = imageTypeA === preferredPrimaryImageType
      const bIsType = imageTypeB === preferredPrimaryImageType
      if (aIsType && !bIsType) {
        return -1
      }
      if (!aIsType && bIsType) {
        return 1
      }
    }

    if (isImageAPrimary && isImageBPrimary) {
      return 0
    }

    if (isImageBPrimary) {
      return 1
    }

    if (isImageAPrimary) {
      return -1
    }

    return 0
  })
}
