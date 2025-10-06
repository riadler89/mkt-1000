<template>
  <SFLocalizedLink
    :to="routeList.home"
    raw
    :aria-label="shopName"
    @click="scrollToTop"
  >
    <IconLogo class="size-7" />
  </SFLocalizedLink>
</template>

<script setup lang="ts">
import SFLocalizedLink from './SFLocalizedLink.vue'
import { useNuxtApp } from '#app/nuxt'
import { routeList } from '~/utils/route'
import { useRoute } from '#imports'
import { useRouteHelpers } from '~/composables'

const {
  $config: {
    public: { shopName },
  },
} = useNuxtApp()

const { getLocalizedRoute } = useRouteHelpers()

const route = useRoute()

// Scrolls to the top of the page smoothly on logo link click if the current route is the home page
const scrollToTop = () => {
  if (route.fullPath !== getLocalizedRoute(routeList.home)) {
    return
  }
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>
