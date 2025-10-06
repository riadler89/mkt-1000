<template>
  <div class="relative has-[div]:pb-10">
    <progress
      class="block h-1.5 w-full rounded-full border"
      max="100"
      :value="progress"
      :style="progressBarStyle"
    />
    <div
      v-for="({ percent, title, subtitle }, index) in milestones"
      :key="percent"
      class="absolute top-[-5px] flex w-14 flex-col items-center overflow-hidden text-primary last:items-end"
      :style="{
        left: `calc(${percent * 100}% - ${
          index + 1 === milestones?.length ? '56px' : '28px'
        })`,
      }"
    >
      <div
        class="mb-2 flex h-4 w-1 items-center border bg-primary"
        :style="{ background: backgroundColor(percent), 'border-color': color }"
      >
        <div
          class="size-1 bg-white"
          :class="percent === 1 ? '-mx-0.5' : '-mx-px'"
          :style="{ background: backgroundColor(percent) }"
        ></div>
      </div>
      <div class="overflow-hidden truncate text-sm font-bold">{{ title }}</div>
      <div class="overflow-hidden truncate text-sm">{{ subtitle }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { FALLBACK_COLOR } from '~/utils'

interface ProgressMilestone {
  percent: number
  title: string
  subtitle: string
}

const { color = FALLBACK_COLOR, progress } = defineProps<{
  progress: number
  color?: string
  milestones?: ProgressMilestone[]
}>()

const progressBarStyle = computed(() => {
  return {
    backgroundColor: '#fff',
    borderColor: color,
  }
})

const backgroundColor = (percent: number) => {
  return progress >= percent * 100 ? color : 'white'
}
</script>

<style scoped lang="css">
progress::-moz-progress-bar {
  background-color: v-bind(color);
  transition: width 0.3s ease-in-out;
}

progress::-webkit-progress-bar {
  background-color: #fff;
}

progress::-webkit-progress-value {
  background-color: v-bind(color);
  transition: width 0.3s ease-in-out;
}
</style>
