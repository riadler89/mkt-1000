<template>
  <SFPopover
    ref="userPopoverRef"
    :is-open="isOpen && !blockPopup"
    @mouseenter="isOpen = !blockPopup"
    @mouseleave="isOpen = false"
    @keydown.esc="isOpen = false"
  >
    <template #action>
      <SFLocalizedLink
        :to="link"
        raw
        class="flex size-11 items-center justify-center rounded-md p-2 hover:bg-gray-200"
        data-testid="header-user-button"
        :class="{ 'bg-gray-200': isOpen }"
        :aria-label="$t('user_navigation_item.a11y.title')"
        @keydown.space.prevent="isOpen = true"
      >
        <IconUser class="size-6" />
      </SFLocalizedLink>
    </template>
    <template #content>
      <SFAsyncStatusWrapper :status="status">
        <SFUserActions v-if="user" @close="isOpen = false" />
        <SFLoginActions v-else @close="isOpen = false" />
      </SFAsyncStatusWrapper>
    </template>
  </SFPopover>
</template>

<script setup lang="ts">
import { watch, ref, computed } from 'vue'
import { useMounted, useFocusWithin } from '@vueuse/core'
import SFUserActions from './account/SFUserActions.vue'
import SFLoginActions from './account/SFLoginActions.vue'
import { useUser } from '#storefront/composables'
import SFLocalizedLink from '~/components/SFLocalizedLink.vue'
import { SFPopover } from '~~/modules/ui/runtime/components'
import { routeList } from '~/utils'
import SFAsyncStatusWrapper from '~/components/SFAsyncStatusWrapper.vue'
import { useRoute } from '#app/composables/router'
import { useRouteHelpers } from '~/composables'

defineProps<{ blockPopup?: boolean }>()

const route = useRoute()
const { getLocalizedRoute } = useRouteHelpers()

const isOpen = ref(false)
const userPopoverRef = ref()

const { focused } = useFocusWithin(userPopoverRef)

const { user, status } = useUser()

const mounted = useMounted()

const link = computed(() => {
  if (user.value && mounted.value) {
    return routeList.account
  }
  return route.path !== getLocalizedRoute(routeList.signin)
    ? routeList.signin
    : route.fullPath
})

watch(focused, (isFocused) => {
  if (!isFocused) {
    isOpen.value = false
  }
})
</script>
