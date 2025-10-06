<template>
  <SFModal :visible="visible" @close="onCancel()">
    <div class="flex flex-col justify-center gap-4 py-12">
      <div class="mx-auto" data-testid="headline">
        {{ $t('basket_card.remove_from_basket_confirmation') }}
      </div>
      <div class="mt-4 flex w-full justify-center gap-4 max-sm:flex-col">
        <SFButton
          data-testid="basket-remove-item-confirm-button"
          @click="onConfirm()"
        >
          {{ $t('basket_card.confirm_removal') }}
        </SFButton>
        <SFButton
          variant="secondary"
          data-testid="basket-remove-item-cancel-button"
          @click="onCancel()"
        >
          {{ $t('global.cancel') }}
        </SFButton>
      </div>
    </div>
  </SFModal>
</template>

<script setup lang="ts">
import { SFModal, SFButton } from '#storefront-ui/components'

const visible = defineModel<boolean>('visible')
defineProps<{
  onConfirm: () => void
  onCancel: () => void
}>()
</script>
