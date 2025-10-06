<template>
  <input
    ref="root"
    :type="inputType"
    class="h-10 w-[100px] rounded border bg-gray-200 text-center text-sm font-semibold text-primary"
    data-testid="price-input"
    :min="minValue"
    :max="maxValue"
    :value="value"
    @focus="focus"
    @blur="blur"
    @change="inputChange($event)"
  />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useFormatHelpers } from '#storefront/composables'

const { variant, locale, currencyCode, min, max, modelValue, formatOptions } =
  defineProps<{
    variant: 'price' | 'percentage'
    modelValue: number
    currencyCode: string
    locale: string
    max: number
    min: number
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

const minValue = computed(() => {
  if (variant === 'percentage') {
    return min
  }
  return min / 100
})
const maxValue = computed(() => {
  if (variant === 'percentage') {
    return max
  }
  return max / 100
})
const value = computed(() => {
  if (variant === 'percentage') {
    if (inputType.value === 'text') {
      return formatPercentage(modelValue / 100)
    }
    return modelValue
  }
  if (inputType.value === 'text') {
    return formatCurrency(modelValue)
  }
  return modelValue / 10 ** decimalPlaces.value
})

const decimalPlaces = computed(() => {
  if (variant === 'percentage') {
    return 0
  }
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

const { formatPercentage } = useFormatHelpers()
const formatCurrency = (value: number): string => {
  return (value / 10 ** decimalPlaces.value).toLocaleString(locale, {
    style: 'currency',
    currency: currencyCode,
    ...formatOptions,
  })
}
</script>
