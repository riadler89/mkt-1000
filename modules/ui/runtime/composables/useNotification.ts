import { nanoid } from 'nanoid'
import { computed } from 'vue'
import { useState } from '#app/composables/state'
import type { RouteLocationRaw } from '#vue-router'

export const DEFAULT_NOTIFICATION_DURATION = 5000

export type NotificationOptions = {
  duration?: number
  action?: NotificationActionHandler
  type: NotificationComponent
}

export type NotificationOnClickActions = {
  close: () => void
  [key: string]: () => void
}

export type NotificationActionHandler = {
  text: string
  class?: string
  href?: RouteLocationRaw
  onClick?: (actions: NotificationOnClickActions) => void
}

export type NotificationComponent = {
  classes: string
  iconComponent?: string
}

export type StorefrontNotification = {
  id: string
  message: string
  duration: number
  action?: NotificationActionHandler
  type?: NotificationComponent
}

export function useNotification() {
  const notifications = useState<StorefrontNotification[]>(
    'notifications',
    () => [],
  )

  const show = (
    message: string,
    { duration, action, type }: NotificationOptions,
  ) => {
    notifications.value.push({
      message,
      id: `${nanoid()}-${Date.now()}`,
      duration: duration || DEFAULT_NOTIFICATION_DURATION,
      action,
      type,
    })
  }

  const close = (id: string) => {
    notifications.value = notifications.value.filter((item) => item.id !== id)
  }

  const closeAll = () => {
    notifications.value = []
  }

  return {
    notifications: computed(() => notifications.value),
    show,
    close,
    closeAll,
  }
}
