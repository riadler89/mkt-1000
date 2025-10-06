<template>
  <div
    class="flex min-h-screen flex-col text-primary antialiased anchor-scrolling-none"
  >
    <SFSkipLinks v-model:is-mobile-sidebar-open="isMobileSidebarOpen" />

    <SFToastContainer />
    <CountryDetection @switch-shop="switchShop" />
    <div>
      <SFDealRibbon
        v-if="
          ribbonDisplayData && shouldShowPromotionRibbon && !isMobileSidebarOpen
        "
        :display-data="ribbonDisplayData"
        :track-event="campaign ? 'view_campaign' : 'view_promotion'"
      />
      <SFHeaderTopBar />
      <SFHeader v-model:is-mobile-sidebar-open="isMobileSidebarOpen" />
      <main
        id="main-content"
        class="grow focus:shadow-none focus:outline-none"
        tabindex="-1"
        data-testid="main-content"
      >
        <NuxtPage />
      </main>
      <SFFooter class="mt-16 max-lg:mb-4" />
    </div>
    <SFPromotionSlideIn
      :promotions="promotions?.entities"
      :campaign="campaign"
    />
    <SFShopSwitcherFlyout />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { whenever } from '@vueuse/core'
import { useHead } from '#imports'
import { useRoute } from '#app/composables/router'
import { useNuxtApp } from '#app/nuxt'
import {
  useCurrentPromotions,
  useCurrentShop,
  useBasket,
  useCampaign,
} from '#storefront/composables'
import {
  useTrackingEvents,
  useUserItemsTrackingWatcher,
  useCustomerDataChangeWatcher,
} from '~/composables'
import SFHeaderTopBar from '~/components/layout/headers/SFHeaderTopBar.vue'
import CountryDetection, {
  type ShopInfo,
} from '~/components/SFCountryDetection.vue'
import { SFToastContainer } from '#storefront-ui/components'
import { NuxtPage } from '#components'
import SFSkipLinks from '~/components/SFSkipLinks.vue'
import SFFooter from '~/components/layout/footer/SFFooter.vue'
import SFHeader from '~/components/layout/headers/SFHeader.vue'
import { routeList } from '~/utils'
import { useShopSwitcher } from '~/composables/useShopSwitcher'
import { useLocalePath } from '#i18n'
import SFShopSwitcherFlyout from '~/components/layout/headers/shopSwitcher/SFShopSwitcherFlyout.vue'
import SFDealRibbon from '~/components/deal/SFDealRibbon.vue'
import { useApplyPromotions } from '#storefront-promotions/composables/useApplyPromotions'
import SFPromotionSlideIn from '~/components/promotion/modal/SFPromotionSlideIn.vue'
import { sortPromotionsByPriority } from '#storefront-promotions/utils'
import {
  getCampaignDisplayData,
  getPromotionDisplayData,
} from '~/utils/promotion'

const { changeShop } = useShopSwitcher()

const route = useRoute()

const localePath = useLocalePath()

// Initialize data
const { data: promotions } = await useCurrentPromotions({
  options: {
    lazy: true,
  },
})
const { data: campaign } = await useCampaign({
  options: {
    lazy: true,
  },
})
const highestPriorityPromotion = computed(() => {
  return promotions.value?.entities.toSorted(sortPromotionsByPriority)[0]
})

const ribbonDisplayData = computed(() => {
  if (campaign.value) {
    return getCampaignDisplayData(campaign.value)
  }

  if (!highestPriorityPromotion.value) {
    return
  }

  return getPromotionDisplayData(highestPriorityPromotion.value)
})

const isMobileSidebarOpen = ref(false)

const trackingEvents = useTrackingEvents()
useUserItemsTrackingWatcher()
useCustomerDataChangeWatcher()

const { data: _promotionData } = useCurrentPromotions()
const currentShop = useCurrentShop()

const shouldShowPromotionRibbon = computed(() => {
  const isBasketPage = route.path === localePath(routeList.basket)
  const isOSP = route.path === localePath(routeList.osp)
  return ribbonDisplayData.value && !isBasketPage && !isOSP
})

const { data: basketData } = useBasket()
const { applyPromotions } = useApplyPromotions({ basket: basketData })

// Update promotions in case a user with items in the basket returned to the shop.
// While the user was gone, new promotions might have been added that could be added to the basket items.
whenever(
  basketData,
  () => {
    applyPromotions()
  },
  { once: true },
)

onMounted(() => trackingEvents.trackShopInit())

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

const switchShop = (shop: ShopInfo) => {
  changeShop(shop.path, shop.locale)
}
defineOptions({ name: 'AppDefault' })
</script>
