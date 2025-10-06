<template>
  <div class="flex flex-col lg:flex-row">
    <div
      class="mx-5 flex flex-col space-y-4 py-9 max-lg:pt-1.5 lg:ml-7 lg:mr-13 lg:w-3/5 lg:items-end lg:space-y-5"
    >
      <div class="mb-1 flex w-full gap-1 lg:mb-2 lg:max-w-2xl">
        <SFSkeletonLoader type="custom" class="h-6 !w-64 rounded" />
        <SFSkeletonLoader type="custom" class="!size-6 rounded" />
      </div>
      <div class="flex w-full flex-col items-end pt-px">
        <SFBasketCardSkeleton
          v-for="i in 2"
          :key="i"
          class="-mt-px lg:min-w-md lg:max-w-2xl"
        />
      </div>
      <SFSkeletonLoader
        type="custom"
        full-width
        class="h-12 rounded-lg lg:max-w-2xl"
      />
    </div>
    <div
      class="border-gray-300 bg-gray-100 px-5 py-9 max-lg:border-t lg:w-2/5 lg:border-l lg:pl-13 lg:pr-7"
    >
      <SFPriceSummarySkeleton class="lg:min-w-64 lg:max-w-[350px]" />
    </div>
  </div>
</template>

<script setup lang="ts">
import SFPriceSummarySkeleton from './SFPriceSummarySkeleton.vue'
import SFBasketCardSkeleton from './SFBasketCardSkeleton.vue'
import { SFSkeletonLoader } from '#storefront-ui/components'
</script>
