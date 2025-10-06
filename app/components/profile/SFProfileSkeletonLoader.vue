<template>
  <div>
    <div class="mb-5 flex flex-col items-start gap-2 *:rounded-md xl:mb-7">
      <SFSkeletonLoader type="custom" class="mb-4 h-6 w-52" />
      <SFSkeletonLoader type="custom" class="h-4 w-40" />
      <SFSkeletonLoader type="custom" class="h-4 w-full max-w-md" />
    </div>
    <div class="grid grid-cols-1 gap-4 *:rounded-xl lg:grid-cols-2">
      <SFSkeletonLoader type="custom" class="col-span-full h-44" />
      <SFSkeletonLoader type="custom" class="h-[31.125rem]" />
      <SFSkeletonLoader type="custom" class="h-[31.125rem]" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { SFSkeletonLoader } from '#storefront-ui/components'
</script>
