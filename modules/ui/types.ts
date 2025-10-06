import type TailwindTransitionDuration from '#tailwind-config/theme/transitionDuration'

export type TransitionDuration =
  Exclude<
    keyof typeof TailwindTransitionDuration,
    'DEFAULT'
  > extends `${infer N extends number}`
    ? N
    : never
