import { computed } from 'vue'
import type { StoryObj } from '@storybook-vue/nuxt'
import type {
  AccordionItemComponent as AccordionItemType,
  SectionComponent,
} from '../types'
import AccordionItemComponent from './AccordionItemComponent.vue'

/**
 * Storyblok AccordionItem component renders a single collapsible accordion entry with a title and content.
 * Uses SFAccordionEntry to provide expandable/collapsible behavior.
 *
 * Key features:
 * - Collapsible/expandable behavior via SFAccordionEntry
 * - Dynamic title from Storyblok fields
 * - Integration with StoryblokComponent for content rendering
 */
interface AccordionItemStoryArgs {
  title: string
  content: AccordionItemType['content']
}

const createContentElement = (
  title: string = 'Default Title',
  content: AccordionItemType['content'] = [],
): AccordionItemType => ({
  title,
  content,
  component: 'AccordionItemComponent',
  _uid: 'story-uid',
})

const meta = {
  title: 'CMS/Storyblok/AccordionItem',
  component: AccordionItemComponent,
  argTypes: {
    title: {
      control: 'text',
      description: 'Title of the accordion item',
      name: 'contentElement.title',
    },
    content: {
      control: 'object',
      description: 'Array of content items to display when expanded',
      name: 'contentElement.content',
    },
  },
  parameters: {
    docs: {
      source: {
        code: `
          <template>
            <AccordionItemComponent :contentElement="contentElement" />
          </template>
        `,
      },
      description: {
        component:
          'A single accordion item with collapsible content and a clickable title.',
      },
    },
  },
  render: (args: AccordionItemStoryArgs) => {
    return {
      components: { AccordionItemComponent },
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
          <AccordionItemComponent :contentElement="contentElement" />
        </div>
      `,
    }
  },
}

type Story = StoryObj<AccordionItemStoryArgs>

export default meta

/**
 * Basic accordion item with section content containing background color and text
 */
export const BasicItem: Story = {
  args: {
    title: 'Shipping Information',
    content: [
      {
        component: 'SectionComponent',
        _uid: 'section-basic',
        backgroundColor: '#f0f9ff',
        padding: 'medium',
        content: [
          {
            component: 'TextComponent',
            _uid: 'text-basic',
            content:
              'We offer free shipping on orders over $50. Standard shipping takes 3-5 business days, while express shipping delivers within 1-2 business days.',
            textType: 'p',
          },
        ],
      } as SectionComponent,
    ],
  },
}
