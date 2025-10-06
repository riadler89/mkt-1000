<template>
  <SFSlideIn
    name="StoreLocatorSlideIn"
    slide-class="border-t border-l border-primary xl:inset-y-0 !p-0 bg-gray-100"
  >
    <template #slide-in-header="{ toggle: toggleItem }">
      <div class="bg-white p-5 shadow">
        <div class="flex items-center justify-between">
          <SFHeadline :is-uppercase="false" size="lg" tag="p">
            {{ $t('store_locator_slide_in.headline') }}
          </SFHeadline>
          <SFButton
            variant="raw"
            fab
            data-testid="close-store-locator-slide-in"
            @click="toggleItem"
          >
            <template #icon>
              <IconClose class="size-4" />
            </template>
          </SFButton>
        </div>
        <div>
          <p class="mt-5 text-sm">{{ $t('location_page.subline') }}</p>
        </div>
        <form
          class="mt-3 flex items-center justify-center gap-4"
          @submit.prevent="searchStore"
        >
          <SFTextInput
            v-model="address"
            autocomplete="off"
            :placeholder="$t('store_locator.search_store_input_placeholder')"
            type="text"
            required
            data-testid="store-input"
          />
          <SFButton
            data-testid="search-store-button"
            variant="primary"
            class="max-w-28"
            rounded
            :disabled="!address.length"
            type="submit"
          >
            {{ $t('global.search') }}
          </SFButton>
        </form>
      </div>
    </template>
    <template #slide-in-body>
      <div class="max-h-[calc(100%-250px)] overflow-y-auto scrollbar-hide">
        <div v-if="!stores.length" class="p-5">
          {{ $t('store_locator_slide_in.no_results') }}
        </div>
        <SFStoreList
          v-else
          v-model:selected-store-id="currentSelectedStoreId"
          :stores="stores"
          class="mt-5"
        />
        <div />
      </div>
    </template>
    <template #slide-in-actions>
      <SFButton
        data-testid="choose-store-button"
        variant="primary"
        is-full-width
        class="w-fit rounded border border-black p-2 text-sm !normal-case"
        rounded
        :disabled="stores.length === 0 || currentSelectedStoreId === undefined"
        @click="selectStore"
      >
        {{ $t('store_locator_slide_in.select_store') }}
      </SFButton>
    </template>
  </SFSlideIn>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { StoreLocation } from '@scayle/omnichannel-nuxt'
import SFStoreList from './SFStoreList.vue'
import { useStoreLocator } from '#omnichannel/composables'
import { useSlideIn } from '~~/modules/ui/runtime/composables/useSlideIn'
import {
  SFTextInput,
  SFHeadline,
  SFButton,
  SFSlideIn,
} from '#storefront-ui/components'

const { variantId } = defineProps<{ variantId: number }>()

const { variantStoresData, refreshVariantStores } = useStoreLocator(
  'useStoreLocator',
  ['openingTimes'],
)
const { toggle: toggleStoreLocator } = useSlideIn('StoreLocatorSlideIn')

const address = ref('')

const selectedStoreId = defineModel<number | undefined>('selectedStoreId', {
  type: Number,
  default: undefined,
})

const currentSelectedStoreId = ref<number | undefined>(undefined)

const searchStore = async () => {
  await refreshVariantStores({
    variantId,
    filters: { address: address.value },
  })
}

const stores = computed(
  () => (variantStoresData.value?.stores as StoreLocation[]) ?? [],
)

const selectStore = () => {
  selectedStoreId.value = currentSelectedStoreId.value
  toggleStoreLocator()
}
</script>
