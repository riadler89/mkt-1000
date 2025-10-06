import type { CreateClientParams } from 'contentful'

export type ContentfulRuntimeConfigKeys = 'accessToken' | 'space' | 'host'

export type ContentfulModuleOptions = {
  provider: 'contentful'
} & Omit<Partial<CreateClientParams>, ContentfulRuntimeConfigKeys>

export type ContentfulRuntimeConfig = Pick<
  CreateClientParams,
  ContentfulRuntimeConfigKeys
> & {
  previewAccessToken?: string
  previewHost?: string
  host?: string
  allowDrafts?: boolean
}

export * from './gen'
