import type { VueGtmUseOptions } from '@gtm-support/vue-gtm'
import { defineNuxtModule, addPlugin, createResolver } from '@nuxt/kit'
import { defu } from 'defu'

// Module options TypeScript interface definition
export interface ModuleOptions extends Omit<VueGtmUseOptions, 'vueRouter'> {
  enableRouterSync?: boolean
}

declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    gtm: ModuleOptions
  }
  interface NuxtConfig {
    gtm?: ModuleOptions
  }
  interface NuxtOptions {
    // @ts-expect-error All declarations of 'gtm' must have identical modifiers.ts(2687)
    gtm?: ModuleOptions
  }
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@scayle/nuxt-gtm',
    configKey: 'gtm',
    compatibility: {
      nuxt: '^3.10.0',
    },
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    const moduleOptions: ModuleOptions = defu(
      nuxt.options.runtimeConfig.public.gtm,
      options,
    )

    nuxt.options.runtimeConfig.public.gtm = moduleOptions

    addPlugin(resolver.resolve('./runtime/plugin'))
  },
})
