<template>
  <section class="relative h-20">
    <slot :is-valid="isValid" :error-messages="errorMessages" />
    <SFFadeInFromBottomTransition>
      <p
        v-if="!isValid"
        aria-live="assertive"
        data-testid="validation-error-text"
        class="ml-1 mt-1 text-start text-sm font-normal text-status-error"
      >
        {{ errorMessages[0] }}
      </p>
    </SFFadeInFromBottomTransition>
  </section>
</template>

<script setup lang="ts">
import type { ErrorObject } from '@vuelidate/core'
import { computed } from 'vue'
import { SFFadeInFromBottomTransition } from '#storefront-ui/components'

type Errors = ErrorObject[] | string[]

const { errors = [] } = defineProps<{
  /** Array of error messages to display. Can be strings or Vuelidate error objects. */
  errors?: Errors
}>()

const isValid = computed(() => !errors.length)

const errorMessages = computed(() => {
  return errors.map((it) => (typeof it === 'string' ? it : it.$message))
})
</script>
