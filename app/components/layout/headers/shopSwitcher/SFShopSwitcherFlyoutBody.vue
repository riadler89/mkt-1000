<template>
  <div class="flex flex-col overflow-hidden p-5 lg:w-96">
    <div v-if="availableLanguages.length > 1" ref="languageList" class="mb-5">
      <div class="mb-4 text-md font-semibold">
        {{ $t('shop_selector.choose_language') }}
      </div>
      <div class="grid grid-cols-2 gap-5">
        <SFButton
          v-for="{ shop, code, name } in availableLanguages"
          :key="shop.shopId"
          :variant="code === currentLocale?.language ? 'accent' : 'secondary'"
          @click="switchShopAndClose(shop.path, shop.locale)"
        >
          {{ name }}
        </SFButton>
      </div>
    </div>
    <div
      v-if="availableCountries.length > 1"
      ref="countryList"
      class="flex flex-col overflow-hidden"
    >
      <div class="mb-4 text-md font-semibold">
        {{ $t('shop_selector.choose_country') }}
      </div>
      <div class="grid grid-cols-1 gap-2 overflow-auto p-1">
        <SFButton
          v-for="country in availableCountries"
          :key="country.shops[0]?.shopId"
          variant="secondary"
          class="!justify-start"
          :data-testid="
            country.code === currentLocale?.region
              ? 'shop-selector-current-country'
              : 'shop-selector-country'
          "
          @click="
            switchShopAndClose(country.shops[0].path, country.shops[0].locale)
          "
        >
          <span
            :class="{ 'font-bold': country.code === currentLocale?.region }"
            >{{ country.name }}</span
          >
          <template #append-icon>
            <IconCheck
              v-if="country.code === currentLocale?.region"
              class="ml-auto size-4 text-accent"
            />
          </template>
        </SFButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useSlideIn } from '#storefront-ui/composables'
import { SFButton } from '#storefront-ui/components'
import { useShopSwitcher } from '~/composables/useShopSwitcher'
import { useCurrentShopLocale } from '~/composables/useCurrentShopLocale'

const { close } = useSlideIn('ShopSwitcherSlideIn')

const currentLocale = useCurrentShopLocale()

const { switchToHomePage = true } = defineProps<{
  switchToHomePage?: boolean
}>()

const { availableCountries, availableLanguages, changeShop } =
  useShopSwitcher(switchToHomePage)

const switchShopAndClose = (path?: string, locale?: string) => {
  changeShop(path, locale)
  close()
}
</script>
