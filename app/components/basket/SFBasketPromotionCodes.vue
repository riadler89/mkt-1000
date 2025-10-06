<template>
  <div class="mt-4 flex flex-col gap-5">
    <SFHeadline tag="h3" size="md" class="!font-semibold">{{
      $t('basket_promotion_codes.headline')
    }}</SFHeadline>
    <SFTextInput
      v-model="currentCode"
      :placeholder="$t('basket_promotion_codes.input_placeholder')"
      :aria-label="$t('basket_promotion_codes.input_label')"
      @keydown.enter="enterPromotionCode"
    >
      <template #append-icon>
        <SFButton
          type="button"
          variant="raw"
          class="size-full rounded-md !text-accent"
          data-testid="promotion-code-add"
          :aria-label="$t('basket_promotion_codes.add_code')"
          @click.prevent="enterPromotionCode"
        >
          <IconPlus class="size-5" />
        </SFButton>
      </template>
    </SFTextInput>
    <div class="-mt-2 flex flex-wrap gap-2 font-semibold">
      <div
        v-for="({ promotion }, promotionCode) in appliedPromotionCodes"
        :key="promotionCode"
        variant="raw"
        :style="getPromotionStyle(promotion)"
        class="flex items-center gap-2 overflow-hidden rounded-md px-3 py-1 text-sm leading-5"
      >
        <span :title="promotionCode" class="overflow-hidden text-ellipsis">{{
          promotionCode
        }}</span>
        <SFButton
          variant="raw"
          :aria-label="
            $t('basket_promotion_codes.remove_code', { promotionCode })
          "
          class="flex shrink-0"
          @click="removePromotionCode(promotion.id)"
        >
          <IconClose
            class="size-3"
            :style="{ color: getPromotionStyle(promotion).color }"
          />
        </SFButton>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useBasket } from '#storefront/composables'
import { useApplyPromotions } from '#storefront-promotions/composables/useApplyPromotions'
import { useAppliedPromotionCodes } from '#storefront-promotions/composables/useAppliedPromotionCodes'
import { SFButton, SFTextInput, SFHeadline } from '#storefront-ui/components'
import { getPromotionStyle } from '~/utils'
import { useToast } from '~/composables'
import { useI18n } from '#i18n'

const currentCode = ref('')

const toast = useToast()
const { t } = useI18n()

const { data: basketData, getApplicablePromotionsByCode } = useBasket()
const { applyPromotions, removePromotionById } = useApplyPromotions({
  basket: basketData,
})
const appliedPromotionCodes = useAppliedPromotionCodes(basketData)

const enterPromotionCode = async () => {
  try {
    await applyPromotions(
      await getApplicablePromotionsByCode(currentCode.value),
    )
    currentCode.value = ''
    toast.show(t('basket_promotion_codes.add_success'), { type: 'SUCCESS' })
  } catch {
    currentCode.value = ''
    toast.show(t('basket_promotion_codes.add_error'), { type: 'ERROR' })
  }
}

const removePromotionCode = async (promotionId: string) => {
  const results = Object.values(await removePromotionById(promotionId))
  if (results.some((result) => result === false)) {
    toast.show(t('basket_promotion_codes.remove_error'), { type: 'ERROR' })
  }
}
</script>
