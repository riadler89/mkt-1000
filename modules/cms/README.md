# CMS module

## Setup

To set up the CMS integration, run the setup command:

```bash
pnpx @scayle/storefront-cli setup cms
```

After the initial setup, you can sync the CMS types by running:

```bash
pnpm cms:sync
```

This command will generate and update the TypeScript types for your CMS content models, ensuring type safety throughout your application.

---

## Live Preview setup

### Storyblok

In order to enable the live preview in the storyblok editor, you need to provide an access token with the access level `Preview`.

- [SCAYLE Storefront - Integration Guide for Storyblok](https://scayle.dev/en/storefront-guide/storefront-application/integrations/cms/storyblok)

### Contentful

To enable the live preview in contentful editor, you need to provide an preview access token (`NUXT_PUBLIC_CMS_PREVIEW_ACCESS_TOKEN`) additionally to the normal access token (`NUXT_PUBLIC_CMS_ACCESS_TOKEN`).

If your content is available via custom domains you can change them using with the `NUXT_PUBLIC_CMS_HOST` and `NUXT_PUBLIC_CMS_PREVIEW_HOST` env variables.

When configuring the preview URL's inside contentful you need to add a the query param `?_editorMode={entry.sys.updatedAt}` to the preview URL.

- [SCAYLE Storefront - Integration Guide for Contentful](https://scayle.dev/en/storefront-guide/storefront-application/integrations/cms/contentful)

---
