import { addImportsDir, createResolver, defineNuxtModule } from '@nuxt/kit'
import type { NuxtOptions } from '@nuxt/schema'
import {
  isProviderStoryblok,
  setupStoryblok,
  setupStoryblokImageProvider,
} from './providers/storyblok/setup'
import {
  isProviderContentful,
  setupContentful,
  setupContentfulImageProvider,
} from './providers/contentful/setup'
import { moduleName, logger, formattedProvidersKeys } from './utils/helpers'
import type { ModuleOptions } from './types'
import { isProviderScayle, setupScayle } from './providers/scayle/setup'

export type { ModuleOptions }

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: moduleName,
    configKey: 'cms',
    version: '1.0.0',
    compatibility: {
      bridge: false,
      nuxt: '>=3.9',
    },
  },
  defaults: {
    provider: 'scayle',
  },
  async setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)
    if (!options.provider) {
      logger.error(
        `\nYou must define a CMS provider.\nSupported CMS providers are: ${formattedProvidersKeys}!`,
      )
    }

    addImportsDir(resolver.resolve('./composables'))

    if (isProviderScayle(options)) {
      // Early return to prevent unnecessary chunk optimizations, which are specific to contentful and storyblok
      return await setupScayle(options, nuxt)
    }

    if (isProviderStoryblok(options)) {
      await setupStoryblok(options, nuxt)
    }

    if (isProviderContentful(options)) {
      await setupContentful(options, nuxt)
    }
    nuxt.options.image ??= {} as NuxtOptions['image']

    // we want to show contentful and storyblok components in storybook at the same time.
    // Therefore both image providers need to be configured.
    setupStoryblokImageProvider(nuxt)
    setupContentfulImageProvider(nuxt)

    // Both CMS editors add the slug to the path in order to display the correct page in the editor.
    // On the homepage this does not work because the real url of the homepage does not have any path.
    // In Storyblok this can be avoided by setting the "real path" in the page configuration.
    // In Contentful this is not possible.
    // By redirecting the /homepage to the root path, we can avoid the issue  (Also works for Storyblok, without setting the "real path").
    nuxt.options.routeRules ??= {}
    nuxt.options.routeRules['/homepage'] = { redirect: '/' }
    Object.values(nuxt.options.runtimeConfig.storefront.shops)
      .flatMap((shop) => shop.path)
      .filter((path): path is string => !!path)
      .forEach((path) => {
        nuxt.options.routeRules![`/${path}/homepage`] = {
          redirect: `/${path}`,
        }
      })

    // Manually adjust rollupOptions.output.manualChunks
    // https://github.com/nuxt/nuxt/issues/22127#issuecomment-1635925362
    nuxt.hooks.hook('vite:extendConfig', (config, { isClient }) => {
      if (isClient) {
        // https://rollupjs.org/configuration-options/#output-manualchunks
        // @ts-expect-error 'config.build.rollupOptions.output' is possibly 'undefined'.ts(18048)
        config.build.rollupOptions.output.manualChunks = function (id) {
          // Key: chunkName, Value: dependency name
          const chunkMap: Record<string, string[]> = {
            axios: ['axios'],
            contentful: [
              'contentful',
              '@contentful/live-preview',
              '@contentful/rich-text-html-renderer',
            ],
            storyblok: [
              '@storyblok/nuxt',
              '@storyblok/vue',
              'storyblok',
              'storyblok-js-client',
            ],
          }

          const chunks = Object.values(chunkMap).flat()

          if (id.includes('/node_modules/')) {
            const chunkName = chunks.find((chunk) => id.includes(chunk))
            return (
              chunkName &&
              Object.keys(chunkMap).find((key: keyof typeof chunkMap) =>
                chunkMap[key]!.includes(chunkName),
              )
            )
          }
        }
      }
    })
  },
})
