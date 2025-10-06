import type { StoryObj, ComponentPropsAndSlots } from '@storybook-vue/nuxt'
import { computed } from 'vue'
import SFDealBanner from './SFDealBanner.vue'

type StoryProps = ComponentPropsAndSlots<typeof SFDealBanner> & {
  textColor?: string
  backgroundColor?: string
  expirationDate?: string
}

const expirationDate = new Date(
  Date.now() +
    2 * 24 * 60 * 60 * 1000 +
    5 * 60 * 60 * 1000 +
    30 * 60 * 1000 +
    45 * 1000,
).toISOString() // 2 days, 5 hours, 30 minutes, 45 seconds

/**
 * SFDealBanner displays promotional messages and offers for products.
 * It supports various promotion types and customizable styling to match different marketing campaigns.
 *
 * Key features:
 * - Support for different promotion types (automatic discounts, buy X get Y)
 * - Customizable colors for text and background
 * - Optional condition text display
 */
export default {
  title: 'Deal/SFDealBanner',
  component: SFDealBanner,
  argTypes: {
    textColor: {
      control: 'color',
      description:
        'Custom text color for the banner. Use this to ensure readability against the background color.',
    },
    backgroundColor: {
      control: 'color',
      description:
        'Custom background color for the banner. Choose colors that align with your brand and campaign theme.',
    },
    expirationDate: {
      control: 'date',
      description:
        'Custom expiration date for the banner. Use this to override the default expiration date.',
    },
  },
  render: (args: StoryProps) => {
    return {
      components: { SFDealBanner },
      setup() {
        const colorStyle = computed(() => ({
          backgroundColor:
            args.backgroundColor ||
            args.displayData?.colorStyle?.backgroundColor,
          textColor: args.textColor || args.displayData?.colorStyle?.textColor,
          color: args.textColor || args.displayData?.colorStyle?.color,
        }))

        const expirationDate = computed(() => {
          return args.expirationDate
            ? new Date(args.expirationDate).toISOString()
            : args.displayData?.expirationDate
        })

        return { args, colorStyle, expirationDate }
      },
      template:
        '<SFDealBanner v-bind="args" :display-data="{...args.displayData, colorStyle: colorStyle, expirationDate: expirationDate}" />',
    }
  },
}

type Story = StoryObj<typeof SFDealBanner>

/**
 * Automatic discount promotions show percentage or fixed amount discounts.
 * These are typically used for sales, seasonal offers, or inventory clearance.
 */
export const AutomaticDiscount: Story = {
  args: {
    displayData: {
      id: '1',
      name: 'Automatic Discount',
      headline: 'Headline',
      subline: 'Subline',
      conditions: 'Conditions',
      hideCountdown: false,
      expirationDate,
      colorStyle: {
        backgroundColor: '#FFC65F',
        color: '#171717',
      },
    },
    showCondition: true,
    trackEvent: 'view_promotion',
  },
}

/**
 * Buy X Get Y promotions encourage customers to purchase multiple items
 * by offering a free or discounted item with their purchase.
 */
export const BuyXGetY: Story = {
  args: {
    displayData: {
      id: '1',
      name: 'Free Socks Promo',
      headline: 'Buy Shoes, Get Free Socks',
      subline:
        'Buy any pair of shoes and receive a free pair of socks. Limited time only!',
      conditions: 'Conditions',
      hideCountdown: false,
      expirationDate,
      colorStyle: {
        backgroundColor: '#FFC65F',
        color: '#171717',
      },
    },
    showCondition: true,
  },
}
