<template>
  <div class="grid w-full grid-cols-12 gap-4">
    <template v-if="loading">
      <SFProductCardSkeleton
        v-for="index in PRODUCT_CARD_SKELETON_LOADERS_SIZE"
        :key="`product-loading-${index}`"
        type="custom"
      />
    </template>
    <SFProductListNoResults
      v-else-if="!products.length"
      :category="currentCategory?.parent"
      class="col-span-12 max-md:w-fit"
    />
    <template v-else>
      <SFProductCard
        v-for="(product, index) in products"
        :key="`product-${product.id}`"
        class="col-span-6 mb-5 w-full lg:col-span-4 xl:col-span-3"
        data-testid="product-item"
        :index="index"
        :product="product"
        :preferred-primary-image-type="preferredPrimaryImageType"
        multiple-images
        :listing-meta-data="categoryListingMetaData"
        :campaign="campaign"
        @intersect:product="onProductIntersect(index)"
        @click-product="emit('clickProduct', product, index)"
      />
      <SFPagination
        v-if="isPaginationShown"
        :total-page-count="pagination?.last ?? 0"
        class="col-span-12 mt-6"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type {
  Product,
  FetchProductsByCategoryResponse,
  Category,
  Value,
} from '@scayle/storefront-nuxt'
import SFProductCardSkeleton from '../product/card/SFProductCardSkeleton.vue'
import SFProductCard from '../product/card/SFProductCard.vue'
import SFProductListNoResults from './SFProductListNoResults.vue'
import { useRowIntersection } from '~/composables'
import {
  PRODUCT_CARD_SKELETON_LOADERS_SIZE,
  categoryListingMetaData,
} from '~~/shared/constants'
import { SFPagination } from '#storefront-ui/components'
import type { CollectedRowIntersection } from '~/composables'
import { useCampaign } from '#storefront/composables'

const {
  loading = true,
  isPaginationVisible = true,
  currentCategory,
  pagination,
  products,
} = defineProps<{
  products: Product[]
  pagination?: FetchProductsByCategoryResponse['pagination']
  loading?: boolean
  isPaginationVisible?: boolean
  currentCategory?: Category | null
  preferredPrimaryImageType?: Value
}>()

const isPaginationShown = computed(() => {
  return pagination && isPaginationVisible && pagination.last > 1
})

const { data: campaign } = useCampaign()

const { collectRowIntersection } = useRowIntersection(() => products)

const onProductIntersect = (index: number) => {
  const collectedRowItems = collectRowIntersection(index)

  if (collectedRowItems) {
    emit('intersect:row', collectedRowItems)
  }
}

const emit = defineEmits<{
  clickProduct: [product: Product, index: number]
  'intersect:row': [collectedRow: CollectedRowIntersection]
}>()
</script>
