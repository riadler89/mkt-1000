<template>
  <section class="space-y-3">
    <div class="flex items-center space-x-1 text-md font-semibold text-primary">
      <span>{{ $t('product_suggestion_list.title') }}</span>
      <span
        class="ml-0.5 inline-flex h-4 items-center rounded-full bg-primary px-2 text-sm leading-none text-gray-100"
      >
        {{ productSuggestions.length }}
      </span>
    </div>
    <ul class="space-y-2" role="presentation">
      <li
        v-for="suggestion in productSuggestions"
        :key="suggestion.productSuggestion.product.id"
        role="presentation"
      >
        <SFProductSuggestion
          role="option"
          :product-suggestion="suggestion"
          @click-result="emit('clickResult', suggestion)"
        />
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
import type { ProductSearchSuggestion } from '@scayle/storefront-nuxt'
import SFProductSuggestion from './SFProductSuggestion.vue'

defineProps<{ productSuggestions: ProductSearchSuggestion[] }>()

const emit = defineEmits<{
  clickResult: [result: ProductSearchSuggestion]
}>()
</script>
