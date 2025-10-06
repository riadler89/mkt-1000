import { useState } from 'nuxt/app'
import type { Ref } from 'vue'

/**
 * Provides a reactive reference to the current shop configuration.
 *
 * This composable retrieves the current shop configuration from the Nuxt app instance.
 * It then uses [`useState`](https://nuxt.com/docs/api/composables/use-state) to
 * create a reactive reference to this configuration, allowing components
 * to reactively update when the current shop changes.
 *
 * @returns A reactive `ref` to the current shop's configuration.
 */
export const useClientId: () => Ref<number | undefined> = () => {
  return useState<number | undefined>('oauthClientId', () => undefined)
}
