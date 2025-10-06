import { describe, expect, it } from 'vitest'
import type { OrderItem, AttributeGroup } from '@scayle/storefront-nuxt'
import {
  attributeGroupMultiFactory,
  attributeGroupSingleFactory,
  orderFactory,
  orderItemFactory,
} from '@scayle/storefront-nuxt/test/factories'
import { getOrderDeliveries, mapAttributes } from './order'
import type { Order, Package } from '~~/types/order'

describe('getOrderDeliveries', () => {
  it('should group items by package and include shipment data', () => {
    const packageId = 1
    const items = [orderItemFactory.build({ packageId })] as OrderItem<
      Record<string, unknown>,
      Record<string, unknown>
    >[]

    const shipment: Package = {
      id: packageId,
      carrierKey: 'dhl',
      deliveryDate: { maximum: '2018-02-05', minimum: '2018-02-02' },
      deliveryStatus: 'open',
      shipmentKey: 'shpmnt-123',
    }

    const order = orderFactory.build({
      items,
      packages: [shipment],
    })
    const deliveries = getOrderDeliveries(order as unknown as Order)

    expect(deliveries).toStrictEqual({
      '1': { items, shipment },
    })
  })

  it('should handle multiple packages with multiple items each', () => {
    const package1Id = 1
    const package2Id = 2

    const items = [
      orderItemFactory.build({ packageId: package1Id }),
      orderItemFactory.build({ packageId: package1Id }),
      orderItemFactory.build({ packageId: package2Id }),
    ] as OrderItem<Record<string, unknown>, Record<string, unknown>>[]

    const shipments: Package[] = [
      {
        id: package1Id,
        carrierKey: 'dhl',
        deliveryDate: { maximum: '2018-02-05', minimum: '2018-02-02' },
        deliveryStatus: 'open',
        shipmentKey: 'shpmnt-123',
      },
      {
        id: package2Id,
        carrierKey: 'ups',
        deliveryDate: { maximum: '2018-02-07', minimum: '2018-02-04' },
        deliveryStatus: 'shipment_completed',
        shipmentKey: 'shpmnt-456',
      },
    ]

    const order = orderFactory.build({
      items,
      packages: shipments,
    })
    const deliveries = getOrderDeliveries(order as unknown as Order)

    expect(deliveries).toStrictEqual({
      '1': {
        items: [items[0], items[1]],
        shipment: shipments[0],
      },
      '2': {
        items: [items[2]],
        shipment: shipments[1],
      },
    })
  })

  it('should skip items with missing package references', () => {
    const items = [
      orderItemFactory.build({ packageId: 1 }),
      orderItemFactory.build({ packageId: 999 }), // Missing package
      orderItemFactory.build({ packageId: 2 }),
    ] as OrderItem<Record<string, unknown>, Record<string, unknown>>[]

    const shipments: Package[] = [
      {
        id: 1,
        carrierKey: 'dhl',
        deliveryDate: { maximum: '2018-02-05', minimum: '2018-02-02' },
        deliveryStatus: 'open',
        shipmentKey: 'shpmnt-123',
      },
      {
        id: 2,
        carrierKey: 'ups',
        deliveryDate: { maximum: '2018-02-07', minimum: '2018-02-04' },
        deliveryStatus: 'shipment_completed',
        shipmentKey: 'shpmnt-456',
      },
    ]

    const order = orderFactory.build({
      items,
      packages: shipments,
    })
    const deliveries = getOrderDeliveries(order as unknown as Order)

    expect(deliveries).toStrictEqual({
      '1': {
        items: [items[0]],
        shipment: shipments[0],
      },
      '2': {
        items: [items[2]],
        shipment: shipments[1],
      },
    })
  })

  it('should return empty object when no items or packages', () => {
    const testCases = [
      { items: undefined, packages: undefined },
      { items: [], packages: [] },
      { items: undefined, packages: [] },
      { items: [], packages: undefined },
    ]

    testCases.forEach(({ items, packages }) => {
      const order = orderFactory.build({ items, packages }) as unknown as Order
      const deliveries = getOrderDeliveries(order)
      expect(deliveries).toStrictEqual({})
    })
  })

  it('should handle empty items array with valid packages', () => {
    const shipments: Package[] = [
      {
        id: 1,
        carrierKey: 'dhl',
        deliveryDate: { maximum: '2018-02-05', minimum: '2018-02-02' },
        deliveryStatus: 'open',
        shipmentKey: 'shpmnt-123',
      },
    ]

    const order = orderFactory.build({
      items: [],
      packages: shipments,
    })
    const deliveries = getOrderDeliveries(order as unknown as Order)

    expect(deliveries).toStrictEqual({})
  })
})

