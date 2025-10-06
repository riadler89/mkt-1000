import {
  type AppliedReduction,
  type BasketResponseData,
  type ListOfPackages,
  type PackageReference,
  type Price,
  type Product,
  type ProductCategory,
  type Variant,
  type WishlistResponseData,
  type CentAmount,
  getFirstAttributeValue,
} from '@scayle/storefront-nuxt'
import { isEqual } from './object'
import type { Order } from '~~/types/order'
import { divideByHundred } from '~/utils/price'
import type {
  TrackingEvent,
  ProductListData,
  AdditionalTrackingEvent,
  EcommerceTrackingEvent,
  TrackingPayload,
  MultipleActionData,
  ProductInfo,
  ViewInfo,
  AdditionalInfo,
  CustomerInfo,
  CustomerData,
  TrackingCategory,
  ProductViewData,
  ProductActionData,
} from '~~/types/tracking'

/**
 * Checks if event is one of: AdditionalTrackingEvent = 'cart' | 'wishlist' | 'search' | 'filter_flyout' | 'filter_slider'
 */
export const isAdditionalTrackingEvent = (
  event: TrackingEvent,
): event is AdditionalTrackingEvent => {
  return ['cart', 'wishlist'].includes(event as AdditionalTrackingEvent)
}

/**
 * Checks if event is one of: 'add_to_wishlist' | 'remove_from_wishlist' | 'select_item'
 */
export const isEcommerceTrackingEvent = (event: TrackingEvent): boolean => {
  return ['add_to_wishlist', 'remove_from_wishlist', 'select_item'].includes(
    event,
  )
}

export const isViewCartEvent = (
  event: TrackingEvent,
): event is EcommerceTrackingEvent => {
  return ['view_cart'].includes(event as EcommerceTrackingEvent)
}

/**
 * Checks if event is one of: 'view_promotion', 'select_promotion', 'view_campaign', 'select_campaign'
 */
export const isDealTrackingEvent = (event: TrackingEvent): boolean => {
  return [
    'view_promotion',
    'select_promotion',
    'view_campaign',
    'select_campaign',
  ].includes(event)
}

/**
 * Checks if payload.items exists
 */
export const isProductImpressionsData = (
  data: TrackingPayload | MultipleActionData,
): data is MultipleActionData => {
  return !!(data as MultipleActionData).items
}

export const mapProductToTrackingPayload = (
  product: Product,
  variant?: Variant,
): ProductInfo => {
  const price = variant ? variant.price : product.priceRange?.min

  const itemBrand =
    getFirstAttributeValue(product.attributes, 'brand')?.label || ''
  const itemBrandId =
    getFirstAttributeValue(product.attributes, 'brand')?.id?.toString() || ''
  const itemSize =
    getFirstAttributeValue(variant?.attributes, 'size')?.value?.toString() || ''

  return {
    item_id: product.id.toString(),
    item_name: getFirstAttributeValue(product.attributes, 'name')!.label,
    ...(price
      ? {
          price: divideByHundred(price.withoutTax),
          sale_discount: getDiscount(price, 'sale'),
          campaign_discount: getDiscount(price, 'campaign'),
          original_price: divideByHundred(getOriginalPrice(price)),
          tax: divideByHundred(getOriginalPrice(price) - price.withoutTax),
        }
      : {
          price: undefined,
          sale_discount: undefined,
          campaign_discount: undefined,
          original_price: undefined,
          tax: undefined,
        }),
    item_brand: itemBrand,
    item_brand_id: itemBrandId,
    item_size: itemSize,
  }
}

