import { computed } from 'vue'
import type { ShopCountryCustomData } from '@scayle/storefront-nuxt'
import { useFormatHelpers, useShopConfiguration } from '#storefront/composables'
import { useI18n } from '#imports'

export function useShopConfigCustomData() {
  const { data } = useShopConfiguration()
  const { t } = useI18n()
  const { formatCurrency } = useFormatHelpers()

  const customData = computed(() => data.value?.customData)

  function instanceOfShopCountryCustomData(
    _customData: object,
  ): _customData is ShopCountryCustomData {
    return 'deliveryCosts' in _customData
  }

  const deliveryCosts = computed(() => {
    if (
      !customData.value ||
      !instanceOfShopCountryCustomData(customData.value) ||
      !customData.value.deliveryCosts
    ) {
      return
    }
    return customData.value.deliveryCosts
  })

  const deliveryCostsValue = computed(() => {
    if (!deliveryCosts.value?.value) {
      const price = formatCurrency(0)
      return `${t('price.starting_from')} ${price}`
    }

    return deliveryCosts.value.value
  })

  const deliveryCostsDisclaimer = computed(() => {
    if (!deliveryCosts.value) {
      return t('basket_summary.delivery_fees')
    }

    return deliveryCosts.value.disclaimer
  })

  return {
    deliveryCostsValue,
    deliveryCostsDisclaimer,
  }
}
