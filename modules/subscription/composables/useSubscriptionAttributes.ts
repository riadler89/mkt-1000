import { getAttributeValueTuples } from '@scayle/storefront-nuxt'
import { computed } from 'vue'
import type { BasketItem } from '@scayle/storefront-nuxt'
import {
  getOrdinalSuffixKey,
  hasSubscriptionCustomData,
  ORDINAL_INDEX_MAP,
} from '../helpers/subscription'
import { useNuxtApp } from '#app'
import type { OrderItem } from '~~/types/order'

/**
 * Computes subscription attributes for a basket or order item.
 *
 * @param basketItem - The basket or order item to extract subscription data from
 */
export default (item: BasketItem | OrderItem) => {
  const { $i18n } = useNuxtApp()
  const customData = computed(
    () => (item?.customData || {}) as Record<string, unknown>,
  )
  const hasSubscriptionData = computed(() =>
    hasSubscriptionCustomData(customData.value),
  )

  /**
   * Gets the label of a subscription value based on its attribute name and value.
   *
   * @param attributeName - The attribute name for which to get the label
   * @param attributeValue - The attribute value for which to get the label
   */
  const getSubscriptionValueLabel = (
    attributeName: string,
    attributeValue: string,
  ) =>
    getAttributeValueTuples(item.variant.attributes, attributeName).find(
      (value) => value.value === attributeValue,
    )?.label

  const subscriptionAttributes = computed(() => {
    const attributes = []

    const subscriptionDefinition =
      customData.value?.subscriptionDefinition &&
      typeof customData.value?.subscriptionDefinition === 'object' &&
      'subscriptionInterval' in customData.value.subscriptionDefinition
        ? (customData.value?.subscriptionDefinition
            ?.subscriptionInterval as string)
        : undefined

    if (subscriptionDefinition) {
      attributes.push({
        label: $i18n.t('subscription.interval'),
        value: getSubscriptionValueLabel(
          'subscriptionAvailableIntervals',
          subscriptionDefinition,
        ),
      })
    }

    const deliveryDay =
      customData.value?.subscriptionDefinition &&
      typeof customData.value?.subscriptionDefinition === 'object' &&
      'subscriptionDeliveryDate' in customData.value.subscriptionDefinition
        ? (customData.value?.subscriptionDefinition
            ?.subscriptionDeliveryDate as number)
        : undefined

    if (deliveryDay) {
      const ordinalSuffixKey = getOrdinalSuffixKey(
        $i18n.locale.value,
        deliveryDay,
      )

      const index = ORDINAL_INDEX_MAP[ordinalSuffixKey || 'other'] ?? 0
      const ordinalSuffix = $i18n.t('global.ordinal_suffix', index)

      attributes.push({
        label: $i18n.t('subscription.follow_up_delivery'),
        value: $i18n.t('subscription.day_of_month_selection_caption', {
          dayOfMonth: deliveryDay + ordinalSuffix,
        }),
      })
    }

    return attributes
  })
  return {
    hasSubscriptionData,
    subscriptionAttributes,
  }
}
