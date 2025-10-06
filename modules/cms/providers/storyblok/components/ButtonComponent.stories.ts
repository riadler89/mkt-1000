import { computed } from 'vue'
import type { StoryObj } from '@storybook-vue/nuxt'
import type { ButtonComponent } from '../types'
import type { StoryblokMultilink } from '../types/gen/storyblok'
import Button from './ButtonComponent.vue'

/**
 * Storyblok Button component renders interactive button elements from Storyblok CMS data.
 * It supports multiple visual styles and can function as both action buttons and navigation links.
 *
 * Key features:
 * - Multiple button variants (primary, secondary, tertiary/outline, accent)
 * - URL navigation with Storyblok link management
 * - Storyblok editor integration with component structure
 * - Automatic route localization for internal links
 */
interface ButtonStoryArgs {
  text: string
  style: ButtonComponent['style']
  url: string
  linktype: 'story' | 'url'
  target: StoryblokMultilink['target']
}

const createContentElement = (
  text: string,
  style: ButtonComponent['style'] = 'primary',
  url = '/example-page',
  linktype: 'story' | 'url' = 'story',
  target: StoryblokMultilink['target'] = '_self',
): ButtonComponent => ({
  text,
  style,
  url: {
    cached_url: url,
    linktype,
    target,
  } as Exclude<
    StoryblokMultilink,
    { linktype?: 'email' } | { linktype?: 'asset' }
  >,
  component: 'ButtonComponent',
  _uid: 'story-uid',
})

const meta = {
  title: 'CMS/Storyblok/Button',
  component: Button,
  argTypes: {
    text: {
      control: 'text',
      description: 'Button text content',
      name: 'contentElement.text',
    },
    style: {
      control: 'select',
      options: ['', 'primary', 'secondary', 'outline', 'accent'],
      description: 'Visual style variant of the button',
      name: 'contentElement.style',
    },
    url: {
      control: 'text',
      description: 'URL for the button link',
      name: 'contentElement.url.cached_url',
    },
    linktype: {
      control: 'select',
      options: ['story', 'url'],
      description: 'Type of link (internal story or external URL)',
      name: 'contentElement.url.linktype',
    },
    target: {
      control: 'select',
      options: ['_self', '_blank'],
      description: 'Link target (same tab or new tab)',
      name: 'contentElement.url.target',
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
            args.linktype,
            args.target,
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
    linktype: 'story',
    target: '_self',
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
    linktype: 'story',
    target: '_self',
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
    linktype: 'story',
    target: '_self',
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
    linktype: 'story',
    target: '_self',
  },
}
