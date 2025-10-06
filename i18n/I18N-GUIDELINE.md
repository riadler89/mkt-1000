# I18N Guidelines

## Defining translations

### Translation Files

Translations are stored within the `i18n/locales/` directory. The file name follows the pattern `{language}_{COUNTRY}.json` where:

- `{language}` is the ISO 639-1 language code (e.g., `en`, `de`)
- `{COUNTRY}` is the ISO 3166-1 alpha-2 country code in uppercase (e.g., `GB`, `DE`, `US`)

Examples: `en_GB.json` for English (United Kingdom), `de_DE.json` for German (Germany), `en_US.json` for English (United States).

**Note:** The actual locale used in the application may differ from the file name. The mapping between file names and locales is configured in `config/shops.ts`.

### 1. Key Naming Convention

- **Casing**: Use snake_case for all translation keys (e.g., `product_details.add_to_cart`).
- **Structure**: Follow a general `object.action` or `section.element.action` format. For instance, `basket.checkout.confirm` or `product_details.image_gallery.zoom`.
- **Naming**: Refrain from using abbreviations in translation keys to ensure clarity and readability.
- **Verbs**: Use concise and descriptive verbs for action-related keys (e.g., `add_to_cart`, `view_details`, `submit_form`).
- **Nouns**: Use clear and specific nouns for elements and sections (e.g., `product_name`, `shipping_address`, `order_summary`).

### 2. Namespacing and Structuring

- **Component-Based Namespacing**: Structure keys primarily around components. For instance, keys for a ProductCard component might include `product_card.title`, `product_card.price`, and `product_card.add_to_cart`. Pages are considered components as well. Since components can be reused across different locations, they might require distinct translations based on context. If a single translation cannot cover all scenarios, consider moving the translation to the parent component using `<slot>` or `props` or adopting feature-based namespacing.
- **Feature-Based Namespacing**: In addition to component-based namespacing, use feature-based namespacing to group keys related to a specific feature or functionality. This approach is particularly useful when a feature spans across multiple components or pages. For example, keys related to adding basket items might be prefixed with `basket.add_item` or `basket.remove_item`. This helps to organize translations around business capabilities rather than solely by component structure.
- **Dot Notation Hierarchy**: Use dot notation to create hierarchical key structures that provide clear context. Examples: `product_detail_page.meta_data.title`, `checkout.confirmation.message`.
- **Error Grouping**: Consolidate all error-related translations under a dedicated `error` object. Use the error identifier (e.g., HTTP status code or business error key) as the translation key name. For example, within the `add_to_basket` feature:

  ```json
  "add_to_basket": {
    "error": {
      "invalid_size": {
        "message": "Please select a valid size."
      },
      "out_of_stock": {
        "message": "This item is currently out of stock."
      }
    }
  }
  ```

### 3. Key Reuse vs. Context-Specific Keys

- **Promote Key Reusability**: Foster the reuse of keys for common elements, actions, and phrases throughout the application. This approach minimizes redundancy and streamlines translation management. The `global` namespace is ideal for housing such keys. Examples include `global.save`, `global.cancel`, and `global.loading`. Although shorter translations are more conducive to reuse and often find their way into the `global` or a shared namespace, larger translations can also be shared when context permits.
- **Context-Specific Keys**: Create context-specific keys when the same text requires different translations based on its location or usage within the UI. For instance, "Add" might be `product_detail_page.add_to_cart` on a product page but `basket_page.add_coupon` within the basket.
- **Avoid Duplicate Keys**: Never create identical keys with different meanings. This leads to confusion and translation errors. If a key's meaning changes significantly, create a new, distinct key.

### 4. Placeholder Usage

- **Dynamic Content**: It is essential to use placeholders for dynamic content within translated strings. For instance, `Your order ({orderNumber}) has been confirmed.` This approach ensures that dynamic content is correctly inserted without compromising grammar across different languages. Concatenating translated strings with placeholder values in code should be avoided as it can result in grammatical errors.
- **Placeholder Names**: Utilize descriptive placeholder names that explicitly convey the content to be inserted. Employ camelCase for placeholder names to minimize the necessity of renaming variables when feeding them into the translation function. Example: `Your order ({orderNumber}) has been confirmed.`

### 5. Pluralization

- **Plural Forms**: Use the `|` separator to define different plural forms in the same translation. Example: `no apples | one apple | {count} apples`
- **All Cases**: Always define all plural forms. By default `nuxt/i18n` / `vue-i18n` does support three forms. No item, one item and many items. Example: `no apples | one apple | {count} apples`.
- **Placeholder Usage**: Use the predefined {count} placeholder when you want to reference the amount itself within the translation.

## Using Translation Keys in Code

- **Translation Location**: Whenever possible, confine the use of translations to the `<template>` section. Only translate in the `<script>` or composables when you need to associate a value with a specific translation key.
- **Direct Key Usage**: Always use the full translation key directly within the translation function (e.g., `$t('product_details.add_to_cart')` or `i18n.t('product_details.add_to_cart')`). This ensures clarity, makes the code easier to understand, and improves static analysis capabilities of tooling (e.g., linters can check for missing keys).
- **Avoid String Interpolation for Keys**: Never construct translation keys dynamically using string interpolation or concatenation. This makes it significantly harder to track translations.

  ```ts
  // INCORRECT - Avoid string interpolation
  $t(`error.${statusCode}.title`)

  // CORRECT - Use full key
  const getErrorTitle = (statusCode: number) => {
    switch (statusCode) {
      case 404:
        return $t('error.404.title')
      case 500:
        return $t('error.500.title')
      default:
        return $t('error.unknown.title')
    }
  }
  ```

- **Avoid Variables for Keys**: While slightly better than string interpolation, avoid storing translation keys in variables unless absolutely necessary. This reduces code clarity.

  ```ts
  // DISCOURAGED - Avoid storing keys in variables
  const addToCartKey = 'product_details.add_to_cart'
  $t(addToCartKey)

  // CORRECT - Direct key usage
  $t('product_details.add_to_cart')
  ```

### Translation Functions

This project supports multiple ways to access translations:

1. **Template Usage** (Preferred for UI text):

   ```vue
   <template>
     <button>{{ $t('add_to_basket.add_to_basket') }}</button>
   </template>
   ```

2. **Composition API** (Preferred for script logic):

   ```typescript
   import { useI18n } from '#i18n'

   const { t } = useI18n()
   const message = t('add_to_basket.notification.select_size')
   ```

3. **Nuxt App Context** (For server-side or special cases):

   ```typescript
   const { $i18n } = useNuxtApp()
   const title = $i18n.t('basket_page.meta.title')
   ```

#### Best Practices

- **Template Usage**: Use `$t()` for direct template interpolation
- **Script Logic**: Use `useI18n()` composable for reactive translations in component logic
- **Server-Side**: Use `$i18n` from `useNuxtApp()` for server-side rendering or meta tags
- **Direct Key Usage**: Always use full translation keys, never construct them dynamically
- **Avoid String Interpolation**: Never use template literals or concatenation for keys

#### Examples

**✅ Correct Usage:**

```typescript
// Template
{
  {
    $t('global.save')
  }
}

// Composition API
const { t } = useI18n()
const errorMessage = t('validation.required', { field: 'email' })

// Server-side meta
const { $i18n } = useNuxtApp()
title: $i18n.t('basket_page.meta.title')
```

**❌ Incorrect Usage:**

```typescript
// Dynamic key construction
$t(`error.${statusCode}.title`)

// Storing keys in variables
const key = 'global.save'
$t(key)
```
