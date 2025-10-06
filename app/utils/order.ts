import type { Attributes, AttributeGroup } from '@scayle/storefront-nuxt'
import type { Order, OrderProduct, OrderItem, Package } from '~~/types/order'

type OrderDelivery = Record<number, { items: OrderItem[]; shipment: Package }>

/**
 * Groups order items by their package and returns the grouped items along with their shipment details.
 *
 * @param {Order} orderData - The order data containing items and packages.
 * @returns {OrderDelivery} - The grouped order items by package.
 */
export const getOrderDeliveries = ({
  items,
  packages,
}: Order): OrderDelivery => {
  if (!items?.length || !packages?.length) {
    return {}
  }

  const orderDelivery: OrderDelivery = {}
  const packageMap = new Map(packages.map((pkg) => [pkg.id, pkg]))

  for (const item of items) {
    const shipment = packageMap.get(item.packageId)

    if (!shipment) {
      continue
    }

    orderDelivery[item.packageId] ??= { items: [], shipment }
    orderDelivery[item.packageId]!.items.push(item)
  }

  return orderDelivery
}

/**
 * Maps the attributes of an order product to a new format.
 *
 * @param {OrderProduct['attributes']} attributes - The attributes of the order product.
 * @returns {Attributes} - The mapped attributes.
 */
export const mapAttributes = (
  attributes: OrderProduct['attributes'],
): Attributes => {
  const newAttributes: Attributes = {}

  for (const key in attributes) {
    if (Object.prototype.hasOwnProperty.call(attributes, key)) {
      newAttributes[key] = {
        ...attributes[key],
        id: null,
        type: null,
      } as AttributeGroup
    }
  }

  return newAttributes
}
