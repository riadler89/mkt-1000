<template>
  <div class="flex flex-col">
    <CMSProductListingPageComponent
      :key="currentCategoryId"
      :category-id="currentCategoryId"
      class=""
    />
    <div class="container relative flex bg-white pt-4 max-md:max-w-none">
      <SFCategorySideNavigation
        v-if="rootCategories?.length"
        class="sticky top-8 h-full max-md:hidden sm:min-w-40 md:min-w-60 lg:min-w-64"
        :root-categories="rootCategories"
        :current-category="currentCategory"
        :fetching-categories="fetchingCategories"
      />

      <div class="w-full grow">
        <div class="flex flex-wrap items-center justify-between gap-5">
          <div class="flex items-center">
            <SFCategoryNavigationBackButton
              :current-category="currentCategory"
              class="mr-2 md:hidden"
            />
            <SFCategoryBreadcrumbs
              v-if="currentCategory"
              :loading="isLoading"
              :category="currentCategory"
              :products-count="totalProductsCount"
            />
          </div>
          <div class="hidden gap-4 md:flex">
            <SFSortSelection
              class="max-sm:hidden"
              :selected-sort="selectedSort"
              :sort-links="sortLinks"
            />
            <SFFilterToggleButton :label="$t('filter.show_filter')" />
          </div>
        </div>
        <SFCategoryNavigationSlider
          v-if="rootCategories?.length"
          :all-categories="flattenCategoryTree(rootCategories)"
          :current-category="currentCategory"
          class="mb-3.5 mt-2.5 md:hidden"
        />
        <SFFilterToggleButton
          class="md:hidden"
          :label="$t('filter.show_filter_and_sorting')"
        />
        <SFProductList
          :preferred-primary-image-type="primaryImageType"
          :products="products"
          :pagination="pagination"
          :current-category="currentCategory"
          :loading="isLoading"
          class="mt-6"
          @click-product="trackProductClick"
          @intersect:row="trackViewListing"
        />
      </div>
    </div>
    <SFFilterSlideIn
      :current-category-id="currentCategoryId"
      :selected-sort="selectedSort"
      :sort-links="sortLinks"
      :selected-primary-image-type="primaryImageType"
      :primary-image-type-options="imageTypeOptions"
    />
    <Teleport to="#teleports">
      <div class="fixed bottom-8 right-4 md:bottom-24">
        <SFScrollToTopButton />
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { onServerPrefetch, watch, computed } from 'vue'
import {
  HttpStatusCode,
  type Product,
  type Category,
  type Value,
} from '@scayle/storefront-nuxt'
import { join } from 'pathe'
import type { SelectedSort } from '@scayle/storefront-product-listing'
import { useSeoMeta, useHead, definePageMeta, useRequestURL } from '#imports'
import { useI18n, type Locale } from '#i18n'
import { navigateTo, useRoute } from '#app/composables/router'
import { useNuxtApp } from '#app/nuxt'
import {
  useTrackingEvents,
  usePageState,
  useJsonld,
  useBreadcrumbs,
  useRouteHelpers,
} from '~/composables'
import { createError } from '#app/composables/error'
import { getCategoryId, getDistinctPrimaryImageTypes } from '~/utils'
import {
  categoryListingMetaData,
  PRODUCT_TILE_WITH_PARAMS,
  PRODUCTS_PER_PAGE,
} from '~~/shared/constants'
import SFCategorySideNavigation from '~/components/category/SFCategorySideNavigation.vue'
import SFCategoryNavigationBackButton from '~/components/category/SFCategoryNavigationBackButton.vue'
import SFCategoryBreadcrumbs from '~/components/category/SFCategoryBreadcrumbs.vue'
import SFSortSelection from '~/components/sorting/SFSortSelection.vue'
import SFFilterToggleButton from '~/components/filter/SFFilterToggleButton.vue'
import SFCategoryNavigationSlider from '~/components/category/SFCategoryNavigationSlider.vue'
import SFProductList from '~/components/productList/SFProductList.vue'
import SFFilterSlideIn from '~/components/filter/SFFilterSlideIn.vue'
import SFScrollToTopButton from '~/components/SFScrollToTopButton.vue'
import {
  useProductListingSeoData,
  useProductsForListing,
  useAppliedFilters,
  useProductListSort,
  useAllShopCategoriesForId,
  generateProductListingHreflangLinks,
  flattenCategoryTree,
  createDefaultSortingOption,
  SORT_DATE_NEWEST,
  SORT_PRICE_DESC,
  SORT_PRICE_ASC,
  SORT_REDUCTION_DESC,
} from '#storefront-product-listing'
import { useCategoryById } from '#storefront/composables'
import { usePrimaryImageType } from '~/composables/usePrimaryImageType'
import CMSProductListingPageComponent from '#storefront-cms/components/ProductListingPageComponent.vue'

const route = useRoute()
const { $config } = useNuxtApp()
const i18n = useI18n()
const { buildCategoryPath, getLocalizedHref } = useRouteHelpers()

const { pageState, setPageState } = usePageState()

const { trackViewItemList, trackSelectItem } = useTrackingEvents()

const { rootCategories, fetchingCategories } = defineProps<{
  rootCategories: Category[]
  fetchingCategories: boolean
}>()

const currentCategoryId = computed(() => getCategoryId(route.params))

const categoryParams = computed(() => ({
  id: currentCategoryId.value,
  children: 0,
  properties: { withName: ['sale'] },
  includeProductSorting: true,
}))

