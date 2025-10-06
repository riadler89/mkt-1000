<template>
  <div class="-ml-1 truncate">
    <SFLink
      v-for="(
        { value: name, to }, index
      ) in getBreadcrumbsFromProductCategories(productCategories)"
      :key="`breadcrumb-${name}`"
      :data-testid="`category-breadcrumb-${index}`"
      :to="to"
      raw
      class="ml-1 px-2"
      :class="{
        'border-r border-secondary md:border-r': showDividerTag(
          index,
          productCategories.length,
        ),
        'pl-0': index === 0,
      }"
    >
      <span
        class="text-md leading-none text-secondary transition-all hover:text-black"
        :title="name"
      >
        {{ name }}
      </span>
    </SFLink>
  </div>
</template>

<script setup lang="ts">
import type { ProductCategory } from '@scayle/storefront-nuxt'
import { SFLink } from '#storefront-ui/components'
import { useBreadcrumbs } from '~/composables'
import { showDividerTag } from '#storefront-ui'

defineProps<{ productCategories: ProductCategory[] }>()

const { getBreadcrumbsFromProductCategories } = useBreadcrumbs()
</script>
