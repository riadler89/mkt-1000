<template>
  <div class="relative flex-1">
    <input
      v-bind="$attrs"
      :id="id"
      ref="input"
      v-model="modelValue"
      :required="required"
      :readonly="readonly"
      :name="name"
      :aria-required="required"
      :aria-invalid="hasErrors"
      :type="type"
      :placeholder="placeholder"
      class="peer h-12 w-full rounded-xl border border-gray-200 bg-gray-200 py-4 pl-4 pr-2 text-md text-primary transition duration-100 input-white-autofill placeholder:text-transparent hover:border-gray-400 hover:bg-white focus:border-accent focus:bg-white focus:text-accent focus:shadow-none focus:outline focus:outline-3 focus:outline-offset-0 focus:outline-status-info/50"
      :class="{
        'border-gray-400 bg-white': modelValue || type === 'date',
        'focus:border-gray-400 focus:text-primary focus:!outline-none':
          readonly,
        'border-2 border-status-error bg-white !text-status-error shadow-none !outline-0 hover:border-status-error focus:border-status-error':
          hasErrors,
        'appearance-none [&::-webkit-date-and-time-value]:text-left':
          type === 'date',
      }"
    />
    <label
      v-if="placeholder"
      :for="id"
      class="absolute left-2 top-4 w-full truncate pl-2.5 text-sm text-secondary duration-100 ease-linear placeholder-shown:bg-gray-200 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-md peer-placeholder-shown:text-secondary peer-focus:ml-1 peer-focus:w-fit peer-focus:-translate-y-6 peer-focus:bg-white peer-focus:px-1.5 peer-focus:text-sm peer-focus:text-accent peer-focus:shadow-input-label after:peer-focus:text-accent"
      :style="{ maxWidth: `${inputWidth}px` }"
      :class="{
        [`after:ml-0.5 after:text-secondary after:content-['*']`]: required,
        '!text-secondary transition-none peer-focus:after:text-secondary':
          readonly,
        'ml-1 !w-fit -translate-y-6 bg-white !px-1.5 text-sm !shadow-input-label':
          modelValue,
        '!text-status-error after:text-status-error peer-focus:after:text-status-error':
          hasErrors,
        'ml-1 w-min -translate-y-6 bg-white px-1.5 text-sm text-accent shadow-input-label after:text-accent':
          type === 'date',
      }"
    >
      {{ placeholder }}
    </label>
    <div
      v-if="$slots['append-icon']"
      class="absolute right-2 top-1/2 h-full w-10 -translate-y-1/2 py-1.5"
    >
      <slot name="append-icon" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, useTemplateRef, useId } from 'vue'
import { useElementSize } from '@vueuse/core'

defineOptions({ inheritAttrs: false })

const {
  type = 'text',
  required = false,
  hasErrors = false,
  placeholder,
  // Disabling unimport/auto-insert here due incorrect detection of "readonly" keyword
  // eslint-disable-next-line unimport/auto-insert
  readonly = false,
  name,
} = defineProps<{
  /** Placeholder text that becomes the floating label when the input has a value. */
  placeholder: string
  /** When true, adds required validation and visual indicator (asterisk). */
  required?: boolean
  /** HTML input type that determines the input behavior and validation. */
  type?: HTMLInputElement['type']
  /** When true, the input is read-only and cannot be edited. */
  readonly?: boolean
  /** Name attribute for the input element, used in form submission. */
  name?: string
  /** When true, applies error styling and indicates validation issues. */
  hasErrors?: boolean
}>()

const modelValue = defineModel<string>()

const input = useTemplateRef('input')
const { width: inputWidth } = useElementSize(input)

const id = computed(() => `text-input-${useId()}`)
</script>