const mapAdditionalInfo = (
  data: ProductActionData | ProductListData | ProductViewData,
): AdditionalInfo | ViewInfo => {
  const {
    product,
    list,
    quantity = 1,
  } = data as ProductViewData & ProductActionData

  const { name, id } = data.category ||
    getDeepestCategoryForTracking(product.categories) || { name: '', id: '' }

  const hasListIndex = list?.index && list.index > -1

  return {
    item_category: name,
    item_category_id: id,
    item_variant: product?.variants?.[0]?.id?.toString(),
    item_list_name: list?.name || '',
    item_list_id: list?.id || '',
    sold_out: product.isSoldOut,
    quantity: quantity > -1 ? String(quantity) : '0',
    ...('source' in data && { source: data.source }),
    ...('currency' in data && { currency: data.currency }),
    ...('destination' in data && { destination: data.destination }),
    ...('destinationUrl' in data && { destination_url: data.destinationUrl }),
    ...('variant' in data && { item_variant: data?.variant?.id?.toString() }),
    ...(hasListIndex && { index: list?.index }),
    ...('index' in product &&
      product.index !== undefined &&
      !hasListIndex &&
      product.index > -1 && { index: product.index }),
  } as AdditionalInfo | ViewInfo
}

const getTotalPriceInfo = (
  items: {
    quantity: number
    campaign_discount?: number
    sale_discount?: number
    price?: number
    priceWithTax?: number
  }[],
) => {
  const total = {
    total_campaign_reduction_with_tax: 0.0,
    total_sale_reduction_with_tax: 0.0,
    total_with_tax: 0.0,
    total_without_tax: 0.0,
  }

  items.forEach((item) => {
    total.total_campaign_reduction_with_tax +=
      (item.campaign_discount ?? 0) * item.quantity
    total.total_sale_reduction_with_tax +=
      (item.sale_discount ?? 0) * item.quantity
    total.total_with_tax += (item.priceWithTax ?? 0) * item.quantity
    total.total_without_tax += (item.price ?? 0) * item.quantity
  })

  const keys = Object.keys(total) as (keyof typeof total)[]

  keys.forEach(
    (key) => (total[key] = Number((total[key] as number).toFixed(2))),
  )

  return total
}

export const mapCustomerInfoToTrackingPayload = ({
  method,
  eh,
  status,
  login_method: loginMethod,
  customer_id: customerId,
  customer_type: customerType = 'new',
  pagePayload,
}: CustomerData): CustomerInfo => {
  const mappedPayload: CustomerInfo = {
    ...(loginMethod ? { login_method: loginMethod } : { method }),
    eh: eh || '',
    customer_type: customerType,
    ...(pagePayload ?? {}),
    status,
  }
  if (customerId) {
    mappedPayload.customer_id = customerId
  }
  return mappedPayload
}

