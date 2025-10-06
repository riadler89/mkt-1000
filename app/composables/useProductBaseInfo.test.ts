import { describe, it, expect, vi } from 'vitest'
import type { CentAmount } from '@scayle/storefront-nuxt'
import {
  productFactory,
  attributeGroupSingleFactory,
} from '@scayle/storefront-nuxt/test/factories'
import { useProductBaseInfo } from './useProductBaseInfo'

vi.mock('#i18n', () => ({
  useI18n: vi.fn().mockReturnValue({
    t: (
      key: string,
      param: { productName: string; colors: string; brand: string },
    ) => `${key}-${param.brand}-${param.productName}-${param.colors}`,
  }),
}))
vi.mock('~/composables', () => ({
  useRouteHelpers: vi.fn().mockReturnValue({
    getProductDetailRoute: (id: number) => id,
  }),
}))

describe('useProductBaseInfo', () => {
  describe('brand', () => {
    it('should return the correct default value for brand', () => {
      const product = productFactory.build({
        attributes: {
          brand: attributeGroupSingleFactory.build({
            key: 'brand',
            label: 'Brand',
            type: 'string',
            values: {
              label: 'Brand Name',
              id: 101,
              value: 'brand-name',
            },
          }),
        },
      })
      const { brand } = useProductBaseInfo(product)

      expect(brand.value).toBe('Brand Name')
    })

    it('should return empty default value for brand', () => {
      const product = productFactory.build({
        attributes: {},
      })
      const { brand } = useProductBaseInfo(product)

      expect(brand.value).toBe('')
    })
  })

  describe('name', () => {
    it('should return the correct default value for name', () => {
      const product = productFactory.build({
        attributes: {
          name: attributeGroupSingleFactory.build({
            key: 'name',
            label: 'Test Product',
            values: {
              label: 'Test Product',
            },
          }),
        },
      })
      const { name } = useProductBaseInfo(product)

      expect(name.value).toBe('Test Product')
    })

    it('should return empty default value for name', () => {
      const product = productFactory.build({
        attributes: {},
      })
      const { name } = useProductBaseInfo(product)

      expect(name.value).toBe('')
    })
  })

  describe('price', () => {
    it('should return the correct default value for price', () => {
      const product = productFactory.build({
        priceRange: {
          min: {
            withoutTax: 10 as CentAmount,
            withTax: 1 as CentAmount,
            tax: {
              vat: {
                amount: 2 as CentAmount,
                rate: 1,
              },
            },
            currencyCode: 'USD',
          },
        },
      })
      const { price } = useProductBaseInfo(product)

      expect(price.value).toStrictEqual({
        withoutTax: 10 as CentAmount,
        withTax: 1 as CentAmount,
        tax: {
          vat: {
            amount: 2 as CentAmount,
            rate: 1,
          },
        },
        appliedReductions: [],
        currencyCode: 'USD',
      })
    })

    it('should return undefined default value for price', () => {
      const { price } = useProductBaseInfo(undefined)

      expect(price.value).toBeUndefined()
    })
  })

  describe('lowestPriorPrice', () => {
    it('should return the correct default value for lowestPriorPrice', () => {
      const product = productFactory.build({
        lowestPriorPrice: {
          withTax: 23,
          relativeDifferenceToPrice: 0.11,
        },
      })
      const { lowestPriorPrice } = useProductBaseInfo(product)

      expect(lowestPriorPrice.value).toStrictEqual({
        relativeDifferenceToPrice: 0.11,
        withTax: 23,
      })
    })

    it('should return undefined default value for lowestPriorPrice', () => {
      const product = productFactory.build({ lowestPriorPrice: undefined })
      const { lowestPriorPrice } = useProductBaseInfo(product)

      expect(lowestPriorPrice.value).toBeUndefined()
    })
  })

  describe('color', () => {
    it('should return the correct default value for colors + sibling color', () => {
      const product = productFactory.build({
        attributes: {
          color: attributeGroupSingleFactory.build({
            key: 'color',
            label: 'Color',
            type: '',
            values: {
              id: 6,
              label: 'Weiß',
              value: 'weiss',
            },
          }),
        },
      })
      const { color } = useProductBaseInfo(product)

      expect(color.value).toStrictEqual('Weiß')
    })

    it('should return undefined default value for colors', () => {
      const { color } = useProductBaseInfo(undefined)

      expect(color.value).toBe('')
    })
  })

  describe('images', () => {
    it('should return an empty array when the product is undefined', () => {
      const { images, image } = useProductBaseInfo(undefined)

      expect(images.value).toStrictEqual([])
      expect(image.value).toBeUndefined()
    })

    it('should return the sorted images and the primary image of the product', () => {
      const product = productFactory.build({
        images: [
          {
            hash: 'hash1',
          },
          {
            hash: 'hash2',
            attributes: {
              primaryImage: attributeGroupSingleFactory.build({
                key: 'primaryImage',
                label: 'Primary Image',
                values: {
                  label: 'Primary Image',
                },
              }),
            },
          },
          {
            hash: 'hash3',
          },
        ],
      })
      const { images, image } = useProductBaseInfo(product)

      expect(images.value).toStrictEqual([
        {
          hash: 'hash2',
          attributes: {
            primaryImage: {
              id: 1,
              label: 'Primary Image',
              multiSelect: false,
              type: null,
              key: 'primaryImage',
              values: {
                label: 'Primary Image',
              },
            },
          },
        },
        {
          hash: 'hash1',
        },
        {
          hash: 'hash3',
        },
      ])

      expect(image.value).toStrictEqual({
        hash: 'hash2',
        attributes: {
          primaryImage: {
            key: 'primaryImage',
            id: 1,
            label: 'Primary Image',
            multiSelect: false,
            type: null,
            values: {
              label: 'Primary Image',
            },
          },
        },
      })
    })
  })

  describe('siblings', () => {
    it('should return the correct default value for siblings', () => {
      const product = productFactory.build({
        attributes: {
          color: attributeGroupSingleFactory.build({
            key: 'color',
            label: 'Color',
            type: '',
            values: {
              id: 6,
              label: 'Weiß',
              value: 'weiss',
            },
          }),
        },
        siblings: [
          productFactory.build({
            id: 5,
            attributes: {
              color: attributeGroupSingleFactory.build({
                key: 'color',
                label: 'Color',
                type: '',
                values: {
                  id: 6,
                  label: 'Weiß',
                  value: 'weiss',
                },
              }),
            },
          }),
        ],
      })
      const { siblings } = useProductBaseInfo(product)
      expect(siblings.value).toStrictEqual([
        {
          colors: [
            {
              id: 6,
              label: 'Weiß',
              value: 'weiss',
            },
          ],
          id: 1,
          image: {
            hash: 'test image',
          },
          name: '',
          brand: '',
          isSoldOut: false,
        },
        {
          colors: [
            {
              id: 6,
              label: 'Weiß',
              value: 'weiss',
            },
          ],
          id: 5,
          image: {
            hash: 'test image',
          },
          name: '',
          brand: '',
          isSoldOut: false,
        },
      ])
    })

    it('should return the correct default value for siblings sorted by sold out state', () => {
      const product = productFactory.build({
        attributes: {
          color: attributeGroupSingleFactory.build({
            key: 'color',
            label: 'Color',
            type: '',
            values: {
              id: 6,
              label: 'Weiß',
              value: 'weiss',
            },
          }),
        },
        siblings: [
          productFactory.build({
            id: 52,
            attributes: {
              color: attributeGroupSingleFactory.build({
                key: 'color',
                label: 'Color',
                type: '',
                values: {
                  id: 6,
                  label: 'Weiß',
                  value: 'weiss',
                },
              }),
            },
            isActive: true,
            isSoldOut: true,
            isNew: false,
            createdAt: '',
            updatedAt: '',
            images: [],
          }),
          productFactory.build({
            id: 5,
            attributes: {
              color: attributeGroupSingleFactory.build({
                key: 'color',
                label: 'Color',
                type: '',
                values: {
                  id: 6,
                  label: 'Weiß',
                  value: 'weiss',
                },
              }),
            },
          }),
        ],
      })
      const { siblings } = useProductBaseInfo(product)

      expect(siblings.value).toStrictEqual([
        {
          colors: [
            {
              id: 6,
              label: 'Weiß',
              value: 'weiss',
            },
          ],
          id: 1,
          image: {
            hash: 'test image',
          },
          name: '',
          brand: '',
          isSoldOut: false,
        },
        {
          colors: [
            {
              id: 6,
              label: 'Weiß',
              value: 'weiss',
            },
          ],
          id: 5,
          image: {
            hash: 'test image',
          },
          name: '',
          brand: '',
          isSoldOut: false,
        },
        {
          colors: [
            {
              id: 6,
              label: 'Weiß',
              value: 'weiss',
            },
          ],
          id: 52,
          image: undefined,
          isSoldOut: true,
          name: '',
          brand: '',
        },
      ])
    })

    it('should return the non sold out sibling', () => {
      const product = productFactory.build({
        attributes: {
          color: attributeGroupSingleFactory.build({
            key: 'color',
            label: 'Color',
            type: '',
            values: {
              id: 6,
              label: 'Weiß',
              value: 'weiss',
            },
          }),
        },
        siblings: [
          productFactory.build({
            id: 52,
            attributes: {
              color: attributeGroupSingleFactory.build({
                key: 'color',
                label: 'Color',
                type: '',
                values: {
                  id: 6,
                  label: 'Weiß',
                  value: 'weiss',
                },
              }),
            },
            isActive: false,
            isSoldOut: true,
            isNew: false,
            createdAt: '',
            updatedAt: '',
            images: [],
          }),
          productFactory.build({
            id: 5,
            attributes: {
              color: attributeGroupSingleFactory.build({
                key: 'color',
                label: 'Color',
                type: '',
                values: {
                  id: 6,
                  label: 'Weiß',
                  value: 'weiss',
                },
              }),
            },
          }),
        ],
      })
      const { nonSoldOutSiblings } = useProductBaseInfo(product)

      expect(nonSoldOutSiblings.value).toStrictEqual([
        {
          colors: [
            {
              id: 6,
              label: 'Weiß',
              value: 'weiss',
            },
          ],
          id: 1,
          image: {
            hash: 'test image',
          },
          name: '',
          brand: '',
          isSoldOut: false,
        },
        {
          colors: [
            {
              id: 6,
              label: 'Weiß',
              value: 'weiss',
            },
          ],
          id: 5,
          image: {
            hash: 'test image',
          },
          name: '',
          brand: '',
          isSoldOut: false,
        },
      ])
    })

    it('should return undefined default value for colors', () => {
      const { siblings } = useProductBaseInfo(undefined)

      expect(siblings.value).toStrictEqual([])
    })
  })

  describe('link', () => {
    it('should return the correct default value for link', () => {
      const product = productFactory.build({
        id: 1,
        attributes: {
          name: attributeGroupSingleFactory.build({
            key: 'name',
            label: 'Test Product',
            values: {
              label: 'Test Product',
            },
          }),
        },
      })
      const { link } = useProductBaseInfo(product)

      expect(link.value).toBe(1)
    })

    it('should return the undefined value for link', () => {
      const { link } = useProductBaseInfo(undefined)

      expect(link.value).toBeUndefined()
    })
  })
  describe('alt', () => {
    it('should return the correct default value for alt', () => {
      const product = productFactory.build()
      const { alt } = useProductBaseInfo(product)

      expect(alt.value).toBe('product_image.alt-Brand Name-Test Product-Weiß')
    })
  })

  describe('longestCategoryList', () => {
    const category1 = {
      categoryId: 1,
      categoryName: '1',
      categoryUrl: '/1',
      categorySlug: '1',
      categoryHidden: false,
    }
    const category2 = {
      categoryId: 2,
      categoryName: '2',
      categoryUrl: '/2',
      categorySlug: '2',
      categoryHidden: false,
    }
    const category3 = {
      categoryId: 2,
      categoryName: '3',
      categoryUrl: '/3',
      categorySlug: '3',
      categoryHidden: false,
    }
    const product = productFactory.build({
      categories: [
        [category1, category2],
        [category2],
        [category1, category3, category2],
        [category3],
      ],
    })

    it('should return longest category from product', () => {
      const { longestCategoryList } = useProductBaseInfo(product)
      expect(longestCategoryList.value).toStrictEqual([
        category1,
        category3,
        category2,
      ])
    })

    it('should return empty longest category if no product', () => {
      const { longestCategoryList } = useProductBaseInfo(undefined)
      expect(longestCategoryList.value).toStrictEqual([])
    })

    it('should return empty longest category if categories are undefined', () => {
      product.categories = undefined
      const { longestCategoryList } = useProductBaseInfo(product)
      expect(longestCategoryList.value).toStrictEqual([])
    })

    it('should return empty longest category if categories are empty', () => {
      product.categories = []
      const { longestCategoryList } = useProductBaseInfo(product)
      expect(longestCategoryList.value).toStrictEqual([])
    })
  })
})