describe('mapAttributes', () => {
  it('should map mixed single and multi-select attributes correctly', () => {
    const inputAttributes: Record<string, AttributeGroup> = {
      brand: attributeGroupSingleFactory.build({
        key: 'brand',
        label: 'Brand Name',
        id: 123,
        type: 'string',
        values: { label: 'Nike', id: 456, value: 'nike' },
      }),
      category: attributeGroupMultiFactory.build({
        key: 'category',
        label: 'Categories',
        id: 789,
        type: 'array',
        values: [
          { label: 'Shoes', id: 1, value: 'shoes' },
          { label: 'Sports', id: 2, value: 'sports' },
        ],
      }),
      color: attributeGroupSingleFactory.build({
        key: 'color',
        label: 'Color',
        id: 101,
        type: 'string',
        values: { label: 'Red', id: 202, value: 'red' },
      }),
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = mapAttributes(inputAttributes as any)

    expect(result).toStrictEqual({
      brand: {
        key: 'brand',
        label: 'Brand Name',
        id: null,
        type: null,
        multiSelect: false,
        values: { label: 'Nike', id: 456, value: 'nike' },
      },
      category: {
        key: 'category',
        label: 'Categories',
        id: null,
        type: null,
        multiSelect: true,
        values: [
          { label: 'Shoes', id: 1, value: 'shoes' },
          { label: 'Sports', id: 2, value: 'sports' },
        ],
      },
      color: {
        key: 'color',
        label: 'Color',
        id: null,
        type: null,
        multiSelect: false,
        values: { label: 'Red', id: 202, value: 'red' },
      },
    })
  })

  it('should handle empty attributes object', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = mapAttributes({} as any)
    expect(result).toStrictEqual({})
  })

  it('should preserve all original properties except id and type', () => {
    const inputAttributes: Record<
      string,
      AttributeGroup & { customProperty?: string }
    > = {
      customAttr: {
        ...attributeGroupSingleFactory.build({
          key: 'customAttr',
          label: 'Custom Attribute',
          id: 999,
          type: 'custom',
          multiSelect: false,
          values: { label: 'Custom Value', id: 888, value: 'custom' },
        }),
        customProperty: 'should be preserved',
      },
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = mapAttributes(inputAttributes as any)

    expect(result.customAttr).toMatchObject({
      key: 'customAttr',
      label: 'Custom Attribute',
      multiSelect: false,
      values: { label: 'Custom Value', id: 888, value: 'custom' },
      customProperty: 'should be preserved',
    })
    expect(result.customAttr?.id).toBe(null)
    expect(result.customAttr?.type).toBe(null)
  })

  it('should handle attributes with null or undefined values', () => {
    const inputAttributes: Record<string, AttributeGroup | null | undefined> = {
      validAttr: attributeGroupSingleFactory.build({ key: 'valid' }),
      nullAttr: null,
      undefinedAttr: undefined,
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = mapAttributes(inputAttributes as any)

    expect(result.validAttr).toBeDefined()
    expect(result.validAttr?.id).toBe(null)
    expect(result.validAttr?.type).toBe(null)
    // The function processes null values but sets id and type to null
    expect(result.nullAttr).toBeDefined()
    expect(result.nullAttr?.id).toBe(null)
    expect(result.nullAttr?.type).toBe(null)
    // The function also processes undefined values but sets id and type to null
    expect(result.undefinedAttr).toBeDefined()
    expect(result.undefinedAttr?.id).toBe(null)
    expect(result.undefinedAttr?.type).toBe(null)
  })

  it('should handle complex nested values in multi-select attributes', () => {
    const inputAttributes: Record<string, AttributeGroup> = {
      complexMulti: attributeGroupMultiFactory.build({
        key: 'complexMulti',
        label: 'Complex Multi',
        values: [
          {
            label: 'Option 1',
            id: 1,
            value: 'option1',
          },
          {
            label: 'Option 2',
            id: 2,
            value: 'option2',
          },
        ],
      }),
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = mapAttributes(inputAttributes as any)

    expect(result.complexMulti?.values).toHaveLength(2)
    expect(Array.isArray(result.complexMulti?.values)).toBe(true)
    if (Array.isArray(result.complexMulti?.values)) {
      expect(result.complexMulti.values[0]).toMatchObject({
        label: 'Option 1',
        id: 1,
        value: 'option1',
      })
    }
    expect(result.complexMulti?.id).toBe(null)
    expect(result.complexMulti?.type).toBe(null)
  })
})
