<template>
  <div class="inline-flex h-6 items-center rounded border p-px" :style="style">
    <IconHourglass class="ml-1.5 size-2.5" />
    <ClientOnly>
      <template #fallback>
        <div class="mx-1 flex">
          <SFSkeletonLoader
            v-for="n in COUNTDOWN_LOADER_UNITS"
            :key="n"
            type="custom"
            class="mx-1.5 h-3 !w-3.5 rounded-md"
          />
        </div>
      </template>
      <SFFadeInTransition :duration="300">
        <SFCountdown
          :time-until="timeUntil"
          :show-units="true"
          unit-size="short"
        />
      </SFFadeInTransition>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { COUNTDOWN_LOADER_UNITS } from '~~/shared/constants'
import {
  SFCountdown,
  SFFadeInTransition,
  SFSkeletonLoader,
} from '#storefront-ui/components'
import { ClientOnly } from '#components'
import type { PromotionStyle } from '~/utils'

const { colorStyle } = defineProps<{
  timeUntil: string
  colorStyle: PromotionStyle
}>()

const style = computed(() => ({
  ...colorStyle,
  borderColor: colorStyle.color,
  stroke: colorStyle.color,
}))
</script>
