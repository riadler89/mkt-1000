import { describe, expect, it, vi } from 'vitest'
import type { ComponentMountingOptions } from '@vue/test-utils'
import { mount } from '@vue/test-utils'
import type { RouteLocationNormalizedLoadedGeneric } from 'vue-router'
import { computed } from 'vue'
import type {
  GridComponent as GridComponentType,
  TextComponent,
} from '../types'
import GridComponent from './GridComponent.vue'

// Mock StoryblokComponent - simplified stub for testing
const MockStoryblokComponent = {
  name: 'StoryblokComponent',
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
// Mock the v-editable directive since it's not available in test environment
const vEditableMock = {
  beforeMount: () => {},
  updated: () => {},
}

describe('Storyblok GridComponent', () => {
  const createWrapper = (
    contentElement: Partial<GridComponentType>,
    global?: ComponentMountingOptions<typeof GridComponent>['global'],
  ) => {
    return mount(GridComponent, {
      props: {
        contentElement: contentElement as GridComponentType,
      },
      global: {
        ...(global || {}),
        stubs: {
          ...(global?.stubs || {}),
          StoryblokComponent: MockStoryblokComponent,
        },
        directives: {
          ...(global?.directives || {}),
          editable: vEditableMock,
        },
      },
    })
  }

  describe('desktop columns', () => {
    it('renders 1 column grid on desktop', () => {
      const wrapper = createWrapper(
        {
          numberOfColumnsDesktop: '1',
          numberOfColumnsMobile: '1',
          columnContent: [],
          component: 'GridComponent',
          _uid: 'test-uid',
        },
        {},
      )

      expect(wrapper.classes()).toContain('lg:grid-cols-1')
    })

    it('defaults to 2 columns for invalid values', () => {
      const wrapper = createWrapper({
        numberOfColumnsDesktop: 'invalid',
        numberOfColumnsMobile: '1',
        columnContent: [],
        component: 'GridComponent',
        _uid: 'test-uid',
      })

      expect(wrapper.classes()).toContain('lg:grid-cols-2')
    })
  })

  describe('mobile columns', () => {
    it('renders 1 column grid on mobile', () => {
      const wrapper = createWrapper({
        numberOfColumnsDesktop: '2',
        numberOfColumnsMobile: '1',
        columnContent: [],
        component: 'GridComponent',
        _uid: 'test-uid',
      })

      expect(wrapper.classes()).toContain('grid-cols-1')
    })

    it('renders 2 column grid on mobile', () => {
      const wrapper = createWrapper({
        numberOfColumnsDesktop: '2',
        numberOfColumnsMobile: '2',
        columnContent: [],
        component: 'GridComponent',
        _uid: 'test-uid',
      })

      expect(wrapper.classes()).toContain('grid-cols-2')
    })

    it('defaults to 1 column for invalid values', () => {
      const wrapper = createWrapper({
        numberOfColumnsDesktop: '2',
        numberOfColumnsMobile: 'invalid',
        columnContent: [],
        component: 'GridComponent',
        _uid: 'test-uid',
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
      {
        name: 'empty string values',
        gapColumnDesktop: '',
        gapColumnMobile: '',
        gapRowDesktop: '',
        gapRowMobile: '',
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
          numberOfColumnsDesktop: '2',
          numberOfColumnsMobile: '1',
          gapColumnDesktop:
            gapColumnDesktop as GridComponentType['gapColumnDesktop'],
          gapColumnMobile:
            gapColumnMobile as GridComponentType['gapColumnMobile'],
          gapRowDesktop: gapRowDesktop as GridComponentType['gapRowDesktop'],
          gapRowMobile: gapRowMobile as GridComponentType['gapRowMobile'],
          columnContent: [],
          component: 'GridComponent',
          _uid: 'test-uid',
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
        { _uid: 'content-1', component: 'TextComponent' } as TextComponent,
        { _uid: 'content-2', component: 'TextComponent' } as TextComponent,
      ]

      const wrapper = createWrapper({
        numberOfColumnsDesktop: '2',
        numberOfColumnsMobile: '1',
        columnContent: mockContent,
        component: 'GridComponent',
        _uid: 'test-uid',
      })

      // Check that the template is rendered and has v-for elements
      expect(wrapper.html()).toContain('Mock Content')
    })

    it('handles empty columnContent gracefully', () => {
      const wrapper = createWrapper({
        numberOfColumnsDesktop: '2',
        numberOfColumnsMobile: '1',
        columnContent: [],
        component: 'GridComponent',
        _uid: 'test-uid',
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
      numberOfColumnsDesktop: '2',
      numberOfColumnsMobile: '1',
      columnContent: [],
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
        numberOfColumnsDesktop: '2',
        numberOfColumnsMobile: '1',
        columnContent: [],
      },
      {
        provide: {
          cmsContext: {
            desktopViewportFraction: computed(() => 0.5),
            mobileViewportFraction: computed(() => 1),
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
