import { computed } from 'vue'
import type { StoryObj } from '@storybook-vue/nuxt'
import type {
  GridComponent as GridComponentType,
  SectionComponent,
} from '../types'
import GridComponent from './GridComponent.vue'

/**
 * Storyblok Grid component creates flexible grid layouts with configurable columns and gaps.
 * It renders child content elements in a responsive CSS Grid with customizable spacing for desktop and mobile.
 *
 * Key features:
 * - Responsive column configuration (1-6 columns) for desktop and mobile
 * - Flexible gap controls (none, small, medium, large) for both row and column spacing
 * - Automatic centering of grid items with justify-items-center
 * - Support for any Storyblok component type as grid content
 * - Storyblok editor integration with v-editable directive
 */

type ColumnSpace = 'none' | 'small' | 'medium' | 'large'
interface GridStoryArgs {
  numberOfColumnsDesktop: '1' | '2' | '3' | '4' | '5' | '6'
  numberOfColumnsMobile: '1' | '2' | '3'
  gapColumnDesktop: ColumnSpace
  gapColumnMobile: ColumnSpace
  gapRowDesktop: ColumnSpace
  gapRowMobile: ColumnSpace
  verticalContentAlignment: '' | 'Top' | 'Middle' | 'Bottom'
  horizontalContentAlignment: '' | 'Left' | 'Center' | 'Right'
  columnContent: GridComponentType['columnContent']
}

const createContentElement = (
  numberOfColumnsDesktop: '1' | '2' | '3' | '4' | '5' | '6' = '2',
  numberOfColumnsMobile: '1' | '2' | '3' = '1',
  gapColumnDesktop: ColumnSpace = 'medium',
  gapColumnMobile: ColumnSpace = 'small',
  gapRowDesktop: ColumnSpace = 'medium',
  gapRowMobile: ColumnSpace = 'small',
  verticalContentAlignment: '' | 'Top' | 'Middle' | 'Bottom' = '',
  horizontalContentAlignment: '' | 'Left' | 'Center' | 'Right' = 'Center',
  columnContent: GridComponentType['columnContent'] = [],
): GridComponentType => ({
  numberOfColumnsDesktop,
  numberOfColumnsMobile,
  gapColumnDesktop,
  gapColumnMobile,
  gapRowDesktop,
  gapRowMobile,
  verticalContentAlignment,
  horizontalContentAlignment,
  columnContent,
  component: 'GridComponent',
  _uid: 'story-uid',
})

