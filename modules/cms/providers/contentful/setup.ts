import {
  addComponentsDir,
  addPlugin,
  addTypeTemplate,
  createResolver,
  updateRuntimeConfig,
} from '@nuxt/kit'
import type { Nuxt } from 'nuxt/schema'
import { CMSProvider } from '../../utils/config'
import { logger } from '../../utils/helpers'
import type { ModuleOptions } from '../../types'
import type { ContentfulModuleOptions } from './types'

export async function setupContentful(options: ModuleOptions, nuxt: Nuxt) {
  const resolver = createResolver(import.meta.url)
  logger.info('Using Contentful as Storefront CMS provider')

  nuxt.options.runtimeConfig.public.cms.host ||= 'cdn.contentful.com'
  nuxt.options.runtimeConfig.public.cms.previewHost ||= 'preview.contentful.com'
  await updateRuntimeConfig(nuxt.options.runtimeConfig)

  const runtimeCMS = nuxt.options.runtimeConfig?.public.cms

  if (
    runtimeCMS.accessToken === undefined &&
    !import.meta.env.NUXT_PUBLIC_CMS_ACCESS_TOKEN
  ) {
    logger.error('Missing Contentful accessToken')
  }
  if (
    runtimeCMS.space === undefined &&
    !import.meta.env.NUXT_PUBLIC_CMS_SPACE
  ) {
    logger.error('Missing Contentful spaceId')
  }

  addPlugin(resolver.resolve('./runtime/plugin'))

  nuxt.options.alias['#storefront-cms/components'] =
    resolver.resolve('./components')
  addComponentsDir({
    path: resolver.resolve('./components'),
    pathPrefix: false,
  })
  addTypeTemplate({
    filename: 'cms-generated.d.ts',
    src: resolver.resolve('./types/gen/index.ts'),
  })

  addTypeTemplate({
    filename: 'cms-types.d.ts',
    src: resolver.resolve('./types/index.ts'),
  })

  addTypeTemplate({
    filename: 'storefront-cms.d.ts',
    write: true,
    getContents: () => {
      return `
      import { ContentfulRuntimeConfig } from '${resolver.resolve(
        './types/index.ts',
      )}'
      declare module '@nuxt/schema' {
        interface RuntimeConfig {
          cms: ContentfulRuntimeConfig
        }
        interface PublicRuntimeConfig {
          cms: ContentfulRuntimeConfig
        }
      }
      export {}
      `
    },
  })
}

export function isProviderContentful(
  options: ModuleOptions,
): options is ContentfulModuleOptions {
  return options.provider === CMSProvider.CONTENTFUL
}

export function setupContentfulImageProvider(nuxt: Nuxt) {
  nuxt.options.image.domains ??= []
  if (!nuxt.options.image.domains.includes('https://images.ctfassets.net')) {
    nuxt.options.image.domains.push('https://images.ctfassets.net')
  }
  nuxt.options.image.contentful ??= {
    baseURL: 'https://images.ctfassets.net',
    modifiers: {
      // set default quality as modifier.
      quality: '85',
      format: 'avif',
    },
  }
}
