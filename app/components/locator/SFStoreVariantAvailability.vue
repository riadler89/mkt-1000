<template>
  <div
    class="mt-4 flex items-center rounded-lg border border-gray-400 p-5"
    data-testid="store-variant-availability-component"
  >
    <div v-if="!!selectedStoreData">
      <div class="flex items-start space-x-2">
        <div
          class="mt-2 size-2 rounded-full"
          :class="
            selectedStoreData.available
              ? 'bg-status-success'
              : 'bg-status-error'
          "
        />
        <div class="flex flex-col">
          <SFHeadline size="lg" tag="h2" is-bold class="leading-6">
            {{
              selectedStoreData.available
                ? $t('store_locator.availability.available')
                : $t('store_locator.availability.not_available')
            }}
          </SFHeadline>
          <div class="text-sm">
            {{ selectedStoreData.storeName }}
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <h2
        class="font-bold text-black"
        data-testid="store-availability-headline"
      >
        {{ $t('store_variant_availability.store_availability') }}
      </h2>
      <p class="text-sm text-primary" data-testid="store-availability-subline">
        {{ $t('store_variant_availability.store_availability_subline') }}
      </p>
    </div>
    <SFButton
      data-testid="button-open-store-flyout"
      variant="secondary"
      class="ml-auto !normal-case"
      rounded
      @click="toggleStoreLocator"
    >
      {{
        mounted && selectedStoreId
          ? $t('store_variant_availability.change_store')
          : $t('store_variant_availability.choose_store')
      }}
    </SFButton>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { useMounted } from '@vueuse/core'
import { useStoreLocator } from '#omnichannel/composables'
import { useSlideIn } from '#storefront-ui/composables'
import { SFButton, SFHeadline } from '#storefront-ui/components'

type StoreVariantInfo = {
  available: boolean
  storeName: string
}
const mounted = useMounted()
const { storeVariantData, refreshStoreVariant } = useStoreLocator(
  'useStoreLocator',
  ['openingTimes'],
)

const { toggle: toggleStoreLocator } = useSlideIn('StoreLocatorSlideIn')

const { selectedStoreId, variantId } = defineProps<{
  selectedStoreId?: number
  variantId: number
}>()

const selectedStoreData = computed<StoreVariantInfo | undefined>(() => {
  if (!storeVariantData.value) {
    return
  }

  return {
    available: !!storeVariantData.value.items.length,
    storeName: storeVariantData.value.name,
  }
})

watch(
  [() => selectedStoreId, () => variantId],
  ([storeId, variantId]) => {
    if (variantId && storeId) {
      refreshStoreVariant(variantId, storeId)
    }
  },
  { immediate: true },
)
</script>
