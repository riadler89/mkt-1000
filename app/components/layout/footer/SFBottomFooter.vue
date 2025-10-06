<template>
  <div class="mr-auto text-primary" data-testid="footer-copyright">
    {{ $t('footer.copyright', { currentYear: new Date().getFullYear() }) }}
  </div>
  <ul class="flex flex-row gap-4 text-secondary md:contents">
    <li v-for="navItem in footerTree?.items" :key="`footer-link-${navItem.id}`">
      <SFNavigationTreeItem
        class="rounded-md hover:bg-gray-200 md:p-1"
        data-testid="simple-footer-link"
        raw
        :navigation-item="navItem"
      />
    </li>
  </ul>
</template>
<script setup lang="ts">
import { useSimpleFooterNavigation } from '#storefront-navigation/composables'
import SFNavigationTreeItem from '~/components/layout/SFNavigationTreeItem.vue'
import { createCacheFriendlyTimestamp } from '~/utils'

const { data: footerTree } = useSimpleFooterNavigation({
  visibleAt: createCacheFriendlyTimestamp(),
})
</script>
