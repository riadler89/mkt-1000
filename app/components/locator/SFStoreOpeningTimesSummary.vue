<template>
  <details class="mt-5 rounded bg-gray-200 px-2">
    <summary
      class="flex-row-reverse text-sm !normal-case"
      @click.stop
      @keydown.enter.stop
    >
      {{ $t('store_locator.store_information.opening_hours') }}
    </summary>
    <div class="pb-2">
      <div v-for="day in DAYS" :key="day" class="mb-1">
        <div class="flex items-center justify-between">
          <div class="grow capitalize">
            {{ getWeekdayName(day) }}
          </div>
          <div class="flex w-24 flex-col text-justify">
            <div v-if="!openingTimes[day].length">
              {{ $t('store_locator.store_information.store_closed') }}
            </div>
            <div v-else>
              <div v-for="(time, idx) in openingTimes[day]" :key="idx">
                {{ time.timeFrom }} - {{ time.timeUntil }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </details>
</template>
<script setup lang="ts">
import type { OpeningTimes } from '@scayle/omnichannel-nuxt'
import { useCurrentShopLocale } from '~/composables/useCurrentShopLocale'

defineProps<{ openingTimes: OpeningTimes }>()

type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun'
const DAYS: DayOfWeek[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']

const locale = useCurrentShopLocale()
const dateFormatter = Intl.DateTimeFormat(locale.value, { weekday: 'long' })
const getWeekdayName = (day: DayOfWeek) => {
  // July 2024 starts with a Monday.
  // Using this date we can use the index of day + 1 to access the correct weekday.
  // The formatter will then only return the weekday name.
  return dateFormatter.format(new Date(2024, 6, DAYS.indexOf(day) + 1))
}
</script>
