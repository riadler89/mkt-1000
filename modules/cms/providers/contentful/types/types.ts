import type { CreateClientParams } from 'contentful'

export type ContentfulRuntimeConfigKeys = 'accessToken' | 'space'

export type ContentfulModuleOptions = {
  provider: 'contentful'
} & Omit<Partial<CreateClientParams>, ContentfulRuntimeConfigKeys>

export type ContentfulRuntimeConfig = Pick<
  CreateClientParams,
  ContentfulRuntimeConfigKeys
>
