<template>
  <div class="flex items-center justify-start">
    <SFLink
      v-for="({ id, name, image, colors }, index) in itemsToShow"
      :key="id"
      :to="getProductDetailRoute(id, name)"
      class="relative mr-2 flex size-12 items-center justify-center overflow-hidden rounded-md bg-gray-300 focus-visible:shadow-inner-solid-sm"
      :class="classForIndex(index)"
      data-testid="product-sibling"
    >
      <SFProductImage
        v-if="image"
        :image="image"
        :alt="
          $t('product_image.alt', {
            productName: name,
            colors: formatColors(colors),
            brand: brand,
          })
        "
        width="36px"
        sizes="xs:40px sm:40px md:40px lg:40px xl:40px"
      />
    </SFLink>
    <SFLink
      v-if="siblings.length > 2"
      :to="productRoute"
      raw
      class="hidden size-12 content-center text-sm font-medium text-secondary max-lg:block"
    >
      + {{ siblings.length - 2 }}
    </SFLink>
    <SFLink
      v-if="siblings.length > 3"
      :to="productRoute"
      raw
      class="hidden size-12 content-center text-sm font-medium text-secondary lg:max-xl:block"
    >
      + {{ siblings.length - 3 }}
    </SFLink>
    <SFLink
      v-if="siblings.length > 4"
      :to="productRoute"
      raw
      class="hidden size-12 content-center text-sm font-medium text-secondary xl:block"
    >
      + {{ siblings.length - 4 }}
    </SFLink>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Product } from '@scayle/storefront-nuxt'
import { getFirstAttributeValue } from '@scayle/storefront-nuxt'
import SFProductImage from '../../SFProductImage.vue'
import type { ProductSibling } from '~~/types/siblings'
import { useProductBaseInfo, useRouteHelpers } from '~/composables'
import { PRODUCT_CARD_SIBLINGS_LIMIT } from '~~/shared/constants'
import { formatColors } from '~/utils'
import { SFLink } from '#storefront-ui/components'

const { product, siblings } = defineProps<{
  product: Product
  siblings: ProductSibling[]
}>()

const { brand } = useProductBaseInfo(() => product)

const { getProductDetailRoute } = useRouteHelpers()

const itemsToShow = computed(() =>
  siblings.slice(0, PRODUCT_CARD_SIBLINGS_LIMIT),
)

const productRoute = computed(() =>
  getProductDetailRoute(
    product.id,
    getFirstAttributeValue(product.attributes, 'name')?.label,
  ),
)

// TODO: This is something that could be improved when we update to Tailwind 4
// It would allow us to use container queries instead of viewport queries. This
// means we could control the number of siblings based on the product card width
// rather than the screen size. Currently cards are quite wide right before the
// viewport breakpoint and quite narrow right after. For now, we set the limits
// to ensure that all siblings are visible, but there is often extra space.
const classForIndex = (index: number) => {
  if (index === 3) {
    return 'hidden xl:block'
  } else if (index === 2) {
    return 'hidden lg:block'
  }
}
</script>
