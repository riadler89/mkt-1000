import type { ComponentPropsAndSlots, Meta } from '@storybook-vue/nuxt'
import { fn } from 'storybook/test'
import SFCountdown from './SFCountdown.vue'

/**
 * SFCountdown is a real-time countdown component that displays remaining time until a specified date.
 * It's commonly used for promotional campaigns, sales events, product launches, and time-sensitive offers
 * to create urgency and encourage user engagement.
 *
 * Key features:
 * - Real-time countdown with automatic updates every second
 * - Configurable unit display (days, hours, minutes, seconds)
 * - Short and long unit format options
 * - Automatic hiding of zero values and irrelevant units
 * - Finished event emission when countdown reaches zero
 * - Tabular number formatting for consistent alignment
 */
export default {
  title: 'Base Components/SFCountdown',
  component: SFCountdown,
  argTypes: {
    unitSize: {
      control: { type: 'select' },
      options: ['short', 'long'],
    },
  },
  render: (args: ComponentPropsAndSlots<typeof SFCountdown>) => ({
    components: { SFCountdown },
    setup() {
      return { args }
    },
    template: `<SFCountdown v-bind="args" @finished="args.finished" />`,
  }),
}

/**
 * Basic countdown with long unit labels. This is the most common usage pattern
 * for promotional campaigns and sales events where clarity is important.
 */
export const Default = {
  args: {
    timeUntil: new Date(
      Date.now() +
        2 * 24 * 60 * 60 * 1000 +
        5 * 60 * 60 * 1000 +
        30 * 60 * 1000 +
        45 * 1000,
    ).toISOString(), // 2 days, 5 hours, 30 minutes, 45 seconds
    showUnits: true,
    unitSize: 'long',
  },
}

/**
 * Very short duration countdown showing only minutes and seconds.
 * Useful for time-sensitive actions or quick promotions.
 */
export const MinutesOnly = {
  args: {
    timeUntil: new Date(Date.now() + 5 * 60 * 1000 + 30 * 1000).toISOString(), // 5 minutes, 30 seconds
    showUnits: true,
    unitSize: 'long',
  },
}

/**
 * Countdown that will finish soon to demonstrate the finished event.
 * This example shows how the component handles the transition to zero.
 */
export const FinishingSoon = {
  args: {
    timeUntil: new Date(Date.now() + 10 * 1000).toISOString(), // 10 seconds
    showUnits: true,
    unitSize: 'long',
    onFinished: fn(),
  },
} satisfies Meta<typeof SFCountdown>
