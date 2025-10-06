import { createConsola } from 'consola'
import { CMSProvider } from './config'

export const moduleName = '@scayle/storefront-cms'
export const logger = createConsola({
  formatOptions: {
    colors: true,
  },
  level: process.env.NUXT_DEBUGGING_ENABLED ? 3 : -1,
  defaults: {
    tag: moduleName,
  },
})

export function isStringURL(string: string) {
  let url

  try {
    url = new URL(string)
  } catch {
    return false
  }

  return url.protocol === 'http:' || url.protocol === 'https:'
}

export const formatter = new Intl.ListFormat('en', {
  style: 'long',
  type: 'conjunction',
})

export const formattedProvidersKeys = formatter.format(
  Object.values(CMSProvider),
)

export const normalizePathRoute = (path: string) => {
  return path.startsWith('/') ? path : `/${path}`
}

export const isExternalLink = (link: string): boolean => {
  return typeof link === 'string' && link.startsWith('http')
}
