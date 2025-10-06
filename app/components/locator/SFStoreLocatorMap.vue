<template>
  <div ref="googleMapContainer" class="size-full"></div>
</template>

<script setup lang="ts">
import {
  getCurrentInstance,
  h,
  onMounted,
  ref,
  render,
  toRaw,
  watch,
} from 'vue'
import { Loader } from '@googlemaps/js-api-loader'
import type { StoreLocation } from '@scayle/omnichannel-nuxt'

import SFStoreDetailsComponent from './SFStoreDetails.vue'

const appContext = getCurrentInstance()?.appContext

const { apiKey, stores } = defineProps<{
  stores: StoreLocation[]
  apiKey: string
}>()

const selectedStoreId = defineModel<number | undefined>('selectedStoreId', {
  type: Number,
  default: undefined,
})

const mapSettings = {
  clickableIcons: false,
  streetViewControl: false,
  gestureHandling: 'cooperative',
  mapTypeControl: false,
  zoom: 7,
  minZoom: 7,
  maxZoom: 15,
  mapId: 'DEMO_MAP_ID',
  center: {
    lat: 53.550734392966135,
    lng: 9.993024893651084,
  },
}

const googleMapContainer = ref<HTMLElement>()
const map = ref<google.maps.Map>()
const infoWindows = ref<{ [key: number]: google.maps.InfoWindow }>({})
const markers = ref<{
  [key: number]: google.maps.marker.AdvancedMarkerElement
}>({})

onMounted(async () => {
  // import all required google map api classes
  await new Loader({
    apiKey,
    libraries: ['marker', 'maps', 'core'],
  }).load()

  // init google map
  map.value = new google.maps.Map(googleMapContainer.value!, mapSettings)

  watch(
    () => stores,
    () => {
      if (!import.meta.server && window.google) {
        removeOldMarkers()
        setMarkers()
      }
    },
    { immediate: true },
  )

  watch(
    () => selectedStoreId.value,
    (storeId) => {
      selectStoreMarker(storeId)
    },
    { immediate: true },
  )
})

const removeOldMarkers = () => {
  Object.values(markers.value).forEach((marker) => (marker.map = null))
  Object.values(infoWindows.value).forEach((info) => info.close())

  markers.value = {}
  infoWindows.value = {}
}

const setMarkers = () => {
  const bounds = new google.maps.LatLngBounds()

  stores.forEach((store: StoreLocation) => {
    // map marker represents an arrow on the google map
    const marker = new google.maps.marker.AdvancedMarkerElement({
      map: toRaw(map.value), // Important: If the Map is proxied, it will not work
      title: store.name,
      position: store.geoPoint,
      content: getMarkerIconElement(),
    })

    // infoWindow is a tooltip above the map marker, which shows the name of the store
    const infoWindow = new google.maps.InfoWindow({
      content: getInfoWindowMarkup(store),
    })

    marker.addListener('click', () => {
      if (selectedStoreId.value === store.id) {
        selectedStoreId.value = undefined
      } else {
        selectedStoreId.value = store.id
      }
    })

    infoWindow.addListener('closeclick', () => {
      selectedStoreId.value = undefined
    })

    // set the position of the google map, to make all markers visible
    const position = marker.position
    if (position) {
      bounds.extend(position)
      map.value!.fitBounds(bounds, { left: 500, top: 0, right: 300, bottom: 0 })
    }

    // save infoWindows & markers for later access
    infoWindows.value[store.id] = infoWindow
    markers.value[store.id] = marker
  })
}

const getMarkerIconElement = () => {
  const markerIcon = document.createElement('img')
  markerIcon.src = '/icons/map_marker.svg'
  return markerIcon
}

const getInfoWindowMarkup = (store: StoreLocation) => {
  const child = h(SFStoreDetailsComponent, { store })
  child.appContext = appContext ?? null
  const el = document.createElement('div')
  render(child, el)
  const html = el.innerHTML
  render(null, el)

  return html
}

const selectStoreMarker = (storeId: number | undefined) => {
  // close all info windows
  Object.values(infoWindows.value).forEach((infoWindow) => infoWindow.close())

  if (storeId === undefined) {
    return
  }

  const infoWindow = infoWindows.value[storeId]
  const marker = markers.value[storeId]

  if (infoWindow && marker) {
    infoWindow.open({ anchor: marker, map: map.value })
  }
}
</script>
