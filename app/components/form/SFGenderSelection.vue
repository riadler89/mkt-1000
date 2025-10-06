<template>
  <SFDropdown
    id="gender-selection-dropdown"
    v-model="activeGenderValue"
    v-model:visible="isGenderSelectionVisible"
    :items="items"
    :disabled="disabled"
    :has-errors="!isValid"
    :aria-label="$t('form_fields.gender')"
    :button-class="[
      'group transition duration-100 hover:bg-white focus:border-accent focus:!bg-white focus:shadow-none focus:!outline focus:outline-3 focus:outline-offset-0 focus:!border-accent focus:border focus:outline-status-info/50 focus:!text-accent',
      activeGenderValue ? 'bg-white' : '!bg-gray-200 !border-gray-200',
    ]"
    class="h-12 w-full bg-white"
    radius="xl"
    data-testid="gender-selection"
  >
    <span class="pl-0.5 text-md font-normal text-primary">
      {{ activeGenderLabel }}
    </span>
    <label
      class="absolute left-2 top-4 px-2.5 text-md font-normal text-secondary duration-100 ease-linear placeholder-shown:bg-gray-200 group-focus:bg-white group-focus:!text-accent group-focus:shadow-input-label after:group-focus:!text-accent peer-placeholder-shown:translate-y-0 peer-placeholder-shown:text-md peer-placeholder-shown:text-secondary"
      :class="[
        `after:ml-0.5 after:text-secondary after:content-['*']`,
        {
          'ml-1 -translate-y-6 bg-white !px-1.5 text-sm !shadow-input-label':
            activeGenderValue,
          '!text-status-error after:text-status-error group-focus:!text-status-error group-focus:after:!text-status-error':
            !isValid,
        },
      ]"
    >
      {{ $t('form_fields.gender') }}
    </label>
    <template #item="{ item: gender, selectItem: selectGender }">
      <SFButton
        variant="raw"
        :data-testid="`gender-option-${gender}`"
        class="flex w-full cursor-pointer items-center justify-between space-x-2 border-b border-gray-300 p-2 transition-all first-of-type:rounded-t-lg last-of-type:rounded-b-lg last-of-type:border-none hover:bg-gray-300 focus-visible:shadow-inner-solid-sm"
        @click.prevent="selectGender(gender)"
      >
        <div class="flex items-center gap-3">
          <span
            class="size-4 rounded-full border border-secondary bg-white"
            :class="{
              'border-4 !border-accent': gender === activeGenderValue,
            }"
          />
          <span>
            {{ genderMap[gender] }}
          </span>
        </div>
      </SFButton>
    </template>
  </SFDropdown>
</template>

<script setup lang="ts">
import type { Gender } from '@scayle/storefront-nuxt'
import { computed } from 'vue'
import { SFDropdown, SFButton } from '#storefront-ui/components'
import { useI18n } from '#i18n'

defineProps<{ disabled: boolean; isValid: boolean }>()

const isGenderSelectionVisible = defineModel<boolean>('visible', {
  default: false,
})

const activeGenderValue = defineModel<Gender | undefined>()

const { t } = useI18n()

const genderMap = computed<Record<Gender, string>>(() => ({
  m: t('form_fields.gender_options.male'),
  f: t('form_fields.gender_options.female'),
  d: t('form_fields.gender_options.diverse'),
  n: t('form_fields.gender_options.none'),
}))

const items = computed<Gender[]>(() => Object.keys(genderMap.value) as Gender[])

const activeGenderLabel = computed(() => {
  return activeGenderValue.value && genderMap.value[activeGenderValue.value]
})
</script>
