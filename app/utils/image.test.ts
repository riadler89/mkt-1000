import { it, describe, expect } from 'vitest'
import type {
  AttributeGroupSingle,
  ProductImage,
} from '@scayle/storefront-nuxt'
import { getPrimaryImage, sortProductImages } from './image'

const primaryImage: AttributeGroupSingle = {
  id: 7061,
  key: 'primaryImage',
  label: 'Primary Image',
  multiSelect: false,
  type: '',
  values: {
    id: 2433,
    label: 'true',
    value: 'true',
  },
}

describe('getPrimaryImage', () => {
  it('returns the first primary image', () => {
    const image = getPrimaryImage([
      {
        hash: 'hash1',
      },
      {
        hash: 'hash2',
        attributes: {
          primaryImage,
        },
      },
      {
        hash: 'hash3',
      },
    ])

    expect(image).toEqual({
      hash: 'hash2',
      attributes: {
        primaryImage,
      },
    })
  })

  it('returns the first image if no primary image exists', () => {
    const image = getPrimaryImage([
      {
        hash: 'hash1',
      },
      {
        hash: 'hash2',
      },
      {
        hash: 'hash3',
      },
    ])

    expect(image).toEqual({ hash: 'hash1' })
  })

  it('should return the first image with matching primaryImageType', () => {
    const image = getPrimaryImage(
      [
        {
          hash: 'hash1',
        },
        {
          hash: 'hash2',
          attributes: {
            primaryImage,
          },
        },
        {
          hash: 'hash3',
          attributes: {
            primaryImageType: {
              id: 1,
              key: 'primaryImageType',
              label: 'Primary Image Type',
              multiSelect: false,
              type: '',
              values: {
                label: 'Primary',
                value: 'primary',
              },
            },
          },
        },
      ],
      'primary',
    )

    expect(image).toStrictEqual(
      expect.objectContaining({
        hash: 'hash3',
      }),
    )
  })
  it('should return use the primary image when the preferredPrimaryImageType is not found', () => {
    const image = getPrimaryImage(
      [
        {
          hash: 'hash1',
        },
        {
          hash: 'hash2',
          attributes: {
            primaryImage,
          },
        },
        {
          hash: 'hash3',
          attributes: {
            primaryImageType: {
              id: 1,
              key: 'primaryImageType',
              label: 'Primary Image Type',
              multiSelect: false,
              type: '',
              values: {
                label: 'Primary',
                value: 'primary',
              },
            },
          },
        },
      ],
      'test',
    )

    expect(image).toStrictEqual(
      expect.objectContaining({
        hash: 'hash2',
      }),
    )
  })

  it('handles empty image array gracefully', () => {
    const image = getPrimaryImage([])
    expect(image).toBeUndefined()
  })

  it('handles images with real-world image type values', () => {
    const image = getPrimaryImage(
      [
        {
          hash: 'hash1',
          attributes: {
            primaryImageType: {
              id: 1,
              key: 'primaryImageType',
              label: 'Primary Image Type',
              multiSelect: false,
              type: '',
              values: {
                label: 'Model',
                value: 'model',
              },
            },
          },
        },
        {
          hash: 'hash2',
          attributes: {
            primaryImageType: {
              id: 1,
              key: 'primaryImageType',
              label: 'Primary Image Type',
              multiSelect: false,
              type: '',
              values: {
                label: 'Bust',
                value: 'bust',
              },
            },
          },
        },
      ],
      'model',
    )

    expect(image).toEqual({
      hash: 'hash1',
      attributes: {
        primaryImageType: {
          id: 1,
          key: 'primaryImageType',
          label: 'Primary Image Type',
          multiSelect: false,
          type: '',
          values: {
            label: 'Model',
            value: 'model',
          },
        },
      },
    })
  })

  it('prioritizes preferred type over primary image when both exist', () => {
    const image = getPrimaryImage(
      [
        {
          hash: 'hash1',
          attributes: {
            primaryImage,
          },
        },
        {
          hash: 'hash2',
          attributes: {
            primaryImageType: {
              id: 1,
              key: 'primaryImageType',
              label: 'Primary Image Type',
              multiSelect: false,
              type: '',
              values: {
                label: 'Model',
                value: 'model',
              },
            },
          },
        },
      ],
      'model',
    )

    expect(image).toEqual({
      hash: 'hash2',
      attributes: {
        primaryImageType: {
          id: 1,
          key: 'primaryImageType',
          label: 'Primary Image Type',
          multiSelect: false,
          type: '',
          values: {
            label: 'Model',
            value: 'model',
          },
        },
      },
    })
  })

  it('handles multiple images with same preferred type', () => {
    const image = getPrimaryImage(
      [
        {
          hash: 'hash1',
          attributes: {
            primaryImageType: {
              id: 1,
              key: 'primaryImageType',
              label: 'Primary Image Type',
              multiSelect: false,
              type: '',
              values: {
                label: 'Model',
                value: 'model',
              },
            },
          },
        },
        {
          hash: 'hash2',
          attributes: {
            primaryImageType: {
              id: 1,
              key: 'primaryImageType',
              label: 'Primary Image Type',
              multiSelect: false,
              type: '',
              values: {
                label: 'Model',
                value: 'model',
              },
            },
          },
        },
      ],
      'model',
    )

    // Should return the first matching image
    expect(image).toEqual({
      hash: 'hash1',
      attributes: {
        primaryImageType: {
          id: 1,
          key: 'primaryImageType',
          label: 'Primary Image Type',
          multiSelect: false,
          type: '',
          values: {
            label: 'Model',
            value: 'model',
          },
        },
      },
    })
  })

  it('handles different image type values from real API data', () => {
    const image = getPrimaryImage(
      [
        {
          hash: 'hash1',
          attributes: {
            primaryImageType: {
              id: 1,
              key: 'primaryImageType',
              label: 'Primary Image Type',
              multiSelect: false,
              type: '',
              values: {
                label: 'Bust',
                value: 'bust',
              },
            },
          },
        },
        {
          hash: 'hash2',
          attributes: {
            primaryImageType: {
              id: 1,
              key: 'primaryImageType',
              label: 'Primary Image Type',
              multiSelect: false,
              type: '',
              values: {
                label: 'Model',
                value: 'model',
              },
            },
          },
        },
      ],
      'model',
    )

    expect(image).toEqual({
      hash: 'hash2',
      attributes: {
        primaryImageType: {
          id: 1,
          key: 'primaryImageType',
          label: 'Primary Image Type',
          multiSelect: false,
          type: '',
          values: {
            label: 'Model',
            value: 'model',
          },
        },
      },
    })
  })
})

