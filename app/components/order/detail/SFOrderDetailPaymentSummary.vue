<template>
  <div class="flex flex-col gap-4 border-t pt-4">
    <dl class="grid grid-cols-2 justify-between gap-2 text-md text-primary">
      <dt class="font-semibold">
        {{ $t('order_detail_payment_summary.subtotal') }}
      </dt>
      <dd class="text-right font-semibold" data-testid="order-detail-subtotal">
        {{ formatCurrency(subtotal) }}
      </dd>

      <dt>{{ $t('order_detail_payment_summary.shipping_costs') }}</dt>
      <dd class="text-right" data-testid="order-detail-shipping-cost">
        {{ formatCurrency(shippingCost) }}
      </dd>
    </dl>

    <dl class="grid grid-cols-2 justify-between gap-0 text-lg font-semibold">
      <dt class="text-lg">{{ $t('order_detail_payment_summary.total') }}</dt>
      <dd class="text-right text-xl" data-testid="order-detail-total">
        {{ formatCurrency(cost.withTax) }}
      </dd>
      <dt class="text-sm text-secondary">
        {{
          includesTax ? $t('global.including_vat') : $t('global.excluding_vat')
        }}
      </dt>
    </dl>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFormatHelpers } from '#storefront/composables'
import type { Order } from '~~/types/order'
import { getShippingCost } from '~/utils/price'

const { cost } = defineProps<{ cost: Order['cost'] }>()

const { formatCurrency } = useFormatHelpers()

const shippingCost = computed(() => {
  return getShippingCost(cost.appliedFees, { includeTax: true })
})

const subtotal = computed(() => cost.withTax - shippingCost.value)

const includesTax = computed(() => !!cost.tax.vat?.amount)
</script>
