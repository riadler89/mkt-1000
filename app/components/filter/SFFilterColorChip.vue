<template>
  <div class="relative flex w-13 flex-col items-center gap-2">
    <div class="group relative">
      <input
        :aria-label="
          $t('filter_color_chip.select_color', { color: color.name })
        "
        :data-color-id="color.id"
        :value="color"
        class="absolute z-10 size-full cursor-pointer appearance-none rounded-lg"
        type="checkbox"
        data-testid="filter-color-chip"
      />
      <div class="relative flex size-10 items-center justify-center">
        <span
          v-if="hasMixedColors"
          class="absolute grid size-full grid-cols-2 overflow-hidden rounded-lg lg:group-hover:border lg:group-hover:border-black lg:group-hover:outline lg:group-hover:outline-2 lg:group-hover:outline-offset-[-3px] lg:group-hover:outline-white"
        >
          <span
            v-for="(hex, index) in colorCode"
            :key="`${index}-${hex}`"
            :style="{ backgroundColor: hex }"
            :class="{
              'last-of-type:col-span-full': isNumberOfMixColorsOdd,
              'border border-gray-500': isBrightColor,
            }"
            class="size-full"
          />
        </span>
        <span
          v-else
          :style="{ backgroundColor: `${colorCode}` }"
          class="absolute size-full rounded-lg lg:group-hover:border lg:group-hover:border-black lg:group-hover:outline lg:group-hover:outline-2 lg:group-hover:outline-offset-[-3px] lg:group-hover:outline-white"
          :class="{ 'border border-gray-500': isBrightColor }"
        />

        <IconCheck
          class="z-0 size-5 text-white opacity-0 lg:group-hover:opacity-100"
          :class="{ '!text-black': isBrightColor, 'opacity-100': isChecked }"
        />
      </div>
    </div>

    <div
      class="max-w-full truncate text-center text-sm font-medium text-secondary"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Color from 'color'
import type { AttributesFilterValue } from '@scayle/storefront-nuxt'
import { ProductColor } from '~~/shared/constants/product'

const { isChecked = false, color } = defineProps<{
  color: AttributesFilterValue
  isChecked?: boolean
}>()

const colorCode = computed(() => ProductColor[color.value])

const isBrightColor = computed(() => Color(colorCode.value).luminosity() > 0.7)

const hasMixedColors = computed(() => Array.isArray(colorCode.value))

const isNumberOfMixColorsOdd = computed<boolean>(() => {
  if (!hasMixedColors.value || !colorCode.value) {
    return false
  }
  return colorCode.value.length % 2 !== 0
})
</script>
