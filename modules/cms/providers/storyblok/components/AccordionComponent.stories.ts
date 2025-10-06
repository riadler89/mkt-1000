import { computed } from 'vue'
import type { StoryObj } from '@storybook-vue/nuxt'
import type {
  AccordionItemComponent,
  AccordionComponent as AccordionType,
} from '../types'
import AccordionComponent from './AccordionComponent.vue'

/**
 * Storyblok Accordion component displays a collapsible container with a title and multiple accordion items.
 * It renders accordion entries using AccordionItemComponent instances with expandable/collapsible behavior.
 *
 * Key features:
 * - Optional accordion title displayed above items
 * - Dynamic rendering of accordion items from Storyblok content
 * - Supports any number of accordion items
 * - Seamless integration with StoryblokComponent for nested content rendering
 */
interface AccordionStoryArgs {
  title?: string
  content: AccordionType['content']
}

const createContentElement = (
  title?: string,
  content: AccordionType['content'] = [],
): AccordionType => ({
  title,
  content,
  component: 'AccordionComponent',
  _uid: 'story-uid',
})

const meta = {
  title: 'CMS/Storyblok/Accordion',
  component: AccordionComponent,
  argTypes: {
    title: {
      control: 'text',
      description: 'Optional title displayed above accordion items',
      name: 'contentElement.title',
    },
    content: {
      control: 'object',
      description: 'Array of accordion items to display',
      name: 'contentElement.content',
    },
  },
  parameters: {
    docs: {
      source: {
        code: `
          <template>
            <AccordionComponent :contentElement="contentElement" />
          </template>
        `,
      },
      description: {
        component:
          'A collapsible accordion container with optional title and multiple expandable items.',
      },
    },
  },
  render: (args: AccordionStoryArgs) => {
    return {
      components: { AccordionComponent },
      setup() {
        const contentElement = computed(() =>
          createContentElement(args.title, args.content),
        )
        return {
          contentElement,
        }
      },
      template: `
        <div class="w-full max-w-2xl">
          <AccordionComponent :contentElement="contentElement" />
        </div>
      `,
    }
  },
}

export default meta
type Story = StoryObj<AccordionStoryArgs>

const mockAccordionItem1 = {
  component: 'AccordionItemComponent',
  _uid: 'accordion-item-1',
  title: 'Shipping Information',
  content: [
    {
      component: 'SectionComponent',
      _uid: 'section-1',
      backgroundColor: '#f0f9ff',
      padding: 'medium',
      content: [
        {
          component: 'TextComponent',
          _uid: 'text-1',
          content:
            'We offer free shipping on orders over $50. Standard shipping takes 3-5 business days, while express shipping delivers within 1-2 business days.',
          textType: 'p',
        },
      ],
    },
  ],
} as AccordionItemComponent

const mockAccordionItem2 = {
  component: 'AccordionItemComponent',
  _uid: 'accordion-item-2',
  title: 'Return Policy',
  content: [
    {
      component: 'SectionComponent',
      _uid: 'section-2',
      backgroundColor: '#fef3c7',
      padding: 'medium',
      content: [
        {
          component: 'TextComponent',
          _uid: 'text-2',
          content:
            'Returns are accepted within 30 days of purchase. Items must be unused and in original packaging. Return shipping costs are covered by the customer.',
          textType: 'p',
        },
      ],
    },
  ],
} as AccordionItemComponent

const mockAccordionItem3 = {
  component: 'AccordionItemComponent',
  _uid: 'accordion-item-3',
  title: 'Product Care',
  content: [
    {
      component: 'SectionComponent',
      _uid: 'section-3',
      backgroundColor: '#f0fdf4',
      padding: 'medium',
      content: [
        {
          component: 'TextComponent',
          _uid: 'text-3',
          content:
            'Machine wash cold with like colors. Do not bleach. Tumble dry low. Iron on medium heat if needed. Do not dry clean.',
          textType: 'p',
        },
      ],
    },
  ],
} as AccordionItemComponent

/**
 * Accordion with title and multiple items
 */
export const WithTitle: Story = {
  args: {
    title: 'Product FAQ',
    content: [
      mockAccordionItem1,
      mockAccordionItem2,
      mockAccordionItem3,
    ] as AccordionType['content'],
  },
}

/**
 * Accordion without title, just the collapsible items
 */
export const WithoutTitle: Story = {
  args: {
    content: [
      mockAccordionItem1,
      mockAccordionItem2,
    ] as AccordionType['content'],
  },
}

/**
 * Single accordion item
 */
export const SingleItem: Story = {
  args: {
    title: 'Contact Information',
    content: [mockAccordionItem1] as AccordionType['content'],
  },
}
