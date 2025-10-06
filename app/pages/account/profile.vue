<template>
  <SFAsyncStatusWrapper :status="status">
    <template v-if="user">
      <SFHeadline class="mb-6" tag="h2" data-testid="user-profile-headline">
        {{ $t('profile_page.title') }}
      </SFHeadline>
      <div class="mb-6 flex flex-col gap-2 text-md text-secondary">
        <span class="font-semibold">
          {{ $t('profile_page.greeting', { firstName: user.firstName }) }}
        </span>
        <p>
          {{ $t('profile_page.description') }}
        </p>
      </div>
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <SFProfileAccountInformation :user="user" class="col-span-full" />
        <SFProfilePersonalInformation />
        <SFProfilePasswordManagement />
      </div>
    </template>
    <template #loading>
      <SFProfileSkeletonLoader />
    </template>
  </SFAsyncStatusWrapper>
</template>

<script setup lang="ts">
import { useSeoMeta, definePageMeta } from '#imports'
import { useUser } from '#storefront/composables'
import { useI18n } from '#i18n'
import { SFHeadline } from '#storefront-ui/components'
import SFAsyncStatusWrapper from '~/components/SFAsyncStatusWrapper.vue'
import SFProfileSkeletonLoader from '~/components/profile/SFProfileSkeletonLoader.vue'
import SFProfileAccountInformation from '~/components/profile/SFProfileAccountInformation.vue'
import SFProfilePersonalInformation from '~/components/profile/SFProfilePersonalInformation.vue'
import SFProfilePasswordManagement from '~/components/profile/SFProfilePasswordManagement.vue'

const { t } = useI18n()

const { status, user } = useUser()

useSeoMeta({
  robots: 'noindex, nofollow',
  title: t('profile_page.meta.title'),
  description: t('profile_page.meta.description'),
})

defineOptions({ name: 'UserAccountDetailsPage' })
definePageMeta({ pageType: 'account_area:user' })
</script>
