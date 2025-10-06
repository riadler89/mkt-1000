import { createResolver, defineNuxtModule, extendPages } from '@nuxt/kit'
import type { NuxtPage } from 'nuxt/schema'

type ModuleOptions = {
  overviewPagePath?: string
  cancellationPagePath?: string
}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@scayle/storefront-subscription',
    configKey: 'subscription',
    version: '1.0.0',
    compatibility: {
      bridge: false,
      nuxt: '>=3.10',
    },
  },
  async setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)

    nuxt.options.alias['#storefront-subscription'] = resolve('./')

    const getAccountPage = (pages: NuxtPage[]) => {
      const accountPage = pages.find(({ name }) => name === 'account')
      if (!accountPage) {
        console.error(`"account" page does not exist.`)
        return
      }
      return accountPage
    }

    extendPages((pages) => {
      getAccountPage(pages)?.children?.push({
        name: 'subscription-overview',
        path: options.overviewPagePath ?? '/account/subscriptions',
        file: resolve('./pages/subscriptions.vue'),
      })
    })

    extendPages((pages) => {
      getAccountPage(pages)?.children?.push({
        name: 'subscription-cancellations',
        path:
          options.cancellationPagePath ?? '/account/subscription-cancellations',
        file: resolve('./pages/subscription-cancellations.vue'),
      })
    })
  },
})
