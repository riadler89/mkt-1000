<template>
  <div
    class="px-5 text-2xl font-medium md:inset-x-0 md:m-auto md:max-w-screen-xl md:px-4"
  >
    <div class="md:divide-y">
      <SFAccordionEntry
        v-for="[key, values] in filteredAttributeGroups"
        :id="`${key}`"
        :key="key"
      >
        <template #title>
          <h2>
            {{ types.get(key) }}
          </h2>
        </template>
        <div class="flex flex-col gap-2">
          <div v-if="key === 'design' && description" class="mb-2">
            {{ description }}
          </div>
          <ul v-for="value in values" :key="value">
            <li class="flex items-center gap-2 leading-none">
              <div class="size-1 rounded-full bg-black" />
              {{ value }}
            </li>
          </ul>
        </div>
      </SFAccordionEntry>
      <SFAccordionEntry
        id="product-details-shipping"
        :title="$t('product_details.shipping_return_heading.title')"
      >
        <div class="mb-8">
          {{ $t('product_details.shipping_return_heading.general_info') }}
        </div>
        <div class="mb-1 font-semibold">
          {{ $t('product_details.shipping_return_heading.dhl_headline') }}
        </div>
        <div class="mb-8">
          {{ $t('product_details.shipping_return_heading.dhl_paragraph') }}
        </div>
        <div class="mb-1 font-semibold">
          {{ $t('product_details.shipping_return_heading.hermes_headline') }}
        </div>
        <div class="mb-8">
          {{ $t('product_details.shipping_return_heading.hermes_paragraph') }}
        </div>
        <div>
          {{ $t('product_details.shipping_return_heading.return_information') }}
        </div>
      </SFAccordionEntry>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@scayle/storefront-nuxt'
import { useProductBaseInfo } from '~/composables/useProductBaseInfo'
import { SFAccordionEntry } from '#storefront-ui/components'
import { getFilteredAttributeGroups } from '#storefront-product-detail'
import { useI18n } from '#i18n'

const { t } = useI18n()

const { product } = defineProps<{ product: Product }>()

// This Map combines dynamic usage of translations and still keeps the static values of the translation keys.
const types = new Map<string, string>([
  ['fit_size', t('product_details.information.fit_size')],
  ['extras', t('product_details.information.extras')],
  ['design', t('product_details.information.design')],
])

const { description } = useProductBaseInfo(() => product)
const filteredAttributeGroups = computed(
  () =>
    product.attributes &&
    getFilteredAttributeGroups(product.attributes, types.keys().toArray()),
)
</script>
