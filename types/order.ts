import type {
  AdvancedAttribute,
  AttributeGroupMulti,
  AttributeGroupSingle,
  Attributes,
  Order as BaseOrder,
  OrderItem as BaseOrderItem,
  ListOfPackages,
  LowestPriorPrice,
  OrderAddress as BaseOrderAddress,
} from '@scayle/storefront-nuxt'

export interface OrderCategory {
  categoryHidden: boolean
  categoryId: number
  categoryName: string
  categorySlug: string
  categoryUrl: string
}

export type OrderAdvancedAttribute = Omit<AdvancedAttribute, 'id' | 'type'>

export type Package = ListOfPackages[0]

export type DeliveryDate = Package['deliveryDate']

export type DeliveryInfo = Package & { formattedStatus: string }

// The product and variant data returned in the order payload varies by tenant
// We define it here to get strict typing
export interface OrderProduct {
  advancedAttributes: {
    [k: string]: OrderAdvancedAttribute
    advColor: OrderAdvancedAttribute
    productName: OrderAdvancedAttribute
  }
  attributes: Attributes & {
    brand: AttributeGroupSingle
    brandLogo: AttributeGroupSingle
    category: AttributeGroupMulti
    color: AttributeGroupSingle
    colorHex: AttributeGroupSingle
    description: AttributeGroupSingle
    name: AttributeGroupSingle
  }
  categories: OrderCategory[][]
  createdAt: string
  id: number
  images: {
    hash: string
  }[]
  masterKey: string
  name: string
  updatedAt: string
}

export interface OrderVariant {
  attributes: Attributes & {
    size: AttributeGroupSingle
  }
  createdAt: string
  id: number
  images: {
    hash: string
  }[]
  referenceKey: string
  lowestPriorPrice: LowestPriorPrice
  stock: {
    isSellableWithoutStock: boolean
    quantity: number
    supplierId: number
    warehouseId: number
  }
  updatedAt: string
}

export type Order = BaseOrder<OrderProduct, OrderVariant>

export type OrderItem = BaseOrderItem<OrderProduct, OrderVariant>

export type OrderItems = OrderItem[]

export type OrderPrice = OrderItem['price']

export type OrderAddress = BaseOrderAddress
