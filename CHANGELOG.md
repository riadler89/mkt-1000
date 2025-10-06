# @scayle/storefront-application-nuxt

## 1.13.0

**Release Date:** _2025-09-18_

### 🔥 Highlights

#### 🎁 Supercharge Your Marketing with Advanced Promotions

This release significantly expands the available promotional capabilities. The platform now supports engaging customers with exciting new Combo Deals and driving higher order values by applying Multiple Promotions to a single product. The popular Buy X Get Y feature has also been extended to support discounts, not just free gifts. These updates are seamlessly integrated into the UI, ensuring all offers are displayed clearly and consistently across product pages and the basket.

#### 🔒 A Unified Login and Checkout Experience

To create a more seamless and secure customer journey, the login and registration process is now powered by modern SCAYLE Checkout Web Components. This change unifies the look and feel of authentication with the rest of the checkout flow, providing a consistent experience for shoppers. For developers, this means less custom code to maintain, as the sign-in forms are now rendered automatically based on the settings configured in the SCAYLE Panel.

#### 🧱 Introducing a Powerful, Modern CMS Architecture

The Content Management System integration has been completely reimagined with a new component architecture. This upgrade provides a more powerful and flexible system for content managers, with features like inspector mode support and improved layout stability for images. For developers, a single unified `pnpm cms:sync` command and new wrapper components dramatically simplify the development workflow, improve type safety, and make building rich, deeply nested content experiences easier than ever.

### 🚀 Major Changes

- **\[CMS\]** The CMS integration has been significantly improved with the introduction of a modern v3 component architecture.

  This upgrade replaces the previous complex setup with a unified, modular system that eliminates manual configuration and inconsistent component models while providing flexible building blocks for content managers and improved type safety for developers.

  **Breaking Changes:**
  - Components are no longer globally registered by the CMS module. Instead, use the new `StoryblokComponent` and `ContentfulComponent` wrapper components. These automatically render the correct component for each content element.

    **Before:**

    ```html
    <template>
      <!-- Contentful -->
      <div v-for="element in content" :key="element?.sys?.id">
        <component
          :is="getComponentName(element?.sys?.contentType?.sys?.id)"
          :blok="element"
        />
      </div>

      <!-- Storyblok -->
      <div v-for="element in content" :key="element._uid">
        <component :is="getComponentName(element.component)" :blok="element" />
      </div>
    </template>
    ```

    **After:**

    ```html
    <template>
      <!-- Contentful -->
      <ContentfulComponent
        v-for="element in content"
        :key="element?.sys.id"
        :content-element="element"
      />

      <!-- Storyblok -->
      <StoryblokComponent
        v-for="element in content"
        :key="element._uid"
        :content-element="element"
      />
    </template>
    <script setup lang="ts">
      import ContentfulComponent from '#storefront-cms/components/ContentfulComponent.vue'
      import StoryblokComponent from '#storefront-cms/components/StoryblokComponent.vue'
    </script>
    ```

  - Multiple CMS type generation commands have been consolidated into a single, unified `pnpm cms:sync` command. This command automatically detects the configured CMS provider from your `.env` file and generates the appropriate types.

    **Before:**

    ```bash
    # Separate commands for each CMS provider
    pnpm contentful:download
    pnpm contentful:generate

    # or

    pnpm storyblok:login
    pnpm storyblok:download
    pnpm storyblok:generate
    ```

    **After:**

    ```bash
    # Single unified command with automatic provider detection
    pnpm cms:sync
    ```

  **Key Improvements:**
  - Full suite of v3 components (`AccordionComponent`, `ButtonComponent`, `DividerComponent`, `GridComponent`, `ImageComponent`, `LinkComponent`, `RichTextComponent`, `SectionComponent`, `SliderComponent`, `TextComponent`, and `VideoComponent`)
  - Improved support for deeply nested content structures
  - Images now reserve space while loading, improving layout stability and reducing content shifting. Furthermore, mobile and desktop images are now rendered within a single `<picture>` element instead of two separate elements.
  - Storyblok links are now resolved when the story is fetched, and will fall back to `cached_url` if necessary. This ensures that links are always up to date, even when the linked content changes. The link resolution behavior is set via the `resolve_links: 'url'` option, which is configured in the `useDefaultStoryblokOptions` composable.
  - Inspector mode support in the Contentful CMS for an enhanced editing experience within the CMS editor
  - New `allowDraft` runtime configuration option to control access to draft content in the CMS editor
  - Comprehensive Storybook documentation and robust test coverage

