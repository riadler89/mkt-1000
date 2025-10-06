import type { StorybookConfig } from '@nuxtjs/storybook'
import { resolve } from 'pathe'
import type { CoreConfig } from 'storybook/internal/types'

/*
  There are currently several issues in the Browser console.
  Both are known issues but does currently not have a workaround.
  https://github.com/nuxt-modules/storybook/issues/753
  https://github.com/storybookjs/storybook/issues/31010
*/

const config: StorybookConfig & { core?: CoreConfig } = {
  // https://storybook.js.org/docs/api/main-config/main-config-stories
  stories: [
    './content/GettingStarted.mdx',
    '../app/components/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../modules/**/*.stories.@(js|jsx|ts|tsx|mdx)',
  ],
  // https://storybook.js.org/docs/api/main-config/main-config-core
  core: {
    disableTelemetry: true,
  },
  // https://storybook.js.org/docs/api/main-config/main-config-addons
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  // https://storybook.js.org/docs/api/main-config/main-config-framework
  framework: {
    name: '@storybook-vue/nuxt',
    options: {},
  },
  // https://storybook.js.org/docs/api/main-config/main-config-vite-final
  viteFinal: async (config) => {
    if (config.resolve) {
      // Adds mocks for composables like useCurrentShop and SAPI composables.
      // This is necessary to use the components without having any dependence to the Storefront API and other external dependencies.
      config.resolve.alias = {
        ...config.resolve?.alias,
        '#storefront/composables': resolve(
          new URL('./mocks/composables.mock.ts', import.meta.url).pathname,
        ),
      }
      // Adds lodash.mergewith to the optimizeDeps list.
      // Without this, some components will throw the error:
      // "The requested module 'http://localhost:6006/node_modules/lodash.mergewith/index.js?v=f282b8e6' doesn't provide an export named: 'default'"
      config.optimizeDeps = {
        ...(config.optimizeDeps || {}),
        include: [...(config.optimizeDeps?.include || []), 'lodash.mergewith'],
      }
    }

    return config
  },
  // We need to add the assets directory to the staticDirs to be able to use the images in the stories and docs.
  // As we build storybook in `public` directory, its not possible to add it to the `staticDirs`.
  // https://storybook.js.org/docs/api/main-config/main-config-static-dirs
  staticDirs: ['assets'],
  docs: {
    defaultName: 'Overview',
  },
}
export default config
