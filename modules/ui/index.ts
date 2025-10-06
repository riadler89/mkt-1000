import { createResolver, defineNuxtModule } from '@nuxt/kit'
import type { Breakpoints } from '@vueuse/core'

export type ModuleOptions = {
  prefix?: string
  breakpoints?: Breakpoints
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@scayle/storefront-ui',
    configKey: 'storefront-ui',
    version: '0.1.0',
    compatibility: {
      bridge: false,
      nuxt: '>=3.10',
    },
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    nuxt.options.runtimeConfig.public.storefrontUI = {
      breakpoints: options.breakpoints ?? {
        xs: 320,
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
      },
    }

    nuxt.options.alias['#storefront-ui'] = resolve('./runtime')
    nuxt.options.alias['#storefront-ui/components'] = resolve(
      './runtime/components',
    )
  },
})

declare module '@nuxt/schema' {
  interface PublicRuntimeConfig {
    storefrontUI: {
      breakpoints: Breakpoints
    }
  }
}
