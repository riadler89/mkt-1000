<template>
  <footer class="bg-white" data-testid="footer">
    <div class="flex flex-col gap-5 border-t p-5 md:gap-8 md:px-10 md:py-7">
      <SFLogoLink data-testid="footer-logo" class="flex w-7" />
      <div class="grid grid-cols-1 gap-y-5 text-md md:grid-cols-4">
        <SFFooterLinkSection
          v-for="section in footerLinks?.items"
          :key="section.id"
          :section="section"
        />
      </div>
    </div>
    <div
      class="flex flex-col gap-4 border-t p-5 text-md md:flex-row md:gap-8 md:py-7"
    >
      <SFBottomFooter />
    </div>
  </footer>
</template>

<script setup lang="ts">
import SFFooterLinkSection from './SFFooterLinkSection.vue'
import SFBottomFooter from './SFBottomFooter.vue'
import SFLogoLink from '~/components/SFLogoLink.vue'
import { useFooterNavigation } from '#storefront-navigation/composables'
import { createCacheFriendlyTimestamp } from '~/utils'

const { data: footerLinks } = useFooterNavigation({
  visibleAt: createCacheFriendlyTimestamp(),
})
</script>
