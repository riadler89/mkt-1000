<template>
  <div>
    <div class="flex flex-row items-center justify-between">
      <p class="flex-none basis-1/2 font-bold" data-testid="store-name">
        {{ nameWithIndex }}
      </p>
      <div
        class="flex grow basis-1/2 flex-row flex-nowrap items-center justify-between text-sm font-bold"
      >
        <div class="flex flex-col gap-2">
          <div v-if="distance" class="w-fit rounded-full bg-gray-100 px-2 py-1">
            {{ formatDistance(distance) }}
          </div>
          <div
            v-if="quantity !== undefined"
            class="w-fit rounded-full px-2 py-1"
            data-testid="item-status"
            :class="{
              'bg-status-success': quantity >= 5,
              'bg-status-error': quantity <= 0,
              'bg-status-alert': quantity < 5,
            }"
          >
            {{
              quantity < 5
                ? $t('store_locator.availability.low_stock')
                : $t('store_locator.availability.available')
            }}
          </div>
        </div>
        <SFStoreFavoriteToggle :store-id="id" />
      </div>
    </div>
    <div class="mt-5 flex flex-col space-y-2 text-sm">
      <div class="flex items-center justify-start">
        <div class="mr-2 size-4"><IconLocation /></div>
        <div>
          {{ address.street }} {{ address.houseNumber }} -
          {{ address.zipCode }} {{ address.city }}
        </div>
      </div>
      <div v-if="customData?.phone" class="flex items-center justify-start">
        <div class="mr-2 size-4">
          <IconPhone />
        </div>
        <div>{{ customData.phone }}</div>
      </div>
      <div class="flex items-center justify-start">
        <div class="mr-2 size-4">
          <IconClock />
        </div>
        <div v-if="openingTimes">
          <span class="font-bold">
            {{
              openingTimes.currentlyOpen
                ? $t('store_locator.store_information.store_open')
                : $t('store_locator.store_information.store_closed')
            }}
          </span>
          <span v-if="openingTimes.currentlyOpen">
            {{
              ' ' +
              $t(
                'store_locator.store_information.remaining_open_time',
                closesInTime(openingTimes.minutesUntilClosed),
              )
            }}
          </span>
        </div>
      </div>
    </div>
    <SFStoreOpeningTimesSummary
      v-if="openingTimes"
      :opening-times="openingTimes"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { OpeningTimes, StoreAddress } from '@scayle/omnichannel-nuxt'
import SFStoreFavoriteToggle from './SFStoreFavoriteToggle.vue'
import SFStoreOpeningTimesSummary from './SFStoreOpeningTimesSummary.vue'
import { useFormat } from '~/composables/useFormat'

interface Props {
  id: number
  name: string
  index?: number
  distance?: number
  quantity?: number
  address: StoreAddress
  customData?: Partial<{ phone: string }>
  openingTimes?: OpeningTimes
}

const { index = 0, name } = defineProps<Props>()

const { formatDistance } = useFormat()

const nameWithIndex = computed(() =>
  index > 0 ? `${index}. ${name}` : `${name}`,
)

const closesInTime = (totalMinutes: number) => {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return { hours, minutes }
}
</script>
