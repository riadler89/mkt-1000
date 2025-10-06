<template>
  <div class="flex flex-col text-primary">
    <span
      v-if="brand"
      class="text-md font-semibold"
      data-testid="order-detail-product-brand"
    >
      {{ brand }}
    </span>
    <span class="text-sm" data-testid="order-detail-product-name">
      {{ name }}
    </span>
  </div>
  <ul class="flex flex-col gap-1 text-sm text-secondary">
    <li v-if="color" class="flex gap-1">
      <span class="font-medium" data-testid="order-detail-product-color">
        {{ $t('product_attribute.color') }}:
      </span>
      <span>{{ color }}</span>
    </li>
    <li class="flex gap-1">
      <span class="font-medium" data-testid="order-detail-product-size">
        {{ $t('product_attribute.size') }}:
      </span>
      <span>{{ size }}</span>
    </li>
    <li class="flex gap-1">
      <span class="font-medium" data-testid="order-detail-product-quantity">
        {{ $t('global.quantity') }}:
      </span>
      <span>{{ quantity }}</span>
    </li>
  </ul>
</template>

<script setup lang="ts">
const { name, color, brand, size } = defineProps<{
  name: string
  quantity: number
  size: string
  brand?: string
  color?: string
}>()
</script>
