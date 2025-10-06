import type { ValuesType } from 'utility-types'

/* intentionally naming the variables the same as the type */
export const Size = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl',
} as const

export type Size = ValuesType<typeof Size>
export const HeadlineSize = {
  '3XL': '3xl',
  '2XL': '2xl',
  XL: 'xl',
  LG: 'lg',
  MD: 'md',
  SM: 'sm',
} as const

export type HeadlineSize = ValuesType<typeof HeadlineSize>

export const HeadlineTag = {
  H1: 'h1',
  H2: 'h2',
  H3: 'h3',
  H4: 'h4',
  H5: 'h5',
  H6: 'h6',
  P: 'p',
  DIV: 'div',
  SPAN: 'span',
} as const

export type HeadlineTag = ValuesType<typeof HeadlineTag>

export const SkeletonType = {
  BUTTON: 'button',
  HEADLINE: 'headline',
  CUSTOM: 'custom',
} as const

export type SkeletonType = ValuesType<typeof SkeletonType>

export const LinkVariant = {
  LOUD: 'loud',
  NORMAL: 'normal',
  WHISPER: 'whisper',
  QUIET: 'quiet',
} as const

export type LinkVariant = ValuesType<typeof LinkVariant>

export const ButtonVariant = {
  PRIMARY: 'primary',
  SECONDARY: 'secondary',
  TERTIARY: 'tertiary',
  RAW: 'raw',
  ACCENT: 'accent',
  SLIDER: 'slider',
} as const

export type ButtonVariant = ValuesType<typeof ButtonVariant>

export const DividerItemTag = {
  LINK: 'SFLink',
  NUXT_LINK: 'NuxtLink',
  PARAGRAPH: 'p',
} as const

export type DividerItemTag = ValuesType<typeof DividerItemTag>

export const ProgressType = {
  SUCCESS: 'success',
  WARN: 'warn',
  DANGER: 'danger',
  NEUTRAL: 'neutral',
} as const

export type ProgressType = ValuesType<typeof ProgressType>

export const ColorChipRoundedType = {
  DEFAULT: 'default',
  SM: 'sm',
  MD: 'md',
} as const

export type ColorChipRoundedType = ValuesType<typeof ColorChipRoundedType>
