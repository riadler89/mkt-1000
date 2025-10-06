<template>
  <div
    class="w-min max-w-full truncate rounded-sm p-1 text-sm leading-none"
    :style="style"
  >
    {{ text }}
  </div>
</template>

<script setup lang="ts">
import { FALLBACK_PROMOTION_COLORS, type PromotionStyle } from '~/utils'

const {
  text,
  style = {
    backgroundColor: FALLBACK_PROMOTION_COLORS.background,
    color: FALLBACK_PROMOTION_COLORS.text,
  },
} = defineProps<{
  text: string
  style?: PromotionStyle
}>()
</script>
