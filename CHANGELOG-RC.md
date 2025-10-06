# @scayle/storefront-application-nuxt (RC)

Changelogs of past Release Candidates (prior to v1.0.0) of the SCAYLE Storefront Application.

## 1.0.0-rc.10

### 🔥 Highlights

#### 📡 HTTP Request tracing with OpenTelemetry

The Storefront Boilerplate now includes a built-in integration with [OpenTelemetry](https://opentelemetry.io/).
To enable the feature, set the environment variable `OTEL_ENABLED` to `true`.
This will inject additional code into your application's entrypoint which will initialize the OpenTelemetry SDK.
Automatic instrumentations as well as instrumentations from `storefront-nuxt` will be captured and exported via the OTLP protocol.

Currently, Vercel and Node are the only supported platforms for the OpenTelemetry integration.
Setting `OTEL_ENABLED` to `true` when building for other platforms will have no effect.

You should also set the runtime variable `OTEL_SERVICE_NAME` to configure the service name used in traces. e.g. `OTEL_SERVICE_NAME=storefront-boilerplate`
Note: this variable is used directly by the OpenTelemetry libraries and is not available in the Nuxt `runtimeConfiguration`.

#### 🛍️ Improved UX / UI for Promotions

We've redesigned the promotion badges displayed on the Product Listing Page, the Wishlist, and the Basket page.
The Badge text originates from Storefront APIs `customData`, with `headlineParts` in bold and `badgeLabel` in regular font.
We now implement ellipsis for long `badgeLabel` texts.

Please Note: Due to space constraints, the basket page shows only `badgeLabel`; if it is missing, it will fallback to `headlineParts`.

We have also improved the user experience on the Product Detail page with free gift options.
When the condition of a product, that has a free gift option configured, are met,
a free gift option will be displayed on the page with a grayed-out overlay.
Once conditions are met, a free gift option will be enabled and the user can add a free gift product to the cart.

#### 🔍 Improved linting setup with ESLint v9

The Storefront Boilerplate now includes an improved linting setup.
Relying on the new [ESLint 9](https://eslint.org/blog/2024/04/eslint-v9.0.0-released/) and [`@nuxt/eslint` module](https://eslint.nuxt.com/packages/module) to provide more project-aware linting.
To make configuration more easier the ESLint config has been updated to the new [flat config format](https://eslint.org/blog/2022/08/new-config-system-part-2/), allowing for simpler customization and overriding of rules.
Additionally the default Storefront ESLint config `@scayle/eslint-config-storefront` v4 is now using a subset of opinionated rules of [`@antfu/eslint-config`](https://github.com/antfu/eslint-config).

### 💅 Minor Changes

- Added subscription cancellation page to the subscription module
- New Price adoptions for basket page for promotions
- Increased eslint `no-composable-after-await` rule error level and fix the issues
- Fix caching for domain-based setups where we now consider the host for the SSR cache key.

  Additionally, we now set an `integrity` value that invalidates the SSR cache automatically when a new build is deployed.
  You can control the value through the `VERSION` environment variable, which should be set to your current Git short commit sha.

  Either you can set this normally during your build process

  ```sh
  VERSION=147f33d yarn build
  ```

  or when using the docker image

  ```sh
  docker build --build-arg VERSION=${GIT_SHORT_COMMIT_SHA} -f docker/node/Dockerfile .
  ```

### 🩹 Patch Changes

- Removed an unnecessary CSS property which caused a visual bug on basket page
- Resolved a bug that affected the fetching of `combineWith` products
- Resolved the issue where the welcome login tab was displayed instead of the registration tab upon clicking the register link.
- Implemented a new utility function to format addresses dynamically. The function adjusts the address format according to the countryCode

### 🏡 Dependency Updates

#### 🏘️ DevDependencies

- Added `"@eslint/eslintrc@3.0.2",`
- Added `@nuxt/eslint@0.3.10`
- Updated to `@nuxt/test-utils@3.12.1`
- Updated to `@nuxtjs/i18n@8.3.1`
- Updated to `@nuxtjs/tailwindcss@6.12.0`
- Updated to `@scayle/eslint-config-storefront@4.0.0`
- Updated to `@upstash/redis@1.30.0`
- Updated to `@vitest/coverage-v8@1.5.2`
- Updated to `eslint@9.1.1`
- Updated to `postcss-custom-properties@13.3.8`
- Updated to `vitest@1.5.2`
- Updated to `vue-tsc@2.0.15`

#### 🏠 Dependencies

- Added `@opentelemetry/api": "1.8.0`
- Added `@opentelemetry/auto-instrumentations-node": "0.45.0`
- Added `@opentelemetry/exporter-trace-otlp-proto": "0.51.0`
- Added `@opentelemetry/instrumentation": "0.51.0`
- Added `@opentelemetry/resources": "1.24.0`
- Added `@opentelemetry/sdk-node": "0.51.0`
- Added `@opentelemetry/semantic-conventions": "1.24.0`
- Added `@vercel/otel": "1.8.2`
- Added `knitwork": "1.1.0`
- Updated to `@scayle/omnichannel-nuxt": "3.0.0` to be compatible with latest Omnichannel API
- Updated to `@scayle/storefront-nuxt": "7.66.4`
- Updated to `@storyblok/nuxt": "6.0.10`
- Updated to `@storyblok/vue": "8.0.8`
- Updated to `@tailwindcss/typography": "0.5.13`
- Updated to `cf-content-types-generator": "2.15.1`
- Updated to `contentful": "10.9.0`
- Updated to `storyblok-js-client": "6.7.3`

## 1.0.0-rc.9

### 🔥 Highlights

#### 📖 Introducing Contentful as new CMS Provider for StorefrontCMS

We've added a Contentful integration as alternative to using Storyblok as CMS provider. This allows you to fetch data from Contentful and use it in your SFB.
To use this feature, you need to provide your Contentful space ID and access token in the `.env` file. You can find these values in your Contentful account settings.

```sh
NUXT_PUBLIC_CMS_ACCESS_TOKEN=your-access-token
NUXT_PUBLIC_CMS_SPACE=your-space-id
```

Once you have added these values, you can use Contentful by selecting the `contentful` option in the `cms.provider` field of the `nuxt.config.ts` file.

```ts
export default defineNuxtConfig({
  // ...
  cms: {
    provider: 'contentful',
  },
  // ...
})
```

Now you have access to `useCMS` composables and fetch data from Contentful in your SFB. `useCMS` accepts a string as an argument that will be used for caching purposes and returns a `fetchBySlug` function that you can use to fetch data by slug. `fetchBySlug` is a wrapper around Nuxt's `useAsyncData` and accepts a generic type that you can use to define the shape of the data you are fetching. Here is and example of how you can use this feature:

```ts
import type { TypeListingPageSkeleton } from '~~/modules/cms/providers/contentful/types/contentful-defs'

const props = defineProps<{
  selectedCategory: number | undefined
}>()

const route = useRoute()

if (!props.selectedCategory) {
  console.log('No category selected')
}
const { fetchBySlug } = useCMS(`ListingPage-${route.path}`)

const { data } = await fetchBySlug<TypeListingPageSkeleton>(
  `categories/${props.selectedCategory}`,
)
```

#### 🔎 Introducing Search Engine v2

We've implemented and replaced the whole search flow based on the new `Search Engine v2`.
This includes:

- Overall UI and UX adaptations (header search input, suggestions dropdown, applicable filter indicator, search within mobile sidebar, etc.)
- Category suggestions that can have filters applied
- Product suggestions that are resolved only by entering the exact ID
- Refined flow when resolving the search term
- Search page usage only as a fallback

#### Added Subscription Addon

We've implemented the Subscription Addons as a local module.
The subscription feature enables customers to subscribe to a specific variant of a product, which is then delivered at regular intervals on a chosen day.
This convenience allows customers to make regular purchases effortlessly.

### 🚀 Major Changes

- Fixed an issue where an empty IDP component was shown when no IDPs are enabled.
  The `useIDP` composable now returns an empty object when the IDP integration is not enabled.
  Ensure that the user is redirected to CO when entering the sign-in page with a `redirectUrl` parameter.
  This is now possible with the `@scayle/storefront-nuxt@{version}`.
  We refactored the IDP callback to have its own page to ensure we only call the IDP login RPC once.
- Improved Storyblok integration through SCAYLE Panel Add-on and plugin
- Disabled caching for Vercel Deployments
  Vercel's CDN Caching works slightly differently from the default Nuxt Page caching, which is currently incompatible with our Session handling.
  To disable all caching for Vercel Deployments, remove any `routeRules` you have configured in your `nuxt.config.ts`.
- Added ability to scroll to anchor links on the same page.
  The `Paragraph` component now supports an `anchor` prop that will be used to create an anchor target for that paragraph.
  If you have a Table of Contents and want to link to a specific paragraph, you can use the create links function on any text in your Content to create a link to it. When the user clicks on the link, he will scroll to the paragraph on the page.
  We also introduced a new component, `NestedParagraph,` that allows adding nested paragraphs, for example, for ordered lists.

### 💅 Minor Changes

- Tweaked account index page to be visually consistent with other account page layouts
- Introduced a new feature for logging both build and runtime configurations
  Configuration logging can now be toggled on or off using the `ENABLE_CONFIG_LOG_BUILD` and `ENABLE_CONFIG_LOG_RUNTIME` environment variables.
- Added `@scayle/eslint-plugin-vue-composable`
  This plugin includes three rules `@scayle/vue-composable/no-composable-after-await`, `@scayle/vue-composable/no-lifecycle-after-await`, `@scayle/vue-composable/no-watch-after-await` which catch common errors in composables. You can read more about the plugin [here](https://www.npmjs.com/package/@scayle/eslint-plugin-vue-composable).
- Improved user experience of time box element within Promotion Banner.
  Adds a clear understanding of the time left for the promotion to end by providing indicators of the time unit in the time box element for countdowns.
  The format of the time box element is changed to be more user-friendly with `(D : H : M)` format, or `(H : M : S)` format if the promotion lasts less than `24H`.

### Patch Changes

- Modified paddings of PromotionHurryToSaveBanners to have visual consistency with PromotionItemContent
- Fixed a german translation issue for "save_your_free_gift"
- Fixed promotion automatic discount price on PDP
- Removed full capitalization of PromotionHurryToSaveBanner label
- Handle possible `undefined` results from `useRpc` calls
- Add store address, phone and open status to the map marker card
- Fixed StoreLocator map covering navigation flyout
- Fixed a z-index issue with the ToastContainer so that notifications are not partially displayed underneath the Promotion Banner
- Adds missing Promotion Banner Link to Promotion Category on mobile view
- Removed dummy non-functional shipment detail link from OrderStatusBar
- An error has been fixed where an attempt was made to access the "document" object during server-side rendering, resulting in an inaccessible Order Success Page (_OSP_).
- Added translatable string 'pdp.no_product_information_provided' for ProductDescription and ProductCompositionAndCare components instead of static string

### 🏡 Dependency Updates

#### 🏘️ DevDependencies

- Added `@scayle/eslint-plugin-vue-composable@0.1.1`
- Updated to `@crowdin/cli@3.19.2"`
- Updated to `@nuxt/test-utils@3.12.0`
- Updated to `@nuxtjs/i18n@8.3.0`
- Updated to `@scayle/eslint-config-storefront@3.2.7`
- Updated to `@types/node@20.12.7`
- Updated to `@typescript-eslint/eslint-plugin@7.7.0`
- Updated to `@typescript-eslint/parser@7.7.0`
- Updated to `@upstash/redis@1.29.0`
- Updated to `@vitest/coverage-v8@1.5.0`
- Updated to `autoprefixer@10.4.19`
- Updated to `eslint-plugin-tailwindcss@3.15.1`
- Updated to `nuxt@3.11.1`
- Updated to `ofetch@1.3.4`
- Updated to `postcss-custom-properties@13.3.7`
- Updated to `postcss-import@16.1.0`
- Updated to `postcss@8.4.38`
- Updated to `prettier-plugin-tailwindcss@0.5.13`
- Updated to `tailwindcss@3.4.3`
- Updated to `vitest@1.5.0`
- Updated to `vue-tsc@2.0.13`

#### 🏠 Dependencies

- Added `@contentful/rich-text-html-renderer@16.3.5`
- Added `@storyblok/vue@8.0.7`
- Added `axios@1.6.8`
- Added `cf-content-types-generator@2.15.0`
- Added `consola@3.2.3`
- Added `contentful-export@7.19.144`
- Added `contentful@10.8.7`
- Added `globby@14.0.1`
- Removed `prettier-plugin-tailwindcss@0.5.13`
- Updated to `@scayle/omnichannel-nuxt@2.1.4`
- Updated to `@scayle/storefront-nuxt@7.66.0`
- Updated to `@tailwindcss/typography@0.5.12`
- Updated to `@types/google.maps@3.55.7`
- Updated to `nanoid@5.0.7`
- Updated to `nuxi@3.11.1`
- Updated to `storyblok-js-client@6.7.2`
- Updated to `ufo@1.5.3`

## 1.0.0-rc.8

This release focuses on stabilization and modularization, to improve the technical foundation and developer experience.

### 🔥 Highlights

#### ✨ Update to Nuxt 3.10.3 and Vue 3.4.21

Storefront Boilerplate now runs on both the latest Nuxt `v3.10.3` and Vue `v3.4.21` and benefits from a multitude of improvements.
To get more details about all the changes see the [Official Nuxt 3.10 Announcement Blog](https://nuxt.com/blog/v3-10)
and the [Official Vue 3.4.21 Changelogs](https://github.com/vuejs/core/blob/main/CHANGELOG.md#3421-2024-02-28).

### 📍 SCAYLE Omnichannel Addon for Storefront

Storefront now support the SCAYLE Omnichannel Addon and introduces the `StoreLocator` page and includes the `StoreAvailability` within the Product Detail Page.

### 🔭 Additional Tracking Improvements

The included tracking implementation has been refactored and received various improvements to increase the tracking data quality, as well as tracking data reliability.

### 🚀 Major Changes

- **BREAKING:** Refactored default `sameSite` cookie settings from `none` to `lax` in `config/storefront.ts`
- Added `StoreLocator` page based on Google Maps and `SCAYLE Omnichannel`
- Added `StoreAvailability` to Product Detail Page using `SCAYLE Omnichannel`
- Added `patch-packages` for managing patches to third party packages.
  See `README.md` or the `patches/` directory for an up-to-date listing of currently applied patches.
  - Patched `unstorage` so the VercelKV driver is not logged as `undefined`
- Removed `auth` config in `composables/useAuthentication.ts` and `useRuntimeConfig().public.storefront.auth` field in `config/storefront.ts`
- Changed public `runtimeConfig` type to `ModulePublicRuntimeConfig`

### 💅 Minor Changes

- Fixed caching behavior for account area via `routeRules` in `nuxt.config.ts`
- Fixed wishlist toggle if wishlist data is being toggled and fetched in `components/product/WishlistToggle.vue`
- Refactored error message handling during local development mode to show actual error with stack trace
- Fixed product detail page and product listing page (category page) behavior if basket data is undefined
- Fixed Storyblok CMS data handling in `pages/s/[slug].vue`
- Fixed Storyblok CMS components handling in `pages/c/[slug].vue`
- Renamed `categoryNotFound` to `foundCategoryByPath` in `pages/[...category].vue`
- Fixed error handling for non existing category slug by throwing a `404` error and removed error handling from `layouts/defaults.vue`
- Fixed redirection from error page to homepage
- Converted `routeChangeTrackingObserver` to the route middleware and added delayed execution
- Fixed redirection behavior on login from checkout, as it will now redirect after login back to checkout
- Used `onNuxtReady` instead of `tryOnMounted` for `composables/tracking/watchers/useCustomerDataChangeWatcher.ts` and removed user force refresh
- Fixed links on Storyblok grid tile, clickable image and banner link
  - `modules/cms/providers/storyblok/components/BannerLink.vue`
  - `modules/cms/providers/storyblok/components/ClickableImage.vue`
  - `modules/cms/providers/storyblok/components/GridTile.vue`
  - `modules/cms/providers/storyblok/components/StoryblokLink.vue`
- Fixed category behavior by using new composable `useCategoryByPath` to source category data in `pages/[...category].vue`
- Fixed category behavior by using `stripShopLocaleFromPath` and remove computed value in `pages/[...category].vue`
- Refactored root categories logic and implement app navigation trees
  - Added `composables/useCategory.ts`
  - Added `composables/useNavigationTreeItems.ts`
  - Added `composables/useRootCategories.ts`
  - Refactored `components/layout/footer/AppFooter.vue`
  - Refactored `components/layout/headers/AppHeader.vue`
  - Refactored `components/layout/headers/HeaderSubNavigation.vue`
  - Refactored `components/layout/navigation/MobileSidebar.vue`
  - Refactored `composables/useProductList.ts`
  - Refactored `pages/[...category].vue`
- Improved tracking behavior
  - Refactored `composables/tracking/events/useUserActionEvents.ts`
  - Refactored `composables/tracking/watchers/useCustomerDataChangeWatcher.ts`
  - Refactored `composables/useWishlistPage.ts`
  - Refactored `nuxt.config.ts`
- Fixed promotion handling and hides gifts if minimum order value (`mov`) is not satisfied
  - Refactored `composables/useBasketItemPromotion.ts`
  - Refactored `composables/useProductPromotions.ts`
  - Refactored `composables/usePromotionProgress.ts`
  - Refactored `utils/promotion.ts`
- Adjusted promotion basket gift conditional banner labels
  - Refactored `components/basket/promotion/BasketGiftConditionBanner.vue`
  - Refactored `composables/useBasketItemPromotion.ts`
  - Refactored `langs/de-DE.json`
  - Refactored `langs/en-GB.json`
  - Refactored `langs/en_origin.json`
- Adjusted promotion conditional banner on product detail page
  - `components/basket/promotion/BasketGiftConditionBanner.vue`
  - `components/product/promotion/ProductPromotionGiftConditionBanner.vue`
  - `composables/useProductPromotions.ts`
  - `pages/p/[slug].vue`
- Reduced duplicate promotion quantity and cost logic
  - Added `composables/usePromotionConditionBanner.ts`
  - Refactored `components/basket/promotion/BasketGiftConditionBanner.vue`
  - Refactored `components/product/promotion/ProductPromotionGiftConditionBanner.vue`
  - Refactored `langs/de-DE.json`
  - Refactored `langs/en-GB.json`
  - Refactored `langs/en_origin.json`
- Extracted promotion condition banner to unified component and reuse it
  - Added `components/promotion/PromotionGiftConditionBanner.vue`
  - Refactored `components/basket/promotion/BasketGiftConditionBanner.vue`
  - Refactored `components/product/promotion/ProductPromotionGiftConditionBanner.vue`
- Replaced used promotion `mov` abbreviation with full keyword `minOrderValue` to reduce complexity
  - Refactored `components/basket/promotion/BasketGiftConditionBanner.vue`
  - Refactored `components/product/promotion/ProductPromotionGiftConditionBanner.vue`
  - Refactored `composables/useBasketItemPromotion.ts`
  - Refactored `composables/useProductPromotions.ts`
  - Refactored `composables/usePromotionConditionBanner.ts`
  - Refactored `langs/de-DE.json`
  - Refactored `langs/en-GB.json`
  - Refactored `langs/en_origin.json`
- Extended End-to-End testing behavior with promotion features
  - Refactored `components/product/promotion/ProductPromotionSelectionModal.vue`
  - Refactored `components/promotion/PromotionHurryToSaveBanners.vue`
  - Refactored `composables/useBasketPromotions.ts`
  - Refactored `composables/useProductPromotions.ts`
  - Refactored `composables/usePromotionGifts.ts`
  - Refactored `pages/p/[slug].vue`
- Fixed and refactored Identity Provider support
  - Added `components/auth/IDPCallback.vue`
  - Refactored `components/auth/IDPForm.vue`
  - Refactored `components/auth/SignInForm.vue`
  - Refactored `components/auth/LoginForm.vue`
  - Refactored `composables/useAuthentication.ts`
  - Refactored `config/storefront.ts`

### 🩹 Patch Changes

- Aligned check icon within color chip
- Fixed missing flyout close for sub-navigation in `components/layout/headers/AppHeader.vue`
- Replaced default Nuxt favicon with SCAYLE favicon in `public/favicon.ico`
- Added `immediate: true` to watcher and refactored `composables/tracking/watchers/useCustomerDataChangeWatcher.ts` to avoid delayed execution and wrongly reported tracking data
- Fixed application crash during server-side rendering while trying to access `window.localStorage` in `composables/useLastLoggedInUser.ts`
- Fixed rendering issues with product price by using optional chaining `basketData.value?.items` in `components/product/ProductPrice.vue`
- Set default TTL of the cache storage provider with redis to `10` minutes to avoid unlimited cache keys
- Replaced translation `Sicht` with `Ansehen` for notification CTA
- Fixed wrong config type for `gtm.debug` in `nuxt.config.ts`
- Fixed incorrect triggering of `content_view` tracking event during server-rendering in `middleware/routeChangeTrackingObserver.global.ts`
- Hide scrollbar on homepage collection content

### 🏡 Dependency Updates

#### 🏘️ DevDependencies

- Updated to `@types/node@30.11.25`
- Updated to `@upstash/redis@1.28.4`
- Updated to `@vitest/coverage-v8@1.3.1`
- Updated to `autoprefixer@10.4.18`
- Updated to `eslint@8.57.0`
- Updated to `eslint-plugin-tailwindcss@3.15.0`
- Updated to `happy-dom@13.7.3`
- Updated to `nuxt@3.10.3` (*​For detailed changes see [Release Notes for Nuxt](https://github.com/nuxt/nuxt/releases)*​)
- Updated to `postcss-custom-properties@13.3.5`
- Updated to `prettier-plugin-tailwindcss@0.5.12`
- Updated to `storyblok@3.27.0`
- Updated to `storyblok-generate-ts@2.0.2`
- Updated to `typescript@5.4.2`
- Updated to `vitest@1.3.1`
- Updated to `vue-tsc@2.0.6`

#### 🏠 Dependencies

- Added `@googlemaps/js-api-loader@1.16.6`
- Added `@scayle/omnichannel-nuxt@2.1.3`
- Added `@types/google.maps@3.55.4`
- Updated to `@scayle/storefront-nuxt@7.61.3`
- Updated to `@storyblok/nuxt@6.0.6`
- Updated to `@vueuse/core@10.9.0`
- Updated to `@vueuse/nuxt@10.9.0`
- Updated to `dotenv@16.4.5`
- Updated to `nanoid@5.0.6`
- Updated to `storyblok-js-client@6.7.1`
- Updated to `vue@3.4.21` (*​For detailed changes see [Changelog for Vue](https://github.com/vuejs/core/blob/main/CHANGELOG.md)*​)

## 1.0.0-rc.07

This release focuses on stabilization and modularization, to improve the technical foundation and developer experience.

### 🔥 Highlights

#### ✨ Update to Nuxt 3.10.2 and Vue 3.4.19

Storefront Boilerplate now runs on both the latest Nuxt `v3.10.2` and Vue `v3.4.19` and benefits from a multitude of improvements.
To get more details about all the changes see the [Official Nuxt 3.10 Announcement Blog](https://nuxt.com/blog/v3-10)
and the [Official Vue 3.4.19 Changelogs](https://github.com/vuejs/core/blob/main/CHANGELOG.md#3419-2024-02-13).

#### 🧪 Modularization: Extracting Cypress into dedicated sub-package

The Cypress testing solution has been extracted into a dedicated child package located at `cypress/`. This decouples the Dependencies from the main Storefront Application. To install all relevant Cypress Dependencies, execute `yarn install` within the `cypress/` directory.
By default the current Cypress integration does not rely anymore on the commercial Cypress Dashboard integration.
Please check the dedicated Readme file located at `cypress/README.md` for more details.

The following Dependencies have moved from `package.json` to `cypress/package.json`:

- `cypress`
- `cypress-real-events`
- `eslint-plugin-cypress`

#### 🧱 Modularization: Extracting Storyblok Integration into local module

The Storyblok integration has been extracted into a dedicated local Nuxt module `storefront-cms`.
This allows to combine all CMS provider relevant functionalities within a central Nuxt module and allows for simple future inclusion of additional CMS providers.

The new local Nuxt module can be found under `modules/cms/` and its path has been added to `nuxt.config.ts` to the `modules` list.

### 🧲 Tracking Refactoring and Improvements

The included tracking implementation has been refactored and received various improvements to increase the tracking data quality, as well as tracking data reliability.

### 🚀 Major Changes

- **BREAKING:** The Image CDN config key has now moved to runtimeConfig under `public.cdnUrl`
  - The environment variable `NUXT_PUBLIC_IMAGE_BASE_URL` has been replaced by `NUXT_PUBLIC_CDN_URL`
- **BREAKING:** Added patch files for automatic dependency patching with [`patch-package`](https://www.npmjs.com/package/patch-package).
  The tool will run in `postinstall` and apply any patches present in the `patches/` directory to the respective dependency. Extended `README.md` with a section regarding `Patches` to explain the details and currently applied patches
  - Patched support for runtimeConfig with `@nuxt/image`
  - Patched missing (`undefined`) driver name in `unstorage` if using `VercelKV` as caching driver
  - Patches `nitro` (`nitropack`) to resolve session issues with page caching enabled
- Added full support for an easy way of running the application through docker compose

### 💅 Minor Changes

- Refactored Wishlist
  - Added `WishlistCardSlideIn`, `WishlistCardImage` and `WishlistCardDescription` components
  - Added `useWishlistPage`, `useWishlistItem` and `useWishlistItemActions` composables
- Fixed an issue with Guest User being able to access the Account page, even though it did not have any content
- Fixed an issue with the Order pages not properly displaying content due to page caching issues while using path-based routing
- Fixed various UX/UI issues for the new Promotion Engine feature
- Fixed hydration issues related to viewport-dependent font-size classes on PDP in `pages/p/[slug].vue`
- Fixed hydration issues related to viewport-dependent font-size classes on PLP in `components/product/card/ProductCard.vue`
- Refactored various components to use new Vue v3 `defineEmits` syntax for events
  - `components/layout/headers/search/MobileSearchInput.vue`
  - `components/search/CategorySuggestions.vue`
  - `components/search/ProductSuggestions.vue`
  - `components/search/SearchResultItem.vue`
  - `components/search/SearchResults.vue`
  - `components/search/SearchResultsContainer.vue`
- Fixed `DefaultLink` behavior with path-based routing in `components/ui/links/DefaultLink.vue`
- Fixed client-side validation behavior for login and registration forms
  - `components/auth/GuestLoginForm.vue`
  - `components/auth/LoginForm.vue`
  - `components/auth/RegisterForm.vue`
  - `components/auth/SalutationSelect.vue`
- Fixed "Register" link to open the "Registration" tab within the `SignInForm` in `components/auth/SignInForm.vue`

### 🩹 Patch Changes

- Added `hasOneSizeProductVariantOnly` helper within `sizes` util
- Fixed UX / UI issues for Order details page in `pages/account/orders.vue`
- Fixed UX / UI issues with login and registration forms
- Fixed window scrolling on PLP pagination in `components/ui/pagination/PaginationButton.vue`
- Disabled `swr` for page caching by default to mitigate potential broken pages and hydration issues

### 🏡 Dependency Updates

#### 🏘️ DevDependencies

- Updated to `@crowdin/cli@3.18.0`
- Updated to `@nuxt/test-utils@3.11.0`
- Updated to `@nuxtjs/i18n@8.1.0`
- Updated to `@nuxtjs/tailwindcss@6.11.4`
- Updated to `@types/node@20.11.17`
- Updated to `@upstash/redis@1.28.3`
- Updated to `@vitest/coverage-v8@1.2.2`
- Updated to `eslint-plugin-tailwindcss@3.14.2`
- Updated to `happy-dom@13.3.8`
- Updated to `lint-staged@15.2.2`
- Updated to `nuxt@3.10.1`
- Updated to `postcss@8.4.35`
- Updated to `vitest@1.2.2`

#### 🏠 Dependencies

- Updated to `@scayle/storefront-nuxt@7.57.1`
- Updated to `citty@0.1.5`
- Updated to `dotenv@16.4.3`
- Updated to `nanoid@5.0.5`
- Updated to `redis@4.6.13`
- Updated to `storyblok-js-client@6.6.7`
- Updated to `ufo@1.4.0`
- Updated to `vue@3.4.19`

## 1.0.0-rc.06

This release focuses on stabilization and refactoring, to improve the technical foundation and developer experience.

### 🚀 Major Changes

- **BREAKING:** Nested public Storefront-specific `runtimeConfig` properties under the `storefront` key
  - Replaced `useRuntimeConfig().public.log` and `useRuntimeConfig().public.auth`
    with `useRuntimeConfig().public.storefront.log` and `useRuntimeConfig().public.storefront.log`
  - Changed `(...storefrontRuntimeConfigPublic as any),` to `storefront: storefrontRuntimeConfigPublic as any,` in `nuxt.config.ts`
- **BREAKING**: Allow the session of an `RpcContext` to be `undefined`
  - This changes the structure of the `RpcContext`, so it may be a breaking change if you have written custom RPC methods.
    The affected properties on the `RpcContext` are `sessionId`, `wishlistKey` and `basketKey` and
    the affected methods are `destroySession`, `createUserBoundSession`, `updateUser`, and `updateTokens`.
    If you use these methods or properties in a custom RPC method, make sure that you handle the case where they might be undefined.
    TypeScript will also catch these cases if you have `strictNullChecks` enabled.
    You can check `context.sessionId` (or another session-dependent property) to determine if the session is present.
    If one of these properties is present, all will be. Alternatively, you can call `assertSession(context)`
    before referencing any properties on the context. If the session is not present,
    an error will be thrown. For any usage of `context` after `assertSession` is called,
    TypeScript will understand that the session properties are present.

### 💅 Minor Changes

- Extracted sorting and grouping basket helpers to `utils`
- Properly resolve `basketGroup` RPC with params
- Removed wishlist utils and moved them to the `useWishlistActions` composable
- Replaced `validation` plugin with `useValidationRules` composable
- Replaced `toast` plugin with `useNotification` composable
- Replaces `tracking` plugin with `useTracking` composable
- Renamed `divideWithHundred` price utility to `divideByHundred`
- Renamed `localeFormattedDate` date utility to `formatLocaleDate`
- Enforced using tracking sub-composables through the `useTrackingEvents` by turning off auto-import for sub-composables
- Simplified `Countdown` component logic by using `useIntervalFn` from `vueuse`
- Changed `radash` utils prefix to be underscore (`_`) instead of `use`, to avoid confusion between `radash`
  utilities and Vue composables. Resulting in e.g. `useSleep` to become `_sleep`.
- Used radash `_sort` (`useSort`) instead of native `sort` to avoid side effects
- Export composables as named functions
- Refactored components to use `withDefaults` and type generics to define component properties
- Refactored product and navigation components to reduce complexity
- Refactored account area component to reduce complexity and improve UI experience
  - `components/account/AccountHeader.vue`
  - `components/account/AccountWrapper.vue`
  - `components/addOns/AddOnsSelector.vue`
  - `components/order/OrderHeader.vue`
  - `components/order/OrderItemCard.vue`
  - `components/order/OrderOverviewHeader.vue`
  - `components/order/OrderStatusBar.vue`
  - `pages/account/orders.vue`
  - `pages/account/user.vue`
  - `pages/account/orders/[id].vue`
- Refactored account area orders components to reduce complexity and improve UI experience
  - `components/account/AccountWrapper.vue`
  - `components/order/OrderHistoryItem.vue`
  - `components/order/OrderItems.vue`
  - `composables/useOrders.ts`
- Refactored used Tailwind classes across the Storefront Boilerplate to comply with used Tailwind version
- Tweaked Promotion Engine implementation and UI experience across the Storefront Boilerplate
- Tweaked Order Success Page (OSP) complexity and UI experience
- Renamed buildtime environment variable `NUXT_STOREFRONT_DOMAIN_DEFAULT` to `DOMAIN_DEFAULT`
- Renamed buildtime environment variable `NUXT_STOREFRONT_DOMAIN_PER_LOCALE` to `DOMAIN_PER_LOCALE`
- Renamed buildtime environment variable `DISABLE_SSR_CACHE` to `DISABLE_PAGE_CACHE`

### 🩹 Patch Changes

- Refactored `slicedOrders` to be a `computed` property in `components/account/AccountWrapper.vue`
- Refactored `_sizes` to be a `computed` property in `components/product/ProductSizePicker.vue`
- Refactored `components/addOns/AddOnsSelector.vue` to use `computed` properties instead of `ref` and dedicated update functions
- Refactored `basketItems` to have an empty array as fallback in `components/basket/popover/BasketPopoverItems.vue`
- Added missing state key for `footerNavigationTrees` in `components/layout/footer/AppFooter.vue`
- Simplified watcher for `searchQuery` in `components/layout/headers/search/HederSearch.vue`
- Refactored Nuxt-specific imports to import from `#app` instead of `nuxt/app`
- Added `collapsed` component property to `components/product/detail/ProductDetailAccordionEntry.vue`
- Use object for lookup of headline sizes instead of `computed` property in `components/ui/headlines/Headline.vue`
- Fixed desktop sidebar overlapping navigation in `pages/[...category].vue`
- Added `time` constants in `constants/time.ts` and used it in `components/ui/Countdown.vue`
- Refactored `PromotionBanner` to be displayed on `onNuxtReady` instead of `onServerPrefetch`
  to avoid missing interactivity during page load and hydration
- Removed `runtimeConfig.public.storyblok.webhookSecret` from `nuxt.config.ts`, as it is not supported by the `storyblok-nuxt` module
- Use `yn` to typecast potential build value of `runtimeConfig.public.gtm.debug` via `yn(process.env.NUXT_PUBLIC_GTM_DEBUG)` in `nuxt.config.ts`

### 🏡 Dependency Updates

#### 🏘️ DevDependencies

- Updated to `@crowdin/cli@3.16.1`
- Updated to `@nuxt/image@1.3.0`
- Updated to `@nuxt/test-utils@3.10.0`
- Updated to `@nuxtjs/tailwindcss@6.11.0`
- Updated to `@types/node@20.11.5`
- Updated to `@upstash/redis@1.28.2`
- Updated to `@vitest/coverage-v8@1.2.1`
- Updated to `autoprefixer@10.4.17`
- Updated to `cypress@13.6.3`
- Updated to `eslint-plugin-tailwindcss@3.14.0`
- Updated to `happy-dom@13.2.2`
- Updated to `nuxt@3.9.3` (*​For detailed changes see [Release Notes for Nuxt](https://github.com/nuxt/nuxt/releases)*​)
- Updated to `utility-types@3.11.0`
- Updated to `vitest@1.2.1`

#### 🏠 Dependencies

- Updated to `@scayle/storefront-nuxt@7.53.1`
- Updated to `@storyblok/nuxt@6.0.4`
- Updated to `dotenv@16.3.2`
- Updated to `storyblok-js-client@6.6.3`
- Updated to `vue@3.4.15` (*​For detailed changes see [Changelog for Vue](https://github.com/vuejs/core/blob/main/CHANGELOG.md)*​)

## 1.0.0-rc.05

### 🔥 Highlights

#### ✨ Update to Nuxt 3.9 and Vue 3.4

Storefront Boilerplate now runs on both the latest Nuxt `v3.9` and Vue `v3.4` and benefits from a multitude of improvements.
To get more details about all the changes see the [Official Nuxt 3.9 Announcement Blog](https://nuxt.com/blog/v3-9)
and the [Official Vue 3.4 Announcement Blog](https://blog.vuejs.org/posts/vue-3-4).

#### 🛫 Introducing Promotion Engine

The Promotion Engine presents the user with various promotions that have specific conditions for receiving the discount.
The Storefront Boilerplate currently support the two types `Automatic discount` and `Buy X get Y` by default as promotions.

- [SCAYLE Resource Center - Storefront Boilerplate / Promotion Engine](https://scayle.dev/en/storefront-guide/developer-guide/features/promotions)

#### 👥 Identity Provider support for Token-based Authentication

The Storefront Boilerplate now provides support for Single-Sign-On (SSO) via multiple Identity Provider (IDP) like Okta, KeyCloak or Google.
The IDP login / SSO flow integrates with the existing Token-based Authentication and can be used in parallel to the existing SCAYLE IDP.

- [SCAYLE Resource Center - Storefront Core / Authentication](https://scayle.dev/en/storefront-guide/developer-guide/basic-setup/authentication)

#### 🔋 Introducing Page Caching with unified cache handling

The distributed default configuration of the Storefront Boilerplate comes with page caching enabled and relies on the
global `storefront-cache` storage mountpoint available via [Storefront Core - Caching](https://scayle.dev/en/storefront-guide/developer-guide/basic-setup/caching)
and configured via [Storefront Core - Storage via Module Configuration](https://scayle.dev/en/storefront-guide/developer-guide/basic-setup/introduction#storage).

- [SCAYLE Resource Center - Storefront Boilerplate / Page Caching](https://scayle.dev/en/storefront-guide/developer-guide/basic-setup/caching#page-caching-in-storefront-boilerplate)

#### 🛫 Introducing support for Vercel Edge deployment

Storefront Boilerplate does now support deployment to Vercel Edge, besides Docker-based deployments.

- [SCAYLE Resource Center - Storefront Boilerplate / Vercel Edge](https://scayle.dev/en/storefront-guide/developer-guide/deployments/vercel)

### 🚀 Major Changes

- Updated Cypress E2E test suite
- Introduced new utility `formatCurrency()` in `useFormatHelpers` and refactored usage of `getCurrency()` & `toCurrency()`
- Removed `nuxt-viewport` and refactored application to use `useDefaultBreakpoints` composable based on `VueUse/useBreakpoints` (_​For details see [VueUse Documentation](https://vueuse.org/core/useBreakpoints/)_)
- Reduced the usage of viewport detection logic and refactored UI to rely on responsive layouts instead
- Extract and refactor Product Filter handling on Category and Search page
- Refactored i18n integration and usage across application due to update of `@nuxt/i18n` to `v1.0.0` stable release

### 💅 Minor Changes

- Removed `stylelint`, related Dependencies and package script commands
- Replaced `nuxt-vitest` with `@nuxt/test-utils@3.9.0` as the projects have been officially been merged together (_For detailed changes see [Changelog of @nuxt/test-utils](https://github.com/nuxt/test-utils/releases/tag/v3.9.0)_)
  - Introduced `vitest-environment-nuxt@1.0.0`
- Remove unsupported `imageBaseUrl` option key from `storefrontRuntimeConfigPublic` in `config/storefront.ts`
- Removed usage of `process.env` from `nuxt.config` and `config/storefront.ts`, relying on using runtime environment variables instead (_For details see [Nuxt Documentation - runtimeConfig / Environment Variables](https://nuxt.com/docs/guide/going-further/runtime-config#environment-variables)_)
- Allowing to use HTTP during local development mode
- Extend `.env.example` with updated environment variables for locale development purposes
- Added documentation reference links into `nuxt.config.ts`
- Added comments with environment variables names to override runtimeConfig keys into `nuxt.config.ts` and `config/storefront.ts`
- Removed unused `nuxt/utils/cms.ts`
- Introduce `useOrders` composable to unify orders handling
- Changed usage of `forgotPassword(data: SendResetPasswordEmailRequest)` to `forgotPassword(email: string)` in `useAuthentication` composable, refactored occurrences accordingly
- Introduce `@vercel/kv` and `@upstash/redis` for VercelKV support
- Extend `routeRules` in `nuxt.config.ts` to handle Vercel page caching
- Extend `routeRules` in `nuxt.config.ts` to support multiple cache configurations
- Extend `routeRules` in `nuxt.config.ts` to allow disabling SSR Page Caching via environment variables during build time with `DISABLE_SSR_CACHE`
- Extend `cache-test.mjs`
- Set `differentDomains` based on environment variable `DOMAIN_PER_LOCALE` during build time in `nuxt.config.ts`
- Enable `debug: true` in `nuxt.config.ts` to being able to pinpoint potential hydration mismatches or enumerating key issues
- Various type tweaks and refinements

### 🩹 Patch Changes

- Fixed Storyblok integration with handling of invalid `product_ids` in `storyblok/components/ProductSlider`
- Fixed Storyblok integration on Category pages without defined Storyblok CMS category slug resulting in error pages in `pages/[...category].vue`
- Fixed issue with unavailable product colors on Product Detail Page in `pages/p/[slug].vue]`
- Removed `version: getStoryblokContentVersion(),` from `composables/useCms.ts`
- Fixed caching behavior incorrect product list layout in `components/productList/ProductList.vue` & `pages/[...category].vue]`
- Fixed Order types in `components/order/OrderHeader.vue`, `components/order/OrderItems.vue`, `components/order/summary/PaymentSummary.vue`, `pages/account/orders/[id].vue`
- Fixed computed property `orderItems` in `pages/account/orders/[id].vue`
- Fixed ProductBadge position in `components/product/ProductBadge.vue` and `components/productList/ProductList.vue`
- Fixed user information disappearing after reload by disabling `autoFetch` and fetching user data explicitly `onMounted` in `components/layout/headers/user/UserPopover.vue`
- Fixed re-fetching for product list in `pages/[...category].vue]`
- Fixed mobile sidebar overlapping issue in `components/layout/navigation/MobileSidebar.vue`
- Fixed size picker overlapping issue in `components/wishlist/card/WishlistCard.vue`
- Fixed SlideIn overlapping issue in `components/layout/SlideIn.vue` and `composables/useSlideIn.ts`
- Fixed Wishlist and Basket page being incorrectly cached
- Fixed incorrect routing behavior in the following files
  - `components/layout/headers/search/HeaderSearch.vue`
  - `components/ui/links/DefaultLink.vue`
  - `composables/useRouteHelpers.ts`
  - `middleware/authGuard.global.ts`
  - `utils/route.ts`
- Various other smaller fixes and improvements

### 🏡 Dependency Updates

#### 🏘️ DevDependencies

- Removed `@nuxt/devtools` from DevDependencies, as its now included with `nuxt@3.8` or higher
- Updated to `vue@3.4.10` (*​For detailed changes see [Changelog for Vue](https://github.com/vuejs/core/blob/main/CHANGELOG.md)*​)
- Updated to `nuxt@3.9.1` (*​For detailed changes see [Release Notes for Nuxt](https://github.com/nuxt/nuxt/releases)*​)
- Updated to `@crowdin/cli@3.16.0`
- Updated to `@nuxt/image@1.2.0`
- Updated to `@nuxt/test-utils@3.9.0`
- Updated to `@nuxtjs/i18n@8.0.0`
- Updated to `@nuxtjs/tailwindcss@6.10.4`
- Updated to `@scayle/eslint-config-storefront@3.2.6`
- Updated to `@types/color@3.0.6`
- Updated to `@types/node@20.11.1`
- Updated to `cypress@13.6.2`
- Updated to `eslint@8.56.0`
- Updated to `eslint-plugin-tailwindcss@3.13.1`
- `happy-dom@13.0.4`
- `lint-staged@15.2.0`
- Updated to `nuxt-svgo@4.0.0.`
- `postcss@8.4.33`
- `postcss-custom-properties@13.3.4`
- `postcss-html@1.6.0`
- `postcss-import@16.0.0`
- `prettier-plugin-tailwindcss@0.5.11`
- `storyblok@3.26.0`
- `storyblok-generate-ts@2.0.1`
- Updated to `tailwindcss@3.4.1`
- Updated to `typescript@3.4.1`
- Updated to `vitest@1.1.3` and `@vitest/coverage-v8@1.2.0`
- Updated to `vue-tsc@1.8.27` (_NOTE: This dependency update is required for proper `vue@3.4` type checking!_)

#### 🏠 Dependencies

- Added `nuxi@3.10.0` as it is now a standalone project within the Nuxt ecosystem
- Added `vue@3.4.10` as explicit dependency to avoid potential version mismatches
- Updated to `@scayle/storefront-nuxt@7.50.1`
- Updated to `@storyblok/nuxt@6.0.1`
- Updated to `@tailwindcss/forms@0.5.7`
- Updated to `@vueuse/core@10.7.1` and `@vueuse/nuxt@10.7.1`
- Updated to `global@4.4.0`
- Updated to `maska@2.1.11`
- Updated to `nanoid@5.0.4`
- Updated to `redis@4.6.12`
- Updated to `ufo@1.3.2`

## 1.0.0-rc.04

### Major Changes

- Use public npmjs.org package registry for `@scayle` packages and remove the need for a local `.npmrc` file
- Use public `storyblok-generate-ts` package instead of private fork

### Minor Changes

- Updated to latest `@scayle/storefront-nuxt` package using `v7.37.2`
- Improved Dockerfiles for build and deployments

### Patch Changes

- Updated various Dependencies to latest versions

## 1.0.0-rc.03

### Major Changes

- Introduced `vitest` for unit testing and created dummy test files for most components
- Introduced page caching using [Route Rules](https://nuxt.com/docs/guide/concepts/rendering#route-rules)
- Replacing AuthGuard component with router middleware
- Use `defineOptions` for `vue` component naming

### Minor Changes

- Introduce `localizedNavigateTo` for the programmatic routing approach
- Upgrade to Vue 3.3.7
- Replaced `useUiState` with smaller composables which are: `useFlyouts`, `useMobileSearch`, `useModal` & `useSideNavigation`.
- Enable auto-import for the `constants` folder
- Various dependency minor dependency

### Patch Changes

- Fixed session max age
- Handle AddToWishlist errors
- Added missing Storyblok components
- Resolved Storyblok link
- Fixed broken links when path-based shops are enabled
- Various bugfixes

## 1.0.0-rc.02

### Minor Changes

- Upgrade to Nuxt 3.7.4

### Patch Changes

- Reduction of hydration errors
- Improved error handling for invalid products on PDP, as well as category and service pages
- Improved handling of displaying account related UI elements for guest user
- Improved order refresh behavior on Order Success Page
- Various smaller bug fixes

## 1.0.0-rc.01

### Major Changes

- Introduce Nuxt 3
- Tracking of all relevant shop interactions with GTM
- Implemented Search Engine optimizations
- Provide more CMS content integrations (Storyblok) into all relevant pages

### Minor Changes

- Improved error handling and displaying of error pages
- Improvements to redirect handling
- Improved SVG icon handling
- Improvements to mobile styling and behavior

### Patch Changes

- Various bugfixes
