<template>
  <div>
    <div class="mb-5 flex items-center xl:mb-7">
      <SFSkeletonLoader type="custom" class="mr-2 h-6 w-20 rounded-md" />
      <SFSkeletonLoader type="custom" class="size-6 rounded-md" />
    </div>
    <SFSkeletonLoader
      v-for="n in 8"
      :key="`order-item-loader-${n}`"
      type="custom"
      class="mb-6 h-26 w-full rounded-b-lg rounded-t-xl pb-1"
    />
  </div>
</template>

<script setup lang="ts">
import { SFSkeletonLoader } from '#storefront-ui/components'
</script>
