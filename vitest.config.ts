import { URL, fileURLToPath } from 'node:url'
import { defineVitestConfig } from '@nuxt/test-utils/config'
import { configDefaults } from 'vitest/config'

export default defineVitestConfig({
  // any custom vitest config you require
  root: fileURLToPath(new URL('./', import.meta.url)),
  test: {
    environment: 'happy-dom',
    setupFiles: [
      './test/vitest-setup/jest-dom.ts',
      './test/vitest-setup/storefront.ts',
      './test/vitest-setup/i18n.ts',
    ],
    globals: true,
    exclude: [...configDefaults.exclude, '**/playwright/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'cobertura'],
      reportsDirectory: 'coverage',
      exclude: [
        ...(configDefaults.coverage.exclude || []),
        '**/*.stories.{ts,js}',
        './testing/**',
        './scripts/**',
        './patches/**',
        './public/storybook/**',
        './modules/cms/providers/*/types/gen/**', // Generated types for CMS
      ],
    },
    environmentOptions: {
      nuxt: {
        overrides: {
          runtimeConfig: {
            public: {
              gtm: {
                id: 'GTM-123',
              },
              cdnUrl: 'https://cdn-test.url',
              storefront: {
                /** Storefront Core - Internal logger configuration
                 * https://scayle.dev/en/storefront-guide/developer-guide/basic-setup/introduction#log */
                log: {
                  level: 'error',
                },
              },
            },
          },
        },
      },
    },
    clearMocks: true,
    onConsoleLog: (log) => {
      // Silence logs coming from vue <Suspense> is experimental, and stdout | unknown component before it
      if (log.includes('<Suspense') || log.includes('Directive "t"')) {
        return false
      }
      // Silence Vue Router warnings about missing routes during tests
      if (log.includes('[Vue Router warn]')) {
        return false
      }
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./app', import.meta.url)),
      '~': fileURLToPath(new URL('./app', import.meta.url)),
      '~~': fileURLToPath(new URL('./', import.meta.url)),
    },
  },
})
