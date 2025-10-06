<template>
  <SFModal
    v-model:visible="visible"
    class="size-full !max-h-screen !max-w-screen !p-0"
    @close="$emit('close')"
  >
    <!-- NOTE: The tailwind class `aspect-product` is defined via the `tailwind.config.ts` and uses the `PRODUCT_IMAGE_ASPECT_RATIO` value from `config/ui.ts`. -->
    <div
      class="h-dvh overflow-hidden max-md:my-auto max-md:bg-gray-100 md:mx-auto md:aspect-product"
    >
      <SFItemsSlider
        ref="slider"
        with-arrows
        @update:active-slide="updateSlide"
      >
        <div
          v-for="(productImage, index) in images"
          ref="slides"
          :key="productImage.hash"
          :class="
            scale >= 2 && index === imageIndex
              ? 'cursor-zoom-out'
              : 'cursor-zoom-in'
          "
          class="flex h-dvh min-w-full grow snap-start snap-always items-center self-start overflow-hidden max-md:bg-gray-100"
          @click="toggleDoubleZoom"
        >
          <SFProductImage
            :image="productImage"
            :alt="
              $t('product_image.alt_with_image_index', {
                alt,
                index: index + 1,
                total: images.length,
              })
            "
            :data-testid="`product-image-zoom-${index}`"
            sizes="xs:100vw sm:100vw md:100vw lg:100vw xl:100vw"
            :style="imageIndex === index ? productImageStyle : {}"
            class="transition-transform duration-75"
            :with-mix-blend-darken="false"
            @mousemove="updateZoomOffset"
          />
        </div>
        <template #prev-button="{ prev, isPrevEnabled }">
          <SFSliderArrowButton
            class="absolute top-1/2 -translate-y-1/2 bg-gray-300 max-md:hidden"
            :aria-label="$t('image_slider.a11ly.go_to_previous_image')"
            :disabled="!isPrevEnabled"
            direction="left"
            translate-on-hover
            @click="prev()"
          />
        </template>
        <template #next-button="{ next, isNextEnabled }">
          <SFSliderArrowButton
            class="absolute top-1/2 -translate-y-1/2 bg-gray-300 max-md:hidden"
            :aria-label="$t('image_slider.a11ly.go_to_next_image')"
            :disabled="!isNextEnabled"
            direction="right"
            translate-on-hover
            @click="next()"
          />
        </template>
        <template v-if="images.length > 1" #thumbnails>
          <div
            class="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-1"
          >
            <div
              v-for="i in images.length"
              :key="i"
              class="size-1 rounded-full bg-gray-400 transition-all duration-300"
              :class="{ 'w-3 !bg-black': i - 1 === imageIndex }"
            />
          </div>
        </template>
      </SFItemsSlider>
    </div>
  </SFModal>
</template>

<script setup lang="ts">
import {
  computed,
  nextTick,
  watch,
  ref,
  type WatchStopHandle,
  onScopeDispose,
} from 'vue'
import { usePinch, useDrag } from '@vueuse/gesture'
import { useEventListener } from '@vueuse/core'
import type { ProductImage as ProductImageType } from '@scayle/storefront-nuxt'
import SFProductImage from '../../SFProductImage.vue'
import { SFItemsSlider, SFModal } from '#storefront-ui/components'
import SFSliderArrowButton from '~~/modules/ui/runtime/components/core/SFSliderArrowButton.vue'

const { startIndex = 0 } = defineProps<{
  alt: string
  images: ProductImageType[]
  startIndex?: number
}>()

const visible = defineModel<boolean>('visible', { default: false })

let pinchController: ReturnType<typeof usePinch>
let dragController: ReturnType<typeof useDrag>
let stopZoomElementWatch: WatchStopHandle

watch(visible, (isNowVisible) => {
  if (isNowVisible) {
    nextTick(() => {
      slider.value?.scrollImageIntoView(startIndex, 'instant')
      pinchController = usePinch(pinchHandler, {
        domTarget: zoomElement,
        eventOptions: {
          passive: true,
        },
      })
      dragController = useDrag(dragHandler, {
        domTarget: zoomElement,
        eventOptions: {
          passive: true,
        },
      })
      stopZoomElementWatch = watch(zoomElement, () => {
        // when the slide changes, all event listeners need to be cleaned up and assigned to the new slide
        pinchController?.clean()
        pinchController?.bind()
        pinchController?.reset()
        dragController?.clean()
        dragController?.bind()
        dragController?.reset()

        resetOffset()
      })
    })
  } else {
    if (stopZoomElementWatch) {
      stopZoomElementWatch()
    }
    pinchController?.clean()
    pinchController?.reset()
    dragController?.clean()
    dragController?.reset()
  }
})

