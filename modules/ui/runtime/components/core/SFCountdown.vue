<template>
  <div class="flex px-1.5 text-sm">
    <div v-if="days" class="flex text-center font-semibold">
      <div class="inline-flex">
        <span class="tabular-nums">
          {{ days.toString().padStart(2, '0') }}
        </span>
        <span v-if="showUnits">
          <span>{{ renderUnit($t(`global.days`)) }}</span>
        </span>
        &nbsp;
      </div>
    </div>

    <div class="flex text-center font-semibold">
      <div class="inline-flex">
        <span class="tabular-nums">
          {{ hours.toString().padStart(2, '0') }}
        </span>
        <span v-if="showUnits">
          <span>{{ renderUnit($t(`global.hours`)) }}</span>
        </span>
        &nbsp;
      </div>
    </div>

    <div class="flex text-center font-semibold">
      <div class="inline-flex">
        <span class="tabular-nums">
          {{ minutes.toString().padStart(2, '0') }}
        </span>
        <span v-if="showUnits">
          <span>{{ renderUnit($t(`global.minutes`)) }}</span>
        </span>
        &nbsp;
      </div>
    </div>

    <div v-if="days === 0" class="flex text-center font-semibold">
      <div class="inline-flex">
        <span class="tabular-nums">
          {{ seconds.toString().padStart(2, '0') }}
        </span>
        <span v-if="showUnits">
          <span>{{ renderUnit($t(`global.seconds`)) }}</span>
        </span>
        &nbsp;
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useIntervalFn } from '@vueuse/core'
import { computed, ref } from 'vue'
import { DAY, HOURS, MINUTE, SECOND } from '~~/shared/constants/time'

const {
  showUnits = false,
  unitSize = 'long',
  timeUntil,
} = defineProps<{
  /**
   * ISO date string representing the target date and time for the countdown.
   */
  timeUntil: string
  /**
   * Whether to display unit labels (days, hours, minutes, seconds) next to the numbers.
   */
  showUnits?: boolean
  /**
   * Length of unit labels. Short uses single letters (D, H, M, S), long uses full words.
   */
  unitSize?: 'short' | 'long'
}>()

const emit = defineEmits<{ finished: [] }>()

const until = computed(() => Date.parse(timeUntil))

const renderUnit = (unit: string) => {
  return unitSize === 'short' ? unit.substring(0, 1).toUpperCase() : unit
}

const remaining = ref(until.value - Date.now())
const updateRemaining = () => {
  remaining.value = until.value - Date.now()
}
const { pause } = useIntervalFn(
  () => {
    updateRemaining()
    if (remaining.value <= 0) {
      emit('finished')
      pause()
    }
  },
  SECOND,
  { immediateCallback: true },
)
const days = computed(() =>
  Math.floor(remaining.value / (SECOND * MINUTE * HOURS * DAY)),
)
const hours = computed(() =>
  Math.floor((remaining.value / (SECOND * MINUTE * HOURS)) % DAY),
)
const minutes = computed(() =>
  Math.floor((remaining.value / SECOND / MINUTE) % HOURS),
)
const seconds = computed(() => Math.floor((remaining.value / SECOND) % MINUTE))
</script>
