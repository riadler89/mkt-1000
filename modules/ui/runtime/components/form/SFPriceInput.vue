<template>
  <input
    ref="root"
    :type="inputType"
    class="h-10 w-[100px] rounded border bg-gray-200 text-center text-sm font-semibold text-primary"
    data-testid="price-input"
    :min="min / 100"
    :max="max / 100"
    :value="
      inputType === 'text'
        ? formatCurrency(modelValue)
        : modelValue / 10 ** decimalPlaces
    "
    @focus="focus"
    @blur="blur"
    @change="inputChange($event)"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

const {
  formatOptions = null,
  locale,
  currencyCode,
  min,
  max,
  modelValue,
} = defineProps<{
  /** The current price value in minor currency units (e.g., cents). This is the actual value used by the application. */
  modelValue: number
  /** ISO currency code (e.g., "USD", "EUR") used for formatting the displayed value.
   * Change the currency code would require to change the locale as well.
   */
  currencyCode: string
  /** Locale string (e.g., "en-US", "de-DE") used for currency formatting.
   * Change the locale would require to change the currency code as well.
   */
  locale: string
  /** Maximum allowed value in minor currency units. */
  max: number
  /** Minimum allowed value in minor currency units. */
  min: number
  /** Additional options for Intl.NumberFormat to customize currency display. */
  formatOptions?: Intl.NumberFormatOptions | null
}>()

const emit = defineEmits<{
  'update:model-value': [price: number]
  focus: [FocusEvent]
  blur: [FocusEvent]
}>()

const isActive = ref(false)
const root = ref<HTMLInputElement>()

const focus = (e: FocusEvent) => {
  isActive.value = true

  emit('focus', e)
}

const inputType = computed(() => (isActive.value ? 'number' : 'text'))

const blur = (e: FocusEvent) => {
  isActive.value = false
  emit('blur', e)
}

const decimalPlaces = computed(() => {
  if (!currencyCode) {
    return 2
  }

  const parts = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
  }).formatToParts(0)

  const fraction = parts.find((p) => p.type === 'fraction')

  if (!fraction) {
    return 0
  }

  return fraction.value.length
})

const inputChange = (event: Event) => {
  const { value } = event.target as HTMLInputElement
  if (value === modelValue.toString()) {
    return
  }

  const val = parseFloat(value)
  let adjustedValue: number

  adjustedValue = Math.round(val) * 10 ** decimalPlaces.value
  adjustedValue = Math.min(Math.max(min, adjustedValue), max)

  if (!isNaN(adjustedValue) && modelValue !== adjustedValue) {
    emit('update:model-value', adjustedValue)
  }
}

const formatCurrency = (value: number): string => {
  return (value / 10 ** decimalPlaces.value).toLocaleString(locale, {
    style: 'currency',
    currency: currencyCode,
    ...formatOptions,
  })
}
</script>
