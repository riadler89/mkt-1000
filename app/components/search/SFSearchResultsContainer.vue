<template>
  <div
    id="search-results"
    role="popup"
    class="fixed z-10 mt-2 w-full space-y-5 border-gray-400 bg-white p-4 max-lg:bottom-0 max-lg:top-20 max-lg:mt-5 max-lg:overflow-y-auto lg:absolute lg:rounded-lg lg:border lg:shadow"
    data-testid="search-results-flyout"
  >
    <SFFadeInTransition>
      <SFSearchResultSkeleton v-if="showSuggestionsLoader" />
      <div v-else>
        <div v-if="resultsCount && resultsCount > 0" class="flex flex-col">
          <SFSearchResults
            :products="products"
            :categories="categories"
            :navigation-items="navigationItems"
            :search-term="searchQuery"
            @click-result="emit('clickResult', $event)"
            @close="emit('close')"
          />
        </div>
        <section
          v-else-if="!resultsCount && searchQuery"
          class="py-2"
          data-testid="no-result"
        >
          <SFShowAllResultsLink
            :search-term="searchQuery"
            @click="emit('clickResult', 'show_all')"
          />
        </section>
      </div>
    </SFFadeInTransition>
  </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import type {
  SearchEntity,
  CategorySearchSuggestion,
  ProductSearchSuggestion,
  NavigationItemSuggestion,
} from '@scayle/storefront-nuxt'
import SFSearchResultSkeleton from './SFSearchResultSkeleton.vue'
import SFShowAllResultsLink from './SFShowAllResultsLink.vue'
import { SFFadeInTransition } from '#storefront-ui/components'

const SFSearchResults = defineAsyncComponent(
  () => import('./SFSearchResults.vue'),
)

const emit = defineEmits<{
  clickResult: [result: SearchEntity | 'show_all']
  close: []
}>()

const { products, categories, navigationItems } = defineProps<{
  searchQuery: string
  products: ProductSearchSuggestion[]
  categories: CategorySearchSuggestion[]
  navigationItems: NavigationItemSuggestion[]
  showSuggestionsLoader: boolean
}>()

const resultsCount = computed(() => {
  return products.length + navigationItems.length + categories.length
})
</script>
