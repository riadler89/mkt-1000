<template>
  <div class="flex items-center" v-bind="$attrs">
    <button
      :id="id"
      class="relative inline-block h-6 w-11 rounded-full opacity-100 outline-2 outline-offset-2 focus-visible:shadow-none focus-visible:outline-primary"
      data-testid="register-guest-switch"
      :class="isActive ? 'bg-accent' : 'bg-gray-300'"
      role="switch"
      type="button"
      :aria-label="label"
      :aria-checked="isActive"
      :disabled="disabled"
      @click="toggle"
    >
      <slot name="thumb" :is-active="isActive" @toggle="toggle">
        <span
          :class="isActive ? 'translate-x-1 right-1.5' : 'left-0.5 bg-primary'"
          class="absolute top-0.5 inline-block size-5 rounded-full bg-white shadow transition duration-100 ease-linear focus:outline-none"
        >
          <slot />
        </span>
      </slot>
    </button>
    <slot name="label">
      <label
        v-if="label"
        class="ml-2 cursor-pointer text-md font-medium"
        :for="id"
      >
        {{ label }}
      </label>
    </slot>
  </div>
  <input
    type="checkbox"
    tabindex="-1"
    aria-hidden="true"
    :disabled="disabled"
    :value="isActive"
    :checked="!!isActive"
    class="hidden"
  />
</template>

<script setup lang="ts">
const {
  label,
  disabled = false,
  id,
} = defineProps<{
  /** Unique identifier for the switch. Required for accessibility and form handling. */
  id: string
  /** Text label displayed next to the switch. Can also be provided via the label slot. */
  label?: string
  /** When true, the switch is disabled and cannot be toggled. */
  disabled?: boolean
}>()

const isActive = defineModel<boolean>({ default: false })

const toggle = () => {
  isActive.value = !isActive.value
}
</script>