const meta = {
  title: 'CMS/Storyblok/Grid',
  component: GridComponent,
  argTypes: {
    numberOfColumnsDesktop: {
      control: 'select',
      options: ['1', '2', '3', '4', '5', '6'],
      description: 'Number of columns on desktop',
      name: 'contentElement.numberOfColumnsDesktop',
    },
    numberOfColumnsMobile: {
      control: 'select',
      options: ['1', '2', '3'],
      description: 'Number of columns on mobile',
      name: 'contentElement.numberOfColumnsMobile',
    },
    gapColumnDesktop: {
      control: 'select',
      options: ['none', 'small', 'medium', 'large'],
      description: 'Column gap size on desktop',
      name: 'contentElement.gapColumnDesktop',
    },
    gapColumnMobile: {
      control: 'select',
      options: ['none', 'small', 'medium', 'large'],
      description: 'Column gap size on mobile',
      name: 'contentElement.gapColumnMobile',
    },
    gapRowDesktop: {
      control: 'select',
      options: ['none', 'small', 'medium', 'large'],
      description: 'Row gap size on desktop',
      name: 'contentElement.gapRowDesktop',
    },
    gapRowMobile: {
      control: 'select',
      options: ['none', 'small', 'medium', 'large'],
      description: 'Row gap size on mobile',
      name: 'contentElement.gapRowMobile',
    },
    verticalContentAlignment: {
      control: 'select',
      options: ['', 'Top', 'Middle', 'Bottom'],
      description: 'Vertical alignment of content within grid items',
      name: 'contentElement.verticalContentAlignment',
    },
    horizontalContentAlignment: {
      control: 'select',
      options: ['', 'Left', 'Center', 'Right'],
      description: 'Horizontal alignment of content within grid items',
      name: 'contentElement.horizontalContentAlignment',
    },
    columnContent: {
      control: 'object',
      description: 'Array of content items to display in the grid',
      name: 'contentElement.columnContent',
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
  component: 'SectionComponent',
  _uid: 'section-light-1',
  backgroundColor: '#f8fafc',
  padding: 'medium',
  content: [
    {
      component: 'TextComponent',
      _uid: 'text-content-1',
      content: 'Light Background Section',
      textType: 'h3',
    },
    {
      component: 'TextComponent',
      _uid: 'text-content-2',
      content:
        'This section has a light gray background with some sample content to demonstrate the grid layout.',
      textType: 'p',
    },
  ],
} as const as unknown as SectionComponent

const mockSectionDark = {
  component: 'SectionComponent',
  _uid: 'section-dark-1',
  backgroundColor: '#1e293b',
  padding: 'medium',
  content: [
    {
      component: 'TextComponent',
      _uid: 'text-content-3',
      content: 'Dark Background Section',
      textType: 'h3',
    },
    {
      component: 'TextComponent',
      _uid: 'text-content-4',
      content:
        'This section features a dark background to show contrast in the grid layout.',
      textType: 'p',
    },
  ],
} as const as unknown as SectionComponent

const mockSectionPrimary = {
  component: 'SectionComponent',
  _uid: 'section-primary-1',
  backgroundColor: '#3b82f6',
  padding: 'medium',
  content: [
    {
      component: 'TextComponent',
      _uid: 'text-content-5',
      content: 'Primary Color Section',
      textType: 'h3',
    },
    {
      component: 'TextComponent',
      _uid: 'text-content-6',
      content:
        'A vibrant blue section that stands out in the grid arrangement.',
      textType: 'p',
    },
  ],
} as const as unknown as SectionComponent

const mockSectionAccent = {
  component: 'SectionComponent',
  _uid: 'section-accent-1',
  backgroundColor: '#10b981',
  padding: 'medium',
  content: [
    {
      component: 'TextComponent',
      _uid: 'text-content-7',
      content: 'Accent Section',
      textType: 'h3',
    },
    {
      component: 'TextComponent',
      _uid: 'text-content-8',
      content: 'Green accent section for visual variety in the grid.',
      textType: 'p',
    },
  ],
} as const as unknown as SectionComponent

/**
 * Two column grid with mixed content sections
 */
export const TwoColumns: Story = {
  args: {
    numberOfColumnsDesktop: '2',
    numberOfColumnsMobile: '1',
    gapColumnDesktop: 'medium',
    gapRowDesktop: 'medium',
    gapColumnMobile: 'small',
    gapRowMobile: 'small',
    verticalContentAlignment: '',
    horizontalContentAlignment: 'Center',
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
    numberOfColumnsDesktop: '3',
    numberOfColumnsMobile: '1',
    gapColumnDesktop: 'small',
    gapRowDesktop: 'small',
    gapColumnMobile: 'small',
    gapRowMobile: 'small',
    verticalContentAlignment: '',
    horizontalContentAlignment: 'Center',
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
    numberOfColumnsDesktop: '2',
    numberOfColumnsMobile: '2',
    gapColumnDesktop: 'large',
    gapRowDesktop: 'large',
    gapColumnMobile: 'medium',
    gapRowMobile: 'medium',
    verticalContentAlignment: '',
    horizontalContentAlignment: 'Center',
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
    numberOfColumnsDesktop: '3',
    numberOfColumnsMobile: '2',
    gapColumnDesktop: 'none',
    gapRowDesktop: 'none',
    gapColumnMobile: 'none',
    gapRowMobile: 'none',
    verticalContentAlignment: '',
    horizontalContentAlignment: 'Center',
    columnContent: [mockSectionLight, mockSectionDark, mockSectionPrimary],
  },
}

/**
 * Single column layout for mobile-first design
 */
export const SingleColumn: Story = {
  args: {
    numberOfColumnsDesktop: '1',
    numberOfColumnsMobile: '1',
    gapColumnDesktop: 'medium',
    gapRowDesktop: 'medium',
    gapColumnMobile: 'small',
    gapRowMobile: 'small',
    verticalContentAlignment: '',
    horizontalContentAlignment: 'Center',
    columnContent: [mockSectionLight, mockSectionDark, mockSectionPrimary],
  },
}
