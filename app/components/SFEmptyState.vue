<template>
  <div
    class="flex flex-col items-center justify-center rounded py-10 md:px-10"
    data-testid="empty-state"
  >
    <div class="flex h-56 w-full justify-center" data-testid="empty-state-icon">
      <component :is="iconComponent" />
    </div>
    <div class="px-14 text-center md:w-lg md:px-0">
      <SFHeadline
        v-if="title"
        tag="h1"
        class="!block"
        size="3xl"
        data-testid="empty-state-headline"
      >
        {{ title }}
      </SFHeadline>
      <p
        v-if="description"
        class="mt-4 !block text-lg font-normal leading-5 text-secondary"
        data-testid="empty-state-subheadline"
      >
        {{ description }}
      </p>
      <div
        v-if="showDefaultActions"
        class="mt-10 flex flex-col justify-center gap-4 sm:flex-row"
      >
        <SFButton
          v-if="!isLoggedIn"
          size="lg"
          :to="getLocalizedRoute(routeList.signin)"
          data-testid="button-signin"
        >
          {{ $t('global.sign_in') }}
        </SFButton>
        <SFButton
          size="lg"
          :to="getLocalizedRoute(routeList.home)"
          variant="tertiary"
          data-testid="button-continue-shopping"
        >
          {{ $t('global.continue_shopping') }}
        </SFButton>
      </div>
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useUser } from '#storefront/composables'
import { routeList } from '~/utils/route'
import { IconEmptyBasket, IconEmptyWishlist } from '#components'
import { SFButton, SFHeadline } from '#storefront-ui/components'
import { useRouteHelpers } from '~/composables'

const {
  title = '',
  description = '',
  showDefaultActions = true,
  icon = 'EmptyBasket',
} = defineProps<{
  title?: string
  description?: string
  showDefaultActions?: boolean
  icon?: 'EmptyWishlist' | 'EmptyBasket'
}>()

const { isLoggedIn } = useUser()

const { getLocalizedRoute } = useRouteHelpers()

const iconComponent = computed(() => {
  return icon === 'EmptyBasket' ? IconEmptyBasket : IconEmptyWishlist
})
</script>