describe('getSortedImages', () => {
  it('should not change the sorting if no primary image exists', () => {
    const images = sortProductImages([
      {
        hash: 'hash1',
      },
      {
        hash: 'hash2',
      },
      {
        hash: 'hash3',
      },
    ])

    expect(images).toStrictEqual([
      {
        hash: 'hash1',
      },
      {
        hash: 'hash2',
      },
      {
        hash: 'hash3',
      },
    ])
  })

  it('should sort primary images to the front', () => {
    const images = sortProductImages([
      {
        hash: 'hash1',
      },
      {
        hash: 'hash2',
        attributes: {
          primaryImage,
        },
      },
      {
        hash: 'hash3',
      },
    ])

    expect(images).toStrictEqual([
      {
        hash: 'hash2',
        attributes: {
          primaryImage,
        },
      },
      {
        hash: 'hash1',
      },
      {
        hash: 'hash3',
      },
    ])
  })

  it('should handle images with multiple primary images', () => {
    const images = sortProductImages([
      {
        hash: 'hash1',
      },
      {
        hash: 'hash2',
        attributes: {
          primaryImage,
        },
      },
      {
        hash: 'hash3',
      },
      {
        hash: 'hash4',
        attributes: {
          primaryImage,
        },
      },
    ])

    expect(images).toStrictEqual([
      {
        hash: 'hash2',
        attributes: {
          primaryImage,
        },
      },
      {
        hash: 'hash4',
        attributes: {
          primaryImage,
        },
      },
      {
        hash: 'hash1',
      },
      {
        hash: 'hash3',
      },
    ])
  })

  it('should sort images by type if primaryImageType is provided', () => {
    const images = sortProductImages(
      [
        {
          hash: 'hash1',
        },
        {
          hash: 'hash2',
          attributes: {
            primaryImageType: {
              id: 1,
              key: 'primaryImageType',
              label: 'Primary Image Type',
              multiSelect: false,
              type: '',
              values: {
                label: 'Primary',
                value: 'primary',
              },
            },
          },
        },
      ],
      'primary',
    )

    expect(images).toStrictEqual([
      expect.objectContaining({
        hash: 'hash2',
      }),
      expect.objectContaining({
        hash: 'hash1',
      }),
    ])
  })
  it('should sort the primary image to the front if preferredPrimaryImageType not found', () => {
    const images = sortProductImages(
      [
        {
          hash: 'hash1',
          attributes: {
            primaryImageType: {
              id: 1,
              key: 'primaryImageType',
              label: 'Primary Image Type',
              multiSelect: false,
              type: '',
              values: {
                label: 'Primary',
                value: 'primary',
              },
            },
          },
        },
        {
          hash: 'hash2',
          attributes: {
            primaryImage,
          },
        },
        {
          hash: 'hash3',
        },
      ],
      'test',
    )

    expect(images).toStrictEqual([
      expect.objectContaining({
        hash: 'hash2',
      }),
      expect.objectContaining({
        hash: 'hash1',
      }),
      expect.objectContaining({
        hash: 'hash3',
      }),
    ])
  })

  it('handles empty image array', () => {
    const images = sortProductImages([])
    expect(images).toEqual([])
  })

  it('handles single image', () => {
    const images = sortProductImages([{ hash: 'hash1' }])
    expect(images).toEqual([{ hash: 'hash1' }])
  })

  it('maintains stable sort for images with same priority', () => {
    const images = sortProductImages([
      { hash: 'hash1' },
      { hash: 'hash2' },
      { hash: 'hash3' },
    ])

    expect(images).toEqual([
      { hash: 'hash1' },
      { hash: 'hash2' },
      { hash: 'hash3' },
    ])
  })

  it('handles real-world image type values in sorting', () => {
    const images = sortProductImages(
      [
        {
          hash: 'hash1',
          attributes: {
            primaryImageType: {
              id: 1,
              key: 'primaryImageType',
              label: 'Primary Image Type',
              multiSelect: false,
              type: '',
              values: {
                label: 'Bust',
                value: 'bust',
              },
            },
          },
        },
        {
          hash: 'hash2',
          attributes: {
            primaryImage,
          },
        },
        {
          hash: 'hash3',
          attributes: {
            primaryImageType: {
              id: 1,
              key: 'primaryImageType',
              label: 'Primary Image Type',
              multiSelect: false,
              type: '',
              values: {
                label: 'Model',
                value: 'model',
              },
            },
          },
        },
      ],
      'model',
    )

    expect(images).toStrictEqual([
      expect.objectContaining({ hash: 'hash3' }), // Model type first
      expect.objectContaining({ hash: 'hash2' }), // Primary image second
      expect.objectContaining({ hash: 'hash1' }), // Bust type last
    ])
  })

  it('prioritizes preferred type over primary image in sorting', () => {
    const images = sortProductImages(
      [
        {
          hash: 'hash1',
          attributes: {
            primaryImage,
          },
        },
        {
          hash: 'hash2',
          attributes: {
            primaryImageType: {
              id: 1,
              key: 'primaryImageType',
              label: 'Primary Image Type',
              multiSelect: false,
              type: '',
              values: {
                label: 'Model',
                value: 'model',
              },
            },
          },
        },
        {
          hash: 'hash3',
        },
      ],
      'model',
    )

    expect(images).toStrictEqual([
      expect.objectContaining({
        hash: 'hash2',
      }),
      expect.objectContaining({
        hash: 'hash1',
      }),
      expect.objectContaining({
        hash: 'hash3',
      }),
    ])
  })

  it('handles complex sorting with multiple priorities', () => {
    const images = sortProductImages(
      [
        { hash: 'regular1' },
        {
          hash: 'primary1',
          attributes: {
            primaryImage,
          },
        },
        {
          hash: 'type1',
          attributes: {
            primaryImageType: {
              id: 1,
              key: 'primaryImageType',
              label: 'Primary Image Type',
              multiSelect: false,
              type: '',
              values: {
                label: 'Model',
                value: 'model',
              },
            },
          },
        },
        { hash: 'regular2' },
        {
          hash: 'primary2',
          attributes: {
            primaryImage,
          },
        },
        {
          hash: 'type2',
          attributes: {
            primaryImageType: {
              id: 1,
              key: 'primaryImageType',
              label: 'Primary Image Type',
              multiSelect: false,
              type: '',
              values: {
                label: 'Model',
                value: 'model',
              },
            },
          },
        },
      ],
      'model',
    )

    expect(images).toStrictEqual([
      expect.objectContaining({ hash: 'type1' }),
      expect.objectContaining({ hash: 'type2' }),
      expect.objectContaining({ hash: 'primary1' }),
      expect.objectContaining({ hash: 'primary2' }),
      expect.objectContaining({ hash: 'regular1' }),
      expect.objectContaining({ hash: 'regular2' }),
    ])
  })

  it('handles multiple image types with different priorities', () => {
    const images = sortProductImages(
      [
        {
          hash: 'regular1',
        },
        {
          hash: 'bust1',
          attributes: {
            primaryImageType: {
              id: 1,
              key: 'primaryImageType',
              label: 'Primary Image Type',
              multiSelect: false,
              type: '',
              values: {
                label: 'Bust',
                value: 'bust',
              },
            },
          },
        },
        {
          hash: 'model1',
          attributes: {
            primaryImageType: {
              id: 1,
              key: 'primaryImageType',
              label: 'Primary Image Type',
              multiSelect: false,
              type: '',
              values: {
                label: 'Model',
                value: 'model',
              },
            },
          },
        },
        {
          hash: 'primary1',
          attributes: {
            primaryImage,
          },
        },
      ],
      'model',
    )

    expect(images).toStrictEqual([
      expect.objectContaining({ hash: 'model1' }), // Preferred type first
      expect.objectContaining({ hash: 'primary1' }), // Primary image second
      expect.objectContaining({ hash: 'regular1' }), // Regular image third
      expect.objectContaining({ hash: 'bust1' }), // Other type last
    ])
  })

  it('handles large arrays efficiently', () => {
    const largeImageArray: ProductImage[] = Array.from(
      { length: 1000 },
      (_, i) => ({
        hash: `hash${i}`,
        attributes: i % 10 === 0 ? { primaryImage } : undefined,
      }),
    )

    const sortedImages = sortProductImages(largeImageArray)

    // Check that primary images are at the front
    const primaryImages = sortedImages.filter(
      (img) => img.attributes && 'primaryImage' in img.attributes,
    )
    const nonPrimaryImages = sortedImages.filter(
      (img) => !img.attributes || !('primaryImage' in img.attributes),
    )

    expect(primaryImages.length).toBe(100)
    expect(nonPrimaryImages.length).toBe(900)
    expect(sortedImages[0]?.attributes).toHaveProperty('primaryImage')
  })
})
