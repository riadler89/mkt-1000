<template>
  <div class="w-64 space-y-3 px-3 py-4">
    <SFButton
      variant="primary"
      is-full-width
      :to="getLocalizedRoute(routeList.signin)"
      @click="$emit('close')"
    >
      {{ $t('global.sign_in') }}
    </SFButton>
    <SFButton
      variant="secondary"
      is-full-width
      :to="getLocalizedRoute(routeList.signup)"
      class="font-semibold"
      @click="$emit('close')"
    >
      {{ $t('global.sign_up') }}
    </SFButton>
  </div>
</template>

<script setup lang="ts">
import { routeList } from '~/utils/route'
import { SFButton } from '#storefront-ui/components'
import { useRouteHelpers } from '~/composables'

defineEmits<{
  close: []
}>()

const { getLocalizedRoute } = useRouteHelpers()
</script>
