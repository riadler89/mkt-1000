<template>
  <SFAsyncStatusWrapper :status="basketStatus">
    <SFEmptyState
      v-if="basketCount === 0"
      :title="$t('basket_page.empty_basket_title')"
      :description="$t('basket_page.empty_basket_description')"
    />
    <div
      v-else
      class="relative flex flex-col lg:flex-row"
      data-testid="basket-container"
    >
      <div
        class="mx-5 flex flex-col space-y-4 pb-8 pt-1.5 lg:ml-7 lg:mr-13 lg:w-3/5 lg:items-end lg:space-y-8 lg:py-8"
      >
        <SFBasketHeadline v-if="basketCount" :count="basketCount" />
        <div
          v-if="campaign || progressPromotions.length"
          class="flex w-full flex-col gap-6 lg:max-w-2xl"
        >
          <SFDealBanner
            v-if="campaign && hasCampaignReduction(basketCost)"
            :display-data="getCampaignDisplayData(campaign)"
            track-event="view_campaign"
          />
          <SFDealBanner
            v-for="promotion in progressPromotions"
            :key="promotion.id"
            :display-data="getPromotionDisplayData(promotion)"
            track-event="view_promotion"
            :is-promotion-applied="isPromotionApplied(promotion)"
          >
            <template #progress>
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
        </div>

        <SFBuyXGetYProducts
          v-for="applicablePromotion in basketData?.applicablePromotions?.filter(
            (promotion) =>
              isBuyXGetYType(promotion.promotion) &&
              !isBuyXGetX(promotion.promotion),
          )"
          :key="applicablePromotion.promotion.id"
          are-gift-conditions-met
          :promotion="
            applicablePromotion.promotion as Promotion<BuyXGetYEffect>
          "
          class="w-full lg:min-w-md lg:max-w-2xl"
        />

        <SFBasketAvailableItems
          v-if="groupedBasketItems?.available"
          :available-items="groupedBasketItems?.available"
          :campaign="campaign"
          @update:quantity="(...args) => updateItemQuantity(...args)"
          @delete="deleteBasketItem($event)"
        />
        <template v-if="groupedBasketItems?.unavailable">
          <SFHeadline
            tag="h2"
            class="z-10 w-full rounded-lg border border-gray-300 bg-gray-100 px-5 py-2.5 text-md font-semibold text-secondary lg:max-w-2xl"
            data-testid="headline-unavailable-products"
          >
            {{ $t('basket.unavailable_products') }}:
          </SFHeadline>
          <SFBasketUnavailableItems
            :unavailable-items="groupedBasketItems?.unavailable"
            @delete="deleteBasketItem($event)"
          />
        </template>
      </div>
      <SFBasketSummary
        v-if="basketData"
        :basket="basketData"
        :campaign="campaign"
      />
      <SFBasketDeleteConfirmationModal
        :visible="isDeleteConfirmationRevealed"
        :on-confirm="confirmDeletion"
        :on-cancel="cancelDeletion"
      />
    </div>
    <template #loading>
      <SFBasketSkeleton />
    </template>
  </SFAsyncStatusWrapper>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useConfirmDialog, whenever } from '@vueuse/core'
import {
  sanitizeCanonicalURL,
  type BasketItem,
  type BuyXGetYEffect,
  type Promotion,
} from '@scayle/storefront-nuxt'
import { join } from 'pathe'
import { useHead, useSeoMeta, definePageMeta, useRequestURL } from '#imports'
import { createError, useNuxtApp } from '#app'
import { useRoute } from '#app/composables/router'
import { WishlistListingMetadata } from '~~/shared/constants/listingMetadata'
import {
  useBasketActions,
  useActivePromotions,
  usePageState,
  useTrackingEvents,
} from '~/composables'
import { useBasket, useCampaign, useWishlist } from '#storefront/composables'
import SFAsyncStatusWrapper from '~/components/SFAsyncStatusWrapper.vue'
import { basketListingMetaData } from '~~/shared/constants'
import SFBasketSkeleton from '~/components/basket/skeleton/SFBasketSkeleton.vue'
import SFBasketSummary from '~/components/basket/summary/SFBasketSummary.vue'
import SFEmptyState from '~/components/SFEmptyState.vue'
import { SFHeadline } from '#storefront-ui/components'
import SFBasketHeadline from '~/components/basket/SFBasketHeadline.vue'
import SFBasketDeleteConfirmationModal from '~/components/basket/SFBasketDeleteConfirmationModal.vue'
import SFBasketAvailableItems from '~/components/basket/SFBasketAvailableItems.vue'
import SFBasketUnavailableItems from '~/components/basket/SFBasketUnavailableItems.vue'
import SFDealBanner from '~/components/deal/SFDealBanner.vue'
import SFBuyXGetYProducts from '~/components/product/promotion/buyXGetY/SFBuyXGetYProducts.vue'
import { isBuyXGetYType } from '#storefront-promotions/utils'
import SFPromotionProgressWrapper from '~/components/product/promotion/banners/SFPromotionProgressWrapper.vue'
import {
  getCampaignDisplayData,
  getPromotionDisplayData,
  isTieredPromotion,
} from '~/utils/promotion'
import { hasCampaignReduction, isBuyXGetX } from '~/utils'
import SFComboDealWrapper from '~/components/product/promotion/banners/SFComboDealWrapper.vue'
import { isComboDealType } from '#storefront-promotions/utils/promotion'

