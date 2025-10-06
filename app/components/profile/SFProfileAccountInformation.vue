<template>
  <div
    class="flex flex-col items-start gap-1 rounded-xl border border-gray-400 bg-white px-4 py-5 text-secondary"
  >
    <SFHeadline
      class="mb-2 text-primary"
      tag="h3"
      size="lg"
      data-testid="profile-account-information-headline"
    >
      {{ $t('profile_account_information.title') }}
    </SFHeadline>
    <div class="text-md">
      <span class="font-semibold">
        {{ $t('profile_account_information.customer_number') }}
      </span>
      {{ user.id }}
    </div>
    <div class="text-md">
      <span class="font-semibold">
        {{ $t('profile_account_information.email') }}
      </span>
      {{ user.email }}
    </div>
    <div
      class="mt-3 flex w-full items-center justify-between rounded-lg bg-gray-200 px-3 py-4.5"
    >
      <span class="flex-1 text-sm">
        {{ $t('profile_account_information.disclaimer') }}
      </span>
      <IconInfoOutlineSquare class="size-3" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ShopUser } from '@scayle/storefront-nuxt'
import { SFHeadline } from '#storefront-ui/components'

defineProps<{ user: ShopUser }>()
</script>
