import type { $Img } from '@nuxt/image'
import { BREAKPOINTS } from '~~/config/ui'
/**
 * Get the sources for an image.
 * @param imgSrc - The source of the image.
 * @param isMobile - Whether the image is mobile.
 * @param mobileBreakpoint - The breakpoint at which the image is considered mobile.
 * @param provider - The provider of the image.
 * @param img - The nuxt image object containing helper functions to generate image URLs.
 * @returns The list of sources for the image.
 */
const getSources = (
  imgSrc: string,
  isMobile: boolean,
  mobileBreakpoint: number,
  provider: 'storyblok' | 'contentful',
  img: $Img,
  responsiveSizes: string,
) => {
  const originalFormat = imgSrc.match(/^[^?#]+\.(\w+)(?:$|[?#])/)?.[1]

  const isNotTransparent =
    !originalFormat ||
    !['png', 'webp', 'gif', 'svg', 'avif'].includes(originalFormat)
  const legacyFormat = isNotTransparent ? 'jpeg' : 'png'

  const formats = img.options.format?.length
    ? [...img.options.format]
    : ['avif']

  if (!formats.includes(legacyFormat)) {
    formats.push(legacyFormat)
  } else {
    formats.splice(formats.indexOf(legacyFormat), 1)
    formats.push(legacyFormat)
  }

  return formats.map((format) => {
    const { srcset, sizes, src } = img.getSizes(imgSrc, {
      provider,
      sizes: responsiveSizes,
      modifiers: { format },
    })

    return {
      src,
      type: `image/${format}`,
      sizes,
      srcset,
      media: isMobile
        ? `(width < ${mobileBreakpoint}px)`
        : `(width >= ${mobileBreakpoint}px)`,
    }
  })
}
export type Source = {
  src?: string
  srcset?: string
  type?: string
  sizes?: string
  media?: string
}

/**
 * Get a list of sources for an image, including both mobile and desktop sources.
 * @param desktopImage - The source of the desktop image.
 * @param mobileImage - The source of the mobile image.
 * @param mobileBreakpoint - The breakpoint at which the image is considered mobile
 * @param provider - The provider of the image.
 * @param img - The nuxt image object containing helper functions to generate image URLs.
 * @returns The list of optimized sources for the image.
 */
export const getImageSources = (
  desktopImage: string,
  mobileImage: string,
  mobileBreakpoint: number,
  provider: 'storyblok' | 'contentful',
  img: $Img,
  sizes: string = 'xs:100vw sm:100vw md:100vw lg:100vw xl:100vw',
) => {
  const desktopSources = getSources(
    desktopImage,
    false,
    mobileBreakpoint,
    provider,
    img,
    sizes,
  )
  const mobileSources = getSources(
    mobileImage,
    true,
    mobileBreakpoint,
    provider,
    img,
    sizes,
  )

  // combine mobile and desktop sources, when the same source is present in both
  const mergedSources: Source[] = []
  for (const src of [...mobileSources, ...desktopSources]) {
    const existingIdx = mergedSources.findIndex(
      (s) =>
        s.src === src.src &&
        s.srcset === src.srcset &&
        s.type === src.type &&
        s.sizes === src.sizes,
    )
    if (existingIdx !== -1) {
      mergedSources[existingIdx] = {
        ...mergedSources[existingIdx],
        media: undefined,
      }
    } else {
      mergedSources.push({ ...src })
    }
  }
  return mergedSources
}

/**
 * Calculates the sizes for the image based on the viewport fraction and the maximum width for each breakpoint.
 * @param desktopFraction - The fraction of the viewport that the desktop image should cover.
 * @param mobileFraction - The fraction of the viewport that the mobile image should cover.
 * @param maxWidths - The maximum width for each breakpoint.
 * @returns The sizes for the image.
 */
export const getImageSizes = (
  desktopFraction: number = 1,
  mobileFraction: number = 1,
  maxWidths: Partial<Record<keyof typeof BREAKPOINTS, number>> = {},
) => {
  const mobileSize = 100 * (mobileFraction || 1)
  const desktopSize = 100 * (desktopFraction || 1)
  const sizes: string[] = []
  for (const breakpoint of Object.keys(BREAKPOINTS)) {
    const maxWidth = maxWidths[breakpoint as keyof typeof BREAKPOINTS]
    if (maxWidth) {
      if (breakpoint === 'xl' || breakpoint === 'lg') {
        sizes.push(`${breakpoint}:${Math.ceil(maxWidth * desktopFraction)}px`)
      } else {
        sizes.push(`${breakpoint}:${Math.ceil(maxWidth * mobileFraction)}px`)
      }
    } else {
      if (breakpoint === 'xl' || breakpoint === 'lg') {
        sizes.push(`${breakpoint}:${desktopSize}vw`)
      } else {
        sizes.push(`${breakpoint}:${mobileSize}vw`)
      }
    }
  }
  return sizes.join(' ')
}
