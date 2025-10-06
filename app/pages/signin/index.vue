<template>
  <div
    class="m-auto flex max-w-md flex-col items-start justify-center pt-6 *:w-full max-lg:px-4 lg:pt-10"
  >
    <div class="mb-5 flex items-center justify-between lg:mb-7">
      <SFHeadline class="!leading-6 text-primary max-lg:!text-xl" tag="h1">
        {{ $t('sign_in_page.title') }}
      </SFHeadline>
      <IconScreenClick class="size-9 max-lg:hidden" />
    </div>
    <!-- Include empty content to ensure formatters don't incorrectly remove the closing tag from a web component -->
    <scayle-auth-new-password v-if="authApiInitialized && hash" :hash="hash">
      &nbsp;
    </scayle-auth-new-password>
    <scayle-auth
      v-else-if="authApiInitialized"
      :variant="isRegisterRoute ? 'register' : 'login'"
    >
      &nbsp;
    </scayle-auth>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { sanitizeCanonicalURL } from '@scayle/storefront-nuxt'
import { join } from 'pathe'
import { useSeoMeta, useHead, definePageMeta, useRoute } from '#imports'
import { useI18n } from '#i18n'
import { useNuxtApp, useRequestURL } from '#app'
import { SFHeadline } from '#storefront-ui/components'
import { useCheckoutWebComponent } from '~/composables'

const { apiInitialized: authApiInitialized } = useCheckoutWebComponent()

const { t } = useI18n()

const route = useRoute()

const { origin } = useRequestURL()

const hash = computed(() => route.query.hash)

const {
  $config: {
    public: { shopName },
    app: { baseURL },
  },
} = useNuxtApp()

const isRegisterRoute = computed(() => route.query.register === 'true')

useSeoMeta({
  robots: 'noindex,follow',
  title: t('sign_in_page.meta.title'),
  description: t('sign_in_page.meta.description', { shopName }),
})

useHead({
  link: [
    {
      rel: 'canonical',
      key: 'canonical',
      href: sanitizeCanonicalURL(`${origin}${join(baseURL, route.fullPath)}`),
    },
  ],
})

defineOptions({ name: 'SigninPage' })
definePageMeta({ pageType: 'signin_page' })
</script>
