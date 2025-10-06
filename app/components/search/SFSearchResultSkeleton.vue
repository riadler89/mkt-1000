<template>
  <div class="space-y-5" data-testid="skeleton">
    <div class="space-y-3">
      <SFSkeletonLoader class="h-3.5" type="headline" />
      <SFSkeletonLoader class="h-16" type="button" full-width />
    </div>
    <div class="space-y-3">
      <SFSkeletonLoader class="h-3.5" type="headline" />
      <SFSkeletonLoader class="h-16" type="button" full-width />
    </div>
    <div class="space-y-3">
      <SFSkeletonLoader class="h-3.5" type="headline" />
      <SFSkeletonLoader class="h-16" type="button" full-width />
    </div>
    <SFSkeletonLoader class="h-3.5" type="button" />
  </div>
</template>

<script lang="ts" setup>
import { SFSkeletonLoader } from '#storefront-ui/components'
</script>
