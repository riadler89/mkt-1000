import { createResolver } from '@nuxt/kit'
import type { Nuxt } from 'nuxt/schema'
import { logger } from '../../utils/helpers'
import type { ModuleOptions } from '../../types'
import { CMSProvider } from '../../utils/config'
import type { ScayleModuleOptions } from './types'

export async function setupScayle(_options: ModuleOptions, nuxt: Nuxt) {
  const resolver = createResolver(import.meta.url)
  logger.info('Using Scayle as Storefront CMS provider')

  nuxt.options.alias['#storefront-cms/components'] =
    resolver.resolve('./components')
}

export function isProviderScayle(
  options: ModuleOptions,
): options is ScayleModuleOptions {
  return options.provider === CMSProvider.SCAYLE
}
