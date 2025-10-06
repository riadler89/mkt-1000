<template>
  <aside class="flex flex-col overscroll-contain" data-testid="mobile-sidebar">
    <SFSearchInput
      id="search-mobile"
      data-testid="search-mobile"
      class="mt-1"
      @click-result="$emit('close')"
      @close="$emit('close')"
    />
    <div class="flex grow flex-col p-5 pl-4">
      <SFMobileNavigation
        :is-open="isOpen"
        :navigation-items="navigationItems"
        @click-link="$emit('close')"
      />
      <div class="mt-auto">
        <div class="p-2">
          <SFLocalizedLink
            :to="routeList.location"
            class="text-secondary"
            data-testid="store-location-link-mobile"
            @click="$emit('close')"
          >
            <IconLocation class="size-5" />
            <div class="mt-1 text-lg font-normal leading-5 lg:text-sm">
              {{ $t('navigation.find_a_store') }}
            </div>
          </SFLocalizedLink>
        </div>
        <SFShopSwitcher listbox-button-aria-id="mobile-shop-switcher" />
        <SFButton
          v-if="user"
          variant="raw"
          data-testid="logout-button"
          class="ml-px p-2 px-2.5 text-lg font-normal leading-5 !text-secondary lg:text-sm"
          @click="handleLogout"
        >
          <template #icon>
            <IconLogout class="mr-1 size-4" />
          </template>
          {{ $t('global.sign_out') }}
        </SFButton>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { NavigationItems } from '@scayle/storefront-nuxt'
import SFShopSwitcher from './shopSwitcher/SFShopSwitcher.vue'
import SFMobileNavigation from './SFMobileNavigation.vue'
import SFSearchInput from './search/SFSearchInput.vue'
import { SFButton } from '#storefront-ui/components'
import { routeList } from '~/utils'
import SFLocalizedLink from '~/components/SFLocalizedLink.vue'
import { useAuthentication } from '~/composables'
import { useLog, useUser } from '#storefront/composables'
import { onBeforeRouteLeave } from '#app/composables/router'

const { isOpen, navigationItems } = defineProps<{
  /**
   * Whether the mobile sidebar is currently open and visible.
   */
  isOpen: boolean
  /**
   * Array of navigation tree items for the mobile menu, including categories and pages.
   */
  navigationItems?: NavigationItems
}>()

const emit = defineEmits<{ close: [] }>()

const { user } = useUser()
const { logout } = useAuthentication()
const log = useLog('SFMobileSidebar')

const handleLogout = async () => {
  try {
    await logout()
    emit('close')
  } catch (error) {
    log.error('Error during logging out', error)
  }
}

// Whenever the route changes, we want to make sure that the mobile sidebar is closed.
onBeforeRouteLeave((_to, _from, next) => {
  emit('close')
  next()
})
</script>
