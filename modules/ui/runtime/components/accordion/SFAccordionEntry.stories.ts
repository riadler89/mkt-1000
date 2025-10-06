import type { ComponentPropsAndSlots, Meta } from '@storybook-vue/nuxt'
import SFAccordionEntry from './SFAccordionEntry.vue'

/**
 * SFAccordionEntry is a collapsible content component that provides expandable/collapsible sections.
 * It supports both wide and narrow variants for different layout contexts and includes smooth animations.
 * The component uses native HTML details/summary elements for accessibility and SEO benefits.
 */
export default {
  title: 'Base Components/SFAccordionEntry',
  component: SFAccordionEntry,
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['wide', 'narrow'],
    },
  },
  render: (args: ComponentPropsAndSlots<typeof SFAccordionEntry>) => ({
    components: { SFAccordionEntry },
    setup() {
      return { args }
    },
    template: `
    <SFAccordionEntry v-bind="args">
      <p class="text-secondary border border-black p-2">
        This is the accordion content that appears when the section is expanded.
      </p>
    </SFAccordionEntry>`,
  }),
}

/**
 * Basic accordion entry with default wide variant.
 * Shows the component with standard spacing and layout.
 */
export const Default = {
  args: {
    title: 'Frequently Asked Questions',
    id: 'accordion-default',
  },
}

/**
 * Accordion entry with complex content.
 * Demonstrates the component with rich content including multiple elements.
 */
export const ComplexContent = {
  render: (args: ComponentPropsAndSlots<typeof SFAccordionEntry>) => ({
    components: { SFAccordionEntry },
    setup() {
      return { args }
    },
    template: `
    <SFAccordionEntry v-bind="args">
      <div class="space-y-4 border border-black p-2">
        <div class="flex items-center justify-between">
          <h4 class="font-semibold">Size Guide</h4>
          <button class="text-sm text-accent underline">Download PDF</button>
        </div>
        <div class="grid grid-cols-3 gap-4 text-sm">
          <div>
            <div class="font-medium">Small</div>
            <div class="text-secondary">Chest: 36-38"</div>
            <div class="text-secondary">Waist: 28-30"</div>
          </div>
          <div>
            <div class="font-medium">Medium</div>
            <div class="text-secondary">Chest: 38-40"</div>
            <div class="text-secondary">Waist: 30-32"</div>
          </div>
          <div>
            <div class="font-medium">Large</div>
            <div class="text-secondary">Chest: 40-42"</div>
            <div class="text-secondary">Waist: 32-34"</div>
          </div>
        </div>
      </div>
    </SFAccordionEntry>`,
  }),
  args: {
    title: 'Size Guide',
    id: 'accordion-complex',
  },
} satisfies Meta<typeof SFAccordionEntry>

/**
 * Multiple accordion entries in a group.
 * Shows how multiple accordion entries work together.
 */
export const AccordionGroup = {
  render: (args: ComponentPropsAndSlots<typeof SFAccordionEntry>) => ({
    components: { SFAccordionEntry },
    setup() {
      return { args }
    },
    template: `
    <div class="space-y-2">
      <SFAccordionEntry title="Shipping & Returns" id="shipping">
        <p class="text-secondary border border-black p-2">
          Free shipping on orders over $50. Returns accepted within 30 days.
        </p>
      </SFAccordionEntry>
      
      <SFAccordionEntry title="Product Care" id="care">
        <p class="text-secondary border border-black p-2">
          Machine wash cold, tumble dry low. Do not bleach or iron.
        </p>
      </SFAccordionEntry>
      
      <SFAccordionEntry title="Customer Reviews" id="reviews">
        <p class="text-secondary border border-black p-2">
          Read what our customers are saying about this product.
        </p>
      </SFAccordionEntry>
    </div>`,
  }),
  args: {},
} satisfies Meta<typeof SFAccordionEntry>
