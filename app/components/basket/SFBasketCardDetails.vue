<template>
  <div class="text-md leading-none lg:text-sm">
    <div class="flex space-x-1">
      <span class="font-semibold text-secondary" data-testid="main-label">
        {{ $t('product_attribute.size') }}:
      </span>
      <span class="font-normal text-secondary" data-testid="sub-label">
        {{ size }}
      </span>
    </div>
    <div class="mt-1 flex space-x-1">
      <span class="font-semibold text-secondary" data-testid="main-label">
        {{ $t('product_attribute.color') }}:
      </span>
      <span class="font-normal text-secondary" data-testid="sub-label">
        {{ color }}
      </span>
    </div>
    <div v-if="isQuantityShown" class="mt-1 flex space-x-1">
      <span class="font-semibold text-secondary" data-testid="main-label">
        {{ $t('global.quantity') }}:
      </span>
      <span class="font-normal text-secondary" data-testid="sub-label">
        {{ item.quantity }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  type BasketItem,
  getAttributeValueTuples,
  getFirstAttributeValue,
} from '@scayle/storefront-nuxt'

const { item, isQuantityShown = false } = defineProps<{
  item: BasketItem
  isQuantityShown?: boolean
}>()

const size = getFirstAttributeValue(item.variant.attributes, 'size')?.label
const color = getAttributeValueTuples(item.product.attributes, 'color')
  .map((color) => color.label)
  .join('/')
</script>
