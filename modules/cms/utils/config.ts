export const CMSProvider = {
  STORYBLOK: 'storyblok',
  CONTENTFUL: 'contentful',
  SCAYLE: 'scayle',
} as const

export type CMSProvider = (typeof CMSProvider)[keyof typeof CMSProvider]
