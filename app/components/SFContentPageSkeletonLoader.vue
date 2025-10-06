<template>
  <SFSkeletonLoader type="custom" class="h-96 w-full" />
  <div class="mx-auto grid gap-2 px-8 py-4 md:grid-cols-3 lg:px-40">
    <SFSkeletonLoader
      v-for="n in 15"
      :key="`skeleton-grid-box-${n}`"
      class="h-72"
      full-width
    />
  </div>
  <div class="mt-4 grid w-full grid-cols-12 gap-4 pl-6 md:pl-14">
    <SFProductCardSkeleton
      v-for="n in greater('sm').value ? 4 : 2"
      :key="`product-skeleton-box-${n}`"
      type="custom"
    />
  </div>
</template>

<script setup lang="ts">
import SFProductCardSkeleton from './product/card/SFProductCardSkeleton.vue'
import { SFSkeletonLoader } from '#storefront-ui/components'
import { useDefaultBreakpoints } from '#storefront-ui/composables'

const { greater } = useDefaultBreakpoints()
</script>
