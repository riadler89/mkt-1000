<template>
  <SFButton
    variant="raw"
    class="rounded-md p-2 hover:bg-gray-200"
    data-testid="promotion-header-button"
    :aria-label="
      promotionCount
        ? $t('promotion_slide_in.open_button.active_promotions_title', {
            total: promotionCount,
          })
        : $t('promotion_slide_in.open_button.no_active_promotions_title')
    "
    @click="toggle"
  >
    <template #icon>
      <IconPromotion class="size-6 shrink-0" />
    </template>
    <template v-if="promotionCount">
      <div
        class="min-w-[1ch] content-center text-sm font-semibold leading-none"
      >
        {{ promotionCount }}
      </div>
    </template>
  </SFButton>
</template>

<script setup lang="ts">
import { useSlideIn } from '~~/modules/ui/runtime'
import SFButton from '~~/modules/ui/runtime/components/core/SFButton.vue'

defineProps<{
  promotionCount?: number
}>()

const { toggle } = useSlideIn('PromotionSlideIn')
</script>