- **\[E2E\]** Implemented `storefrontAPIClient` fixture for dynamic product data fetching in PDP tests. The fixture replaces hardcoded product IDs with API-driven product selection based on configurable criteria.

  This new approach allows tests to dynamically select a random available product from the product list that meets specific criteria (e.g., single-variant or multi-variant), eliminating the need for hardcoded product IDs. This makes our tests more resilient to changes in test data and front-end UI.

  Key features:
  - Random product selection from available inventory
  - Support for single-variant and multi-variant product filtering
  - Pre-configured with environment-based API credentials
  - Direct navigation to specific PDPs using product IDs
  - Improved test stability

  For more details, see the [Storefront API documentation](https://scayle.dev/en/api-guides/storefront-api).

- **\[Login & Registration\]** Integrated Checkout Web Components for authentication

  The sign in page now uses `<scayle-auth>` for login and registration. This web component automatically renders a sign in form according to the Checkout settings configured in SCAYLE panel, reducing the need for custom code. Additionally, the `<scayle-auth-new-password>` web component is used to handle password reset requests.

  Within the Storefront Application, this change included the following primary steps:
  - Exposing the OAuth ClientID to client-side code through a new Nuxt plugin in `oauth.ts`
  - Updating the `useCheckoutWebComponent` composable to initialize the Checkout Auth API when the script has loaded
  - Replacing the existing log-in and registration form with `<scayle-auth>`
  - Removing the route guard for `/checkout`, since the Checkout web component can now handle authentication on its own

  For more details, see the [Authentication Guide](https://scayle.dev/en/checkout-guide/authentication-accounts/components/authenticate#shop-side-authentication)

- **\[Promotions\]** Added support for Combo Deal promotions, enabling merchants to create more engaging promotional experiences for customers.

  The new Combo Deal promotion type is now fully integrated into the promotion system. When a Combo Deal promotion is active, the `SFDealBanner` component will automatically display the `SFComboDealWrapper` instead of the standard `SFPromotionProgressWrapper`, providing a tailored experience for this promotion type.
  - Use the `isComboDealType()` function to check if a promotion is a Combo Deal
  - The `SFComboDealWrapper` component handles the specific display logic for Combo Deals
  - Existing tiered promotions continue to work with the `SFPromotionProgressWrapper`
    - **Before:**

      ```ts
      <SFDealBanner
          v-if="promotion"
          :display-data="getPromotionDisplayData(promotion)"
          track-event="view_promotion"
      >
          <template #progress>
              <SFPromotionProgressWrapper :promotion="promotion" />
          </template>
      </SFDealBanner>
      ```

    - **After:**

      ```ts
      <SFDealBanner
          v-if="promotion"
          :display-data="getPromotionDisplayData(promotion)"
          track-event="view_promotion"
      >
          <template #progress>
              // If the promotion is a Combo Deal, the SFComboDealWrapper will be displayed instead of the SFPromotionProgressWrapper
              <SFComboDealWrapper
                  v-if="isComboDealType(promotion)"
                  :promotion="promotion"
              />
              <SFPromotionProgressWrapper
                  v-else-if="isTieredPromotion(promotion)"
                  :promotion="promotion"
              />
          </template>
      </SFDealBanner>
      ```

  For implementation details, see the [Combo Deals documentation](https://scayle.dev/en/checkout-guide/configure/promotions/setting-up-promotions-per-type/combo-deals).

- **\[Promotions\]** Integrated Multiple Promotions Feature

  With the latest release of the `@scayle/storefront-promotions` package, the Storefront Application now supports applying multiple promotions to a single product.
  The application takes advantage of the new `promotions` field available on both the `Product` and `BasketItem` entities. As a result, multiple promotions can now be displayed consistently across:
  - Product Details Page
  - Product Listing Page
  - Basket Page

  The `applyPromotions` function in `useBasketActions` has been enhanced to seamlessly apply multiple promotions to a product.
  This functionality works out of the box — no additional adjustments are required in the Storefront Application to take full advantage of it.

  The following components were updated to support multiple promotions:
  - `PDP` - Promotions now display as a unified view, combining basket-level promotions with those derived from product attributes whenever a basket item is selected.
  - `SFProductPrice` now displays multiple promotion reductions with their individual promotion styles.
  - `SFDealBadge` – Now rendered once per promotion on product detail and basket pages.
  - `SFDealBanner` – Now rendered once per promotion on product detail and basket pages. On PDP, the component now displays a checkmark if the promotion is applied.

  Additionally, the usage of `isGiftAddedToBasket` is enhanced to support multiple promotions.
  Before the function was only checking for `promotion` attribute on the basket item which is now replaced with `promotions` attribute.

  ```ts
  const isGiftAddedToBasket = computed(() => {
    if (!isBuyXGetYType(promotion)) {
      return false
    }
    return (
      // Old attribute `promotion`
      basketItems.value?.some(({ promotion: basketPromotion, variant }) => {
        const variantIds = isBuyXGetYType(promotion)
          ? (promotion.effect.additionalData.variantIds ?? [])
          : []
        const hasVariantId = variantIds.includes(variant.id)
        return (
          isBuyXGetYType(basketPromotion) &&
          hasVariantId &&
          promotion.id === basketPromotion?.id
        )
      }) || false
    )
  })
  ```

  ```ts
  const isGiftAddedToBasket = computed(() => {
    if (!isBuyXGetYType(promotion)) {
      return false
    }

    // New attribute `promotions`
    return (
      basketItems.value?.some(({ promotions: basketPromotions, variant }) => {
        return basketPromotions?.some((basketPromotion) => {
          if (
            isBuyXGetYType(basketPromotion) ||
            promotion.id !== basketPromotion.id
          ) {
            return false
          }

          const variantIds = promotion.effect.additionalData.variantIds
          const hasVariantId = variantIds.includes(variant.id)

          return hasVariantId
        })
      }) || false
    )
  })
  ```

  - Renamed `getPromotionForProduct` to `getPromotionsForProduct`. It now returns an array of promotions instead of a single promotion.
    - **Before:**

      ```ts
      <template>
          <SFDealBanner
              v-if="promotion"
              :key="promotion.id"
              :display-data="getPromotionDisplayData(promotion)"
              track-event="view_promotion"
          />
      </template>

      const promotion = getPromotionForProduct(product, promotions)
      ```

    - **After:**

      ```ts
      <template>
          <SFDealBanner
              v-for="promotion in promotions"
              :key="promotion.id"
              :display-data="getPromotionDisplayData(promotion)"
              track-event="view_promotion"
          />
      </template>

      const promotions = getPromotionsForProduct(product, promotions)
      ```

  - The deprecated `promotionId` attribute has been replaced with the new `promotions: { id: string, code?: string }[]` attribute.
  - The `addItemToBasket` function in `usePromotionGiftSelection` now adds items using the new `promotions: { id: string, code?: string }[]` field.
  - The `promotions` field is now available in the product attributes as `Promotion[]` and basket item as `BasketItemPromotion[]` entities.

- **\[Promotions\]** Integrated extended Buy X Get Y promotion type.

  Promotions can now apply discounts (not only free gifts).

  Discounts can be applied to either:
  - Item X (the product added to the basket), or
  - Item Y (other products defined in the promotion).

  Several components and utilities were updated to handle this new promotion type:
  - `SFProductPrice`: Displays a "Free" badge if the promotion is Buy X Get Y with a 100% discount.
    - **Before:**

      ```ts
      <div
          v-if="showBadges && appliedReductions.length"
          class="flex flex-wrap gap-1"
      >
          <span
              v-for="(
                  { amount, category, type, promotionId }, index
              ) in appliedReductions"
              :key="`${amount.relative}-badge-${category}-${index}`"
              class="mr-1 inline-block rounded bg-product-sale px-1 text-sm font-semibold text-white"
              :style="
              (category === 'promotion' && getPromotionStyleById(promotionId)) ||
              (category === 'campaign' && campaignStyle)"
          >
              -{{
                  type === 'relative'
                  ? `${formatPercentage(amount.relative)}`
                  : `${formatCurrency(amount.absoluteWithTax)}`
              }}
          </span>
      </div>
      ```

    - **After:**

      ```ts
      <div v-if="showBadges && appliedReductions.length" class="flex flex-wrap gap-1">
          <span
              v-for="(reduction, index) in appliedReductions"
              :key="`${reduction.amount.relative}-badge-${reduction.category}-${index}`"
              class="mr-1 inline-block rounded bg-product-sale px-1 text-sm font-semibold text-white"
              :style="
                (reduction.category === 'promotion' &&
                  getPromotionStyleById(reduction.promotionId)) ||
                (reduction.category === 'campaign' && campaignStyle)
              "
          >
              {{ getReduction(reduction) }}
          </span>
      </div>


      <script setup lang="ts">
      const getReduction = (reduction: AppliedReduction) => {
        switch (reduction.type) {
          case 'relative':
            return reduction.amount.relative === 1
              ? t('promotion.free_label')
              : `-${formatPercentage(reduction.amount.relative)}`
          case 'absolute':
            return `-${formatCurrency(reduction.amount.absoluteWithTax)}`
          default:
            return `-${formatCurrency(reduction.amount.absoluteWithTax)}`
        }
      }
      // ...
      </script>
      ```

  - `SFProductPromotionSelectionModal`: The free badge from the image is removed and it now displays the discount badges under product title.
  - `SFProductPromotionGifts`: Renamed to `SFBuyXGetYProducts`
  - `SFProductPromotionGiftItem`:
    - Renamed to `SFBuyXGetYProduct`
    - The usage of `SFProductPrice` has changed. Instead of creating a custom price to display free product price, the component now custom discount to display the discount or free badge.
  - `SFVariantPicker`: The Property `hidePrice` is replaced by `strikeThroughPrice`. For Buy X Get Y product, the price is now displayed with a strike through.
  - `SFProductPromotionFreeGiftBadge`: Is removed and replaced by `SFReductionBadge` which displays the reduction value based on the promotion type and value.
    - **Before:**

      ```ts
      <SFProductPromotionFreeGiftBadge
          :color-style="colorStyle"
          class="absolute left-0 top-0"
      />
      ```

    - **After:**

      ```ts
      <SFReductionBadge :promotion="promotion" />
      ```

  - `getBuyXGetYPromotionForProductDetailPage`: The utility now additionally filters out promotions that don't have variant ids. This filters out promotions with type discounted/free X.

    ```ts
    export function getBuyXGetYPromotionForProductDetailPage(
      promotions: Promotion[],
      applicablePromotions?: ApplicablePromotion[],
    ): Promotion<BuyXGetYEffect> | undefined {
      if (!promotions.length) {
        return
      }

      const buyXGetYPromotions = promotions.filter((promotion) => {
        if (!promotion) {
          return false
        }
        return (
          isBuyXGetYType(promotion) &&
          isGiftConditionMet(promotion, applicablePromotions) &&
          // Only include promotions with variant ids. These variants are shown in the `SFBuyXGetYProducts` component as Y items.
          getVariantIds(promotion)?.length > 0
        )
      })

      return buyXGetYPromotions.toSorted(
        sortPromotionsByPriority,
      )[0] as Promotion<BuyXGetYEffect>
    }
    ```

- **\[Testing\]** Introducing Artillery load testing suite for performance validation

  We've added a comprehensive load testing solution using Artillery to ensure the Storefront Application can handle expected traffic loads and maintain performance under stress conditions.

  The new testing suite includes:
  - **Load Testing**: Multi-phase load tests that simulate realistic user behavior with configurable arrival rates and scenario weights
  - **Stress Testing**: High-intensity tests to identify performance bottlenecks and breaking points
  - **Playwright Integration**: Browser-based testing scenarios that interact with the storefront like real users
  - **HTTP Testing**: Direct API endpoint testing for backend performance validation
  - **Configurable Scenarios**: Environment-based configuration for different testing phases and user behavior patterns

  The Artillery suite supports testing of key user journeys including homepage visits, product listing pages, product detail pages, basket interactions, and wishlist functionality. Test data and scenarios are easily configurable through environment variables, making it suitable for both local development and CI/CD pipeline integration.

  For more details on running tests and configuration options, check the included `testing/artillery/README.md` or the [official Artillery documentation](https://www.artillery.io/docs).

- **\[UX\]** Enhanced mobile product browsing experience by simplifying product slider navigation.
  Desktop users now have cleaner image viewing with arrow-only navigation, while mobile users see only the primary product image to reduce visual clutter and improve usability.

  This has been resolved by adding a `scrollable` prop to `SFItemsSlider` component to disable user-driven scrolling on desktop.
  Mobile users now see only the first product image by setting `multipleImages=false` on `SFProductCard`, creating a more focused browsing experience across devices.

### 💅 Minor Changes

- **[Architecture]** Updated Nuxt to version `3.19.x`.

  This release of Nuxt includes lazy hydration macros, accessibility improvements, enhanced development experience with Chrome DevTools integration, and performance optimizations. Key features include the new `defineLazyHydrationComponent` macro for better hydration control, built-in `<NuxtRouteAnnouncer>` for screen reader accessibility, and the `onWatcherCleanup` auto-import for easier memory management.

  There are no breaking changes in this release of Nuxt, so generally no changes should be necessary for existing applications. We removed the `vite.ssr.noExternals` configuration from `nuxt.config.ts` because plugin [compatibility issues](https://github.com/nuxt/nuxt/issues/32581) that were affecting certain packages during SSR have been resolved by this Nuxt release.

  More details can be found on the [Nuxt blog](https://nuxt.com/blog/v3-18)

- **\[Unit Testing\]** Enhanced test coverage across utility functions with comprehensive edge case testing and improved test organization.
  - **Enhanced test quality**: Replaced basic tests with comprehensive edge case coverage including empty inputs, special characters, and international data
  - **Better test organization**: Grouped related tests into logical describe blocks with descriptive test names
  - **Real-world scenarios**: Added tests using actual API data patterns and international address formats
  - **Error handling**: Comprehensive coverage of malformed inputs, missing data, and boundary conditions
  - **Performance validation**: Added tests for large datasets and complex sorting operations

  This update ensures all utility functions are thoroughly tested against real-world usage patterns, reducing the likelihood of production issues.

- **\[E2E\]** Added comprehensive hydration tests to ensure proper client-side rendering across all major page types for both guest and authenticated users.

  The new test suite covers Homepage, Product Listing Page (PLP), Product Detail Page (PDP), Account page, Sign-in page, Wishlist, and Basket pages. These tests monitor for hydration-related console errors and verify that pages load correctly after reload, helping to catch client-server rendering mismatches that could impact user experience.

  **Key Features:**
  - Tests both guest and logged-in user scenarios
  - Monitors console for hydration warnings and errors
  - Verifies main content visibility after page reload
  - Covers all critical user journeys

- **\[Promotions\]** Updated `SFProductPrice` to use `appliedReductions` instead of `relativeReductions` for comprehensive reduction display.

  The change ensures all reduction types are shown to customers, not just relative reductions. Formatting logic has been consolidated within the `SFProductPrice` component to handle both percentage and currency value types consistently.

- **\[Promotions\]** Improved the clarity of the basket summary by hiding promotions that have a zero-value discount.

  The `SFBasketSummaryPromotions` component now filters out promotions with a total reduction of 0 to prevent customer confusion and create a cleaner UI.

- **\[Promotions\]** Resolved issue with `SFDealBanner` not shown on basket page.

  The composable `useActiveProgressPromotions` now checks for the `promotion` attribute in the basket items to verify if the promotion is applied.
  Previously, it used the `promotionId` from the product attribute in the basket item to get the promotion.

- **\[Promotions\]** Improved performance by optimizing how promotion campaigns are fetched.
  The campaign data is now fetched once in the `SFBasketNavigationItem` component, preventing redundant API calls that previously occurred on every hover of `SFBasketPopoverItems`.
- **\[Storybook\]** Added comprehensive Storybook stories for navigation, product, and UI components to improve developer experience and component documentation.

  New stories have been created for the following components:
  - `SFCategoryNavigationSlider` - Category navigation with horizontal scrolling
  - `SFCategorySideNavigation` - Sidebar category navigation
  - `SFFilterSlideIn` - Product filtering slide-in panel
  - `SFMobileNavigation` - Mobile navigation menu
  - `SFMobileSidebar` - Mobile sidebar component
  - `SFProductCard` - Product display card
  - `SFProductGallery` - Product image gallery
  - `SFSiblingSelection` - Related product selection
  - `SFVariantPicker` - Product variant selection
  - `SFSearchResults` - Search results display

  These stories provide interactive examples and documentation for each component, making it easier for developers to understand component APIs, explore different states, and integrate them into their applications.

- **\[Tooling\]** Added [Cursor rules](https://docs.cursor.com/en/context/rules#project-rules) for Storefront Application development.

  These rules are stored under `.cursor/rules` and are organized by category. When using the [Cursor IDE](https://cursor.com/home) for development, they provide the AI context and instructions to improve the design, correctness, and style of the generated code.

  The following rules are included:
  - `accessibility.mdc` - WCAG compliance and accessibility best practices for Vue components
  - `base-components.mdc` - Base component design and implementation patterns for UI modules
  - `composables.mdc` - Vue 3 composable patterns and best practices for composable files
  - `imports.mdc` - Import patterns and @scayle/storefront-nuxt preference
  - `javascript-standards.mdc` - Modern JavaScript and TypeScript best practices
  - `middleware.mdc` - Nuxt 3 middleware implementation guidelines for middleware/server files
  - `performance.mdc` - Nuxt 3 performance optimization guidelines
  - `rpc-methods.mdc` - RPC method implementation and documentation standards for RPC/server files
  - `stories.mdc` - Instructions for creating Storybook stories
  - `tailwind-css.mdc` - Atomic CSS approach and Tailwind utility guidelines for Vue/TS files
  - `testing.mdc` - Testing standards for components, RPC methods, and accessibility for test files
  - `translations.mdc` - i18n guidelines for translation key structure and usage
  - `vue-components.mdc` - Vue 3 component guidelines with Composition API best practices

### 🩹 Patch Changes

- **\[Checkout\]** Fixed checkout initialization issue where unnecessary token refresh caused Express Checkout and Checkout to malfunction with revoked access tokens. The `useCheckoutWebComponent` now uses `getAccessToken` RPC instead of `getCheckoutToken` and properly updates the auth API instance when tokens are refreshed.
- **\[E2E\]** Improved test reliability by replacing the generic `responsiveElementIndex` with dedicated getter functions in Playwright page objects.

  This change ensures that responsive locators remain accurate across mobile and desktop views, even when elements share the same `data-testid` attribute, making tests more maintainable and less prone to flakiness.

- **\[E2E\]** Enhanced test reliability by updating the end-to-end test suite to work seamlessly with the new Checkout Authorization Web component.

  The update ensures all authentication and checkout flows continue to be properly tested, with locators and test scenarios adjusted to match the new component's structure and behavior.

- **\[E2E\]** Enhanced test coverage for basket pricing accuracy by adding a comprehensive Playwright end-to-end test that validates price calculations for regular-priced products.

  This test ensures that the basket page correctly displays subtotals and final prices without applying unexpected discounts or promotions. The test uses a new `availableRegularProduct` fixture that provides a reliable test product with no active sales or promotional pricing, ensuring consistent and predictable test results across different environments.

- **\[Search\]** Fixed a bug where search queries would use outdated search terms after updating the search input on the page.

  This issue was resolved by extracting the page number into a separate computed property to prevent unnecessary re-computations, following the same pattern already established in `[...slug]-[id].vue`.

- **\[SEO\]** Corrected the JSON-LD implementation to ensure search engines can properly parse structured data.
  By using `innerHTML` instead of the `children` attribute, the script content is no longer escaped by `unhead`, guaranteeing valid JSON output.
- **\[Tooling\]** Upgraded Prettier to v3.6.x and enabled the new experimental CLI to significantly improve code formatting performance.

  This update brings substantial speed improvements to the formatting process, making development workflows more efficient. The new experimental CLI provides better performance characteristics compared to previous versions.

  For more details, see this [in-depth blog post](https://e18e.dev/blog/prettier-speed-up).

- **\[Testing\]** Fixed unit test mocking issues in `useBasketActions` composable that were causing runtime warnings.
  - Added proper mock for `useApplyPromotions` composable to prevent actual implementation execution during tests
  - Corrected basket data structure from `{ value: null }` to proper Vue `ref(null)`
  - Implemented `beforeEach` setup for consistent test state across all test cases
- **\[UX\]** Resolved Safari layout jump in `useDropdownKeyboardBehavior` by conditionally disabling focus restoration for mouse interactions.

  The fix maintains keyboard accessibility by preserving focus restoration for keyboard users while preventing the visual jump that occurred when closing dropdowns with mouse clicks.

### 🏡 Dependency Updates

- Added dependency `contentful-cli@3.8.15`
- Removed dependency `contentful-export@7.21.77`
- Removed dependency `nuxt-swiper@1.2.2`
- Removed dependency `swiper@11.2.10`
- Removed dependency `postinstall-postinstall@2.1.0`
- Removed dependency `storyblok-generate-ts@2.2.0`
- Updated dependency `@contentful/live-preview@4.6.38` to `@contentful/live-preview@4.6.44`
- Updated dependency `@contentful/rich-text-html-renderer@17.1.0` to `@contentful/rich-text-html-renderer@17.1.3`
- Updated dependency `@nuxt/scripts@0.11.10` to `@nuxt/scripts@0.11.13`
- Updated dependency `@scayle/nuxt-image-provider@0.3.1` to `@scayle/nuxt-image-provider@0.3.2`
- Updated dependency `@scayle/nuxt-opentelemetry@0.13.13` to `@scayle/nuxt-opentelemetry@0.14.4`
- Updated dependency `@scayle/omnichannel-nuxt@4.3.2` to `@scayle/omnichannel-nuxt@4.3.3`
- Updated dependency `@scayle/storefront-basket@0.3.0` to `@scayle/storefront-basket@0.3.1`
- Updated dependency `@scayle/storefront-country-detection@2.0.1` to `@scayle/storefront-country-detection@2.0.2`
- Updated dependency `@scayle/storefront-navigation@0.3.0` to `@scayle/storefront-navigation@0.3.1`
- Updated dependency `@scayle/storefront-nuxt@8.39.0` to `@scayle/storefront-nuxt@8.44.1`
- Updated dependency `@scayle/storefront-product-detail@1.5.1` to `@scayle/storefront-product-detail@1.5.2`
- Updated dependency `@scayle/storefront-product-listing@2.0.2` to `@scayle/storefront-product-listing@2.1.1`
- Updated dependency `@scayle/storefront-promotions@2.2.2` to `@scayle/storefront-promotions@3.1.2`
- Updated dependency `@scayle/storefront-search@0.3.0` to `@scayle/storefront-search@0.3.1`
- Updated dependency `@scayle/unstorage-compression-driver@1.0.1` to `@scayle/unstorage-compression-driver@1.2.1`
- Updated dependency `@scayle/unstorage-scayle-kv-driver@1.0.3` to `@scayle/unstorage-scayle-kv-driver@2.0.4`
- Updated dependency `@storyblok/richtext@3.5.0` to `@storyblok/richtext@3.8.0`
- Updated dependency `@storyblok/vue@9.2.3` to `@storyblok/vue@9.3.1`
- Updated dependency `@vueuse/components@13.6.0` to `@vueuse/components@13.9.0`
- Updated dependency `@vueuse/core@13.6.0` to `@vueuse/core@13.9.0`
- Updated dependency `@vueuse/integrations@13.6.0` to `@vueuse/integrations@13.9.0`
- Updated dependency `@vueuse/nuxt@13.6.0` to `@vueuse/nuxt@13.9.0`
- Updated dependency `axios@1.11.0` to `axios@1.12.2`
- Updated dependency `cf-content-types-generator@2.16.0` to `cf-content-types-generator@2.16.1`
- Updated dependency `color@5.0.0` to `color@5.0.2`
- Updated dependency `contentful@11.7.15` to `contentful@11.7.19`
- Updated dependency `dompurify@3.2.6` to `dompurify@3.2.7`
- Updated dependency `storyblok-js-client@7.1.2` to `storyblok-js-client@7.1.4`
- Updated dependency `unstorage@1.16.1` to `unstorage@1.17.1`
- Updated dependency `vue@3.5.18` to `vue@3.5.21`
- Updated dependency `@changesets/cli@2.29.5` to `@changesets/cli@2.29.7`
- Updated dependency `@contentful/rich-text-types@17.1.0` to `@contentful/rich-text-types@17.2.2`
- Updated dependency `@nuxt/eslint@1.8.0` to `@nuxt/eslint@1.9.0`
- Updated dependency `@nuxt/kit@3.17.7` to `@nuxt/kit@3.19.2`
- Updated dependency `@nuxt/schema@3.17.7` to `@nuxt/schema@3.19.2`
- Updated dependency `@nuxtjs/i18n@10.0.3` to `@nuxtjs/i18n@10.1.0`
- Updated dependency `@nuxtjs/storybook@8.4.1` to `@nuxtjs/storybook@9.0.1`
- Updated dependency `@scayle/eslint-config-storefront@4.7.2` to `@scayle/eslint-config-storefront@4.7.8`
- Updated dependency `@storybook-vue/nuxt@8.4.1` to `@storybook-vue/nuxt@9.0.1`
- Updated dependency `@storybook/addon-a11y@9.0.5` to `@storybook/addon-a11y@9.1.6`
- Updated dependency `@storybook/addon-docs@9.0.5` to `@storybook/addon-docs@9.1.6`
- Updated dependency `@testing-library/jest-dom@6.6.4` to `@testing-library/jest-dom@6.8.0`
- Updated dependency `@types/node@22.17.0` to `@types/node@22.18.6`
- Updated dependency `@typescript-eslint/scope-manager@8.39.0` to `@typescript-eslint/scope-manager@8.44.0`
- Updated dependency `@typescript-eslint/utils@8.39.0` to `@typescript-eslint/utils@8.44.0`
- Updated dependency `@vue/typescript-plugin@3.0.4` to `@vue/typescript-plugin@3.0.7`
- Updated dependency `debug@4.4.1` to `debug@4.4.3`
- Updated dependency `env-cmd@10.1.0` to `env-cmd@11.0.0`
- Updated dependency `eslint@9.32.0` to `eslint@9.35.0`
- Updated dependency `eslint-plugin-storybook@9.0.5` to `eslint-plugin-storybook@9.1.6`
- Updated dependency `lint-staged@16.1.4` to `lint-staged@16.1.6`
- Updated dependency `nuxt@3.17.7` to `nuxt@3.19.2`
- Updated dependency `prettier@3.0.3` to `prettier@3.6.2`
- Updated dependency `storyblok@3.36.1` to `storyblok@4.3.2`
- Updated dependency `storybook@9.0.5` to `storybook@9.1.6`
- Updated dependency `vue-tsc@3.0.5` to `vue-tsc@3.0.7`

## 1.12.0

**Release Date:** _2025-08-06_

### 🔥 Highlights

#### 🏷️ Introducing Campaigns: A Unified Display for All Deals

We're excited to introduce Campaigns, a powerful new way to highlight offers.
To create a seamless experience for your customers, Campaigns are now fully integrated into the same UI components previously used for promotions.
This means key areas throughout the shopping journey—from product cards and price displays to banners and the basket summary—will now clearly show details from both Campaigns and Promotions.
As part of this unification, several components have been renamed to be more generic (e.g., SFPromotionRibbon is now SFDealRibbon), reflecting their new ability to display any kind of deal.

#### 🚀 Introducing Express Checkout

To significantly speed up the purchasing process, Express Checkout is now available directly on the basket page.
This powerful feature, powered by the `<scayle-express-checkout />` web component, allows all users—including guests—to complete their purchase with just a few clicks.
To support this seamless experience, we've refactored the basket summary into a single, responsive component and modernized how checkout scripts are loaded, ensuring a more robust and reliable integration.

#### 🏗️ Future-Proofing Our Nuxt Architecture

To ensure our platform remains fast, stable, and ready for future innovation, we have made significant upgrades to our core architecture.
The Storefront Application has been upgraded to a newer version of Nuxt (`v3.17.7`), bringing immediate performance and routing enhancements.
As part of this process, we've also proactively reorganized our project to align with the upcoming Nuxt 4, ensuring a smooth transition to the next generation of the framework.
Additionally, we've introduced more powerful configuration options for internationalization, allowing you to easily define your shop's routing behavior via a new environment variable.

### 🚀 Major Changes

- **\[Header & Footer\]** We've introduced scheduled visibility for navigation items directly from the SCAYLE Panel.
  The `useHeaderNavigation`, `useFooterNavigation`, `useSimpleHeaderNavigation` and `useSimpleFooterNavigation` composables now support a `visibleAt` parameter, allowing you to display or hide specific navigation links based on a set date and time.
  For more details, see the [SCAYLE Resource Center Documentation](https://scayle.dev/en/developer-guide/shops/shop-navigation#time-schedule-visibility-of-navigation-items).
- **\[Architecture\]** To prepare for future development, the project has been made compatible with Nuxt 4, and the project's directory structure has been updated accordingly.
  Developers should familiarize themselves with the [new Nuxt 4 directory structure](https://nuxt.com/docs/getting-started/upgrade#new-directory-structure) to locate files in their new locations.
- **\[Architecture\]** The Storefront Application has been upgraded to `nuxt@3.17.7`, which brings router enhancements and performance improvements.
  While this Nuxt release has no breaking changes, the update revealed two pre-existing issues in our application that have now been resolved:
  A duplicated `definePageMeta` on the Product Listing Page and a missing `inheritAttrs: false` on the `SFModal` component.
  We had been inadvertently relying on a Nuxt bug which caused attributes to not be inherited through `ClientOnly`.
  For more details on the Nuxt release, see the [official blog post](https://nuxt.com/blog/v3-17).
- **\[Architecture\]** The application's shop selector mode is now configurable via the `SHOP_SELECTOR_MODE` environment variable.
  Set this variable before building your application to define the desired routing behavior for your international shops.
  Please refer to the [documentation](https://scayle.dev/en/storefront-guide/developer-guide/features/internationalization/configuration#routing-configuration) for available modes.
- **\[Architecture\]** The custom logic for loading checkout web components has been replaced.
  We now use the official `@nuxt/scripts` module, aligning with Nuxt best practices and simplifying script management.
- **\[Basket\]** Merged `SFBasketSummaryMobile.vue` and `SFBasketSummary.vue` into a single `SFBasketSummary.vue` component.
  This eliminates duplicated code and DOM elements, and ensures that only one instance of `SFExpressCheckout.client.vue` is mounted.
  This change addresses limitations of the `<scayle-express-checkout />` web component, which requires a single instance.
- **\[Basket\]** Express Checkout is now available on the basket page.
  This feature, powered by the `<scayle-express-checkout />` web component, allows all users—including guests—to quickly proceed to checkout.
  The authentication guard (`/app/middleware/authGuard.global.ts` and `/app/pages/checkout.vue`) has been updated to permit guest access when an express checkout `transactionId` is present in the URL query parameter.
  For more details, see the [Express Checkout documentation](https://scayle.dev/en/checkout-guide/integration/express-checkout).
- **\[E2E\]** To improve the overall quality of the end-to-end test suite, significant code improvements have been applied to both test files and Page Objects, making them more robust and efficient.
  Additionally, JSDoc comments have been added to further clarify test scenarios.
- **\[Config\]** You can now enable a Shared Basket and Wishlist across your multi-language shops.
  This optional feature provides a seamless experience for users navigating between different language versions of your store.
  For implementation details, please refer to [our guide on integrating a Shared Basket](https://scayle.dev/en/checkout-guide/how-tos/how-to-integrate-a-shared-basket-for-multi-language-shop-countries) within the SCAYLE Resource Center.
- **\[Promotions\]** The following components have been enhanced to display both promotion and campaign information, such as campaign badge labels and reduction amounts:
  `SFProductPrice`, `SFBasketSummaryReductions`, `SFBasketCardImage`, and `SFProductCard`.
  Additionally, the `SFPromotionBadge` component has been renamed to the more accurate `SFDealBadge`.
- **\[Promotions\]** To provide a unified experience for all types of offers, we've integrated Campaigns into our existing promotion components.
  Components like the `SFDealRibbon`, `SFPromotionSlideIn` and `SFDealBanner` now display both promotions and campaigns, using new utility functions (`getCampaignDisplayData`, `getPromotionDisplayData`) to handle the display logic.

  To better reflect this broader purpose, several components have been renamed from `SFProductPromotionBanner` to `SFDealBanner`, `SFPromotionRibbon` to `SFDealRibbon` and `SFPromotionTimer` to `SFDealTimer`.
  - Before:

    ```html
    <SFProductPromotionBanner :promotion="promotion" show-condition />

    <SFPromotionRibbon :promotion="promotion" />
    ```

  - After:

    ```html
    <script setup lang="ts">
      import {
        getPromotionDisplayData,
        getCampaignDisplayData,
      } from '~/utils/promotion'
    </script>

    <SFDealBanner
      :display-data="getPromotionDisplayData(promotion)"
      show-condition
      track-event="select_promotion"
    />

    <SFDealRibbon
      :display-data="getCampaignDisplayData(campaign)"
      track-event="view_campaign"
    />
    ```

- **\[Translations\]** To improve the reliability and maintainability of our translation files, we have refactored the codebase to use static translation keys where possible.
  A new ESLint rule (`@intlify/vue-i18n/no-unused-keys`) has been enabled to flag unused keys as errors, ensuring our translation files remain clean and accurate.
  A few dynamic keys are intentionally ignored where necessary for code readability.

### 💅 Minor Changes

- **\[CMS\]** Addressed an issue where the `<CMSText />` component would fail if not nested within a paragraph from Contentful.
  The component now correctly checks the node type and can render standalone text content.
- **\[Code Style\]** The project's ESLint configuration has been streamlined by removing the redundant `eslint-plugin-nuxt` package.
- **\[Code Style\]** To standardize our development tooling, the local `eslint-auto-explicit-import` module has been replaced with the official `@scayle/eslint-auto-explicit-import` package.
  This ESLint module automatically adds necessary imports as you code, replacing our previous local implementation and streamlining the development process.
- **\[UI\]** To improve usability and provide a larger touch target, especially on mobile devices, the `SFCheckbox` component has been enlarged.
  The checkbox itself is now `size-6` (`24px`), and its label has been increased to `text-md` (`14px`).
- **\[UI\]** The `<SFPopover />` component has been updated to render its `content` slot only on the client side.
  This change was necessary to fix a hydration mismatch caused by using transitions with the `appear` attribute that are not safe for server-side rendering.
- **\[ShopSwitcher\]** Resolved a routing issue where the `useShopSwitcher` composable would generate an incorrect base path when switching to the default shop in `path_or_default` mode.
  It now correctly uses the `useLocalePath()` composable to ensure proper navigation.

### 🩹 Patch Changes

- **\[Code Style\]** To align with Vue best practices, explicit imports for the `defineOptions` compiler macro have been removed.
  These imports are unnecessary as Vue handles them automatically during compilation.
- **\[E2E\]** The accuracy of PLP tests has been enhanced by introducing a new `parseLocatorTextToNumber` helper function.
  This utility more reliably extracts numbers from UI elements, ensuring that assertions for the product count and card data are correct after filtering or sorting.
- **\[PLP\]** Addressed an issue where resetting filters would incorrectly remove all URL query parameters, not just those related to filtering.
  The fix ensures that only parameters prefixed with `filters` are removed, preserving the rest of the page state.
- **\[E2E\]** The end-to-end test framework has been refactored to be more modular and maintainable.
  A new abstract `Base` class now centralizes common logic for all Page Objects, and a suite of reusable helper functions has been introduced to streamline common test automation tasks like navigation and filtering.
- **\[UI\]** Resolved a layout issue in the basket popover card (`SFBasketPopoverCard`) where long product or brand names would cause the product image to shrink and the text to overflow.
  The text now truncates correctly, ensuring a consistent and clean layout, by setting `min-w-0` and `overflow-hidden` classes correctly solved both issues.
- **\[Product Listing\]** To improve consistency across all filter types, the special `aria-label` translation for the size filter has been removed.
  It now uses the same labeling pattern as other attribute filters.
- **\[E2E\]** To improve maintainability, our end-to-end tests have been simplified.
  We've removed the outdated `priceSubtotalMobile` locator and simplified the checkout navigation logic, as the UI now uses a single, responsive component.
- **\[PLP\]** Resolved a race condition where products could be loaded before their category-specific sorting configuration was applied.
  The application now correctly awaits the category data (`useCategoryById`) before fetching the product list (`getProductsByCategory`) to ensure the proper sort order is always used.
- **\[Types\]** To improve code quality and maintainability, the obsolete module declaration for the removed `shop:change` hook has been deleted.
- **\[Promotions\]** Updated dependency `@scayle/storefront-promotions` to `2.2.2`.
  This release resolves issue with promotion code not being removed from basket.

### 🏡 Dependency Updates

- Added dependency `@nuxt/scripts@0.11.10`
- Added dependency `@scayle/changelog-formatter@1.1.0`
- Added dependency `@scayle/eslint-auto-explicit-import@0.2.0`
- Added dependency `eslint-plugin-playwright@2.2.2`
- Added dependency `license-checker-rseidelsohn@4.4.2`
- Removed dependency `dotenv@16.6.1`
- Removed dependency `eslint-plugin-nuxt@4.0.0`
- Removed dependency `license-checker@25.0.1`
- Updated dependency `@contentful/live-preview@4.6.27` to `@contentful/live-preview@4.6.38`
- Updated dependency `@contentful/rich-text-html-renderer@17.0.1` to `@contentful/rich-text-html-renderer@17.1.0`
- Updated dependency `@scayle/nuxt-opentelemetry@0.13.10` to `@scayle/nuxt-opentelemetry@0.13.13`
- Updated dependency `@scayle/storefront-country-detection@2.0.0` to `@scayle/storefront-country-detection@2.0.1`
- Updated dependency `@scayle/storefront-nuxt@8.33.2` to `@scayle/storefront-nuxt@8.39.0`
- Updated dependency `@scayle/storefront-product-detail@1.5.0` to `@scayle/storefront-product-detail@1.5.1`
- Updated dependency `@scayle/storefront-product-listing@2.0.0` to `@scayle/storefront-product-listing@2.0.2`
- Updated dependency `@scayle/storefront-promotions@2.2.0` to `@scayle/storefront-promotions@2.2.2`
- Updated dependency `@scayle/unstorage-compression-driver@1.0.0` to `@scayle/unstorage-compression-driver@1.0.1`
- Updated dependency `@scayle/unstorage-scayle-kv-driver@1.0.2` to `@scayle/unstorage-scayle-kv-driver@1.0.3`
- Updated dependency `@storyblok/nuxt@7.1.3` to `@storyblok/nuxt@7.2.0`
- Updated dependency `@storyblok/richtext@3.4.0` to `@storyblok/richtext@3.5.0`
- Updated dependency `@storyblok/vue@9.1.2` to `@storyblok/vue@9.2.3`
- Updated dependency `@vueuse/components@13.5.0` to `@vueuse/components@13.6.0`
- Updated dependency `@vueuse/core@13.5.0` to `@vueuse/core@13.6.0`
- Updated dependency `@vueuse/integrations@13.5.0` to `@vueuse/integrations@13.6.0`
- Updated dependency `@vueuse/nuxt@13.5.0` to `@vueuse/nuxt@13.6.0`
- Updated dependency `axios@1.10.0` to `axios@1.11.0`
- Updated dependency `contentful@11.7.6` to `contentful@11.7.15`
- Updated dependency `contentful-export@7.21.64` to `contentful-export@7.21.77`
- Updated dependency `storyblok-js-client@7.0.2` to `storyblok-js-client@7.1.2`
- Updated dependency `unstorage@1.16.0` to `unstorage@1.16.1`
- Updated dependency `vue@3.5.17` to `vue@3.5.18`
- Updated dependency `@contentful/rich-text-types@17.0.1` to `@contentful/rich-text-types@17.1.0`
- Updated dependency `@intlify/eslint-plugin-vue-i18n@4.0.1` to `@intlify/eslint-plugin-vue-i18n@4.1.0`
- Updated dependency `@nuxt/eslint@1.4.1` to `@nuxt/eslint@1.8.0`
- Updated dependency `@nuxt/image@1.10.0` to `@nuxt/image@1.11.0`
- Updated dependency `@nuxt/kit@3.16.2` to `@nuxt/kit@3.17.7`
- Updated dependency `@nuxt/schema@3.16.2` to `@nuxt/schema@3.17.7`
- Updated dependency `@nuxtjs/i18n@9.5.6` to `@nuxtjs/i18n@10.0.3`
- Updated dependency `@scayle/eslint-config-storefront@4.5.12` to `@scayle/eslint-config-storefront@4.7.2`
- Updated dependency `@testing-library/jest-dom@6.6.3` to `@testing-library/jest-dom@6.6.4`
- Updated dependency `@types/node@22.16.2` to `@types/node@22.17.0`
- Updated dependency `@typescript-eslint/scope-manager@8.36.0` to `@typescript-eslint/scope-manager@8.39.0`
- Updated dependency `@typescript-eslint/utils@8.36.0` to `@typescript-eslint/utils@8.39.0`
- Updated dependency `@upstash/redis@1.35.1` to `@upstash/redis@1.35.3`
- Updated dependency `@vue/typescript-plugin@3.0.1` to `@vue/typescript-plugin@3.0.4`
- Updated dependency `eslint@9.30.1` to `eslint@9.32.0`
- Updated dependency `eslint-plugin-storybook@0.12.0` to `eslint-plugin-storybook@9.0.5`
- Updated dependency `eslint-plugin-tailwindcss@3.18.0` to `eslint-plugin-tailwindcss@3.18.2`
- Updated dependency `jiti@2.4.2` to `jiti@2.5.1`
- Updated dependency `lint-staged@16.1.2` to `lint-staged@16.1.4`
- Updated dependency `nuxt@3.16.2` to `nuxt@3.17.7`
- Updated dependency `nuxt-svgo@4.2.3` to `nuxt-svgo@4.2.6`
- Updated dependency `typescript@5.8.3` to `typescript@5.9.2`
- Updated dependency `unimport@5.1.0` to `unimport@5.2.0`
- Updated dependency `vue-tsc@3.0.1` to `vue-tsc@3.0.5`

## 1.11.0

### 🔥 Highlights

#### ✨ Smarter Product Discovery and a Modern Mobile Sorting Experience

Finding the right products is now faster and more intuitive than ever.
We've completely overhauled the Product Listing Page by automatically hiding empty categories for a cleaner navigation experience and introducing a powerful new sorting mechanism, including custom and smart sorting.
For mobile users, we've replaced the cumbersome sorting dropdown with a sleek and user-friendly slider, making it significantly easier to reorder products on the go.

#### 🏷️ Drive Conversion with "Recently Viewed" and In-Basket Promo Codes

We're introducing two powerful new features designed to enhance the customer journey and increase conversion.
A "Recently Viewed Products" slider now appears on the Product Detail Page, making it easy for shoppers to revisit items they're interested in.
Furthermore, customers can now apply promotion codes directly in the shopping basket to see their final, discounted price before even starting the checkout process, reducing friction and cart abandonment.

#### 🎨 A More Consistent and Scalable Storefront with Storybook and a Unified Design System

To ensure the highest quality and consistency across every part of your storefront, we've introduced Storybook, a professional-grade component library that documents our UI elements in isolation.
Alongside this, we have performed a comprehensive overhaul of our entire design system, unifying our approach to colors, spacing, fonts, and responsive breakpoints.
This foundational upgrade results in a more polished, professional, and visually consistent shopping experience that is easier to scale and maintain.

### 🚀 Major Changes

- **\[Architecture\]** To improve performance and dependency management, we have migrated from Yarn v1 to PNPM.
  This results in faster installation times and more efficient use of disk space due to PNPM's unique approach to handling `node_modules`.
  Instead of running command via `yarn some:command`, they will now be executed via `pnpm some:command`, e.g. `pnpm install` or `pnpm dev`.

  For more details on how to use PNPM and its extended features, check the [official PNPM documentation](https://pnpm.io/motivation).

- **\[Architecture\]** Introduced Storybook for UI component development and documentation.
  Storybook is an open-source tool for building and documenting UI components in isolation. It allows developers and designers to visually develop, test, and review components outside the main application, improving design consistency and development speed.
  In this project, Storybook has been integrated as a development dependency, configured specifically for Nuxt 3 and our component architecture.
  It serves as a living component library and a central place to showcase UI patterns, aiding both internal teams and external stakeholders in understanding and reusing shared components.
  Initial example stories have been added for key UI components to demonstrate usage and recommended best practices.
  - To run Storybook locally:

    ```bash
    pnpm storybook
    ```

    This starts a development server at [http://localhost:6006](http://localhost:6006).

  - To generate a static Storybook build, use:

    ```bash
    pnpm storybook:build
    ```

    The output will be placed in the `public/storybook` directory and can be accessed at [http://localhost:3000/storybook](http://localhost:3000/storybook).

  - Further information can be found in the official [Storybook documentation](https://storybook.js.org/docs/vue/get-started/introduction) and the [Nuxt Storybook guide](https://storybook.nuxtjs.org/getting-started/setup).
  - The following components are now available within Storybook:
    - Order
      - `SFOrderList`
    - Product
      - `SFProductCard`
      - `SFProductPromotionBanner`
    - Base Components
      - `SFAccordionEntry`
      - `SFButton`
      - `SFChip`
      - `SFCountdown`
      - `SFModal`
      - `SFPopover`
      - `SFSkeletonLoader`
      - `SFSliderIn`
      - `SFSliderArrowButton`
      - `SFCheckbox`
      - `SFDropdown`
      - `SFFilterRangeSlider`
      - `SFPriceInput`
      - `SFSwitch`
      - `SFTextInput`
      - `SFValidatedInputGroup`
      - `SFHeadline`
      - `SFGoBackLink`
      - `SFLink`
      - `SFPagination`
      - `SFItemsSlider`
      - `SFToast`
      - `SFToastContainer`
    - Base Components / Transitions
      - `SFSlideInFromBottomTransition`
      - `SFSlideInFromLeftTransition`
      - `SFFadeInFromBottomTransition`
      - `SFFadeInTransition`

- **\[Architecture\]** Refactored `useAuthentication` to longer be tied to a specific authentication action.
  This simplifies the usage of the composable and prevents possible unexpected behavior if there is a mismatch between the authentication string passed to the composable and the authentication method which is called.
  - **Before**

    ```ts
    const { login, logout } = useAuthentication('login')

    login({ username, password }) // 'login' success or error message and 'login' event tracked
    logout() // 'login' success or error message and 'login' event tracked
    ```

  - **After**

    ```ts
    const { login, logout } = useAuthentication()

    login({ username, password }) // 'login' success message shown and 'login' event tracked
    logout() // 'logout' success or error message and 'logout' event tracked
    ```

- **\[Performance\]** Updated `routeRules` in `nuxt.config.ts` to disable internal Redis page caching.
  The Storefront Application now relies solely on `Cache-Control` headers which can be handled efficiently by external CDNs like Cloudflare.

  ```ts
  // Before
  const CACHE_PAGE: NitroRouteConfig = isVercel
    ? {
        isr: false,
        cache: {
          maxAge: 10 * 60, // Default: 10min
          staleMaxAge: 10 * 60, // Default: 10min
          headersOnly: true,
        },
      }
    : {
        cache: {
          // SWR currently leads to some bugs in the Nitro caching implementation that it will continue to serve outdated data in case the SSR handler crashes
          // We recommend to keep this disabled currently.
          swr: false, // Disable stale-while-revalidate
          maxAge: 10 * 60, // Default: 10min
          staleMaxAge: 10 * 60, // Default: 10min
          group: 'ssr', // Cache group name
          name: 'page', // Set prefix name

          // Consider the host for the cache key which is required when using domain based shops
          varies: ['host', 'x-forwarded-host'],

          // Add the version as an integrity so we clear our cache when a new version gets deployed.
          // If no specific version is supplied, we will generate a unique ID during the build process.
          integrity: process.env.VERSION ?? nanoid(8),

          // Use storefront storage mount
          // Depending on your configuration this might be `redis` or another database driver
          // https://scayle.dev/en/storefront-guide/developer-guide/basic-setup/introduction#storage
          base: 'storefront-cache',
        },
      }
  ```

  ```ts
  // After
  const CACHE_PAGE: NitroRouteConfig = {
    isr: false,
    cache: {
      maxAge: 10 * 60, // Default: 10min
      swr: false,
      headersOnly: true,
    },
  }
  ```

- **\[PDP\]** A new "Recently Viewed Products" recommendation slider has been added to the Product Detail Page, allowing customers to easily navigate back to products they have previously viewed.
- **\[PLP\]** The category fetching logic has been updated to exclude categories that contain no products.
  This change automatically removes them from the PLP side navigation for a cleaner interface.

  ```ts
  // /pages/c.vue

  const { data: rootCategories, status } = useCategoryTree(
    {
      params: {
        children: 5,
        properties: { withName: ['sale'] },
      },
    },
    'category-navigation-tree',
  )

  // was changed to

  const { data: rootCategories, status } = useCategoryTree(
    {
      params: {
        children: 5,
        properties: { withName: ['sale'] },
        hideEmptyCategories: true,
      },
    },
    'category-navigation-tree',
  )
  ```

- **\[PLP\]** To improve performance and create a single source of truth, the product listing logic has been refactored as part of the upgrade to `@scayle/storefront-product-listing@2.0.0`.
  - **Sorting Logic:** The `useProductListSort` composable is now centralized at the page level to act as a single source of truth.
  - **SEO Data:** The `useProductListingSeoData` composable now requires an additional isDefaultSortSelected boolean parameter.
  - **UI Labels:** The `label` for the selected sort option is now a direct string and should no longer be passed through the translation function (`$t(label)`).
- **\[PLP\]** Implemented a smart and custom sorting mechanism for the `top_seller` sorting option (commonly referred to as "Recommendations").
  If there are no sorting keys defined for a specific category, the `top_seller` sorting option will default to its original behavior.
  Here's the main logic for implementing smart and custom sorting keys:

  ```ts
  import {
    defaultSortingOptions,
    DEFAULT_SORTING_KEY,
    useProductListSort,
  } from '#storefront-product-listing'

  const sortingOptions = computed(() => {
    const smartSortingKey =
      currentCategory.value?.productSorting?.smartSortingKey
    const customSortingKey =
      currentCategory.value?.productSorting?.customSortingKey

    if (!smartSortingKey && !customSortingKey) {
      return defaultSortingOptions
    }
    return defaultSortingOptions.map((option) => {
      const sortingKey = [smartSortingKey, customSortingKey].filter(
        (item): item is string => !!item,
      )
      return option.key === DEFAULT_SORTING_KEY
        ? { ...option, sortingKey }
        : option
    })
  })

  const { selectedSort } = useProductListSort(route, {
    sortingOptions: sortingOptions.value,
  })
  ```

- **\[PLP\]** To enhance mobile usability, the new `SFMobileSortSelection.vue` component has been introduced.
  It implements a slider-and-chip interface and replaces the former dropdown-based sorting logic within SFFilterSlideInContent.vue.
  The previous dropdown implementation for sort selection on mobile devices was not optimal for touch interactions and required multiple taps to change sort options.
  The new slider interface with chips provides better touch targets for mobile users, offers immediate visual feedback and reduces the number of interactions needed to change sort order.
- **\[Promotions\]** Users can now apply and remove promotion codes directly in the shopping basket.
  A new `SFBasketPromotionCodes.vue` component has been added, allowing customers to see their discounts applied without having to proceed to the checkout page first.
  This replaces the current disclaimer on the basket page with a new `SFBasketPromotionCodes.vue` component.
  This component builds on the latest enhancements to `@scayle/storefront-promotions@2.2.0` and enables users to add and remove promotion codes without necessitating entering checkout first.
- **\[UI\]** To simplify responsive design and improve maintainability, the application's breakpoints have been streamlined.
  The `2xl` breakpoint has been removed to focus on a more essential set of screen sizes.
  Developers should now target the `xl` breakpoint as the largest available size for any screen-specific styling.
  - Available Breakpoints:

    ```ts
    // config/ui.ts
    export const BREAKPOINTS = {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    }
    ```

- **\[UI\]** The Tailwind CSS configuration has been simplified by removing custom `z-index` values (from `60` to `110`).
  We now rely on Tailwind's default `z-index` scale, leading to a cleaner and more maintainable styling implementation.
- **\[UI\]** Enhanced Tailwind configuration for `spacing` and `sizes`.
  Configuration is refined for `width`, `minWidth`, `maxWidth`, `height`, `minHeight`, `maxHeight`, `spacing`, and `padding`.
  These updates ensure a consistent and scalable design system.
  - Key changes:
    - The `spacing` scale now serves as the foundation for multiple core plugins, including margin, gap, inset, space, translate, scrollMargin, and scrollPadding.
    - To maintain uniformity, all values are centralized within the `spacing` property, which incorporates `defaultSizes` defined at the top of the Tailwind config file.
    - Additionally, `spacing` and other sizing values (`maxHeight` and `maxWidth`) are extended within the `theme.extend` property, leveraging the [default Tailwind spacing scale](https://v3.tailwindcss.com/docs/customizing-spacing#default-spacing-scale).
  - Updated configuration:

    ```ts
    // tailwind.config.ts
    const defaultSizes = {
      '6xs': '2rem',
      '5xs': '4rem',
      '4xs': '8rem',
      '3xs': '12rem',
      '2xs': '16rem',
      xs: '20rem',
      md: '28rem',
      lg: '32rem',
      xl: '36rem',
      '2xl': '40rem',
      '3xl': '48rem',
    }

    export default {
      theme: {
        extend: {
          maxHeight: {
            dialog: '94vh',
          },
          maxWidth: {
            screen: '100vw',
            dialog: '94vw',
          },
          spacing: {
            ...defaultSizes,
            '4.5': '1.125rem',
            11: '2.625rem',
            13: '3.25rem',
            15: '3.75rem',
            22: '5.5rem',
            26: '6.5rem',
          },
        },
      },
    }
    ```

- **\[UI\]** Streamlined the Tailwind font weight configuration for a cleaner and more consistent design.
  - Updated font weight setup:

    ```ts
    {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    }
    ```

- **\[UI\]** Enhanced and simplified Tailwind configuration for `font-sizes` and `line heights`.
  - Key changes:
    - The font size scale has been refined for better usability and consistency.
      The following font sizes have been removed: `3xs`, `2xs`, `base`, `4xl`, `5xl`, `6xl`, `7xl`.
    - **New Progression:** The font size scale now aligns closely with Tailwind's default numerical progression.
      - `3xs` and `2xs` are replaced with `xs`.
      - `base` is replaced with `md`.
    - Line heights have also been streamlined:
      - The `2.5` and `3.5` values has been removed.
      - The configuration retains Tailwind's default line heights, ensuring compatibility across the application.
  - Updated configuration:

    ```ts
    // tailwind.config.ts
    export default {
      theme: {
        fontSize: {
          xs: [
            '0.625rem', // 10px
            {
              lineHeight: '0.875rem',
              letterSpacing: '0.09px',
            },
          ],
          sm: [
            '0.75rem', // 12px
            {
              lineHeight: '1rem',
              letterSpacing: '-0.13px',
            },
          ],
          md: [
            '0.875rem', // 14px
            {
              lineHeight: '1.125rem',
              letterSpacing: '-0.14px',
            },
          ],
          lg: [
            '1rem', // 16px
            {
              lineHeight: '1.25rem',
              letterSpacing: '-0.32px',
            },
          ],
          xl: [
            '1.125rem', // 18px
            {
              lineHeight: '1.375rem',
              letterSpacing: '0',
            },
          ],
          '2xl': [
            '1.25rem', // 20px
            {
              lineHeight: '1.75rem',
              letterSpacing: '-0.4px',
            },
          ],
          '3xl': [
            '1.75rem', // 28px
            {
              lineHeight: '2rem',
              letterSpacing: '-0.5px',
            },
          ],
        },
      },
    }
    ```

  These updates make the configuration more intuitive, future-proof, and adaptable
  to evolving design needs. By aligning with Tailwind's default progression,
  the setup ensures consistency while maintaining flexibility for creative designs.

- **\[UI\]** Enhanced Tailwind configuration for `outline`, `outline-offset`, `border-width`, and `border-radius`.
  - Key changes include:
    - Simplified `outline` and `outline-offset` configuration by removing redundant values.
    - Removed custom [border-radius](https://v3.tailwindcss.com/docs/border-radius) and [border-width](https://v3.tailwindcss.com/docs/border-width) values to align with Tailwind's default values for consistency and maintainability.
  - Updated configuration for outline values:

    ```ts
    // tailwind.config.ts
    export default {
      theme: {
        extend: {
          outlineWidth: {
            0: '0',
            1: '1px',
            2: '2px',
            3: '3px',
          },
          outlineOffset: {
            0: '0',
            1: '1px',
            2: '2px',
            4: '4px',
            5: '5px',
          },
        },
      },
    }
    ```

- **\[UI\]** Streamlined the Tailwind aspect ratio configuration.
  - Updated aspect ratio setup:

    ```ts
    // tailwind.config.ts
    {
      '3/4': '3 / 4',
      '9/4': '9 / 4',
      square: '1/1',
    }
    ```

- **\[UI\]** The color palette has been streamlined and unified
  within the Tailwind configuration for improved consistency and simplicity.
  The most notable refinements are in the `gray` and `secondary` color variants,
  which have been thoughtfully reduced to enhance usability and clarity.
  New gray and secondary color definitions are as follows:

  ```ts
  {
    gray: {
      100: '#fafafa',
      200: '#f2f2f2',
      300: '#ebebeb',
      400: '#d9d9d9',
      500: '#a8a8a8',
    },
    secondary: '#666666',
  }
  ```

  Furthermore, `white-smoke`, `focus`, and `primary-400` colors has been removed,
  replacing them with carefully selected alternatives that align with the updated design system.

- **\[UI\]** Enhanced and simplified Tailwind configuration for `box-shadows`.
  - Extracted CSS variables within `main.css`:

    ```css
    @layer base {
      :root {
        --color-shadow-navy: 25 49 70;
        --color-shadow-gray: 204 204 204;
        --color-shadow-white-smoke: 0, 0, 0, 0.1;
      }
    }
    ```

  - Tailwind configuration:

    ```ts
    // tailwind.config.ts
    export default {
      theme: {
        boxShadow: {
          none: 'none',
          DEFAULT:
            '0 4px 6px -1px rgba(var(--color-shadow-white-smoke)), 0 2px 4px -2px rgba(var(--color-shadow-white-smoke))',
          'inner-solid': 'inset 0 0 0 4px rgb(var(--color-shadow-navy))',
          'inner-solid-sm': 'inset 0 0 0 2px rgb(var(--color-shadow-navy))',
          'outer-solid': '0 0 0 3px rgb(var(--color-shadow-navy))',
          'input-label':
            'inset 0 2px 8px -10px rgb(var(--color-shadow-gray)), inset 0 2px 8px -10px rgb(var(--color-shadow-gray))',
        },
      },
    }
    ```

- **\[Unit Testing\]** To standardize test data generation, our unit tests now use the official order factories provided by the `@scayle/storefront-nuxt` package, replacing our previous custom implementations.
  This change simplifies our test setup and improves maintainability.

### 💅 Minor Changes

- **\[Architecture\]** Addressed an issue where `$config.public.baseUrl` provided an incorrect base URL for domain-based shops.
  This deprecated property has been removed, and we now use `useRequestURL().origin` to reliably get the correct base URL.
- **\[PLP\]** The range filter functionality has been enhanced to support filtering by both price and discount percentage.
  To reflect this broader use case, `SFPriceRangeSlider.vue` and `SFPriceInput.vue` have been renamed to the more generic `SFFilterRangeSlider.vue` and `SFRangeInput.vue`.
  This refactoring was done as part of adding support for discount filters (e.g., `max_savings_percentage`) in the filter slide-in.
- **\[UI\]** Improved aspect ratio configuration for `SFProductImage.vue`
  The product image aspect ratio is now defined in a single source of truth: `config/ui.ts`.
  There's no longer a need to apply additional styling on the parent element to achieve the desired aspect ratio.
  This change enhances maintainability and makes it easier to adjust the aspect ratio in the future.
  - Before:

    ```vue
    <div
      class="aspect-3/4"
    > <!-- Before we had to apply aspect ratio on the parent element even though the image was already in the correct aspect ratio -->
        <SFProductImage
          :image="image"
          :image-loading="imageLoading"
          :alt="alt"
          :preload="preload"
          :aspect-ratio="[3, 4]"
          sizes="xs:50vw sm:50vw md:40vw lg:33vw xl:320px"
        />
      </div>
    ```

  - After:

    ```vue
    <template>
      <div>
        <SFProductImage
          :image="image"
          :image-loading="imageLoading"
          :alt="alt"
          :preload="preload"
          :aspect-ratio="PRODUCT_IMAGE_ASPECT_RATIO" <!-- Setting the aspect ratio directly on the image is now sufficient. -->
          sizes="xs:50vw sm:50vw md:40vw lg:33vw xl:320px"
        />
      </div>
    </template>

    <script setup lang="ts">
    import { PRODUCT_IMAGE_ASPECT_RATIO } from '~/config/ui'
    // Additionally we have a single configuration to configure the aspect ratio for all product images.
    </script>
    ```

- **\[E2E\]** Expanded end-to-end test coverage for the Wishlist page.
  A new test in `e2e-Wishlist.spec.ts` now verifies that clicking a product card correctly navigates the user to the corresponding Product Detail Page.
- **\[E2E\]** Aligned the PLP sorting test with recent mobile UI enhancements.
  The test logic has been updated to use the new sorting slider with chips instead of the previous dropdown, ensuring our tests accurately reflect the current user experience.
- **\[E2E\]** Aligned the mobile sorting test with recent UI enhancements.
  The test locator in `playwright/page-objects/components/sorting.ts` has been updated to reflect the new design where all sort options are visible simultaneously, ensuring accurate validation of the user experience.
- **\[UI\]** Streamlined and polished the UI module components by removing outdated and redundant props:
  - `SFModal.client`: Simplified by removing the `closeOnOutside` property.
  - `SFPopover`: Decluttered with the removal of `disablePopoverContent` and `contentWrapperClass` properties.
  - `SFSlideIn.client`: Transitioned to a single `default` slide type (X-axis) by removing the `slideType` property.
  - `SFDropdown`: Refined by eliminating the `isLarge` property.
  - `SFSwitch`: Lightened up with the removal of `name` and `required` properties.
  - `SFTextInput`: Enhanced by dropping the `hint` and `mask` properties.
  - `SFLink`: Unified `active` and `exactActive` classes, saying goodbye to `onlyExactActive`.
  - `SFItemsSlider`: Simplified by removing `container` and `sliderClass` properties.
  - `SFModal`: Removed the `hideCloseButton` prop, which was no longer in use.
  - `SFItemsSlider`: Removed the `scrollable` prop, which was no longer in use.
- **\[UI\]** As part of a code quality improvement, the `SFHeadlineBadge` component was refactored.
  Its logic has been inlined into the `SFHeadline` badge slot, removing an unnecessary component.
- **\[UI\]** To standardize the styling of promotional elements, a dedicated `promotion` color has been added to the Tailwind color palette.
  This provides a consistent, themeable fallback color for all promotional banners and labels.
- **\[UI\]** Removed `SFProgressBar` as it is not used.
- **\[UI\]** The `SFHeadline` component has been refactored.
  The `loading` prop and its associated skeleton loader are no longer part of the component;
  developers are now responsible for handling the loading state externally (e.g., with a wrapper component).
  The `hidden` prop and the custom `visually-hidden` class have also been removed to streamline the component's API.

### 🩹 Patch Changes

- **\[Accessibility\]** To ensure all text is easily readable and meets accessibility standards, the extra-small (`xs`) font size option has been removed.
  The smallest available font size is now `12px`, guaranteeing a more legible experience for all users.
- **\[Accessibility\]** Streamlined keyboard navigation within product sliders (`SFBaseProductSlider`).
  The arrow buttons are no longer focusable, allowing users to tab directly between products more efficiently.
  Additionally, the focus indicator on products is now always fully visible.
- **\[Accessibility\]** Addressed an issue where focus would incorrectly return to a `SFHeaderNavigationItem` after a `mouseleave` event and subsequent page navigation
  The fix involves deactivating the focus trap without returning focus (`returnFocus: false`) when the interaction is mouse-driven, preventing the unwanted focus jump.
- **\[Account\]** Improved the behavior of the "Forgot Password" form.
  Submitting the form by pressing the Enter key now correctly validates the input instead of unexpectedly closing the modal.
  This was resolved by explicitly setting the non-submit button's type to button, ensuring the correct button is triggered on form submission.
- **\[Account\]** Improved the user experience in the "Forgot Password" modal by ensuring that old error messages are cleared when the modal is closed. Users will no longer see a stale error message when reopening the form.
  The `errorMessage` is now correctly reset to `null` when the modal is dismissed.
- **\[Account\]** Improved the clarity of the error message shown when a non-existent email is entered in the "Forgot Password" and "Reset Password" forms.
  The message now correctly refers only to the email address, removing a confusing mention of the password.
- **\[Architecture\]** To prevent hydration errors related to URL query parameters, Incremental Static Regeneration (ISR) has been disabled for all Vercel deployments.
  This change is a necessary workaround for a known issue where query params were not correctly handled during server-side rendering with ISR.
  More details are available in [this Nitro issue](https://github.com/nitrojs/nitro/issues/1880).
- **\[Images\]** To improve visual consistency in the basket popover, the alignment of product images has been fixed.
  Images will now appear correctly aligned regardless of their original aspect ratio.
- **\[Login & Registration\]** Refactored the error handling strategy in the useAuthentication composable.
  Authentication methods (`login`, `guestLogin`, `logout`, `register`, `forgotPassword`, `resetPasswordByHash`) now throw exceptions instead of internally caching them.
  This creates a more predictable and standard error handling pattern, requiring consuming components to handle failures explicitly.
- **\[PDP\]** Fixed issue where controls of the `<SFProductGallery />` were not usable after the `<SFProductGalleryZoom />` was opened. Adding `z-index: 10` ensures the controls can always be clicked.
- **\[Performance\]** Fixed a bug where navigating between product detail pages caused multiple executions of `redirectProductIfNecessary`, potentially creating a redirect loop.
  The function now checks if the product status is `pending` before executing, ensuring it only runs once per navigation.
- **\[Promotions\]** Resolved an issue where the promotion badge was displayed in the `SFBasketCardImage` component even if the promotion was not applied anymore.
  The promotion badge is now displayed if the promotion exists and is valid.
- **\[SEO\]** Addressed an issue where hreflang links were missing for PLPs and PDPs during server-side rendering.
  The data required to check product/category availability in other shops (`useAllShopCategoriesForId`, `useAllShopProductsForId`) was not yet available when the links were being generated.
  The application now awaits these data-fetching functions, guaranteeing the availability data is present and allowing `hreflang` links to be generated reliably.
- **\[Search\]** To prevent text overflow in smaller containers, the `SFShowAllResultsLink.vue` component now truncates its label.
  This change ensures a clean and consistent UI layout.
- **\[Subscriptions\]** Addressed a bug where subscription attribute values were not displaying correctly on the Order Detail and Order Success pages.
  The `SFOrderDetailProductSubscription` component has been corrected to ensure this information is always shown accurately.
- **\[UI\]** Resolved an issue where the promotion count in the `SFPromotionSlideIn` and filter count in the `SFFilterGroup` were not aligned properly.
  There is now a new `SFBadge` UI component that can be used to display a badge with a count. This will align the styling of the badge within the Storefront Application.
- **\[UI\]** Added `supports-hover` condition to `SFButton` hover transparency so the style will only be applied on devices which support hover.
- **\[UI\]** To improve code quality and reduce dependency bloat, the unused `mask` package has been removed from the project's dependencies.
- **\[UI\]** To standardize the appearance of all product sliders, the `SFProductRecommendations` and `SFRecentlyViewedProductsSlider` components have been updated to use the shared `SFSliderArrowButton`.
- **\[UI\]** To improve usability, the mobile sorting selection (`SFMobileSortSelection.vue`) now displays all available options at once.
  This eliminates the need for scrolling and makes it easier for users to see the currently active sort order.
- **\[UI\]** Addressed a visual bug in `SFSiblingSelection.vue` that caused image corners to overflow their container.
  The component's styling has been updated to hide overflow, ensuring a clean and contained appearance.
- **\[UI\]** Addressed an issue where using margins to position the `SFPopover.vue` content created a gap that would cause the hover state to flicker.
  The component now uses transparent borders instead, which closes the gap and provides a stable hover experience.
- **\[UI\]** Addressed a positioning bug where the flyout in `SFHeaderNavigationItem` would appear in the wrong place.
  The issue, caused by dynamic `translateX` positioning, has been resolved by anchoring the flyout's position relative to the main header.
- **\[UX\]** Improved the user experience in the `SFStoreLocatorSlideIn` component.
  Users can now trigger a search by pressing the Enter key in the text input, thanks to the input being properly wrapped in a `<form>`element.

### 🏡 Dependency Updates

- Added dependency `@nuxt/kit@3.16.2`
- Added dependency `@nuxt/schema@3.16.2`
- Added dependency `@nuxtjs/storybook@8.4.1`
- Added dependency `@storybook-vue/nuxt@8.4.1`
- Added dependency `@storybook/addon-a11y@9.0.5`
- Added dependency `@storybook/addon-docs@9.0.5`
- Added dependency `eslint-plugin-storybook@0.12.0`
- Added dependency `storybook@9.0.5`
- Removed dependency `global@4.4.0`
- Removed dependency `maska@3.1.1`
- Removed dependency `patch-package@8.0.0`
- Updated dependency `@contentful/live-preview@4.6.20` to `@contentful/live-preview@4.6.27`
- Updated dependency `@contentful/rich-text-html-renderer@17.0.0` to `@contentful/rich-text-html-renderer@17.0.1`
- Updated dependency `@scayle/nuxt-opentelemetry@0.13.7` to `@scayle/nuxt-opentelemetry@0.13.10`
- Updated dependency `@scayle/storefront-nuxt@8.28.6` to `@scayle/storefront-nuxt@8.33.2`
- Updated dependency `@scayle/storefront-product-detail@1.4.2` to `@scayle/storefront-product-detail@1.5.0`
- Updated dependency `@scayle/storefront-product-listing@1.6.2` to `@scayle/storefront-product-listing@2.0.0`
- Updated dependency `@scayle/unstorage-scayle-kv-driver@1.0.0` to `@scayle/unstorage-scayle-kv-driver@1.0.2`
- Updated dependency `@storyblok/nuxt@7.0.1` to `@storyblok/nuxt@7.1.3`
- Updated dependency `@storyblok/richtext@3.3.0` to `@storyblok/richtext@3.4.0`
- Updated dependency `@storyblok/vue@9.0.0` to `@storyblok/vue@9.1.2`
- Updated dependency `@vueuse/components@13.3.0` to `@vueuse/components@13.5.0`
- Updated dependency `@vueuse/core@13.3.0` to `@vueuse/core@13.5.0`
- Updated dependency `@vueuse/integrations@13.3.0` to `@vueuse/integrations@13.5.0`
- Updated dependency `@vueuse/nuxt@13.3.0` to `@vueuse/nuxt@13.5.0`
- Updated dependency `axios@1.9.0` to `axios@1.10.0`
- Updated dependency `contentful@11.7.0` to `contentful@11.7.6`
- Updated dependency `contentful-export@7.21.57` to `contentful-export@7.21.64`
- Updated dependency `dotenv@16.5.0` to `dotenv@16.6.1`
- Updated dependency `storyblok-js-client@7.0.0` to `storyblok-js-client@7.0.2`
- Updated dependency `swiper@11.2.8` to `swiper@11.2.10`
- Updated dependency `vue@3.5.16` to `vue@3.5.17`
- Updated dependency `@changesets/cli@2.29.4` to `@changesets/cli@2.29.5`
- Updated dependency `@contentful/rich-text-types@17.0.0` to `@contentful/rich-text-types@17.0.1`
- Updated dependency `@nuxt/test-utils@3.18.0` to `@nuxt/test-utils@3.19.2`
- Updated dependency `@nuxtjs/i18n@9.5.5` to `@nuxtjs/i18n@9.5.6`
- Updated dependency `@scayle/eslint-config-storefront@4.5.4` to `@scayle/eslint-config-storefront@4.5.12`
- Updated dependency `@types/node@22.15.30` to `@types/node@22.16.2`
- Updated dependency `@typescript-eslint/scope-manager@8.33.1` to `@typescript-eslint/scope-manager@8.36.0`
- Updated dependency `@typescript-eslint/utils@8.33.1` to `@typescript-eslint/utils@8.36.0`
- Updated dependency `@upstash/redis@1.35.0` to `@upstash/redis@1.35.1`
- Updated dependency `@vitest/coverage-v8@3.2.2` to `@vitest/coverage-v8@3.2.4`
- Updated dependency `@vue/typescript-plugin@2.2.10` to `@vue/typescript-plugin@3.0.1`
- Updated dependency `eslint@9.28.0` to `eslint@9.30.1`
- Updated dependency `eslint-formatter-gitlab@6.0.0` to `eslint-formatter-gitlab@6.0.1`
- Updated dependency `happy-dom@17.6.3` to `happy-dom@18.0.1`
- Updated dependency `lint-staged@16.1.0` to `lint-staged@16.1.2`
- Updated dependency `nuxt-svgo@4.2.1` to `nuxt-svgo@4.2.3`
- Updated dependency `postcss@8.5.4` to `postcss@8.5.6`
- Updated dependency `postcss-import@16.1.0` to `postcss-import@16.1.1`
- Updated dependency `unimport@5.0.1` to `unimport@5.1.0`
- Updated dependency `vitest@3.2.2` to `vitest@3.2.4`
- Updated dependency `vue-tsc@2.2.10` to `vue-tsc@3.0.1`

## 1.10.0

### 🔥 Highlights

#### 📈 Introducing Tiered Promotions and Improved Delivery Cost Management

You now have more direct control over your storefront with powerful new features.
Encourage higher basket values with a new tiered promotions display that visually shows customers their progress towards unlocking rewards, and easily manage delivery costs and their descriptions directly from the SCAYLE Panel.

#### 🎨 Enhanced and Consistent User Interface

We've improved the user experience by introducing a new standardized component for displaying order statuses with clear, color-coded labels.
The overall interface has been streamlined through a major cleanup of our UI components, resulting in a more consistent and polished look and feel.

#### 🌍 Improved Internationalization (SEO & Translations)

The SCAYLE Storefront Application is now better optimized for international SEO, with intelligent `hreflang` links that help search engines understand the different language and country versions of your pages.
We've also performed a comprehensive overhaul of all translation files to align with our new guideline, ensuring a more consistent and maintainable translation process for all languages.

#### 🤝 Accessibility

We've implemented a major accessibility upgrade to ensure a more inclusive experience for all users.
This includes significantly improved keyboard navigation, clearer focus indicators, better screen reader support across all components, and updated color contrasts for enhanced readability.

### 🚀 Major Changes

- **\[Architecture \]** Updated Nuxt to version `3.16.2`.
  The primary change in this release is the upgrade to `unhead@2.x`, which necessitates small adjustments to both `nuxt.config.ts` and the usage of the `useHead` composable.
  More details can be found on the Nuxt blog. [Nuxt blog](https://nuxt.com/blog/v3-16).
- **\[Architecture\]** The `SFAsyncDataWrapper` has been split into two more specific components for handling async states:
  1. `SFAsyncStatusWrapper`: Renders content based on a status prop.
     This wrapper component accepts an `AsyncDataRequestStatus` as a prop.
     When the status is `success` it will render the default slot and when the `status` is `error` it will render an error slot.
     When the `status` is `pending` or `idle` it will render a loading slot.

     ```html
     <SFAsyncStatusWrapper :status="status">
       <MyPage />
       <template #loading>
         <MyLoadingState />
       </template>
       <template #loading>
         <MyErrorState />
       </template>
     </SFAsyncStatusWrapper>
     ```

  2. `SFAsyncDataWrapper`: Renders content based on an AsyncData object and provides the fetched data to its default slot.
     This wrapper component accepts an `AsyncData` object as a prop.
     When data has been loaded it will render the default slot and pass the data as `data` slot prop.
     When there is no data loaded, it will render the error slot when the status is `error` and the `loading` slot when the status is `pending` or `idle`.

     ```html
     <SFAsyncDataWrapper :async-data="asyncData">
       <template #default="{ data }">
         <MyPage :data="data" />
       </template>
       <MyPage />
       <template #loading>
         <MyLoadingState />
       </template>
       <template #loading>
         <MyErrorState />
       </template>
     </SFAsyncDataWrapper>
     ```

- **\[Architecture\]** To reduce code and complexity when fetching categories, `useRootCategories` has been removed in favor of `useCategoryTree`.
  The new method is more efficient and guarantees a consistent `Category[]` return value.

      ```ts
      // BEFORE
      const { data: rootCategoriesData, status, error } = useRootCategories()

      const rootCategories = computed<Category[]>(() => {
        if (!rootCategoriesData.value) {
          return []
        }
        return Array.isArray(rootCategoriesData.value.categories)
          ? rootCategoriesData.value.categories
          : [rootCategoriesData.value.categories]
      })

      // AFTER
      const { data: rootCategoriesData, status, error } = useCategoryTree()

      const rootCategories = computed<Category[]>(() => {
        return rootCategoriesData.value ?? []
      })
      ```

- **\[Basket\]** The display of delivery costs and their descriptions is now configurable directly within the SCAYLE Panel.
  This allows for easier management of shipping information without requiring code changes.
  Developers can access this configuration in the storefront using the useShopConfigCustomData.ts composable.
  For full implementation details, see the [SCAYLE Resource Center](https://scayle.dev/en/storefront-guide/developer-guide/features/pages/basket#delivery-costs).
- **\[Basket\]** To standardize basket-related logic, the Storefront Application codebase now incorporates the new `@scayle/storefront-basket` package.
  Custom utility functions have been replaced with the officially provided utils from this new dependency.
- **\[Build\]** To support updated dependencies and features, the minimum required Node.js version has been set to `22.15.0`.
  Please ensure your development and build environments meet this new requirement.
- **\[Config\]** Enhanced storage flexibility by implementing a new server plugin (`./server/plugins/storageConfig.ts`).
  This provides preconfigured storage for `@scayle/storefront-nuxt`, allowing developers to easily integrate any unstorage driver (e.g., Redis, Vercel KV).
- **\[Orders\]** To improve clarity for users, the new `SFOrderStatus` component now displays order statuses with consistent, color-coded labels.
  This enhancement is applied to both the order list and order detail views.
- **\[Promotions\]** Refactored the approach for handling product promotions by removing the `useProductPromotions` composable abstraction.
  Consuming components are now responsible for their own promotion logic and data handling.
- **\[Promotions\]** Refactored how promotion conditions are checked within the `SFPromotionProgressWrapper` component.
  The `areGiftConditionsMet` and `isGiftAddedToBasket` computed functions have been inlined directly into the component, removing their dependency on the `useProductPromotions` composable for this specific logic.
- **\[Promotions\]** The `SFPromotionProgressWrapper.vue` component has been enhanced to support tiered promotions.
  It now displays a progress bar with milestones, showing customers how close they are to unlocking different promotion tiers.
  This new UI is also used for minimum-order-value promotions, which are now treated as a single-tier promotion for a consistent experience.
- **\[SEO\]** To improve international SEO and search engine indexing, `hrefLang` links have been implemented for the Home, Product Listing, and Product Detail pages.
  For PLPs and PDPs, the system now intelligently checks for the product or category's availability in other shops before generating the corresponding `hreflang` link, ensuring accurate page version mapping.
- **\[Translations\]** We've performed a comprehensive overhaul of all translation files to align them with a newly introduced i18n guideline.
  This change ensures a consistent structure and adherence to best practices across all languages.
- **\[UI\]** The `SFProgressBar` component has been enhanced to visually display milestone ticks along the progress bar.
  This feature is enabled via the new milestones prop.
- **\[UI\]** To improve maintainability and reduce the overall codebase size, unused components have been deleted.
  Components with very limited usage have also been inlined directly where they were needed.
  - `modules/ui/runtime/components/core/SFBreadcrumbs.vue`
  - `modules/ui/runtime/components/core/SFHorizontalItemsDivider.vue`
  - `modules/ui/runtime/components/core/SFMenu.vue`
  - `modules/ui/runtime/components/core/SFOverlay.vue`
  - `modules/ui/runtime/components/core/SFSwipeDelete.vue`
  - `modules/ui/runtime/components/core/SFTwoColumnList.vue`
  - `modules/ui/runtime/components/core/SFVerticalAccordion.vue`
  - `modules/ui/runtime/components/core/chip/SFColorChip.vue`
  - `modules/ui/runtime/components/core/flyout/SFFlyout.vue`
  - `modules/ui/runtime/components/core/flyout/SFFlyoutMenu.vue`
  - `modules/ui/runtime/components/form/SFRadioGroup.vue`
  - `modules/ui/runtime/components/form/SFRadioItem.vue`
  - `modules/ui/runtime/components/layout/SFPageContainer.vue`
  - `modules/ui/runtime/components/links/SFContainerLink.vue`
  - `modules/ui/runtime/components/listbox/SFListbox.vue`
  - `modules/ui/runtime/components/listbox/SFListboxButton.vue`
  - `modules/ui/runtime/components/listbox/SFListboxOption.vue`
  - `modules/ui/runtime/components/listbox/SFListboxOptions.vue`
  - `modules/ui/runtime/components/pagination/SFSimplePagination.vue`
  - `modules/ui/runtime/components/transitions/SFFadeInFromBottomGroupTransition.vue`
  - `modules/ui/runtime/components/transitions/SFSlideInFromRightTransition.vue`
  - `modules/ui/runtime/components/transitions/SFSlideInFromTopTransition.vue`

### 💅 Minor Changes

- **\[Accessibility\]** Improved screen reader support by adding a descriptive `aria-label` to the 'close' button in both the `SFAuthResetPasswordSlideInHeader` and `SFAuthForgotPasswordSlideInHeader` components.
- **\[Accessibility\]** Improved the accessibility of the "Scroll to Top" button by adding a descriptive `aria-label` to the `SFScrollToTopButton` component.
- **\[Accessibility\]** Improved keyboard navigation and focus management on the Product List Page.
  When navigating between categories using the side navigation, focus is now correctly retained within the navigation panel.
  This was achieved by preventing the PLP from re-rendering on category changes via setting a fixed key in `definePageMeta`:

      ```typescript
      definePageMeta({
        // ...
        key: 'PLP',
      })
      ```

  Because the PLP component no longer re-mounts when changing categories, any logic previously in an `onMounted()` hook will not run again on navigation.
  This logic must be moved to a watcher (e.g., watching `route.params` or category state) to ensure it executes correctly.

- **\[Accessibility\]** Users navigating the store selector via keyboard can now easily view a store's opening hours by focusing on the store and pressing the Enter key.
- **\[Accessibility\]** Addressed an issue where Chrome's handling of `scroll-margin` caused inconsistent scroll behavior in the `SFSlideIn.client.vue` component.
  The implementation has been switched to use `scroll-padding` for more reliable cross-browser results.
- **\[Accessibility\]** Improved screen reader support by adding a descriptive `aria-label` to the 'close' button within the `SFShopSwitcherFlyoutHeader.vue` component.
- **\[Accessibility\]** Improved visual clarity in the `SFSiblingSelection.vue` component by changing the active item's color from black to the accent color.
  This helps users better differentiate the currently selected item from a keyboard-focused item.
- **\[Accessibility\]** Resolved an issue where the focus outline for the slider arrow buttons (`SFSliderArrowButton.vue`) was cut off.
  Styling adjustments within `SFProductGallery.vue` now ensure the full outline is visible, improving keyboard navigation feedback.
- **\[Accessibility\]** To prevent unintended filter updates in `SFPriceRangeSlider.vue`, the `@change` event handler has been removed from the price input field.
  This stops a filter action from being triggered simply by blurring the input.
- **\[Accessibility\]** Improved screen reader support in the `location.vue` component by adding a required `aria-label` to a previously unlabeled element.
- **\[Accessibility\]** Improved screen reader support for the variant picker (`SFVariantPicker.vue`) by adding a descriptive `aria-label` to each individual variant option.
- **\[Accessibility\]** Streamlined keyboard navigation in the `SFPriceRangeSlider.vue` filter modal.
  The slider bar itself is no longer a focusable element, allowing users to interact more efficiently and directly with the price input fields to set the desired range.
- **\[Accessibility\]** Corrected an invalid ARIA implementation in `SFShopSwitcherFlyoutBody.vue` by removing a `role="menu"` attribute from a `<div>` wrapper.
  This resolves an accessibility issue where the element failed to meet the requirement of containing appropriate child roles (e.g., `menuitem`).
- **\[Accessibility\]** To meet higher contrast ratio standards, core application colors have been updated.
  This includes adjusting the primary red and a key gray value to improve readability, as well as unifying various text colors for a more consistent and accessible experience.
  - Updated the primary red (`#E74B3A` → `#D1000A`).
  - Adjusted a key gray (`#080808` → `#757575`).
  - Unified text colors to use `text-gray-500`.
  - Updated the 'Scroll to Top' button's border to `border-gray-500`.
- **\[Accessibility\]** Corrected the ARIA implementation in `SFProductPromotionBanner.vue`.
  The `aria-label` is now conditionally applied only when the component is rendered as a link, ensuring proper accessibility without affecting non-interactive instances.
- **\[Accessibility\]** Fixed the "skip to search" link, which was previously not functioning.
  The correct element selector is now being used in `SFSkipLinks.vue` to ensure it works reliably for keyboard users.
- **\[Accessibility\]** Enhanced readability in the `SFVariantPicker.vue` component by increasing the color contrast between the placeholder text and its background, ensuring it meets accessibility standards.
- **\[Accessibility\]** Improved accessibility across the application by adding a descriptive `aria-label` to the promotional gift item button and by applying `aria-hidden="true"` to all purely decorative icons, preventing them from being announced by screen readers.
- **\[Accessibility\]** To ensure proper page structure and improve SEO, a duplicate `<h1>` tag has been removed from the Product Listing Page.
  The headline within the `SFProductListNoResults.vue` component is now correctly set to an `<h2>`.
- **\[Accessibility\]** To ensure proper page structure, the headline on the empty wishlist page has been removed, resolving an issue with a duplicate `<h1>` tag.
  This change also visually aligns the page with the empty basket view.
- **\[Accessibility\]** To improve screen reader support, a visually hidden but accessible label has been added to the main search input.
- **\[Accessibility\]** To ensure proper keyboard interaction, the search input trigger has been assigned `role="button"`.
  This correctly identifies it as an interactive element for assistive technologies and resolves the "Non-active element in tab order" issue.
- **\[Accessibility\]** To ensure proper keyboard interaction and screen reader support, required ARIA roles have been added to interactive elements within the `SFBasketCard.vue` and `SFSearchInput.vue` components.
- **\[Accessibility\]** To improve screen reader support during a password change, a visually hidden but accessible label has been added to the email field within the `SFProfilePasswordManagement` component.
- **\[Accessibility\]** To prevent focusable elements from being hidden by the sticky action bar, a scroll margin has been added to all focusable items within the `SFSlideIn.client.vue` component.
- **\[Architecture\]** The Product Detail Page's architecture has been enhanced by assigning it a static page key, which prevents full page reloads when toggling between variants and siblings.
  This change also allowed us to simplify the codebase by removing a page-specific middleware and merging its URL correction logic directly into the PDP component.
- **\[Architecture\]** Removed the now-redundant `router.options.ts` file.
  This custom configuration for preserving scroll position on navigation is no longer needed as this behavior works now out of the box in Nuxt 3.
- **\[Architecture\]** To simplify the codebase, the `useFilterSlideIn` composable has been removed.
  Its logic was inlined, as the wrapper was an unnecessary layer of abstraction.
- **\[Architecture\]** Added new linting rules for i18n using `@intlify/eslint-plugin-vue-i18n`.
  Developers will now see warnings or errors for improperly formatted or missing translation keys directly in their IDE.
- **\[Architecture\]** Resolved an issue where navigating between categories on the Product Listing Page (PLP) was unresponsive.
  This was caused by a reactivity problem after a recent change prevented the page from fully reloading.
  The fix moves all category data fetching logic from the now-removed middleware directly into the PLP component, ensuring data updates correctly on navigation.
- **\[Basket\]** Resolved a bug in `SFBasketDeleteConfirmationModal` component by assigning its return value to the `visible` constant.
  This resolves an issue where the modal's visibility state was not being properly managed.
- **\[Basket\]** Corrected the state handling for promotional gifts to enable the addition of multiple gift products.
  Previously, the `variantId` of the initial gift was not being cleared, which blocked subsequent gift additions.
- **\[Basket\]** To improve code maintainability, the empty and unused `useBasketItem` composable has been removed from the codebase.
- **\[Build\]** To optimize the final Docker image size and build speed, the `.dockerignore` file has been extended.
  This prevents development files, such as the Playwright test suite, documentation, and local environment configurations, from being unnecessarily copied into the build context.
  - `/playwright`
  - `README.md`
  - `CHANGELOG.md`
  - `CHANGELOG-RC.md`
  - `docker-compose.yml`
  - `vitest.config.ts`
  - `.prettierrc`
  - `.prettierrc.cjs`
  - `.prettierignore`
  - `.eslintrc.js`
  - `.eslintignore`
  - `.gitignore`
  - `.dockerignore`
  - `.nvmrc`
- **\[Build\]** OpenTelemetry data can now be automatically enriched with Git repository information for improved observability.
  To include the commit SHA and repository URL in your telemetry, pass the corresponding build arguments when creating the Docker image:

      ```sh
      docker build ./docker/node \
      --build-arg GIT_REPOSITORY_URL=$(git config --get remote.origin.url) \
      --build-arg GIT_COMMIT_SHA=$(git rev-parse HEAD)
      ```

- **\[CMS\]** The `useCMSBySlug` composable has been enhanced to be fully reactive.
  It now automatically re-fetches CMS data whenever the provided slug changes, ensuring the content stays in sync with the state.
- **\[CMS\]** To improve code organization and encapsulation, the `useBanner` composable has been moved from the global application context and is now properly integrated within the dedicated local `cms` module.
- **\[E2E\]** Addressed a potential test failure by updating the locator for the "accept terms and conditions" checkbox on the Checkout page.
  This change was required to adapt our Order Success Page (OSP) test suite to recent modifications in the checkout UI.
- **\[E2E\]** Aligned the Orders page end-to-end test (`e2e-Orders.spec.ts`) with a recent UI update.
  The test now correctly verifies the new order number display format, which uses a `#` separator instead of a `:`.
- **\[E2E\]** The end-to-end tests for user authentication have been refactored to improve maintainability and clarity.
  The constant objects related to logged-in user and registration tests have been updated, and comprehensive JSDoc documentation has been added to explain the required environment variable setup for dedicated test users.
  Inline comments now outline the prerequisites, including the creation of specific test users via environment variables.
  - `TEST_USER_EMAIL1=`: Dedicated test user for Chromium and default test user across end-to-end tests.
  - `TEST_USER_EMAIL2`: Dedicated test user for desktop Firefox.
  - `TEST_USER_EMAIL3`: Dedicated test user for desktop Webkit (Safari).
  - `TEST_USER_EMAIL4`: Dedicated test user for mobile Chrome.
  - `TEST_USER_EMAIL5`: Dedicated test user for mobile Webkit (Safari).
  - `TEST_USER_NO_ORDERS`: Test user with no orders placed. Used to verify Orders page empty state.
  - `TEST_USER_PASSWORD=`: Password (the same for all test users listed above).
  - `TEST_USER_WRONG_PASSWORD`: Password used for test that verifies user authentication with wrong credentials.
  - `TEST_USER_GUEST`: Test user used to verify Registration process for guest user.
- **\[E2E\]** To further improve the stability of end-to-end tests that navigate to the Product Listing Page, an additional wait condition has been added.
  Tests will now explicitly wait for the PLP breadcrumb element to be visible, preventing failures caused by race conditions or slow page loads.
- **\[E2E\]** Expanded end-to-end test coverage for the Orders page.
  The test (`e2e-Orders.spec.ts`) now also verifies that the order status is correctly displayed on both the main order list and the individual order detail pages.
- **\[E2E\]** To speed up test execution in non-Vercel environments, Vercel-specific HTTP headers are now applied conditionally.
  This is controlled by the `isTargetingVercel` environment variable in the Playwright configuration, preventing unnecessary overhead.
- **\[E2E\]** To improve test suite maintainability, the page object model (`playwright/page-objects/`) has been cleaned up.
  Outdated and unused DOM locators and methods were removed, resulting in a leaner and more manageable codebase.
- **\[E2E\]** The end-to-end test for user data updates has been adapted to accommodate recent UI changes.
  The `updateUserData()` method now uses the new, required birth date format to ensure the test remains stable and accurate.
- **\[E2E\]** To improve the developer experience when working with the end-to-end test suite, a significant refactoring has been completed.
  This includes reorganizing shared constants, adding detailed JSDoc comments to explain the purpose and setup for each test, and ensuring consistent use of constants across the suite, making tests easier to read, run, and maintain.
- **\[E2E\]** To simplify the process of running and understanding our end-to-end tests, all test files have been updated with detailed JSDoc documentation.
  Developers can now find the purpose, scope, and all necessary prerequisites—including required environment variables for test users and specific setup notes—directly within each test file, streamlining the testing workflow:
  - `e2e-CountryDetector.spec.ts`: Explanation of timezone forcing for Country Detector modal testing.
  - `e2e-Footer.spec.ts`: Description of the test suite's scope.
  - `e2e-Orders.spec.ts`: Details on environment variable setup for test user credentials.
  - `e2e-OrderSuccessPage.spec.ts`: Prerequisites regarding product availability for successful order completion.
  - `e2e-Wishlist.spec.ts`: Scope and environment variable requirements for test user credentials.
- **\[E2E\]** To enhance test robustness, key end-to-end tests have been updated to reduce their dependency on specific content and product data.
  SEO verification on the PDP, Wishlist, Login, and Basket pages now performs more generalized checks instead of asserting exact text.
  Additionally, the Basket empty state test has been simplified to be independent of specific labels, ensuring greater stability.
- **\[E2E\]** The end-to-end test for the Basket's empty state (`e2e-Basket.spec.ts`) has been made more stable.
  A new step now automatically clears any pre-existing items from the logged-in user's basket, ensuring the test is reliable and independent of prior user activity.
- **\[E2E\]** To improve maintainability, the Search end-to-end tests have been updated to use environment variables for test data.
  To run these tests successfully, you must now set the required environment variables to provide appropriate search terms for your specific test environment:
  - `E2E_SEARCH_TERM_PRODUCT`: Search term that doesn't match any category name, so the search suggestions are not shown, e.g. some product brand.
  - `E2E_SEARCH_TERM_CATEGORY_SUGGESTION`: Search term that fully or partially matches category name, e.g. "shirt" or "shirts".
  - `E2E_SEARCH_EXACT_PRODUCT_ID`: Search term that matches exact product ID, e.g. 123456.
  - `E2E_SEARCH_TAGS`: Descriptive search term that returns search suggestion tags in search suggestions list, e.g. "Black shoes size 44".
  - `E2E_SEARCH_PAGE`: Search term that fully or partially matches a (content) page, e.g. "faq" or "support".
  - `E2E_SEARCH_REFERENCE_KEY`: Search term that matches the exact product reference key, e.g. "123-ref-key".
- **\[E2E\]** The end-to-end test suite has been enhanced to be more robust and adaptable across different environments.
  We have reduced dependencies on hardcoded product IDs and static URLs, leading to more reliable test runs.
  - `e2e-Account.spec.ts`: Tests now navigate to the User Profile via the Homepage, eliminating the use of hardcoded profile URLs.
  - `e2e-Footer.spec.ts`: Footer link verification has been consolidated into `e2e-Homepage.spec.ts`, and the dedicated Footer links test has been streamlined.
  - `e2e-Orders.spec.ts`: Introduced an environment variable to provision test users with no prior orders.
  - `e2e-OrderSuccessPage.spec.ts`: Exact page title and description are no longer the part of SEO checks.
  - `e2e-Pdp.spec.ts`: Product information (name, brand, price) and Wishlist interactions are now generalized, removing the need for specific Product ID.
  - `e2e-Wishlist.spec.ts`: Verification of Wishlist contents and SEO elements is now independent of specific Product ID.
- **\[E2E\]** Improved the robustness of product variant selection in end-to-end tests.
  A new method, `chooseProductVariant()`, now intelligently checks if the variant picker is disabled (for single-variant products) or enabled (for multi-variant products), ensuring tests can reliably handle different product types.
- **\[E2E\]** Improved the reliability of the mobile Order Success Page test.
  The test was refactored to navigate from the PLP to the PDP by clicking the product image, and size selection now uses a forced click (`{force: true}`) to prevent CI-related timeouts.
- **\[E2E\]** Improved the end-to-end test suite for greater reliability and easier maintenance. Key changes include:
  - Product Independence: Core tests (Basket, Checkout, OSP) now select the first available product variant instead of relying on hardcoded IDs.
  - Category Independence: Navigation tests now dynamically traverse menus and categories, removing dependency on a fixed site structure.
  - Test Suite Cleanup: Removed obsolete tests and their associated data to streamline the test suite.
- **\[E2E\]** Added an automated test to validate the behavior of our 404 "Page Not Found" error handling.
  The test simulates a user navigating to an invalid URL and asserts that the correct error page is displayed with the proper 404 code and a "Continue shopping" button.

- **\[Promotions\]** The promotional gift selection modal has been streamlined by removing price details from the available gift options.
- **\[Promotions\]** Corrected an issue where promotion badges for free gifts in the basket (`SFBasketCardImage.vue`) used custom frontend logic.
  The implementation has been changed to remove this custom label and derive the badge from the basket item's data, ensuring it reflects the actual promotion configuration.
- **\[Promotions\]** To improve maintainability and reduce the codebase size, the unused `SFPromotionHeadline.vue` component has been removed.
- **\[Promotions\]** To improve code quality and maintainability, obsolete code related to inline gift selection has been removed.
  This includes the isLastItemWithPromotions function in `SFBasketAvailableItems.vue` and the `show-free-gift-selection` prop in `SFBasketCard.vue`, both of which have been unused since Storefront Application `v1.9.0`.
- **\[Subscriptions\]** The `useSubscriptions` composable is now fully reactive.
  It will automatically re-fetch and update subscription data when the provided product `ref` changes, ensuring information always stays in sync.
- **\[UI\]** To improved visual consistency, the mobile menu's overlay 'close' button has been restyled and enlarged to match the appearance of other icons in the header.
- **\[UI\]** To improve visual consistency, the 'sold out' indicator in `SFProductPromotionGiftItems.vue` now uses the shared `product-sold-out` color class, aligning its appearance with other `sold-out` indicators across the application.
- **\[UI\]** To improve visual consistency and depth, shadows have been added to the arrow buttons used in the product card slider and the image zoom gallery.
- **\[UI\]** To improve code quality and reduce bundle size, several unused animation styles (`ping`, `ping-small`, `grow`, `shrink`) and their associated keyframes have been removed.
  The unused `animateIcon` prop in `SFButton` has also been deprecated as part of this cleanup.
- **\[UI\]** Refactored slider arrow controls by replacing `SFProductCardImageSliderButton` and custom `SFButton` implementations with the new `SFSliderArrowButton` component.
  This change centralizes logic and styling for a more maintainable and consistent codebase.
- **\[UI\]** To improve visual consistency across form elements, the styling for the date input (`<SFTextInput type="date" />`) has been updated to match the appearance of other text input types.
- **\[UI\]** To improve the layout of color filters, the `SFFilterColorChip` component now truncates long color names, preventing them from overflowing or wrapping awkwardly.
- **\[UI\]** To improve code maintainability and reduce bundle size, several unused Tailwind plugins and their associated custom styles have been removed.
  - `.top-white-shadow`: Custom box-shadow.
  - `.search-decoration-none`: Removes default search input decorations.
  - Base styles for search inputs: Resets WebKit-specific search input decorations.
- **\[UI\]** To provide a more consistent and predictable user experience, the `SFStoreOpeningTimesSummary.vue` component will now always display the week starting on Monday.
  We've removed the locale-specific `useFirstDayOfWeek` composable and the corresponding `intl.first_day` translation key to achieve this.
  If your project requires a localized start day, you can re-implement this functionality using the composable below.

      ```ts
      const useFirstDayOfWeek = function() {
        const currentShop = useCurrentShop()
        const i18n = useI18n()
        const locale = new Intl.Locale(currentShop.value.locale)
        return 'getWeekInfo' in locale && typeof locale.getWeekInfo === 'function'
          ? locale.getWeekInfo().firstDay
          : parseInt(i18n.t('intl.first_day')) ?? 1
      }
      ```

- **\[Utilities\]** Removed the usage of deprecated helper functions `isFirstIndexOfRow` and `getRowByIndex`.
  Their logic has been moved directly into the components where it was used, simplifying the codebase.
- **\[Utilities\]** To standardize how product prices are handled, the custom price logic has been replaced with the official `useProductPrice` composable provided by `@scayle/storefront-nuxt`.
- **\[Utilities\]** To improve how product details are retrieved on the order detail page, `SFOrderDetailProductCard.vue` now uses the `useProductBaseInfo` composable for a more standardized approach.
- **\[Utilities\]** To centralize reusable code, the specific logic for date validation has been transferred to the Storefront Application codebase.
  Additionally, the local `useValidationRules()` composable has been enhanced with JSDoc comments for better documentation and clarity.
- **\[Utilities\]** The return value of the `useProductBaseInfo` composable has been updated.
  It now returns the specific `color` of the current product, rather than an array of all available `colors`.
- **\[Utilities\]** To simplify usage and improve consistency, the `useFormatDate` and `useFormatDistance` composables have been consolidated into a single, unified `useFormat` composable.
  As part of this change, `formatLocaleDate has been renamed to the simpler`formatDate, and it now returns undefined (instead of `null`) when no locale is available, aligning with our standard patterns.

      ```typescript
      // BEFORE
      const { formateLocaleDate } = useFormatDate()
      const formatDistance = useFormatDistance()

      formatDate(new Date())
      formatDistance(100)

      // AFTER
      const { formatDate, formatDistance } = useFormat()

      formatDate(new Date())
      formatDistance(100)
      ```

- **\[UX\]** To improve code reuse and consistency, logic for the site logo has been extracted into a new `SFLogoLink` component.
  Shared across the `SFHeader` and `SFFooter`, it implements a "scroll-to-top" function when the logo is clicked on the home page.

### 🩹 Patch Changes

- **\[Architecture\]** Updated the `svgoConfig` implementation to merge with the default settings rather than completely replacing them.
  This prevents unintended side effects, such as icon alignment issues, caused by an incomplete configuration.
- **\[Architecture\]** Addressed a potential build failure related to a sub-dependency of the `@nuxtjs/tailwindcss` module.
  The package `unicorn-magic` is now pinned to `v0.2.0` as a resolution, mitigating a potential fatal build error.
  See <https://github.com/nuxt-modules/tailwindcss/issues/954> for more details.
- **\[PDP\]** Resolved a styling issue where the focus outline on the breadcrumb links was being partially obscured or cut off.
- **\[PLP\]** Restored custom styling for "Sale" categories in the side navigation by adding a `sale` property to the category fetch request, ensuring the necessary data is available for styling hooks.
- **\[Subscription\]** Resolved a styling issue on the Product Detail Page where the focus outline for the subscription dropdown was being partially obscured or cut off.
- **\[UI\]** Resolved a styling issue that caused a broken appearance for the close button within the `SFFilterHeader` and `SFStoreLocatorSlideIn` components.
- **\[UI\]** Resolved a DOM collision issue by ensuring the SVG ID attribute for the empty state icon is unique.
  This fixes a consequential bug where the icon failed to render correctly.
- **\[UI\]** Fixed a layout issue on smaller screens where the `SFSearchInput.vue` component was not taking up the full available width.
  The input field is now correctly styled to span the full width on mobile devices.
- **\[UI\]** Enhanced the `v-dialog` directive to be more robust.
  It now correctly handles cases where a modifier might be `undefined`, preventing potential runtime errors.
- **[\UI\]** Resolved a layout issue in the `SFProductRecommendations` component where slider buttons could overlap the section title.
  This was corrected by adjusting the button sizes and implementing title truncation.
- **\[UI\]** Addressed a Safari-specific rendering bug where an unwanted shadow would appear on the main content area after closing the filter slide-in.
  This was resolved by adding a `focus:shadow-none` utility class to the `default` layout's `main` tag.

### 🏡 Dependency Updates

- Added dependency `@scayle/storefront-basket@0.3.0`
- Added dependency `@scayle/unstorage-compression-driver@1.0.0`
- Added dependency `@scayle/unstorage-scayle-kv-driver@1.0.0`
- Added dependency `unstorage@1.16.0`
- Added dependency `@intlify/eslint-plugin-vue-i18n@4.0.1`
- Added dependency `@parcel/watcher@2.5.1`
- Removed dependency `nuxi@3.24.1`
- Removed dependency `redis@4.7.0`
- Updated dependency `@contentful/live-preview@4.6.12` to `@contentful/live-preview@4.6.20`
- Updated dependency `@nuxt/fonts@0.11.1` to `@nuxt/fonts@0.11.4`
- Updated dependency `@scayle/nuxt-image-provider@0.2.5` to `@scayle/nuxt-image-provider@0.3.1`
- Updated dependency `@scayle/nuxt-opentelemetry@0.9.4` to `@scayle/nuxt-opentelemetry@0.13.7`
- Updated dependency `@scayle/omnichannel-nuxt@4.2.0` to `@scayle/omnichannel-nuxt@4.3.2`
- Updated dependency `@scayle/storefront-country-detection@1.1.1` to `@scayle/storefront-country-detection@2.0.0`
- Updated dependency `@scayle/storefront-navigation@0.1.0` to `@scayle/storefront-navigation@0.3.0`
- Updated dependency `@scayle/storefront-nuxt@8.21.0` to `@scayle/storefront-nuxt@8.28.6`
- Updated dependency `@scayle/storefront-product-detail@1.1.4` to `@scayle/storefront-product-detail@1.4.2`
- Updated dependency `@scayle/storefront-product-listing@1.3.2` to `@scayle/storefront-product-listing@1.6.2`
- Updated dependency `@scayle/storefront-promotions@0.1.1` to `@scayle/storefront-promotions@2.2.0`
- Updated dependency `@scayle/storefront-search@0.2.1` to `@scayle/storefront-search@0.3.0`
- Updated dependency `@storyblok/nuxt@6.2.4` to `@storyblok/nuxt@7.0.1`
- Updated dependency `@storyblok/richtext@3.2.0` to `@storyblok/richtext@3.3.0`
- Updated dependency `@storyblok/vue@8.2.2` to `@storyblok/vue@9.0.0`
- Updated dependency `@vueuse/components@13.1.0` to `@vueuse/components@13.3.0`
- Updated dependency `@vueuse/core@13.1.0` to `@vueuse/core@13.3.0`
- Updated dependency `@vueuse/integrations@13.1.0` to `@vueuse/integrations@13.3.0`
- Updated dependency `@vueuse/nuxt@13.1.0` to `@vueuse/nuxt@13.3.0`
- Updated dependency `axios@1.8.4` to `axios@1.9.0`
- Updated dependency `cf-content-types-generator@2.15.5` to `cf-content-types-generator@2.16.0`
- Updated dependency `contentful@11.5.13` to `contentful@11.7.0`
- Updated dependency `contentful-export@7.21.42` to `contentful-export@7.21.57`
- Updated dependency `dompurify@3.2.5` to `dompurify@3.2.6`
- Updated dependency `focus-trap@7.6.4` to `focus-trap@7.6.5`
- Updated dependency `storyblok-js-client@6.10.11` to `storyblok-js-client@7.0.0`
- Updated dependency `swiper@11.2.6` to `swiper@11.2.8`
- Updated dependency `vue@3.5.13` to `vue@3.5.16`
- Updated dependency `@changesets/cli@2.29.0` to `@changesets/cli@2.29.4`
- Updated dependency `@nuxt/eslint@1.3.0` to `@nuxt/eslint@1.4.1`
- Updated dependency `@nuxt/test-utils@3.17.2` to `@nuxt/test-utils@3.18.0`
- Updated dependency `@nuxtjs/i18n@9.1.1` to `@nuxtjs/i18n@9.5.5`
- Updated dependency `@nuxtjs/tailwindcss@6.13.1` to `@nuxtjs/tailwindcss@6.14.0`
- Updated dependency `@scayle/eslint-config-storefront@4.5.0` to `@scayle/eslint-config-storefront@4.5.4`
- Updated dependency `@types/node@22.14.1` to `@types/node@22.15.30`
- Updated dependency `@typescript-eslint/scope-manager@8.30.0` to `@typescript-eslint/scope-manager@8.33.1`
- Updated dependency `@typescript-eslint/utils@8.30.0` to `@typescript-eslint/utils@8.33.1`
- Updated dependency `@upstash/redis@1.34.7` to `@upstash/redis@1.35.0`
- Updated dependency `@vitest/coverage-v8@2.1.9` to `@vitest/coverage-v8@3.2.2`
- Updated dependency `@vue/typescript-plugin@2.2.8` to `@vue/typescript-plugin@2.2.10`
- Updated dependency `debug@4.4.0` to `debug@4.4.1`
- Updated dependency `eslint@9.24.0` to `eslint@9.28.0`
- Updated dependency `eslint-formatter-gitlab@5.1.0` to `eslint-formatter-gitlab@6.0.0`
- Updated dependency `fishery@2.2.3` to `fishery@2.3.1`
- Updated dependency `happy-dom@17.4.4` to `happy-dom@17.6.3`
- Updated dependency `lint-staged@15.5.1` to `lint-staged@16.1.0`
- Updated dependency `nuxt@3.15.4` to `nuxt@3.16.2`
- Updated dependency `nuxt-svgo@4.0.17` to `nuxt-svgo@4.2.1`
- Updated dependency `postcss@8.5.3` to `postcss@8.5.4`
- Updated dependency `postcss-custom-properties@14.0.4` to `postcss-custom-properties@14.0.6`
- Updated dependency `storyblok@3.36.0` to `storyblok@3.36.1`
- Updated dependency `unimport@4.2.0` to `unimport@5.0.1`
- Updated dependency `vitest@2.1.9` to `vitest@3.2.2`
- Updated dependency `vue-tsc@2.2.8` to `vue-tsc@2.2.10`

## 1.9.1

### 🩹 Patch Changes

- **\[CMS\]** Resolved styling defects and functional issues with the CMS Slider component.
  The problems stemmed from a missing `nuxt-swiper` dependency, which has now been correctly added and configured.

### 🏡 Dependency Updates

- Added dependency `nuxt-swiper@1.2.2`
- Updated dependency `@typescript-eslint/scope-manager@8.29.1` to `@typescript-eslint/scope-manager@8.30.0`
- Updated dependency `@typescript-eslint/utils@8.29.1` to `@typescript-eslint/utils@8.30.0`
- Updated dependency `lint-staged@15.5.0` to `lint-staged@15.5.1`

## 1.9.0

### 🔥 Highlights

#### 🎁 Enhanced Promotions

We've significantly updated our Promotions integration, focusing on simplifying implementation,
shifting towards more backend-driven logic, and making Storefront integration easier.

Key highlights include:

- **Easier Integration:** A new `@scayle/storefront-promotions` module with a `useApplyPromotions` composable greatly simplifies the developer effort needed to ensure promotions are accurately applied to the basket in within any Storefront Application.
- **Smarter Promotion Display:** Reflecting more refined backend logic, information about promotional gifts on Product Detail Pages (using the `SFProductPromotionGifts` component) now only appears when specific conditions are met, and promotions listed in the slide-in panel are now correctly sorted by priority.
- **Flexible Backend Control:** The underlying structure for promotion custom data has been revised, providing enhanced flexibility for backend configuration of promotion presentation details like headlines, colors, and links. Components like the basket summary promotions display have been updated to utilize this structure.

#### 👤 Redesigned Account Area

The Account Area of the Storefront Application has received a significant overhaul, focusing on improved usability and a more unified experience!

- **Unified Account:** Access your Profile, Orders, and Subscriptions from a newly redesigned central account page.
- **Redesigned Profile & Orders:** Enjoy completely revamped Profile, Orders list, and Order Detail pages with clearer layouts,
  comprehensive information (including detailed payment summaries and product info on order details), and easier management.
- **Enhanced Management:** Effortlessly update your personal details (name, gender, birth date) and change your password on the redesigned Profile page.
- **Improved Navigation:** Order items listed in your history are now clickable links directly to the product page, and the "Back" button on order detail pages provides smarter navigation.
- **Visual Consistency:** The Subscriptions page title now aligns visually with the rest of the refreshed Account Area.

#### 🔧 UI Refinements, Accessibility Improvements & Performance Optimizations

This update introduces a variety of enhancements across the Storefront Application, focusing on improving accessibility, refining the user interface, and boosting performance:

- **Accessibility:** Keyboard navigation has been significantly improved, ensuring skip links and the header user menu are fully accessible. Screen reader support is also enhanced, notably providing clearer context for order detail links in the account area.
- **UI Refinements:** Experience a smoother interface with visually improved skeleton loaders that reduce layout shifts, more predictable behavior for filter panels (staying open when applying filters) and user popovers (closing automatically), and fixes for modals that previously stayed open incorrectly during navigation. Additionally, a logout button is now available in the mobile sidebar, and price inputs better restrict values to valid ranges.
- **Performance Boosts:** Enjoy faster internal page navigation thanks to optimized breadcrumb links that prevent unnecessary page reloads. We've also reduced redundant background API calls triggered by the price range filter and optimized how common UI elements like modals and slide-ins load for better overall performance.

### 🚀 Major Changes

- **\[Account Area\]** Introduced a completely redesigned Order Detail page, structured for clarity and comprehensive information.
  The page features a detailed list of all ordered products, complete with in-depth information about each item.
  At the bottom, a **Payment Summary** section presents a clear breakdown of the subtotal, shipping costs, and the final total.
  The page is thoughtfully organized into sections, including:
  - **Order Details**: Displays key information about the order.
  - **Payment Details**: Provides a breakdown of payment methods.
  - **Delivery/Billing Address**: Highlights the addresses associated with the order.
- **\[Account Area\]** Improved the navigation flow from the order detail page.
  The "Back" button now provides a more seamless experience by returning the user to the `/orders` list page, unless they were just on that page,
  in which case it functions as a standard browser back action.
- **\[Account Area\]** Introduced a redesigned profile page enabling users to easily manage their information.
  Key features include viewing consolidated account details, updating personal information (first/last name, gender, birth date),
  and changing their password, all within clearly defined sections.
- **\[Account Area\]** Items displayed using the `SFOrderItemCard` (e.g., in order details) are now clickable links,
  allowing users to easily navigate to the corresponding product page.
- **\[Account Area\]** Introduced a fully redesigned "My Orders" page.
  The new layout presents a comprehensive list of the user's past orders,
  displaying key details for each entry and including a direct link to the specific Order Detail page for more information.
- **\[Account Area\]** Introduced a unified main Account page that seamlessly integrates sub-sections for Profile Management,
  Subscription Details, and Order History into a single, cohesive interface.
- **\[Account Area\]** Updated the visual styling of the Subscriptions page title to align consistently
  with the presentation of other pages within the Account Area.
  The page's core functionality and integrated subscription component remain unchanged.
- **\[Promotions\]** Promotions presented in the promotion slide-in panel (`SFPromotionSlideIn.vue`) are now ordered according to priority,
  ensuring higher-priority promotions are listed first.
- **\[Promotions\]** The `SFProductPromotionGifts` component is now shown conditionally on the Product Detail Page,
  appearing only when its gift promotion criteria are met.
- **\[Promotions\]** Revised the data structure for custom data associated with promotions.
  Refer to the `PromotionCustomData` TypeScript interface for the new schema details
  (including fields like `headline`, `product`, `color`, `link`, etc.).
  The `SFBasketSummaryPromotions.vue` component has been updated to work with this new structure.
  - New `PromotionCustomData` Interface:

    ```ts
    interface PromotionCustomData {
      product?: {
        attributeId: number
        badgeLabel: string
      }
      headline?: string
      subline?: string
      conditions?: string
      minimumOrderValue?: CentAmount
      color?: {
        background: string
        text: string
      }
      hideCountdown?: boolean
      link?: string
    }
    ```

- **\[Promotions\]** Added the `@scayle/storefront-promotions` module.
  Developers can now leverage the `useApplyPromotions` composable to integrate logic that automatically updates
  promotions on basket items during any basket change event (add, remove, update quantity).
  - Example Usage

        ```ts
        import { useApplyPromotions } from '#storefront-promotions/composables/useApplyPromotions'

        const { data: basket, addItem  } = await useBasket()
        const { applyPromotions } = useApplyPromotions()

        await applyPromotions(basket)

        await addItem({...})
        await applyPromotions(basket)
        ```

### 💅 Minor Changes

- **\[E2E\]** Added automated tests to confirm that the skip links functionality works as expected for keyboard users,
  specifically validating navigation to the "Main content" and "Search" targets.
- **\[E2E\]** Introduced a new end-to-end test suite for the password change functionality.
  Coverage includes both successful password updates and expected failure scenarios (e.g., incorrect old password, policy violations).
- **\[E2E\]** Implemented new end-to-end tests to ensure the reliability of the User Account Area.
  Test cases validate page load, navigation through its tabs, the data update process,
  and crucial input validations such as birth date format checking.
- **\[E2E\]** Added specific end-to-end test steps to validate the simplified footer shown during the checkout flow.
  The tests confirm both its visual rendering accuracy and that all embedded links correctly utilize `target="_blank"` (open in new tab).
- **\[E2E\]** Added end-to-end tests for the Login and Registration user flows.
  Key checks include ensuring the tab-based switching between forms works correctly and that mandatory links like the Privacy Disclaimer launch in a separate browser tab as required.
- **\[E2E\]** Store Locator E2E tests are now skipped by default in automated/scheduled test runs to save resources.
  To execute them manually, remove the `.skip` suffix from the tests in `playwright/tests/e2e-StoreFinder.spec.ts` and relevant steps in `playwright/tests/e2e-Pdp.spec.ts`.
- **\[E2E\]** Aligned the end-to-end test for gift product quantity handling in the basket with recent updates to the promotion system. The test now correctly validates quantity increments based on the current promotion rules.
- **\[E2E\]** Expanded end-to-end test coverage for the Orders page.
  Tests now verify the page's appearance and functionality for both users who have an order history and users who have no orders (empty state).
- **\[UI\]** Resolved a layout issue where the wishlist toggle button on product cards could overlap and obstruct the global "Scroll to Top" button, ensuring both elements remain clickable.
- **\[E2E\]** Aligned the login and logout end-to-end test flows with recent application updates.
  Specifically, tests were modified to accommodate changes within the User Profile section and the new logout interaction path on mobile.
- **\[E2E\]** Modified the end-to-end test to validate country selection in a language-agnostic way.
  The test no longer checks the visible country label (which varies with language settings) and instead confirms the selection using a stable, non-display mechanism.
- **\[E2E\]** Aligned end-to-end test scenarios with the latest Promotion feature updates.
  Tests covering the Promotion Ribbon and Promotions Flyout components have been modified to match the new expected behaviors and appearances.
- **\[Navigation\]** Improved the navigation experience by ensuring the sidebar (`SFMobileSidebar.vue`) consistently closes itself before transitioning the user to the selected page.
- **\[OSP\]** Adopted the `SFASyncDataWrapper` component to manage and display UI states related to asynchronous data fetching, improving consistency and reliability.
- **\[Subscriptions\]** Renamed the URL route for the subscriptions section from `/subscription` to `/subscriptions`.
- **\[UI\]** Refactored the handling of the gift selection modal (`SFProductPromotionSelectionModal`).
  Firstly, its visibility state is now managed locally within this component instead of using global `useState`,
  resolving an issue where the modal incorrectly remained open after page navigation.
  Secondly, the implementation now utilizes a single, reusable modal instance for all gift options, optimizing component usage.
- **\[UI\]** Prevented the filter panel (`SFFilterSlideIn.vue`) from automatically closing when the page route changes.
  This allows the panel to stay open when filters are applied, as filter application modifies the route via URL parameters.
- **\[UI\]** Refined the Product Card's skeleton loader (`SFProductCardSkeleton.vue`) to better resemble the final `SFProductCard.vue` layout.
  This ensures a smoother visual transition as content loads and reducing layout shifts.
- **\[UI\]** The user navigation popover now automatically closes when it loses focus (e.g., when the user clicks outside of it or tabs away with the keyboard).
- **\[UI\]** Applied `min` and `max` attributes to the underlying HTML input element within the price input component (`SFPriceInput.vue`).
  This introduces browser-level validation to restrict input to the specified range.
- **\[UI\]** Implemented a dedicated logout button within the mobile sidebar, enabling users to properly log out of their accounts directly from mobile devices.

### 🩹 Patch Changes

- **\[Accessibility\]** Corrected the behavior of skip links to ensure they are only visible and interactive when receiving keyboard focus (e.g., via the Tab key).
  This prevents accidental activation by mouse users.
- **\[Accessibility\]** Enhanced accessibility by enabling the user menu in the header to be opened via the keyboard.
  This ensures keyboard-only users can access account-related actions like Profile or Logout.
- **\[Accessibility\]** Added `orderId` to the order detail button's `aria-label` on order cards for better screen reader context (via translation key update).
- **\[Architecture\]** Standardized date presentation by updating the `formatLocaleDate` utility.
  It now consistently outputs dates in a short numeric format and is being reused across various parts of the application.
  The function's signature has changed: it now requires a `Date` object as input, with date string parsing delegated to the calling code.
- **\[Performance\]** Modified the `useBreadcrumbs()` composable to generate relative URLs instead of absolute URLs.
  This prevents Nuxt from treating breadcrumb links as external, which previously caused unnecessary full page reloads.
  Navigation via breadcrumbs now uses client-side routing.
- **\[Performance\]** Optimized the price range filter by removing the `@update:model-value` event listener from the `SFPriceRangeSlider` component.
  This eliminates redundant API calls that were previously triggered during the slider adjustment process.
- **\[Performance\]** Optimized the `SFModal` and `SFSlideIn` components by designating them as client-only.
  Since their functionality is entirely based on client-side user interaction, this prevents unnecessary server-side rendering and can improve initial page load performance.
- **\[SEO\]** Enhanced URL handling for Product Detail and List Pages during client-side navigation.
  The application now automatically ensures the user lands on the SEO-optimized URL, redirecting from any non-canonical versions if necessary.
- **\[OSP\]** Improved error handling for cases where an order cannot be found. The correct empty state page is now displayed as intended.
- **\[OSP\]** Implemented error handling for failed attempts to fetch order data.
  In case of failure (e.g., network or server error during fetch), the user is now directed to the standard Nuxt error page.
- **\[PDP\]** Corrected visual inconsistencies in the skeleton loader's appearance across different screen widths. The loader now maintains proper alignment and styling at all relevant breakpoints.
- **\[PDP\]** Resolved a hydration mismatch error related to product subscriptions.
  The fix ensures that product subscription data is fetched and included during server-side rendering (SSR),
  preventing inconsistencies between the server-generated HTML and the client-side render.
- **\[Unit Testing\]** Updated unit tests to import and use `buyXGetYPromotionFactory` with the correct casing from the `@scayle/storefront-nuxt` package, replacing the previously used incorrect `buyXgetYPromotionFactory`.
- **\[Unit Testing\]** Added a global `vi.mock()` for the `routeChangeTrackingObserver.global.ts` middleware.
  This intercepts the middleware import during tests and provides a dummy function (`vi.fn()`) instead.
  This is necessary because the original middleware's `setTimeout` could attempt to access the DOM (document) after happy-dom was destroyed, causing errors.
  Global mocks are now managed in the renamed `test/vitest-setup/storefront.ts`.
  - Renamed `test/vitest-setup/storefront-nuxt.ts` to `test/vitest-setup/storefront.ts` to define global mocks.

### 🏡 Dependency Updates

- Added dependency `@scayle/storefront-promotions@0.1.1`
- Added dependency `defu@6.1.4`
- Added dependency `swiper@11.2.6`
- Added dependency `@contentful/rich-text-types@17.0.0`
- Added dependency `debug@4.4.0`
- Removed dependency `check-password-strength@3.0.0`
- Removed dependency `nuxt-swiper@1.2.2`
- Updated dependency `@contentful/live-preview@4.6.11` to `@contentful/live-preview@4.6.12`
- Updated dependency `@nuxt/fonts@0.11.0` to `@nuxt/fonts@0.11.1`
- Updated dependency `@scayle/nuxt-image-provider@0.2.4` to `@scayle/nuxt-image-provider@0.2.5`
- Updated dependency `@scayle/nuxt-opentelemetry@0.7.1` to `@scayle/nuxt-opentelemetry@0.9.4`
- Updated dependency `@scayle/storefront-nuxt@8.12.1` to `@scayle/storefront-nuxt@8.21.0`
- Updated dependency `@scayle/storefront-product-detail@1.1.3` to `@scayle/storefront-product-detail@1.1.4`
- Updated dependency `@scayle/storefront-product-listing@1.3.1` to `@scayle/storefront-product-listing@1.3.2`
- Updated dependency `@storyblok/nuxt@6.2.3` to `@storyblok/nuxt@6.2.4`
- Updated dependency `@storyblok/richtext@3.0.2` to `@storyblok/richtext@3.2.0`
- Updated dependency `@storyblok/vue@8.1.11` to `@storyblok/vue@8.2.2`
- Updated dependency `@vueuse/components@13.0.0` to `@vueuse/components@13.1.0`
- Updated dependency `@vueuse/core@13.0.0` to `@vueuse/core@13.1.0`
- Updated dependency `@vueuse/integrations@13.0.0` to `@vueuse/integrations@13.1.0`
- Updated dependency `@vueuse/nuxt@13.0.0` to `@vueuse/nuxt@13.1.0`
- Updated dependency `axios@1.8.3` to `axios@1.8.4`
- Updated dependency `consola@3.4.1` to `consola@3.4.2`
- Updated dependency `contentful@11.5.8` to `contentful@11.5.13`
- Updated dependency `contentful-export@7.21.32` to `contentful-export@7.21.42`
- Updated dependency `dompurify@3.2.4` to `dompurify@3.2.5`
- Updated dependency `dotenv@16.4.7` to `dotenv@16.5.0`
- Updated dependency `maska@3.1.0` to `maska@3.1.1`
- Updated dependency `nanoid@5.1.4` to `nanoid@5.1.5`
- Updated dependency `nuxi@3.23.0` to `nuxi@3.24.1`
- Updated dependency `storyblok-js-client@6.10.10` to `storyblok-js-client@6.10.11`
- Updated dependency `ufo@1.5.4` to `ufo@1.6.1`
- Updated dependency `@changesets/cli@2.28.1` to `@changesets/cli@2.29.0`
- Updated dependency `@eslint/eslintrc@3.3.0` to `@eslint/eslintrc@3.3.1`
- Updated dependency `@nuxt/eslint@1.2.0` to `@nuxt/eslint@1.3.0`
- Updated dependency `@nuxt/image@1.9.0` to `@nuxt/image@1.10.0`
- Updated dependency `@scayle/eslint-config-storefront@4.4.1` to `@scayle/eslint-config-storefront@4.5.0`
- Updated dependency `@types/node@22.13.10` to `@types/node@22.14.1`
- Updated dependency `@typescript-eslint/scope-manager@8.26.1` to `@typescript-eslint/scope-manager@8.29.1`
- Updated dependency `@typescript-eslint/utils@8.26.1` to `@typescript-eslint/utils@8.29.1`
- Updated dependency `@upstash/redis@1.34.5` to `@upstash/redis@1.34.7`
- Updated dependency `eslint@9.22.0` to `eslint@9.24.0`
- Updated dependency `nuxt-svgo@4.0.15` to `nuxt-svgo@4.0.17`
- Updated dependency `storyblok@3.35.2` to `storyblok@3.36.0`
- Updated dependency `typescript@5.8.2` to `typescript@5.8.3`
- Updated dependency `unimport@4.1.2` to `unimport@4.2.0`

## 1.8.0

### 🔥 Highlights

#### ✨ Streamlined CMS Integration in SCAYLE Storefront

We've streamlined our CMS integration to simplify setup, boost performance, and focus on content pages. A new static placeholder CMS provider (`scayle`) makes initial setup for development purposes a breeze . Content fetching and display are also improved with new components like `CMSProductListingPageTeaser` and `CMSContentPage`, replacing older, less efficient methods. We've also removed service page support from the Storyblok and Contentful integrations, concentrating our efforts on content pages for a more streamlined experience.

#### 🔑 Revamped Login & Registration

We've completely overhauled our login and registration process for a smoother, more user-friendly experience. Enjoy a cleaner login interface with simplified customization options for tenants. The redesigned registration flow now includes guest registration and support for IDP registration, along with prominent links to privacy and terms. Password resets are also streamlined with a new UI and improved security. Finally, we've boosted performance with server-side rendering and simplified data handling. These enhancements provide a more accessible and efficient login and registration journey for all users.

#### 🛍️ Order Success Page Refresh

We've polished the Order Success Page (OSP) to provide a more enjoyable and informative post-purchase experience. Improvements include a visually refreshed greeting box, a redesigned order information section for improved clarity, and a simplified cost summary for easier understanding. These updates create a cleaner, more user-friendly OSP.

#### 🔍 Optimized Search Results Page

We've redesigned the Search Results Page for a smoother, more consistent browsing experience. Leveraging existing components, it now shares the same structure and styling as the Product Listing Page. We've also streamlined filtering, dynamically hiding filter options when no results are found. Sorting is now automatic by relevance, simplifying the interface and prioritizing the most pertinent results. These changes create a cleaner, more user-friendly search experience.

### 🚀 Major Changes

- **\[CMS\]** Introducing a new static CMS placeholder provider `scayle`, that simplifies the initial setup process for Storefront Applications.
  The `scayle` static CMS placeholder delivers a single CMS page as static content, eliminating the need for access tokens, tenant space IDs, and other configuration typically required when setting up a Storefront Applications and CMS.
  This new provider is intended for development purposes only and should not be used in production environments.
- **\[CMS\]** The `CMSCategoryData` fetching component has been removed and
  replaced by the newly introduced `CMSProductListingPageTeaser` component.
  This new component is designed to handle the rendering of teaser images and manage
  the associated data fetching for each CMS provided.
  - Example Usage on PLP:

    ```vue
    <template>
      <div class="flex flex-col">
        <CMSProductListingPageTeaser :category-id="currentCategoryId" />
      </div>
    </template>
    ```

- **\[CMS\]** The `CMSServicePageData`component, responsible for fetching content data for service pages (`/pages/s/[slug].vue`), has been removed from all CMS providers.
  Going forwards the Storefront Boilerplate CMS integration for Storyblok and Contentful are only supporting content pages (`/pages/content/[slug].vue`).
- **\[CMS\]** The `CMSPage` component has been removed from the Storefront Boilerplate and replaced with the new `CMSContentPage` component.
  This change aligns the homepage structure with the refactored CMS content types in Storyblok and Contentful.
  The `CMSContentPage` component directly renders the `CMSStory` component, eliminating the overhead of custom dynamic component loading.
  Additionally, the introduction of status-specific slots within `CMSContentPage` simplifies data fetching and handling by providing a more structured and predictable approach compared to the previous awaited fetching method in CMSPage.
  This change improves the overall maintainability and performance of the homepage.
  - Example Usage:

    ```vue
    <template>
      <!-- `pages/index.vue` -->
      <CMSContentPage slug="homepage" data-testid="home-page-content">
        <template #loading>
          <!-- Skeleton loader -->
        </template>
      </CMSContentPage>
    </template>
    ```

- **\[Login & Registration\]** The login user interface has been enhanced to provide a cleaner, more user-friendly experience and greater flexibility for tenant customization.
  The updated user interface features a standard login form with email and password fields, providing a familiar and intuitive login process.
  Existing integrations with external Identity Providers (IDPs) like Google remain unaffected by these changes.
  A key improvement in this update is the removal of IDP-specific styles that were previously embedded in the login user interface.
  This change simplifies the UI and empowers tenants to fully customize the styling and branding of their login experience, ensuring seamless integration with their overall website design.
- **\[Login & Registration\]** The user registration process has been completely redesigned for a more intuitive and streamlined experience.
  The new flow features a redesigned registration form with fields for gender, first name, last name, email, and password.
  A guest registration option simplifies the process for users who prefer not to create an account, omitting the password field.
  Support for IDP registration has been integrated, offering a secure and convenient way to sign up using existing identity providers.
  This implementation maintains a consistent and clean style, mirroring the design of the login page.
  Furthermore, prominent links to the privacy policy and terms of service are now displayed during registration, ensuring user awareness and compliance.
- **\[Login & Registration\]** The forgot password process has been redesigned with a new user interface.
  A `"forgot password"` button on the login page now opens a slide-in form for requesting a password reset link.
  The reset link directs users to the sign-in page, where another slide-in form allows them to set a new password.
  Email validation and other improvements ensure a smooth and secure password reset experience.
- **\[Login & Registration\]** Users will experience a smoother and more accessible login process.
  The login/registration flow has been redesigned with a focus on simplicity and accessibility.
  Changes include:
  - **UI/UX:** Simplified layout, updated styling for text input fields and gender selection, and enhanced accessibility features (improved semantics and keyboard navigation).
  - **Functionality:** Standardized handling of `redirectUrl` to ensure users are redirected to their intended destination after login. Improved form validation and more informative error messages displayed in a dedicated error container. Successful logins are now confirmed with a toast notification.
  - **Performance:** Implemented SSR for the signin page, resulting in faster initial load times. Removed client-side handling of the last logged in user information, eliminating the need for local storage management and further improving performance.
- **\[OSP\]** Improved the look and feel of the greeting box.
- **\[OSP\]** The order information section has been redesigned for a clearer and more user-friendly experience.
- **\[OSP\]** The cost summary on the Order Success Page has been simplified to improve clarity and user experience.
- **\[Search\]** The Search Results Page has undergone a redesign to create a more consistent and user-friendly experience.
  By leveraging composables from `@scayle/storefront-product-listing`, the page now shares the same underlying structure and styling as the Product Listing Page, providing a unified browsing experience.
  The filtering functionality has been streamlined; the filters button is now dynamically hidden when no search results are returned, reducing visual clutter.
  Additionally, the sorting button has been removed as search results are now automatically sorted by relevance, simplifying the user interface and prioritizing the most relevant results.
  This redesign enhances usability and improves the overall search experience.

### 💅 Minor Changes

- **\[Architecture\]** Simplified component prop declarations by leveraging [Vue's reactive destructuring](https://vuejs.org/guide/components/props.html#reactive-props-destructure).
  This allows for more concise and readable prop definitions, reducing boilerplate code.
  - Example:

    ```vue
    <script setup lang="ts">
    // Using reactive props destructure
    const { name = '' } = defineProps<{ name?: string }>()

    // Alternatively, defining props with `withDefaults` without destructuring
    const props = withDefaults(defineProps<{ name?: string }>(), { name: '' })
    </script>
    ```

- **\[Architecture\]** Improved the Storefront Application's internationalization (i18n) implementation by switching to direct usage of the `useI18n` composable within the `setup` script blocks.
  This approach offers several advantages over accessing i18n through `useNuxtApp`:
  - **Simplicity**: Directly using `useI18n` is simpler and more intuitive, reducing the complexity of code.
  - **Performance**: Accessing `useI18n` directly can be more performant as it avoids the additional overhead of going through `useNuxtApp`.
  - **Type Safety**: Direct usage often provides better TypeScript support, ensuring type safety and better developer experience.
  - **Readability**: It makes the code more readable and maintainable by clearly indicating the use of i18n functionalities.

  However, it's important to note that this change introduces a constraint: `useI18n` must now be called directly within the `setup` script.
  Attempting to use it within other composables that are not called within setup will result in an error.
  This trade-off is considered acceptable given the overall benefits of this optimization.

- **\[Architecture\]** Improved the reactivity of several key composables (`useSubscription`, `useProductBaseInfo`, `useRowIntersection`, useProductPromotions, `useProductPrice`, `usePagination`, and `useBasketPromotionReductions`) by optimizing how getter values are passed and explicitly using `toRef` where needed.
  This ensures consistent and predictable reactivity throughout the application. For more details, see the [Vue documentation on prop passing](https://vuejs.org/guide/components/props.html#passing-destructured-props-into-functions).
- **\[Architecture\]** Integrated the `@scayle/nuxt-image-provider` Nuxt module to optimize image delivery and leverage the full capabilities of the SCAYLE CDN.
  This module introduces a dedicated provider for `@nuxt/image`, enabling support for SCAYLE-specific image modifiers that provide greater control over image transformations and optimizations.
  The module also includes the `ScayleImg` and `ScaylePicture` components, which offer a simplified way to integrate images optimized for SCAYLE CDN within your application.
  This enhancement improves image performance, reduces bandwidth consumption, and simplifies image management.
- **\[Architecture\]** Enforced consistent `defineEmits` [`type-literal`](https://eslint.vuejs.org/rules/define-emits-declaration.html#type-literal) syntax using the [`vue/define-emits-declaration`](https://eslint.vuejs.org/rules/define-emits-declaration.html#vue-define-emits-declaration) ESLint rule.
  - Before:

    ```vue
    <script setup lang="ts">
    const props = defineProps(['foo', 'bar'])
    // or
    const emit = defineEmits<{
      (e: 'foo', id: number): void
      (e: 'bar', value: string): void
    }>()
    </script>
    ```

  - After:

    ```vue
    <script setup lang="ts">
    const emit = defineEmits<{
      foo: [id: number]
      bar: [value: string]
    }>()
    </script>
    ```

- **\[Accessibility\]** The `SFProductCard` component now has a role of `"link"` and the `SFProductImage`component within the `SFProductGallery` component now has a role of `"button"`.
  This improves how these elements are interpreted by screen readers and other assistive devices.
- **\[Accessibility\]** Improved the accessibility of the side navigation open button by providing an `aria-label`.
- **\[Accessibility\]** Refactored the keyboard interaction logic for the `SFSlideIn` component within the local `storefront-ui` module.
  The core keyboard behavior, including focus trapping, tab order management, and 'Esc' key functionality, is now centralized within the `SFSlideIn` component.
  This change eliminates redundant code in individual slide-in instances (e.g., `SFFilterSlideIn.vue`) and ensures consistent accessibility features across all slide-in components.
- **\[Accessibility\]** Improved the accessibility of the `SFSearchInput` component by adding an `aria-placeholder` attribute to the input field, providing better support for assistive technologies.
- **\[Accessibility\]** Enhanced the accessibility of the `SFQuantityInput` component by adding an `aria-label` attribute to the input field.
- **\[Accessibility\]** Enhanced filter accessibility by adding `aria-label` attributes to filter elements, including the price range slider, size selection checkboxes, and the close button.
  This improvement makes filtering more accessible for users of assistive technologies such as screen readers.
- **\[Accessibility\]** Improved accessibility for screen readers on the search button (`SFSearchInput` component).
  Using `aria-hidden=true` now correctly conveys the button's function to assistive technologies.
- **\[Authentication\]** Refactored `/middleware/authGuard.global.ts` to conditionally fetch user data, skipping the process when an unprotected route is accessed.
  This optimization reduces the number of network requests and improves page load times.
- **\[Authentication\]** Strengthened application security by centralizing route access control using route names within the global authentication guard (`/middleware/authGuard.global.ts`).
  The list of available routes (`/utils/route.ts`) has been updated to contain all available routes to support this enhancement.
- **\[Authentication\]** A redirect fallback to the homepage has been added for authentication flows.
  If no redirect URL is present in the query parameters, users will now be redirected to the homepage after authentication.
  This provides a smoother experience and prevents potential redirect errors.
- **\[Build\]** The file watcher has been configured to ignore files that are not relevant to the build process.
  This optimization reduces the workload on the watcher and improves overall build times during local development.
- **\[CMS\]** The `CMSAppFooterData` component has been removed from all CMS providers.
  This component was previously used to fetch and render footer links, but this approach has been replaced by a more efficient and centralized method.
  Footer content is now managed through dedicated composables from the `@scayle/storefront-nuxt` package and configured using [SCAYLE Navigation](https://scayle.dev/en/user-guide/shops/storefront/navigation) in the Panel.
  This change reduces code duplication and simplifies maintenance while providing a more consistent and flexible approach to managing footer links.
- **\[Login & Registration\]** Enhanced the `404` error message to provide clearer and more user-friendly guidance.
- **\[Login & Registration\]** The gender selection dropdown on the login and registration pages has been visually enhanced to seamlessly integrate with the design of the text input fields.
  This change creates a more cohesive and user-friendly form experience.
- **\[E2E\]** Expanded the promotions end-to-end test suite with scenarios covering the display and hiding of terms and conditions within the promotion tile, ensuring correct functionality.
- **\[E2E\]** Implemented E2E tests covering the resolution of matched pages and result accuracy in the Search feature when searching by product reference key.
  This ensures that searches using product reference keys consistently return the expected results.
- **\[E2E\]** Implemented end-to-end tests to verify the accuracy of SEO data on the Product Details, Basket, and Wishlist pages.
- **\[E2E\]** Expanded E2E test coverage to include validation of the `variantId` URL parameter on PDPs for products with multiple sizes and available variants.
- **\[E2E\]** Added Guest User Registration E2E Test: A new end-to-end test has been implemented to cover the complete guest user registration process.
  This test validates the functionality and user flow of registering as a guest, ensuring a smooth and error-free experience.
- **\[E2E\]** Implemented an end-to-end test to verify the display of product variant availability information on the Product Details Page (PDP).
- **\[E2E\]** Implemented end-to-end tests to verify the behavior of updating product quantities in the basket, considering different maximum available quantity thresholds.
- **\[E2E\]** Implemented additional step in Order Success Page end-to-end test to verify page SEO data.
- **\[E2E\]** Implemented an end-to-end test to verify the display of sold-out products in the user's basket.
- **\[E2E\]** Implemented end-to-end tests for the Order Success page, covering the following key components:
  Greeting box, Payment details, Order details, Delivery address, Product card, Price summary, and CTA buttons.
  These tests ensure that the page renders correctly and all interactive elements function as expected after a user completes an order.
- **\[E2E\]** Expanded E2E test coverage to verify default Store Locator visibility on PDPs for one-sized products.
- **\[E2E\]** Implemented end-to-end tests to validate the accuracy of SEO data on the PLP for default views, filtered results, and sorted listings.
- **\[E2E\]** Implemented an end-to-end test to verify the handling of registration attempts with an existing email address.
- **\[E2E\]** Implemented an end-to-end test to verify the password reset process.
- **\[E2E\]** Implemented an end-to-end test to verify the functionality of the password visibility toggle on the Registration page.
- **\[E2E\]** Implemented an end-to-end test to verify the Order Success Page behavior when accessed with an incorrect CBD token.
- **\[E2E\]** Implemented end-to-end tests to verify the complete password reset process, including both successful resets and error handling.
- **\[E2E\]** Implemented end-to-end tests to verify the `variantId` URL parameter behavior on Product Detail Pages (PDPs) for both available one-size products and sold-out variants of multi-size products.
- **\[E2E\]** Implemented an end-to-end test to ensure the Country Detection modal operates correctly, even when another flyout is already open.
- **\[E2E\]** Implemented end-to-end tests to cover the functionality of increasing and decreasing the quantity of free promotional items within the basket.
- **\[E2E\]** Implemented E2E tests to verify the SEO data on the Login and Registration pages.
- **\[Orders\]** The `Order` type is improved by introducing a new generic `Order<Product, Variant>`
  type. The related order helpers are now part of the Storefront Boilerplate and are used within `usePurchaseEvents`, where the `useOrder` generic is now ensuring correct order detail types.
- **\[Search\]** Migrated to search utilities from `@scayle/storefront-search` and `@scayle/storefront-product-listing`, replacing the existing implementation and allowing for improved upgradability and feature updates.
- **\[Search\]** Migrated from `useSearchData` to `useSearch` from `@scayle/storefront-search`, providing improved upgradability and feature updates.
- **\[SEO\]** Add redirect to correct PDP URL when the PDP URL does not match the expected format.
- **\[SEO\]** Added [OnlineStore](https://schema.org/OnlineStore) schema to homepage.
- **\[SEO\]** Added missing meta data to the wishlist page.
- **\[SEO\]** Modified `/pages/p/[...productName]-[id].vue` to utilize the [ProductGroup JSON-LD schema](https://schema.org/ProductGroup).
- **\[SEO\]** Implemented an optional `variantId` query parameter for PDP URLs. When this parameter is present and contains a valid variant ID, the corresponding product variant will be preselected on page load.
  This improvement enables deep linking to specific product variations and enhances user experience.
- **\[Navigation\]** The Navigation's `SFNavigationTreeItem` now uses [`<ScayleImg>`](https://www.npmjs.com/package/@scayle/nuxt-image-provider) for rendering and loading SVG icons, replacing the previous `<object>` method.
  This addresses layout shifts that occurred due to delayed SVG loading and resolves console errors encountered in certain browsers stemming from `content-security-policy` discrepancies.
  All SVG icons loaded within the NavigationTree items also now use the `preload` attribute for enhanced loading performance.
  The initial approach with the `<object>` tag was intended to enable modifications to the icon's visual appearance, such as color,
  but caused issues with browser `content-security-policy` settings, leading to delayed SVG loading and layout shifts for each navigation tree item displaying an SVG icon.
  The `<object>`-based implementation can be easily reinstated if needed.
- **\[Tooling\]** Updated the OpenTelemetry configuration to capture common headers in span attributes.
- **\[Tooling\]** Introducing [license-checker](https://github.com/davglass/license-checker) to generate a license overview file (`node-licenses.csv`) of used project dependencies.
  This is crucial for managing legal compliance and risk, ensuring that all used dependencies' licenses are compatible
  with the projects commercial software's licensing model. This automated overview simplifies audits,
  minimizes potential legal issues, and streamlines the process of addressing license conflicts.

### 🩹 Patch Changes

- **\[Accessibility\]** Removed arrow key handling from the focus change logic in the following components to align with [WCAG accessibility guidelines for keyboard navigation](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#fundamentalkeyboardnavigationconventions).
  - Removed all arrow key navigation in `/modules/ui/runtime/components/core/SFSlideIn.vue`
  - Removed left and right arrow key navigation in `/components/layout/headers/SFHeaderNavigationItem.vue`
  - Removed left and right arrow key navigation in `/modules/ui/runtime/composables/useDropdownKeyboardBehavior.ts`
- **\[Account Area\]** Modified the `pickElements` function within the `SFAddressSummary` component to support the new `OrderAddress` type from `@scayle/storefront-nuxt@8.10`.
  This update narrows and clarifies the supported types.
- **\[CMS\]** Fixed missing product data in `CmsProduct` click event.
  The `clickProduct` event in the `CmsProduct` component was not correctly emitting product data.
  This issue has been resolved, and the event now includes the necessary product information when triggered.
  - Related Components:
    - Storyblok: `/modules/cms/providers/storyblok/components/Product.vue`
    - Contentful: `/modules/cms/providers/contentful/components/Product.vue`
- **\[Code Style\]** Improved clarity and consistency of `ExistingItemHandling` value names within `/composables/usePromotionGiftSelection.ts`, `/composables/useBasketActions.ts`, and `/composables/useBasketActions.nuxt.test.ts`
- **\[Config\]** Improved Redis connection stability by adding `maxRetriesPerRequest` to prevent indefinite hangs.
- **\[Config\]** Extended the `PublicShopConfig` interface with a new property: `countryCode`.
  This addition addresses the need to distinguish shops based on region, especially in cases where the locale (language) is the same but the target country is different.
  This allows for proper identification of shops in scenarios like Germany having both `de_DE` (German) and en_US (English) storefronts, where the locale alone is insufficient.
- **\[E2E\]** Adapted the Search results page E2E tests to account for the updated design, specifically for scenarios with no search results.
- **\[E2E\]** Improved stability of guest user registration E2E test by handling Toast message and User popover overlap.
- **\[E2E\]** Enhanced the stability of end-to-end tests for PLP Filters and Pagination across all browsers during parallel test runs.
- **\[E2E\]** Enhanced the reliability of end-to-end tests covering Search page Filters, ensuring consistent execution across all browsers when running in parallel.
- **\[E2E\]** Increased the reliability of logged-in user hydration tests by adding timeout waits to mitigate potential RPC issues.
- **\[E2E\]** Improved the hydration error tests by differentiating between guest and logged-in user contexts. Guest user tests now validate empty states for pages like Wishlist and Basket, while logged-in user tests verify pre-populated states. The scope of hydration testing has been expanded to include additional URLs defined in `/playwright/support/pages-hydration-check.json`. Error reporting has also been enhanced to provide more specific arguments and context for improved debugging.
- **\[E2E\]** Enhanced the stability of end-to-end tests for basket summary price verification with promotion products, specifically for mobile browser execution.
- **\[E2E\]** Enhanced the "Verify PDP Multi-size product Store selector" end-to-end test to ensure the store selector flyout closes after store selection.
- **\[E2E\]** Adapted existing end-to-end tests to accommodate the recent design changes to the Login and Registration pages.
- **\[E2E\]** Enhanced the reliability of the Country Detector end-to-end test in CI environments by addressing Safari-specific performance characteristics.
- **\[E2E\]** Updated end-to-end tests for the Account, Wishlist, and Basket features to accommodate the recent changes to login redirection.
  Tests now verify correct redirection after successful login.
- **\[OSP\]** Fixed an edge case within the `SFOspProductCard` component where the OSP would throw an error if a product variant was missing a size attribute.
  This scenario is rare but could occur under specific circumstances. The issue stemmed from a missing optional chaining operator when accessing the size attribute.
  This has been corrected by adding the necessary optional chaining operator (`?.`) to the size attribute accessor.
- **\[PDP\]** Product data is now loaded lazily by setting the `lazy` option of to `true`.
  This change allows for variant preselection during Server-Side Rendering (SSR) and ensures that an appropriate HTTP error status code is returned if product data fetching fails.
- **\[Search\]** The search result counter is now hidden while loading results.
- **\[Search\]** The search functionality now handles whitespace-only search queries more effectively.
  Instead of performing a search, these queries are now ignored, preventing unnecessary API calls and providing a smoother user experience.
- **\[SEO\]** Improved SEO by switching the [BreadcrumbList JSON-LD schema-based markup](https://schema.org/BreadcrumbList) to use absolute URLs.
  This change ensures search engines can correctly interpret the website's structure.
- **\[UI\]** Use [color](https://github.com/Qix-/color) for RGBA manipulation and replacing the redundant `hexToRGBAColor` utility.
- **\[UI\]** Input labels are now truncated when their text content exceeds the width of the corresponding input field.
  This prevents labels from overflowing and overlapping other UI elements, maintaining a clean and organized interface.
- **\[UI\]** The `SFBasketPopoverItems` component now displays sold-out items, providing users with a clearer view of all items in their basket, regardless of availability.
- **\[UI\]** After refactoring to use prop destructuring in the `SFProductCardBadgesFooter` component, the default value of the `isPromotionBadgeFullWidth` prop was not being applied correctly.
  This has been fixed, restoring the intended default behavior.
- **\[UI\]** Implemented a focus trap in the `SFModal` component to maintain responsiveness when a `SFSlideIn` is also open.
- **\[UI\]** The `isGiftSelectionShown` property in `SFProductPromotionSelectionModal` is now reset when the component is unmounted, preventing the modal from persisting across page navigation.
- **\[UI\]** The `SFPriceInput` component now only emits the `update:model-value` event when the input value actually changes, preventing unnecessary updates.
- **\[UI\]** Resolved a layout issue with the filter button within the `/pages/c/[...categories]/[...slug]-[id].vue` component.
- **\[UI\]** Fix sticky behavior of category side navigation in `/pages/c/[...categories]/[...slug]-[id].vue`.

### 🏡 Dependency Updates

- Added dependency `@scayle/nuxt-image-provider@0.2.4`
- Added dependency `@scayle/storefront-navigation@0.1.0`
- Added dependency `@scayle/storefront-search@0.2.1`
- Added dependency `jiti@2.4.2`
- Added dependency `license-checker@25.0.1`
- Removed dependency `globby@14.0.2`
- Updated dependency `@contentful/live-preview@4.6.5` to `@contentful/live-preview@4.6.11`
- Updated dependency `@nuxt/fonts@0.10.3` to `@nuxt/fonts@0.11.0`
- Updated dependency `@scayle/nuxt-opentelemetry@0.5.7` to `@scayle/nuxt-opentelemetry@0.7.1`
- Updated dependency `@scayle/omnichannel-nuxt@4.0.4` to `@scayle/omnichannel-nuxt@4.2.0`
- Updated dependency `@scayle/storefront-country-detection@1.1.0` to `@scayle/storefront-country-detection@1.1.1`
- Updated dependency `@scayle/storefront-nuxt@8.6.0` to `@scayle/storefront-nuxt@8.12.1`
- Updated dependency `@scayle/storefront-product-detail@1.0.2` to `@scayle/storefront-product-detail@1.1.3`
- Updated dependency `@scayle/storefront-product-listing@1.1.3` to `@scayle/storefront-product-listing@1.3.1`
- Updated dependency `@storyblok/nuxt@6.2.2` to `@storyblok/nuxt@6.2.3`
- Updated dependency `@storyblok/vue@8.1.10` to `@storyblok/vue@8.1.11`
- Updated dependency `@vueuse/components@12.5.0` to `@vueuse/components@13.0.0`
- Updated dependency `@vueuse/core@12.5.0` to `@vueuse/core@13.0.0`
- Updated dependency `@vueuse/integrations@12.5.0` to `@vueuse/integrations@13.0.0`
- Updated dependency `@vueuse/nuxt@12.5.0` to `@vueuse/nuxt@13.0.0`
- Updated dependency `axios@1.7.9` to `axios@1.8.3`
- Updated dependency `color@4.2.3` to `color@5.0.0`
- Updated dependency `consola@3.4.0` to `consola@3.4.1`
- Updated dependency `contentful@11.4.4` to `contentful@11.5.8`
- Updated dependency `contentful-export@7.21.20` to `contentful-export@7.21.32`
- Updated dependency `maska@3.0.4` to `maska@3.1.0`
- Updated dependency `nanoid@5.0.9` to `nanoid@5.1.4`
- Updated dependency `nuxi@3.21.1` to `nuxi@3.23.0`
- Updated dependency `schema-dts@1.1.2` to `schema-dts@1.1.5`
- Updated dependency `storyblok-js-client@6.10.7` to `storyblok-js-client@6.10.10`
- Updated dependency `@changesets/cli@2.27.12` to `@changesets/cli@2.28.1`
- Updated dependency `@eslint/eslintrc@3.2.0` to `@eslint/eslintrc@3.3.0`
- Updated dependency `@nuxt/eslint@1.0.0` to `@nuxt/eslint@1.2.0`
- Updated dependency `@nuxt/test-utils@3.15.4` to `@nuxt/test-utils@3.17.2`
- Updated dependency `@types/node@22.12.0` to `@types/node@22.13.10`
- Updated dependency `@typescript-eslint/scope-manager@8.22.0` to `@typescript-eslint/scope-manager@8.26.1`
- Updated dependency `@typescript-eslint/utils@8.22.0` to `@typescript-eslint/utils@8.26.1`
- Updated dependency `@upstash/redis@1.34.3` to `@upstash/redis@1.34.5`
- Updated dependency `@vitest/coverage-v8@2.1.8` to `@vitest/coverage-v8@2.1.9`
- Updated dependency `@vue/typescript-plugin@2.2.0` to `@vue/typescript-plugin@2.2.8`
- Updated dependency `autoprefixer@10.4.20` to `autoprefixer@10.4.21`
- Updated dependency `eslint@9.19.0` to `eslint@9.22.0`
- Updated dependency `fishery@2.2.2` to `fishery@2.2.3`
- Updated dependency `happy-dom@16.7.3` to `happy-dom@17.4.4`
- Updated dependency `lint-staged@15.4.3` to `lint-staged@15.5.0`
- Updated dependency `nuxt@3.14.1592` to `nuxt@3.15.4`
- Updated dependency `nuxt-svgo@4.0.14` to `nuxt-svgo@4.0.15`
- Updated dependency `pathe@2.0.2` to `pathe@2.0.3`
- Updated dependency `postcss@8.5.1` to `postcss@8.5.3`
- Updated dependency `typescript@5.7.3` to `typescript@5.8.2`
- Updated dependency `unimport@4.0.0` to `unimport@4.1.2`
- Updated dependency `vitest@2.1.8` to `vitest@2.1.9`
- Updated dependency `vue-tsc@2.2.0` to `vue-tsc@2.2.8`

## 1.7.1

### 💅 Minor Changes

- **\[Search\]** Fixed an issue where pressing enter in the search input didn't navigate to the first suggestion. Now, pressing enter will navigate to the first suggestion, or to the search results page if there are no suggestions.
- **\[E2E\]** Added an end-to-end test to verify that the product details page loads correctly after a product ID search is performed by pressing Enter. This addresses a previous issue where the product details page might not have loaded correctly in this scenario.

## 1.7.0

### 🔥 Highlights

#### 🛒 Basket Enhancements for a Streamlined Shopping Experience

This release delivers a significantly enhanced basket experience, prioritizing user clarity, streamlined functionality, and a smoother checkout process. We've refined the basket's underlying architecture and SEO performance through comprehensive component refactoring and metadata improvements. Key enhancements include clear labeling of sold-out items, prominent badging for promotional offers, a helpful voucher disclaimer, and integrated subscription details directly on relevant items. Transparency is further improved with a detailed breakdown of all discounts in the basket summary.

Visually, the basket boasts a refreshed design, featuring updated empty basket and wishlist states and a redesigned item card. A new confirmation modal prevents accidental deletions, while a convenient basket preview in the top navigation allows for quick access and management. The checkout flow is streamlined with a dedicated final summary section, clearly displaying the final price and a direct checkout link.

Under the hood, we've implemented new utility functions for precise price calculations, along with summaries of applied promotions and regular product prices for increased transparency. Promotional gifts are now automatically added to your basket for a seamless shopping experience.

#### 🧑‍🦯 Pushing Accessibility

We're committed to making our products accessible to all users. This release delivers key improvements to create a smoother, more inclusive experience.

Navigation is now easier with improvements for keyboard users throughout product listings and other areas. Interactive elements like search inputs and dropdowns are now easier to use.

We've also made information on product pages and account settings clearer and easier to understand through improved structure and organization. These updates demonstrate our continued focus on accessibility and delivering the best possible experience for all our customers.

#### 🏗️ Architectural Improvements

This release features key architectural enhancements focused on dependency management, Nuxt configuration, and component organization within tenant projects.

We've significantly improved the robustness and maintainability of our Google Tag Manager integration by migrating to a locally maintained module, @scayle/nuxt-gtm. This transition leverages the latest advancements in @gtm-support/vue-gtm, resulting in performance gains, bug fixes, and simplified dependency management.

Additionally, our Nuxt configuration now adopts the recommended bundler module resolution, aligning with Vite/Vue best practices and improving third-party library compatibility. This update ensures correct imports for packages with well-defined exports, simplifying development and reducing potential conflicts.

Finally, to better support tenant project development, we've introduced a standardized naming convention for local application components, prefixing them with SF. This enhances code readability and maintainability, while providing a clear distinction between Storefront Boilerplate components and tenant-specific customizations. This separation is essential for streamlined CLI management and update processes, preventing unintended overwrites and ensuring a smooth development experience.

### 🚀 Major Changes

- **\[Basket\]** Refactored the basket summary component to integrate `SFBasketSummaryMobile` into `SFBasketSummary` for centralized logic.
- **\[Basket\]** Sold-out items in the basket now display an additional title to clearly indicate their unavailability.
  **\[Basket\]** Added structured data and metadata to the basket page for improved SEO performance.
- **\[Basket\]** Added a visual badge to basket cards to clearly indicate when a promotional offer is applied to an item.
- **\[Basket\]** Added a voucher disclaimer to the basket page.
- **\[Basket\]** Introduced a new UI design for empty basket and wishlist states. This includes changes to the reusable `SFEmptyState` component.
- **\[Basket\]** Added a utility function called `getTotalPriceWithoutReductions` for calculating the total basket price before any reductions are applied.
- **\[Basket\]** Implemented a new section in the basket view that summarizes applied promotions and their corresponding reductions.
- **\[Basket\]** Implemented functionality to add promotional gifts to the basket if they are not already present.
- **\[Basket\]** Implemented a new section in the basket view that summarizes the prices of regular products, excluding discounts and promotions.
- **\[Basket\]** To streamline the shopping experience, a basket preview has been integrated into the top main navigation. This allows users to easily view and manage the items in their basket without leaving their current page, improving accessibility and convenience.
- **\[Basket\]** To provide greater transparency about discounts applied to the basket, a new section has been added to the basket summary. This section clearly displays both campaign-related discounts and sale reductions, allowing customers to easily understand how their final price is calculated.
- **\[Basket\]** Introduced a new basket item card design and a confirmation modal for deleting items from the basket, improving user experience and preventing accidental deletions.
- **\[Basket\]** To improve transparency and provide users with more information about their subscriptions, subscription details are now displayed on each subscription-relevant basket item.
- **\[Basket\]** To improve the user experience towards the checkout, a dedicated final summary section has been added to the basket page. This section clearly displays the final purchase price and provides a direct link to the checkout page, streamlining the checkout process and making it easier for customers to complete their purchase.
- **\[Basket\]** The basket page layout has been redesigned for improved clarity and organization. The basket item list generation has also been optimized to enhance performance and loading speed. These changes result in a more user-friendly and efficient basket experience.
- **\[Basket\]** Implemented a loading state for the basket page to provide better feedback to users during data fetching. Also added the ability to track `feature` errors using `trackFeatureError()`.
- **\[Architecture\]** To address the risks associated with using an unmaintained dependency and improve the long-term stability of our Google Tag Manager integration, we have replaced `@zadigetvoltaire/nuxt-gtm` with a locally maintained module, `@scayle/nuxt-gtm`. This new module incorporates the most recent version of `@gtm-support/vue-gtm`, benefiting from performance improvements, bug fixes, and ongoing maintenance. This migration also allows us to eliminate a custom patch previously required for compatibility, further simplifying our dependency management.
- **\[Architecture\]** Updated Nuxt configuration (`nuxt.config.ts`) to utilize the recommended `bundler` module resolution introduced in Nuxt v3.10, removing the `future.typescriptBundlerResolution: false` flag. This aligns our project with Vite/Vue best practices and improves compatibility with third-party libraries. While this change is generally beneficial, some packages might encounter issues. If you experience any problems, please report them in the affected library's repository. You can temporarily revert this change by adding `future.typescriptBundlerResolution: false` back to your `nuxt.config.ts` file.

  This update allows for correct imports of third-party packages with well-defined exports, such as:

      ```ts
      import {
        costFactory,
        basketItemsFactory,
      } from '@scayle/storefront-nuxt/test/factories'
      ```

  For further details on bundler module resolution and its advantages, refer to the [official Nuxt blog post](https://nuxt.com/blog/v3-10#bundler-module-resolution).

- **\[Architecture\]** As part of ongoing improvements to support the development and maintenance of tenant projects, all local application components (UI and subscription modules) now have the prefix `SF`. This standardized naming convention brings several benefits: improved code readability and maintainability across the codebase, and clear differentiation between Storefront Boilerplate components and custom components developed by tenants. This clear separation is crucial for the CLI, which will be responsible for managing and updating default components in tenant projects, preventing accidental overwrites and conflicts. See the example below for how this affects component imports.
- **\[Accessibility\]** Removed the unintended shift on hover from the side navigation on product listing pages to improve accessibility.
- **\[Accessibility\]** Addressed an accessibility issue where pagination items were not focusable using the Tab key. Replaced `<span>` elements with `<SFButton>` components to ensure proper keyboard navigation.
- **\[Accessibility\]** Enhanced accessibility of subscription selection dropdowns (`SFProductSubscriptionSelection`) by ensuring focusable elements are used.
- **\[Accessibility\]** RRemoved the focus style from the `input` element within the `SearchInput` component to address an issue where an unintended focus state was displayed on click.
- **\[Accessibility\]** Added `aria-label` and translation to `SFSearchInput` button.
- **\[Accessibility\]** Added the `role="presentation"` attribute to the icon within the `SFNavigationTreeItem` component to improve accessibility and conform with WCAG requirements.
- **\[Accessibility\]** To prevent redundant focusable elements and improve keyboard navigation within the `SFPriceRangeSlider` component, the button element's focusability has been disabled. The slider's dots (provided by `VueSlider`) already provide proper focus handling, making the button's focus redundant and potentially confusing for keyboard users.
- **\[Accessibility\]** Improved the heading structure within the `StoreVariantAvailability` component (used for displaying store variant availability) and account overview page (`account/index.vue`) to better reflect the informational hierarchy of the pages. This improves readability and accessibility for users, making it easier to understand the content. This involved adding new headings where necessary and adjusting existing headings to use the appropriate semantic level.

### 💅 Minor Changes

- **\[UI\]** Removed the `new` prefix that was recently added to icon names, reverting to the previous naming convention. In addition, unused icon files have been removed from the project, reducing the overall bundle size and improving performance. This cleanup also simplifies icon management and reduces the risk of naming conflicts.
- **\[UI\]** Removed the `stop` and `prevent` event modifiers from the `SFButton` component. These modifiers were complicating the reasoning about the expected behavior of buttons in various contexts, potentially leading to unintended side effects. This change simplifies the component's logic and makes it easier to predict how buttons will interact with other elements on the page.
- **\[Subscription\]** Introduced the `itemGroup` property to distinguish between standard and subscription product variants within the basket. This allows customers to add both variants of the same product to their basket simultaneously.
- **\[Subscriptions\]** The quantity selected on the product page is now correctly applied when adding subscription items to the basket. Previously, the quantity might have been reset or ignored.
- **\[Subscriptions\]** Subscription items with different definitions are now added as separate items to the basket instead of updating existing items. This aligns the subscription add-to-basket flow more closely with that of regular products.
- **\[PDP\]** To prevent potentially misleading price displays on product detail pages (`/pages/p/[...productName]-[id].vue`), subscription items in the basket are now ignored when determining the price to display for the corresponding regular product. Previously, the presence of subscription items with potential extra discounts could lead to inaccurate price displays for regular items. This change ensures that the displayed price accurately reflects the price of the regular product itself.
- **\[ShopSwitcher\]** Updated the `ShopSwitcher` component to use a Flyout menu instead of a Dropdown, improving accessibility and user experience.
- **\[ShopSwitcher\]** Introduced `useCurrentShopLocale` and `useCurrentShopTranslators` composables to simplify access to relevant shop localization data for the ShopSwitcher.
- **\[Performance\]** Addressed a hydration mismatch issue in the wishlist page (`/pages/wishlist.vue`) that was impacting performance. The count badge update is now delayed until hydration is complete, and the content is wrapped within an `<SFAsyncDataWrapper>` to ensure proper server/client synchronization. This prevents content flickering and improves the overall loading experience.
- **\[Performance\]** Resolved a hydration mismatch issue in the `SFQuantityInput` component specifically affecting Firefox. The disabled attribute was sometimes missing from the JavaScript DOM Node object, triggering hydration warnings. To prevent these warnings without impacting functionality, the `data-allow-mismatch="attribute"` attribute has been added. This tells the hydration process to tolerate mismatches on this specific attribute.
- **\[Performance\]** The product image zoom gallery is now rendered entirely on the client-side, resulting in significantly improved performance and interactivity. Previously, server-side rendering limitations impacted the gallery's responsiveness. This change ensures a smoother and more engaging user experience when viewing product images.
- **\[E2E\]** Enhanced end-to-end tests to ensure accurate price calculations in the shopping basket, covering scenarios with regular prices, sales, and promotions.
- **\[E2E\]** Implemented end-to-end (E2E) tests to validate client-side hydration against server-rendered content.
- **\[E2E\]** Added an end-to-end test to ensure seamless navigation from the main navigation menu to product listing pages. This test covers navigation to main categories and subcategories up to the second level (e.g., `Women > Clothing > Dresses`). This comprehensive test strengthens our automated testing coverage and helps ensure a smooth browsing experience for our users.
- **\[E2E\]** Introduced an RPC fixture to streamline end-to-end testing. This fixture allows direct RPC calls from test code, enabling efficient setup of server-side state without requiring UI interaction. This significantly reduces test execution time and complexity.

      ```ts
      test('Some description', async ({ rpc }) => {
        const res = await rpc.call('addItemToWishlist', {
          productId: 123,
        })

        expect(res).toMatchObject({ productId: 123 })
      })
      ```

- **\[Translations\]** Removed unused translation entries from the project.

- **\[Promotions\]** Refactored the handling of the bottom promotion banner height to improve performance and address several issues. Previously, the entire banner element was stored as a reference, leading to unnecessary layout re-renders and duplicated category API calls within the "Show deals" button triggered overlay due to `KeepAlive` issues. The implementation now uses a new `usePromotionBanner` composable to store only the banner's height. This simplifies gap calculations between the floating container and the banner, eliminates redundant re-renders, and resolves the API call duplication.
- **\[Promotions\]** Improved the performance of promotion loading by reducing the number of calls made to the `getCategoryById` function. This optimization reduces API requests and improves the overall responsiveness of the promotions feature.

  Example:

      ```ts
      // Before
      import Footer from '~/components/Footer.vue'

      // After
      import SFFooter from '~/components/SFFooter.vue'
      ```

- **\[SEO\]** To streamline SEO management and reduce code duplication, we've removed our custom SEO utility functions and integrated with the SEO utilities available through the `@scayle/storefront-nuxt` package. This simplifies maintenance and ensures we're using the most up-to-date SEO practices.
- **\[Types\]** Corrected the import paths for the `BasketItemUpdateData` and `PromotionReductionItem` types.

### 🩹 Patch Changes

- **\[Images\]** Improved the construction of image URLs by using URL.parse. This ensures more robust and consistent URL generation when using a CDN, improving image loading performance and reliability.
- **\[PDP\]** Implemented title truncation for excessively long titles within the product page breadcrumbs.
- **\[ShopSwitcher\]** Updated the `ShopSwitcher` component to display the language code instead of the full language name.
- **\[Account\]** Corrected the headline translation on the account page.
- **\[UI\]** Updated the `SFSlideIn` component to support full-screen display mode on mobile devices. This provides a more immersive experience and better utilizes screen real estate on smaller screens.
- **\[UI\]** Increased the bottom margin of the "Scroll to Top" button on medium and larger screens (breakpoints `md` and above) to prevent overlap with footer links.
- **\[Navigation\]** Added support for the `filters` properties on `navigationItem`'s that link to category pages.
- **\[Navigation\]** Ensured horizontal alignment between navigation list items and their
  corresponding header elements.
- **\[Navigation\]** Corrected a layout shift that occurred when hovering over navigation items.
- **\[Navigation\]** Refactored navigation lists to use semantically correct `ul` (unordered list) and `li` (list item) tags.
- **\[Navigation\]** Cleaned up and enhanced the `NavigationItem` test data. The `languages` field, which was no longer used, has been removed. Additionally, the `filters` property has been added to all category navigation items to facilitate more comprehensive testing of filtering functionality within the navigation. This change simplifies the test data and improves the accuracy of navigation-related tests.
- **\[Tracking\]** Added tracking for customer logout events to capture the `customer_data` event. This ensures improved tracking of customer sessions and provides valuable insights into user behavior.
- **\[Tracking\]** Updated search events to include page information attributes and added tracking for "show all results" clicks.
- **\[Tracking\]** Corrected the `search_destination` attribute value that is tracked when a user clicks on a suggested page in the search results.
- **\[Tracking\]** The `method` key in the `customer_data` tracking object has been renamed to `login_method` for clarity and consistency.
- **\[Tracking\]** Removed the explicit `cart` event trigger when removing basket items using `useBasketActions`. This event is already handled automatically by the `useUserItemsTrackingWatcher`.
- **\[Tracking\]** Corrected an issue where a tracking event was not being triggered when clicking the "Show All" button in search results if other suggestions were present.
- **\[E2E\]** Modified the end-to-end test suite to reflect recent updates to the Basket and Wishlist pages, including their empty states and updated page titles.
- **\[E2E\]** The `e2e-happy-path.spec.ts` end-to-end test, which covers the critical user journey on the Basket page, has been updated to reflect the recent design changes. This ensures that the core flow towards the checkout remains functional and provides a seamless experience for our customers.
- **\[E2E\]** As part of the ongoing improvements to our multi-shop platform and the introduction of global API routing for path-based shops, we've updated our E2E test suite. Tests relying on RPC calls have been refactored to reflect the new, simplified API access. This ensures our tests remain comprehensive and effective in validating multi-shop platform functionality, minimizing the risk of regressions and ensuring a seamless experience for our customers across all shops.
- **\[E2E\]** Updated the end-to-end tests to cover the redesigned `ShopSelector` functionality.
- **\[E2E\]** Enhanced the stability of the main navigation end-to-end tests by adding a check for DOM content loading.
- **\[E2E\]** Refactored the `ShopSelector` DOM element handling for determining the currently selected country. This simplifies the logic and improves performance.
- **\[E2E\]** Enhanced the reliability and stability of end-to-end (E2E) tests, particularly those involving user accounts. Each browser now uses a dedicated user account during test execution, preventing data conflicts and ensuring more consistent test results. Additionally, test timeout thresholds have been increased to accommodate potential temporary slowdowns and reduce the occurrence of false positives.
  To configure dedicated test user accounts for each browser, set the following environment variables (refer to `env.example` for reference):
  - `TEST_USER_EMAIL`
  - `TEST_USER_EMAIL2`
  - `TEST_USER_EMAIL3`
  - `TEST_USER_EMAIL4`
  - `TEST_USER_EMAIL5`
  - `TEST_USER_PASSWORD`
  - `TEST_USER_WRONG_PASSWORD`
  - `TEST_USER_NO_ORDERS_PASSWORD`

  These variables can be set in a `.env` file or via CI/CD variables. The mapping between browsers and user accounts is defined in the getUserForBrowser function in `playwright/support/utils`.

- **\[E2E\]** Extended the basket price summary end-to-end tests to cover mobile browsers. This ensures accurate price calculations and display for sale and promotion products on mobile devices, maintaining consistency across different platforms.
- **\[E2E\]** Improved the robustness of the end-to-end test for filter deep links. The test now validates filter functionality irrespective of the order in which filters are returned by the backend. This addresses an issue where variations in filter order could lead to false negative test results, ensuring more consistent and reliable testing.

### 🏡 Dependency Updates

- Added dependency `@gtm-support/vue-gtm@3.1.0`
- Added dependency `eslint-formatter-gitlab@5.1.0`
- Removed dependency `@zadigetvoltaire/nuxt-gtm@0.0.13`
- Updated dependency `@contentful/live-preview@4.6.3` to `@contentful/live-preview@4.6.5`
- Updated dependency `@scayle/nuxt-opentelemetry@0.5.3` to `@scayle/nuxt-opentelemetry@0.5.7`
- Updated dependency `@scayle/omnichannel-nuxt@4.0.3` to `@scayle/omnichannel-nuxt@4.0.4`
- Updated dependency `@scayle/storefront-country-detection@1.0.1` to `@scayle/storefront-country-detection@1.1.0`
- Updated dependency `@scayle/storefront-nuxt@8.2.0` to `@scayle/storefront-nuxt@8.6.0`
- Updated dependency `@scayle/storefront-product-detail@1.0.1` to `@scayle/storefront-product-detail@1.0.2`
- Updated dependency `@scayle/storefront-product-listing@1.1.2` to `@scayle/storefront-product-listing@1.1.3`
- Updated dependency `@storyblok/nuxt@6.2.0` to `@storyblok/nuxt@6.2.2`
- Updated dependency `@storyblok/vue@8.1.6` to `@storyblok/vue@8.1.10`
- Updated dependency `@tailwindcss/forms@0.5.9` to `@tailwindcss/forms@0.5.10`
- Updated dependency `@tailwindcss/typography@0.5.15` to `@tailwindcss/typography@0.5.16`
- Updated dependency `@vueuse/components@12.0.0` to `@vueuse/components@12.5.0`
- Updated dependency `@vueuse/core@12.0.0` to `@vueuse/core@12.5.0`
- Updated dependency `@vueuse/integrations@12.0.0` to `@vueuse/integrations@12.5.0`
- Updated dependency `@vueuse/nuxt@12.0.0` to `@vueuse/nuxt@12.5.0`
- Updated dependency `check-password-strength@2.0.10` to `check-password-strength@3.0.0`
- Updated dependency `consola@3.2.3` to `consola@3.4.0`
- Updated dependency `contentful@11.3.3` to `contentful@11.4.4`
- Updated dependency `contentful-export@7.21.7` to `contentful-export@7.21.20`
- Updated dependency `dompurify@3.2.3` to `dompurify@3.2.4`
- Updated dependency `focus-trap@7.6.2` to `focus-trap@7.6.4`
- Updated dependency `nuxi@3.17.0` to `nuxi@3.21.1`
- Updated dependency `storyblok-js-client@6.10.4` to `storyblok-js-client@6.10.7`
- Updated dependency `@changesets/cli@2.27.11` to `@changesets/cli@2.27.12`
- Updated dependency `@nuxt/eslint@0.7.3` to `@nuxt/eslint@1.0.0`
- Updated dependency `@nuxt/image@1.8.1` to `@nuxt/image@1.9.0`
- Updated dependency `@nuxt/test-utils@3.15.1` to `@nuxt/test-utils@3.15.4`
- Updated dependency `@nuxtjs/tailwindcss@6.12.2` to `@nuxtjs/tailwindcss@6.13.1`
- Updated dependency `@scayle/eslint-config-storefront@4.4.0` to `@scayle/eslint-config-storefront@4.4.1`
- Updated dependency `@types/node@22.10.2` to `@types/node@22.12.0`
- Updated dependency `@typescript-eslint/scope-manager@8.18.1` to `@typescript-eslint/scope-manager@8.22.0`
- Updated dependency `@typescript-eslint/utils@8.18.1` to `@typescript-eslint/utils@8.22.0`
- Updated dependency `@vue/typescript-plugin@2.1.10` to `@vue/typescript-plugin@2.2.0`
- Updated dependency `eslint@9.17.0` to `eslint@9.19.0`
- Updated dependency `eslint-plugin-tailwindcss@3.17.5` to `eslint-plugin-tailwindcss@3.18.0`
- Updated dependency `happy-dom@15.11.7` to `happy-dom@16.7.3`
- Updated dependency `lint-staged@15.2.11` to `lint-staged@15.4.3`
- Updated dependency `nuxt-svgo@4.0.9` to `nuxt-svgo@4.0.14`
- Updated dependency `pathe@1.1.2` to `pathe@2.0.2`
- Updated dependency `postcss@8.4.49` to `postcss@8.5.1`
- Updated dependency `postcss-html@1.7.0` to `postcss-html@1.8.0`
- Updated dependency `storyblok-generate-ts@2.1.0` to `storyblok-generate-ts@2.2.0`
- Updated dependency `typescript@5.6.3` to `typescript@5.7.3`
- Updated dependency `unimport@3.13.4` to `unimport@4.0.0`
- Updated dependency `vue-tsc@2.1.10` to `vue-tsc@2.2.0`

## 1.6.0

### 🔥 Highlights

#### 🎨 Introducing the new Header & Footer

Enjoy a refreshed look for SCAYLE Storefront, with greater flexibility at your fingertips!
We've revamped both the header and footer design, as well as underlying technical implementation, now leveraging the [SCAYLE Navigation](https://scayle.dev/en/user-guide/shops/storefront/navigation) as its data source.
This change brings enhanced consistency and opens up a new world of customization possibilities through the [SCAYLE Panel](https://scayle.dev/en/user-guide/shops/storefront/navigation).
The design refresh is aligning the included header and footer with the updated design language introduced in the past months for the Product Listing Page and Product Detail Page.
This results in a more cohesive shopping experience across SCAYLE Storefront, and provides a modern foundation and flexible for your design customizations.

#### 🧰 Major update to Storefront SDKs v8

SCAYLE Storefront SDK v8 (`@scayle/storefront-nuxt@8.*`) delivers substantial enhancements to data handling, consistency, and overall developer experience.
This release introduces a revamped response structure and error handling for basket data, along with streamlined return values for RPC composables for increased predictability.
As part of our commitment to modernization, we have removed legacy code and deprecated features, including the `disableDefaultGetCachedDataOverride` setting and support for outdated approaches like faceted search (`useFacet`).
A [comprehensive migration guide](https://scayle.dev/en/storefront-guide/support-and-resources/upgrade-guides/migrate-to-storefront-v8) is available to ensure a smooth transition to this enhanced version, offering improved performance, stability, and a future-proof foundation for your storefront integrations.

#### 🏗️ Starting transition to Storefront Feature Packages

We're increasing the flexibility and scalability of SCAYLE Storefront by transitioning to a new feature package architecture.
This means breaking down core features into independent, manageable packages, giving tenants more control over upgrades and customization.
Going forward, you can choose to adopt updates to specific functionalities without requiring a complete overhaul of your application.
We've already begun this transition by migrating key Product Listing functionalities into the `@scayle/storefront-product-listing` package.
Additionally, our newly developed "Country Detection" feature is now available as the `@scayle/storefront-country-detection` package, offering immediate access to this powerful functionality.
This is just the first step towards our new architecture, and we'll be supplementing this approach with additional tooling and documentation in the future.

### 🚀 Major Changes

- **\[Header & Footer \]** We've updated the design of the page header. It now uses the [SCAYLE Navigation](https://scayle.dev/en/user-guide/shops/storefront/navigation) as its data source.
- **\[Header & Footer \]** We've updated the design of the page footer. It now uses the [SCAYLE Navigation](https://scayle.dev/en/user-guide/shops/storefront/navigation) as its data source.
- **\[Header & Footer\]** We're introducing a new simplified header and footer design, which will be now used by default for the checkout page.
- **\[Storefront v8\]** We've revamped the response structure and error handling for basket data. Expect a more organized and consistent data format.
- **\[Storefront v8\]** Removed `disableDefaultGetCachedDataOverride` setting as this behavior is now the default.
- **\[Storefront v8\]** We're aligning the return values of RPC composables by replacing `pending` with `status` and `fetch` with `refresh`.
- **\[Storefront Feature Packages\]** Replace the composable `useProductListFilter` with `useFiltersForListing` as has been renamed in `@scayle/storefront-product-listing`.
  We've also removed the return value `clearedPriceQuery`. Please use the utility function `getClearedFilterQueryByKey`.
- **\[Storefront Feature Package\]** Replace the composable `useProductsByCategory` with `useProductsForListing` from `@scayle/storefront-product-listing`.
  - Previous implementation:

    ```ts
    const {
      products,
      pagination,
      status: productsStatus,
      totalProductsCount,
      paginationOffset,
    } = useProductsByCategory(currentCategoryId, route, {
      params: {
        with: PRODUCT_TILE_WITH_PARAMS,
      },
      fetchingOptions: { lazy: true },
    })
    ```

  - Current implementation:

    ```ts
    const { selectedSort } = useProductListSort(route)
    const { appliedFilter } = useAppliedFilters(route)

    const {
      products,
      pagination,
      status: productsStatus,
      totalProductsCount,
      paginationOffset,
    } = useProductsForListing({
      params: {
        categoryId: currentCategoryId.value,
        with: PRODUCT_TILE_WITH_PARAMS,
        sort: selectedSort.value,
        perPage: PRODUCTS_PER_PAGE,
        where: appliedFilter.value,
      },
      fetchingOptions: { lazy: true },
    })
    ```

- **\[Storefront Feature Packages\]** Replace the composable `useCategorySeoData` with `useProductListingSeoData` from `@scayle/storefront-product-listing`.
  - Previous implementation:

    ```ts
    const {
      title,
      metaDescription,
      robots,
      canonicalLink,
      categoryBreadcrumbSchema,
    } = useCategorySeoData(currentCategory)
    ```

  - Current implementation:

    ```ts
    const route = useRoute()
    const { getBreadcrumbsFromCategory } = useBreadcrumbs()

    const breadcrumbs = computed(() =>
      currentCategory.value
        ? getBreadcrumbsFromCategory(currentCategory.value, true)
        : [],
    )

    const { title, robots, canonicalLink, categoryBreadcrumbSchema } =
      useProductListingSeoData(breadcrumbs.value, route, {
        baseUrl: $config.public.baseUrl,
        fullPath: route.fullPath,
      })
    ```

### 💅 Minor Changes

- **\[Search\]** Rename the search query parameter `term` to `filters[term]` to adhere to the established filter naming convention.
  This alignment ensures that search results only display filters matching the available products.
  To maintain existing functionality, all instances of accessing `route.query.term` need to be updated to `route.query.['filters[term]']`.
  - Example:

    ```ts
      //Before
      const route = useRoute()
      console.log(route.query.term)

      //After
      const route = useRoute()
      console.log(route.query.['filters[term]'])
    ```

  - This was done in:
    - `composables/useFilter.ts`
    - `composables/useProductsSearch.ts`
    - `composables/useRouteHelpers.ts`
    - `pages/search.vue`

- **\[Search\]** Use new filter query parameter name (`filters[term]`) for search term when updating current route.
- **\[UI\]** The component prop type in the `Button.vue` and `Link.vue` components has been renamed to variant. This change prevents conflicts with the native HTML type attribute, enhancing code maintainability and reducing the risk of unexpected behavior.
- **\[UI\]** Refactor `<Listbox />` to manage the `isOpen` state without the use of `useState`. Instead of passing a name to `<ListboxButton />` and `<ListboxOption />`, they now require a function to toggle the open state.
  - Example:

    ```html
    // Before
    <SFListbox>
      <template #default="{ isOpen, list }">
        <SFListboxButton :id="id" ref="button" :list-name="list">
          ...
        </SFListboxButton>
      </template>
      <template #options="{ isOpen, list, close }">
        <SFListboxOptions>
          <SFListboxOption :list-name="list"> ... </SFListboxOption>
        </SFListboxOptions>
      </template>
    </SFListbox>
    // After
    <SFListbox>
      <template #default="{ isOpen, toggleListboxOpen }">
        <SFListboxButton
          :id="id"
          ref="button"
          :toggleListboxOpen="toggleListboxOpen"
        >
          ...
        </SFListboxButton>
      </template>
      <template #options="{ isOpen, toggleListboxOpen, close }">
        <SFListboxOptions>
          <SFListboxOption :toggleListboxOpen="toggleListboxOpen">
            ...
          </SFListboxOption>
        </SFListboxOptions>
      </template>
    </SFListbox>
    ```

  - Affected files:
    - `components/layout/headers/ShopSwitcher.vue`

- **\[Accessibility\]** Improved keyboard navigation for better accessibility.
  Users can now navigate directly to a PDP from a focused `ProductCard.vue` by simply pressing the `Enter` key.
- **\[Accessibility\]** The `SFSwitch` component now provides improved touch interaction.
  The `<label>` is now associated with the switch control using the appropriate `id` and `for` attributes.
  This allows users to easily toggle the switch by simply tapping on the label, making it significantly easier to interact with on touch devices.
- **\[Dependencies\]** We've updated to `nuxt/i18n@9.x`. This introduces a new directory structure for localization to align with the upcoming changes of Nuxt 4.
  - `lang/` directory has been renamed to `i18n/`
  - `i18n.config.ts` has been moved to `i18n/i18n.config.ts`
  - `lang/{locale}.json` translation files have been moved to `i18n/locales/{locale}.json`
  - Removed preconfigured `i18n.langDir` option in `nuxt.config.ts` to use new default directory structure
  - Additional details can be found in the [official `nuxt/i18n` v8 to v9 migration guide](https://i18n.nuxtjs.org/docs/guide/migrating#upgrading-from-nuxtjsi18n-v8x-to-v9x)
- **\[Middleware\]** We've refactored the `redirectTrailingSlash.global.ts` middleware to use a `slice()`-based approach instead of a RegEx-based approach for normalizing the URL path and added some test cases to verify its intended functionality, including some performance comparison tests with the former implementation.
- **\[Performance\]** To avoid hydration mismatches, `<AccordionEntry>` no longer generates id's used for accessibility features on its own. It now requires the id being passed from the the parent component.
- **\[Tooling\]** We've introduced `@nuxt/fonts` to streamline web font integration. This change simplifies the process of adding and managing fonts in Storefront projects while improving performance:
  - Zero-config setup for popular font providers (_Google Fonts, etc._)
  - Customization options with support for custom providers
  - Seamless Tailwind CSS Integration: Easily incorporate downloaded fonts into your Tailwind configuration for streamlined styling
  - Enhanced Privacy and Performance through Local Font Downloads: Fonts are downloaded and served from your server, addressing privacy concerns related to third-party font hosting (_like Google Fonts and GDPR compliance_) while improving your website's loading speed
  - Performance benefits:
    - Automatic font metric optimization (_using [Fontaine](https://github.com/unjs/fontaine) and [Capsize](https://github.com/seek-oss/capsize)_)
    - Build-time font caching
- **\[Shop Switcher\]** Shop switching now defaults to redirecting users to the homepage of the newly selected shop. For cases where maintaining the current path is desired, the `<ShopSwitcher />` component now accepts a `switchToHomePage` prop. Setting this prop to `false` will preserve the current path during the shop switch.

  ```html
  <ShopSwitcher :switch-to-home-page="false" />
  ```

- **\[Product\]** Cleanup and simplify product include handling. All relevant includes are now defined in `constants/withParams.ts` and there are only two product includes defined now:
  - `PRODUCT_DETAIL_WITH_PARAMS` which includes all attributes and advanced attributes to be used on the PDP and Basket
  - `PRODUCT_TILE_WITH_PARAMS` a smaller subset of data to be used for the `ProductCard` component (e.g. on the Product Listing Page, in the Search or for the Wishlist)
- **\[Wishlist\]** We overhauled the wishlist implementation and design align with the new design language of the Storefront Boilerplate
  - Removes unnecessary tracking from other pages
  - Improves grid handling for the Wishlist
  - Updates loading view of the Wishlist
  - Updates the Wishlist Header to be aligned with the Product Listing Page
- **\[Runtime\]** Upgrade Dockerfiles to Node 22 which is now the official LTS Version for Node.
- **\[E2E\]** Implemented end-to-end tests to ensure the accuracy and functionality of the Store Locator feature.
- **\[E2E\]** Implemented end-to-end tests to ensure accurate and reliable sorting functionality within Product Listing Pages (PLP)
- **\[E2E\]** Ensured Search page filters work correctly by adding end-to-end tests to verify the functionality of the filters on the Search page.
- **\[E2E\]** Refined tests to guarantee the reliability and correctness of pagination on Product Listing pages.
- **\[E2E\]** Implemented end-to-end testing for search suggestion tags and integrated tag-based filtering into the search results page.
- **\[E2E\]** Implemented an end-to-end test to verify the functionality of the shop selector, ensuring users can seamlessly switch between different shops within the platform.

### 🩹 Patch Changes

- **\[Header & Footer\]** Standardized footer logo dimensions by setting a fixed width (`w-7` / `28px`) to improve usability and prevent accidental clicks.
- **\[Header & Footer\]** Adjusted footer spacing on mobile for a more visually appealing and consistent browsing experience.
- **\[Header & Footer\]** Addressed an unexpected UI behavior in the `FooterLinkSection` component where the `expanded` state persisted after navigation.
  This fix ensures the mobile footer menu reliably collapses when navigating to a different page.
- **\[Search\]** Enhanced the search result page user experience for users on low-bandwidth or slow connections.
  Instead of immediately displaying "0 hits" while results load, the page title now dynamically indicates loading progress, providing a clearer indication of ongoing search activity.
- **\[PDP\]** Adjusted layout to prevent the best price from displaying on the same line as the current price, improving price clarity for users.
- **\[PDP\]** Improved the visual presentation of tax information next to product prices.
  Tax details are now displayed as superscript using the `<sup>` tag for consistent alignment and improved readability.
- **\[PLP\]** Adjusted spacing of `ProductCardDetails`and `ProductPrice` within `ProductCardDetails` for both mobile and desktop view.
- **\[PLP\]** Fixed overlapping sales badges on top of product name within `ProductCardDetails` by adjusting `ProductPrice` positioning for mobile view.
- **\[PLP\]** Adjusted top padding for content containers when teaser images are absent.
  This ensures optimal spacing between the breadcrumb navigation and the top of the page, enhancing visual clarity and user experience.
- **\[PLP\]** This change addresses an issue where the price filter would incorrectly persist when the `SFPriceRangeSlider` was returned to its original minimum and maximum values.
  Now, an event is emitted based on whether the provided event values match these filter limits (`resetPriceFilter` or `applyPriceFilter`).
  This ensures that the filter is properly reset in all cases, even when the slider is moved back to its initial position.
  Previously, this scenario would result in the filter remaining active (applied), as potentially indicated by the filter counter on the `FilterToggleButton`.
- **\[Promotions\]** Only add alpha value to promotion color when alpha value was passed to `getBackgroundColorStyle()` and `getTextColorStyle()`.
- **\[Promotions\]** Show `<VariantPicker>` for products with only one variant within `ProductPromotionSelectionModal.vue` and remove unused `ONE_SIZE_KEY` constant.
- **\[Basket\]** Addressed a hydration mismatch issue in the `ProductCardBadgesFooter.vue` component that occurred when a product was already present in the user's basket.
- **\[Basket\]** Removed the redundant flag `isLowestPreviousPriceActive`.
  Price display logic now relies on the SCAYLE Core System, ensuring consistency and accuracy across all supported countries.
  This change simplifies our codebase and removes the need for country-specific configurations related to lowest price display.
- **\[Accessibility\]** The `primary` variant of `SFButton` now has its outline restored to improve its visibility for impaired users.
- **\[Utilities\]** Moved `useDefaultBreakpoints` to the UI module.
- **\[Utilities\]** `getBackgroundColorStyle()` and `getTextColorStyle()` now set alpha values when using the default color.
  Previously no alpha value was set, resulting in the same color for text and background of promotion prices.
- **\[Performance\]** Local history checks inside `GoBackLink.vue` now occur after hydration to prevent potential issues.
- **\[Tooling\]** Added all Tailwind CSS duration classes to the safe list, ensuring complete availability.
  This addresses an issue where durations defined with the `duration-{duration}` syntax were unintentionally purged.
  Also consistency is improved by updating transition components to exclusively accept duration values defined within the Tailwind configuration.
- **\[Tooling\]** Added a check for the existence of the `country_selection.override_codes.<...>` translation key before resolving its translation.
  This prevents console warnings that were previously triggered when attempting to resolve nonexistent translation keys.
- **\[Tooling\]** Added `resolutions` for `globals@15.x` in `package.json` to resolve issues with executing `eslint`.
- **\[UI\]** Remove hardcoded ID from `ListBox` to avoid conflicts.
- **\[UI\]** Fixed links not opening in a new tab when they should.
- **\[UX\]** Show a `404` error on the PDP when the product cannot be found.
- **\[UI\]** Fix button variant of `ShopSwitcherItem.vue` after the option was renamed in `Button.vue`.
- **\[UX\]** Resolved an issue with the ShopSwitcher where clicking the currently selected locale would unnecessarily reload the page.
- **\[E2E\]** Optimized end-to-end test suite for user login flow to prevent potential timeouts during authentication.
- **\[E2E\]** The footer end-to-end test was enhanced to verify correct homepage redirection and scroll-to-top functionality upon clicking the footer logo.
- **\[E2E\]** Updated end-to-end test for shop switching to enforce redirection to the Homepage after a user switches shops, ensuring alignment with the latest product requirements.
  Previously, tests allowed for redirects to non-Homepage destinations, which is no longer desired behavior.
- **\[E2E\]** Implemented end-to-end test for PLP filter functionality, ensuring product counter synchronization.
- **\[E2E\]** Updated end-to-end tests to reflect Header and Footer modifications.
- **\[E2E\]** Updated Footer Storefront guide URL constant value to match the updated page URL.
- **\[E2E\]** The "Verify Shop Selector switch from non-Homepage" end-to-end test `(e2e-ShopSelector.spec.ts`) is experiencing timeouts specifically on Mobile Safari during CI execution.
  This test is temporarily skipped for Mobile Safari to maintain a green CI pipeline. Investigation into the root cause of the timeouts is ongoing.
- **\[E2E\]** Ensured the accuracy of end-to-end tests for the new footer following recent updates.
- **\[E2E\]** Enhanced end-to-end tests for homepage links to ensure more robust validation.
  The tests now perform a more accurate check of response codes and status.
  Additionally, if the initial header request (`page.request.head()`) fails, a full page visit is attempted to provide more comprehensive error detection.
- **\[E2E\]** Updated tests to match the rename of the search query parameter `term` to `filters[term]` to adhere to the established filter naming convention.
  This alignment ensures that search results only display filters matching the available products.
- **\[E2E\]** Refined end-to-end test to check the PLP applied Filters counter.
- **\[E2E\]** Updated the end-to-end test for the "Happy Path" user journey to reflect recent changes made to the Header Search component.
  This ensures continued, comprehensive testing of core search functionality after implementation updates.
- **\[E2E\]** Improved the stability and consistency of tests for the Basket and Shop Selector features specifically targeting mobile Safari browser.

### 🏡 Dependency Updates

- Added dependency `@nuxt/fonts@0.10.3`
- Added dependency `@scayle/storefront-country-detection@1.0.1`
- Added dependency `@scayle/storefront-product-detail@1.0.1`
- Added dependency `@scayle/storefront-product-listing@1.1.2`
- Added dependency `dompurify@3.2.3`
- Updated dependency `@contentful/live-preview@4.5.14` to `@contentful/live-preview@4.6.3`
- Updated dependency `@scayle/nuxt-opentelemetry@0.4.0` to `@scayle/nuxt-opentelemetry@0.5.3`
- Updated dependency `@scayle/omnichannel-nuxt@4.0.2` to `@scayle/omnichannel-nuxt@4.0.3`
- Updated dependency `@scayle/storefront-nuxt@7.95.0` to `@scayle/storefront-nuxt@8.2.0`
- Updated dependency `@storyblok/richtext@3.0.0` to `@storyblok/richtext@3.0.2`
- Updated dependency `@storyblok/vue@8.1.5` to `@storyblok/vue@8.1.6`
- Updated dependency `@vueuse/components@11.2.0` to `@vueuse/components@12.0.0`
- Updated dependency `@vueuse/core@11.2.0` to `@vueuse/core@12.0.0`
- Updated dependency `@vueuse/integrations@11.2.0` to `@vueuse/integrations@12.0.0`
- Updated dependency `@vueuse/nuxt@11.2.0` to `@vueuse/nuxt@12.0.0`
- Updated dependency `axios@1.7.7` to `axios@1.7.9`
- Updated dependency `contentful@11.2.1` to `contentful@11.3.3`
- Updated dependency `contentful-export@7.19.163` to `contentful-export@7.21.7`
- Updated dependency `dotenv@16.4.5` to `dotenv@16.4.7`
- Updated dependency `focus-trap@7.6.1` to `focus-trap@7.6.2`
- Updated dependency `knitwork@1.1.0` to `knitwork@1.2.0`
- Updated dependency `maska@3.0.3` to `maska@3.0.4`
- Updated dependency `nanoid@5.0.8` to `nanoid@5.0.9`
- Updated dependency `nuxi@3.15.0` to `nuxi@3.17.0`
- Updated dependency `storyblok-js-client@6.10.1` to `storyblok-js-client@6.10.4`
- Updated dependency `vue@3.5.12` to `vue@3.5.13`
- Updated dependency `@changesets/cli@2.27.9` to `@changesets/cli@2.27.11`
- Updated dependency `@eslint/eslintrc@3.1.0` to `@eslint/eslintrc@3.2.0`
- Updated dependency `@nuxt/eslint@0.6.1` to `@nuxt/eslint@0.7.3`
- Updated dependency `@nuxt/test-utils@3.14.4` to `@nuxt/test-utils@3.15.1`
- Updated dependency `@nuxtjs/i18n@8.5.6` to `@nuxtjs/i18n@9.1.1`
- Updated dependency `@scayle/eslint-config-storefront@4.3.2` to `@scayle/eslint-config-storefront@4.4.0`
- Updated dependency `@types/node@22.9.0` to `@types/node@22.10.2`
- Updated dependency `@typescript-eslint/scope-manager@8.14.0` to `@typescript-eslint/scope-manager@8.18.1`
- Updated dependency `@typescript-eslint/utils@8.14.0` to `@typescript-eslint/utils@8.18.1`
- Updated dependency `@vitest/coverage-v8@2.1.4` to `@vitest/coverage-v8@2.1.8`
- Updated dependency `eslint@9.14.0` to `eslint@9.17.0`
- Updated dependency `eslint-plugin-unimport@0.1.1` to `eslint-plugin-unimport@0.1.2`
- Updated dependency `happy-dom@15.11.4` to `happy-dom@15.11.7`
- Updated dependency `lint-staged@15.2.10` to `lint-staged@15.2.11`
- Updated dependency `nuxt@3.13.2` to `nuxt@3.14.1592`
- Updated dependency `nuxt-svgo@4.0.8` to `nuxt-svgo@4.0.9`
- Updated dependency `storyblok@3.35.0` to `storyblok@3.35.2`
- Updated dependency `tailwindcss@3.4.14` to `tailwindcss@3.4.17`
- Updated dependency `unimport@3.13.1` to `unimport@3.13.4`
- Updated dependency `vitest@2.1.4` to `vitest@2.1.8`

## 1.5.0

### 🔥 Highlights

#### 🤝🏼 Taking the First Steps Towards Enhanced Accessibility

This release marks the beginning of a dedicated effort to make Storefront truly inclusive for all users. We've taken the first steps by enhancing keyboard navigation, providing detailed alt text descriptions for product images, and ensuring proper language declaration for screen readers. These are just the initial steps in a long-term commitment to accessibility, with further enhancements planned in future releases. Our goal is to achieve full accessibility by 2025, making a Storefront-based shop a welcoming space for everyone.

#### 🧪 Quality Assurance Through Rigorous Testing

The team focused on expanding test coverage across critical user flows, including checkout, basket functionality, the Country Detector, and product listing pages. By addressing issues that could lead to instability and implementing stricter testing standards, this release strengthens the Storefront's reliability and minimizes the risk of errors, ultimately benefiting the end user.

#### ⚓ A More Stable and Reliable Foundation

Beyond the visible changes, this release includes numerous improvements that bolster the platform's stability and reliability. Addressing issues like inconsistent image heights, inaccurate price rounding in filters, and conflicts with the Country Detector modal ensures a smoother user experience with fewer unexpected errors. These under-the-hood enhancements contribute to a more robust and dependable Storefront for all users.

Additionally, enabling Brotli compression by default for the [Storefront Cache](https://scayle.dev/en/storefront-guide/developer-guide/basic-setup/caching#storefront-storage-cache-configuration) significantly reduces page load times, creating a snappier, more responsive browsing experience.

### 🚀 Major Changes

- **\[Architecture\]** Update default `node` version to `v22`
- **\[Accessibility\]** Enhanced the accessibility of the ShopSwitcher component by adding `aria-*` attributes to provide better context and functionality for assistive technologies. Additionally, we optimized keyboard navigation to ensure a smooth and intuitive experience for all users.
- **\[Architecture\]** Introduced `LocalizedLink`, a new wrapper component built around the existing `SFLink` of the local UI module. This component simplifies the implementation of localized links across the UI, ensuring a smoother experience for international shops.
- **\[UI\]** The ShopSelector component has been redesigned with an updated look and feel for a more intuitive and user-friendly experience.
- **\[Product Price\]** Implemented a feature to display the lowest price observed within the last 30 days alongside the current product price.

### 💅 Minor Changes

- **\[Accessibility\]** Added the `lang` attribute to the `<html>` tag across all pages. This enhancement explicitly defines the page's default language, improving accessibility for screen readers and other assistive technologies while also aiding search engines in properly indexing and displaying our content.
- **\[Architecture\]** Improved page load speed by enabling Brotli compression by default for cached data. This optimization can be customized via the `NUXT_STOREFRONT_STORAGE_CACHE_COMPRESSION` environment variable or the `storefront.storage.cache` option in `nuxt.config.ts`.
- **\[Architecture\]** We've decoupled localization functionality from individual local modules, leading to a more modular and maintainable codebase. This change paves the way to pass translated strings directly from the primary application into the respective module code.
- **\[CMS\]** Fixed handling of partial story data structures in Contentful stories of content and service pages.
- **\[Country Detection\]** Enhanced the `closeModal()` function within our Country Detection tests to include a check for the modal's visibility on page load. This improvement ensures greater test stability, particularly when the test suite is executed from a different time zone than the targeted shop, as it accounts for potential modal visibility differences based on location and time.
- **\[E2E\]** Implemented end-to-end tests (`e2e-CountryDetector.spec.ts`) to ensure robust functionality of the Country Detector feature. These tests cover key user flows such as closing the modal window, switching to a different shop, and remaining in the initial shop.
- **\[E2E\]** Improved the stability of our Checkout end-to-end tests when running in parallel by assigning a dedicated test user to each browser. This prevents conflicts that can occur when multiple tests interact with shared user data (like order information) simultaneously, leading to more reliable and consistent test results.
- **\[Internationalization\]**: Improved the localization handling within the local CMS module, ensuring accurate and efficient handling of multilingual content for a smoother user experience across all supported languages.
- **\[PDP / Subscription\]** Improved `getVariant()` method to optionally handle exact product variant ID when the parameter is passed from the test.
- **\[Product\]** Resolved the `Extraneous non-props attributes` warning within the `ProductPrice.vue` component. This ensures better code quality, making the component more readable and maintainable.
- **\[Promotion\]** Updated the `getPromotionGiftProducts` method to exclude sold-out promotion gift items, improving API response efficiency.
- **\[Search\]** Fixed an issue causing multiple requests to the `getSearchSuggestions` endpoint for a single user query. This reduces server load and improves the responsiveness of search suggestions.
- **\[UI\]** Streamlined minor part of the header to align with the new PLP and PDP.
- **\[Unit testing\]** Introduced the [factory pattern](https://thoughtbot.com/blog/announcing-fishery-a-javascript-and-typescript-factory-library#why-factories) for creating reusable mock data structures in unit tests using [`fishery`](https://github.com/thoughtbot/fishery)

### 🩹 Patch Changes

- **\[Accessibility\]** Enhanced the `useDropdownKeyboardBehavior` function to prevent potential conflicts. This is done by limiting its key-down event listeners to elements within the dropdown itself. It ensures that keyboard interactions are correctly scoped and do not unintentionally affect other page elements.
- **\[Accessibility\]** Improved accessibility of all product images by implementing detailed alt texts. This descriptive text, which now includes the product's brand, name, color, and relevant contextual information (such as gallery index or selected state), provides valuable information to users who are visually impaired, enhancing their overall browsing experience.
- **\[Basket\]** Campaign discounts are now clearly displayed within the basket summary, providing users with a transparent and accurate breakdown of their potential savings.
- **\[Cleanup\]** Remove unused components:
  - `components/addOns/AddOnsSelector.vue`
  - `product/card/ProductDetailsSkeleton.vue`
  - `product/promotion/gifts/ProductPromotionGiftImageGallery.vue`
  - `modules/ui/runtime/components/ThumbnailSlider.vue`
- **\[CMS\]** Fixed inconsistent heights of teaser images on product listing pages.
- **\[E2E\]** Addressed an issue affecting PDP end-to-end tests specifically within Chrome Mobile, where clicking the Variant Picker was frequently unsuccessful. While Playwright implements automatic retries for such actions, this often resulted in test timeouts. As the issue appears isolated to Chrome Mobile, we've introduced `{ force: true }` to the `variantPicker.click()` action. This is intended to bypass the problematic default click behavior and ensure consistent test execution across all browser environments.
- **\[E2E\]** Addressed an issue affecting sticky elements on scrolled pages in Mobile Safari. The solution replaces `mouse.wheel()` with `window.scrollTo()` for improved accuracy and reliability.
- **\[E2E\]** Enhanced Homepage end-to-end tests by refining how links are identified. We've transitioned from user-facing selectors (`getByRole('link')`) to a more comprehensive approach using (`page.locator('a')`). This ensures that we catch all links within the page, improving the thoroughness of our tests. We've also introduced a short delay using `page.waitForLoadState('domcontentloaded')` after each page visit within our Homepage end-to-end tests. This prevents issues that can arise when tests run faster than the page can load, leading to more stable and reliable test results.
- **\[E2E\]** Enhanced our Playwright end-to-end testing suite by integrating two new TypeScript linting rules within the `eslint.config.mjs` configuration:
  - `no-floating-promises`: This rule enforces the use of await for any call that returns a Promise, preventing unintentional side effects and ensuring that asynchronous operations are handled correctly within our tests.
  - `await-thenable`: This rule complements `no-floating-promises` by specifically targeting instances where await is used unnecessarily with values that are not Promises. This helps maintain consistency and clarity within our asynchronous code.
- **\[E2E\]** Enhanced PDP end-to-end testing reliability when adding products to the basket by implementing a `networkidle` wait state, ensuring all necessary network requests are complete before proceeding with the test steps.
- **\[E2E\]** Enhanced the happy path end-to-end test ( `e2e-happy-path.spec.ts`) to close the Country Detector modal window. This prevents potential blockages during test execution, leading to more reliable and consistent test results.
- **\[E2E\]** Implemented a standardized method for closing the Country Detector modal on page load across all relevant tests. This prevents potential conflicts and ensures a smoother, more reliable testing process.
- **\[E2E\]** Implemented various improvements to our end-to-end tests, making them more adaptable to data changes and reducing the likelihood of false positives. This ensures the tests remain robust and reliable even as the data evolves.
- **\[E2E\]** Improved the resilience of our PLP end-to-end tests by modifying the sibling product selection logic. Tests now dynamically target the first available product within a PLP category page instead of relying on a fixed product ID. This change ensures that tests remain valid even if the order or availability of products fluctuates.
- **\[E2E\]** Improved the robustness of the Country Detector shop switcher end-to-end test by incorporating the `first()` method. This ensures we consistently select the first matching shop element in cases where multiple options are present, preventing potential test ambiguities and enhancing overall reliability.
- **\[E2E\]** Improved the stability of our Basket end-to-end tests when running in parallel by assigning a dedicated test user to each browser. This prevents conflicts that can occur when multiple tests interact with shared user data, leading to more reliable and consistent test results.
- **\[E2E\]** Improvements in End-to-End test suite for PLP filters
  - Improved the accessibility and testability of Min and Max price input fields by adding the `data-testid` attribute.
  - Introduced the `openFilters()` method to the `productListingPage` class, simplifying the distinction between mobile and desktop test flows.
  - Updated the `Sale` filter switch element locator in `plpFilters` to reflect recent UI changes.
  - Enhanced Filter tests (`e2e-Plp.spec.ts`) to handle deep links with predefined filters more reliably and added `page.waitForLoadState('domcontentloaded')` for increased stability.
- **\[E2E\]** Improvements in End-to-End test suite for Wishlist:
  - Simplified the `productBrand` locator for greater reliability.
  - Tests related to adding products to the basket from the Wishlist have been temporarily skipped due to ongoing feature development. These tests will be reintroduced once the related functionality is fully implemented.
- **\[E2E\]** Improvements in End-to-End test suite of the PLP
  - Removed unnecessary navigation steps leading to the category page, optimizing test execution speed.
  - Improved the stability of add / remove Wishlist tests by incorporating additional DOM element waits.
- **\[E2E\]** Introduced page title checks to our PLP and PDP end-to-end tests. This ensures that the correct page titles are displayed to users, contributing to a smoother and more understandable browsing experience.
- **\[E2E\]** Made Filters deep-link test case on Product Listing Page more generic by excluding "Brand" filter.
- **\[E2E\]** Optimized mobile search tests by streamlining the `exactProductItem` locator to be more robust and less prone to errors and removing a redundant check for search category list visibility within `mobileNavigation.ts`. The test now directly verifies if the desired list item is visible and proceeds to click it, resulting in a more efficient and stable interaction flow.
- **\[E2E\]** Removed the serial execution constraint from Basket test cases, allowing them to run concurrently and further reducing overall test execution time.
- **\[E2E\]** Streamlined our Add to Basket end-to-end tests by combining the guest user and logged-in user flows. This change results in:
  - Improved Stability: Reduced the potential for inter-test interference during parallel execution.
  - Faster Execution: Eliminated redundant steps by merging separate test cases.
  - Expanded Coverage: Added a new assertion to verify that products remain in the basket after user authentication, covering a crucial aspect of the user journey.
- **\[Lighthouse\]** Implemented optimizations to significantly reduce the execution time of Lighthouse tests, enabling us to get quicker feedback on performance and identify areas for improvement more efficiently.
- **\[Lighthouse\]** The lighthouseAudit.ts script now accepts a viewportSize parameter, allowing users to run Lighthouse audits simulating either mobile or desktop environments. This improves the accuracy of performance and accessibility assessments for different device types.
- **\[PDP\]** Removed the unnecessary close icon between the size and quantity selectors.
- **\[PLP\]** Fixed price rounding in the price filter.
- **\[UI\]** Improved code consistency and readability by replacing unnecessary, arbitrary values in Tailwind classes with their more semantic equivalents. This makes our styling easier to understand and maintain.
- **\[UI\]** Removed the colons from the Countdown widget to create a cleaner and more visually appealing display.

### 🏡 Dependency updates

- Added dependency `@vueuse/components@11.2.0`
- Added dependency `@vueuse/integrations@11.2.0`
- Added dependency `focus-trap@7.6.1`
- Added dependency `tabbable@6.2.0`
- Added dependency `@testing-library/jest-dom@6.6.3`
- Added dependency `@testing-library/vue@8.1.0`
- Added dependency `fishery@2.2.2`
- Updated dependency `@contentful/live-preview@4.5.6` to `@contentful/live-preview@4.5.14`
- Updated dependency `@contentful/rich-text-html-renderer@16.6.10` to `@contentful/rich-text-html-renderer@17.0.0`
- Updated dependency `@scayle/nuxt-opentelemetry@0.3.2` to `@scayle/nuxt-opentelemetry@0.4.0`
- Updated dependency `@scayle/omnichannel-nuxt@4.0.1` to `@scayle/omnichannel-nuxt@4.0.2`
- Updated dependency `@scayle/storefront-nuxt@7.85.12` to `@scayle/storefront-nuxt@7.95.0`
- Updated dependency `@storyblok/nuxt@6.0.12` to `@storyblok/nuxt@6.2.0`
- Updated dependency `@storyblok/richtext@2.1.0` to `@storyblok/richtext@3.0.0`
- Updated dependency `@storyblok/vue@8.1.3` to `@storyblok/vue@8.1.5`
- Updated dependency `@vueuse/core@11.1.0` to `@vueuse/core@11.2.0`
- Updated dependency `@vueuse/nuxt@11.1.0` to `@vueuse/nuxt@11.2.0`
- Updated dependency `contentful@11.0.3` to `contentful@11.2.1`
- Updated dependency `contentful-export@7.19.155` to `contentful-export@7.19.163`
- Updated dependency `nanoid@5.0.7` to `nanoid@5.0.8`
- Updated dependency `nuxi@3.14.0` to `nuxi@3.15.0`
- Updated dependency `storyblok-js-client@6.10.0` to `storyblok-js-client@6.10.1`
- Updated dependency `vue@3.5.11` to `vue@3.5.12`
- Updated dependency `@nuxt/eslint@0.5.7` to `@nuxt/eslint@0.6.1`
- Updated dependency `@nuxt/test-utils@3.14.3` to `@nuxt/test-utils@3.14.4`
- Updated dependency `@nuxtjs/i18n@8.5.5` to `@nuxtjs/i18n@8.5.6`
- Updated dependency `@nuxtjs/tailwindcss@6.12.1` to `@nuxtjs/tailwindcss@6.12.2`
- Updated dependency `@scayle/eslint-config-storefront@4.3.0` to `@scayle/eslint-config-storefront@4.3.2`
- Updated dependency `@types/color@3.0.6` to `@types/color@4.2.0`
- Updated dependency `@types/node@20.16.11` to `@types/node@22.9.0`
- Updated dependency `@typescript-eslint/scope-manager@8.8.1` to `@typescript-eslint/scope-manager@8.14.0`
- Updated dependency `@typescript-eslint/utils@8.8.1` to `@typescript-eslint/utils@8.14.0`
- Updated dependency `@upstash/redis@1.34.2` to `@upstash/redis@1.34.3`
- Updated dependency `@vitest/coverage-v8@2.1.2` to `@vitest/coverage-v8@2.1.4`
- Updated dependency `@vue/typescript-plugin@2.1.6` to `@vue/typescript-plugin@2.1.10`
- Updated dependency `eslint@9.12.0` to `eslint@9.14.0`
- Updated dependency `eslint-plugin-tailwindcss@3.17.4` to `eslint-plugin-tailwindcss@3.17.5`
- Updated dependency `eslint-plugin-unimport@0.1.0` to `eslint-plugin-unimport@0.1.1`
- Updated dependency `happy-dom@15.7.4` to `happy-dom@15.11.4`
- Updated dependency `nuxt-svgo@4.0.6` to `nuxt-svgo@4.0.8`
- Updated dependency `ofetch@1.4.0` to `ofetch@1.4.1`
- Updated dependency `postcss@8.4.47` to `postcss@8.4.49`
- Updated dependency `postcss-custom-properties@14.0.1` to `postcss-custom-properties@14.0.4`
- Updated dependency `storyblok@3.34.0` to `storyblok@3.35.0`
- Updated dependency `tailwindcss@3.4.13` to `tailwindcss@3.4.14`
- Updated dependency `typescript@5.6.2` to `typescript@5.6.3`
- Updated dependency `vitest@2.1.2` to `vitest@2.1.4`
- Updated dependency `vue-tsc@2.1.6` to `vue-tsc@2.1.10`

## 1.4.0

### 🔥 Highlights

#### 🛍️ New Product Detail Page

This release includes a newly refreshed Product Detail Page with an improved design, better accessibility and extendability and more test coverage.

#### 🧪 PDP E2E tests

In this release we've also added a new set of E2E tests to cover the product detail page.

#### 📦 Removing Vue component auto imports

As part of our work to remove automatic imports, in this release Vue components will no longer be auto-imported. We've also added some ESLint rules to cover unimported components.

### 💅 Minor Changes

- Remove boolean props on `Modal.vue` to control styling. Instead styling is done by adding styles to the `<SFModal>` and its content.
- Add skeleton loader for the product detail page.
- Added PDP E2E tests, first phase.
- Disable auto-imports for Vue components
- Simplify the wishlist card by utilizing the plain product card and eliminating all basket-related actions.
- The basket does not allow quantity > 50. Therefore, we limit the quantity on the PDP to 50.
- Replace `InputToggle` with `Switch` component
- Enhance product card component by removing slots, simplifying the HTML structure and removing unnecessary slots.

### 🩹 Patch Changes

- Fix placement of price within the `ProductCardDetails.vue`
- Product color is now mapped by attribute value instead of ID
- Handle possibly undefined `orderData` when calculating `deliveryDate` on Order Success page
- Removes unused `useWishlistItem` and `useWishlistItemActions` from the project
- Fixed an issue on CMS content pages with empty teaser image leading to unnecessary white space
- Replace getters and setters across the app with `defineModel`
- End-to-End and Lighthouse tests adaptions to match latest changes in Storefront Boilerplate.
- Take campaign discounts into account when displaying prices on a product card
- Cleanup image utilities to always use `primaryImage`

### 🏡 Dependency updates

- Added dependency `@vueuse/gesture@2.0.0`
- Added dependency `@vue/typescript-plugin@2.1.6`
- Updated dependency `@scayle/nuxt-opentelemetry@0.3.1` to `@scayle/nuxt-opentelemetry@0.3.2`
- Updated dependency `@scayle/omnichannel-nuxt@4.0.0` to `@scayle/omnichannel-nuxt@4.0.1`
- Updated dependency `@scayle/storefront-nuxt@7.85.7` to `@scayle/storefront-nuxt@7.85.12`
- Updated dependency `@storyblok/nuxt@6.0.10` to `@storyblok/nuxt@6.0.12`
- Updated dependency `@storyblok/richtext@2.0.0` to `@storyblok/richtext@2.1.0`
- Updated dependency `@storyblok/vue@8.1.0` to `@storyblok/vue@8.1.3`
- Updated dependency `@types/google.maps@3.58.0` to `@types/google.maps@3.58.1`
- Updated dependency `@vercel/kv@2.0.0` to `@vercel/kv@3.0.0`
- Updated dependency `axios@1.6.8` to `axios@1.7.7`
- Updated dependency `contentful@10.15.1` to `contentful@11.0.3`
- Updated dependency `contentful-export@7.19.148` to `contentful-export@7.19.155`
- Updated dependency `maska@2.1.11` to `maska@3.0.3`
- Updated dependency `nuxi@3.13.2` to `nuxi@3.14.0`
- Updated dependency `storyblok-js-client@6.9.2` to `storyblok-js-client@6.10.0`
- Updated dependency `vue@3.4.38` to `vue@3.5.11`
- Updated dependency `@changesets/cli@2.27.8` to `@changesets/cli@2.27.9`
- Updated dependency `@nuxt/image@1.7.0` to `@nuxt/image@1.8.1`
- Updated dependency `@nuxt/test-utils@3.14.2` to `@nuxt/test-utils@3.14.3`
- Updated dependency `@nuxtjs/i18n@8.5.3` to `@nuxtjs/i18n@8.5.5`
- Updated dependency `@scayle/eslint-plugin-vue-composable@0.2.0` to `@scayle/eslint-plugin-vue-composable@0.2.1`
- Updated dependency `@types/node@20.16.5` to `@types/node@20.16.11`
- Updated dependency `@typescript-eslint/scope-manager@8.6.0` to `@typescript-eslint/scope-manager@8.8.1`
- Updated dependency `@typescript-eslint/utils@8.6.0` to `@typescript-eslint/utils@8.8.1`
- Updated dependency `@upstash/redis@1.34.0` to `@upstash/redis@1.34.2`
- Updated dependency `@vitest/coverage-v8@2.1.1` to `@vitest/coverage-v8@2.1.2`
- Updated dependency `eslint@9.10.0` to `eslint@9.12.0`
- Updated dependency `nuxt@3.11.2` to `nuxt@3.13.2`
- Updated dependency `ofetch@1.3.4` to `ofetch@1.4.0`
- Updated dependency `storyblok@3.33.3` to `storyblok@3.34.0`
- Updated dependency `tailwindcss@3.4.12` to `tailwindcss@3.4.13`
- Updated dependency `unimport@3.12.0` to `unimport@3.13.1`
- Updated dependency `vitest@2.1.1` to `vitest@2.1.2`

## 1.3.0

### 🔥 Highlights

#### 🌍 Introducing Country Detection

The Storefront now includes basic functionality to detect a user's country without relying on 3rd-party services. If a user visits a shop from a different country than the one detected, a shop/country switcher modal will appear, offering the option to switch to the appropriate local or global shop or stay on the current one

##### How it works

In the `onMounted` hook, we look up the country of the user and check if it matches the current shop. If it does not match, we try to find a shop which does match that country and prompt the user to switch to the other shop. When a user is logged in or has already declined the prompt, we no longer show the dialog.

##### Disabling

If you want to disable this feature, remove the `<CountryDetection/>` component from the `default.vue` layout.

##### Customizing

The default implementation of the country detection uses the timezone of the browser to assume the user's country. If you would like to use a different method such as GeoIP lookup, the `getCurrentCountryFromTimezone` function can be easily swapped out. The replacement function should return a single country code which represents the user's country, or `undefined` if one cannot be found. Or in other words a function which matches the interface `() => string | undefined`

It's also possible to customize the `getShopsForRegion` function. The default implementation will search the available shops for those which match the detected region. If there are multiple matches, multiple options will be presented in the dialog. A fallback `shopId` can be passed as the second argument. This is useful if you have a global shop. When no shop matches the user's region, this fallback will be used instead. If there are no matches and a fallback is not specified, the user will not be prompted.

The country names shown in the prompt use the default translation of the shop's country code. If you would like to override this behavior, extend the translations file with the key `country_selection.override_codes.CODE`. The code should be uppercase.

#### 🧪 Playwright replaces Cypress as new End-to-End testing solution

We have fully transitioned from Cypress to Playwright as our End-to-End testing solution, enhancing overall test coverage in the process. Additionally, we’ve integrated Lighthouse performance testing to further improve application quality.

For more information check out the [Storefront End-To-End Testing Guide in the SCAYLE Resource Center](https://scayle.dev/en/storefront-guide/developer-guide/testing/end-to-end-testing)

#### 🛍️ PLP Performance Improvements

We’ve started further refining the performance of the new Storefront PLP. This includes resolving existing hydration issues, resulting in unnecessary partial re-rendering, optimizing the wishlist icon toggling for a more responsive user experience, as well as improving the responsiveness when switching between categories.

#### 🗞️ CMS Integration Stability Improvements

We’ve updated the CMS integration of Storefront, enhancing both Storyblok and Contentful to improve overall reliability and stability. These updates include removing unsupported legacy CMS components, optimizing content fetching behavior for certain page types, fixing multiple type-related issues, and consolidating CMS credential handling along with redundant plugin initialization.

### 🚀 Major Changes

- **\[Sorting\]** Introduced "Smart Sorting Keys" as new default sorting.

  To learn more about Smart Sorting Keys, visit the [SCAYLE Resource Center / Product Sorting](https://scayle.dev/en/developer-guide/products/product-sorting#smart-sorting).

- **\[E2E\]** Removed `Cypress` and finished migration to `Playwright` as End-to-End testing suite
- **\[Country Detection\]** Added `getCurrentCountryFromTimezone` util function to determine user's country from the browser's timezone settings

### 💅 Minor Changes

- **\[PLP\]** Improve responsiveness of switching categories on the product listing page
  The following changes were made to optimize the navigation that occurs on a category switch:
  - Skipping unnecessary middlewares on the navigation
  - Not unnecessarily reloading root categories on category switch
  - Removing unnecessary awaits within `setup` functions
  - Passing `categoryId` to `useProducts` directly to avoid additional fetches
- **\[nuxt/image\]** Renamed the `default` image provider to `scayle` to improve clarity and removed the default provider setting in the `@nuxt/image` module settings to allow using local images with the `NuxtImg` component.
  For this, place your local image into the `public/` folder and use the following component:

  ```vue
  <NuxtImg src="/{fileName}" />
  ```

  _(NOTE: The filename should be without the `/public` folder name.)_

- **\[Utility Replacement\]** Replace `yn` with custom `stringToBoolean` utility function
- **\[Utility Replacement\]** Replaced `radash.sort` with native `toSorted`
- **\[Utility Replacement\]** Replaced functional utility `sort` with native `toSorted`
- **\[Utility Replacement\]** Replaced `radash.min` and `radash.sum` with custom functional utilities
- **\[Utility Replacement\]** Replaced `radash.isString` with native `typeof value === 'string` based check
- **\[Utility Replacement\]** Replaced `radash.alphabetical` with native `toSorted`
- **\[Utility Replacement\]** Replaced functional utility `isEmpty` with native `Object.values(obj).length === 0` check
- **\[Utility Replacement\]** Replaced instances of `radash.debounce` with `useDebounceFn` from `vueuse/core`
- **\[Utility Replacement\]** Replaced `sort` and `alphabetical` utils with native functionality
- **\[Utility Replacement\]** Replace `radash.sleep` with `wait` util from `@scayle/storefront-nuxt`
- **\[Utility Replacement\]** Replaced `radash.snake` with custom functional utility
- **\[Utility Replacement\]** Replaced `radash.unique` with native array operations:

  ```ts
  arrayValue.filter(
    (item, index, self) =>
      index === self.findIndex((arrayItem) => arrayItem.value === item.value),
  )
  ```

- **\[Utility Replacement\]** Replaced `radash.dash` with native string operations

  ```ts
  stringValue
    .split(/[\s_.-]+|(?=[A-Z][a-z])/)
    .join('-')
    .toLowerCase()
  ```

- **\[Utility Replacement\]** Replaced `radash.isEqual` with custom `isEqual` util

  **NOTE:** Arbitrary comparison of objects can have a exponentially negative impact
  on performance the larger the compared objects are. We recommend to compare the
  values of explicit keys between two objects.

- **\[Utility Replacement\]** Replaced `radash.pascal` with native string operations:

  ```ts
  stringValue
    .split(/[\s_.-]+|(?=[A-Z][a-z])/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
  ```

- **\[Utility Replacement\]** Replaced `radash.sum` with native calculations and array operations:

  ```ts
  array.reduce((acc, item) => acc + item, 0)
  ```

- **\[Utility Replacement\]** Utility Replacement: Replaced `radash.min` with native array operations:

  ```ts
  // Plain array
  // Input: [4, 2, 8, 6]
  // Output: [2]
  Math.min(...(numbersArray.length ? numbersArray : []))

  // Array containing objects
  // Input: [{ numberValue: 4 }, { numberValue: 2 }, { numberValue: 8 }, { numberValue: 6 }]
  // Output: { numberValue: 2 }
  const getValueForComparison = (objectValue) => objectValue.numberValue
  array.reduce((a, b) =>
    getValueForComparison(a) < getValueForComparison(b) ? a : b,
  )
  ```

- **\[Utility Replacement\]** Replaced `radash.snake` with custom native string operations:

  ```ts
  stringValue
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    ?.map((x) => x.toLowerCase())
    .join('_')
  ```

- **\[Utility Replacement\]** Replaced `radash.pick` with native array operations:

  ```ts
  // objectValue: Record<string, unknown>
  // keysList: string[]
  Object.fromEntries(
    keysList
      .filter((key) => key in objectValue)
      .map((key) => [key, objectValue[key]]),
  )
  ```

- **\[Utility Replacement\]** Replaced `radash.group` with native array operations:

  ```ts
  arrayValue.reduce(
    (acc, item) => {
      const groupId = item.id // Exchange item.id with the appropriate object key
      if (!acc[groupId]) acc[groupId] = []
      acc[groupId].push(item)
      return acc
    },
    {} as Record<string, TypeOfArrayElement[]>,
  )
  ```

- **\[Utility Replacement\]** Replaced `radash.capitalize` with native string operations:

  ```ts
  stringValue.charAt(0).toUpperCase() + stringValue.slice(1)
  ```

- **\[CMS\]** Removed auto-import capabilities of local CMS module in favor of using explicit imports for composables and utilities
- **\[CMS\]** Removed `axiosFetchAdapter` from Contentful CMS provider integration as Edge deployment support has been dropped
- **\[CMS\]** Refactored deprecated usage of `pending` from `fetchBySlug` in CMS related components to use `status` instead
- **\[CMS\]** Removed unsupported CMS components from Contentful component definitions
  - `SbListingDisruptor`
  - `SbNewsletter`
  - `SbStore`
  - `SbStorePage`
- **\[CMS\]** Removed unsupported CMS components from Storyblok component definitions -`SbListingDisruptor`
  - `SbNewsletter`
  - `SbStore`
  - `SbStorePage`
- **\[CMS\]** Fixed issues with fetching CMS data for categories and content pages due to changes in path slugs.
  Category slugs are expected to now have the form `c/c-{categoryId}` (before `category/{categoryId}`),
  while content pages are expected to have the form `content/{pageName}`(before `c/{pageName}`).
- **\[CMS\]** Fixed possible composable misuse errors.
  `useCMS` has been split into `useCMSBySlug` and `useCMSByFolder` to avoid possible errors,
  caused by calling a composable outside the appropriate context.
  This applies to both the Contentful and Storyblok providers.
  - Before:

    ```ts
    const { fetchBySlug } = useCMS('some-key')
    const { data } = fetchBySlug('some-slug')
    ```

  - After:

    ```ts
    const { data } = useCMSBySlug('some-key', 'some-slug')
    ```

- **\[E2E\]** Added tests for checking basic Home page layout and link validity
- **\[E2E\]** Added tests for Wishlist page
- **\[E2E\]** Added tests for User Orders page, user with and without orders
- **\[E2E\]** Added basic tests for Checkout page
- **\[E2E\]** Added tests to check Footer functionalities
- **\[E2E\]** Added tests for Promotion banner basic features
- **\[E2E\]** Added tests to verify User Account page features
  - Verify User personal data layout
  - Update birth date with correct and incorrect date format
  - Update password matching and non-matching new password
- **\[E2E\]** Added tests for Basket:
  - Empty state guest and logged in user
  - Add to Basket guest and logged in user
  - Basket features for regular product
- **\[E2E\]** Extended Product Listing Page test with sibling test cases
- **\[E2E\]** Extended tests for basket by adding `data-testid` attributes to "Login" and "Continue shopping" buttons in Basket empty state
- **\[E2E\]** Set up mobile testing in Playwright to cover Chrome and Safari
  - Adaption of test `e2e-happy-path.spec.ts` to work with mobile navigation
- **\[E2E\]** Extends tests for Search to run on mobile devices
  - Added mobile specific locators to work with navigation and search features on mobile devices.
- **\[E2E\]** Optimizing tests to run faster and be more resilient
  - Added `{ waitUntil: 'commit' }` or `{ waitUntil: 'load' }` to `page.goto()` method where possible
  - Implemented retry mechanism using `expect()` to handle callback function with the
    Playwright built-in `toPass()` method to avoid possible failures caused by hydration
  - Added `test.step` into some tests with more steps to complete, to achieve better readability in the reports
- **\[E2E\]** Adapting E2E tests to use new test ID attributes due to the migration of existing `data-test-id` to `data-testid`. This enables Playwright to use built-in locator `getByTestId()`
  - Deleted existing PLP `.spec.ts` files and added all PLP tests to `e2e-Plp-spec.ts`,
    so this file now contains all current and future PLP tests.
    Having multiple tests within one `.spec.ts` file follows the logic of having
    multiple tests within one test suite related to respective application section.
  - Added test to check add/remove to/from Wishlist from PLP page
- **\[UI\]** Updated the `Modal` component to use native HTML `<dialog>` element
- **\[UI\]** Removed unused `SFSlideshow` component

### 🩹 Patch Changes

- **\[CMS\]** Fixed footer social media icons not being visible even though content had been set via CMS provider
- **\[CMS\]** Fixed issues with Storyblok CMS setup by removing legacy runtime option (`public.storyblok` in `nuxt.config.ts`)
  and ensuring the necessary `accessToken` is not overridden during Storyblok module initialization.
- **\[CMS\]** Fixed issues with Storyblok CMS setup where the `@storyblok/vue` plugin has been initialized twice, resulting in misleading runtime warnings and errors.
- **\[CMS\]** Replaced Storyblok RichTextResolver class with dedicated `@storyblok/richtext` dependency
- **\[CMS\]** Removed deprecated `AppFooter` component as it has been replaced by `CMSAppFooter`
- **\[CMS\]** Fixed handling of empty Contentful CMS link values resulting in application crashes
- **\[CMS\]** Fixed type errors in Contentful's `useCms` composable
- **\[Code Style\]** Applied consistent `v-bind` style and enforced through lint rule
- **\[Code Style\]** Enabled and enforced `tailwindcss/no-custom-classname` lint rule
- **\[Code Style\]** Resolved `no-explicit-any` issues in Vue components
- **\[Code Style\]** Resolved `no-explicit-any` warnings in CMS modules
- **\[Code Style\]** Enabled and enforced `no-explicit-any` lint rule and resolved remaining warnings
- **\[Code Style\]** Resolved `no-explicit-any` warnings in tracking composables and utils
- **\[Config\]** Removed duplicate TailwindCSS generation
- **\[Config\]** Resolved nuxt-i18n issues with domain shop selection
  - Remove unused variable from `.env.example`
  - Use unique placeholder domains in nuxt-i18n config
  - Replace the deprecated `iso` option with `language`
- **\[Config\]** Removed `vite.build.rollupOptions.external` option to handle former
  `@scayle/omnichannel-nuxt` Nuxt 2-support for `@nuxtjs/composition-api` in `nuxt.config.ts`
- **\[Config\]** Enabled `noImplicitAny` in `tsconfig.json`
- **\[Config\]** Fixed missing image modifiers in SCAYLE provider for `nuxt/image` module
- **\[Config\]** Enable cookieStore option to resolve Lighthouse `bfcache` audit
- **\[PLP\]** Fixed focus behavior to don't focus close button in `FilterSlideIn`
- **\[PLP\]** Fixed hydration error on product list caused by invalid HTML (nested anchor elements)
- **\[PLP\]** Only fetch necessary product attributes from SAPI to reduce payload size
- **\[PLP\]** Improve perceived performance of the wishlist toggle by optimistically changing the icon
- **\[PLP\]** Tweaked `useFilter` and `useProductsByCategory` to use the same parameters to avoid discrepancies
- **\[PLP\]** Brought back `details` slot on `ProductCard.vue` which had been removed previously
- **\[PLP\]** Used correct product name in URL when linking to PDP
- **\[PLP\]** Fixed current `categoryID` not being passed to `FilterSlideIn`
- **\[PLP\]** Used responsive classes instead of rendering different DOM based on size
- **\[PLP\]** Fixed height of `FilterSlideIn` on mobile devices
- **\[Translations\]** Fixed the english translation for free gifts on the PDP
- **\[UI\]** Fixed scaling issue with large logout button on `AccountPage`

### 🏡 Dependency Updates

- Added dependency `@storyblok/richtext@2.0.0`
- Removed dependency `nuxt-jsonld@2.0.8`
- Removed dependency `radash@12.1.0`
- Removed dependency `yn@5.0.0`
- Updated dependency from `@contentful/live-preview@4.5.1` to `@contentful/live-preview@4.5.6`
- Updated dependency from `@contentful/rich-text-html-renderer@16.6.8` to `@contentful/rich-text-html-renderer@16.6.10`
- Updated dependency from `@scayle/storefront-nuxt@7.84.4` to `@scayle/storefront-nuxt@7.85.7`
- Updated dependency from `@storyblok/vue@8.0.8` to `@storyblok/vue@8.1.0`
- Updated dependency from `@tailwindcss/forms@0.5.7` to `@tailwindcss/forms@0.5.9`
- Updated dependency from `@tailwindcss/typography@0.5.14` to `@tailwindcss/typography@0.5.15`
- Updated dependency from `@types/google.maps@3.55.12` to `@types/google.maps@3.58.0`
- Updated dependency from `@vueuse/core@10.11.1` to `@vueuse/core@11.1.0`
- Updated dependency from `@vueuse/nuxt@10.11.1` to `@vueuse/nuxt@11.1.0`
- Updated dependency from `cf-content-types-generator@2.15.3` to `cf-content-types-generator@2.15.5`
- Updated dependency from `contentful-export@7.19.145` to `contentful-export@7.19.148`
- Updated dependency from `contentful@10.13.2` to `contentful@10.15.1`
- Updated dependency from `nuxi@3.12.0` to `nuxi@3.13.2`
- Updated dependency from `storyblok-js-client@6.8.1` to `storyblok-js-client@6.9.2`
- Updated dependency from `vue@3.4.36` to `vue@3.4.38`
- Updated dependency from `@changesets/cli@2.27.7` to `@changesets/cli@2.27.8`
- Updated dependency from `@nuxt/eslint@0.4.0` to `@nuxt/eslint@0.5.7`
- Updated dependency from `@nuxt/test-utils@3.14.0` to `@nuxt/test-utils@3.14.2`
- Updated dependency from `@nuxtjs/i18n@8.3.3` to `@nuxtjs/i18n@8.5.3`
- Updated dependency from `@types/node@20.14.15` to `@types/node@20.16.5`
- Updated dependency from `@typescript-eslint/scope-manager@8.0.1` to `@typescript-eslint/scope-manager@8.6.0`
- Updated dependency from `@typescript-eslint/utils@8.0.1` to `@typescript-eslint/utils@8.6.0`
- Updated dependency from `@vitest/coverage-v8@2.0.5` to `@vitest/coverage-v8@2.1.1`
- Updated dependency from `eslint-plugin-unimport@0.0.3` to `eslint-plugin-unimport@0.1.0`
- Updated dependency from `eslint@9.9.0` to `eslint@9.10.0`
- Updated dependency from `happy-dom@14.12.3` to `happy-dom@15.7.4`
- Updated dependency from `lint-staged@15.2.8` to `lint-staged@15.2.10`
- Updated dependency from `nuxt-svgo@4.0.3` to `nuxt-svgo@4.0.6`
- Updated dependency from `postcss-custom-properties@14.0.0` to `postcss-custom-properties@14.0.1`
- Updated dependency from `postcss@8.4.41` to `postcss@8.4.47`
- Updated dependency from `storyblok@3.32.3` to `storyblok@3.33.3`
- Updated dependency from `tailwindcss@3.4.9` to `tailwindcss@3.4.12`
- Updated dependency from `typescript@5.5.4` to `typescript@5.6.2`
- Updated dependency from `unimport@3.10.0` to `unimport@3.12.0`
- Updated dependency from `vitest-environment-nuxt@1.0.0` to `vitest-environment-nuxt@1.0.1`
- Updated dependency from `vitest@2.0.5` to `vitest@2.1.1`
- Updated dependency from `vue-tsc@2.0.29` to `vue-tsc@2.1.6`

## 1.2.0

### 🔥 Highlights

#### 🛍️ New Product Listing Page

This release not only introduces a fresh look and feel of the Product Listing Page
but also brings enhanced functionalities to improve the user experience:

- **Advanced filtering:** Improved filters to help users easily find the products
  they are looking for by dynamically updating filters and displaying only relevant filter options.
- **Intuitive category navigation:** Navigate seamlessly between nested and root categories.
- **Enhanced badges:** Badges highlight features, novelty, or other product attributes.
  This includes the "New In" badge for newly added products, custom badges for specific attributes (e.g., sustainability),
  and the "Already in Basket" badge to help users avoid duplicate selections.

Moreover, the new page is built with a simple and easily customizable codebase,
ensuring that it can be tailored to meet your specific needs.

To learn more about the main components, data fetching and filtering logic,
and customization opportunities, please refer to our [Storefront Guide](https://scayle.dev/en/storefront-guide/developer-guide/features/pages/product-listing-page).

#### 🔀 Multiple paths per shop

We now have the ability to configure multiple URL paths for single shops (per `shopId`),
where before could only handle one URL path per single shop.
As example, this allows the same shop to be reachable under multiple different
paths like `your-shop.com/en-gb/`, `your-shop.com/en-us/`, `your-shop.com/en-au/`.
This reduces the need for excessive configurations, while simultaneously enhancing performance.

The `path` property in the shop config can now be defined as an array of strings.
If this is the case, multiple path prefixes will point to the same shop.
For example, with the config `{ path: ['en', 'en-US'], shopId: 1001 }` both
`example.com/en` and `example.com/en-US` will use shop 1001.
Because it is the same shop, `/en` and `/en-US` will have the same locale and share user sessions, baskets and wishlists.
The first path in the array will be considered the default path and used for API calls.

#### 🔭 Dedicated NPM package for OpenTelemetry integration

A while back we introduced support for OpenTelemetry. OpenTelemetry is an open-source
standard for instrumenting your applications, providing valuable insights into performance and behavior.
It allows you to collect, process, and export telemetry data like metrics, logs,
and traces to various backend platforms, enabling better monitoring and troubleshooting.
As part of our commitment to contributing more to the open-source community,
we've published the previous integration as a dedicated NPM package, making it widely
accessible and improving its capabilities.

### 🚀 Major Changes

- Use the newly introduced `useRpcCall` helper composable
  _(More information can be found in the [SCAYLE Resource Center](https://scayle.dev/en/storefront-guide/developer-guide/basic-setup/rpc-methods#userpccall))_
- Replace the internal OpenTelemetry module with the `@scayle/nuxt-opentelemetry` package
- Re-enable caching for Vercel deployments
- Retrieve access token for `subscription-overview` web component via `getAccessToken` RPC
- Disabled `imports.autoImports` in `nuxt.config.ts`. All required composables,
  utils and constants now need to be explicitly imported.
- Added a hook within `nuxt.config.ts` to extend the `vite` client build configuration and allow for improved manual
  chunking of `storyblok`, `contentful` and `axios` Dependencies. This results in smaller client chunks below 500kb.

### 💅 Minor Changes

- Migrate configuration key `bapi` to `sapi` within `nuxt.config.ts`
- Renamed buildtime environment variable `DISABLE_PAGE_CACHE` to `PAGE_CACHE_DISABLED`
- Renamed buildtime environment variable `ENABLE_CONFIG_LOG_BUILD` to `CONFIG_LOG_BUILD_ENABLED`
- Renamed buildtime environment variable `ENABLE_CONFIG_LOG_PRETTIER` to `CONFIG_LOG_PRETTIER_ENABLED`
- Renamed buildtime environment variable `ENABLE_CONFIG_LOG_RUNTIME` to `CONFIG_LOG_RUNTIME_ENABLED`
- Renamed buildtime environment variable `ENABLE_NUXT_DEBUGGING` to `NUXT_DEBUGGING_ENABLED`
- Show IDP login buttons in `RegisterForm.vue`
- Support toggling shop selection modes through a single const `SHOP_SELECTOR_MODE` in the nuxt config
- Switch to `ModuleBaseOptions.shops` and `ShopConfig.shopCampaignKeyword`

### 🩹 Patch Changes

- Add example multi-path shop
- Add missing `diverse` option to `UserPersonalInfoForm.vue`

- Allow `PromotionList.vue` to scroll to make all promotions accessible on smaller desktop sizes
- Disable global components in local `ui` module
- Fixed "More"-button of mobile search results now leads to search page
- Fixed disabled sold out sizes when adding wishlist items to the cart
- Hide `UpdatePasswordForm.vue` for IDP user within Account Overview page
- Remove `idp` from `AdditionalShopConfig`, as it is available in the base storefront configuration
- Remove required rule on `birthDate` field in `UserPersonalInfoForm.vue`
- Remove unnecessary `await` when using composables
- Use integrated `nuxi typecheck` instead of custom `vue-tsc` typecheck script command
- Use unique composable keys for `useOrderDetails` and within `usePromotionGifts`
- Wait for user input completion before displaying any errors in the login form

### 🏡 Dependency Updates

#### 🏘️ DevDependencies

- Added `@scayle/nuxt-opentelemetry@0.3.0`
- Updated to `@contentful/live-preview@4.5.0`
- Updated to `@contentful/rich-text-html-renderer@16.6.8`
- Updated to `@googlemaps/js-api-loader@1.16.8`
- Updated to `@opentelemetry/auto-instrumentations-node@0.49.0`
- Updated to `@scayle/omnichannel-nuxt@3.0.3`
- Updated to `@scayle/storefront-nuxt@7.84.0`
- Updated to `@types/google.maps@3.55.12`
- Updated to `contentful@10.13.1`
- Updated to `redis@4.7.0`
- Updated to `storyblok-js-client@6.8.1`
- Updated to `ufo@1.5.4`
- Updated to `vue@3.4.35`
- Removed `@opentelemetry/api`
- Removed `@opentelemetry/auto-instrumentations-node`
- Removed `@opentelemetry/exporter-trace-otlp-proto`
- Removed `@opentelemetry/instrumentation`
- Removed `@opentelemetry/resources`
- Removed `@opentelemetry/sdk-node`
- Removed `@opentelemetry/semantic-conventions`
- Removed `@vercel/otel`

#### 🏠 Dependencies

- Updated to `@changesets/cli@2.27.7`
- Updated to `@nuxt/eslint@0.4.0`
- Updated to `@nuxt/test-utils@3.14.0`
- Updated to `@nuxtjs/i18n@8.3.3`
- Updated to `@nuxtjs/tailwindcss@6.12.1`
- Updated to `@scayle/eslint-config-storefront@4.3.0`
- Updated to `@types/node@20.14.14`
- Updated to `@typescript-eslint/scope-manager@8.0.0`
- Updated to `@typescript-eslint/utils@8.0.0`
- Updated to `@upstash/redis@1.34.0`
- Updated to `@vitest/coverage-v8@2.0.5`
- Updated to `eslint-plugin-vuejs-accessibility@2.4.1`
- Updated to `eslint@9.8.0`
- Updated to `nuxt-svgo@4.0.2`
- Updated to `nuxt@3.11.2`
- Updated to `postcss-custom-properties@13.3.12`
- Updated to `postcss@8.4.40`
- Updated to `storyblok@3.32.3`
- Updated to `tailwindcss@3.4.7`
- Updated to `typescript@5.5.4`
- Updated to `unimport@3.9.1`
- Updated to `vitest@2.0.5`
- Updated to `vue-tsc@2.0.29`

## 1.1.0

### 🔥 Highlights

#### 👓 Live Preview for CMS provider

We have integrated proper Live Preview support for Storyblok and Contentful.
This allows to edit the CMS content elements within the respective CMS provider
web interface and show the changes immediately in the context of the Storefront Application.

- [Storyblok: Editor Guides - Visual Editor](https://www.storyblok.com/docs/editor-guides/visual-editor)
- [Contentful: Developer Docs - Live preview](https://www.contentful.com/developers/docs/tutorials/general/live-preview/)

#### 🚚 Introduced usage of explicit imports for Vue components

To align more with the JavaScript and TypeScript developer ecosystem,
Storefront Boilerplate is slowly moving away on relying on the Nuxt "auto import" feature
for Dependencies and source code. With the next `v1.2` release we will deepen
the commitment and will disable the option `imports.autoImport` within the `nuxt.config.ts`.

As a first step we added explicit imports to all Vue components.
As `defineProps`, `defineEmits` and `withDefaults` are Vue compiler macros,
they do not need to be imported explicitly and will trigger a compiler warning if done so.

### 🚀 Major Changes

- Enable live preview for CMS provider `storyblok`
- Enable live preview for CMS provider `contentful`
- Introduced local module `storefront-eslint-auto-explicit-import` to extend `eslint` with explicit import injection
- Introduced usage of explicit imports for composables, utilities and framework-specific functionalities in Vue components
- Fixed errors in async composable usage
  - This change enables all rules in `@scayle/eslint-plugin-vue-composable` and
    ensures that all composables in the application conform to best practices regarding asynchronous usage.
    These changes may fix various bugs relating to reactivity issues.
    As part of this change, some composables are now entirely synchronous.

### 💅 Minor Changes

- Introducing [eslint-plugin-vuejs-accessibility](https://vue-a11y.github.io/eslint-plugin-vuejs-accessibility) for basic accessibility linting of Vue components
- Renamed prop `until` to `timeUntil` for `SFCountdown` and `PromotionCountdown` components to avoid name collision with `until` from `@vueuse/core`
- Replace `radash-nuxt` module with `radash` as dependency and use explicit imports instead
- Share PDP state with `useProductDetailsBasketActions` and `ProductBasketAndWishlistActions.vue`
- Updated mobile sidebar navigation to support expanding and collapsing top-level categories

### 🩹 Patch Changes

- Ensure `authGuard.global.ts` has user information during SSR
- Ensure the OSP only does the user refresh on client side
- Fixed `SFLink` in `Breadcrumbs`
- Fixed missing error alert on failed login
- Fixed mobile basket layout when there are products with long titles
- Fixed Regenerate the `itemGroup.id` each time an itemGroup is added to the basket
- Fixed selected gender being ignored during registration
- Prevent old user data from being applied to the state after `user.forceRefresh()` as happened on the OSP

### 🏡 Dependency Updates

#### 🏘️ DevDependencies

- Added `@typescript-eslint/scope-manager@7.13.1`
- Added `@typescript-eslint/utils@7.13.1`
- Added `eslint-plugin-unimport@0.0.3`
- Added `eslint-plugin-vuejs-accessibility@2.3.0`
- Added `eslint@9.5.0`
- Added `pathe@1.1.2`
- Added `unimport@3.7.2`
- Updated to `@changesets/cli@2.27.5`
- Updated to `@types/node@20.14.6`
- Updated to `@typescript-eslint/scope-manager@7.13.1`
- Updated to `eslint-plugin-tailwindcss@3.17.4`
- Updated to `happy-dom@14.12.3`
- Updated to `lint-staged@15.2.7`
- Updated to `storyblok@3.32.1`
- Updated to `tailwindcss@3.4.4`
- Updated to `vue-tsc@2.0.21`

#### 🏠 Dependencies

- Added `@contentful/live-preview@4.2.2`
- Added `radash@12.1.0`
- Removed `radash-nuxt`
- Updated to `@contentful/rich-text-html-renderer@16.5.2`
- Updated to `@opentelemetry/api@1.9.0`
- Updated to `@opentelemetry/auto-instrumentations-node@0.47.1`
- Updated to `@opentelemetry/exporter-trace-otlp-proto@0.52.1`
- Updated to `@opentelemetry/instrumentation@0.52.1`
- Updated to `@opentelemetry/resources@1.25.1`
- Updated to `@opentelemetry/sdk-node@0.52.1`
- Updated to `@opentelemetry/semantic-conventions@1.25.1`
- Updated to `@scayle/omnichannel-nuxt@3.0.2`
- Updated to `@scayle/storefront-nuxt@7.77.0`
- Updated to `@types/google.maps@3.55.10`
- Updated to `@vercel/kv@2.0.0`
- Updated to `@vueuse/core@10.11.0`
- Updated to `@vueuse/nuxt@10.11.0`
- Updated to `cf-content-types-generator@2.15.3`
- Updated to `contentful@10.12.1`
- Updated to `nuxi@3.12.0`

## 1.0.0

### 🔥 Highlights

#### 🧱 Introducing `storefront-ui` local module

We're introducing the first step towards more reusable components, the local `storefront-ui` module.
It contains most common and reused UI component from across the SCAYLE Storefront Boilerplate.
The first iteration consists of most components mostly formerly located within the `./components/ui` directory.

To foster an increased separation of concerns, the local `storefront-ui` module also contains composables and utilities that are closely related to the common and reused UI component.
Moreover, all components within the the local `storefront-ui` module are now prefixed with `SF` (_configurable via `nuxt.config`_) when using the components within the SCAYLE Storefront Boilerplate.

#### 📡 Create OpenTelemetry spans for Nitro requests

In addition to initializing the OpenTelemetry SDK, the OpenTelemetry module now instruments incoming requests to the Nitro server.
The spans include the matched route name, HTTP method and other request metadata.

### 💅 Minor Changes

- Implemented an early return in `authGuard.global.ts` for API routes to prevent middleware misuse.
- Switched from passing plain `basket-id` and `campaign-key` to passing JWT, containing `basket-id` and `campaign-key` as payload, to `scayle-checkout`

### 🩹 Patch Changes

- Updated badges to new arguments to use headlineParts as primary source and fallback to basketLabel if headlineParts are not defined.
- Fixed `ProductBadge` translation warnings
- Fixed banner price calculation for promotion aggregation
- Fixed contentful Image.vue and contentful ImageText.vue. Only show image when an src link is available. Both image components now behave similar to the storyblok implementation.
- Fixed lost reactivity of `lastLoggedInUser` from `useLastLoggedInUser()`
- Fixed filter reset all button when price is changed
- Fixed new icon on free product
- Added promotion price overlay on PDP
- Improved countdown element style across the basket page and PDP page
- Fixed badges position on mobile
- Added ability to show and hide promotions
- Fixed badge styling in product card
- Switched from `ay-checkout` to `scayle-checkout` web component

### 🏡 Dependency Updates

#### 🏘️ DevDependencies

- Added `@vue/test-utils@2.4.6`
- Added `happy-dom@14.11.2`
- Removed `@crowdin/cli`
- Updated to `@changesets/cli@2.27.3`
- Updated to `@eslint/eslintrc@3.1.0`
- Updated to `@nuxt/eslint@0.3.13`
- Updated to `@nuxt/image@1.7.0`
- Updated to `@nuxt/test-utils@3.13.1`
- Updated to `@scayle/eslint-config-storefront@4.2.0`
- Updated to `@scayle/eslint-plugin-vue-composable@0.2.0`
- Updated to `@types/node@20.12.12`
- Updated to `@upstash/redis@1.31.3`
- Updated to `@vitest/coverage-v8@1.6.0`
- Updated to `eslint-plugin-tailwindcss@3.17.0`
- Updated to `eslint@9.3.0`
- Updated to `lint-staged@15.2.5`
- Updated to `nuxt-svgo@4.0.1`
- Updated to `postcss-custom-properties@13.3.10`
- Updated to `postcss-html@1.7.0`
- Updated to `storyblok-generate-ts@2.1.0`
- Updated to `storyblok@3.31.1`
- Updated to `vitest@1.6.0`
- Updated to `vue-tsc@2.0.19`

#### 🏠 Dependencies

- Updated to `@opentelemetry/auto-instrumentations-node@0.46.1`
- Updated to `@opentelemetry/exporter-trace-otlp-proto@0.51.1`
- Updated to `@opentelemetry/instrumentation@0.51.1`
- Updated to `@opentelemetry/resources@1.24.1`
- Updated to `@opentelemetry/sdk-node@0.51.1`
- Updated to `@opentelemetry/semantic-conventions@1.24.1`
- Updated to `@scayle/storefront-nuxt@7.72.1`
- Updated to `@types/google.maps@3.55.9`
- Updated to `@vercel/otel@1.8.3`
- Updated to `contentful@10.11.7`
- Updated to `contentful-export@7.19.145`
- Updated to `import-in-the-middle@1.7.4`
- Updated to `redis@4.6.14`
