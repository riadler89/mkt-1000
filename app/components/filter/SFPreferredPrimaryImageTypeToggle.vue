<template>
  <div class="flex flex-wrap" data-testid="mobile-sort-wrapper">
    <SFButton
      variant="raw"
      raw
      class="mb-2 mr-2 flex h-10 w-fit items-center justify-center whitespace-pre rounded-full border-2 border-transparent bg-gray-100 px-4 text-md font-semibold text-secondary transition-none"
      :class="{
        '!border-accent bg-white !text-accent': !selectedPrimaryImageType,
      }"
      @click="selectedPrimaryImageType = undefined"
    >
      {{ $t('preferred_primary_image_type_toggle.default') }}
    </SFButton>
    <SFButton
      v-for="imageType in primaryImageTypeOptions"
      :key="imageType.id"
      variant="raw"
      raw
      class="mb-2 mr-2 flex h-10 w-fit items-center justify-center whitespace-pre rounded-full border-2 border-transparent bg-gray-100 px-4 text-md font-semibold text-secondary transition-none"
      :class="{
        '!border-accent bg-white !text-accent':
          imageType.id === selectedPrimaryImageType?.id,
      }"
      @click="selectedPrimaryImageType = imageType"
    >
      {{ imageType.label }}
    </SFButton>
  </div>
</template>

<script setup lang="ts">
import type { Value } from '@scayle/storefront-nuxt'
import { SFButton } from '#storefront-ui/components'

const { primaryImageTypeOptions } = defineProps<{
  primaryImageTypeOptions: Value[]
}>()

const selectedPrimaryImageType = defineModel<Value | undefined>(
  'selectedPrimaryImageType',
)
</script>
