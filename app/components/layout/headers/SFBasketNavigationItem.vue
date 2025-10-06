<template>
  <SFPopover
    :is-open="isOpen && !blockPopup"
    @mouseenter="isOpen = true"
    @mouseleave="isOpen = false"
  >
    <template #action>
      <SFLocalizedLink
        :to="routeList.basket"
        raw
        class="flex h-11 items-center justify-center rounded-md p-2 hover:bg-gray-200"
        data-testid="basket-link"
        :class="{ 'bg-gray-200': isOpen }"
        :aria-label="ariaLabel"
      >
        <IconBasket class="size-6 shrink-0" />
        <span
          class="ml-1 min-w-[1ch] text-sm font-semibold leading-none"
          data-testid="header-basket-count"
        >
          <template v-if="mounted && count">
            {{ count }}
          </template>
        </span>
      </SFLocalizedLink>
    </template>
    <template #content>
      <SFAsyncStatusWrapper :status="status">
        <SFBasketHeadline v-if="count" :count="count" class="px-4 py-2" />
        <SFBasketPopoverItems class="scroll-shadow" :campaign="campaign" />
        <SFBasketPopoverActions v-if="count" />
      </SFAsyncStatusWrapper>
    </template>
  </SFPopover>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMounted } from '@vueuse/core'
import { onBeforeRouteUpdate } from '#app/composables/router'
import { useI18n } from '#i18n'
import { useBasket, useCampaign } from '#storefront/composables'
import SFLocalizedLink from '~/components/SFLocalizedLink.vue'
import { SFPopover } from '~~/modules/ui/runtime/components'
import { routeList } from '~/utils'
import SFAsyncStatusWrapper from '~/components/SFAsyncStatusWrapper.vue'
import SFBasketPopoverItems from '~/components/basket/popover/SFBasketPopoverItems.vue'
import SFBasketPopoverActions from '~/components/basket/popover/SFBasketPopoverActions.vue'
import SFBasketHeadline from '~/components/basket/SFBasketHeadline.vue'

const { count, status } = useBasket()
const mounted = useMounted()

const isOpen = ref(false)
const i18n = useI18n()
const ariaLabel = computed(() =>
  i18n.t('basket_page.a11y.title', mounted.value ? count.value || 0 : 0),
)
const { data: campaign } = useCampaign()

defineProps<{ blockPopup?: boolean }>()

onBeforeRouteUpdate((to, from, next) => {
  isOpen.value = false
  next()
})
</script>
