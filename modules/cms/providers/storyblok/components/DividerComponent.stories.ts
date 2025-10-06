import { computed } from 'vue'
import type { StoryObj } from '@storybook-vue/nuxt'
import type { DividerComponent } from '../types'
import Divider from './DividerComponent.vue'

/**
 * The Storyblok Divider component provides visual and spacing separation between content sections.
 * It supports different height options for spacing and can optionally display a horizontal line.
 * This component is designed to work with Storyblok CMS content structure.
 */
interface DividerStoryArgs {
  height: DividerComponent['height']
  showLine: boolean
}

const createContentElement = (
  height: DividerComponent['height'] = 'small',
  showLine = true,
): DividerComponent => ({
  height,
  showLine,
  component: 'DividerComponent',
  _uid: 'story-uid',
})

const meta = {
  title: 'CMS/Storyblok/Divider',
  component: Divider,
  argTypes: {
    height: {
      control: 'select',
      options: ['small', 'medium', 'large'],
      description: 'Vertical spacing size for the divider',
      name: 'contentElement.height',
    },
    showLine: {
      control: 'boolean',
      description: 'Whether to show a horizontal line',
      name: 'contentElement.showLine',
    },
  },
  parameters: {
    docs: {
      source: {
        code: `
          <template>
            <Divider :contentElement="contentElement" />
          </template>
        `,
      },
      description: {
        component:
          'A flexible divider component that creates spacing and optional visual separation between content sections.',
      },
    },
  },
  render: (args: DividerStoryArgs) => {
    return {
      components: { Divider },
      setup() {
        const contentElement = computed(() =>
          createContentElement(args.height, args.showLine),
        )
        return {
          contentElement,
        }
      },
      template: `
        <Divider :contentElement="contentElement" />
      `,
    }
  },
}

export default meta
type Story = StoryObj<DividerStoryArgs>

export const SmallWithLine: Story = {
  args: {
    height: 'small',
    showLine: true,
  },
}

export const MediumWithLine: Story = {
  args: {
    height: 'medium',
    showLine: true,
  },
}

export const LargeWithLine: Story = {
  args: {
    height: 'large',
    showLine: true,
  },
}

export const SmallWithoutLine: Story = {
  args: {
    height: 'small',
    showLine: false,
  },
}

export const MediumWithoutLine: Story = {
  args: {
    height: 'medium',
    showLine: false,
  },
}

export const LargeWithoutLine: Story = {
  args: {
    height: 'large',
    showLine: false,
  },
}
