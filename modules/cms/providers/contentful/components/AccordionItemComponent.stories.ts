import { computed } from 'vue'
import type { StoryObj } from '@storybook-vue/nuxt'
import type {
  TypeAccordionItemComponentWithoutUnresolvableLinksResponse,
  TypeSectionComponentWithoutUnresolvableLinksResponse,
} from '../types'
import AccordionItemComponent from './AccordionItemComponent.vue'

/**
 * Contentful AccordionItem component renders a single collapsible accordion entry with a title and content.
 * Uses SFAccordionEntry to provide expandable/collapsible behavior.
 *
 * Key features:
 * - Collapsible/expandable behavior via SFAccordionEntry
 * - Dynamic title from Contentful fields
 * - Integration with ContentfulComponent for content rendering
 */
interface AccordionItemStoryArgs {
  title: string
  content: TypeAccordionItemComponentWithoutUnresolvableLinksResponse['fields']['content']
}

const createContentElement = (
  title: string = 'Default Title',
  content: TypeAccordionItemComponentWithoutUnresolvableLinksResponse['fields']['content'] = [],
): TypeAccordionItemComponentWithoutUnresolvableLinksResponse =>
  ({
    sys: {
      id: 'accordion-item-basic',
      contentType: { sys: { id: 'AccordionItemComponent' } },
    },
    fields: {
      title,
      content,
    },
  }) as unknown as TypeAccordionItemComponentWithoutUnresolvableLinksResponse

const meta = {
  title: 'CMS/Contentful/AccordionItem',
  component: AccordionItemComponent,
  argTypes: {
    title: {
      control: 'text',
      description: 'Title of the accordion item',
      name: 'contentElement.fields.title',
    },
    content: {
      control: 'object',
      description: 'Array of content items to display when expanded',
      name: 'contentElement.fields.content',
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
        sys: {
          id: 'section-basic',
          contentType: { sys: { id: 'SectionComponent' } },
        },
        fields: {
          backgroundColor: '#f0f9ff',
          padding: 'medium',
          content: [
            {
              sys: {
                id: 'text-basic',
                contentType: { sys: { id: 'TextComponent' } },
              },
              fields: {
                content:
                  'We offer free shipping on orders over $50. Standard shipping takes 3-5 business days, while express shipping delivers within 1-2 business days.',
                textType: 'p',
              },
            },
          ],
        },
      } as unknown as TypeSectionComponentWithoutUnresolvableLinksResponse,
    ],
  },
}
