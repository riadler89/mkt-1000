import { scayleKvDriver } from '@scayle/unstorage-scayle-kv-driver'
import compressionDriver from '@scayle/unstorage-compression-driver'
import vercelKV from 'unstorage/drivers/vercel-kv'
import { stringToBoolean } from '~~/server/utils/boolean'
// NOTE: We need to import here from the Nuxt server-specific #imports to mitigate
// unresolved dependencies in the imported composables from Nitro(nitropack).
// This results in `nuxt typecheck` not being able to properly infer the correct
// import and throw an error without explicit `@ts-expect-error`
// @ts-expect-error: TS2578 Can't find defineNitroPlugin and useStorage as exported members of '#imports'
import { defineNitroPlugin, useStorage } from '#imports'
/**
 * This plugin configures the storage for the Storefront.
 * It mounts the storage drivers for the Storefront session and cache.
 *
 * @see https://scayle.dev/en/storefront-guide/developer-guide/technical-foundation/storage
 */
export default defineNitroPlugin(() => {
  const storage = useStorage()

  // This is only needed when one of the target environments is Vercel.
  // If none of the target environments is Vercel, this can be removed.
  if (import.meta.preset?.includes('vercel')) {
    storage.mount('storefront-session', vercelKV({}))
    storage.mount(
      'storefront-cache',
      compressionDriver({
        encoding: 'gzip',
        passthroughDriver: vercelKV({}),
      }),
    )
    return
  }

  storage.mount(
    'storefront-session',
    scayleKvDriver({
      disableClusterMode: stringToBoolean(
        process.env.NUXT_STOREFRONT_STORAGE_SESSION_DISABLE_CLUSTER_MODE,
      ),
    }),
  )

  storage.mount(
    'storefront-cache',
    compressionDriver({
      encoding: 'brotli',
      passthroughDriver: scayleKvDriver({
        disableClusterMode: stringToBoolean(
          process.env.NUXT_STOREFRONT_STORAGE_CACHE_DISABLE_CLUSTER_MODE,
        ),
        ttl: 10 * 60,
      }),
    }),
  )
})
