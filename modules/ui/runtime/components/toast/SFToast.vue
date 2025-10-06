<template>
  <div
    class="flex min-h-16 w-full items-center justify-center space-x-2 rounded-md p-3 px-4 font-semibold leading-none md:h-11 md:w-max md:max-w-[90vw]"
    :class="notification.type?.classes"
  >
    <component :is="notification.type?.iconComponent" class="size-4 shrink-0" />
    <span>{{ notification.message }}</span>
    <SFLink
      v-if="action?.href"
      :key="`link-${action.text}`"
      :class="action.class"
      :to="action.href"
      raw
      class="underline"
      @click="onClick($event, action)"
    >
      {{ action.text }}
    </SFLink>
    <button
      v-else-if="action?.text"
      :class="action.class"
      class="underline"
      data-testid="toast-info-button"
      @click="onClick($event, action)"
    >
      {{ action.text }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useTimeoutFn } from '@vueuse/core'
import { computed } from 'vue'
import { useNotification } from '#storefront-ui'
import type {
  NotificationActionHandler,
  StorefrontNotification,
} from '#storefront-ui'
import { SFLink } from '#storefront-ui/components'

const { notification } = defineProps<{
  /**
   * Notification object that consists of mandatory `id`, `message`, `duration` and optional `actions` and `type` properties.
   */
  notification: StorefrontNotification
}>()

const { close: closeNotification } = useNotification()

const action = computed(() => notification.action)

const close = () => closeNotification(notification.id)

const onClick = (event: Event, action: NotificationActionHandler) => {
  if (!action?.onClick) {
    return
  }
  event.preventDefault()
  event.stopImmediatePropagation()
  action?.onClick({ close })
}

useTimeoutFn(close, notification.duration)
</script>
