<template>
  <label
    :for="id"
    class="group flex cursor-pointer items-center space-x-3 text-md font-medium"
  >
    <span class="flex size-6 items-center justify-center">
      <input
        :id="id"
        v-model="model"
        :value="item"
        class="peer size-full cursor-pointer appearance-none rounded border border-gray-500 checked:border-2 checked:border-accent hover:border-accent"
        type="checkbox"
        data-testid="form-checkbox"
      />
      <IconCheck
        class="absolute z-10 size-4 text-accent opacity-0 peer-checked:opacity-100"
      />
    </span>

    <slot name="label">
      <span
        v-if="label"
        class="leading-none text-secondary group-checked:text-black"
      >
        {{ label }}
      </span>
    </slot>
  </label>
</template>

<script setup lang="ts" generic="T">
defineProps<{
  /** Unique identifier for the checkbox input. Required for accessibility and form handling. */
  id: string
  /** The value associated with this checkbox when used in multiple selection mode. */
  item?: T
  /** Text label displayed next to the checkbox. Can also be provided via the label slot. */
  label?: string
}>()

const model = defineModel<T[] | boolean>()
</script>
