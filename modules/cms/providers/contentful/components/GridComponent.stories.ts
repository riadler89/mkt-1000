import { computed } from 'vue'
import type { StoryObj } from '@storybook-vue/nuxt'
import type {
  TypeGridComponentWithoutUnresolvableLinksResponse,
  TypeSectionComponentWithoutUnresolvableLinksResponse,
} from '../types'
import GridComponent from './GridComponent.vue'

/**
 * Contentful Grid component creates flexible grid layouts with configurable columns and gaps.
 * It renders child content elements in a responsive CSS Grid with customizable spacing for desktop and mobile.
 *
 * Key features:
 * - Responsive column configuration (1-6 columns) for desktop and mobile
 * - Flexible gap controls (none, small, medium, large) for both row and column spacing
 * - Automatic centering of grid items with justify-items-center
 * - Support for any Contentful component type as grid content
 */

type ColumnSpace = 'none' | 'small' | 'medium' | 'large'
type Alignment = 'start' | 'center' | 'end'
interface GridStoryArgs {
  numberOfColumnsDesktop: 1 | 2 | 3 | 4 | 5 | 6
  numberOfColumnsMobile: 1 | 2 | 3
  gapColumnDesktop: ColumnSpace
  gapColumnMobile: ColumnSpace
  gapRowDesktop: ColumnSpace
  gapRowMobile: ColumnSpace
  verticalContentAlignment: Alignment
  horizontalContentAlignment: Alignment
  columnContent: TypeGridComponentWithoutUnresolvableLinksResponse['fields']['columnContent']
}

const createContentElement = (
  numberOfColumnsDesktop: 1 | 2 | 3 | 4 | 5 | 6 = 2,
  numberOfColumnsMobile: 1 | 2 | 3 = 1,
  gapColumnDesktop: ColumnSpace = 'medium',
  gapColumnMobile: ColumnSpace = 'small',
  gapRowDesktop: ColumnSpace = 'medium',
  gapRowMobile: ColumnSpace = 'small',
  verticalContentAlignment: Alignment = 'start',
  horizontalContentAlignment: Alignment = 'center',
  columnContent: TypeGridComponentWithoutUnresolvableLinksResponse['fields']['columnContent'] = [],
): TypeGridComponentWithoutUnresolvableLinksResponse =>
  ({
    fields: {
      numberOfColumnsDesktop,
      numberOfColumnsMobile,
      gapColumnDesktop,
      gapColumnMobile,
      gapRowDesktop,
      gapRowMobile,
      verticalContentAlignment,
      horizontalContentAlignment,
      columnContent,
    },
  }) as unknown as TypeGridComponentWithoutUnresolvableLinksResponse

const meta = {
  title: 'CMS/Contentful/Grid',
  component: GridComponent,
  argTypes: {
    numberOfColumnsDesktop: {
      control: 'select',
      options: [1, 2, 3, 4, 5, 6],
      description: 'Number of columns on desktop',
      name: 'contentElement.fields.numberOfColumnsDesktop',
    },
    numberOfColumnsMobile: {
      control: 'select',
      options: [1, 2, 3],
      description: 'Number of columns on mobile',
      name: 'contentElement.fields.numberOfColumnsMobile',
    },
    gapColumnDesktop: {
      control: 'select',
      options: ['none', 'small', 'medium', 'large'],
      description: 'Column gap size on desktop',
      name: 'contentElement.fields.gapColumnDesktop',
    },
    gapColumnMobile: {
      control: 'select',
      options: ['none', 'small', 'medium', 'large'],
      description: 'Column gap size on mobile',
      name: 'contentElement.fields.gapColumnMobile',
    },
    gapRowDesktop: {
      control: 'select',
      options: ['none', 'small', 'medium', 'large'],
      description: 'Row gap size on desktop',
      name: 'contentElement.fields.gapRowDesktop',
    },
    gapRowMobile: {
      control: 'select',
      options: ['none', 'small', 'medium', 'large'],
      description: 'Row gap size on mobile',
      name: 'contentElement.fields.gapRowMobile',
    },
    verticalContentAlignment: {
      control: 'select',
      options: ['start', 'center', 'end'],
      description: 'Vertical alignment of content within grid items',
      name: 'contentElement.fields.verticalContentAlignment',
    },
    horizontalContentAlignment: {
      control: 'select',
      options: ['start', 'center', 'end'],
      description: 'Horizontal alignment of content within grid items',
      name: 'contentElement.fields.horizontalContentAlignment',
    },
    columnContent: {
      control: 'object',
      description: 'Array of content items to display in the grid',
      name: 'contentElement.fields.columnContent',
    },
  },
  parameters: {
    docs: {
      source: {
        code: `
          <template>
            <GridComponent :contentElement="contentElement" />
          </template>
        `,
      },
      description: {
        component:
          'A flexible grid component for arranging content elements in responsive columns with customizable gaps and alignment.',
      },
    },
  },
  render: (args: GridStoryArgs) => {
    return {
      components: { GridComponent },
      setup() {
        const contentElement = computed(() =>
          createContentElement(
            args.numberOfColumnsDesktop,
            args.numberOfColumnsMobile,
            args.gapColumnDesktop,
            args.gapColumnMobile,
            args.gapRowDesktop,
            args.gapRowMobile,
            args.verticalContentAlignment,
            args.horizontalContentAlignment,
            args.columnContent,
          ),
        )
        return {
          contentElement,
        }
      },
      template: `
        <div class="w-full p-4">
          <GridComponent :contentElement="contentElement" />
        </div>
      `,
    }
  },
}

