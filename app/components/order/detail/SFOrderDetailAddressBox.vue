<template>
  <SFOrderDetailBox :title="title">
    <div
      v-if="address"
      class="flex flex-col gap-1 text-md font-normal text-secondary"
    >
      <span
        v-for="(formattedAddress, index) in getFormattedLocaleAddresses(
          address,
        )"
        :key="`${formattedAddress}-${index}`"
      >
        {{ formattedAddress }}
      </span>
    </div>
  </SFOrderDetailBox>
</template>

<script setup lang="ts">
import SFOrderDetailBox from './SFOrderDetailBox.vue'
import type { OrderAddress } from '~~/types/order'
import { getFormattedLocaleAddresses } from '~/utils'

const { address, title } = defineProps<{
  address?: OrderAddress
  title: string
}>()
</script>
