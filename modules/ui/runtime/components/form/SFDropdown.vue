<template>
  <div ref="dropdownContainer" class="relative inline-block text-left">
    <div ref="button" class="h-full">
      <SFButton
        variant="raw"
        size="sm"
        class="group inline-flex size-full justify-between gap-0 rounded-md border border-gray-400 bg-gray-100 !px-3.5 !py-2 font-semibold leading-5 hover:bg-white"
        :disabled="disabled"
        :aria-label="ariaLabel"
        :aria-expanded="isDropdownListVisible"
        :aria-invalid="hasErrors"
        :aria-controls="id"
        aria-haspopup="true"
        :class="[
          ...buttonClasses,
          {
            'rounded-md': radius == 'md',
            'rounded-xl': radius == 'xl',
            '!border-2 !border-status-error !bg-white !text-status-error shadow-none !outline-0 *:!text-status-error hover:!border-status-error focus:!border-status-error':
              hasErrors,
          },
        ]"
        @click.prevent="isDropdownListVisible = !isDropdownListVisible"
      >
        <slot name="default">
          <span class="max-w-[80%] text-ellipsis">{{ modelValue }}</span>
        </slot>
        <template #append-icon="{ _class }">
          <IconDropdown
            class="transition duration-300 group-hover:text-accent"
            :class="[{ 'rotate-180': isDropdownListVisible }, _class]"
          />
        </template>
      </SFButton>
    </div>
    <Transition
      enter-from-class="translate-y-full md:-translate-y-10 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      enter-active-class="transition-all duration-200"
      leave-active-class="transition-all duration-200"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-full md:-translate-y-10 opacity-0"
    >
      <div
        v-show="isDropdownListVisible"
        :id="id"
        ref="options"
        v-popover="isDropdownListVisible"
        class="absolute m-0 w-full rounded-md bg-white p-2 shadow-secondary ring-1 ring-gray-400 focus:outline-none max-md:backdrop:bg-primary/50"
        :class="[
          {
            'rounded-t-md md:rounded-md': radius == 'md',
            'rounded-t-xl md:rounded-xl': radius == 'xl',
            'block-scrolling': isDropdownListVisible && isMobile,
          },
        ]"
        :style="itemsContainerStyle"
      >
        <ul
          class="max-h-[330px] overflow-y-auto bg-white p-2 scrollbar-hide md:p-px"
          :class="{
            'rounded-md': radius == 'md',
            'rounded-xl': radius == 'xl',
          }"
        >
          <li v-for="item in items" :key="`${item}`">
            <slot name="item" v-bind="{ item, selectItem }">
              <div
                class="flex w-full cursor-pointer items-center justify-between space-x-2 p-2 transition-all hover:bg-gray-300"
                :class="{
                  'rounded-md': radius == 'md',
                  'rounded-xl': radius == 'xl',
                }"
                @keydown.enter="selectItem(item)"
                @click="selectItem(item)"
              >
                {{ item }}
              </div>
            </slot>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts" generic="T">
import { computed, ref, useTemplateRef, watch } from 'vue'
import { useEventListener } from '@vueuse/core'
import { vPopover } from '../../directives/popover'
import { useDefaultBreakpoints } from '#storefront-ui/composables'
import { SFButton } from '#storefront-ui/components'
import { useDropdownKeyboardBehavior } from '#storefront-ui'

const {
  disabled = false,
  hasErrors = false,
  radius = 'md',
  buttonClass,
} = defineProps<{
  /** Array of items to display in the dropdown. Can be strings, numbers, or objects. */
  items: NonNullable<T>[]
  /** Class(es) to apply to the dropdown button. */
  buttonClass?: string[] | string
  /** Unique identifier for the dropdown. Required for accessibility and form handling. */
  id: string
  /** When true, applies error styling to indicate validation issues. */
  hasErrors?: boolean
  /** When true, the dropdown is disabled and cannot be interacted with. */
  disabled?: boolean
  /** Accessibility label for screen readers. */
  ariaLabel?: string
  /** Controls the border radius of the dropdown button and list. */
  radius?: 'md' | 'xl'
}>()

const isDropdownListVisible = defineModel<boolean>('visible', {
  default: false,
})

const modelValue = defineModel<T>('modelValue')

const buttonClasses = computed(() => {
  return Array.isArray(buttonClass) ? buttonClass : [buttonClass]
})

const selectItem = (item: T) => {
  modelValue.value = item
  isDropdownListVisible.value = false
}

const dropdownContainer = ref()

const button = ref()
const itemsContainerStyle = ref()
const { smaller } = useDefaultBreakpoints()
const isMobile = smaller('md')

const buttonRef = useTemplateRef('button')
const rootRef = useTemplateRef('dropdownContainer')
const optionsRef = useTemplateRef('options')
useDropdownKeyboardBehavior(
  { rootRef, buttonRef, optionsRef },
  {
    isOpen: isDropdownListVisible,
    close: () => (isDropdownListVisible.value = false),
    open: () => (isDropdownListVisible.value = true),
  },
)

const calculateDropdown = () => {
  if (!button.value) {
    return
  }

  if (isMobile.value) {
    itemsContainerStyle.value = {
      left: `0`,
      bottom: `0`,
      top: 'auto',
      width: `100%`,
      position: 'fixed',
    }
    return
  }

  const rect = button.value.getBoundingClientRect()
  itemsContainerStyle.value = {
    left: `${rect.left + window.scrollX}px`,
    top: `${rect.top + window.scrollY}px`,
    width: `${button.value!.offsetWidth}px`,
  }
}

let cleanupResizeListener: ReturnType<typeof useEventListener> | undefined
watch(isDropdownListVisible, (isOpen) => {
  if (isOpen) {
    calculateDropdown()
    cleanupResizeListener = useEventListener('resize', calculateDropdown)
    return
  }

  cleanupResizeListener?.()
  cleanupResizeListener = undefined
})
</script>
