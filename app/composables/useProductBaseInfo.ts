import { toValue } from 'vue'
import {
  type Product,
  type Value,
  getAttributeValueTuples,
  getFirstAttributeValue,
} from '@scayle/storefront-nuxt'
import { type MaybeRefOrGetter, toRef, computed } from 'vue'
import { useRouteHelpers } from '~/composables'
import {
  formatColors,
  getProductSiblings,
  sortProductImages,
  getPrimaryImage,
} from '~/utils'
import { useI18n } from '#i18n'
import type { ProductSibling } from '~~/types/siblings'

export function useProductBaseInfo(
  productItem: MaybeRefOrGetter<Product | undefined | null>,
  preferredPrimaryImageType?: MaybeRefOrGetter<Value | undefined>,
) {
  const product = toRef(productItem)
  const { getProductDetailRoute } = useRouteHelpers()

  const { t } = useI18n()

  const brand = computed(() => {
    return (
      getFirstAttributeValue(product.value?.attributes, 'brand')?.label ?? ''
    )
  })

  const name = computed(() => {
    return (
      getFirstAttributeValue(product.value?.attributes, 'name')?.label ?? ''
    )
  })

  const description = computed(() => {
    return (
      getFirstAttributeValue(product.value?.attributes, 'description')?.label ??
      ''
    )
  })

  const price = computed(() => {
    return product.value ? product.value.priceRange?.min : undefined
  })

  const lowestPriorPrice = computed(() => {
    return product.value ? product.value.lowestPriorPrice : undefined
  })

  const color = computed(() => {
    return formatColors(
      getAttributeValueTuples(product.value?.attributes, 'color'),
    )
  })

  const images = computed(() => {
    if (!product.value) {
      return []
    }
    return sortProductImages(
      product.value.images,
      toValue(preferredPrimaryImageType)?.value,
    )
  })

  const image = computed(() => {
    if (!product.value) {
      return
    }
    return getPrimaryImage(
      product.value.images,
      toValue(preferredPrimaryImageType)?.value,
    )
  })

  const siblings = computed<ProductSibling[]>(() => {
    return getProductSiblings(product.value, 'color', { sortBySoldOut: true })
  })

  const nonSoldOutSiblings = computed<ProductSibling[]>(() => {
    return getProductSiblings(product.value, 'color', { omitSoldOut: true })
  })

  const link = computed(() => {
    return product.value
      ? getProductDetailRoute(product.value.id, name.value)
      : undefined
  })

  const alt = computed(() => {
    return t('product_image.alt', {
      productName: name.value,
      colors: color.value,
      brand: brand.value,
    })
  })

  const longestCategoryList = computed(() => {
    if (
      !product.value ||
      !product.value.categories ||
      product.value.categories.length === 0
    ) {
      return []
    }

    return product.value.categories.reduce(
      (longestArray, currentArray) =>
        currentArray.length > longestArray.length ? currentArray : longestArray,
      [],
    )
  })

  const variants = computed(() => product.value?.variants || [])
  const hasOneVariantOnly = computed(() => {
    return variants.value.length === 1
  })

  return {
    alt,
    brand,
    name,
    description,
    price,
    lowestPriorPrice,
    color,
    image,
    images,
    siblings,
    nonSoldOutSiblings,
    link,
    longestCategoryList,
    variants,
    hasOneVariantOnly,
  }
}
