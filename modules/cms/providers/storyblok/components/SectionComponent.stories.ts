import { computed } from 'vue'
import type { StoryObj } from '@storybook-vue/nuxt'
import type { SectionComponent as SectionType } from '../types'
import type { StoryblokAsset } from '../types/gen/storyblok'
import SectionComponent from './SectionComponent.vue'

/**
 * The Section component provides a container with customizable padding, background color,
 * and background images for desktop and mobile. It renders child content elements from Storyblok.
 */
interface SectionStoryArgs {
  padding: 'small' | 'medium' | 'large' | 'none'
  backgroundColor?: string
  backgroundImageDesktop?: StoryblokAsset
  backgroundImageMobile?: StoryblokAsset
  minHeightDesktop?: string
  minHeightMobile?: string
  content: SectionType['content']
}

const createContentElement = (
  padding: 'small' | 'medium' | 'large' | 'none' = 'medium',
  backgroundColor?: string,
  backgroundImageDesktop?: StoryblokAsset,
  backgroundImageMobile?: StoryblokAsset,
  minHeightDesktop?: string,
  minHeightMobile?: string,
  content: SectionType['content'] = [],
): SectionType => ({
  padding,
  backgroundColor,
  backgroundImageDesktop,
  backgroundImageMobile,
  minHeightDesktop,
  minHeightMobile,
  content,
  component: 'SectionComponent',
  _uid: 'story-uid',
})

const meta = {
  title: 'CMS/Storyblok/Section',
  component: SectionComponent,
  argTypes: {
    padding: {
      control: 'select',
      options: ['small', 'medium', 'large', 'none'],
      description: 'Padding size for the section',
      name: 'contentElement.padding',
    },
    backgroundColor: {
      control: 'color',
      description: 'Background color of the section',
      name: 'contentElement.backgroundColor',
    },
    backgroundImageDesktop: {
      control: 'object',
      description: 'Background image for desktop',
      name: 'contentElement.backgroundImageDesktop',
    },
    backgroundImageMobile: {
      control: 'object',
      description: 'Background image for mobile',
      name: 'contentElement.backgroundImageMobile',
    },
    minHeightDesktop: {
      control: 'text',
      description: 'Minimum height for desktop',
      name: 'contentElement.minHeightDesktop',
    },
    minHeightMobile: {
      control: 'text',
      description: 'Minimum height for mobile',
      name: 'contentElement.minHeightMobile',
    },
    content: {
      control: 'object',
      description: 'Array of content items to display in the section',
      name: 'contentElement.content',
    },
  },
  parameters: {
    docs: {
      source: {
        code: `
          <template>
            <SectionComponent :contentElement="contentElement" />
          </template>
        `,
      },
      description: {
        component:
          'A flexible container component that can hold other CMS components with configurable styling options including padding, background colors, and background images.',
      },
    },
  },
  render: (args: SectionStoryArgs) => {
    return {
      components: { SectionComponent },
      setup() {
        const contentElement = computed(() =>
          createContentElement(
            args.padding,
            args.backgroundColor,
            args.backgroundImageDesktop,
            args.backgroundImageMobile,
            args.minHeightDesktop,
            args.minHeightMobile,
            args.content,
          ),
        )
        return {
          contentElement,
        }
      },
      template: `
        <div class="w-full">
          <SectionComponent :contentElement="contentElement" />
        </div>
      `,
    }
  },
}

type Story = StoryObj<SectionStoryArgs>

export default meta

const backgroundImageUrl = 'desktopImage.avif'
const mobileBackgroundImageUrl = 'mobileImage.avif'

const mockTextContent = {
  component: 'TextComponent',
  _uid: 'text-content-1',
  content: 'This is sample text content within the section.',
  textType: 'p',
} as const

/**
 * Basic section with default styling and sample content
 */
export const Default: Story = {
  args: {
    padding: 'medium',
    content: [mockTextContent],
  },
}

/**
 * Section with background color only
 */
export const WithBackgroundColor: Story = {
  args: {
    backgroundColor: '#f3f4f6',
    padding: 'large',
    content: [mockTextContent],
  },
}

/**
 * Section with background image for desktop
 */
export const WithBackgroundImage: Story = {
  args: {
    backgroundImageDesktop: {
      filename: backgroundImageUrl,
    } as StoryblokAsset,
    padding: 'large',
    content: [
      {
        ...mockTextContent,
        content: 'This section has a background image on desktop.',
      },
    ],
  },
}

/**
 * Section with different background images for desktop and mobile
 */
export const WithResponsiveBackgroundImages: Story = {
  args: {
    backgroundImageDesktop: {
      filename: backgroundImageUrl,
    } as StoryblokAsset,
    backgroundImageMobile: {
      filename: mobileBackgroundImageUrl,
    } as StoryblokAsset,
    backgroundColor: '#1f2937',
    padding: 'large',
    content: [
      {
        ...mockTextContent,
        content:
          'This section has different background images for desktop and mobile.',
      },
    ],
  },
}

/**
 * Section with small padding
 */
export const SmallPadding: Story = {
  args: {
    backgroundColor: '#e5e7eb',
    padding: 'small',
    content: [
      {
        ...mockTextContent,
        content: 'This section has small padding (p-5).',
      },
    ],
  },
}

/**
 * Section with medium padding (default)
 */
export const MediumPadding: Story = {
  args: {
    backgroundColor: '#ddd6fe',
    padding: 'medium',
    content: [
      {
        ...mockTextContent,
        content: 'This section has medium padding (p-9).',
      },
    ],
  },
}

/**
 * Section with large padding
 */
export const LargePadding: Story = {
  args: {
    backgroundColor: '#fed7d7',
    padding: 'large',
    content: [
      {
        ...mockTextContent,
        content: 'This section has large padding (p-12).',
      },
    ],
  },
}

/**
 * Section with no padding
 */
export const NoPadding: Story = {
  args: {
    backgroundColor: '#fef3c7',
    padding: 'none',
    content: [
      {
        ...mockTextContent,
        content: 'This section has no padding (p-0).',
      },
    ],
  },
}

/**
 * Section with multiple child components
 */
export const WithMultipleChildren: Story = {
  args: {
    backgroundColor: '#f0f9ff',
    padding: 'medium',
    content: [
      {
        ...mockTextContent,
        content: 'First text element in the section.',
      },
      {
        ...mockTextContent,
        _uid: 'text-content-2',
        content: 'Second text element after the image.',
      },
      {
        component: 'DividerComponent',
        _uid: 'divider-1',
        height: 'medium',
        showLine: true,
      },
      {
        ...mockTextContent,
        _uid: 'text-content-3',
        content: 'Final text element after the divider.',
      },
    ],
  },
}

/**
 * Empty section (no content)
 */
export const Empty: Story = {
  args: {
    backgroundColor: '#f9fafb',
    padding: 'medium',
    content: [],
  },
}
