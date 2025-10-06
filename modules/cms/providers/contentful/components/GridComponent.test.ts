import { ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { mount, type ComponentMountingOptions } from '@vue/test-utils'
import type { RouteLocationNormalizedLoadedGeneric } from 'vue-router'
import type {
  TypeGridComponentWithoutUnresolvableLinksResponse,
  TypeTextComponentWithoutUnresolvableLinksResponse,
} from '../types'
import GridComponent from './GridComponent.vue'

// Mock ContentfulComponent - simplified stub for testing
const MockContentfulComponent = {
  name: 'ContentfulComponent',
  template: '<div class="mock-content">Mock Content</div>',
  props: ['contentElement'],
}

const mocks = vi.hoisted(() => {
  return {
    provideMock: vi.fn(),
    route: {
      query: { sort: '', page: '' },
      path: '/test',
    } as unknown as RouteLocationNormalizedLoadedGeneric,
  }
})

vi.mock('#app/composables/router', () => ({
  useRoute: vi.fn().mockReturnValue(mocks.route),
}))

describe('Contentful GridComponent', () => {
  const createWrapper = (
    contentElement: {
      fields?: Partial<
        TypeGridComponentWithoutUnresolvableLinksResponse['fields']
      >
    } & Partial<
      Omit<TypeGridComponentWithoutUnresolvableLinksResponse, 'fields'>
    >,
    global?: ComponentMountingOptions<typeof GridComponent>['global'],
  ) => {
    return mount(GridComponent, {
      props: {
        contentElement:
          contentElement as TypeGridComponentWithoutUnresolvableLinksResponse,
      },
      global: {
        ...(global || {}),
        stubs: {
          ...(global?.stubs || {}),
          ContentfulComponent: MockContentfulComponent,
        },
      },
    })
  }

  describe('desktop columns', () => {
    it('renders 1 column grid on desktop', () => {
      const wrapper = createWrapper({
        fields: {
          numberOfColumnsDesktop: 1,
          numberOfColumnsMobile: 1,
          columnContent: [],
        },
      })

      expect(wrapper.classes()).toContain('lg:grid-cols-1')
    })

    it('defaults to 2 columns for invalid values', () => {
      const wrapper = createWrapper({
        fields: {
          numberOfColumnsDesktop: 999,
          numberOfColumnsMobile: 1,
          columnContent: [],
        },
      })

      expect(wrapper.classes()).toContain('lg:grid-cols-2')
    })
  })

  describe('mobile columns', () => {
    it('renders 2 column grid on mobile', () => {
      const wrapper = createWrapper({
        fields: {
          numberOfColumnsDesktop: 2,
          numberOfColumnsMobile: 2,
          columnContent: [],
        },
      })

      expect(wrapper.classes()).toContain('grid-cols-2')
    })

    it('defaults to 1 column for invalid values', () => {
      const wrapper = createWrapper({
        fields: {
          numberOfColumnsDesktop: 2,
          numberOfColumnsMobile: 999,
          columnContent: [],
        },
      })

      expect(wrapper.classes()).toContain('grid-cols-1')
    })
  })

  describe('gaps', () => {
    it.each([
      {
        name: 'no gap by default',
        gapColumnDesktop: undefined,
        gapColumnMobile: undefined,
        gapRowDesktop: undefined,
        gapRowMobile: undefined,
        expectedClasses: ['lg:gap-x-0', 'gap-x-0', 'lg:gap-y-0', 'gap-y-0'],
      },
      {
        name: 'small gaps',
        gapColumnDesktop: 'small',
        gapColumnMobile: 'small',
        gapRowDesktop: 'small',
        gapRowMobile: 'small',
        expectedClasses: ['lg:gap-x-7', 'gap-x-3', 'lg:gap-y-7', 'gap-y-3'],
      },
      {
        name: 'medium gaps',
        gapColumnDesktop: 'medium',
        gapColumnMobile: 'medium',
        gapRowDesktop: 'medium',
        gapRowMobile: 'medium',
        expectedClasses: ['lg:gap-x-9', 'gap-x-5', 'lg:gap-y-9', 'gap-y-5'],
      },
      {
        name: 'large gaps',
        gapColumnDesktop: 'large',
        gapColumnMobile: 'large',
        gapRowDesktop: 'large',
        gapRowMobile: 'large',
        expectedClasses: ['lg:gap-x-12', 'gap-x-9', 'lg:gap-y-12', 'gap-y-9'],
      },
      {
        name: 'none gaps explicitly',
        gapColumnDesktop: 'none',
        gapColumnMobile: 'none',
        gapRowDesktop: 'none',
        gapRowMobile: 'none',
        expectedClasses: ['lg:gap-x-0', 'gap-x-0', 'lg:gap-y-0', 'gap-y-0'],
      },
    ])(
      'applies $name',
      ({
        gapColumnDesktop,
        gapColumnMobile,
        gapRowDesktop,
        gapRowMobile,
        expectedClasses,
      }) => {
        const wrapper = createWrapper({
          fields: {
            numberOfColumnsDesktop: 2,
            numberOfColumnsMobile: 1,
            gapColumnDesktop:
              gapColumnDesktop as TypeGridComponentWithoutUnresolvableLinksResponse['fields']['gapColumnDesktop'],
            gapColumnMobile:
              gapColumnMobile as TypeGridComponentWithoutUnresolvableLinksResponse['fields']['gapColumnMobile'],
            gapRowDesktop:
              gapRowDesktop as TypeGridComponentWithoutUnresolvableLinksResponse['fields']['gapRowDesktop'],
            gapRowMobile:
              gapRowMobile as TypeGridComponentWithoutUnresolvableLinksResponse['fields']['gapRowMobile'],
            columnContent: [],
          },
        })

        expectedClasses.forEach((expectedClass) => {
          expect(wrapper.classes()).toContain(expectedClass)
        })
      },
    )
  })

  describe('component structure', () => {
    it('renders with content when columnContent has elements', () => {
      const mockContent = [
        {
          sys: { id: 'content-1' },
        } as unknown as TypeTextComponentWithoutUnresolvableLinksResponse,
        {
          sys: { id: 'content-2' },
        } as unknown as TypeTextComponentWithoutUnresolvableLinksResponse,
      ]

      const wrapper = createWrapper({
        fields: {
          numberOfColumnsDesktop: 2,
          numberOfColumnsMobile: 1,
          columnContent: mockContent,
        },
      })

      // Check that the template is rendered and has v-for elements
      expect(wrapper.html()).toContain('Mock Content')
    })

    it('handles empty columnContent gracefully', () => {
      const wrapper = createWrapper({
        fields: {
          numberOfColumnsDesktop: 2,
          numberOfColumnsMobile: 1,
          columnContent: [],
        },
      })

      expect(wrapper.exists()).toBe(true)
      expect(wrapper.classes()).toContain('grid')
    })
  })

  it('should provide the correct viewport fractions', () => {
    vi.mock('vue', async (importOriginal) => {
      const actual = (await importOriginal()) as typeof import('vue')
      return {
        ...actual,
        provide: mocks.provideMock,
      }
    })

    createWrapper({
      fields: {
        numberOfColumnsDesktop: 2,
        numberOfColumnsMobile: 1,
        columnContent: [],
      },
    })

    expect(mocks.provideMock).toHaveBeenCalledWith('cmsContext', {
      desktopViewportFraction: expect.objectContaining({ value: 0.5 }),
      mobileViewportFraction: expect.objectContaining({ value: 1 }),
      maxWidths: {},
    })
  })
  it('should combine the viewport fractions', () => {
    vi.mock('vue', async (importOriginal) => {
      const actual = (await importOriginal()) as typeof import('vue')
      return {
        ...actual,
        provide: mocks.provideMock,
      }
    })
    createWrapper(
      {
        fields: {
          numberOfColumnsDesktop: 2,
          numberOfColumnsMobile: 1,
          columnContent: [],
        },
      },
      {
        provide: {
          cmsContext: {
            desktopViewportFraction: ref(0.5),
            mobileViewportFraction: ref(1),
          },
        },
      },
    )
    expect(mocks.provideMock).toHaveBeenCalledWith('cmsContext', {
      desktopViewportFraction: expect.objectContaining({ value: 0.25 }),
      mobileViewportFraction: expect.objectContaining({ value: 1 }),
    })
  })
})
