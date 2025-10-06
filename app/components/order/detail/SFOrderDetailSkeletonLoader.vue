<template>
  <div>
    <div class="mb-5 flex items-center justify-between xl:mb-7">
      <div class="flex items-center gap-2">
        <SFSkeletonLoader type="custom" class="size-10 rounded-full" />
        <SFSkeletonLoader type="custom" class="h-6 w-28 rounded-md" />
        <SFSkeletonLoader type="custom" class="h-6 w-14 rounded-md" />
      </div>
      <SFSkeletonLoader type="custom" class="h-5 w-20 rounded-md" />
    </div>
    <div class="grid grid-cols-1 gap-4 *:rounded-lg lg:grid-cols-2">
      <SFSkeletonLoader type="custom" class="h-20 pb-1" />
      <SFSkeletonLoader type="custom" class="h-20 pb-1" />
      <SFSkeletonLoader type="custom" class="h-36 pb-1" />
      <SFSkeletonLoader type="custom" class="h-36 pb-1" />
    </div>
    <SFSkeletonLoader type="custom" class="my-6 h-14 rounded-lg" full-width />
    <div
      v-for="n in 2"
      :key="`product-order-item-loading-${n}`"
      class="mb-3 h-32"
    >
      <div class="flex gap-4">
        <SFSkeletonLoader type="custom" class="size-20 rounded-lg" />
        <div class="*:h-2.5 *:rounded-sm">
          <SFSkeletonLoader type="custom" class="mb-2 w-20 pb-2" />
          <SFSkeletonLoader type="custom" class="mb-4 w-40" />
          <SFSkeletonLoader type="custom" class="mb-2.5 w-12 pb-0.5" />
          <SFSkeletonLoader type="custom" class="mb-2.5 w-20 pb-0.5" />
          <SFSkeletonLoader type="custom" class="w-20" />
        </div>
      </div>
      <div class="flex justify-end">
        <SFSkeletonLoader type="custom" class="h-3.5 w-13 rounded-sm" />
      </div>
    </div>
    <hr class="my-6 h-px bg-gray-300" aria-hidden="true" />
    <div class="flex justify-between">
      <div class="*:rounded-sm">
        <SFSkeletonLoader type="custom" class="mb-2.5 h-3.5 w-20" />
        <SFSkeletonLoader type="custom" class="mb-2.5 h-3.5 w-24 pb-1" />
        <SFSkeletonLoader type="custom" class="mb-1 h-6 w-28" />
        <SFSkeletonLoader type="custom" class="h-2.5 w-20 pb-0.5" />
      </div>
      <div class="flex flex-col items-end *:rounded-sm">
        <SFSkeletonLoader type="custom" class="mb-2.5 h-3.5 w-14" />
        <SFSkeletonLoader type="custom" class="mb-2.5 h-3.5 w-24 pb-1" />
        <SFSkeletonLoader type="custom" class="h-6 w-16" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SFSkeletonLoader } from '#storefront-ui/components'
</script>
