<template>
  <div class="space-y-2.5">
    <SFSkeletonLoader type="custom" class="mb-4 h-6 w-32 rounded" />
    <div class="flex w-full justify-between">
      <SFSkeletonLoader type="custom" class="h-3 w-13 rounded" />
      <SFSkeletonLoader type="custom" class="h-3 w-13 rounded" />
    </div>
    <div class="flex w-full justify-between">
      <SFSkeletonLoader type="custom" class="h-3 w-13 rounded" />
      <SFSkeletonLoader type="custom" class="h-3 w-16 rounded" />
    </div>
    <div class="flex w-full justify-between">
      <SFSkeletonLoader type="custom" class="h-3 w-32 rounded" />
      <SFSkeletonLoader type="custom" class="h-3 w-12 rounded" />
    </div>
    <div class="!mb-4 flex w-full justify-between">
      <SFSkeletonLoader type="custom" class="h-4 w-20 rounded" />
      <SFSkeletonLoader type="custom" class="h-4 w-14 rounded" />
    </div>
    <hr class="mb-4" />
    <div class="flex w-full justify-between">
      <SFSkeletonLoader type="custom" class="h-5 w-15 rounded" />
      <SFSkeletonLoader type="custom" class="h-5 w-15 rounded" />
    </div>
    <SFSkeletonLoader type="custom" class="mb-5 h-2 w-28 rounded" />
    <SFSkeletonLoader type="custom" class="mb-3 h-12 w-full rounded" />
    <SFSkeletonLoader type="custom" class="mb-3 h-6 w-2/3 rounded" />
    <SFSkeletonLoader type="custom" class="mb-3 h-3 w-1/3 rounded" />
  </div>
</template>

<script setup lang="ts">
import { SFSkeletonLoader } from '#storefront-ui/components'
</script>
