<template>
  <div v-if="idpCode" />
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from '#app/composables/router'
import { useAuthentication } from '~/composables'
import { useLog } from '#storefront/composables'

const route = useRoute()

const log = useLog('CallbackPage')

const { loginIDP } = useAuthentication()

const idpCode = computed(() => {
  const code = route.query.code
  return typeof code === 'string' ? code : undefined
})

onMounted(async () => {
  if (!idpCode.value) {
    return
  }
  try {
    await loginIDP(idpCode.value)
  } catch (error) {
    log.error('Error during logging in', error)
  }
})

defineOptions({ name: 'CallbackPage' })
</script>
