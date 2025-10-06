<template>
  <button
    v-if="isFavoriteStore"
    class="cursor-pointer"
    @click="favoriteStoreId = null"
  >
    <IconSelectionActive class="size-4" />
  </button>
  <button v-else class="cursor-pointer" @click="favoriteStoreId = storeId">
    <IconSelection class="size-4" />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useFavoriteStore } from '~/composables/useFavoriteStore'

const { storeId } = defineProps<{ storeId: number }>()

const favoriteStoreId = useFavoriteStore()

const isFavoriteStore = computed(() => favoriteStoreId.value === storeId)
</script>
