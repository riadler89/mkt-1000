import { computed } from 'vue'
import type { StoryObj } from '@storybook-vue/nuxt'
import type { TypeButtonComponentWithoutUnresolvableLinksResponse } from '../types'
import Button from './ButtonComponent.vue'

/**
 * Contentful Button component renders interactive button elements from Contentful CMS data.
 * It supports multiple visual styles and can function as both action buttons and navigation links.
 *
 * Key features:
 * - Multiple button variants (primary, secondary, tertiary/outline, accent)
 * - URL navigation with target control (same tab or new tab)
 * - Contentful field-based data structure (fields.text, fields.style, fields.url)
 * - Automatic route localization for internal links
 */
interface ButtonStoryArgs {
  text: string
  style: 'primary' | 'secondary' | 'outline' | 'accent'
  url: string
  openInNewTab: boolean
}

const createContentElement = (
  text: string,
  style: 'primary' | 'secondary' | 'outline' | 'accent' = 'primary',
  url = '/example-page',
  openInNewTab = false,
): TypeButtonComponentWithoutUnresolvableLinksResponse =>
  ({
    fields: {
      text,
      style,
      url,
      openInNewTab,
    },
  }) as TypeButtonComponentWithoutUnresolvableLinksResponse

const meta = {
  title: 'CMS/Contentful/Button',
  component: Button,
  argTypes: {
    text: {
      control: 'text',
      description: 'Button text content',
      name: 'contentElement.fields.text',
    },
    style: {
      control: 'select',
      options: ['primary', 'secondary', 'outline', 'accent'],
      description: 'Visual style variant of the button',
      name: 'contentElement.fields.style',
    },
    url: {
      control: 'text',
      description: 'URL for the button link',
      name: 'contentElement.fields.url',
    },
    openInNewTab: {
      control: 'boolean',
      description: 'Whether to open the link in a new tab',
      name: 'contentElement.fields.openInNewTab',
    },
  },
  parameters: {
    docs: {
      source: {
        code: `
          <template>
            <ButtonComponent :contentElement="contentElement" />
          </template>
        `,
      },
    },
  },
  render: (args: ButtonStoryArgs) => {
    return {
      components: { Button },
      setup() {
        const contentElement = computed(() =>
          createContentElement(
            args.text,
            args.style,
            args.url,
            args.openInNewTab,
          ),
        )
        return {
          contentElement,
        }
      },
      template: `
        <Button :contentElement="contentElement" />
      `,
    }
  },
}

export default meta
type Story = StoryObj<ButtonStoryArgs>

/**
 * Primary button for main call-to-action
 */
export const Primary: Story = {
  args: {
    text: 'Primary Button',
    style: 'primary',
    url: '/example-page',
    openInNewTab: false,
  },
}

/**
 * Secondary button for supporting actions
 */
export const Secondary: Story = {
  args: {
    text: 'Secondary Button',
    style: 'secondary',
    url: '/example-page',
    openInNewTab: false,
  },
}

/**
 * Outline/tertiary button with transparent background
 */
export const Outline: Story = {
  args: {
    text: 'Outline Button',
    style: 'outline',
    url: '/example-page',
    openInNewTab: false,
  },
}

/**
 * Accent button for special emphasis
 */
export const Accent: Story = {
  args: {
    text: 'Accent Button',
    style: 'accent',
    url: '/example-page',
    openInNewTab: false,
  },
}
