<template>
  <div class="flex items-center justify-start gap-x-3">
    <SFLocalizedLink
      v-for="({ to, title, active }, index) in tabs"
      :key="`${title}-${index}`"
      class="inline-block w-fit rounded-md px-2 py-1.5 text-lg font-semibold tracking-tighter text-secondary duration-300 ease-out hover:bg-gray-200 focus-visible:transition-none"
      :data-testid="`account-area-tab-${index}`"
      :class="{ 'bg-gray-200 text-primary': active }"
      :to="to"
      raw
    >
      <h2>{{ title }}</h2>
    </SFLocalizedLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import SFLocalizedLink from '../SFLocalizedLink.vue'
import type { RouteLocationRaw } from '#vue-router'
import { routeList } from '~/utils/route'
import { useRoute } from '#app/composables/router'
import { useI18n, useLocaleRoute } from '#i18n'

const { t } = useI18n()

const route = useRoute()

const localeRoute = useLocaleRoute()

const tabs = computed(() => [
  {
    to: routeList.orders,
    active: route.fullPath.includes(routeList.orders.path),
    title: t('account_tabs.orders'),
  },
  {
    to: routeList.subscriptionOverview,
    active: isActive(routeList.subscriptionOverview),
    title: t('account_tabs.subscriptions'),
  },
  {
    to: routeList.profile,
    active: isActive(routeList.profile),
    title: t('account_tabs.profile'),
  },
])

const isActive = (to: RouteLocationRaw) => localeRoute(to)?.name === route.name
</script>
