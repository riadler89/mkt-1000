<template>
  <SFItemsSlider
    with-arrows
    mode="horizontal"
    data-testid="product-thumbnails"
    :slider-tabindex="-1"
  >
    <template #header>
      <div class="mb-4 flex justify-between">
        <div class="flex gap-2 text-md">
          <span class="font-semibold">
            {{ $t('product_attribute.color') }}:
          </span>
          <span>{{ label }}</span>
        </div>
      </div>
    </template>
    <div class="flex w-full gap-4 py-1.5">
      <SFLink
        v-for="(sibling, index) in siblings"
        :key="sibling.id"
        class="relative size-20 shrink-0 place-content-center overflow-hidden rounded-xl border-2 transition-all supports-hover:hover:border-black md:size-16"
        data-testid="product-sibling-link"
        :class="{
          'pointer-events-none': sibling.isSoldOut || sibling.id === product.id,
          'border-transparent': sibling.id !== product.id && !sibling.isSoldOut,
          'border-accent text-black -outline-offset-4 focus-visible:shadow-inner-solid':
            sibling.id === product.id,
          'bg-gray-200 text-gray-400 supports-hover:hover:bg-white supports-hover:hover:text-black':
            sibling.id !== product.id,
          'border-gray-300': sibling.isSoldOut && sibling.id !== product.id,
        }"
        :to="getProductDetailRoute(sibling.id, sibling.name)"
        @mouseenter="setHoveredLabel(sibling)"
        @mouseleave="setHoveredLabel()"
        @click="trackSiblingClick(sibling, index)"
      >
        <div
          v-if="sibling.isSoldOut"
          class="absolute left-0 size-full rounded-md diagonal-strikethrough"
        />

        <SFProductImage
          v-if="sibling.image"
          :alt="siblingAltText(sibling)"
          sizes="64px"
          class="size-15 md:size-12"
          data-testid="product-sibling-image"
          :class="{
            'opacity-20': sibling.isSoldOut && sibling.id !== product.id,
          }"
          :image="sibling.image"
          :aspect-ratio="[1, 1]"
        />
      </SFLink>
    </div>
    <template
      #arrows="{ isPrevEnabled, isNextEnabled, prev, next, isScrollable }"
    >
      <div
        class="absolute right-0 top-0 flex gap-0.5 max-md:hidden"
        :class="{ hidden: !isScrollable }"
      >
        <SFButton
          class="!size-6 rounded-l-full first:!p-0.5"
          :disabled="!isPrevEnabled"
          :aria-label="$t('slider.got_to_previous_item')"
          variant="slider"
          @click="prev()"
        >
          <IconChevronLeft class="size-4" />
        </SFButton>
        <SFButton
          class="!size-6 rounded-r-full last:!p-0.5"
          :aria-label="$t('slider.got_to_next_item')"
          :disabled="!isNextEnabled"
          variant="slider"
          @click="next()"
        >
          <IconChevronRight class="size-4" />
        </SFButton>
      </div>
    </template>
  </SFItemsSlider>
</template>

<script setup lang="ts">
import type { Product } from '@scayle/storefront-nuxt'
import { computed, ref } from 'vue'
import SFProductImage from './SFProductImage.vue'
import { useRoute } from '#app/composables/router'
import { SFItemsSlider, SFLink, SFButton } from '#storefront-ui/components'
import {
  usePageState,
  useProductBaseInfo,
  useRouteHelpers,
  useTrackingEvents,
} from '~/composables'
import type { ProductSibling } from '~~/types/siblings'
import { useI18n } from '#i18n'
import { productListingMetaData } from '~~/shared/constants/product'
import { formatColors } from '~/utils'

const { product } = defineProps<{
  /**
   * Product object containing siblings array with different color variants of the same product.
   */
  product: Product
}>()

const { getProductDetailRoute } = useRouteHelpers()
const { siblings } = useProductBaseInfo(() => product)

const { t } = useI18n()

const hoveredColorLabel = ref()

const setHoveredLabel = (sibling?: ProductSibling) => {
  if (!sibling) {
    hoveredColorLabel.value = undefined
    return
  }

  hoveredColorLabel.value =
    sibling.colors?.[0]?.label?.toLowerCase() ||
    t('sibling_selection.sibling_error')
}

const label = computed(() => {
  const firstSiblingColors = siblings.value[0]?.colors

  if (!firstSiblingColors?.length) {
    return t('sibling_selection.sibling_error')
  }

  return hoveredColorLabel.value || firstSiblingColors[0]?.label.toLowerCase()
})

const siblingAltText = (sibling: ProductSibling) => {
  const placeholder = {
    alt: t('product_image.alt', {
      productName: sibling.name,
      colors: formatColors(sibling.colors),
      brand: sibling.brand,
    }),
    selected:
      product.id === sibling.id
        ? t('sibling_selection.selected')
        : t('sibling_selection.unselected'),
  }
  return sibling.isSoldOut
    ? t('sibling_selection.a11ly.sold_out_alt_text', placeholder)
    : t('sibling_selection.a11ly.alt_text', placeholder)
}

const { pageState } = usePageState()
const route = useRoute()
const trackSiblingClick = (sibling: ProductSibling, index: number) => {
  const siblingsProduct = product.siblings?.find(
    (product) => product.id === sibling.id,
  )
  if (!siblingsProduct) {
    return
  }
  try {
    useTrackingEvents().trackSelectItem({
      product: siblingsProduct,
      listingMetaData: productListingMetaData,
      index,
      soldOut: sibling.isSoldOut,
      pagePayload: {
        content_name: route.fullPath,
        page_type: pageState.value.type,
        page_type_id: pageState.value.typeId,
      },
    })
  } catch (e) {
    console.error(e)
  }
}
</script>
