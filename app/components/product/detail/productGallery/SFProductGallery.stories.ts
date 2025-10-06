import type { StoryObj, ComponentPropsAndSlots } from '@storybook-vue/nuxt'
import { nextTick, ref } from 'vue'
import { productFactory } from '@scayle/storefront-nuxt/test/factories'
import SFProductGallery from './SFProductGallery.vue'
import { SFButton } from '#storefront-ui/components'

/**
 * SFProductGallery displays a product image gallery with thumbnails and zoom functionality.
 * It supports multiple images with navigation controls and a zoom modal for detailed viewing.
 */
export default {
  title: 'Product/SFProductGallery',
  component: SFProductGallery,
  render: (args: ComponentPropsAndSlots<typeof SFProductGallery>) => ({
    components: { SFProductGallery, SFButton },
    setup() {
      const gallery = ref<HTMLElement | null>(null)

      const openZoom = async () => {
        await nextTick()
        const el =
          (gallery.value as unknown as { $el?: HTMLElement })?.$el ||
          gallery.value
        const image = el?.querySelector(
          '[data-testid="product-image-0"]',
        ) as HTMLElement | null
        image?.click()
      }

      const closeZoom = async () => {
        await nextTick()
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
      }

      return { args, gallery, openZoom, closeZoom }
    },
    template: `
      <div class="w-full max-w-screen-md h-fit">
        <SFProductGallery ref="gallery" v-bind="args" />
      </div>
    `,
  }),
}

type Story = StoryObj<typeof SFProductGallery>

const product = productFactory.build({
  images: [
    {
      hash: 'https://next-qa.cdn.scayle.cloud/images/86ec3ab34cbf210b87f1f0a4eb4b8cb1.jpg?width=1024&height=1366&quality=75',
      attributes: {
        primaryImage: {
          id: 7061,
          key: 'primaryImage',
          label: 'Primary Image',
          type: '',
          multiSelect: false,
          values: {
            id: 2433,
            label: 'true',
            value: 'true',
          },
        },
      },
    },
    {
      hash: 'https://next-qa.cdn.scayle.cloud/images/5c7c2a3c5eccba3c4b35f35240f4dd8b.jpg?width=1024&height=1366&quality=75',
      attributes: {},
    },
    {
      hash: 'https://next-qa.cdn.scayle.cloud/images/d6afcf46fb3840eb1e939e57244036cb.jpg?width=1024&height=1366&quality=75',
      attributes: {},
    },
  ],
})

/**
 * Shows the product gallery with multiple images and thumbnail navigation.
 * Displays the main image with thumbnails on the side and navigation controls.
 */
export const Default: Story = {
  args: {
    product,
  },
}

/**
 * Shows the product gallery with a single image.
 * Displays only the main image without thumbnails or navigation controls.
 */
export const SingleImage: Story = {
  name: 'Single image',
  args: {
    product: productFactory.build({
      images: [
        {
          hash: 'https://next-qa.cdn.scayle.cloud/images/86ec3ab34cbf210b87f1f0a4eb4b8cb1.jpg?width=1024&height=1366&quality=75',
          attributes: {
            primaryImage: {
              id: 7061,
              key: 'primaryImage',
              label: 'Primary Image',
              type: '',
              multiSelect: false,
              values: {
                id: 2433,
                label: 'true',
                value: 'true',
              },
            },
          },
        },
      ],
    }),
  },
}
