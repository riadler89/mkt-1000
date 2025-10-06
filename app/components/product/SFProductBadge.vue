<template>
  <div
    class="z-10 inline-flex h-6 w-max items-center overflow-hidden rounded-xl bg-white px-2.5 text-sm font-normal capitalize text-primary"
  >
    <template v-if="typeof label === 'string'">
      {{ label }}
    </template>
    <template v-else>
      {{ label.firstLabel }}
      <span class="mx-1 h-full border-r border-gray-200" />
      {{ label.secondLabel }}
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const { text } = defineProps<{ text: string | string[] }>()

const label = computed<string | Record<'firstLabel' | 'secondLabel', string>>(
  () => {
    if (!Array.isArray(text)) {
      return text
    }
    if (text.length === 1) {
      return text[0]!
    }
    const [firstLabel, secondLabel] = text
    return { firstLabel: firstLabel!, secondLabel: secondLabel! }
  },
)
</script>
