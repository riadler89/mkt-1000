<template>
  <!--
   We need to wait until the component is mounted to avoid hydration issues,
   because the basket could be loaded on the client before hydration is finished
  -->
  <div
    v-if="isProductAddedToBasket && !isBasketPage && mounted"
    class="h-4 w-fit self-end rounded-tl-md bg-secondary px-2 text-sm font-medium text-gray-200"
    v-bind:="$attrs"
  >
    {{ $t('badge_labels.already_in_basket') }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@scayle/storefront-nuxt'
import { useMounted } from '@vueuse/core'
import { routeList } from '~/utils'
import { useLocalePath } from '#i18n'
import { useRoute } from '#app/composables/router'
import { useBasket } from '#storefront/composables'

const { product } = defineProps<{
  product: Product
}>()

const route = useRoute()
const localePath = useLocalePath()

const { data: basketData } = useBasket()

const isProductAddedToBasket = computed(() => {
  return (basketData.value?.items ?? []).some((item) => {
    return item.product.id === product.id
  })
})

const isBasketPage = computed(() => route.path === localePath(routeList.basket))
const mounted = useMounted()
</script>
