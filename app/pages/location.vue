<template>
  <div class="relative">
    <div class="h-[calc(100vh-220px)] w-full">
      <SFStoreLocatorMap
        v-model:selected-store-id="selectedStoreId"
        :stores="stores"
        :api-key="googleMapsKey"
      />
    </div>
    <div
      class="absolute inset-0 w-[480px] max-w-screen overflow-auto md:inset-10 md:rounded"
      :class="{
        'm-auto h-[230px]': !stores.length,
        'bg-gray-100': stores.length,
      }"
    >
      <div
        class="flex flex-col items-stretch justify-between rounded bg-white p-5"
        :class="{ shadow: stores.length }"
      >
        <SFHeadline :is-uppercase="false" size="xl" tag="h1" class="mb-5">
          {{ $t('location_page.title') }}
        </SFHeadline>
        <p class="mb-5 text-sm">{{ $t('location_page.subline') }}</p>
        <div class="mt-3 flex items-center justify-evenly">
          <SFButton
            class="mr-2 flex size-12 cursor-pointer items-center justify-center border-2 border-black"
            variant="raw"
            :disabled="searching"
            :aria-label="$t('store_locator.detect_location_label')"
            @click="findStoresInUserLocation()"
          >
            <IconLocation class="size-8" />
          </SFButton>

          <SFTextInput
            v-model="searchAddress"
            data-testid="location-text-input"
            type="text"
            required
            :readonly="searching"
            :placeholder="$t('store_locator.search_store_input_placeholder')"
            @keydown.enter="
              !searching && searchAddress.length && searchForStores()
            "
          />
          <SFButton
            variant="primary"
            class="ml-2 max-w-28"
            data-testid="location-search-button"
            :disabled="!searchAddress?.length || searching"
            :loading="searching"
            @click="searchForStores()"
          >
            {{ $t('global.search') }}
          </SFButton>
        </div>
      </div>
      <SFStoreList
        v-if="stores.length"
        v-model:selected-store-id="selectedStoreId"
        :stores="stores"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useSeoMeta, definePageMeta } from '#imports'
import { useToast } from '~/composables/useToast'
import { useStoreLocator } from '#omnichannel/composables'
import { useRuntimeConfig } from '#app'
import { useI18n } from '#i18n'
import { SFHeadline, SFButton, SFTextInput } from '#storefront-ui/components'
import SFStoreLocatorMap from '~/components/locator/SFStoreLocatorMap.vue'
import SFStoreList from '~/components/locator/SFStoreList.vue'

const { t } = useI18n()

const config = useRuntimeConfig()
const googleMapsKey = config.public.googleMapsApiKey
const { storesData, refreshStores } = useStoreLocator('useStoreLocator', [
  'openingTimes',
])

const stores = computed(() => storesData.value ?? [])

const selectedStoreId = ref<number | undefined>(undefined)
const searching = ref<boolean>(false)

const searchAddress = ref('')
const searchRadius = ref(5000)

const toast = useToast()

const searchForStores = async () => {
  searching.value = true
  try {
    await refreshStores({
      filters: { address: searchAddress.value, radius: searchRadius.value },
    })
    // eslint-disable-next-line no-empty
  } catch {}

  searching.value = false
}

const getClientLocation = (): Promise<GeolocationPosition> =>
  new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('Geolocation is not available.'))
    }

    // eslint-disable-next-line sonarjs/no-intrusive-permissions
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve(pos)
      },
      (err) => {
        reject(err)
      },
    )
  })

const findStoresInUserLocation = async () => {
  searchAddress.value = ''
  searching.value = true

  try {
    const { coords } = await getClientLocation()

    await refreshStores({
      filters: {
        radius: 10000,
        geoPoint: {
          lat: coords.latitude,
          lng: coords.longitude,
        },
      },
    })
  } catch (e) {
    if (e instanceof GeolocationPositionError) {
      const msg =
        e.code === GeolocationPositionError.PERMISSION_DENIED
          ? t('location_page.geolocation.error.permission_denied')
          : t('location_page.geolocation.error.unknown')
      toast.show(msg, { action: 'CONFIRM' })
    }
  }
  searching.value = false
}

useSeoMeta({ robots: 'index,follow', title: t('location_page.title') })

defineOptions({ name: 'LocationPage' })
definePageMeta({ pageType: 'location_page' })
</script>