onScopeDispose(() => {
  if (stopZoomElementWatch) {
    stopZoomElementWatch()
  }
  pinchController?.clean()
  dragController?.clean()
})

defineEmits<{ close: [] }>()

const slider = ref<InstanceType<typeof SFItemsSlider>>()

// Zoom

// Shared
const imageIndex = ref(startIndex)
const zoomOffsetY = ref(0)
const zoomOffsetX = ref(0)
const scale = ref(1)

const isTouchSupported = import.meta.client && 'ontouchstart' in window
const MIN_ZOOM = 1

const resetOffset = () => {
  zoomOffsetX.value = 0
  zoomOffsetY.value = 0
}
const updateSlide = (newIndex: number) => {
  imageIndex.value = newIndex
  scale.value = 1
}

const getMaxOffset = (scale: number) => {
  const image = zoomElement.value?.querySelector('picture')
  const imgWidth = image?.clientWidth || 0
  const imgHeight = image?.clientHeight || 0

  return {
    maxOffsetX: Math.max(0, (imgWidth * scale - imgWidth) / 4.5),
    maxOffsetY: Math.max(0, (imgHeight * scale - imgWidth) / 8),
  }
}

const updateZoomOffset = (event: MouseEvent) => {
  if (!event || scale.value <= 1) {
    return
  }
  if (!isTouchSupported) {
    zoomOffsetY.value = event.offsetY
    zoomOffsetX.value = event.offsetX
  } else {
    const { maxOffsetX, maxOffsetY } = getMaxOffset(scale.value)
    zoomOffsetX.value = Math.min(
      Math.max(zoomOffsetX.value, -maxOffsetX),
      maxOffsetX,
    )
    zoomOffsetY.value = Math.min(
      Math.max(zoomOffsetY.value, -maxOffsetY),
      maxOffsetY,
    )
  }
}

const productImageStyle = computed(() => {
  // translate did cause jitter on desktop, and transform-origin did cause jitter with touch
  // therefore we use different approaches here
  return isTouchSupported
    ? `transform: scale(${scale.value}) translate(${zoomOffsetX.value}px, ${zoomOffsetY.value}px)`
    : `transform: scale(${scale.value}); transform-origin: ${zoomOffsetX.value}px ${zoomOffsetY.value}px;`
})

// desktop zoom
const MAX_ZOOM_DESKTOP = 1.5
const toggleDoubleZoom = (event: MouseEvent) => {
  if (scale.value <= MIN_ZOOM) {
    scale.value = MAX_ZOOM_DESKTOP
    updateZoomOffset(event)
  } else {
    scale.value = MIN_ZOOM
    resetOffset()
  }
}

// mobile zoom
const slides = ref<HTMLDivElement[]>()
const zoomElement = computed(() => slides.value?.[imageIndex.value])
const pinchActive = ref(false)
const MAX_PINCH_ZOOM = 500
const MAX_ZOOM_MOBILE = 2

const mapNumberToRange = (
  num: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) => {
  const mappedNumber =
    ((num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
  return Math.min(Math.max(mappedNumber, outMin), outMax)
}

const pinchHandler = ({
  offset: [pinchZoom],
  pinching,
}: {
  offset: [number, number]
  pinching: boolean
}) => {
  pinchActive.value = pinching
  if (!pinching) {
    return
  }
  scale.value = mapNumberToRange(
    pinchZoom,
    0,
    MAX_PINCH_ZOOM,
    MIN_ZOOM,
    MAX_ZOOM_MOBILE,
  )

  const { maxOffsetX, maxOffsetY } = getMaxOffset(scale.value)
  zoomOffsetX.value = Math.min(
    Math.max(zoomOffsetX.value, -maxOffsetX),
    maxOffsetX,
  )
  zoomOffsetY.value = Math.min(
    Math.max(zoomOffsetY.value, -maxOffsetY),
    maxOffsetY,
  )
}
const dragHandler = ({
  dragging,
  delta: [x, y],
}: {
  dragging: boolean
  delta: [number, number]
}) => {
  if (!dragging || pinchActive.value) {
    return
  }

  const { maxOffsetX, maxOffsetY } = getMaxOffset(scale.value)
  zoomOffsetX.value = Math.min(
    Math.max(zoomOffsetX.value + x, -maxOffsetX),
    maxOffsetX,
  )
  zoomOffsetY.value = Math.min(
    Math.max(zoomOffsetY.value + y, -maxOffsetY),
    maxOffsetY,
  )
}

useEventListener(document, 'gesturestart', (e) => {
  e.preventDefault()
})
useEventListener(document, 'gesturechange', (e) => {
  e.preventDefault()
})
</script>
