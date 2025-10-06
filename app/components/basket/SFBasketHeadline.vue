<template>
  <SFHeadline
    tag="h1"
    class="w-full gap-1 font-semibold lg:max-w-2xl lg:font-medium"
    data-testid="headline"
    :aria-label="$t('basket_page.a11y.title', count)"
  >
    {{ $t('basket_page.title') }}
    <span
      class="ml-1 inline-flex h-4.5 items-center rounded-full bg-primary px-2 text-sm font-semibold leading-4 text-white"
    >
      {{ count }}
    </span>
  </SFHeadline>
</template>

<script setup lang="ts">
import { SFHeadline } from '#storefront-ui/components'

const { count } = defineProps<{ count: number }>()
</script>
