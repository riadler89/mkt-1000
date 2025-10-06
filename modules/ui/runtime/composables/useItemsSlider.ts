import { computed, ref, type Ref } from 'vue'
import { useMounted, useResizeObserver, useThrottleFn } from '@vueuse/core'

export function useItemsSlider(
  sliderRef: Ref<HTMLElement>,
  mode: 'horizontal' | 'vertical',
) {
  /**
   * This is because scrollTop/scrollLeft are non-rounded
   * numbers, while scrollHeight/scrollWidth and clientHeight/clientWidth are rounded.
   * https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight#determine_if_an_element_has_been_totally_scrolled
   */
  const ARRIVED_STATE_THRESHOLD_PIXELS = 1

  const arrivedRight = ref(false)
  const arrivedLeft = ref(true)
  const x = ref(0)

  const arrivedBottom = ref(false)
  const arrivedTop = ref(true)
  const y = ref(0)

  const activeSlide = ref(0)

  const calculateActiveSlide = () => {
    if (mode === 'horizontal') {
      activeSlide.value = Math.abs(
        Math.round(
          (x.value - ARRIVED_STATE_THRESHOLD_PIXELS) / getSlideWidth(),
        ),
      )
    } else {
      activeSlide.value = Math.abs(
        Math.round(
          (y.value - ARRIVED_STATE_THRESHOLD_PIXELS) / getSlideHeight(),
        ),
      )
    }
  }

  // Note: Throttle onScroll callback to prevent layout thrashing. https://kellegous.com/j/2013/01/26/layout-performance/
  const onScroll = useThrottleFn(
    () => {
      if (import.meta.server || !sliderRef.value) {
        return
      }

      // Horizontal
      const scrollLeft = sliderRef.value?.scrollLeft
      arrivedRight.value =
        scrollLeft + sliderRef.value?.clientWidth >=
        sliderRef.value?.scrollWidth - ARRIVED_STATE_THRESHOLD_PIXELS
      arrivedLeft.value = scrollLeft <= 0
      x.value = scrollLeft

      // Vertical
      const scrollTop = sliderRef.value?.scrollTop
      arrivedBottom.value =
        scrollTop + sliderRef.value?.clientHeight >=
        sliderRef.value?.scrollHeight - ARRIVED_STATE_THRESHOLD_PIXELS
      arrivedTop.value = scrollTop <= 0
      y.value = scrollTop

      calculateActiveSlide()
    },
    100,
    true,
  )

  const getSlideWidth = () => {
    const slideCount = sliderRef.value.children.length
    return sliderRef.value.scrollWidth / slideCount
  }

  const getSlideHeight = () => {
    const slideCount = sliderRef.value.children.length
    return sliderRef.value.scrollHeight / slideCount
  }

  const next = (offset = 0) => {
    if (!isNextEnabled.value) {
      return
    }
    if (mode === 'horizontal') {
      sliderRef.value.scrollTo({
        top: 0,
        left: x.value + getSlideWidth() + offset,
        behavior: 'smooth',
      })
    } else {
      sliderRef.value.scrollTo({
        top: y.value + getSlideHeight() + offset,
        left: 0,
        behavior: 'smooth',
      })
    }
  }
  const prev = (offset = 0) => {
    if (!isPrevEnabled.value) {
      return
    }
    if (mode === 'horizontal') {
      sliderRef.value.scrollTo({
        top: 0,
        left: x.value - getSlideWidth() + offset,
        behavior: 'smooth',
      })
    } else {
      sliderRef.value.scrollTo({
        top: y.value - getSlideHeight() + offset,
        left: 0,
        behavior: 'smooth',
      })
    }
  }

  const scrollImageIntoView = (
    index: number,
    scrollBehavior: ScrollBehavior = 'auto',
  ) => {
    if (!sliderRef.value) {
      return
    }
    if (mode === 'horizontal') {
      sliderRef.value.scrollTo({
        left: sliderRef.value.offsetWidth * index,
        behavior: scrollBehavior,
      })
    } else {
      sliderRef.value.scrollTo({
        top: sliderRef.value.offsetHeight * index,
        behavior: scrollBehavior,
      })
    }
  }

  const mounted = useMounted()

  const isNextEnabled = computed(() =>
    mounted.value && mode === 'horizontal'
      ? !arrivedRight.value
      : !arrivedBottom.value,
  )

  const isPrevEnabled = computed(() =>
    mounted.value && mode === 'horizontal'
      ? !arrivedLeft.value
      : !arrivedTop.value,
  )
  const scrollWidth = ref(0)
  const clientWidth = ref(0)
  const scrollHeight = ref(0)
  const clientHeight = ref(0)

  useResizeObserver(sliderRef, () => {
    scrollWidth.value = sliderRef.value.scrollWidth
    clientWidth.value = sliderRef.value.clientWidth
    scrollHeight.value = sliderRef.value.scrollHeight
    clientHeight.value = sliderRef.value.clientHeight
    onScroll()
  })
  const isScrollable = computed(() => {
    if (!sliderRef.value) {
      return
    }

    return mode === 'horizontal'
      ? scrollWidth.value > clientWidth.value
      : scrollHeight.value > clientHeight.value
  })

  return {
    sliderRef,
    onScroll,
    next,
    prev,
    isNextEnabled,
    isPrevEnabled,
    scrollImageIntoView,
    activeSlide,
    isScrollable,
  }
}
