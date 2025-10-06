import type { Preview } from '@nuxtjs/storybook'
import type { Img } from '@nuxt/image'
import { useI18n, useNuxtApp } from '#imports'

const preview: Preview = {
  // https://storybook.js.org/docs/writing-stories/parameters
  // https://storybook.js.org/docs/api/parameters#available-parameters
  parameters: {
    controls: {
      // These controls automatically match properties to a better fitting control.
      // e.g. props with color will be displayed as a color picker.
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
      expanded: true,
      exclude: ['contentElement'],
    },
    test: {
      // This is needed to ignore errors for the interaction addon. If not set the addon will shown an error for missing assertions in the interaction.
      dangerouslyIgnoreUnhandledErrors: true,
    },
    options: {
      // https://storybook.js.org/docs/writing-stories/naming-components-and-hierarchy#sorting-stories
      // @ts-expect-error - storySort is not typed and adding types results in 'SyntaxError: Unexpected token ':''
      storySort: (a, b) => {
        // If both stories have the same title, they are equal
        if (a.title === b.title) {
          return 0
        }

        // Check if either story title contains "Base Components/"
        const aIsBaseComponent = a.title.includes('Base Components/')
        const bIsBaseComponent = b.title.includes('Base Components/')

        // If only one is a base component, prioritize it
        if (aIsBaseComponent && !bIsBaseComponent) {
          return -1
        }
        if (!aIsBaseComponent && bIsBaseComponent) {
          return 1
        }

        // For all other cases, use default sorting
        return a.title.localeCompare(b.title)
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (story) => ({
      components: { story },
      template:
        '<div class="flex justify-center items-center p-8"><story /></div>',
      setup: () => {
        const i18n = useI18n()
        i18n.setLocale('en')
        // override nuxt image instance, so we can use images from every domain within storybook
        // This allows us to use images within the asset folder, removing the need to serve the images via the CMS.
        // This also means that some functionality like image optimization is not available in storybook.
        const nuxtApp = useNuxtApp()
        // Create a function with additional properties to match the Img interface
        const mockImgFunction = ((source: string) => {
          return source
        }) as Img

        // Add the required properties to the function
        Object.assign(mockImgFunction, {
          ...(nuxtApp.$img || {}),
          options: {
            format: ['webp', 'jpeg', 'avif'],
          },
          getImage: (url: string) => {
            return { url }
          },
          getSizes: (url: string) => {
            return {
              src: `${url}`,
              srcset: `${url} 1x, ${url} 2x`,
              sizes: '100vw',
            }
          },
        })

        nuxtApp.$img = mockImgFunction
      },
    }),
  ],
}

export default preview