const route = useRoute()
const { pageState } = usePageState()
const { origin } = useRequestURL()
const wishlist = useWishlist()
const {
  data: basketData,
  items: basketItems,
  status: basketStatus,
  cost: basketCost,
  error: basketError,
  count: basketCount,
} = useBasket()

const {
  trackViewBasket,
  collectBasketItems,
  trackBasket,
  trackWishlist,
  collectProductListItems,
  trackFeatureError,
} = useTrackingEvents()

whenever(
  basketError,
  (err) => {
    trackFeatureError(err.message)
    throw createError({ ...err, fatal: true })
  },
  { immediate: true },
)
const { promotions: progressPromotions } = useActivePromotions()
const { data: campaign } = useCampaign()

const isPromotionApplied = (promotion: Promotion) => {
  return basketItems.value?.some(({ promotions, price }) => {
    // For tiered promotions, we check if the promotion is applied to the basket item by checking the applied reductions
    if (promotion.tiers?.length) {
      return price.total.appliedReductions.some(
        (reduction) => reduction.promotionId === promotion.id,
      )
    }

    // For all other promotions, we check if the promotion is applied to the basket item by checking the promotions attribute
    return promotions?.some(
      (basketPromotion) =>
        basketPromotion.id === promotion.id && basketPromotion.isValid,
    )
  })
}

onMounted(() => {
  if (!basketItems.value) {
    return
  }
  trackViewBasket(
    collectBasketItems(basketItems.value, {
      listId: basketListingMetaData.id,
      listName: basketListingMetaData.name,
    }),
    {
      content_name: route.fullPath,
      page_type: pageState.value.type,
      page_type_id: route.params.id?.toString() || '',
    },
    basketCost.value,
  )
  trackBasket(
    collectBasketItems(basketItems.value, {
      listId: basketListingMetaData.id,
      listName: basketListingMetaData.name,
    }),
  )
  // Please remove wishlist tracking
  trackWishlist(
    collectProductListItems(wishlist.products.value, {
      listId: WishlistListingMetadata.ID,
      listName: WishlistListingMetadata.NAME,
    }),
  )
})

const groupedBasketItems = computed(() =>
  Object.groupBy(basketItems.value || [], (item) => item.status),
)

const { updateItemQuantity, removeItem } = useBasketActions()

const {
  isRevealed: isDeleteConfirmationRevealed,
  reveal: revealDeleteConfirmation,
  confirm: confirmDeletion,
  cancel: cancelDeletion,
} = useConfirmDialog<undefined, boolean, boolean>()
const deleteBasketItem = async (item: BasketItem) => {
  const { isCanceled } = await revealDeleteConfirmation()
  if (isCanceled) {
    return
  }
  await removeItem(item)
}

const { $i18n, $config } = useNuxtApp()

useSeoMeta({
  robots: 'noindex,follow',
  title: $i18n.t('basket_page.meta.title'),
  description: $i18n.t('basket_page.meta.description', {
    shopName: $config.public.shopName,
  }),
})

useHead({
  link: [
    {
      rel: 'canonical',
      key: 'canonical',
      href: sanitizeCanonicalURL(
        `${origin}${join($config.app.baseURL, route.fullPath)}`,
      ),
    },
  ],
})

defineOptions({ name: 'BasketPage' })
definePageMeta({ pageType: 'basket_page' })
</script>