export default meta

type Story = StoryObj<GridStoryArgs>

// Mock section components with different backgrounds
const mockSectionLight = {
  sys: {
    id: 'section-light-1',
    contentType: { sys: { id: 'SectionComponent' } },
  },
  fields: {
    backgroundColor: '#f8fafc',
    padding: 'medium',
    content: [
      {
        sys: {
          id: 'text-content-1',
          contentType: { sys: { id: 'TextComponent' } },
        },
        fields: {
          content: 'Light Background Section',
          textType: 'h3',
        },
      },
      {
        sys: {
          id: 'text-content-2',
          contentType: { sys: { id: 'TextComponent' } },
        },
        fields: {
          content:
            'This section has a light gray background with some sample content to demonstrate the grid layout.',
          textType: 'p',
        },
      },
    ],
  },
} as unknown as TypeSectionComponentWithoutUnresolvableLinksResponse

const mockSectionDark = {
  sys: {
    id: 'section-dark-1',
    contentType: { sys: { id: 'SectionComponent' } },
  },
  fields: {
    backgroundColor: '#1e293b',
    padding: 'medium',
    content: [
      {
        sys: {
          id: 'text-content-3',
          contentType: { sys: { id: 'TextComponent' } },
        },
        fields: {
          content: 'Dark Background Section',
          textType: 'h3',
        },
      },
      {
        sys: {
          id: 'text-content-4',
          contentType: { sys: { id: 'TextComponent' } },
        },
        fields: {
          content:
            'This section features a dark background to show contrast in the grid layout.',
          textType: 'p',
        },
      },
    ],
  },
} as unknown as TypeSectionComponentWithoutUnresolvableLinksResponse

const mockSectionPrimary = {
  sys: {
    id: 'section-primary-1',
    contentType: { sys: { id: 'SectionComponent' } },
  },
  fields: {
    backgroundColor: '#3b82f6',
    padding: 'medium',
    content: [
      {
        sys: {
          id: 'text-content-5',
          contentType: { sys: { id: 'TextComponent' } },
        },
        fields: {
          content: 'Primary Color Section',
          textType: 'h3',
        },
      },
      {
        sys: {
          id: 'text-content-6',
          contentType: { sys: { id: 'TextComponent' } },
        },
        fields: {
          content:
            'A vibrant blue section that stands out in the grid arrangement.',
          textType: 'p',
        },
      },
    ],
  },
} as unknown as TypeSectionComponentWithoutUnresolvableLinksResponse

const mockSectionAccent = {
  sys: {
    id: 'section-accent-1',
    contentType: { sys: { id: 'SectionComponent' } },
  },
  fields: {
    backgroundColor: '#10b981',
    padding: 'medium',
    content: [
      {
        sys: {
          id: 'text-content-7',
          contentType: { sys: { id: 'TextComponent' } },
        },
        fields: {
          content: 'Accent Section',
          textType: 'h3',
        },
      },
      {
        sys: {
          id: 'text-content-8',
          contentType: { sys: { id: 'TextComponent' } },
        },
        fields: {
          content: 'Green accent section for visual variety in the grid.',
          textType: 'p',
        },
      },
    ],
  },
} as unknown as TypeSectionComponentWithoutUnresolvableLinksResponse

/**
 * Two column grid with mixed content sections
 */
export const TwoColumns: Story = {
  args: {
    numberOfColumnsDesktop: 2,
    numberOfColumnsMobile: 1,
    gapColumnDesktop: 'medium',
    gapRowDesktop: 'medium',
    gapColumnMobile: 'small',
    gapRowMobile: 'small',
    verticalContentAlignment: 'start',
    horizontalContentAlignment: 'center',
    columnContent: [
      mockSectionLight,
      mockSectionDark,
      mockSectionPrimary,
      mockSectionAccent,
    ],
  },
}

/**
 * Three column grid layout
 */
export const ThreeColumns: Story = {
  args: {
    numberOfColumnsDesktop: 3,
    numberOfColumnsMobile: 1,
    gapColumnDesktop: 'small',
    gapRowDesktop: 'small',
    gapColumnMobile: 'small',
    gapRowMobile: 'small',
    verticalContentAlignment: 'start',
    horizontalContentAlignment: 'center',
    columnContent: [
      mockSectionLight,
      mockSectionDark,
      mockSectionPrimary,
      mockSectionAccent,
      mockSectionLight,
      mockSectionDark,
    ],
  },
}

/**
 * Grid with large gaps
 */
export const LargeGaps: Story = {
  args: {
    numberOfColumnsDesktop: 2,
    numberOfColumnsMobile: 2,
    gapColumnDesktop: 'large',
    gapRowDesktop: 'large',
    gapColumnMobile: 'medium',
    gapRowMobile: 'medium',
    verticalContentAlignment: 'start',
    horizontalContentAlignment: 'center',
    columnContent: [
      mockSectionLight,
      mockSectionDark,
      mockSectionPrimary,
      mockSectionAccent,
    ],
  },
}

/**
 * Grid with no gaps
 */
export const NoGaps: Story = {
  args: {
    numberOfColumnsDesktop: 3,
    numberOfColumnsMobile: 2,
    gapColumnDesktop: 'none',
    gapRowDesktop: 'none',
    gapColumnMobile: 'none',
    gapRowMobile: 'none',
    verticalContentAlignment: 'start',
    horizontalContentAlignment: 'center',
    columnContent: [mockSectionLight, mockSectionDark, mockSectionPrimary],
  },
}
