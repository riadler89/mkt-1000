<template>
  <div
    class="container mt-24 flex flex-col items-center justify-center text-primary"
  >
    <section class="flex flex-col items-center space-y-2">
      <IconLogo class="mb-6 size-24" data-testid="error-page-logo" />

      <div
        v-if="statusCode"
        class="!mb-6 rounded-full bg-accent/10 px-3 py-0.5 text-sm slashed-zero leading-5 text-accent"
        data-testid="error-page-code"
      >
        {{ $t('error.error_code_label') }} {{ statusCode }}
      </div>

      <SFHeadline size="3xl" class="text-center">{{ title }}</SFHeadline>

      <SFHeadline
        class="mt-4 text-center !font-normal leading-5 text-secondary"
        size="lg"
        tag="h2"
      >
        {{ userMessage }}
      </SFHeadline>
    </section>
    <section class="mt-12">
      <SFButton
        variant="tertiary"
        data-testid="error-page-button-continue"
        @click="$emit('clearError')"
      >
        {{ $t('global.continue_shopping') }}
      </SFButton>
    </section>
    <div v-if="isInDevMode" class="mt-12 max-w-full overflow-auto">
      <div>{{ statusCode }} {{ statusMessage }}</div>
      <pre class="font-bold">{{ errorMessage }}</pre>
      <code v-if="stack" v-sanitized-html="stack" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { HttpStatusCode } from '@scayle/storefront-nuxt'
import { useHead } from '#imports'
import type { NuxtError } from '#app'
import { SFButton, SFHeadline } from '#storefront-ui/components'
import { vSanitizedHtml } from '~/directives/sanitized-html'
import { useI18n } from '#i18n'

type AppError =
  | NuxtError
  | Error
  | {
      url: string
      statusCode: number
      statusMessage: string
      message: string
      description: string
      data?: unknown
    }
  | null
  | undefined

const { error } = defineProps<{
  error: AppError
}>()

defineEmits<{ clearError: [] }>()

const { t } = useI18n()

const isNotFoundError =
  error &&
  'statusCode' in error &&
  error?.statusCode === HttpStatusCode.NOT_FOUND

const title = isNotFoundError
  ? t('error.page_not_found_title')
  : t('error.unknown_error_title')

const userMessage = isNotFoundError
  ? t('error.page_not_found_message')
  : t('error.unknown_error_message')

const isInDevMode = import.meta.dev

const statusCode =
  error && 'statusCode' in error ? error?.statusCode : undefined

const statusMessage =
  error instanceof Error ? error?.message : error?.statusMessage

const stack = error && 'stack' in error && error?.stack

const errorMessage = error && 'message' in error && error.message

useHead({ title: title })
</script>
