import type { ContentfulModuleOptions } from './providers/contentful/types'
import type { StoryblokModuleOptions } from './providers/storyblok/types'
import type { ScayleModuleOptions } from './providers/scayle/types'
import type { CMSProvider } from './utils/config'

export type CMSModuleOptions = {
  provider?: CMSProvider
  componentPrefix?: string
} & (StoryblokModuleOptions | ContentfulModuleOptions | ScayleModuleOptions)

// eslint-disable-next-line sonarjs/redundant-type-aliases
export type ModuleOptions = CMSModuleOptions
