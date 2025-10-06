<template>
  <div
    class="flex min-h-screen flex-col text-primary antialiased anchor-scrolling-none"
  >
    <SFSimpleHeader />
    <main class="grow">
      <NuxtPage />
    </main>
    <footer
      class="flex flex-col gap-4 border-t bg-gray-100 px-10 py-5 text-md text-secondary md:flex-row md:gap-8 md:py-7 md:text-primary"
    >
      <SFBottomFooter />
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useHead } from '#imports'
import { useNuxtApp } from '#app/nuxt'
import { useCurrentShop } from '#storefront/composables'
import { NuxtPage } from '#components'
import SFBottomFooter from '~/components/layout/footer/SFBottomFooter.vue'
import SFSimpleHeader from '~/components/layout/footer/SFSimpleHeader.vue'

const currentShop = useCurrentShop()

const {
  $config: {
    public: { shopName },
  },
} = useNuxtApp()

// Meta tags
useHead({
  bodyAttrs: {
    class: ['relative'],
  },
  htmlAttrs: {
    lang: () => new Intl.Locale(currentShop.value.locale).language,
  },
  script: [
    {
      // Add loaded class to body after DOMContentLoaded
      innerHTML: `document.addEventListener('DOMContentLoaded', () => { document.body.classList.add('loaded'); });`,
    },
  ],
  titleTemplate: (title) => (title ? `${title} | ${shopName}` : `${shopName}`),
})
defineOptions({ name: 'AppSimple' })
</script>
