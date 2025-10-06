<template>
  <div data-testid="product-badges" class="flex flex-col">
    <SFProductBadge v-if="labels.length" :text="labels" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { type Product, getFirstAttributeValue } from '@scayle/storefront-nuxt'
import SFProductBadge from '../../SFProductBadge.vue'
import { useI18n } from '#i18n'

const { product } = defineProps<{ product: Product }>()

const { t } = useI18n()

const customAttributes = computed(() => {
  return getFirstAttributeValue(product.attributes, 'storefrontBadge')
})

const labels = computed(() => {
  return [
    product.isNew ? t('badge_labels.new') : null,
    customAttributes.value?.label,
  ].filter((item): item is string => !!item)
})
</script>
