<template>
  <article
    :id="id"
    ref="productCard"
    v-element-visibility="onVisible"
    tabindex="0"
    data-testid="article"
    class="group/product-card relative flex h-full flex-col rounded-lg"
    :aria-label="name"
    role="link"
    @mouseover="onMouseOver"
    @mouseleave="onMouseLeave"
  >
    <div
      class="group relative isolate flex max-h-md items-center justify-center overflow-hidden rounded-lg bg-gray-100"
    >
      <div
        class="absolute left-auto right-1 top-2 z-10 flex h-8 w-auto cursor-pointer p-1 transition md:right-0 md:top-0 md:h-12 md:p-3"
      >
        <SFWishlistToggle
          :product="product"
          :listing-meta-data="listingMetaData"
          @keydown.enter.stop
        />
      </div>
      <SFProductCardBadgesHeader
        v-if="!hideBadges"
        :product="product"
        class="absolute left-3 top-3 w-full"
      />
      <template v-if="link && image">
        <SFProductCardImage
          v-if="shouldShowSingleImage"
          :image="image"
          :alt="alt"
          :link="link"
          :product-index="index"
          @click.capture="$emit('clickProduct')"
        />

        <SFProductCardImageSlider
          v-else
          ref="slider"
          :alt="alt"
          :link="link"
          :is-product-hovered="isProductHovered"
          :product-index="index"
          :images="images"
          :images-scrollable="imagesScrollable"
          @click.capture="$emit('clickProduct')"
        />
      </template>
      <div
        v-if="campaign || promotionBadges.length > 0"
        class="absolute bottom-6 left-1 flex max-w-[70%] flex-col gap-1"
      >
        <!-- NOTE: As there is no limit on the number of promotions, too many `promotions` can cause a crowding effect of deal badges on the image and potentially influence rendering performance. -->
        <SFDealBadge
          v-if="campaign && hasCampaignReduction(price)"
          :text="campaign.product?.badgeLabel || $t('campaign.deal')"
          :style="getCampaignStyle(campaign)"
        />
        <SFDealBadge
          v-for="promotionBadge in promotionBadges"
          :key="promotionBadge.text"
          :text="promotionBadge.text || $t('promotion.deal')"
          :style="promotionBadge.style"
        />
      </div>
      <SFProductCardInBasketBadge
        class="absolute bottom-0 right-0"
        :product="product"
      />
    </div>
    <SFProductCardDetails
      v-if="link"
      :product="product"
      :link="link"
      :campaign="campaign"
      @click.capture="$emit('clickProduct')"
    />
  </article>
</template>

<script setup lang="ts">
import { nextTick, computed, ref, useTemplateRef, watch } from 'vue'
import type { Product, Value, Campaign } from '@scayle/storefront-nuxt'
import { vElementVisibility } from '@vueuse/components'
import { onKeyStroke, useFocus } from '@vueuse/core'
import SFWishlistToggle from '../SFWishlistToggle.vue'
import SFProductCardImage from './SFProductCardImage.vue'
import SFProductCardImageSlider from './imageSlider/SFProductCardImageSlider.vue'
import SFProductCardBadgesHeader from './badges/SFProductCardBadgesHeader.vue'
import SFProductCardDetails from './SFProductCardDetails.vue'
import SFProductCardInBasketBadge from './badges/SFProductCardInBasketBadge.vue'
import { useProductBaseInfo, useRouteHelpers } from '~/composables'
import type { ListItem } from '~~/types/tracking'
import { useCurrentPromotions } from '#storefront/composables'
import SFDealBadge from '~/components/deal/SFDealBadge.vue'
import {
  getPromotionStyle,
  getPromotionsForProduct,
  hasCampaignReduction,
  getCampaignStyle,
} from '~/utils'

const {
  product,
  listingMetaData,
  index = -1,
  multipleImages = false,
  hideBadges = false,
  preferredPrimaryImageType,
  imagesScrollable = true,
} = defineProps<{
  /**
   * The product object containing all product details including images, pricing, and attributes.
   */
  product: Product
  /**
   * The index of the product.
   */
  index?: number
  /**
   * Enables multiple image support with hover interaction. When true, users can hover to see additional product images.
   */
  multipleImages?: boolean
  /**
   * The metadata for the product.
   */
  listingMetaData?: ListItem
  /**
   * Whether to hide the badges.
   */
  hideBadges?: boolean
  /**
   * The preferred primary image type.
   */
  preferredPrimaryImageType?: Value
  /**
   * The campaign.
   */
  campaign?: Campaign | null
  /**
   * Whether to allow images scroll.
   */
  imagesScrollable?: boolean
}>()

const hasBeenVisible = ref(false)

const onVisible = (state: boolean) => {
  if (!state) {
    return
  }
  emit('intersectProduct', product.id)
  hasBeenVisible.value = true
}
const isProductHovered = ref(false)

const onMouseOver = () => {
  isProductHovered.value = true
  emit('product-image:mouseover')
}

const onMouseLeave = () => {
  isProductHovered.value = false
  emit('product-image:mouseleave')
}

const { alt, image, images, link, name, price } = useProductBaseInfo(
  () => product,
  () => preferredPrimaryImageType,
)

watch([images], async () => {
  await nextTick()
  slider.value?.scrollImageIntoView(0, 'instant')
})

const shouldShowSingleImage = computed(() => {
  return !multipleImages || images.value.length === 1 || !hasBeenVisible.value
})

const id = computed(() => `product-${product.id}`)

const emit = defineEmits<{
  intersectProduct: [productId: number]
  'product-image:mouseover': []
  'product-image:mouseleave': []
  clickProduct: []
}>()

const productCard = useTemplateRef('productCard')
const slider = useTemplateRef('slider')
const { focused } = useFocus(productCard)
const imageIndex = ref(0)

onKeyStroke(
  ['ArrowLeft', 'ArrowRight'],
  (event: KeyboardEvent) => {
    if (!focused.value || shouldShowSingleImage.value) {
      return
    }
    event.preventDefault()
    imageIndex.value =
      event.code === 'ArrowLeft' ? imageIndex.value - 1 : imageIndex.value + 1
    const imageCount = images.value.length
    slider.value?.scrollImageIntoView(
      ((imageIndex.value % imageCount) + imageCount) % imageCount,
    )
  },
  { target: productCard },
)

const { getProductDetailRoute, localizedNavigateTo } = useRouteHelpers()
onKeyStroke(
  'Enter',
  async () => {
    const route = getProductDetailRoute(product.id, name.value)
    await localizedNavigateTo(route)
  },
  {
    target: productCard,
  },
)

const { data: promotions } = useCurrentPromotions()

// NOTE: The applied promotions are not limited.
// Too many `promotions` can cause a crowding effect of deal badges on the image and potentially influence rendering performance.
const promotionBadges = computed(() => {
  const productPromotions = getPromotionsForProduct(
    product,
    promotions.value?.entities || [],
  )

  return productPromotions?.map((promotion) => {
    return {
      text: promotion.customData.product?.badgeLabel,
      style: getPromotionStyle(promotion),
    }
  })
})
</script>
