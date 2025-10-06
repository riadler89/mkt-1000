<template>
  <!-- This component is intended to run only on the client.
It has a .client suffix, which Nuxt uses to prevent the component from being loaded during server-side rendering — but this only applies when the component is auto-imported or imported from #components.
https://nuxt.com/docs/guide/directory-structure/components#client-components

Therefore, to ensure it's also not rendered on the server, it must be wrapped in a ClientOnly block in the template.  -->
  <ClientOnly>
    <Transition
      enter-from-class="translate-y-full md:translate-y-0 md:translate-x-full backdrop:opacity-0"
      enter-to-class="translate-y-0 md:translate-x-0 backdrop:opacity-100"
      enter-active-class="transform transition-all duration-200 backdrop:transition backdrop:ease-linear backdrop:duration-200"
      leave-active-class="transform transition-all duration-200 backdrop:transition backdrop:ease-linear backdrop:duration-200"
      leave-from-class="translate-y-0 md:translate-x-0 backdrop:opacity-100"
      leave-to-class="translate-y-full md:translate-y-0 md:translate-x-full backdrop:opacity-0"
    >
      <!-- eslint-disable-next-line vue/require-toggle-inside-transition  -->
      <dialog
        ref="slideIn"
        v-dialog.modal="isOpen"
        :name="name"
        class="z-20 h-full overflow-hidden transition-all backdrop:bg-black/50 max-sm:m-0 max-sm:h-dvh max-sm:max-h-screen max-sm:w-screen max-sm:max-w-screen md:mr-0 md:rounded-l-xl"
        :class="$attrs.class"
        @click="onClick"
        @cancel="onCancel"
      >
        <div
          class="size-full overflow-y-auto bg-white md:inset-y-2 md:right-2 md:max-w-[25rem]"
          data-testid="slide-in-overflow"
          :class="[
            slideClass,
            {
              'scroll-pb-24': scrollPaddingReady,
            },
          ]"
        >
          <div class="relative flex max-h-full flex-col">
            <slot v-bind="toggle" name="slide-in-content">
              <div
                class="sticky top-0 z-10 bg-white/90 px-6 py-4"
                :class="{ 'border-b border-b-gray-300': !borderless }"
              >
                <slot name="slide-in-header" :toggle="toggle" />
              </div>
              <slot name="slide-in-body" />
              <div
                v-if="$slots['slide-in-actions']"
                class="sticky bottom-0 z-10 mt-auto bg-white p-6"
                :class="{ 'border-t border-t-gray-300': !borderless }"
              >
                <slot name="slide-in-actions" />
              </div>
            </slot>
          </div>
        </div>
      </dialog>
    </Transition>
  </ClientOnly>
</template>

<script setup lang="ts">
import { watch, nextTick, useTemplateRef, computed, ref } from 'vue'
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap'
import { onKeyStroke, syncRefs } from '@vueuse/core'
import { tabbable } from 'tabbable'
import { vDialog } from '../../directives/dialog'
import { useSlideIn } from '#storefront-ui'
import { onBeforeRouteUpdate } from '#app/composables/router'
import { ClientOnly } from '#components'

const {
  slideClass = '',
  borderless = false,
  name,
  closeOnRouteChange = true,
} = defineProps<{
  /**
   * Unique identifier for the slide-in panel. Used for state management and focus handling.
   */
  name: string
  /**
   * Additional CSS classes to apply to the slide-in container.
   */
  slideClass?: string
  /**
   * Whether to remove borders from header and action sections.
   */
  borderless?: boolean
  /**
   * Whether to automatically close the slide-in when the route changes.
   */
  closeOnRouteChange?: boolean
}>()

const emit = defineEmits<{
  /**
   * Event emitted when the slide-in opens.
   */
  open: []
  /**
   * Event emitted when the slide-in closes.
   */
  close: []
}>()

const { isOpen, toggle, close } = useSlideIn(name)
const scrollPaddingReady = ref(false)
const slideIn = useTemplateRef<HTMLDialogElement>('slideIn')

// Syncs both refs after nextTick
// Reason: Applying scroll-margin directly causes a pre-scrolled slide in.
syncRefs(isOpen, scrollPaddingReady, { flush: 'post' })

const onClick = (e: MouseEvent) => {
  if (!isOpen.value) {
    return
  }

  // Close the dialog when the backdrop is clicked
  if (e.target instanceof Element && e.target?.nodeName === 'DIALOG') {
    close()
  }
}

// Intercept the cancel event that is triggered from other sources (e.g. escape keypress) then prevent
// the default behavior and use our own cancel behavior that uses an exit animation and keeps `isOpen` in sync
const onCancel = (e: Event) => {
  e.preventDefault()
  close()
}

const initialFocus = computed(() => {
  return slideIn.value && tabbable(slideIn.value).length ? undefined : false
})

const { activate: activateSlideInTrap, deactivate: deactivateSlideInTrap } =
  useFocusTrap(slideIn, {
    initialFocus: () => initialFocus.value,
    escapeDeactivates: false,
    immediate: isOpen.value,
  })

watch(isOpen, async (value) => {
  if (value) {
    await nextTick()
    activateSlideInTrap()
  } else {
    deactivateSlideInTrap()
  }
})

watch(isOpen, (newValue) => (newValue ? emit('open') : emit('close')))

onKeyStroke('Esc', () => close(), { target: slideIn })

// Whenever the route changes, we want to make sure that the slide-in is closed when `closeOnRouteChange` is `true`.
onBeforeRouteUpdate((_to, _from, next) => {
  if (closeOnRouteChange && isOpen.value) {
    close()
  }
  next()
})
</script>
