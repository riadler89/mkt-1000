import { computed, ref, toRef, type MaybeRefOrGetter, watch } from 'vue'
import {
  ExistingItemHandling,
  type Product,
  type Variant,
  type Promotion,
  extendPromise,
} from '@scayle/storefront-nuxt'
import { useBasketActions } from '~/composables/useBasketActions'
import { useProductBaseInfo } from '~/composables/useProductBaseInfo'
import { useToast } from '~/composables/useToast'
import { useTrackingEvents } from '~/composables/useTrackingEvents'
import { useNuxtApp } from '#app'
import { useBasket } from '#storefront/composables'

type PromotionRequestParam = Pick<Promotion, 'id' | 'code'>

export function usePromotionGiftSelection(
  giftProduct: MaybeRefOrGetter<Product | undefined>,
) {
  const { $i18n } = useNuxtApp()
  const toast = useToast()
  const gift = toRef(giftProduct)

  const { trackAddToBasket } = useTrackingEvents()

  const { name, hasOneVariantOnly } = useProductBaseInfo(gift)
  const activeVariant = ref<Variant | undefined>()

  const basket = useBasket()
  const basketActions = useBasketActions()

  const { status } = basket
  const { addItem } = basketActions

  const giftVariants = computed<Variant[]>(() => {
    return gift.value?.variants ?? []
  })

  // We want to preselect the active variant when the product only has one active variant
  watch(
    gift,
    (giftProduct) => {
      activeVariant.value =
        giftProduct?.variants?.length === 1
          ? gift.value?.variants?.[0]
          : undefined
    },
    { immediate: true },
  )

  const addItemToBasket = async (promotionId: string) => {
    if (!activeVariant.value) {
      toast.show($i18n.t('add_to_basket.notification.select_size'), {
        action: 'CONFIRM',
      })
      return
    }

    const productName =
      name.value || $i18n.t('add_to_basket.product_name_fallback')

    await addItem({
      variantId: activeVariant.value.id,
      productName,
      quantity: 1,
      existingItemHandling: ExistingItemHandling.REPLACE_EXISTING,
      promotions: [{ id: promotionId }] as PromotionRequestParam[],
    })

    if (gift) {
      trackAddToBasket({
        product: gift.value,
        variant: activeVariant.value,
        index: 1,
      })
    }
    if (!hasOneVariantOnly.value) {
      activeVariant.value = undefined
    }
  }

  return extendPromise(
    Promise.all([basket, basketActions]).then(() => ({})),
    {
      status,
      addItemToBasket,
      activeVariant,
      giftVariants,
    },
  )
}
