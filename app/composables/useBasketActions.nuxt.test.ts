import { toRef, defineComponent, ref } from 'vue'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { ExistingItemHandling } from '@scayle/storefront-nuxt'
import { flushPromises, mount } from '@vue/test-utils'
import { basketItemFactory } from '@scayle/storefront-nuxt/test/factories'
import { useBasketActions } from './useBasketActions'

const { useBasket, useTrackingEvents } = vi.hoisted(() => {
  return {
    useBasket: vi.fn(),
    useUser: vi.fn(),
    useTrackingEvents: vi.fn().mockReturnValue({
      trackRemoveFromBasket: vi.fn(),
      trackBasket: vi.fn(),
      collectBasketItems: vi.fn(),
      trackAddToBasket: vi.fn(),
    }),
  }
})

vi.mock('#storefront/composables', async () => {
  const actual = await vi.importActual('#storefront/composables')
  return {
    ...actual,
    useBasket,
  }
})

vi.mock('~/composables/useTrackingEvents', () => {
  return { useTrackingEvents }
})

vi.mock('#storefront-promotions/composables/useApplyPromotions', () => {
  return {
    useApplyPromotions: vi.fn().mockReturnValue({
      applyPromotions: vi.fn().mockResolvedValue(undefined),
    }),
  }
})

vi.mock('nanoid', () => {
  return {
    nanoid: () => 'nanoid',
  }
})

// `useBasketActions` needs to be wrapped in a vue component because it uses `useI18n`.
// `useI18n` needs to run in the an setup function.
const getTestComponentWrapper = async () => {
  const wrapper = mount(
    defineComponent({
      template: '<div />',
      setup() {
        return {
          ...useBasketActions(),
        }
      },
    }),
  )
  await flushPromises()
  return wrapper.vm
}

describe('useBasketActions', () => {
  const addItemMock = vi.fn()
  const updateItemMock = vi.fn()
  const removeItemMock = vi.fn()

  beforeEach(() => {
    useBasket.mockReturnValue({
      then: vi.fn(),
      addItem: addItemMock,
      updateItem: updateItemMock,
      removeItem: removeItemMock,
      data: ref(null),
    })
  })

  describe('addItem', () => {
    it('should keep existingItemHandling of passed item', async () => {
      const { addItem } = await getTestComponentWrapper()
      await addItem({
        productName: 'Test',
        quantity: 1,
        variantId: 1,
        existingItemHandling:
          ExistingItemHandling.REPLACE_EXISTING_WITH_COMBINED_QUANTITY,
      })

      expect(addItemMock).toBeCalledWith({
        productName: 'Test',
        quantity: 1,
        variantId: 1,
        existingItemHandling:
          ExistingItemHandling.REPLACE_EXISTING_WITH_COMBINED_QUANTITY,
      })
    })
    it('should use "ExistingItemHandling.AddQuantityToExisting" when existingItemHandling was not specified', async () => {
      const { addItem } = await getTestComponentWrapper()
      await addItem({
        productName: 'Test',
        quantity: 1,
        variantId: 1,
      })

      expect(addItemMock).toBeCalledWith({
        productName: 'Test',
        quantity: 1,
        variantId: 1,
        existingItemHandling: ExistingItemHandling.ADD_QUANTITY_TO_EXISTING,
      })
    })
    it('should keep the passed item group', async () => {
      const { addItem } = await getTestComponentWrapper()
      await addItem({
        productName: 'Test',
        quantity: 1,
        variantId: 1,
        itemGroup: { id: 'id', isMainItem: true, isRequired: true },
      })

      expect(addItemMock).toBeCalledWith({
        productName: 'Test',
        quantity: 1,
        variantId: 1,
        existingItemHandling: ExistingItemHandling.ADD_QUANTITY_TO_EXISTING,
        itemGroup: { id: 'id', isMainItem: true, isRequired: true },
      })
    })
    it('should not create an group for normal products', async () => {
      const { addItem } = await getTestComponentWrapper()
      await addItem({
        productName: 'Test',
        quantity: 1,
        variantId: 1,
      })

      expect(addItemMock).toBeCalledWith({
        productName: 'Test',
        quantity: 1,
        variantId: 1,
        existingItemHandling: ExistingItemHandling.ADD_QUANTITY_TO_EXISTING,
      })
    })
  })
  describe('updateItemQuantity', () => {
    it('should call updateItem ', async () => {
      useBasket.mockReturnValue({
        then: vi.fn(),
        updateItem: updateItemMock,
        items: toRef([]),
        data: ref(null),
      })
      const basketItem = basketItemFactory.build({
        key: 'test',
        variant: { id: 1 },
        quantity: 1,
        customData: {
          subscriptionDefinition: {},
        },
        displayData: {},
      })
      const { updateItemQuantity } = await getTestComponentWrapper()
      await updateItemQuantity(basketItem, 2)

      expect(updateItemMock).toBeCalledWith('test', {
        customData: {
          subscriptionDefinition: {},
        },
        displayData: {},
        itemGroup: undefined,
        promotionId: undefined,
        quantity: 2,
      })
      expect(useTrackingEvents().trackAddToBasket).toBeCalledWith({
        product: basketItem.product,
        variant: basketItem.variant,
        quantity: 2,
      })
    })
  })
  describe('removeItem', () => {
    it('should remove the item from basket and track everything', async () => {
      const basketItem = basketItemFactory.build({
        variant: { id: 1 },
        key: 'basketItemKey',
        quantity: 1,
      })
      useBasket.mockReturnValue({
        then: vi.fn(),
        addItem: addItemMock,
        removeItemByKey: removeItemMock,
        items: toRef([basketItem]),
        data: ref(null),
      })
      const { removeItem } = await getTestComponentWrapper()
      await removeItem(basketItem)

      expect(removeItemMock).toBeCalledWith(basketItem.key)
      const { trackRemoveFromBasket } = useTrackingEvents()
      expect(trackRemoveFromBasket).toBeCalledWith({
        product: basketItem.product,
        variant: basketItem.variant,
        quantity: basketItem.quantity,
      })
    })
  })
})