export const mapTrackingDataForEvent = (
  event: TrackingEvent,
  payload: TrackingPayload,
  // eslint-disable-next-line sonarjs/cognitive-complexity
) => {
  let data = {}
  if (isDealTrackingEvent(event)) {
    data = {
      ecommerce: payload,
    }
  } else if (
    isAdditionalTrackingEvent(event) &&
    isProductImpressionsData(payload)
  ) {
    const items = payload.items.map((payloadItem) => ({
      ...mapProductToTrackingPayload(payloadItem.product),
      ...mapAdditionalInfo(payloadItem),
      currency: 'currencyCode' in payload ? payload.currencyCode : undefined,
    }))

    // @ts-expect-error Property 'items' does not exist on type '{}'.
    data.items = items
    const totalPrice = getTotalPriceInfo(
      items.map((item) => ({
        price: item.price,
        quantity: item.quantity ? parseInt(item.quantity!) : 1,
        campaign_discount: item.campaign_discount,
        sale_discount: item.sale_discount,
        priceWithTax: item.original_price,
      })),
    )

    data = {
      ...data,
      ...totalPrice,
    }
  } else if (isViewCartEvent(event)) {
    const {
      currencyCode: currency,
      valueWithoutTax: value,
      pagePayload,
      items,
    } = payload as MultipleActionData
    data = {
      ...(pagePayload || {}),
      ...{ currency },
      ...(value ? { value } : { value: 0 }),
      ecommerce: {
        items: items.map((payload) => {
          const price = payload.product.priceRange?.min
          return {
            ...(currency ? { currency } : {}),
            ...mapProductToTrackingPayload(payload.product),
            ...mapAdditionalInfo(payload),
            tax: divideByHundred(price?.tax?.vat?.amount || 0),
          }
        }),
      },
    }
  } else if (isProductImpressionsData(payload)) {
    const { currencyCode: currency, pagePayload } = payload
    data = {
      ...(pagePayload || {}),
      ecommerce: {
        items: payload.items.map((payload) => {
          const price = payload.product.priceRange?.min
          return {
            ...(currency ? { currency } : {}),
            ...mapProductToTrackingPayload(payload.product),
            ...mapAdditionalInfo(payload),
            tax: divideByHundred(price?.tax?.vat?.amount || 0),
          }
        }),
      },
    }
  } else if (
    isEcommerceTrackingEvent(event) &&
    'product' &&
    'currencyCode' in payload &&
    payload.product
  ) {
    const currency = payload.currencyCode
    const { pagePayload } = payload

    data = {
      ...(pagePayload || {}),
      ecommerce: {
        items: [
          {
            ...(currency ? { currency } : {}),
            ...mapProductToTrackingPayload(
              payload.product,
              'variant' in payload ? payload.variant : undefined,
            ),
            ...mapAdditionalInfo(payload),
          },
        ],
      },
    }
  } else if (
    'product' in payload &&
    'currencyCode' in payload &&
    payload.product
  ) {
    const currency = payload.currencyCode
    const price =
      'variant' in payload && payload.variant
        ? payload.variant.price
        : payload.product.priceRange?.min
    data = {
      ecommerce: {
        items: [
          {
            ...(currency ? { currency } : {}),
            ...mapProductToTrackingPayload(
              payload.product,
              'variant' in payload ? payload.variant : undefined,
            ),
            ...mapAdditionalInfo(payload),
            tax: divideByHundred(price?.tax.vat.amount || 0),
          },
        ],
      },
    }
  } else if (
    'products' in payload &&
    'currencyCode' in payload &&
    payload.products
  ) {
    const currency = payload.currencyCode
    const { pagePayload } = payload

    data = {
      ...(pagePayload || {}),
      ecommerce: {
        items: payload.products.map((product) => ({
          ...(currency ? { currency } : {}),
          ...mapProductToTrackingPayload(product),
          ...mapAdditionalInfo({ product }),
        })),
      },
    }
  } else {
    data = {
      ...payload,
    }
  }

  return {
    event,
    ...data,
  }
}

/**
 * @param categories
 * @returns most specific category for a product
 */
function getDeepestCategory(
  categories: ProductCategory[][] = [],
): ProductCategory | null | undefined {
  if (!categories.length) {
    return null
  }
  let depth = { index: 0, value: 0 }
  categories.forEach((category, index) => {
    if (category.length > depth.value) {
      depth = { index, value: category.length }
    }
    if (category.length === depth.value) {
      depth.index = index
    }
  })

  return categories[depth.index]?.[categories[depth.index]!.length - 1]
}

export const getDeepestCategoryForTracking = (
  categories: ProductCategory[][] = [],
): TrackingCategory => {
  const { categoryName, categoryId } = getDeepestCategory(categories) || {
    categoryName: '',
    categoryId: '',
  }
  return {
    name: categoryName,
    id: (categoryId || '').toString(),
  }
}

export const didBasketDataChange = (
  oldData: BasketResponseData | null | undefined,
  newData: BasketResponseData | null | undefined,
) => {
  return !isEqual(
    {
      items: oldData?.items.map((item) => ({
        productId: item.product?.id,
        variantId: item.variant?.id,
        price: item.product?.priceRange,
        quantity: item.quantity,
        soldOut: item.product?.isSoldOut,
      })),
      key: oldData?.key,
    },
    {
      items: newData?.items.map((item) => ({
        productId: item.product?.id,
        variantId: item.variant?.id,
        price: item.product?.priceRange,
        quantity: item.quantity,
        soldOut: item.product?.isSoldOut,
      })),
      key: newData?.key,
    },
  )
}

export const didWishlistDataChange = (
  oldData: WishlistResponseData | null | undefined,
  newData: WishlistResponseData | null | undefined,
) => {
  return !isEqual(
    {
      items: oldData?.items.map((item) => ({
        productId: item.product?.id,
        variantId: item.variant?.id,
        soldOut: item.product?.isSoldOut,
      })),
      key: oldData?.key,
    },
    {
      items: newData?.items.map((item) => ({
        productId: item.product?.id,
        variantId: item.variant?.id,
        soldOut: item.product?.isSoldOut,
      })),
      key: newData?.key,
    },
  )
}

