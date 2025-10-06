import eslintConfigStorefront from '@scayle/eslint-config-storefront'
import tailwind from 'eslint-plugin-tailwindcss'
import pluginVueA11y from 'eslint-plugin-vuejs-accessibility'
import storybook from 'eslint-plugin-storybook'
import playwright from 'eslint-plugin-playwright'
// Workaround for flat config not being supported yet by eslint-plugin-tailwindcss
// https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/280
import { FlatCompat } from '@eslint/eslintrc'
import vueI18n from '@intlify/eslint-plugin-vue-i18n'
import withNuxt from './.nuxt/eslint.config.mjs'

const compat = new FlatCompat()

export default withNuxt(
  eslintConfigStorefront(),
  {
    ignores: [
      // Ignore auto-generated types for cms providers
      'modules/cms/providers/**/types/gen/**/*',
      '.storyblok/**/*',
      '.scayle/cms/**/*',
    ],
  },
  // https://github.com/francoismassart/eslint-plugin-tailwindcss
  [
    ...tailwind.configs['flat/recommended'],
    {
      rules: {
        'tailwindcss/classnames-order': 'error',
        'tailwindcss/no-unnecessary-arbitrary-value': 'error',
        'tailwindcss/enforces-negative-arbitrary-values': 'error',
        'tailwindcss/no-custom-classname': [
          'error',
          {
            whitelist: [
              'bg-lined-grid',
              'picture',
              'cms\\-picture',
              'picture\\-contain',
              'picture\\-cover',
              'card',
              'block-scrolling',
              'stack',
              '',
            ],
          },
        ],
      },
      settings: {
        tailwindcss: {
          /**
           * Minimize the globbing scope to improve performance
           * @see https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/276
           * @see https://github.com/francoismassart/eslint-plugin-tailwindcss/issues/174
           */
          cssFiles: ['assets/css/**/*.css'],
        },
      },
    },
    // https://github.com/storybookjs/eslint-plugin-storybook
    // This plugin will only be applied to files following the .stories. or .story. pattern.
    ...storybook.configs['flat/recommended'],
  ],
  [
    // https://vue-a11y.github.io/eslint-plugin-vuejs-accessibility/rule-overview/
    ...pluginVueA11y.configs['flat/recommended'],
    {
      rules: {
        // NOTE: Enable the following rules for upcoming a11y improvements
        'vuejs-accessibility/mouse-events-have-key-events': 'off',
        'vuejs-accessibility/no-static-element-interactions': 'off',
        'vuejs-accessibility/anchor-has-content': 'off',
        'vuejs-accessibility/aria-props': 'off',
        'vuejs-accessibility/aria-role': 'off',
        'vuejs-accessibility/aria-unsupported-elements': 'off',
        'vuejs-accessibility/click-events-have-key-events': 'off',
        'vuejs-accessibility/form-control-has-label': 'off',
        'vuejs-accessibility/heading-has-content': 'off',
        'vuejs-accessibility/iframe-has-title': 'off',
        'vuejs-accessibility/interactive-supports-focus': 'off',
        'vuejs-accessibility/label-has-for': 'off',
        'vuejs-accessibility/media-has-caption': 'off',
        'vuejs-accessibility/no-access-key': 'off',
        'vuejs-accessibility/no-autofocus': 'off',
        'vuejs-accessibility/no-distracting-elements': 'off',
        'vuejs-accessibility/no-redundant-roles': 'off',
        'vuejs-accessibility/role-has-required-aria-props': 'off',
        'vuejs-accessibility/tabindex-no-positive': 'off',
        'test/prefer-lowercase-title': 'off',
      },
    },
  ],
  [
    ...vueI18n.configs['flat/base'],
    {
      rules: {
        '@intlify/vue-i18n/valid-message-syntax': 'error',
        '@intlify/vue-i18n/no-missing-keys': 'error',
        '@intlify/vue-i18n/no-missing-keys-in-other-locales': process.env.CI
          ? 'error'
          : 'warn',
        '@intlify/vue-i18n/no-duplicate-keys-in-locale': 'error',
        '@intlify/vue-i18n/no-dynamic-keys': 'off',
        '@intlify/vue-i18n/no-unused-keys': [
          'error',
          {
            extensions: ['.js', '.vue', '.ts'],
            ignores: [
              // We ignore validation errors because it is used in VueValidators `createI18nMessage` function.
              // This is not seen as 'used' by this rule as it does not use the `t` function.
              // See composables/useValidationRules.ts
              '/validation/',
              // Following keys are used dynamically in the codebase and are not seen as 'used' by this rule.
              // The static usage of the keys would make the codebase harder to read and maintain.
              '/global.payment_key/',
              '/global.carrier_key/',
              '/country_detection.override_codes/',
            ],
          },
        ],
      },
      settings: {
        'vue-i18n': {
          localeDir: './i18n/locales/en_GB.json',
          messageSyntaxVersion: '^10.0.7',
        },
      },
    },
  ],
  // Compatibility handling for legacy eslint@8 config
  // @scayle/vue-composable
  ...compat.config({
    plugins: ['@scayle/vue-composable'],
    rules: {
      '@scayle/vue-composable/no-composable-after-await': 'error',
      '@scayle/vue-composable/no-lifecycle-after-await': 'error',
      '@scayle/vue-composable/no-watch-after-await': 'error',
      '@scayle/vue-composable/no-computed-after-await': 'error',
    },
  }),
  // Custom Overrides: Storefront Boilerplate rules and config
  {
    // https://eslint.org/docs/latest/use/configure/ignore#ignorepatterns-in-config-files
    ignores: ['**/fixtures/**/*', '**/playwright-report/', '**/test-results/'],
  },
  {
    rules: {
      'eslint-comments/no-unlimited-disable': 'off',
      'vue/html-self-closing': [
        'error',
        {
          html: {
            void: 'any',
            normal: 'any',
            component: 'always',
          },
        },
      ],
      '@typescript-eslint/no-empty-object-type': [
        'error',
        {
          allowInterfaces: 'always',
        },
      ],
      'vue/v-bind-style': [
        'error',
        'shorthand',
        {
          sameNameShorthand: 'never',
        },
      ],
      'vue/no-undef-components': [
        'error',
        {
          // Ignore auto-imported icons components & custom elements (web components)
          ignorePatterns: [
            'icon(\\-\\w+)+',
            'scayle-checkout',
            'scayle-auth',
            'scayle-auth-new-password',
            'scayle-express-checkout',
            'subscription-overview',
            'subscription-cancellation',
          ],
        },
      ],
      'vue/define-emits-declaration': ['error', 'type-literal'],
      'vue/custom-event-name-casing': ['error', 'camelCase'],
      'vue/slot-name-casing': ['error', 'kebab-case'],
      'vue/require-default-prop': 'off',
    },
  },
  {
    ignores: ['./modules/ui/**/*'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
  {
    // Custom code styling not covered by Prettier
    rules: {
      'import/newline-after-import': ['error', { count: 1 }],
      'import/order': 'error',
      'import/no-extraneous-dependencies': 'error',
    },
  },
  {
    files: ['**/*.test.ts'],
    rules: {
      'sonarjs/pseudo-random': 'off',
      'sonarjs/no-nested-functions': 'off',
      'sonarjs/slow-regex': 'off',
    },
  },
  // Disable specific linting for auto-generated types
  {
    files: ['**/types/contentful-defs.d.ts', '**/types/storyblok.d.ts'],
    rules: {
      'sonarjs/redundant-type-aliases': 'off',
    },
  },
  {
    ...playwright.configs['flat/recommended'],
    files: [
      '**/playwright/page-objects/**',
      '**/playwright/fixtures/**',
      '**/playwright/tests/**',
    ],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/no-networkidle': 'off',
      // NOTE: The following rules have been disabled to not interfere with the E2E testing suite
      // and need to be handled via a refactoring before being enabled again!
      'playwright/no-useless-not': 'off',
    },
  },
)
