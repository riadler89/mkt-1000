<template>
  <div
    class="flex justify-between gap-2 rounded-lg border border-gray-200 p-2"
    data-testid="quantity-selector"
  >
    <SFButton
      variant="raw"
      :disabled="quantity <= 1 || disabled"
      class="group !size-9 shrink-0 rounded-md border-none bg-gray-200 disabled:bg-gray-200 md:!size-8"
      data-testid="quantity-minus"
      :aria-label="
        $t('quantity_input.change_value_to', { newQuantity: quantity - 1 })
      "
      @click="quantity--"
    >
      <IconMinus class="size-6 fill-secondary group-disabled:fill-gray-400" />
    </SFButton>
    <input
      type="number"
      readonly
      :value="quantity"
      class="mx-2 min-w-[2ch] max-w-[3ch] select-none text-center text-md font-semibold tabular-nums focus:border-transparent focus:ring-0"
      data-testid="quantity-value"
      tabindex="-1"
      :aria-label="
        $t('quantity_input.current_value', { currentQuantity: quantity })
      "
    />
    <SFButton
      variant="raw"
      :disabled="quantity >= maxQuantity || disabled"
      class="group !size-9 shrink-0 rounded-md border-none bg-gray-200 disabled:bg-gray-200 md:!size-8"
      data-testid="quantity-plus"
      :aria-label="
        $t('quantity_input.change_value_to', { newQuantity: quantity + 1 })
      "
      @click="quantity++"
    >
      <IconPlus class="size-6 fill-secondary group-disabled:fill-gray-400" />
    </SFButton>
  </div>
</template>

<script setup lang="ts">
import { SFButton } from '#storefront-ui/components'

defineProps<{ maxQuantity: number; disabled?: boolean }>()

const quantity = defineModel<number>({ required: true })
</script>

<style lang="css" scoped>
input {
  appearance: textfield;
}
input::-webkit-inner-spin-button,
input::-webkit-outer-spin-button {
  appearance: none;
}
</style>
