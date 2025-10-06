<template>
  <div
    class="flex w-full border border-gray-300 p-3 max-lg:border-x-0 max-lg:px-0 lg:first:rounded-t-xl lg:last:rounded-b-xl"
  >
    <div>
      <SFSkeletonLoader type="custom" class="h-48 w-36 shrink-0 rounded-lg" />
      <SFSkeletonLoader
        type="custom"
        class="mt-2.5 h-10 w-24 rounded lg:hidden"
      />
    </div>
    <div class="ml-5 flex grow justify-between gap-1">
      <div>
        <SFSkeletonLoader type="custom" class="mt-3.5 h-3 w-12 rounded" />
        <SFSkeletonLoader type="custom" class="mt-1 h-4 w-28 rounded lg:w-36" />
        <div class="mt-7">
          <div class="flex space-x-1">
            <SFSkeletonLoader type="custom" class="h-3 w-9 rounded" />
            <SFSkeletonLoader type="custom" class="h-3 w-10 rounded" />
          </div>
          <div class="mt-1 flex space-x-1">
            <SFSkeletonLoader type="custom" class="h-3 w-7 rounded" />
            <SFSkeletonLoader type="custom" class="h-3 w-7 rounded" />
          </div>
        </div>
      </div>
      <div class="mt-2 flex flex-col justify-between">
        <div class="flex justify-end gap-x-2">
          <SFSkeletonLoader
            type="custom"
            class="h-8 w-20 rounded max-lg:hidden"
          />
          <SFSkeletonLoader type="custom" class="size-8 rounded" />
        </div>
        <div class="flex flex-col items-end">
          <SFSkeletonLoader type="custom" class="h-4 w-10 rounded" />
          <SFSkeletonLoader type="custom" class="mt-1 h-3 w-16 rounded" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { SFSkeletonLoader } from '#storefront-ui/components'
</script>