export const formatPriceWithCurrency = (
  value: number,
  locale: string,
  currency: string,
): string => {
  const currencyFractionDigits = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).resolvedOptions().maximumFractionDigits

  return divideByHundred(value).toLocaleString(locale, {
    minimumFractionDigits: currencyFractionDigits,
  })
}

export const sumReductions = (reductions: AppliedReduction[]) => {
  if (!reductions) {
    return 0
  }
  return reductions.reduce((sum: number, reduction: AppliedReduction) => {
    return sum + reduction.amount.absoluteWithTax
  }, 0)
}

export const sumReductionsByCategory = (
  reductions?: AppliedReduction[],
  category?: AppliedReduction['category'],
) => {
  if (!reductions) {
    return 0
  }
  return sumReductions(
    reductions.filter((reduction) => reduction.category === category),
  )
}

export const sumReductionsFromAllOrderItemsPerCategory = (
  orderItems: Order['items'],
  category: AppliedReduction['category'],
) => {
  if (!orderItems) {
    return 0
  }
  return orderItems.reduce(
    (sum: number, orderItem: NonNullable<Order['items']>[number]) => {
      return (
        sum +
        sumReductionsByCategory(
          orderItem?.price?.appliedReductions as AppliedReduction[],
          category,
        )
      )
    },
    0,
  )
}

export const getFirstCarrierKey = (orderData: Order) => {
  return orderData.packages?.[0]?.carrierKey
}

export const getCarrier = (
  packages: Order['packages'],
  packageId: PackageReference,
) => {
  return packages?.find((p) => p.id === packageId) as ListOfPackages[0]
}

export const getGiftcardAmount = ({
  amount,
  currency,
  locale,
}: {
  amount: number
  currency: string
  locale: string
}) => {
  const numberParts = new Intl.NumberFormat(locale.replace('_', '-'), {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).formatToParts(amount)
  const currencySymbol = numberParts.find(
    ({ type }) => type === 'currency',
  )?.value
  const number = numberParts
    .filter(({ type }) => !['currency', 'literal'].includes(type))
    .map(({ value }) => value)
    .join('')
  return `${number}${currencySymbol}`
}

/**
 * Orders can only have vouchers(same as coupons) with a particular type, like 'relative' or 'absolute'.
 * Depending on this type the value is calculated differently.
 *
 * voucherType is optional and is derived from orderData if not provided
 * @param orderData
 * @param [voucherType]
 * @returns
 */
export const getCouponReductionWithTax = ({
  orderData,
  voucherType,
}: {
  orderData: Order
  voucherType?: 'absolute' | 'relative'
}) => {
  const orderVoucherType = voucherType ?? orderData.vouchers?.[0]?.type
  if (
    !orderData.vouchers?.[0] ||
    orderData.vouchers?.length === 0 ||
    orderVoucherType === undefined
  ) {
    return 0
  }
  if (orderVoucherType === 'absolute') {
    return divideByHundred(orderData.vouchers[0].value)
  }
  if (orderVoucherType === 'relative') {
    return divideByHundred(
      sumReductionsFromAllOrderItemsPerCategory(orderData.items, 'voucher'),
    )
  }
}

export const getEmailHash = async (email: string | undefined) => {
  if (!email) {
    return ''
  }
  const hashBuffer = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(email.replace(/ /g, '')?.toLowerCase()),
  )
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

const getOriginalPrice = (price: Price): CentAmount =>
  price.appliedReductions.reduce(
    (previousPrice, appliedReduction) =>
      (previousPrice + appliedReduction.amount.absoluteWithTax) as CentAmount,
    price.withTax,
  )

const getDiscount = (price: Price, type: 'sale' | 'campaign') => {
  const reduction = price.appliedReductions.find(
    (reduction) => reduction.category === type,
  )
  if (!reduction) {
    return 0
  }

  return divideByHundred(reduction.amount.absoluteWithTax)
}
