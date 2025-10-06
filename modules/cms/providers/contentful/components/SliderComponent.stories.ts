import { computed } from 'vue'
import type { StoryObj } from '@storybook-vue/nuxt'
import type {
  TypeSliderComponentWithoutUnresolvableLinksResponse,
  TypeSectionComponentWithoutUnresolvableLinksResponse,
  TypeTextComponentWithoutUnresolvableLinksResponse,
} from '../types'
import SliderComponent from './SliderComponent.vue'

/**
 * Contentful Slider component displays a horizontal carousel of content with navigation controls.
 * It provides an interactive slider interface with configurable navigation arrows and pagination indicators.
 *
 * Key features:
 * - Horizontal scrolling carousel with snap-to-slide behavior
 * - Optional navigation arrows for previous/next navigation
 * - Optional pagination indicators showing current slide position
 * - Supports any Contentful content entries within slides
 * - Responsive design with mobile-friendly touch interactions
 */
interface SliderStoryArgs {
  content: TypeSliderComponentWithoutUnresolvableLinksResponse['fields']['content']
  showNavigationArrows: boolean
  showPaginationIndicators: boolean
}

const createContentElement = (
  content: TypeSliderComponentWithoutUnresolvableLinksResponse['fields']['content'] = [],
  showNavigationArrows = true,
  showPaginationIndicators = true,
): TypeSliderComponentWithoutUnresolvableLinksResponse =>
  ({
    sys: {
      id: 'slider-basic',
      contentType: { sys: { id: 'SliderComponent' } },
    },
    fields: {
      content,
      showNavigationArrows,
      showPaginationIndicators,
    },
  }) as TypeSliderComponentWithoutUnresolvableLinksResponse

const meta = {
  title: 'CMS/Contentful/Slider',
  component: SliderComponent,
  argTypes: {
    content: {
      control: 'object',
      description: 'Array of content items to display in the slider',
      name: 'contentElement.fields.content',
    },
    showNavigationArrows: {
      control: 'boolean',
      description: 'Whether to show navigation arrows',
      name: 'contentElement.fields.showNavigationArrows',
    },
    showPaginationIndicators: {
      control: 'boolean',
      description: 'Whether to show pagination indicators',
      name: 'contentElement.fields.showPaginationIndicators',
    },
  },
  parameters: {
    docs: {
      source: {
        code: `
          <template>
            <SliderComponent :contentElement="contentElement" />
          </template>
        `,
      },
      description: {
        component:
          'A horizontal carousel component with configurable navigation controls and pagination indicators.',
      },
    },
  },
  render: (args: SliderStoryArgs) => {
    return {
      components: { SliderComponent },
      setup() {
        const contentElement = computed(() =>
          createContentElement(
            args.content,
            args.showNavigationArrows,
            args.showPaginationIndicators,
          ),
        )
        return {
          contentElement,
        }
      },
      template: `<SliderComponent :contentElement="contentElement" />`,
    }
  },
}

export default meta

type Story = StoryObj<SliderStoryArgs>

const createTextComponent = (
  content: string,
  textType: 'h1' | 'h2' | 'h3' | 'h4' | 'p' = 'p',
  id: string,
): TypeTextComponentWithoutUnresolvableLinksResponse =>
  ({
    sys: {
      id,
      type: 'Entry',
      contentType: {
        sys: {
          id: 'TextComponent',
          type: 'Link',
          linkType: 'ContentType',
        },
      },
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
      locale: 'en-US',
      revision: 1,
    },
    fields: {
      content,
      textType,
    },
  }) as unknown as TypeTextComponentWithoutUnresolvableLinksResponse

const createSectionSlide = (
  content: string,
  textType: 'h1' | 'h2' | 'h3' | 'h4' | 'p' = 'p',
  backgroundColor: string,
  id: string,
): TypeSectionComponentWithoutUnresolvableLinksResponse =>
  ({
    sys: {
      id,
      type: 'Entry',
      contentType: {
        sys: {
          id: 'SectionComponent',
          type: 'Link',
          linkType: 'ContentType',
        },
      },
      createdAt: '2023-01-01T00:00:00Z',
      updatedAt: '2023-01-01T00:00:00Z',
      locale: 'en-US',
      revision: 1,
    },
    fields: {
      backgroundColor,
      padding: 'large',
      content: [createTextComponent(content, textType, `text-${id}`)],
    },
  }) as unknown as TypeSectionComponentWithoutUnresolvableLinksResponse

/**
 * Default slider with section content and full navigation controls
 */
export const Default: Story = {
  args: {
    showNavigationArrows: true,
    showPaginationIndicators: true,
    content: [
      createSectionSlide(
        'Welcome to our amazing collection',
        'h1',
        '#fef2f2',
        'slide-1',
      ),
      createSectionSlide(
        'Discover premium products crafted with care',
        'h2',
        '#f0f9ff',
        'slide-2',
      ),
      createSectionSlide(
        'Experience quality that speaks for itself',
        'h2',
        '#f0fdf4',
        'slide-3',
      ),
      createSectionSlide(
        'Join thousands of satisfied customers worldwide',
        'p',
        '#fefce8',
        'slide-4',
      ),
    ],
  },
}

/**
 * Slider without navigation arrows, pagination indicators only
 */
export const PaginationOnly: Story = {
  args: {
    showNavigationArrows: false,
    showPaginationIndicators: true,
    content: [
      createSectionSlide('Slide One', 'h2', '#fdf2f8', 'slide-1'),
      createSectionSlide('Slide Two', 'h2', '#f0f4ff', 'slide-2'),
      createSectionSlide('Slide Three', 'h2', '#f7fee7', 'slide-3'),
    ],
  },
}

/**
 * Slider with navigation arrows only, no pagination indicators
 */
export const ArrowsOnly: Story = {
  args: {
    showNavigationArrows: true,
    showPaginationIndicators: false,
    content: [
      createSectionSlide('Navigate with arrows', 'h2', '#fff1f2', 'slide-1'),
      createSectionSlide(
        'Previous and next buttons available',
        'p',
        '#eff6ff',
        'slide-2',
      ),
      createSectionSlide(
        'Clean interface without dots',
        'p',
        '#f0fdfa',
        'slide-3',
      ),
    ],
  },
}

/**
 * Minimal slider without any navigation controls
 */
export const Minimal: Story = {
  args: {
    showNavigationArrows: false,
    showPaginationIndicators: false,
    content: [
      createSectionSlide('Swipe to navigate', 'h2', '#faf5ff', 'slide-1'),
      createSectionSlide(
        'Touch and drag interaction',
        'p',
        '#fefce8',
        'slide-2',
      ),
      createSectionSlide('Clean minimal design', 'p', '#ecfdf5', 'slide-3'),
    ],
  },
}
