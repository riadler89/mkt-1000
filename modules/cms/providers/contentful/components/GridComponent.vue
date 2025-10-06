<template>
  <div
    :data-contentful-entry-id="contentElement?.sys?.id"
    data-contentful-field-id="columnContent"
    class="grid w-full"
    :class="[
      desktopColumnsClass,
      desktopColumnGap,
      desktopRowGap,
      mobileColumnsClass,
      mobileColumnGap,
      mobileRowGap,
      verticalContentAlignment,
      horizontalContentAlignment,
    ]"
  >
    <template
      v-for="element in contentElement.fields.columnContent"
      :key="element?.sys.id"
    >
      <ContentfulComponent v-if="element" :content-element="element" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { TypeGridComponentWithoutUnresolvableLinksResponse } from '../types'
import { provideCMSContext, useCMSContext } from '../../../utils/useCMSContext'
import ContentfulComponent from './ContentfulComponent.vue'

const { contentElement } = defineProps<{
  contentElement: TypeGridComponentWithoutUnresolvableLinksResponse
}>()

const { desktopViewportFraction, mobileViewportFraction } = useCMSContext()
// In order to know the correct width within nested grids, we need to multiply the number of columns by the parent column count.
const currentDesktopViewportFraction = computed(() => {
  return (
    (1 / contentElement.fields.numberOfColumnsDesktop) *
    desktopViewportFraction.value
  )
})
const currentMobileViewportFraction = computed(() => {
  return (
    (1 / contentElement.fields.numberOfColumnsMobile) *
    mobileViewportFraction.value
  )
})

provideCMSContext({
  desktopViewportFraction: currentDesktopViewportFraction,
  mobileViewportFraction: currentMobileViewportFraction,
})
const desktopColumnsClass = computed(() => {
  switch (contentElement.fields.numberOfColumnsDesktop) {
    case 1:
      return 'lg:grid-cols-1'
    case 3:
      return 'lg:grid-cols-3'
    case 4:
      return 'lg:grid-cols-4'
    case 5:
      return 'lg:grid-cols-5'
    case 6:
      return 'lg:grid-cols-6'
    case 2:
    default:
      return 'lg:grid-cols-2'
  }
})
const mobileColumnsClass = computed(() => {
  switch (contentElement.fields.numberOfColumnsMobile) {
    case 3:
      return 'grid-cols-3'
    case 2:
      return 'grid-cols-2'
    case 1:
    default:
      return 'grid-cols-1'
  }
})

const desktopColumnGap = computed(() => {
  switch (contentElement.fields.gapColumnDesktop) {
    case 'small':
      return 'lg:gap-x-7'
    case 'medium':
      return 'lg:gap-x-9'
    case 'large':
      return 'lg:gap-x-12'
    case 'none':
    default:
      return 'lg:gap-x-0'
  }
})

const mobileColumnGap = computed(() => {
  switch (contentElement.fields.gapColumnMobile) {
    case 'small':
      return 'gap-x-3'
    case 'medium':
      return 'gap-x-5'
    case 'large':
      return 'gap-x-9'
    case 'none':
    default:
      return 'gap-x-0'
  }
})

const desktopRowGap = computed(() => {
  switch (contentElement.fields.gapRowDesktop) {
    case 'small':
      return 'lg:gap-y-7'
    case 'medium':
      return 'lg:gap-y-9'
    case 'large':
      return 'lg:gap-y-12'
    case 'none':
    default:
      return 'lg:gap-y-0'
  }
})

const mobileRowGap = computed(() => {
  switch (contentElement.fields.gapRowMobile) {
    case 'small':
      return 'gap-y-3'
    case 'medium':
      return 'gap-y-5'
    case 'large':
      return 'gap-y-9'
    case 'none':
    default:
      return 'gap-y-0'
  }
})

const verticalContentAlignment = computed(() => {
  switch (contentElement.fields.verticalContentAlignment) {
    case 'Top':
      return 'items-start'
    case 'Bottom':
      return 'items-end'
    case 'Middle':
    default:
      return 'items-center'
  }
})
const horizontalContentAlignment = computed(() => {
  switch (contentElement.fields.horizontalContentAlignment) {
    case 'Left':
      return 'justify-items-start'
    case 'Right':
      return 'justify-items-end'
    case 'Center':
    default:
      return 'justify-items-center'
  }
})
</script>
