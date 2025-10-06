import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import type { ProductListingPageComponent } from '../types'
import ProductListingPageComponentVue from './ProductListingPageComponent.vue'

const { useCMSBySlugMock, useStoryblokEditorMock } = vi.hoisted(() => {
  return {
    useCMSBySlugMock: vi.fn(),
    useStoryblokEditorMock: vi.fn(),
  }
})

// Mock the useCMSBySlug composable
vi.mock('../composables/useCMS', () => ({
  useCMSBySlug: useCMSBySlugMock,
}))

// Mock the useStoryblokEditor composable
vi.mock('../composables/useStoryblokEditor', () => ({
  useStoryblokEditor: useStoryblokEditorMock,
}))

describe('Storyblok ProductListingPageComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const createWrapper = (
    mockData: { data: { story: ProductListingPageComponent } } | null = null,
  ) => {
    // Mock the return value of useCMSBySlug
    useCMSBySlugMock.mockReturnValue({
      data: ref(mockData),
    })

    return mount(ProductListingPageComponentVue, {
      props: {
        categoryId: 123,
      },
      global: {
        stubs: {
          StoryblokComponent: {
            name: 'StoryblokComponent',
            template:
              '<div data-testid="storyblok-component" :data-content-uid="contentElement._uid">Mock StoryblokComponent</div>',
            props: ['contentElement'],
          },
        },
        directives: {
          editable: {},
        },
      },
    })
  }

  it('renders teaser content components when data is available', () => {
    const mockTeaserContent = [
      {
        _uid: 'teaser-1',
        component: 'ImageComponent',
        title: 'First Teaser',
      },
      {
        _uid: 'teaser-2',
        component: 'SectionComponent',
        title: 'Second Teaser',
      },
    ]

    const mockContent = {
      data: {
        story: {
          _uid: 'plp-story',
          component: 'ProductListingPageComponent',
          content: {
            teaserContent: mockTeaserContent,
          },
        } as ProductListingPageComponent,
      },
    }

    const wrapper = createWrapper(mockContent)

    // Check that useCMSBySlug was called with correct parameters
    expect(useCMSBySlugMock).toHaveBeenCalledWith(
      'product-listing-page-123',
      expect.objectContaining({
        value: 'c/c-123',
      }),
    )

    // Check that StoryblokComponent is rendered for each teaser content item
    const storyblokComponents = wrapper.findAll(
      '[data-testid="storyblok-component"]',
    )
    expect(storyblokComponents).toHaveLength(2)

    // Check that the components have the correct content UIDs
    expect(storyblokComponents[0]?.attributes('data-content-uid')).toBe(
      'teaser-1',
    )
    expect(storyblokComponents[1]?.attributes('data-content-uid')).toBe(
      'teaser-2',
    )

    // Check that useStoryblokEditor was called with the content
    expect(useStoryblokEditorMock).toHaveBeenCalledWith(expect.any(Object))
  })

  it('does not render anything when teaserContent is empty', () => {
    const mockContent = {
      data: {
        story: {
          _uid: 'plp-story',
          component: 'ProductListingPageComponent',
          content: {
            teaserContent: [],
          },
        } as ProductListingPageComponent,
      },
    }

    const wrapper = createWrapper(mockContent)

    const storyblokComponents = wrapper.findAll(
      '[data-testid="storyblok-component"]',
    )
    expect(storyblokComponents).toHaveLength(0)

    // The div should not be rendered when teaserContent is empty
    expect(wrapper.html()).toBe('<!--v-if-->')
  })

  it('does not render anything when teaserContent is undefined', () => {
    const mockContent = {
      data: {
        story: {
          _uid: 'plp-story',
          component: 'ProductListingPageComponent',
          content: {},
        } as ProductListingPageComponent,
      },
    }

    const wrapper = createWrapper(mockContent)

    const storyblokComponents = wrapper.findAll(
      '[data-testid="storyblok-component"]',
    )
    expect(storyblokComponents).toHaveLength(0)

    // The div should not be rendered when teaserContent is undefined
    expect(wrapper.html()).toBe('<!--v-if-->')
  })

  it('passes correct props to StoryblokComponent', () => {
    const mockTeaserContent = [
      {
        _uid: 'teaser-1',
        component: 'TextComponent',
        title: 'Test Teaser',
      },
    ]

    const mockContent = {
      data: {
        story: {
          _uid: 'plp-story',
          component: 'ProductListingPageComponent',
          content: {
            teaserContent: mockTeaserContent,
          },
        } as ProductListingPageComponent,
      },
    }

    const wrapper = createWrapper(mockContent)

    const storyblokComponent = wrapper.findComponent({
      name: 'StoryblokComponent',
    })
    expect(storyblokComponent.props()).toEqual({
      contentElement: mockTeaserContent[0],
    })
  })
})
