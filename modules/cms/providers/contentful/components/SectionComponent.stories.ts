import { computed } from 'vue'
import type { StoryObj } from '@storybook-vue/nuxt'
import type { Asset } from 'contentful'
import type {
  TypeDividerComponentWithoutUnresolvableLinksResponse,
  TypeSectionComponentWithoutUnresolvableLinksResponse,
  TypeTextComponentWithoutUnresolvableLinksResponse,
} from '../types'
import SectionComponent from './SectionComponent.vue'

/**
 * The Section component provides a container with customizable padding, background color,
 * and background images for desktop and mobile. It renders child content elements from Contentful.
 */
interface SectionStoryArgs {
  padding: 'small' | 'medium' | 'large' | 'none'
  backgroundColor?: string
  backgroundImageDesktop?: Asset
  backgroundImageMobile?: Asset
  minHeightDesktop?: string
  minHeightMobile?: string
  content: TypeSectionComponentWithoutUnresolvableLinksResponse['fields']['content']
}

const createContentElement = (
  padding: 'small' | 'medium' | 'large' | 'none' = 'medium',
  backgroundColor?: string,
  backgroundImageDesktop?: Asset,
  backgroundImageMobile?: Asset,
  minHeightDesktop?: string,
  minHeightMobile?: string,
  content: TypeSectionComponentWithoutUnresolvableLinksResponse['fields']['content'] = [],
): TypeSectionComponentWithoutUnresolvableLinksResponse =>
  ({
    fields: {
      padding,
      backgroundColor,
      backgroundImageDesktop,
      backgroundImageMobile,
      minHeightDesktop,
      minHeightMobile,
      content,
    },
  }) as TypeSectionComponentWithoutUnresolvableLinksResponse

const meta = {
  title: 'CMS/Contentful/Section',
  component: SectionComponent,
  argTypes: {
    padding: {
      control: 'select',
      options: ['small', 'medium', 'large', 'none'],
      description: 'Padding size for the section',
      name: 'contentElement.fields.padding',
    },
    backgroundColor: {
      control: 'color',
      description: 'Background color of the section',
      name: 'contentElement.fields.backgroundColor',
    },
    backgroundImageDesktop: {
      control: 'object',
      description: 'Background image for desktop',
      name: 'contentElement.fields.backgroundImageDesktop',
    },
    backgroundImageMobile: {
      control: 'object',
      description: 'Background image for mobile',
      name: 'contentElement.fields.backgroundImageMobile',
    },
    minHeightDesktop: {
      control: 'text',
      description: 'Minimum height for desktop',
      name: 'contentElement.fields.minHeightDesktop',
    },
    minHeightMobile: {
      control: 'text',
      description: 'Minimum height for mobile',
      name: 'contentElement.fields.minHeightMobile',
    },
    content: {
      control: 'object',
      description: 'Array of content items to display in the section',
      name: 'contentElement.fields.content',
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
      components: { Section: SectionComponent },
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
          <Section :contentElement="contentElement" />
        </div>
      `,
    }
  },
}

const backgroundImageUrl = 'desktopImage.avif'
const mobileBackgroundImageUrl = 'mobileImage.avif'

export default meta
type Story = StoryObj<SectionStoryArgs>

const backgroundImage = {
  fields: {
    file: {
      url: backgroundImageUrl,
    },
  },
} as Asset<'WITHOUT_UNRESOLVABLE_LINKS', string>

const mobileBackgroundImage = {
  fields: {
    file: {
      url: mobileBackgroundImageUrl,
    },
  },
} as Asset<'WITHOUT_UNRESOLVABLE_LINKS', string>

const mockTextContent = {
  sys: {
    id: 'text-content-1',
    contentType: { sys: { id: 'TextComponent' } },
  },
  fields: {
    content: 'This is sample text content within the section.',
    textType: 'p',
  },
} as TypeTextComponentWithoutUnresolvableLinksResponse

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
    backgroundImageDesktop: backgroundImage,
    padding: 'large',
    content: [
      {
        ...mockTextContent,
        fields: {
          ...mockTextContent.fields,
          content: 'This section has a background image on desktop.',
        },
      },
    ],
  },
}

/**
 * Section with different background images for desktop and mobile
 */
export const WithResponsiveBackgroundImages: Story = {
  args: {
    backgroundImageDesktop: backgroundImage,
    backgroundImageMobile: mobileBackgroundImage,
    backgroundColor: '#1f2937',
    padding: 'large',
    content: [
      {
        ...mockTextContent,
        fields: {
          ...mockTextContent.fields,
          content:
            'This section has different background images for desktop and mobile.',
        },
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
        fields: {
          ...mockTextContent.fields,
          content: 'This section has small padding (p-5).',
        },
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
        fields: {
          ...mockTextContent.fields,
          content: 'This section has medium padding (p-9).',
        },
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
        fields: {
          ...mockTextContent.fields,
          content: 'This section has large padding (p-12).',
        },
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
        fields: {
          ...mockTextContent.fields,
          content: 'This section has no padding (p-0).',
        },
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
        fields: {
          ...mockTextContent.fields,
          content: 'First text element in the section.',
        },
      },
      {
        ...mockTextContent,
        sys: { ...mockTextContent.sys, id: 'text-content-2' },
        fields: {
          ...mockTextContent.fields,
          content: 'Second text element after the image.',
        },
      },
      {
        sys: {
          id: 'divider-1',
          contentType: { sys: { id: 'DividerComponent' } },
        },
        fields: {
          name: 'Divider',
          height: 'medium',
          showLine: true,
        },
      } as TypeDividerComponentWithoutUnresolvableLinksResponse,
      {
        ...mockTextContent,
        sys: { ...mockTextContent.sys, id: 'text-content-3' },
        fields: {
          ...mockTextContent.fields,
          content: 'Final text element after the divider.',
        },
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
