import { describe, it, expect } from 'vitest'
import type { $Img } from '@nuxt/image'
import { getImageSources, getImageSizes } from './image'

const MOBILE_BREAKPOINT = 768

// Mock $Img object
function createMockImg() {
  return {
    options: {},
    getSizes: (src: string, { sizes }: { sizes: string }) => {
      return {
        src: `${src}`,
        sizes,
      }
    },
  } as $Img
}

describe('getImageSources', () => {
  it('includes both mobile and desktop sources when both are provided', () => {
    const imgSrc = 'https://cdn.example.com/image.jpg'
    const imgMobileSrc = 'https://cdn.example.com/image-mobile.jpg'
    const sources = getImageSources(
      imgSrc,
      imgMobileSrc,
      MOBILE_BREAKPOINT,
      'storyblok',
      createMockImg(),
    )
    expect(sources.length).toBe(4)
    expect(sources.some((s) => s.media === '(width < 768px)')).toBe(true)
    expect(sources.some((s) => s.media === '(width >= 768px)')).toBe(true)
  })

  it('deduplicates sources when desktop and mobile images are the same', () => {
    const imgSrc = 'https://cdn.example.com/image.jpg'
    const sources = getImageSources(
      imgSrc,
      imgSrc,
      MOBILE_BREAKPOINT,
      'storyblok',
      createMockImg(),
    )
    expect(sources.length).toBe(2)
    expect(sources.every((s) => !s.media)).toBe(true)
    expect(sources.map((s) => s.sizes)).toEqual([
      'xs:100vw sm:100vw md:100vw lg:100vw xl:100vw',
      'xs:100vw sm:100vw md:100vw lg:100vw xl:100vw',
    ])
  })

  it('uses the provided sizes', () => {
    const imgSrc = 'https://cdn.example.com/image.jpg'
    const sources = getImageSources(
      imgSrc,
      imgSrc,
      MOBILE_BREAKPOINT,
      'storyblok',
      createMockImg(),
      'xs:10vw sm:10vw md:10vw lg:25vw xl:25vw',
    )
    expect(sources.length).toBe(2)
    expect(sources.map((s) => s.sizes)).toEqual([
      'xs:10vw sm:10vw md:10vw lg:25vw xl:25vw',
      'xs:10vw sm:10vw md:10vw lg:25vw xl:25vw',
    ])
  })
})

describe('getImageSizes', () => {
  it('returns full viewport width (100vw) for all breakpoints when fractions are 1', () => {
    const sizes = getImageSizes(1, 1)
    expect(sizes).toBe('xs:100vw sm:100vw md:100vw lg:100vw xl:100vw')
  })

  it('returns half viewport width (50vw) for all breakpoints when fractions are 0.5', () => {
    const sizes = getImageSizes(0.5, 0.5)
    expect(sizes).toBe('xs:50vw sm:50vw md:50vw lg:50vw xl:50vw')
  })

  it('uses different fractions for mobile and desktop breakpoints', () => {
    const sizes = getImageSizes(1, 0.5) // desktop: 100vw, mobile: 50vw
    expect(sizes).toBe('xs:50vw sm:50vw md:50vw lg:100vw xl:100vw')
  })

  it('uses pixel values when maxWidths are provided for specific breakpoints', () => {
    const sizes = getImageSizes(1, 1, { md: 400, lg: 800 })
    expect(sizes).toBe('xs:100vw sm:100vw md:400px lg:800px xl:100vw')
  })

  it('applies fractions to pixel values when maxWidths are provided', () => {
    const sizes = getImageSizes(0.5, 0.5, { sm: 200, xl: 1000 })
    expect(sizes).toBe('xs:50vw sm:100px md:50vw lg:50vw xl:500px')
  })

  it('rounds up pixel values when calculating with fractions', () => {
    const sizes = getImageSizes(0.33, 0.33, { md: 100, xl: 100 })
    expect(sizes).toBe('xs:33vw sm:33vw md:33px lg:33vw xl:33px')
  })
})
