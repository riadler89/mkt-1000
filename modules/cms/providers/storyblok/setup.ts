import {
  addComponentsDir,
  addPlugin,
  addTypeTemplate,
  createResolver,
  installModule,
} from '@nuxt/kit'
import type { Nuxt } from 'nuxt/schema'
import { logger } from '../../utils/helpers'
import type { ModuleOptions } from '../../types'
import { CMSProvider } from '../../utils/config'
import type { StoryblokModuleOptions } from './types'

export async function setupStoryblok(options: ModuleOptions, nuxt: Nuxt) {
  const resolver = createResolver(import.meta.url)
  logger.info('Using Storyblok as Storefront CMS provider')

  const runtimeCMS = nuxt.options.runtimeConfig?.public.cms

  if (!nuxt.options.modules.includes('@storyblok/nuxt')) {
    // NOTE: We need to enable sudo mode, as we define our own Storyblok Vue plugin
    // and thus want to avoid duplicate initialization.
    // https://github.com/storyblok/storyblok-nuxt?tab=readme-ov-file#define-your-own-plugin
    await installModule('@storyblok/nuxt', {
      componentsDir: '',
      enableSudoMode: true,
    })
  }

  if ('storyblok' in nuxt.options) {
    // Check if `nuxt.options.storyblok` exists and is falsy. If so, initialize it.
    // Otherwise, spread existing options and override `componentsDir`.
    nuxt.options.storyblok = nuxt.options.storyblok
      ? ({
          ...nuxt.options.storyblok,
          componentsDir: '',
        } as unknown as typeof nuxt.options.storyblok)
      : ({} as unknown as typeof nuxt.options.storyblok)
  }

  if (
    runtimeCMS.accessToken === undefined &&
    !import.meta.env.NUXT_PUBLIC_CMS_ACCESS_TOKEN
  ) {
    logger.error('Missing Storyblok accessToken')
  }

  addPlugin(resolver.resolve('./runtime/plugin'))

  nuxt.options.alias['#storefront-cms/components'] =
    resolver.resolve('./components')

  addComponentsDir({
    path: resolver.resolve('./components'),
    pathPrefix: false,
  })

  addTypeTemplate({
    filename: 'cms-storyblok.d.ts',
    src: resolver.resolve('./types/gen/storyblok.d.ts'),
  })

  addTypeTemplate({
    filename: 'cms-storyblok-components.d.ts',
    src: resolver.resolve('./types/gen/components/storyblok-components.d.ts'),
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
      import { StoryblokRuntimeConfig } from '${resolver.resolve(
        './types/index.ts',
      )}'

      declare module '@nuxt/schema' {
        interface RuntimeConfig {
          cms: StoryblokRuntimeConfig
        }
        interface PublicRuntimeConfig {
          cms: StoryblokRuntimeConfig
        }
      }
      export {}
      `
    },
  })
}

export function isProviderStoryblok(
  options: ModuleOptions,
): options is StoryblokModuleOptions {
  return options.provider === CMSProvider.STORYBLOK
}

export function setupStoryblokImageProvider(nuxt: Nuxt) {
  nuxt.options.image.domains ??= []
  if (!nuxt.options.image.domains.includes('https://a.storyblok.com')) {
    nuxt.options.image.domains.push('https://a.storyblok.com')
  }
  nuxt.options.image.storyblok ??= {
    baseURL: 'https://a.storyblok.com',
    modifiers: {
      // set default quality as modifier.
      quality: '85',
      format: 'avif',
    },
  }
}
