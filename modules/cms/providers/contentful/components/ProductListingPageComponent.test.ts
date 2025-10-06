import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import type { TypeProductListingPageComponentSkeleton } from '../types'
import ProductListingPageComponent from './ProductListingPageComponent.vue'

const { useCMSBySlugMock, useContentfulEditorMock } = vi.hoisted(() => {
  return {
    useCMSBySlugMock: vi.fn(),
    useContentfulEditorMock: vi.fn(),
  }
})

// Mock the useCMSBySlug composable
vi.mock('../composables/useCMS', () => ({
  useCMSBySlug: useCMSBySlugMock,
}))

// Mock the useContentfulEditor composable
vi.mock('../composables/useContentfulEditor', () => ({
  useContentfulEditor: useContentfulEditorMock,
}))

describe('Contentful ProductListingPageComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const createWrapper = (
    mockData: Partial<TypeProductListingPageComponentSkeleton> | null = null,
  ) => {
    // Mock the return value of useCMSBySlug
    useCMSBySlugMock.mockReturnValue({
      data: ref(mockData),
    })

    return mount(ProductListingPageComponent, {
      props: {
        categoryId: 123,
      },
      global: {
        stubs: {
          ContentfulComponent: {
            name: 'ContentfulComponent',
            template:
              '<div data-testid="contentful-component" :data-content-id="contentElement.sys.id">Mock ContentfulComponent</div>',
            props: ['contentElement'],
          },
        },
      },
    })
  }

  it('renders teaser content components when data is available', () => {
    const mockTeaserContent = [
      {
        sys: { id: 'teaser-1' },
        fields: { title: 'First Teaser' },
      },
      {
        sys: { id: 'teaser-2' },
        fields: { title: 'Second Teaser' },
      },
    ]

    const mockContent = {
      sys: { id: 'plp-component' },
      fields: {
        slug: 'c/c-123',
        teaserContent: mockTeaserContent,
      },
    }

    const wrapper = createWrapper(
      mockContent as unknown as TypeProductListingPageComponentSkeleton,
    )

    // Check that useCMSBySlug was called with correct parameters
    expect(useCMSBySlugMock).toHaveBeenCalledWith('product-listing-page-123', {
      content_type: 'productListingPageComponent',
      'fields.slug[match]': 'c/c-123',
    })

    // Check that ContentfulComponent is rendered for each teaser content item
    const contentfulComponents = wrapper.findAll(
      '[data-testid="contentful-component"]',
    )
    expect(contentfulComponents).toHaveLength(2)

    // Check that the components have the correct content IDs
    expect(contentfulComponents[0]?.attributes('data-content-id')).toBe(
      'teaser-1',
    )
    expect(contentfulComponents[1]?.attributes('data-content-id')).toBe(
      'teaser-2',
    )

    // Check that useContentfulEditor was called with the content
    expect(useContentfulEditorMock).toHaveBeenCalledWith(expect.any(Object))
  })

  it('does not render anything when teaserContent is empty', () => {
    const mockContent = {
      sys: { id: 'plp-component' },
      fields: {
        slug: 'c/c-123',
        teaserContent: [],
      },
    }

    const wrapper = createWrapper(
      mockContent as unknown as TypeProductListingPageComponentSkeleton,
    )

    const contentfulComponents = wrapper.findAll(
      '[data-testid="contentful-component"]',
    )
    expect(contentfulComponents).toHaveLength(0)

    // The div should not be rendered when teaserContent is empty
    expect(wrapper.html()).toBe('<!--v-if-->')
  })

  it('does not render anything when teaserContent is undefined', () => {
    const mockContent = {
      sys: { id: 'plp-component' },
      fields: {
        slug: 'c/c-123',
      },
    }

    const wrapper = createWrapper(
      mockContent as unknown as TypeProductListingPageComponentSkeleton,
    )

    const contentfulComponents = wrapper.findAll(
      '[data-testid="contentful-component"]',
    )
    expect(contentfulComponents).toHaveLength(0)

    // The div should not be rendered when teaserContent is undefined
    expect(wrapper.html()).toBe('<!--v-if-->')
  })

  it('passes correct props to ContentfulComponent', () => {
    const mockTeaserContent = [
      {
        sys: { id: 'teaser-1' },
        fields: { title: 'Test Teaser' },
      },
    ]

    const mockContent = {
      sys: { id: 'plp-component' },
      fields: {
        slug: 'c/c-123',
        teaserContent: mockTeaserContent,
      },
    }

    const wrapper = createWrapper(
      mockContent as unknown as TypeProductListingPageComponentSkeleton,
    )

    const contentfulComponent = wrapper.findComponent({
      name: 'ContentfulComponent',
    })
    expect(contentfulComponent.props()).toEqual({
      contentElement: mockTeaserContent[0],
    })
  })
})
