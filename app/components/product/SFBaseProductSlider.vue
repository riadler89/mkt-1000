<template>
  <SFItemsSlider ref="sliderRef" with-arrows mode="horizontal">
    <template #header>
      <slot name="header" :title="title">
        <div class="mb-6 text-2xl font-medium text-primary md:px-2">
          {{ title }}
        </div>
      </slot>
    </template>
    <template
      #arrows="{ isPrevEnabled, isNextEnabled, prev, next, isScrollable }"
    >
      <div
        class="absolute -top-1 right-6 flex gap-0.5 md:right-2"
        :class="{ hidden: !isScrollable }"
      >
        <SFSliderArrowButton
          tabindex="-1"
          :disabled="!isPrevEnabled"
          direction="left"
          inverted-radius
          :aria-label="$t('slider.got_to_previous_item')"
          @click="prev()"
        />
        <SFSliderArrowButton
          tabindex="-1"
          :disabled="!isNextEnabled"
          direction="right"
          inverted-radius
          :aria-label="$t('slider.got_to_next_item')"
          @click="next()"
        />
      </div>
    </template>
    <template #default>
      <template v-if="status === 'success'">
        <div
          v-for="(product, index) in products || []"
          :key="product.id"
          class="my-1 w-1/2 shrink-0 snap-start pr-4 md:w-1/3 lg:w-1/4"
        >
          <SFProductCard
            hide-badges
            :campaign="campaign"
            :product="product"
            :multiple-images="isDesktop"
            :images-scrollable="false"
            class="mx-1"
            @click="trackProductCardClick(product, index)"
          />
        </div>
      </template>
      <template v-else>
        <SFSkeletonLoader
          v-for="i in 4"
          :key="i"
          class="mx-2 aspect-3/4 w-1/2 shrink-0 md:w-1/3 lg:w-1/4"
          type="custom"
        />
      </template>
    </template>
  </SFItemsSlider>
</template>
<script setup lang="ts">
import type { Product } from '@scayle/storefront-nuxt'
import { useTemplateRef } from 'vue'
import SFProductCard from './card/SFProductCard.vue'
import { getDeepestCategoryForTracking } from '~/utils/tracking'
import { usePageState } from '~/composables/usePageState'
import { useTrackingEvents } from '~/composables/useTrackingEvents'
import { useRoute } from '#app/composables/router'
import { SFSkeletonLoader, SFItemsSlider } from '#storefront-ui/components'
import type { AsyncDataRequestStatus } from '#app'
import SFSliderArrowButton from '~~/modules/ui/runtime/components/core/SFSliderArrowButton.vue'
import { useCampaign } from '#storefront/composables'
import { useDefaultBreakpoints } from '~~/modules/ui/runtime'

const { products, title, status } = defineProps<{
  title: string
  products: Product[]
  status: AsyncDataRequestStatus
}>()

const { greaterOrEqual } = useDefaultBreakpoints()
const isDesktop = greaterOrEqual('lg')

const { data: campaign } = useCampaign()
const { trackSelectItem } = useTrackingEvents()
const { pageState } = usePageState()
const route = useRoute()
const trackProductCardClick = (product: Product, index: number) => {
  trackSelectItem({
    product,
    category: getDeepestCategoryForTracking(product.categories),
    index,
    soldOut: product.isSoldOut,
    pagePayload: {
      content_name: route.fullPath,
      page_type: pageState.value.type,
      page_type_id: pageState.value.typeId,
    },
  })
}
const sliderRef = useTemplateRef('sliderRef')
defineExpose({
  scrollImageIntoView: (index: number) =>
    sliderRef.value?.scrollImageIntoView(index),
})
</script>
