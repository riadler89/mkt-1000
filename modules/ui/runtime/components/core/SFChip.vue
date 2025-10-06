<template>
  <div class="group relative">
    <input
      v-model="model"
      :value="item"
      class="peer absolute size-full cursor-pointer appearance-none rounded-lg"
      type="checkbox"
      data-testid="checkbox-chip"
      :aria-label="inputAriaLabel"
    />
    <div
      class="flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium text-secondary outline outline-1 outline-gray-500 group-hover:outline-2 group-hover:outline-accent peer-checked:bg-accent peer-checked:text-white peer-checked:outline-accent"
    >
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts" generic="T">
defineProps<{
  /**
   * The value associated with this chip. This will be included in the `v-model` array when selected.
   * The type is a generic `T` which can be any value type (string, number, object, etc.).
   * Common use cases include:
   * - String values for filter options (e.g., "red", "blue", "large")
   * - Object values with additional metadata (e.g., { id: 1, name: "Red", count: 5 })
   * - Numeric values for size or price ranges (e.g., 10, 20, 30)
   *
   * The same type `T` should be used consistently across all chips in a group to ensure
   * proper type safety in the `v-model` array.
   */
  item: T
  /**
   * Accessibility label for the checkbox input. Should describe the action and context.
   */
  inputAriaLabel?: string
}>()

const model = defineModel<T[]>()
</script>
