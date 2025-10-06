import { purifySensitiveData } from '@scayle/storefront-nuxt'
// NOTE: We need to import here from the Nuxt server-specific #imports to mitigate
// unresolved dependencies in the imported composables from Nitro(nitropack).
// This results in `nuxt typecheck` not being able to properly infer the correct
// import and throw an error without explicit `@ts-expect-error`
// @ts-expect-error TS2724: '"#imports"' has no exported member named 'defineNitroPlugin'. Did you mean 'defineNuxtPlugin'?
import { defineNitroPlugin, useRuntimeConfig } from '#imports'
import { stringToBoolean } from '~~/server/utils/boolean'

/*
    This Nitro plugin logs the sanitized runtime configuration at startup.
    If enabled, the plugin extracts the runtime configuration, sanitizes it by redacting sensitive information and logs the result.
    This feature aids in development and debugging, ensuring sensitive data like tokens and passwords are not exposed in logs.
*/
export default defineNitroPlugin(() => {
  if (!stringToBoolean(process.env.CONFIG_LOG_RUNTIME_ENABLED)) {
    return
  }

  const runtimeConfig = useRuntimeConfig()

  // Specify the keys from runtimeConfig that should be redacted in logs
  const sensitiveKeys = [
    'token',
    'password',
    'clientSecret',
    'apiToken',
    'secret',
  ]

  const loggableConfig: Record<string, unknown> = purifySensitiveData(
    runtimeConfig,
    sensitiveKeys,
  )

  const configToPrint = stringToBoolean(process.env.CONFIG_LOG_PRETTIER_ENABLED)
    ? JSON.stringify(loggableConfig, null, 2)
    : JSON.stringify(loggableConfig)

  console.log(
    '[storefront-application] runtimeConfig after startup:',
    configToPrint,
  )
})
