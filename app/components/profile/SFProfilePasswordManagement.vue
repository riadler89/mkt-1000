<template>
  <div
    class="flex flex-col items-start gap-1 rounded-xl border border-gray-400 bg-white px-4 py-5 text-secondary"
  >
    <SFHeadline
      class="mb-2 text-primary"
      tag="h3"
      size="lg"
      data-testid="profile-password-headline"
    >
      {{ $t('profile_password_management.title') }}
    </SFHeadline>
    <p class="mb-6 text-md">{{ description }}</p>
    <form
      v-if="v && !isIDPUser"
      ref="passwordUpdateForm"
      class="flex w-full flex-col gap-0.5"
      data-testid="password-update-form"
      @submit.prevent="onSubmit"
    >
      <SFErrorMessageContainer
        data-testid="password-error-message-container"
        :message="errorMessage"
        class="mb-8"
      />
      <!-- https://www.chromium.org/developers/design-documents/create-amazing-password-forms/#use-hidden-fields-for-implicit-information -->
      <label :for="emailFieldId" class="hidden">{{
        $t('form_fields.email')
      }}</label>
      <input
        :id="emailFieldId"
        hidden
        type="text"
        autocomplete="email"
        :value="user?.email"
      />
      <SFValidatedInputGroup
        v-slot="{ isValid }"
        :errors="v.oldPassword.$errors"
      >
        <SFPasswordInput
          v-model="payload.oldPassword"
          :is-valid="isValid"
          :placeholder="$t('form_fields.old_password')"
          autocomplete="current-password"
          data-testid="current-password"
          @input="v.oldPassword.$touch"
        />
      </SFValidatedInputGroup>
      <SFValidatedInputGroup
        v-slot="{ isValid }"
        :errors="v.newPassword.$errors"
        class="h-28"
      >
        <SFPasswordInput
          v-model="payload.newPassword"
          :is-valid="isValid"
          :placeholder="$t('form_fields.new_password')"
          autocomplete="new-password"
          data-testid="new-password"
          @input="v.newPassword.$touch"
        />
      </SFValidatedInputGroup>
      <SFButton
        :loading="isUpdating"
        data-testid="update-password-submit"
        :disabled="v.$error || isUpdating"
        type="submit"
        class="self-start"
      >
        {{ $t('global.save') }}
      </SFButton>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, useId } from 'vue'
import useVuelidate from '@vuelidate/core'
import { FetchError } from 'ofetch'
import SFErrorMessageContainer from '../SFErrorMessageContainer.vue'
import { useToast, useValidationRules } from '~/composables'
import { useUser } from '#storefront/composables'
import {
  SFValidatedInputGroup,
  SFButton,
  SFHeadline,
} from '#storefront-ui/components'
import { useI18n } from '#i18n'
import SFPasswordInput from '~/components/form/SFPasswordInput.vue'
import { PASSWORD_MIN_LENGTH } from '~~/shared/constants/password'

const { updatePassword, user } = useUser()
const { t } = useI18n()
const validationRules = useValidationRules()

const toast = useToast()

const initPayload = () => ({
  oldPassword: '',
  newPassword: '',
})

// Using `reactive` instead of `ref` for forms with multiple inputs.
// While both `ref` and `reactive` can achieve reactivity with objects, `reactive`
// is specifically optimized for managing collections of reactive properties,
// making it a more natural and efficient choice for complex forms.
const payload = reactive(initPayload())
const isUpdating = ref(false)
const errorMessage = ref<string | undefined>(undefined)

const isIDPUser = computed(
  () => user.value?.authentication?.type !== 'password',
)

const emailFieldId = computed(() => `email-input-${useId()}`)

const description = computed(() => {
  return isIDPUser.value
    ? t('profile_password_management.idp_description')
    : t('profile_password_management.description')
})

const rules = computed(() => ({
  oldPassword: {
    required: validationRules.required,
  },
  newPassword: {
    required: validationRules.required,
    password: validationRules.password,
    minLength: validationRules.minLength(PASSWORD_MIN_LENGTH),
  },
}))

const v = useVuelidate(rules.value, payload)

const onSubmit = async () => {
  const isValid = await v.value.$validate()
  if (!isValid) {
    return
  }
  isUpdating.value = true

  try {
    await updatePassword(payload)
    resetForm()

    toast.show(t('profile_password_management.success_message'), {
      type: 'SUCCESS',
      action: 'CONFIRM',
    })
  } catch (error) {
    handleError(error)
  } finally {
    isUpdating.value = false
  }
}

const handleError = (error: unknown) => {
  if (!(error instanceof FetchError)) {
    return
  }

  const status = error.response?.status

  if (status) {
    switch (status) {
      case 400:
        errorMessage.value = t(
          'profile_password_management.error.400_bad_request',
        )
        break
      case 401:
        errorMessage.value = t(
          'profile_password_management.error.401_unauthorized',
        )
        break
      case 403:
        errorMessage.value = t(
          'profile_password_management.error.403_forbidden',
        )
        break
      default:
        errorMessage.value = undefined
        break
    }
  }
}

const resetForm = () => {
  Object.assign(payload, initPayload())
  errorMessage.value = undefined
  v.value.$reset()
}
</script>