const {
  data: currentCategory,
  status: categoryStatus,
  error: categoryError,
} = await useCategoryById(
  {
    params: categoryParams,
    options: {
      dedupe: 'defer',
    },
  },
  'plp-current-category',
)

// Validates that the category exists and redirects to the correct path if the URL is incorrect but the category ID is valid
// If an error occurs or the category is not found, a 404 error is thrown also redirecting to the correct path if the category ID is valid but the path is incorrect
const validateCategoryExistsAndRedirect = async () => {
  if (categoryStatus.value == 'pending') {
    return
  }

  if (categoryError.value || !currentCategory.value) {
    throw createError({ statusCode: HttpStatusCode.NOT_FOUND, fatal: true })
  }

  const expectedPath = buildCategoryPath(currentCategory.value)
  if (expectedPath !== route.path) {
    return navigateTo(
      { path: expectedPath, query: route.query, hash: route.hash },
      { redirectCode: 301 },
    )
  }
}

onServerPrefetch(validateCategoryExistsAndRedirect)

const sortingOptions = computed<SelectedSort[]>(() => {
  return [
    {
      ...createDefaultSortingOption(currentCategory.value ?? undefined),
      label: i18n.t('sorting_select.top_seller'),
    },
    {
      ...SORT_DATE_NEWEST,
      label: i18n.t('sorting_select.date_newest'),
    },
    {
      ...SORT_PRICE_DESC,
      label: i18n.t('sorting_select.price_desc'),
    },
    {
      ...SORT_PRICE_ASC,
      label: i18n.t('sorting_select.price_asc'),
    },
    {
      ...SORT_REDUCTION_DESC,
      label: i18n.t('sorting_select.reduction_desc'),
    },
  ]
})

const { selectedSort, sortLinks, isDefaultSortSelected } = useProductListSort(
  route,
  {
    sortingOptions: sortingOptions,
  },
)
const { appliedFilter } = useAppliedFilters(route)

const imageTypeOptions = computed<Value[]>(() => {
  return getDistinctPrimaryImageTypes(products.value)
})
const { primaryImageType } = usePrimaryImageType(() => imageTypeOptions.value)

const pageNumber = computed(() => Number(route.query.page) || 1)
const params = computed(() => ({
  categoryId: currentCategory.value?.id,
  with: PRODUCT_TILE_WITH_PARAMS,
  sort: selectedSort.value,
  perPage: PRODUCTS_PER_PAGE,
  where: appliedFilter.value,
  page: pageNumber.value,
}))

const {
  products,
  pagination,
  status: productsStatus,
  totalProductsCount,
  paginationOffset,
} = useProductsForListing({
  params,
  fetchingOptions: { lazy: true },
})

const isLoading = computed(() => {
  return (
    productsStatus.value === 'pending' || categoryStatus.value === 'pending'
  )
})

const trackProductClick = (product: Product) => {
  trackSelectItem({
    product,
    listingMetaData: categoryListingMetaData,
    pagePayload: {
      content_name: route.fullPath,
      page_type: pageState.value.type,
      page_type_id: route.params.id?.toString() || '',
    },
  })
}

const trackViewListing = ({
  items,
}: {
  row: number
  items: (Product & { index: number })[]
}) => {
  trackViewItemList({
    items,
    listingMetaData: categoryListingMetaData,
    paginationOffset: paginationOffset.value,
    source: `category|${currentCategoryId.value}`,
  })
}

const shopCategoryParams = computed(() => ({
  id: currentCategoryId.value,
}))

// This request needs to be awaited to have the hreflang links available on server side. Additionally, it needs to be lazy to avoid blocking the page load.
const { data: categoriesForAllShops } = await useAllShopCategoriesForId({
  params: shopCategoryParams,
  options: {
    lazy: true,
  },
})

watch(
  [currentCategory, () => route.path],
  async ([category]) => {
    await validateCategoryExistsAndRedirect()
    setPageState('typeId', String(category?.id))
  },
  { immediate: true },
)

const { getBreadcrumbsFromCategory } = useBreadcrumbs()
const breadcrumbs = computed(() =>
  currentCategory.value
    ? getBreadcrumbsFromCategory(currentCategory.value, true)
    : [],
)

const { origin } = useRequestURL()

const { title, robots, canonicalLink, categoryBreadcrumbSchema } =
  useProductListingSeoData(
    breadcrumbs,
    route,
    {
      baseUrl: origin,
      fullPath: join($config.app.baseURL, route.fullPath),
    },
    isDefaultSortSelected,
  )

useJsonld(() => categoryBreadcrumbSchema.value)

useSeoMeta({
  robots,
  title: () => title.value,
  description: () => {
    if (!currentCategory.value) {
      return null
    }
    return i18n.t('product_list_page.meta.description', {
      category: currentCategory.value.name,
      shopName: $config.public.shopName,
    })
  },
})

const hreflangLinks = generateProductListingHreflangLinks(
  (categoriesForAllShops.value ?? []).map(({ category, path, locale }) => {
    const localizedCategoryPath = buildCategoryPath(category, path as Locale)
    const href = getLocalizedHref(path as Locale, localizedCategoryPath)
    return {
      categoryHref: href,
      path,
      locale,
    }
  }),
  i18n.defaultLocale,
)

useHead(() => ({
  link: [...canonicalLink.value, ...hreflangLinks],
}))

defineOptions({ name: 'CategoryPage' })

// The 'key' is required to preserve component state across PLP navigation.
// Without it, components like 'SFCategorySideNavigation' are re-rendered on every route change,
// leading to focus loss and unnecessary performance overhead.
definePageMeta({
  pageType: 'category_page',
  key: 'PLP',
})
</script>
