import type { ModuleOptions as StoryblokModuleProps } from '@storyblok/nuxt'

export type StoryblokRuntimeConfigKeys = 'accessToken'

export type StoryblokModuleOptions = {
  provider: 'storyblok'
} & Omit<Partial<StoryblokModuleProps>, StoryblokRuntimeConfigKeys>

export type StoryblokRuntimeConfig = Pick<
  StoryblokModuleProps,
  StoryblokRuntimeConfigKeys
> & {
  allowDrafts?: boolean
}

export type * from './gen/components/storyblok-components.d'
